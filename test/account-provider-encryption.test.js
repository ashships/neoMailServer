import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import worker from '../src/index.js';
import { database } from './local-db.js';
import { decrypt } from '../src/security.js';

test('account provider keys: AES-256-GCM encryption in SQLite, write-only masking, and full tenant isolation', async t => {
  const schemaSql = await readFile('schema.sql', 'utf8');
  const db = database(schemaSql);
  const encryptionKey = randomBytes(32).toString('base64');
  const adminToken = randomBytes(32).toString('base64url');

  const capturedAuthHeaders = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, opts = {}) => {
    const host = new URL(url).hostname;
    if (host === 'cloudflare-dns.com') {
      const domain = new URL(url).searchParams.get('name').replace('_neomail-verification.', '');
      const row = await db.prepare('SELECT verification_token FROM managed_domains WHERE domain=?').bind(domain).first();
      return Response.json({ Answer: row ? [{ data: '"' + row.verification_token + '"' }] : [] });
    }
    if (host === 'api.resend.com') {
      capturedAuthHeaders.push({
        url,
        auth: opts.headers?.Authorization || opts.headers?.authorization,
      });
      return Response.json({ id: 'msg-resend-' + capturedAuthHeaders.length });
    }
    return Response.json({ id: 'mock-upstream' });
  };

  try {
    const env = {
      DB: db,
      LOCAL_DEV: 'true',
      LOCAL_ADMIN_TOKEN: adminToken,
      CONFIG_ENCRYPTION_KEY: encryptionKey,
      DEFAULT_SENDER: 'no-reply@mail.neopathshala.com',
      FALLBACK_ORDER: 'resend,brevo,mailgun',
    };

    // Seed two distinct tenant users in admin_users
    await db.prepare(`
      INSERT INTO admin_users (subject, role, is_active, created_at, created_by) VALUES
      ('tenantA@neopathshala.com', 'admin', 1, unixepoch(), 'bootstrap'),
      ('tenantB@neopathshala.com', 'admin', 1, unixepoch(), 'bootstrap')
    `).run();

    const call = (subject, path, opts = {}) =>
      worker.fetch(new Request('http://localhost' + path, opts), {
        ...env,
        LOCAL_DEV_SUBJECT: subject,
      });

    // Helper to log in a tenant and return their session cookie
    const login = async subject => {
      const res = await call(subject, '/admin/login', {
        method: 'POST',
        headers: { origin: 'http://localhost', 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ admin_token: adminToken }),
      });
      assert.equal(res.status, 303, `Login should succeed for ${subject}`);
      return res.headers.get('set-cookie').split(';')[0];
    };

    const getCsrf = async subject =>
      (await db.prepare('SELECT csrf_token FROM admin_sessions WHERE access_subject=?').bind(subject).first('csrf_token'));

    const post = async (subject, cookie, path, data) =>
      call(subject, path, {
        method: 'POST',
        headers: { cookie, origin: 'http://localhost', 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ csrf: await getCsrf(subject), ...data }),
      });

    const cookieA = await login('tenantA@neopathshala.com');
    const cookieB = await login('tenantB@neopathshala.com');

    // 1. Both tenants configure their respective domains and sender identities
    await post('tenantA@neopathshala.com', cookieA, '/admin/domains/create', { domain: 'clienta.com', display_name: 'Client A' });
    await db.prepare('UPDATE managed_domains SET is_verified=1 WHERE domain=?').bind('clienta.com').run();
    await post('tenantA@neopathshala.com', cookieA, '/admin/identities/create', { email_address: 'support@clienta.com', display_name: 'Support A' });

    await post('tenantB@neopathshala.com', cookieB, '/admin/domains/create', { domain: 'clientb.com', display_name: 'Client B' });
    await db.prepare('UPDATE managed_domains SET is_verified=1 WHERE domain=?').bind('clientb.com').run();
    await post('tenantB@neopathshala.com', cookieB, '/admin/identities/create', { email_address: 'billing@clientb.com', display_name: 'Billing B' });

    // 2. Tenant A and Tenant B save separate Resend API keys
    const rawKeyA = 're_live_TenantA_SuperSecret_9876543210';
    const rawKeyB = 're_live_TenantB_DifferentSecret_0123456789';

    const saveA = await post('tenantA@neopathshala.com', cookieA, '/admin/account-keys/save', {
      provider: 'resend',
      api_key: rawKeyA,
    });
    assert.equal(saveA.status, 303);

    const saveB = await post('tenantB@neopathshala.com', cookieB, '/admin/account-keys/save', {
      provider: 'resend',
      api_key: rawKeyB,
    });
    assert.equal(saveB.status, 303);

    // 3. Inspect SQLite directly: Raw secrets MUST NOT exist anywhere in plaintext
    const rows = (await db.prepare('SELECT * FROM account_provider_keys ORDER BY owner_subject').all()).results;
    assert.equal(rows.length, 2, 'Should have exactly 2 stored provider key rows');

    for (const r of rows) {
      assert.ok(!r.encrypted_key.includes('TenantA'), 'Plaintext A must not exist in SQLite');
      assert.ok(!r.encrypted_key.includes('TenantB'), 'Plaintext B must not exist in SQLite');
      assert.ok(!r.encrypted_key.includes('SuperSecret'), 'Plaintext secret must not exist in SQLite');
      // Format must be AES-256-GCM iv.ciphertext
      const parts = r.encrypted_key.split('.');
      assert.equal(parts.length, 2, 'Stored encrypted key must be base64(iv).base64(ciphertext)');
    }

    // Verify row for Tenant A
    const rowA = rows.find(r => r.owner_subject === 'tenantA@neopathshala.com');
    assert.ok(rowA);
    assert.equal(rowA.key_hint, 're_••••••••3210');
    // Verify decryption succeeds with Tenant A's AAD
    const decryptedA = await decrypt(encryptionKey, rowA.encrypted_key, 'tenantA@neopathshala.com:resend');
    assert.equal(decryptedA, rawKeyA);

    // Verify cross-tenant tampering / splicing protection:
    // Decrypting Tenant A's ciphertext using Tenant B's identity MUST fail due to AES-GCM authentication tag mismatch!
    await assert.rejects(
      async () => {
        await decrypt(encryptionKey, rowA.encrypted_key, 'tenantB@neopathshala.com:resend');
      },
      /operation failed|tag mismatch|decrypt/i
    );

    // 4. WRITE-ONLY CHECK: UI Dashboard must never leak the raw API key
    const settingsA = await call('tenantA@neopathshala.com', '/dashboard?view=settings', { headers: { cookie: cookieA } });
    assert.equal(settingsA.status, 200);
    const htmlA = await settingsA.text();

    assert.ok(!htmlA.includes(rawKeyA), 'Raw API key for Tenant A must NEVER be rendered in the HTML');
    assert.ok(!htmlA.includes(rawKeyB), 'Tenant B key must not appear in Tenant A view');
    assert.ok(htmlA.includes('re_••••••••3210'), 'Masked hint should be visible');
    assert.ok(htmlA.includes('Encrypted (AES-256-GCM)'), 'AES-256-GCM badge should be visible');
    assert.ok(htmlA.includes('strictly write-only'), 'Write-only zero-trust notice should be present');

    // 5. ISOLATED DISPATCH: Tenant A sends an email; upstream receives Tenant A's decrypted key
    const sendA = await post('tenantA@neopathshala.com', cookieA, '/admin/send-test', {
      from: 'support@clienta.com',
      to: 'userA@external.com',
      subject: 'Test Dispatch A',
      text: 'Message A',
      idempotency_key: 'idemp-test-a-12345678',
    });
    assert.equal(sendA.status, 303);
    assert.equal(capturedAuthHeaders.length, 1);
    assert.equal(capturedAuthHeaders[0].auth, `Bearer ${rawKeyA}`);

    // 6. ISOLATED DISPATCH: Tenant B sends an email; upstream receives Tenant B's decrypted key
    const sendB = await post('tenantB@neopathshala.com', cookieB, '/admin/send-test', {
      from: 'billing@clientb.com',
      to: 'userB@external.com',
      subject: 'Test Dispatch B',
      text: 'Message B',
      idempotency_key: 'idemp-test-b-12345678',
    });
    assert.equal(sendB.status, 303);
    assert.equal(capturedAuthHeaders.length, 2);
    assert.equal(capturedAuthHeaders[1].auth, `Bearer ${rawKeyB}`);

    // 7. AUDIT LOG ISOLATION: Tenant A cannot see Tenant B's dispatched mail
    const mailViewA = await call('tenantA@neopathshala.com', '/dashboard?view=mail', { headers: { cookie: cookieA } });
    const mailHtmlA = await mailViewA.text();
    assert.ok(mailHtmlA.includes('Test Dispatch A'), 'Tenant A sees their own email');
    assert.ok(!mailHtmlA.includes('Test Dispatch B'), 'Tenant A must NOT see Tenant B email');

    // 8. API CLIENT ISOLATION: Tenant A generates an API client and dispatches via /api/v1/send
    const clientRes = await post('tenantA@neopathshala.com', cookieA, '/admin/api-clients/create', {
      name: 'Tenant A Backend',
      sender_address: 'support@clienta.com',
    });
    assert.equal(clientRes.status, 303);
    const createdKey = new URL(clientRes.headers.get('location'), 'http://localhost').searchParams.get('created_key');
    assert.ok(createdKey, 'API client token should be generated');

    const apiDispatchRes = await worker.fetch(new Request('http://localhost/api/v1/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${createdKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': 'api-idemp-test-tenant-a-12345',
      },
      body: JSON.stringify({
        from: 'support@clienta.com',
        to: 'apiuser@external.com',
        subject: 'Programmatic Dispatch A',
        html: '<p>From API</p>',
      }),
    }), env);

    assert.equal(apiDispatchRes.status, 200);
    const apiJson = await apiDispatchRes.json();
    assert.equal(apiJson.success, true);
    assert.equal(capturedAuthHeaders.length, 3);
    assert.equal(capturedAuthHeaders[2].auth, `Bearer ${rawKeyA}`, 'API dispatch for Tenant A must use Tenant A decrypted key');

  } finally {
    globalThis.fetch = originalFetch;
  }
});
