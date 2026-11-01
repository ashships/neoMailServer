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
    assert.equal(capturedDispatches[0].body.from, '"neoMailer" <no-reply@mail.neopathshala.com>');
    assert.deepEqual(capturedDispatches[0].body.to, ['admin@neopathshala.com']);
    assert.ok(capturedDispatches[0].body.subject.includes('neoMailer verification code'));
    assert.ok(capturedDispatches[0].body.text.includes('Your neoMailer verification code is:'));

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
    assert.ok(errText.includes('Return to workspace'));
    assert.ok(errText.includes('Back to Sign In'));

    // 4. Corrupt secret in app_settings must not throw 500 error during config decryption
    await db.prepare("INSERT INTO app_settings (name, value, is_secret, updated_at) VALUES ('RESEND_API_KEY', 'corrupt_iv:corrupt_ciphertext', 1, unixepoch()) ON CONFLICT(name) DO UPDATE SET value=excluded.value, is_secret=1").run();

    const corruptPost = await worker.fetch(new Request('https://mail.neopathshala.com/login', {
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

    // Must be handled gracefully (either 200 if other credentials suffice, or 503 if provider dispatch fails, but NEVER unhandled 500)
    assert.notEqual(corruptPost.status, 500, 'Corrupt encrypted setting must not crash with 500');

    // 5. Favicon endpoints
    const favIco = await worker.fetch(new Request('https://mail.neopathshala.com/favicon.ico'), env);
    assert.equal(favIco.status, 200);
    assert.equal(favIco.headers.get('content-type'), 'image/svg+xml; charset=utf-8');
    const favSvg = await favIco.text();
    assert.ok(favSvg.includes('#087d54'), 'Favicon must use primary neoPathshala green #087d54');
    assert.ok(!favSvg.includes("fill='#34d399'"), 'Favicon must not include green dot');

    const favSvgEndpoint = await worker.fetch(new Request('https://mail.neopathshala.com/favicon.svg'), env);
    assert.equal(favSvgEndpoint.status, 200);

    // 6. Zero drop shadows in platform theme
    const loginHtml = await (await worker.fetch(new Request('https://mail.neopathshala.com/login'), env)).text();
    assert.ok(loginHtml.includes('--shadow-xs: none;'), 'Shadow variables must be none');
    assert.ok(loginHtml.includes('--shadow-sm: none;'), 'Shadow variables must be none');
    assert.ok(loginHtml.includes('--shadow-md: none;'), 'Shadow variables must be none');
    assert.ok(loginHtml.includes('--shadow-lg: none;'), 'Shadow variables must be none');
    // Ensure no active box-shadow rules in CSS
    assert.ok(!loginHtml.includes('box-shadow: 0 1px 3px rgba(8, 125, 84'), 'Explicit box shadows must be eliminated');
    assert.ok(!loginHtml.includes('box-shadow: 0 2px 5px'), 'Explicit box shadows must be eliminated');

  } finally {
    globalThis.fetch = originalFetch;
    db.close();
  }
});
