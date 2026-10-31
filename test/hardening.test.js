import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import worker from '../src/index.js';
import { database } from './local-db.js';
import { hash, hashOtp, encrypt } from '../src/security.js';
import { validateSetting, resolveAccountProviderSecrets } from '../src/config.js';

const schema = () => readFile('schema.sql', 'utf8');

test('panel cannot escalate roles, reserve local-admin, or rename a workspace onto it', async () => {
  const db = database(await schema());
  const token = randomBytes(32).toString('base64url');
  const env = { DB: db, LOCAL_DEV: 'true', LOCAL_ADMIN_TOKEN: token, CONFIG_ENCRYPTION_KEY: randomBytes(32).toString('base64') };
  const call = (path, opts = {}) => worker.fetch(new Request('http://localhost' + path, opts), env);
  try {
    await db.prepare("INSERT INTO admin_users (subject,role,is_active,created_at,created_by) VALUES ('local-admin','superadmin',1,unixepoch(),'bootstrap'),('tenant@example.com','admin',1,unixepoch(),'local-admin')").run();
    const login = await call('/admin/login', { method: 'POST', headers: { origin: 'http://localhost', 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ admin_token: token }) });
    assert.equal(login.status, 303);
    const cookie = login.headers.get('set-cookie').split(';')[0];
    const csrf = await db.prepare("SELECT csrf_token FROM admin_sessions WHERE access_subject='local-admin'").first('csrf_token');
    const post = (path, data) => call(path, { method: 'POST', headers: { cookie, origin: 'http://localhost', 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ csrf, ...data }) });

    assert.equal((await post('/admin/users/add', { subject: 'local-admin', role: 'admin' })).status, 422, 'local-admin is reserved for deployment bootstrap');
    assert.equal((await post('/admin/users/add', { subject: 'evil@example.com', role: 'superadmin' })).status, 422, 'superadmin is not assignable from the panel');
    assert.equal(await db.prepare("SELECT role FROM admin_users WHERE subject='evil@example.com'").first('role'), null);
    assert.equal((await post('/admin/users/revoke', { subject: 'local-admin' })).status, 422, 'a superadmin cannot revoke the acting superadmin');
    assert.equal((await post('/admin/users/update', { old_subject: 'tenant@example.com', new_subject: 'local-admin', role: 'admin' })).status, 422, 'workspace rename cannot target the reserved subject');
    assert.equal(await db.prepare("SELECT owner_subject FROM sender_identities WHERE owner_subject='local-admin'").first(), null);
  } finally { db.close(); }
});

test('a revoked administrator session is destroyed before any handler runs', async () => {
  const db = database(await schema());
  const env = { DB: db, LOCAL_DEV: 'false', EMAIL_OTP_LOGIN: 'true', CONFIG_ENCRYPTION_KEY: randomBytes(32).toString('base64') };
  const token = crypto.randomUUID();
  try {
    await db.prepare("INSERT INTO admin_users (subject,role,is_active,created_at,created_by) VALUES ('root@example.com','superadmin',1,unixepoch(),'bootstrap'),('tenant@example.com','admin',1,unixepoch(),'root@example.com')").run();
    await db.prepare('INSERT INTO admin_sessions (token_hash,csrf_token,access_subject,credential_version,expires_at) VALUES (?,?,?,?,?)')
      .bind(await hash(token), 'csrf', 'tenant@example.com', await hash(''), Math.floor(Date.now() / 1000) + 3600).run();
    const cookie = '__Host-neomail=' + token;
    const live = await worker.fetch(new Request('https://mail.example/dashboard', { headers: { cookie } }), env);
    assert.equal(live.status, 200, 'active administrator keeps access');

    await db.prepare("UPDATE admin_users SET is_active=0 WHERE subject='tenant@example.com'").run();
    const revoked = await worker.fetch(new Request('https://mail.example/dashboard', { headers: { cookie } }), env);
    assert.equal(revoked.status, 303);
    assert.equal(revoked.headers.get('location'), '/admin/login');
    assert.equal(await db.prepare("SELECT COUNT(*) AS n FROM admin_sessions WHERE access_subject='tenant@example.com'").first('n'), 0, 'revoked session must be deleted immediately');
  } finally { db.close(); }
});

test('OTP verification is rate limited and burns the code after five failures', async () => {
  const db = database(await schema());
  const env = { DB: db, LOCAL_DEV: 'false', EMAIL_OTP_LOGIN: 'true', MAX_LOGIN_ATTEMPTS: '10', CONFIG_ENCRYPTION_KEY: randomBytes(32).toString('base64') };
  const salt = randomBytes(16).toString('hex');
  try {
    await db.prepare('INSERT INTO admin_otps (subject,salt,code_hash,expires_at,attempts,created_at) VALUES (?,?,?,?,0,unixepoch())')
      .bind('admin@example.com', salt, await hashOtp(salt, '123456'), Math.floor(Date.now() / 1000) + 300).run();
    const verify = code => worker.fetch(new Request('https://mail.example/login', {
      method: 'POST',
      headers: { origin: 'https://mail.example', 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ step: 'verify', email: 'admin@example.com', code }),
    }), env);
    for (let i = 0; i < 5; i++) assert.equal((await verify('000000')).status, 403);
    assert.equal(await db.prepare("SELECT attempts FROM admin_otps WHERE subject='admin@example.com'").first('attempts'), 5);
    assert.equal((await verify('123456')).status, 403, 'the correct code must be refused after the attempt cap');
    assert.equal(await db.prepare("SELECT 1 FROM admin_otps WHERE subject='admin@example.com'").first(), null, 'burned codes are deleted');
  } finally { db.close(); }
});

test('SMTP routing rejects private hosts, nonstandard ports and plaintext passwords in extra_config', async () => {
  for (const host of ['localhost', '127.0.0.1', '10.0.0.5', 'relay.internal', 'smtp.test']) {
    assert.throws(() => validateSetting('SMTP_HOST', host), { status: 422 }, host);
  }
  assert.equal(validateSetting('SMTP_HOST', 'smtp.gmail.com'), 'smtp.gmail.com');
  for (const port of ['25', '2525', '1', '65535']) assert.throws(() => validateSetting('SMTP_PORT', port), { status: 422 }, port);
  assert.equal(validateSetting('SMTP_PORT', '465'), '465');
  assert.equal(validateSetting('SMTP_PORT', '587'), '587');

  const db = database(await schema());
  const key = randomBytes(32).toString('base64');
  const env = { DB: db, CONFIG_ENCRYPTION_KEY: key };
  try {
    const password = 'smtp-app-password-value';
    const ciphertext = await encrypt(key, password, 'tenant@example.com:smtp');
    await db.prepare('INSERT INTO account_provider_keys (id,owner_subject,provider_name,encrypted_key,key_hint,extra_config,is_active,created_at,updated_at) VALUES (?,?,?,?,?,?,1,unixepoch(),unixepoch())')
      .bind('smtp-1', 'tenant@example.com', 'smtp', ciphertext, '••••••••ue', JSON.stringify({ smtp_host: 'smtp.gmail.com', smtp_port: '587', smtp_user: 'tenant@example.com', smtp_pass: 'plaintext-leak' })).run();
    const secrets = await resolveAccountProviderSecrets(env, 'tenant@example.com');
    assert.equal(secrets.SMTP_HOST, 'smtp.gmail.com');
    assert.equal(secrets.SMTP_PORT, '587');
    assert.equal(secrets.SMTP_PASS, password, 'the encrypted key is the only SMTP password source');
    assert.notEqual(secrets.SMTP_PASS, 'plaintext-leak');

    await db.prepare("UPDATE account_provider_keys SET extra_config=? WHERE id='smtp-1'").bind(JSON.stringify({ smtp_host: '127.0.0.1', smtp_port: '465', smtp_user: 'x' })).run();
    assert.deepEqual(await resolveAccountProviderSecrets(env, 'tenant@example.com'), {}, 'a private stored host is ignored');
  } finally { db.close(); }
});

test('API domain listing and verification are scoped to the key owner', async () => {
  const db = database(await schema());
  const keyA = randomBytes(32).toString('base64url');
  const keyB = randomBytes(32).toString('base64url');
  const env = { DB: db, LOCAL_DEV: 'true', CONFIG_ENCRYPTION_KEY: randomBytes(32).toString('base64') };
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async url => {
    assert.equal(new URL(url).hostname, 'cloudflare-dns.com');
    return Response.json({ Answer: [{ data: '"tenant-a-token"' }] });
  };
  try {
    await db.prepare("INSERT INTO api_clients (id,name,key_hash,sender_address,is_active,created_at,owner_subject) VALUES ('a','A',?,NULL,1,unixepoch(),'tenantA@example.com'),('b','B',?,NULL,1,unixepoch(),'tenantB@example.com')")
      .bind(await hash(keyA), await hash(keyB)).run();
    await db.prepare("INSERT INTO managed_domains (domain,display_name,is_verified,created_at,created_by,owner_subject,verification_token) VALUES ('clienta.com','A',1,unixepoch(),'a','tenantA@example.com','tenant-a-token'),('clientb.com','B',1,unixepoch(),'b','tenantB@example.com','tenant-b-token')").run();
    const api = (key, path, method = 'GET', body = null) => worker.fetch(new Request('https://mail.example' + path, {
      method,
      headers: { authorization: 'Bearer ' + key, 'content-type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}),
    }), env);

    const list = await api(keyA, '/api/v1/domains');
    assert.equal(list.status, 200);
    const listed = await list.json();
    assert.deepEqual(listed.domains.map(d => d.domain), ['clienta.com'], 'tenant A must not see tenant B domains');

    assert.equal((await api(keyA, '/api/v1/domains/verify', 'POST', { domain: 'clientb.com' })).status, 404, 'cross-tenant verification must be a 404');
    const own = await api(keyA, '/api/v1/domains/verify', 'POST', { domain: 'clienta.com' });
    assert.equal(own.status, 200);
    assert.equal((await own.json()).verified, true);
  } finally { globalThis.fetch = originalFetch; db.close(); }
});
