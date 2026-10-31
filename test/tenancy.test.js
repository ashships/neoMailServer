import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash, randomBytes } from 'node:crypto';
import worker from '../src/index.js';
import { database } from './local-db.js';

const token = randomBytes(32).toString('base64url');
const sha = value => createHash('sha256').update(value).digest('hex');

test('tenant isolation: admin workspaces are fully separated and sandbox capabilities stay superadmin-only', async t => {
  const db = database(await readFile('schema.sql','utf8'));
  const baseEnv = {
    DB: db, LOCAL_DEV: 'true', LOCAL_ADMIN_TOKEN: token, CONFIG_ENCRYPTION_KEY: randomBytes(32).toString('base64'),
    RESEND_API_KEY: 'provider-key-placeholder', DEFAULT_SENDER: 'no-reply@example.com',
  };
  let upstreamCalls = 0;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    const host = new URL(url).hostname;
    if (host === 'cloudflare-dns.com') {
      const domain = new URL(url).searchParams.get('name').replace('_neomail-verification.','');
      const row = await db.prepare('SELECT verification_token FROM managed_domains WHERE domain=?').bind(domain).first();
      return Response.json({ Answer: row ? [{ data: '"' + row.verification_token + '"' }] : [] });
    }
    assert.equal(host, 'api.resend.com');
    upstreamCalls++;
    return Response.json({ id: 'msg-' + upstreamCalls });
  };
  const call=(subject,path,opts={})=>worker.fetch(new Request('http://localhost'+path,opts),{...baseEnv,LOCAL_DEV_SUBJECT:subject});
  try {
    await db.prepare("INSERT INTO admin_users (subject,role,is_active,created_at,created_by) VALUES ('local-admin','superadmin',1,unixepoch(),'bootstrap'),('tenant1@example.com','admin',1,unixepoch(),'local-admin'),('tenant2@example.com','admin',1,unixepoch(),'local-admin')").run();
    const login=async subject=>{
      const res=await call(subject,'/admin/login',{method:'POST',headers:{origin:'http://localhost','content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({admin_token:token})});
      assert.equal(res.status,303,subject); return res.headers.get('set-cookie').split(';')[0];
    };
    const csrf=subject=>db.prepare('SELECT csrf_token FROM admin_sessions WHERE access_subject=?').bind(subject).first('csrf_token');
    const post=async(subject,cookie,path,data,extra={})=>call(subject,path,{method:'POST',headers:{cookie,origin:'http://localhost','content-type':'application/x-www-form-urlencoded',...extra},body:new URLSearchParams({csrf:await csrf(subject),...data})});
    const cookie1=await login('tenant1@example.com'), cookie2=await login('tenant2@example.com');

    // --- domains: each tenant registers and verifies only its own domain ---
    const create=await post('tenant1@example.com',cookie1,'/admin/domains/create',{domain:'client1.test',display_name:'Tenant One'});
    assert.equal(create.status,303);
    const verify=await post('tenant1@example.com',cookie1,'/admin/domains/verify',{domain:'client1.test'});
    assert.equal(verify.status,303); assert.ok(verify.headers.get('location').includes('verified'),'DNS TXT verification should succeed with mocked DNS');
    const addD2=await post('tenant2@example.com',cookie2,'/admin/domains/create',{domain:'client2.test',display_name:'Tenant Two'});
    assert.equal(addD2.status,303);
    await db.prepare('UPDATE managed_domains SET is_verified=1 WHERE domain=?').bind('client2.test').run();

    // Verifying another tenant's domain is forbidden even with the right DNS content.
    assert.equal((await post('tenant2@example.com',cookie2,'/admin/domains/verify',{domain:'client1.test'})).status,404);

    // --- identities: only on owned verified domains ---
    assert.equal((await post('tenant1@example.com',cookie1,'/admin/identities/create',{email_address:'support@client1.test',display_name:'T1 Support'})).status,303);
    assert.equal((await post('tenant1@example.com',cookie1,'/admin/identities/create',{email_address:'cross@client2.test',display_name:'Bad'})).status,422,'foreign verified domain must be rejected');
    assert.equal((await post('tenant1@example.com',cookie1,'/admin/identities/create',{email_address:'x@unverified.test',display_name:'Bad'})).status,422,'unregistered domain must be rejected');
    assert.equal((await post('tenant2@example.com',cookie2,'/admin/identities/create',{email_address:'support@client2.test',display_name:'T2 Support'})).status,303);

    // Cross-tenant identity mutation is rejected; own mutation succeeds.
    assert.equal((await post('tenant1@example.com',cookie1,'/admin/identities/update',{email_address:'support@client2.test',action:'rename',display_name:'Hijacked'})).status,403);
    assert.equal(await db.prepare('SELECT display_name FROM sender_identities WHERE email_address=?').bind('support@client2.test').first('display_name'),'T2 Support');

    // Tenant "set default" only flips its own identities and never the global DEFAULT_SENDER.
    assert.equal((await post('tenant2@example.com',cookie2,'/admin/identities/update',{email_address:'support@client2.test',action:'default'})).status,303);
    assert.equal(await db.prepare('SELECT is_default FROM sender_identities WHERE email_address=?').bind('support@client1.test').first('is_default'),0);
    assert.equal(await db.prepare("SELECT COUNT(*) AS n FROM app_settings WHERE name='DEFAULT_SENDER'").first('n'),0,'tenant default actions must not write global settings');

    // --- superadmin-only endpoints are unreachable for tenants ---
    for (const [path,data] of [['/admin/settings',{DEFAULT_SENDER:'support@client1.test',RETENTION_DAYS:'90'}],['/admin/credentials',{name:'RESEND_API_KEY',value:'stolen-credential-12345678'}],['/admin/providers/toggle',{provider:'smtp'}],['/admin/users/add',{subject:'intruder@example.com',role:'admin'}],['/admin/docs/save',{content:'hacked'}]]) {
      const res=await post('tenant1@example.com',cookie1,path,data);
      assert.equal(res.headers.get('location'),'/dashboard',path+' must redirect tenants away');
    }
    assert.equal(await db.prepare("SELECT COUNT(*) AS n FROM app_settings WHERE name='RETENTION_DAYS'").first('n'),0,'tenant must not change global settings');
    assert.equal(await db.prepare("SELECT role FROM admin_users WHERE subject='intruder@example.com'").first('role'),null,'tenant must not create administrator accounts');
    for (const view of ['users','providers','docs','security','setup']) {
      const res=await call('tenant1@example.com','/admin?view='+view,{headers:{cookie:cookie1}});
      assert.equal(res.headers.get('location'),'/dashboard?view='+view,view+' view must be superadmin-only');
    }

    // --- API send isolation: keys send from owned identities only ---
    const apiSend=()=>t;
    const createClient=async(subject,cookie)=>{
      const res=await post(subject,cookie,'/admin/api-clients/create',{name:'backend-'+subject});
      const key=decodeURIComponent(res.headers.get('location').match(/created_key=([^&]+)/)[1]);
      return key;
    };
    const key1=await createClient('tenant1@example.com',cookie1), key2=await createClient('tenant2@example.com',cookie2);
    const send=(key,from,to='student@example.com',n=upstreamCalls)=>call('local-admin','/api/v1/send',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+key,'idempotency-key':'iso-'+from.replace('@','-at-')+n},body:JSON.stringify({from,to,subject:'Hi',text:'Hello'})});
    assert.equal((await send(key1,'support@client1.test')).status,200);
    const cross=await send(key1,'support@client2.test');
    assert.equal(cross.status,403,'tenant API keys must not send from another workspace identity');
    assert.equal(upstreamCalls,1,'no upstream call may happen for cross-tenant send');
    assert.equal((await send(key2,'support@client2.test')).status,200);
    // Unverified legacy identity is refused by the verified-domain gate.
    await db.prepare("INSERT INTO sender_identities (id,email_address,display_name,is_default,is_active,created_at,owner_subject) VALUES ('legacy','legacy@unverified.test','Legacy',0,1,unixepoch(),'tenant1@example.com')").run();
    assert.equal((await send(key1,'legacy@unverified.test')).status,422,'unverified domain sending must be rejected');

    // --- mail activity and message preview isolation ---
    await db.prepare("INSERT INTO email_logs (id,direction,provider_used,sender_address,recipient_address,subject,html_hash,transmission_status,unix_timestamp,updated_at,owner_subject) VALUES ('t2log','outbound','resend','support@client2.test','student@example.com','Tenant Two Private Secret','x','Sent',unixepoch(),unixepoch(),'tenant2@example.com')").run();
    const mail1=await (await call('tenant1@example.com','/admin?view=mail',{headers:{cookie:cookie1}})).text();
    assert.ok(!mail1.includes('Tenant Two Private Secret'),'tenant mail view must not contain other workspaces mail');
    const own1=await call('tenant1@example.com','/admin/view-mail?id=t2log',{headers:{cookie:cookie1}});
    assert.equal(own1.status,404,'cross-tenant message inspector must be a 404');
    const own2=await (await call('tenant2@example.com','/admin/view-mail?id=t2log',{headers:{cookie:cookie2}})).text();
    assert.ok(own2.includes('Tenant Two Private Secret'));

    // API-client revocation is owner-scoped.
    const client2id=await db.prepare('SELECT id FROM api_clients WHERE name=?').bind('backend-tenant2@example.com').first('id');
    const revoke=await post('tenant1@example.com',cookie1,'/admin/api-clients/revoke',{id:client2id});
    assert.equal(revoke.status,303);
    assert.equal(await db.prepare('SELECT is_active FROM api_clients WHERE id=?').bind(client2id).first('is_active'),1,'foreign API client must stay active');

    // Sandbox testing stays superadmin-only.
    assert.equal((await post('tenant1@example.com',cookie1,'/admin/send-test',{delivery_mode:'mailgun-sandbox',idempotency_key:'tenant-sandbox',to:'x@example.com'})).status,403,'Mailgun sandbox is deployment infrastructure');

    // Session revocation is scoped to the acting tenant.
    await post('tenant1@example.com',cookie1,'/admin/sessions/revoke',{});
    assert.equal(await db.prepare('SELECT COUNT(*) AS n FROM admin_sessions WHERE access_subject=?').bind('tenant1@example.com').first('n'),0);
    assert.equal(await db.prepare('SELECT COUNT(*) AS n FROM admin_sessions WHERE access_subject=?').bind('tenant2@example.com').first('n'),1,'other tenant sessions must survive');

    // Superadmin creates admins; no panel path can create a superadmin.
    const cookieS=await login('local-admin');
    const addAdmin=await post('local-admin',cookieS,'/admin/users/add',{subject:'tenant3@example.com',role:'admin'});
    assert.equal(addAdmin.status,303);
    assert.equal(await db.prepare("SELECT role FROM admin_users WHERE subject='tenant3@example.com'").first('role'),'admin');
    const addSuper=await post('local-admin',cookieS,'/admin/users/add',{subject:'evil@example.com',role:'superadmin'});
    assert.equal(addSuper.status,422,'superadmin role must not be assignable from the panel');
    assert.equal(await db.prepare("SELECT role FROM admin_users WHERE subject='evil@example.com'").first('role'),null);
  } finally { globalThis.fetch=originalFetch; db.close(); }
});
