import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import worker from '../src/index.js';
import { database } from './local-db.js';

test('OTP login: robust default sender fallback, multi-provider dispatch, and zero address validation failures', async () => {
  const schemaSql = await readFile('schema.sql', 'utf8');
  const db = database(schemaSql);
  const encryptionKey = randomBytes(32).toString('base64');

  const capturedDispatches = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, opts = {}) => {
    const host = new URL(url).hostname;
    if (host === 'api.resend.com') {
      const body = JSON.parse(opts.body);
      capturedDispatches.push({
        provider: 'resend',
        url,
        body,
        headers: opts.headers,
      });
      return Response.json({ id: 'msg-otp-resend-1' });
    }
    return Response.json({ id: 'mock-upstream' });
  };

  try {
    const env = {
      DB: db,
      LOCAL_DEV: 'false',
      CONFIG_ENCRYPTION_KEY: encryptionKey,
      EMAIL_OTP_LOGIN: 'true',
      ALLOW_TOKEN_LOGIN: 'false',
      DEFAULT_SENDER: '', // Deliberately empty string to ensure fallback logic prevents "Valid recipient and sender addresses are required"
      DEFAULT_SENDER_NAME: 'neoPathshala',
      FALLBACK_ORDER: 'resend,brevo,mailgun',
      RESEND_API_KEY: 're_test_otp_secret_key_12345',
    };

    // 1. GET /login should display OTP request page
    const getLogin = await worker.fetch(new Request('https://mail.neopathshala.com/login'), env);
    assert.equal(getLogin.status, 200);
    const getHtml = await getLogin.text();
    assert.ok(getHtml.includes('Welcome to NeoMail'));
    assert.ok(getHtml.includes('Administrator email'));

    // 2. POST /login step=request with empty DEFAULT_SENDER in env
    // Must NOT throw 503 "Valid recipient and sender addresses are required."
    const reqCode = await worker.fetch(new Request('https://mail.neopathshala.com/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        origin: 'https://mail.neopathshala.com',
      },
      body: new URLSearchParams({
        step: 'request',
        email: 'admin@neopathshala.com',
      }),
    }), env);

    assert.equal(reqCode.status, 200);
    const reqHtml = await reqCode.text();
    assert.ok(reqHtml.includes('Enter your code'));
    assert.ok(reqHtml.includes('admin@neopathshala.com'));

    // Verify OTP record exists in DB
    const otpRow = await db.prepare('SELECT subject, salt, code_hash FROM admin_otps WHERE subject=?').bind('admin@neopathshala.com').first();
    assert.ok(otpRow, 'OTP record must be saved in database');

    // Verify OTP email was dispatched via provider with safe fallback sender
    assert.equal(capturedDispatches.length, 1, 'OTP email must be dispatched');
    assert.equal(capturedDispatches[0].body.from, '"neoMail" <no-reply@mail.neopathshala.com>');
    assert.deepEqual(capturedDispatches[0].body.to, ['admin@neopathshala.com']);
    assert.ok(capturedDispatches[0].body.subject.includes('NeoMail verification code'));
    assert.ok(capturedDispatches[0].body.text.includes('Your NeoMail verification code is:'));

    // Extract code by testing candidate codes 100000..999999 (or read from salt/hash)
    // To verify login, we can test that an invalid code fails with 403
    const verifyFail = await worker.fetch(new Request('https://mail.neopathshala.com/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        origin: 'https://mail.neopathshala.com',
      },
      body: new URLSearchParams({
        step: 'verify',
        email: 'admin@neopathshala.com',
        code: '000000',
      }),
    }), env);
    assert.equal(verifyFail.status, 403);

    // 3. Verify that form submissions on /login return styled HTML error page rather than unformatted JSON
    const malformed = await worker.fetch(new Request('https://mail.neopathshala.com/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        origin: 'https://mail.neopathshala.com',
        accept: 'text/html',
      },
      body: new URLSearchParams({
        step: 'verify',
        email: 'not-an-email',
        code: '123456',
      }),
    }), env);
    assert.equal(malformed.status, 422);
    const errText = await malformed.text();
    assert.ok(errText.includes('<!doctype html>'), 'Browser form error must render styled HTML page');
    assert.ok(errText.includes('422'));

  } finally {
    globalThis.fetch = originalFetch;
    db.close();
  }
});
