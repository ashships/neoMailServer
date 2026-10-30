import {test} from 'node:test';
import assert from 'node:assert/strict';
import {generateKeyPairSync,sign,randomBytes} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import worker from '../src/index.js';
import {database} from './local-db.js';

test('production Access login replaces admin tokens, binds identity and requires recent assertions for credential writes',async()=>{
 const db=database(await readFile('schema.sql','utf8'));
 const {publicKey,privateKey}=generateKeyPairSync('rsa',{modulusLength:2048});
 const env={DB:db,ACCESS_TEAM_DOMAIN:'production-auth-test.cloudflareaccess.com',ACCESS_AUD:'console',CONFIG_ENCRYPTION_KEY:randomBytes(32).toString('base64')};
 const enc=x=>Buffer.from(JSON.stringify(x)).toString('base64url');
 function jwt(age=0,sub='admin-1') {const now=Math.floor(Date.now()/1000);const data=enc({alg:'RS256',kid:'k1'})+'.'+enc({iss:'https://'+env.ACCESS_TEAM_DOMAIN,aud:['console'],sub,iat:now-age,exp:now+600});return data+'.'+sign('RSA-SHA256',Buffer.from(data),privateKey).toString('base64url');}
 const original=globalThis.fetch;globalThis.fetch=async()=>Response.json({keys:[{...publicKey.export({format:'jwk'}),kid:'k1'}]});
 const request=(path,options={},assertion=jwt())=>worker.fetch(new Request('https://mail.example'+path,{...options,headers:{'cf-access-jwt-assertion':assertion,...options.headers}}),env);
 try {
  assert.equal((await worker.fetch(new Request('https://mail.example/admin/login'),env)).status,403);
  const login=await request('/admin/login'); const html=await login.text();assert.ok(html.includes('Continue to workspace'));assert.ok(!html.includes('name="admin_token"'));
  const res=await request('/admin/login',{method:'POST',headers:{origin:'https://mail.example','content-type':'application/x-www-form-urlencoded'},body:''});assert.equal(res.status,303);
  const cookie=res.headers.get('set-cookie').split(';')[0];
  const panel=await request('/admin?view=settings',{headers:{cookie}});const body=await panel.text();assert.equal(panel.status,200);assert.ok(!body.includes('name="admin_token"'));
  const csrf=body.match(/name="csrf" value="([^"]+)"/)[1];
  const png=Uint8Array.from(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64'));
  const profileForm=(csrfValue=csrf, image=new Blob([png],{type:'image/png'}),name='Softmato Support')=>{const f=new FormData();f.set('csrf',csrfValue);f.set('display_name',name);if(image)f.set('avatar',image,'logo.png');return f;};
  const profileSave=(body,origin='https://mail.example')=>request('/admin/profile',{method:'POST',headers:{cookie,origin},body});
  assert.equal((await profileSave(profileForm('bad'))).status,403);
  assert.equal((await profileSave(profileForm(), 'https://evil.example')).status,403);
  assert.equal((await profileSave(profileForm(csrf,new Blob(['<svg onload="alert(1)">'],{type:'image/svg+xml'})))).status,422);
  assert.equal((await profileSave(profileForm(csrf,new Blob([new Uint8Array(131073)],{type:'image/png'})))).status,413);
  assert.equal((await profileSave(profileForm())).status,303);
  const imageResponse=await request('/admin/profile-image',{headers:{cookie}});assert.equal(imageResponse.status,200);assert.equal(imageResponse.headers.get('content-type'),'image/png');assert.equal(imageResponse.headers.get('x-content-type-options'),'nosniff');assert.deepEqual(new Uint8Array(await imageResponse.arrayBuffer()),png);
  const updated=await (await request('/admin?view=settings',{headers:{cookie}})).text();assert.ok(updated.includes('Softmato Support'));assert.ok(updated.includes('/admin/profile-image?v='));assert.ok(!updated.includes('aria-label="Administrator">AD'));
  assert.equal((await request('/admin/profile-image',{headers:{cookie}},jwt(0,'other-admin'))).status,303);
  assert.equal((await profileSave(profileForm(csrf,null,'Renamed Profile'))).status,303);assert.equal((await request('/admin/profile-image',{headers:{cookie}})).status,200);
  const removal=profileForm(csrf,null,'Renamed Profile');removal.set('remove_avatar','yes');assert.equal((await profileSave(removal)).status,303);assert.equal((await request('/admin/profile-image',{headers:{cookie}})).status,404);
  const save=assertion=>request('/admin/credentials',{method:'POST',headers:{cookie,origin:'https://mail.example','content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({csrf,name:'RESEND_API_KEY',value:'test-provider-credential-123456'})},assertion);
  assert.equal((await save(jwt(600))).status,403);assert.equal((await save(jwt())).status,303);
  assert.equal((await request('/admin',{headers:{cookie}},jwt(0,'other-admin'))).status,303);
  const logout=await request('/admin/logout',{method:'POST',headers:{cookie,origin:'https://mail.example','content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({csrf})});assert.equal(logout.headers.get('location'),'/cdn-cgi/access/logout');
  assert.equal(await db.prepare('SELECT COUNT(*) AS n FROM admin_sessions').first('n'),0);
 } finally {globalThis.fetch=original;db.close();}
});
