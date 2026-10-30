import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { encrypt, decrypt, equal, email, readBody, sameOrigin, access, cookie, reply } from '../src/security.js';
import { validateSetting } from '../src/config.js';
import { validateMail, verifyWebhook } from '../src/providers.js';

test('secret encryption is randomized, authenticated and bound to its setting name', async()=>{
 const key=randomBytes(32).toString('base64'), value='test-provider-credential-123456789';
 const a=await encrypt(key,value,'RESEND_API_KEY'), b=await encrypt(key,value,'RESEND_API_KEY');
 assert.notEqual(a,b); assert.ok(!a.includes(value)); assert.equal(await decrypt(key,a,'RESEND_API_KEY'),value);
 await assert.rejects(decrypt(key,a,'API_SECRET_KEY')); await assert.rejects(decrypt(randomBytes(32).toString('base64'),a,'RESEND_API_KEY'));
});
test('constant size digest comparisons reject mismatched values',async()=>{
 assert.equal(await equal('same','same'),true); assert.equal(await equal('same','other'),false); assert.equal(await equal('same','samex'),false);
});
test('body size limit applies without content-length',async()=>{
 const request=new Request('https://example.com',{method:'POST',body:'x'.repeat(101)});
 await assert.rejects(readBody(request,100), {status:413});
});
test('cross origin and missing origins cannot submit forms',()=>{
 for(const origin of [null,'null','https://evil.example']) assert.throws(()=>sameOrigin(new Request('https://mail.example.com/admin',{method:'POST',headers:origin?{origin}:{}})),{status:403});
 sameOrigin(new Request('https://mail.example.com/admin',{method:'POST',headers:{origin:'https://mail.example.com'}}));
});
test('form pages preserve same-origin browser POST origins without permitting cross-origin requests',()=>{
 assert.equal(reply('<form method="post"></form>').headers.get('referrer-policy'),'same-origin');
 sameOrigin(new Request('http://localhost:8787/admin/login',{method:'POST',headers:{origin:'http://localhost:8787','sec-fetch-site':'same-origin'}}));
 assert.throws(()=>sameOrigin(new Request('http://localhost:8787/admin/login',{method:'POST',headers:{origin:'http://localhost:8787','sec-fetch-site':'cross-site'}})),{status:403});
});
test('production Access fails closed even with a local development flag',async()=>{
 await assert.rejects(access(new Request('https://mail.example.com/admin'),{LOCAL_DEV:'true'}),{status:503});
 await assert.rejects(access(new Request('https://mail.example.com/admin',{headers:{'cf-access-jwt-assertion':'fake'}}),{ACCESS_TEAM_DOMAIN:'team.cloudflareaccess.com',ACCESS_AUD:'app'}),{status:403});
 assert.equal(await access(new Request('http://localhost/admin'),{LOCAL_DEV:'true'}),'local-admin');
});
test('malformed cookies cannot crash authentication',()=>assert.equal(cookie(new Request('https://example.com',{headers:{cookie:'__Host-neomail=%E0%A4%A'}}),'__Host-neomail'),''));
test('configuration rejects unknown names, provider injection, and invalid bounds',()=>{
 for(const [name,value] of [['UNSAFE','x'],['REQUEST_TIMEOUT_MS','NaN'],['REQUEST_TIMEOUT_MS','0'],['FALLBACK_ORDER','__proto__'],['FALLBACK_ORDER','resend,resend'],['MAILGUN_DOMAIN','evil.example/path'],['MAILGUN_SANDBOX_DOMAIN','evil.example'],['MAILGUN_DOMAIN','sandbox123.mailgun.org']]) assert.throws(()=>validateSetting(name,value),{status:422});
 assert.equal(validateSetting('FALLBACK_ORDER','resend, brevo'),'resend,brevo');
});
test('mail rejects header injection, malformed payload fields and empty messages',()=>{
 const cfg={DEFAULT_SENDER:'no-reply@example.com',DEFAULT_SENDER_NAME:'Test'};
 assert.equal(email('a@example.com\r\nBcc:attacker@evil.com'),null);
 for(const data of [{to:'a@example.com',subject:'Hello\r\nBcc:evil',text:'Hi'}, {to:'a@example.com',subject:'Hello',html:{}},{to:'a@example.com',subject:'Hello'}]) assert.throws(()=>validateMail(data,cfg),{status:422});
});
test('generic and unsigned webhooks are rejected',async()=>{
 await assert.rejects(verifyWebhook('generic',new Request('https://example.com'),'{"status":"delivered"}',{}),{status:404});
 await assert.rejects(verifyWebhook('resend',new Request('https://example.com'),'{"type":"email.delivered"}',{}),{status:403});
});

test('Access validates real RSA signatures, audience, issuer and expiration',async()=>{
 const { generateKeyPairSync, sign }=await import('node:crypto');
 const { publicKey, privateKey }=generateKeyPairSync('rsa',{modulusLength:2048});
 const originalFetch=globalThis.fetch, team='jwt-test.cloudflareaccess.com';
 globalThis.fetch=async()=>Response.json({keys:[{...publicKey.export({format:'jwk'}),kid:'test-key'}]});
 const encode=x=>Buffer.from(JSON.stringify(x)).toString('base64url');
 const make=(claims,wrongSignature=false)=>{
  const payload=encode({alg:'RS256',kid:'test-key'})+'.'+encode(claims);
  return payload+'.'+(wrongSignature?Buffer.alloc(256):sign('RSA-SHA256',Buffer.from(payload),privateKey)).toString('base64url');
 };
 const now=Math.floor(Date.now()/1000), valid={iss:'https://'+team,aud:['admin-app'],sub:'admin-subject',iat:now,exp:now+600};
 const env={ACCESS_TEAM_DOMAIN:team,ACCESS_AUD:'admin-app'};
 const req=token=>new Request('https://mail.example/admin',{headers:{'cf-access-jwt-assertion':token}});
 try {
  assert.equal(await access(req(make(valid)),env),'admin-subject');
  for(const claims of [{...valid,aud:['wrong-app']},{...valid,iss:'https://evil.example'},{...valid,exp:now-1},{...valid,iat:now+600}]) await assert.rejects(access(req(make(claims)),env),{status:403});
  await assert.rejects(access(req(make(valid,true)),env),{status:403});
 } finally {globalThis.fetch=originalFetch;}
});
