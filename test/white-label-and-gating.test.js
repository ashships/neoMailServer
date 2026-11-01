import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import worker from '../src/index.js';
import { database } from './local-db.js';
import { hash } from '../src/security.js';

test('white-label domain settings and domain verification gating', async () => {
  const schemaSql = await readFile('schema.sql', 'utf8');
  const db = database(schemaSql);
  const encryptionKey = randomBytes(32).toString('base64');
  const env = {
    DB: db,
    LOCAL_DEV: 'false',
    CONFIG_ENCRYPTION_KEY: encryptionKey,
    EMAIL_OTP_LOGIN: 'true',
    ALLOW_TOKEN_LOGIN: 'false',
    ADMIN_TOKEN_HASH: await hash('admin123'),
  };

  try {
    // 1. Gating: Non-superadmin cannot create API client without a verified domain
    await db.prepare("INSERT INTO admin_users (subject, role, is_active, created_at, created_by) VALUES ('tenant@example.com', 'admin', 1, unixepoch(), 'system')").run();
    const tenantToken = crypto.randomUUID();
    const tenantHash = await hash(tenantToken);
    const verifier = await hash(await hash('admin123'));
    await db.prepare("INSERT INTO admin_sessions (token_hash, csrf_token, access_subject, credential_version, expires_at) VALUES (?, 'csrf-test', 'tenant@example.com', ?, unixepoch() + 3600)").bind(tenantHash, verifier).run();

    const createClientReq = () => new Request('https://mail.neopathshala.com/dashboard/api-clients/create', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        cookie: `__Host-neomail=${tenantToken}`,
        origin: 'https://mail.neopathshala.com',
      },
      body: new URLSearchParams({ csrf: 'csrf-test', name: 'Test Client' }),
    });

    const resClientBlocked = await worker.fetch(createClientReq(), env);
    assert.equal(resClientBlocked.status, 422, 'Must block API client creation if tenant has no verified domains');

    // 2. Add unverified domain
    await db.prepare("INSERT INTO managed_domains (domain, display_name, is_verified, created_at, owner_subject, verification_token) VALUES ('unverified.com', 'Unverified', 0, unixepoch(), 'tenant@example.com', 'token-123')").run();

    const resStillBlocked = await worker.fetch(createClientReq(), env);
    assert.equal(resStillBlocked.status, 422, 'Must still block API client creation if domain is unverified');

    // 3. Mark domain as verified
    await db.prepare("UPDATE managed_domains SET is_verified=1 WHERE domain='unverified.com'").run();

    const resClientAllowed = await worker.fetch(createClientReq(), env);
    assert.equal(resClientAllowed.status, 303, 'Must permit API client creation once domain is verified');

    // 4. White-label configuration by Superadmin
    await db.prepare("INSERT INTO admin_users (subject, role, is_active, created_at, created_by) VALUES ('super@example.com', 'superadmin', 1, unixepoch(), 'system')").run();
    const superToken = crypto.randomUUID();
    const superHash = await hash(superToken);
    await db.prepare("INSERT INTO admin_sessions (token_hash, csrf_token, access_subject, credential_version, expires_at) VALUES (?, 'csrf-super', 'super@example.com', ?, unixepoch() + 3600)").bind(superHash, verifier).run();

    const wlReq = new Request('https://mail.neopathshala.com/admin/domains/white-label', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        cookie: `__Host-neomail=${superToken}`,
        origin: 'https://mail.neopathshala.com',
      },
      body: new URLSearchParams({
        csrf: 'csrf-super',
        domain: 'unverified.com',
        custom_api_hostname: 'api.unverified.com',
        enforce_custom_hostname: '1',
      }),
    });

    const wlRes = await worker.fetch(wlReq, env);
    assert.equal(wlRes.status, 303);

    const updatedDomain = await db.prepare("SELECT custom_api_hostname, enforce_custom_hostname FROM managed_domains WHERE domain='unverified.com'").first();
    assert.equal(updatedDomain.custom_api_hostname, 'api.unverified.com');
    assert.equal(updatedDomain.enforce_custom_hostname, 1);

    // 5. White-label endpoint enforcement on /api/v1/send
    await db.prepare("INSERT INTO sender_identities (id, email_address, display_name, is_active, created_at, owner_subject) VALUES ('id-1', 'hello@unverified.com', 'Hello', 1, unixepoch(), 'tenant@example.com')").run();
    const apiKeyRaw = 'test_raw_key_123456789012345678901234567890';
    const keyHash = await hash(apiKeyRaw);
    await db.prepare("INSERT INTO api_clients (id, name, key_hash, is_active, created_at, owner_subject) VALUES ('client-1', 'App Client', ?, 1, unixepoch(), 'tenant@example.com')").bind(keyHash).run();

    // Hitting standard shared domain should be rejected with 403 because enforce_custom_hostname = 1
    const sendSharedReq = new Request('https://mail.neopathshala.com/api/v1/send', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKeyRaw}`,
        host: 'mail.neopathshala.com',
      },
      body: JSON.stringify({
        from: 'hello@unverified.com',
        to: 'recipient@example.com',
        subject: 'Test White Label',
        text: 'Testing',
      }),
    });

    const sendSharedRes = await worker.fetch(sendSharedReq, env);
    assert.equal(sendSharedRes.status, 403, 'Must reject shared endpoint when white-label is enforced');
    const sendSharedBody = await sendSharedRes.json();
    assert.ok(sendSharedBody.error.includes('dedicated white-label endpoint'));

    // Hitting the white-label custom hostname passes endpoint check
    const sendCustomReq = new Request('https://api.unverified.com/api/v1/send', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKeyRaw}`,
        host: 'api.unverified.com',
        'idempotency-key': 'test-idemp-12345',
      },
      body: JSON.stringify({
        from: 'hello@unverified.com',
        to: 'recipient@example.com',
        subject: 'Test White Label',
        text: 'Testing',
      }),
    });

    // Mock fetch for upstream provider
    const origFetch = globalThis.fetch;
    globalThis.fetch = async () => Response.json({ id: 'msg-wl-1' });
    try {
      const sendCustomRes = await worker.fetch(sendCustomReq, env);
      if (![200, 202, 502].includes(sendCustomRes.status)) {
        console.error('sendCustomRes status:', sendCustomRes.status, await sendCustomRes.text());
      }
      assert.ok([200, 202, 502].includes(sendCustomRes.status), 'Endpoint check passed');
    } finally {
      globalThis.fetch = origFetch;
    }
  } finally {
    db.close();
  }
});
