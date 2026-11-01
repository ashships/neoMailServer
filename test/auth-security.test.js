import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import worker from '../src/index.js';
import { database } from './local-db.js';

test('auth security: only superadmin-provisioned accounts can request OTP and login, unregistered emails rejected before dispatch', async () => {
  const schemaSql = await readFile('schema.sql', 'utf8');
  const db = database(schemaSql);
  const encryptionKey = randomBytes(32).toString('base64');

  const dispatchedEmails = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, opts = {}) => {
    dispatchedEmails.push({ url, opts });
    return Response.json({ id: 'msg-otp-test' });
  };

  try {
    const env = {
      DB: db,
      LOCAL_DEV: 'false',
      CONFIG_ENCRYPTION_KEY: encryptionKey,
      EMAIL_OTP_LOGIN: 'true',
      ALLOW_TOKEN_LOGIN: 'false',
      DEFAULT_SENDER: 'no-reply@mail.neopathshala.com',
      DEFAULT_SENDER_NAME: 'neoMail',
      FALLBACK_ORDER: 'resend',
      RESEND_API_KEY: 're_test_key_123',
    };

    // 1. Initial superadmin bootstrap: when directory is empty, first user can register
    const initialReq = await worker.fetch(new Request('https://mail.neopathshala.com/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        origin: 'https://mail.neopathshala.com',
        'cf-connecting-ip': '10.0.0.1',
      },
      body: new URLSearchParams({ step: 'request', email: 'owner@neomail.internal' }),
    }), env);
    assert.equal(initialReq.status, 200);
    assert.equal(dispatchedEmails.length, 1, 'Initial bootstrap sends OTP');

    // Simulate OTP verification for bootstrap user
    const bootstrapOtp = await db.prepare('SELECT salt, code_hash FROM admin_otps WHERE subject=?').bind('owner@neomail.internal').first();
    assert.ok(bootstrapOtp);
    await db.prepare('INSERT INTO admin_users (subject, role, is_active, created_at, created_by) VALUES (?, ?, 1, unixepoch(), ?)').bind('owner@neomail.internal', 'superadmin', 'bootstrap').run();

    // Directory now has 1 user (owner@neomail.internal).
    // Reset dispatchedEmails counter
    dispatchedEmails.length = 0;

    // 2. UNREGISTERED USER attempts to request OTP
    // "first check and then only send the otp as we have limited number of emails for sending"
    const unregReq = await worker.fetch(new Request('https://mail.neopathshala.com/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        origin: 'https://mail.neopathshala.com',
        'cf-connecting-ip': '10.0.0.2',
      },
      body: new URLSearchParams({ step: 'request', email: 'attacker@evil.com' }),
    }), env);

    assert.equal(unregReq.status, 403, 'Unregistered user must be rejected with 403');
    const unregHtml = await unregReq.text();
    assert.ok(unregHtml.includes("We couldn&#39;t find an account associated with this email address. Please check your email address."), 'Must display friendly error banner');
    assert.ok(unregHtml.includes('class="notice error" role="alert"'), 'Must have notice error banner');
    assert.ok(unregHtml.includes('<svg'), 'Must have alert icon in error banner');
    assert.ok(unregHtml.indexOf('Administrator email') < unregHtml.indexOf('notice error'), 'Error must be displayed below the email input field');
    assert.ok(unregHtml.includes('value="attacker@evil.com"'), 'Must retain entered email in field');
    assert.ok(!unregHtml.includes('provisioned by the superadmin'), 'Must not disclose provisioning or internal roles');
    assert.equal(dispatchedEmails.length, 0, 'ZERO emails must be dispatched to unregistered users — saves quota!');

    const attackerOtp = await db.prepare('SELECT * FROM admin_otps WHERE subject=?').bind('attacker@evil.com').first();
    assert.equal(attackerOtp, null, 'No OTP row should be created for unregistered user');

    // 3. UNREGISTERED USER attempts to verify arbitrary code
    const unregVerify = await worker.fetch(new Request('https://mail.neopathshala.com/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        origin: 'https://mail.neopathshala.com',
        'cf-connecting-ip': '10.0.0.3',
      },
      body: new URLSearchParams({ step: 'verify', email: 'attacker@evil.com', code: '123456' }),
    }), env);
    assert.equal(unregVerify.status, 403);
    const attackerUser = await db.prepare('SELECT * FROM admin_users WHERE subject=?').bind('attacker@evil.com').first();
    assert.equal(attackerUser, null, 'Attacker must NOT be inserted into admin_users under any circumstances');

    // 4. Superadmin provisions a new tenant admin: tenant@company.com
    await db.prepare("INSERT INTO admin_users (subject, role, is_active, created_at, created_by) VALUES ('tenant@company.com', 'admin', 1, unixepoch(), 'owner@neomail.internal')").run();

    // 5. Provisioned tenant can now request OTP
    const tenantReq = await worker.fetch(new Request('https://mail.neopathshala.com/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        origin: 'https://mail.neopathshala.com',
        'cf-connecting-ip': '10.0.0.4',
      },
      body: new URLSearchParams({ step: 'request', email: 'tenant@company.com' }),
    }), env);
    assert.equal(tenantReq.status, 200, 'Provisioned tenant must receive 200 OTP verify form');
    assert.equal(dispatchedEmails.length, 1, 'OTP must be sent to provisioned tenant');

    const tenantOtp = await db.prepare('SELECT salt, code_hash FROM admin_otps WHERE subject=?').bind('tenant@company.com').first();
    assert.ok(tenantOtp, 'Tenant OTP must be in database');

    // 6. Inactive / revoked admin cannot request OTP
    await db.prepare("UPDATE admin_users SET is_active=0 WHERE subject='tenant@company.com'").run();
    dispatchedEmails.length = 0;

    const revokedReq = await worker.fetch(new Request('https://mail.neopathshala.com/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        origin: 'https://mail.neopathshala.com',
        'cf-connecting-ip': '10.0.0.5',
      },
      body: new URLSearchParams({ step: 'request', email: 'tenant@company.com' }),
    }), env);
    assert.equal(revokedReq.status, 403);
    assert.equal(dispatchedEmails.length, 0, 'Revoked user must NOT receive OTP email');
    const revokedHtml = await revokedReq.text();
    assert.ok(revokedHtml.includes("We couldn&#39;t find an account associated with this email address"));

  } finally {
    globalThis.fetch = originalFetch;
    db.close();
  }
});
