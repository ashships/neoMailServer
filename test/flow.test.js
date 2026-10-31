import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash, randomBytes } from 'node:crypto';
import worker from '../src/index.js';
import { database } from './local-db.js';
import { verifyWebhook, applyWebhook } from '../src/providers.js';
import { hmac, base64, rate, access } from '../src/security.js';

const token=randomBytes(32).toString('base64url');
const sha=value=>createHash('sha256').update(value).digest('hex');

test('Worker request flow with SQLite: sessions, CSRF, settings, dispatch and webhook isolation',async(t)=>{
 const db=database(await readFile('schema.sql','utf8'));
 const env={DB:db,LOCAL_DEV:'true',ADMIN_TOKEN_HASH:sha(token),CONFIG_ENCRYPTION_KEY:randomBytes(32).toString('base64'),API_SECRET_KEY:'a'.repeat(43),RESEND_API_KEY:'provider-key-placeholder',DEFAULT_SENDER:'no-reply@example.com'};
 let upstreamCalls=0, upstreamStatus=200;
 const originalFetch=globalThis.fetch;
 globalThis.fetch=async (url,opts)=>{upstreamCalls++; assert.ok(['api.resend.com','api.mailgun.net'].includes(new URL(url).hostname)); if(upstreamStatus===500)return new Response('{}',{status:500}); return Response.json({id:'msg-'+upstreamCalls});};
 const mf={dispatchFetch:(url,opts)=>worker.fetch(new Request(url,opts),env)};
 try {
 const req=(path,opts={})=>mf.dispatchFetch('http://localhost'+path,opts);
 const res=await req('/admin'); assert.equal(res.status,303); assert.equal(res.headers.get('location'),'/admin/login');
 assert.equal((await mf.dispatchFetch('https://public.example/admin')).status,503);
 let result=await req('/admin/login',{method:'POST',headers:{origin:'http://localhost','content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({admin_token:token})});
 assert.equal(result.status,303); const cookie=result.headers.get('set-cookie').split(';')[0];
 assert.match(cookie,/^__Host-neomail=/); assert.match(result.headers.get('set-cookie'),/Secure; SameSite=Strict/);
 const panel=await (await req('/admin?view=settings',{headers:{cookie}})).text();
 assert.ok(panel.includes('Workspace settings')); assert.ok(!panel.includes('a'.repeat(43)));
 const csrf=panel.match(/name="csrf" value="([^"]+)"/)[1];
 const post=(path,data,extra={})=>req(path,{method:'POST',headers:{cookie,origin:'http://localhost','content-type':'application/x-www-form-urlencoded',...extra},body:new URLSearchParams({csrf,...data})});
 assert.equal((await post('/admin/domains/create',{domain:'example.com',display_name:'Example'})).status,303);
 await db.prepare('UPDATE managed_domains SET is_verified=1 WHERE domain=?').bind('example.com').run();
 for(const view of ['overview','mail','providers','identities','security','setup','compose']) {
  const page=await req('/admin?view='+view,{headers:{cookie}}); assert.equal(page.status,200,view); assert.match(page.headers.get('content-security-policy'),/script-src 'none'/);
 }
 assert.equal((await req('/admin/logout',{headers:{cookie}})).status,405);
 assert.equal((await post('/admin/identities/create',{email_address:'bad\r\n@example.com',display_name:'Bad'})).status,422);
 assert.equal((await post('/admin/identities/create',{email_address:'support@example.com',display_name:'Support'},{origin:'https://evil.example'})).status,403);
 assert.equal((await post('/admin/identities/create',{csrf:'wrong',email_address:'support@example.com',display_name:'Support'})).status,403);
 assert.equal((await post('/admin/identities/create',{email_address:'support@example.com',display_name:'Support'})).status,303);
 assert.equal((await post('/admin/identities/update',{email_address:'support@example.com',action:'rename',display_name:'New Support Name'})).status,303);
 assert.equal(await db.prepare('SELECT display_name FROM sender_identities WHERE email_address=?').bind('support@example.com').first('display_name'),'New Support Name');
 assert.equal((await post('/admin/settings',{DEFAULT_SENDER:'no-reply@example.com',RETENTION_DAYS:'7',REQUEST_TIMEOUT_MS:'0'})).status,422);
 assert.equal(await db.prepare("SELECT value FROM app_settings WHERE name='RETENTION_DAYS'").first(),null,'invalid save must be atomic');
 assert.equal((await post('/admin/credentials',{name:'BREVO_API_KEY',value:'secret-provider-key-placeholder',admin_token:token})).status,303);
 const stored=await db.prepare("SELECT value FROM app_settings WHERE name='BREVO_API_KEY'").first(); assert.ok(!stored.value.includes('secret-provider'));
 assert.equal((await post('/admin/settings',{DEFAULT_SENDER:'support@example.com',FALLBACK_ORDER:'resend',STORE_MESSAGE_BODIES:'true'})).status,303);
 const payload={to:'student@example.com',subject:'Welcome',text:'Hello student'};
 const send=(key,body=payload,auth='a'.repeat(43))=>req('/api/v1/send',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+auth,'idempotency-key':key},body:JSON.stringify(body)});
 assert.equal((await send('test-mail-1',payload,token)).status,401,'admin credential must never authorize API');
 assert.equal((await send('test-mail-1')).status,200); assert.equal(upstreamCalls,1);
 const repeat=await send('test-mail-1'); assert.equal(repeat.status,200); assert.equal((await repeat.json()).replayed,true); assert.equal(upstreamCalls,1);
 assert.equal((await send('test-mail-1',{...payload,subject:'Changed'})).status,409); assert.equal(upstreamCalls,1);
 assert.equal((await send('test-mail-2',{...payload,from:'attacker@example.com'})).status,422);
 assert.equal((await send('test-mail-2',{...payload,html:{bad:true}})).status,422);
 upstreamStatus=500;
 const uncertain=await send('test-uncertain-1'); assert.equal(uncertain.status,202); assert.equal((await uncertain.json()).uncertain,true); assert.equal(upstreamCalls,2);
 await send('test-uncertain-1'); assert.equal(upstreamCalls,2,'uncertain outcome must not be resent');
 assert.equal((await req('/webhooks/generic',{method:'POST',body:'{}'})).status,404);
 assert.equal((await req('/webhooks/resend',{method:'POST',body:'{}'})).status,403);
 await t.test('signed webhooks: replay protection, provider isolation and non-regressing statuses',async()=>{
  const signingKey=randomBytes(32).toString('base64');
  const webhookEnv={...env,RESEND_WEBHOOK_SECRET:'whsec_'+signingKey};
  async function event(id,type,messageId='msg-1') {
   const raw=JSON.stringify({type,data:{email_id:messageId}}), timestamp=String(Math.floor(Date.now()/1000));
   const signature=base64(await hmac(signingKey,`${id}.${timestamp}.${raw}`,true));
   return verifyWebhook('resend',new Request('https://mail.example/webhooks/resend',{headers:{'svix-id':id,'svix-timestamp':timestamp,'svix-signature':'v1,'+signature}}),raw,webhookEnv);
  }
  const delivered=await event('event-delivered','email.delivered');
  await applyWebhook(env,'mailgun',delivered);
  assert.equal(await db.prepare("SELECT transmission_status FROM email_logs WHERE provider_message_id='msg-1'").first('transmission_status'),'Sent','another provider must not update the message');
  const realDelivered=await event('event-delivered-2','email.delivered'); await applyWebhook(env,'resend',realDelivered); await applyWebhook(env,'resend',realDelivered);
  assert.equal(await db.prepare("SELECT transmission_status FROM email_logs WHERE provider_message_id='msg-1'").first('transmission_status'),'Delivered');
  await applyWebhook(env,'resend',await event('event-late-sent','email.sent'));
  assert.equal(await db.prepare("SELECT transmission_status FROM email_logs WHERE provider_message_id='msg-1'").first('transmission_status'),'Delivered');
  await applyWebhook(env,'resend',await event('event-bounce','email.bounced'));
  assert.equal(await db.prepare("SELECT transmission_status FROM email_logs WHERE provider_message_id='msg-1'").first('transmission_status'),'Bounced');
  assert.equal(await event('event-opened','email.opened'),null);
 });
 const message=await db.prepare("SELECT * FROM email_logs WHERE provider_message_id='msg-1'").first();
 const preview=await req('/admin/preview?id='+message.id,{headers:{cookie}}); assert.equal(preview.status,200); assert.match(preview.headers.get('content-security-policy'),/sandbox; default-src 'none'/); assert.match(preview.headers.get('content-security-policy'),/img-src data:/);
 assert.equal((await req('/admin?view=mail&search=Hello%25',{headers:{cookie}})).status,200);
 await t.test('sandbox test isolates Mailgun without changing normal provider order',async()=>{
  upstreamStatus=200;
  assert.equal((await post('/admin/credentials',{name:'MAILGUN_API_KEY',value:'mailgun-test-credential-123456',admin_token:token})).status,303);
  assert.equal((await post('/admin/settings',{DEFAULT_SENDER:'support@example.com',MAILGUN_DOMAIN:'',MAILGUN_SANDBOX_DOMAIN:'sandbox123.mailgun.org'})).status,303);
  assert.ok(await db.prepare('SELECT * FROM sender_identities WHERE email_address=?').bind('postmaster@sandbox123.mailgun.org').first());
  const result=await post('/admin/send-test',{delivery_mode:'mailgun-sandbox',idempotency_key:'sandbox-mode-test-1',to:'student@example.com',subject:'Sandbox',text:'Test'});assert.equal(result.status,303);assert.ok(result.headers.get('location').includes('accepted%20by%20mailgun'));
  assert.equal(await db.prepare("SELECT value FROM app_settings WHERE name='FALLBACK_ORDER'").first('value'),'resend');
 });
 assert.equal((await post('/admin/logout',{})).status,303); assert.equal((await req('/admin',{headers:{cookie}})).status,303);
 assert.equal(await db.prepare('SELECT COUNT(*) AS count FROM admin_sessions').first('count'),0);
 await t.test('rate counter is atomic under concurrent requests',async()=>{
  const decisions=await Promise.all(Array.from({length:20},()=>db.prepare("INSERT INTO rate_limits(bucket_key,count,expires_at) VALUES ('concurrent',1,9999999999) ON CONFLICT(bucket_key) DO UPDATE SET count=count+1 WHERE count<5 RETURNING count").first()));
  assert.equal(decisions.filter(Boolean).length,5);
 });
 } finally { globalThis.fetch=originalFetch; db.close(); }
});
