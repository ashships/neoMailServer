import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import worker from '../src/index.js';
import * as ui from '../src/ui.js';
import { rate, HttpError } from '../src/security.js';
import { database } from './local-db.js';

const schema = () => readFile('schema.sql', 'utf8');

test('errorPage renders the modern mascot layout and dynamic countdown timer for 429', () => {
  const html = ui.errorPage('Rate limit exceeded', 429, 120, 'test-nonce');
  
  assert.ok(html.includes('<!doctype html>'));
  assert.ok(html.includes('Too Many Attempts'), 'Must display Too Many Attempts title');
  assert.ok(html.includes('429'), 'Must include 429 status code');
  assert.ok(html.includes('Try again in'), 'Must include countdown notice');
  assert.ok(html.includes('2:00 min'), 'Must show formatted countdown time for 120 seconds');
  assert.ok(html.includes('Try Again'), 'Must include Try Again action button');
  assert.ok(html.includes('Return to workspace'), 'Must include Return to workspace link');
  assert.ok(html.includes('error-page-svg'), 'Must render vector illustration SVG');
  assert.ok(html.includes('neomail-rate-timer'), 'Must include dynamic timer container');
  assert.ok(html.includes('test-nonce'), 'Must bind countdown script to CSP nonce');
});

test('errorPage adapts cleanly for 404, 403, and 500 error codes', () => {
  // 404 Not Found
  const notFoundHtml = ui.errorPage('Page does not exist', 404);
  assert.ok(notFoundHtml.includes('Page Not Found'));
  assert.ok(notFoundHtml.includes('404'));
  assert.ok(notFoundHtml.includes('Return to workspace'));
  assert.ok(notFoundHtml.includes('Back to Sign In'));

  // 403 Access Restricted
  const forbiddenHtml = ui.errorPage('Permission denied', 403);
  assert.ok(forbiddenHtml.includes('Access Restricted'));
  assert.ok(forbiddenHtml.includes('403'));

  // 500 Internal Error
  const serverErrorHtml = ui.errorPage('Internal database error', 500);
  assert.ok(serverErrorHtml.includes('Something Went Wrong'));
  assert.ok(serverErrorHtml.includes('500'));
  assert.ok(serverErrorHtml.includes('Reload page'));
});

test('rate limit triggers 429 with Retry-After and renders countdown in worker response', async () => {
  const db = database(await schema());
  await db.prepare("INSERT INTO app_settings (name, value, updated_at) VALUES ('MAX_LOGIN_ATTEMPTS', '2', unixepoch())").run();
  const env = {
    DB: db,
    LOCAL_DEV: 'false',
    EMAIL_OTP_LOGIN: 'true',
    ALLOW_TOKEN_LOGIN: 'false',
    CONFIG_ENCRYPTION_KEY: randomBytes(32).toString('base64'),
    MAX_LOGIN_ATTEMPTS: '2',
  };
  
  try {
    // 1. Direct rate() unit test verifying retryAfter calculation
    await rate(env, 'unit-rate-key', 1, 60);
    
    let caughtErr = null;
    try {
      await rate(env, 'unit-rate-key', 1, 60);
    } catch (err) {
      caughtErr = err;
    }

    assert.ok(caughtErr instanceof HttpError);
    assert.equal(caughtErr.status, 429);
    assert.ok(typeof caughtErr.retryAfter === 'number');
    assert.ok(caughtErr.retryAfter > 0 && caughtErr.retryAfter <= 60);

    // 2. Integration test through worker.fetch for UI path
    const req = () => new Request('https://mail.example.com/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        origin: 'https://mail.example.com',
        accept: 'text/html',
        'cf-connecting-ip': '198.51.100.42',
      },
      body: new URLSearchParams({ step: 'request', email: 'test@example.com' }),
    });

    // Make attempts: 1st and 2nd consume the quota
    await worker.fetch(req(), env);
    await worker.fetch(req(), env);
    
    // 3rd attempt exceeds quota and hits rate limit
    const rateLimitedRes = await worker.fetch(req(), env);

    assert.equal(rateLimitedRes.status, 429);
    assert.ok(rateLimitedRes.headers.get('Retry-After'), 'Must include Retry-After header');
    const text = await rateLimitedRes.text();
    assert.ok(text.includes('Too Many Attempts'), 'Must render rate limit UI title');
    assert.ok(text.includes('Try again in'), 'Must display time in rate limits error page');
    assert.ok(text.includes('Try Again'), 'Must provide Try Again button');
    assert.ok(text.includes('error-page-svg'), 'Must render illustration SVG');
  } finally {
    db.close();
  }
});
