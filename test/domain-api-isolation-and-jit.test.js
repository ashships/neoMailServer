import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import worker from '../src/index.js';
import { database } from './local-db.js';
import { encrypt, decrypt } from '../src/security.js';
import { config, resolveSingleAppSecret, resolveSingleProviderCredentials } from '../src/config.js';

test('domain-scoped API keys: single-domain binding, strict cross-tenant/superadmin isolation, and JIT decryption', async t => {
  const schemaSql = await readFile('schema.sql', 'utf8');
  const db = database(schemaSql);
  const encryptionKey = randomBytes(32).toString('base64');
  const adminToken = randomBytes(32).toString('base64url');

  const decryptedProviders = [];
  const capturedRequests = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, opts = {}) => {
    const host = new URL(url).hostname;
    if (host === 'cloudflare-dns.com') {
      const domain = new URL(url).searchParams.get('name').replace('_neomail-verification.', '');
      const row = await db.prepare('SELECT verification_token FROM managed_domains WHERE domain=?').bind(domain).first();
      return Response.json({ Answer: row ? [{ data: '"' + row.verification_token + '"' }] : [] });
    }
    if (host === 'api.resend.com') {
      capturedRequests.push({ provider: 'resend', url, headers: opts.headers });
      return Response.json({ id: 'msg-resend-jit-1' });
    }
    if (host === 'api.brevo.com') {
      capturedRequests.push({ provider: 'brevo', url, headers: opts.headers });
      return Response.json({ messageId: 'msg-brevo-jit-1' });
    }
    return Response.json({ id: 'mock-upstream' });
  };

  try {
    const env = {
      DB: db,
      LOCAL_DEV: 'false',
      EMAIL_OTP_LOGIN: 'true',
      CONFIG_ENCRYPTION_KEY: encryptionKey,
      DEFAULT_SENDER: 'no-reply@mail.neopathshala.com',
      FALLBACK_ORDER: 'resend,brevo,mailgun',
    };

    // 1. Seed superadmin and two tenants
    await db.prepare(`
      INSERT INTO admin_users (subject, role, is_active, created_at, created_by) VALUES
      ('super@neomailer.internal', 'superadmin', 1, unixepoch(), 'bootstrap'),
      ('tenantA@company.com', 'admin', 1, unixepoch(), 'bootstrap'),
      ('tenantB@company.com', 'admin', 1, unixepoch(), 'bootstrap')
    `).run();

    // Helper to create session
    const createSession = async (subject, role) => {
      const token = crypto.randomUUID();
      const tokenHash = await (await import('../src/security.js')).hash(token);
      const csrf = 'csrf-' + randomBytes(8).toString('hex');
      const credVer = await (await import('../src/security.js')).hash(env.ADMIN_TOKEN_HASH || '');
      await db.prepare(`
        INSERT INTO admin_sessions (token_hash, csrf_token, access_subject, credential_version, expires_at)
        VALUES (?, ?, ?, ?, unixepoch() + 3600)
      `).bind(tokenHash, csrf, subject, credVer).run();
      return { token, csrf };
    };

    const superSess = await createSession('super@neomailer.internal', 'superadmin');
    const tenantASess = await createSession('tenantA@company.com', 'admin');
    const tenantBSess = await createSession('tenantB@company.com', 'admin');

    const call = (token, path, opts = {}) =>
      worker.fetch(new Request('https://mail.neopathshala.com' + path, {
        ...opts,
        headers: {
          cookie: `__Host-neomail=${token}`,
          ...(opts.headers || {}),
        },
      }), env);

    const post = (sess, path, data) =>
      call(sess.token, path, {
        method: 'POST',
        headers: {
          origin: 'https://mail.neopathshala.com',
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ csrf: sess.csrf, ...data }),
      });

    // 2. Setup verified domains for Tenant A (domainA1.com and domainA2.com) and Tenant B (domainB.com)
    await db.prepare(`
      INSERT INTO managed_domains (domain, display_name, is_verified, created_at, created_by, owner_subject, verification_token) VALUES
      ('domaina1.com', 'Domain A1', 1, unixepoch(), 'tenantA', 'tenantA@company.com', 'tok-a1'),
      ('domaina2.com', 'Domain A2', 1, unixepoch(), 'tenantA', 'tenantA@company.com', 'tok-a2'),
      ('domainb.com', 'Domain B', 1, unixepoch(), 'tenantB', 'tenantB@company.com', 'tok-b')
    `).run();

    // Add identities
    await db.prepare(`
      INSERT INTO sender_identities (id, email_address, display_name, is_default, is_active, created_at, owner_subject) VALUES
      ('id-a1', 'sales@domaina1.com', 'Sales A1', 1, 1, unixepoch(), 'tenantA@company.com'),
      ('id-a2', 'info@domaina2.com', 'Info A2', 0, 1, unixepoch(), 'tenantA@company.com'),
      ('id-b', 'support@domainb.com', 'Support B', 1, 1, unixepoch(), 'tenantB@company.com')
    `).run();

    // 3. Save provider credentials for Tenant A in DB
    const resendKeyA = 're_live_TenantA_Key_1234567890';
    const brevoKeyA = 'xkeysib-live-TenantA-Brevo-1234567890';
    const encResend = await encrypt(encryptionKey, resendKeyA, 'tenantA@company.com:resend');
    const encBrevo = await encrypt(encryptionKey, brevoKeyA, 'tenantA@company.com:brevo');

    await db.prepare(`
      INSERT INTO account_provider_keys (id, owner_subject, provider_name, encrypted_key, key_hint, is_active, created_at, updated_at) VALUES
      ('apk-1', 'tenantA@company.com', 'resend', ?, 're_••••••••7890', 1, unixepoch(), unixepoch()),
      ('apk-2', 'tenantA@company.com', 'brevo', ?, 'xkeysib-••••••••7890', 1, unixepoch(), unixepoch())
    `).bind(encResend, encBrevo).run();

    // 4. VERIFY JIT / LAZY DECRYPTION ON CONFIG LOAD:
    // Calling config(env) must NEVER decrypt secrets into the config dictionary
    const loadedCfg = await config(env);
    assert.equal(loadedCfg.values.RESEND_API_KEY, undefined, 'Config loading must not decrypt provider API keys');
    assert.equal(loadedCfg.values.BREVO_API_KEY, undefined, 'Config loading must not decrypt provider API keys');

    // 5. Tenant A creates an API client specifically isolated to 'domaina1.com'
    const createRes = await post(tenantASess, '/admin/api-clients/create', {
      name: 'Backend Microservice A1',
      domain: 'domaina1.com',
    });
    assert.equal(createRes.status, 303);
    const location = createRes.headers.get('location');
    assert.ok(location.includes('created_key='));
    const urlParams = new URL(location, 'https://mail.neopathshala.com').searchParams;
    const apiKeyA1 = urlParams.get('created_key');
    assert.ok(apiKeyA1 && apiKeyA1.length > 20);

    // Verify in SQLite: Client is bound to domaina1.com
    const clientRow = await db.prepare("SELECT * FROM api_clients WHERE name='Backend Microservice A1'").first();
    assert.equal(clientRow.domain, 'domaina1.com');
    assert.equal(clientRow.owner_subject, 'tenantA@company.com');

    // 6. STRICT DOMAIN ISOLATION AT DISPATCH:
    // Sending for 'domaina1.com' with apiKeyA1 succeeds
    const sendA1Success = await worker.fetch(new Request('https://mail.neopathshala.com/api/v1/send', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKeyA1}`,
        'idempotency-key': 'idemp-a1-success-1',
      },
      body: JSON.stringify({
        from: 'sales@domaina1.com',
        to: 'customer@external.com',
        subject: 'Order Confirmation',
        text: 'Your order is confirmed.',
      }),
    }), env);
    assert.equal(sendA1Success.status, 200, 'Sending from assigned domain must succeed');
    assert.equal(capturedRequests.length, 1);
    assert.equal(capturedRequests[0].provider, 'resend');
    assert.equal(capturedRequests[0].headers.Authorization, `Bearer ${resendKeyA}`);

    // Sending for 'domaina2.com' (even though Tenant A owns domaina2.com!) with apiKeyA1 MUST BE REJECTED!
    const sendA2CrossDomain = await worker.fetch(new Request('https://mail.neopathshala.com/api/v1/send', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKeyA1}`,
        'idempotency-key': 'idemp-a1-cross-dom-1',
      },
      body: JSON.stringify({
        from: 'info@domaina2.com',
        to: 'customer@external.com',
        subject: 'Wrong Domain Send',
        text: 'Should be rejected',
      }),
    }), env);
    assert.equal(sendA2CrossDomain.status, 403, 'Sending from different domain on same tenant must be rejected');
    const crossErr = await sendA2CrossDomain.json();
    assert.ok(crossErr.error.includes('strictly isolated to domain domaina1.com'));

    // 7. SUPERADMIN AND CROSS-TENANT ISOLATION:
    // Superadmin viewing API clients: Superadmin only sees their own, CANNOT see Tenant A's client!
    const superClientsRes = await call(superSess.token, '/admin/clients');
    assert.equal(superClientsRes.status, 200);
    const superClientsHtml = await superClientsRes.text();
    assert.ok(!superClientsHtml.includes('Backend Microservice A1'), 'Superadmin MUST NOT see Tenant A API clients');

    // Tenant B viewing API clients: CANNOT see Tenant A's client!
    const tenantBClientsRes = await call(tenantBSess.token, '/dashboard/clients');
    assert.equal(tenantBClientsRes.status, 200);
    const tenantBClientsHtml = await tenantBClientsRes.text();
    assert.ok(!tenantBClientsHtml.includes('Backend Microservice A1'), 'Tenant B MUST NOT see Tenant A API clients');

    // Superadmin attempting to revoke Tenant A's client MUST FAIL (cannot revoke someone else's client)
    await post(superSess, '/admin/api-clients/revoke', { id: clientRow.id });
    const stillActive = await db.prepare('SELECT is_active FROM api_clients WHERE id=?').bind(clientRow.id).first('is_active');
    assert.equal(stillActive, 1, 'Superadmin MUST NOT be able to revoke Tenant A API client');

    // Tenant A revoking their own client succeeds
    const revokeRes = await post(tenantASess, '/admin/api-clients/revoke', { id: clientRow.id });
    assert.equal(revokeRes.status, 303);
    const nowRevoked = await db.prepare('SELECT is_active FROM api_clients WHERE id=?').bind(clientRow.id).first('is_active');
    assert.equal(nowRevoked, 0, 'Tenant A successfully revokes their own API client');

  } finally {
    globalThis.fetch = originalFetch;
    db.close();
  }
});
