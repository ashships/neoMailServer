import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash, randomBytes } from 'node:crypto';
import { build } from 'esbuild';
import { Miniflare } from 'miniflare';
const token=randomBytes(32).toString('base64url');
const sha=value=>createHash('sha256').update(value).digest('hex');

test('Worker + real local D1: access, sessions, CSRF, settings, dispatch and webhook isolation',async(t)=>{
 const dir=await mkdtemp(join(tmpdir(),'neomail-test-'));
 await build({entryPoints:['src/index.js'],bundle:true,format:'esm',platform:'browser',outfile:join(dir,'worker.mjs')});
 let upstreamCalls=0; let upstreamStatus=200;
 const mf=new Miniflare({modules:true,script:await readFile(join(dir,'worker.mjs'),'utf8'),compatibilityDate:'2025-07-18',d1Databases:['DB'],
  bindings:{LOCAL_DEV:'true',ADMIN_TOKEN_HASH:sha(token),CONFIG_ENCRYPTION_KEY:randomBytes(32).toString('base64'),API_SECRET_KEY:'a'.repeat(43),RESEND_API_KEY:'provider-key-placeholder',DEFAULT_SENDER:'no-reply@mail.neopathshala.com'},
  outboundService:async request=>{upstreamCalls++; assert.equal(new URL(request.url).hostname,'api.resend.com'); if(upstreamStatus===500)return new Response('{}',{status:500}); return Response.json({id:'msg-'+upstreamCalls});},
 });
 try {
 const db=await mf.getD1Database('DB');
 const schema=await readFile('schema.sql','utf8');
 // D1 exec in Miniflare expects one statement per line.
 await db.exec(schema.replace(/--[^\n]*/g,'').split(';').map(s=>s.replace(/\s+/g,' ').trim()).filter(Boolean).join(';\n')+';');
 const req=(path,opts={})=>mf.dispatchFetch('http://localhost'+path,{redirect:'manual',...opts});
 const res=await req('/admin'); assert.equal(res.status,303); assert.equal(res.headers.get('location'),'/admin/login');
 assert.equal((await mf.dispatchFetch('https://public.example/admin')).status,503);
 let result=await req('/admin/login',{method:'POST',headers:{origin:'http://localhost','content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({admin_token:token})});
 assert.equal(result.status,303); const cookie=result.headers.get('set-cookie').split(';')[0];
 assert.match(cookie,/^__Host-neomail=/); assert.match(result.headers.get('set-cookie'),/Secure; SameSite=Strict/);
 const panel=await (await req('/admin?view=settings',{headers:{cookie}})).text();
 assert.ok(panel.includes('Workspace settings')); assert.ok(!panel.includes('a'.repeat(43)));
 const csrf=panel.match(/name="csrf" value="([^"]+)"/)[1];
 const post=(path,data,extra={})=>req(path,{method:'POST',headers:{cookie,origin:'http://localhost','content-type':'application/x-www-form-urlencoded',...extra},body:new URLSearchParams({csrf,...data})});
 for(const view of ['overview','mail','providers','identities','security','setup','compose']) {
  const page=await req('/admin?view='+view,{headers:{cookie}}); assert.equal(page.status,200,view); assert.match(page.headers.get('content-security-policy'),/script-src 'none'/);
 }
 assert.equal((await req('/admin/logout',{headers:{cookie}})).status,405);
 assert.equal((await post('/admin/identities/create',{email_address:'bad\r\n@example.com',display_name:'Bad'})).status,422);
 assert.equal((await post('/admin/identities/create',{email_address:'support@example.com',display_name:'Support'},{origin:'https://evil.example'})).status,403);
 assert.equal((await post('/admin/identities/create',{csrf:'wrong',email_address:'support@example.com',display_name:'Support'})).status,403);
 assert.equal((await post('/admin/identities/create',{email_address:'support@example.com',display_name:'Support'})).status,303);
 assert.equal((await post('/admin/settings',{DEFAULT_SENDER:'no-reply@mail.neopathshala.com',RETENTION_DAYS:'7',REQUEST_TIMEOUT_MS:'0'})).status,422);
 assert.equal(await db.prepare("SELECT value FROM app_settings WHERE name='RETENTION_DAYS'").first(),null,'invalid save must be atomic');
 assert.equal((await post('/admin/credentials',{name:'BREVO_API_KEY',value:'secret-provider-key-placeholder',admin_token:token})).status,303);
 const stored=await db.prepare("SELECT value FROM app_settings WHERE name='BREVO_API_KEY'").first(); assert.ok(!stored.value.includes('secret-provider'));
 assert.equal((await post('/admin/settings',{DEFAULT_SENDER:'no-reply@mail.neopathshala.com',FALLBACK_ORDER:'resend',STORE_MESSAGE_BODIES:'true'})).status,303);
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
 const message=await db.prepare("SELECT * FROM email_logs WHERE provider_message_id='msg-1'").first();
 const preview=await req('/admin/preview?id='+message.id,{headers:{cookie}}); assert.equal(preview.status,200); assert.match(preview.headers.get('content-security-policy'),/sandbox; default-src 'none'/); assert.match(preview.headers.get('content-security-policy'),/img-src data:/);
 assert.equal((await req('/admin?view=mail&search=Hello%25',{headers:{cookie}})).status,200);
 assert.equal((await post('/admin/logout',{})).status,303); assert.equal((await req('/admin',{headers:{cookie}})).status,303);
 assert.equal(await db.prepare('SELECT COUNT(*) AS count FROM admin_sessions').first('count'),0);
 await t.test('rate counter is atomic under concurrent requests',async()=>{
  const decisions=await Promise.all(Array.from({length:20},()=>db.prepare("INSERT INTO rate_limits(bucket_key,count,expires_at) VALUES ('concurrent',1,9999999999) ON CONFLICT(bucket_key) DO UPDATE SET count=count+1 WHERE count<5 RETURNING count").first()));
  assert.equal(decisions.filter(Boolean).length,5);
 });
 } finally { await mf.dispose(); await rm(dir,{recursive:true,force:true}); }
});
