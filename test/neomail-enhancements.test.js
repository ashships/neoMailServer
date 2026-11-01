import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import worker from '../src/index.js';
import { database } from './local-db.js';

test('neoMail enhancements: clean slugs, dark mode hover, SPA encrypted cache, DNS auto-check and scam protection', async () => {
  const db = database(await readFile('schema.sql', 'utf8'));
  const token = randomBytes(32).toString('base64url');
  const env = {
    DB: db,
    LOCAL_DEV: 'true',
    LOCAL_ADMIN_TOKEN: token,
    CONFIG_ENCRYPTION_KEY: randomBytes(32).toString('base64'),
    DEFAULT_SENDER: 'admin@verified-company.org',
  };

  await db.prepare("INSERT INTO admin_users (subject,role,is_active,created_at,created_by) VALUES ('super@neomail.internal','superadmin',1,unixepoch(),'bootstrap'),('tenant@neomail.internal','admin',1,unixepoch(),'super')").run();

  const call = (subject, path, opts = {}) => worker.fetch(new Request('http://localhost' + path, opts), { ...env, LOCAL_DEV_SUBJECT: subject });

  const login = async subject => {
    const res = await call(subject, '/admin/login', {
      method: 'POST',
      headers: { origin: 'http://localhost', 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ admin_token: token })
    });
    assert.equal(res.status, 303);
    return res.headers.get('set-cookie').split(';')[0];
  };

  const getCsrf = async subject => db.prepare('SELECT csrf_token FROM admin_sessions WHERE access_subject=?').bind(subject).first('csrf_token');

  const superCookie = await login('super@neomail.internal');
  const tenantCookie = await login('tenant@neomail.internal');

  const superPost = async (path, data) => call('super@neomail.internal', path, {
    method: 'POST',
    headers: { cookie: superCookie, origin: 'http://localhost', 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ csrf: await getCsrf('super@neomail.internal'), ...data })
  });

  // 1. Verify Clean Slug URL Routing for Superadmin
  for (const slug of ['overview', 'domains', 'providers', 'identities', 'settings', 'mail', 'compose']) {
    const res = await call('super@neomail.internal', `/admin/${slug}`, { headers: { cookie: superCookie } });
    assert.equal(res.status, 200, `/admin/${slug} must return 200 OK`);
    const html = await res.text();
    assert.ok(html.includes('id="app-main"'), 'Must have partial workspace main element');
    assert.ok(html.includes('neo<span>Mail</span>'), 'Must display neoMail platform brand');
    assert.ok(html.includes('href="/admin/overview"'), 'Navigation links must use clean slugs');
    assert.ok(html.includes('href="/admin/domains"'), 'Navigation links must use clean slugs');
    assert.ok(html.includes('id="spa-progress"'), 'Must include SPA progress bar element');
  }

  // 2. Verify Clean Slug URL Routing for Tenant
  for (const slug of ['overview', 'domains', 'identities', 'settings', 'mail']) {
    const res = await call('tenant@neomail.internal', `/dashboard/${slug}`, { headers: { cookie: tenantCookie } });
    assert.equal(res.status, 200, `/dashboard/${slug} must return 200 OK`);
  }

  // Tenant accessing superadmin-only clean slug is redirected to their dashboard
  const tenantForbidden = await call('tenant@neomail.internal', '/admin/providers', { headers: { cookie: tenantCookie } });
  assert.equal(tenantForbidden.status, 303);
  assert.equal(tenantForbidden.headers.get('location'), '/dashboard/providers');

  // 3. Verify Dark Mode Hover Styling and SVG centering rules
  const overviewRes = await call('super@neomail.internal', '/admin/overview', { headers: { cookie: superCookie } });
  const cssHtml = await overviewRes.text();
  assert.ok(cssHtml.includes('.theme-toggle-btn:hover'), 'Must have theme toggle hover rule');
  assert.ok(cssHtml.includes(':root[data-theme="dark"] .theme-toggle-btn:hover'), 'Must have dark mode toggle hover');
  assert.ok(cssHtml.includes('background: #0d100f !important;'), 'Dark mode hover must use deep obsidian dark color #0d100f');
  assert.ok(cssHtml.includes('.theme-toggle-btn span'), 'Theme toggle span must have centering flex rules');
  assert.ok(cssHtml.includes('line-height: 0;'), 'Must reset line-height on theme toggle span to center SVGs');

  // 4. Verify SPA Client Script and AES-GCM Encrypted LocalStorage Cache
  assert.ok(cssHtml.includes('crypto.subtle.importKey'), 'Must include Web Crypto AES-GCM key derivation');
  assert.ok(cssHtml.includes('crypto.subtle.encrypt'), 'Must include Web Crypto AES-GCM encryption');
  assert.ok(cssHtml.includes('crypto.subtle.decrypt'), 'Must include Web Crypto AES-GCM decryption');
  assert.ok(cssHtml.includes('neomail_spa_'), 'Must cache views encrypted in localStorage');
  assert.ok(cssHtml.includes('spa-refresh-btn'), 'Must have partial workspace refresh button');

  // 5. Verify Continuous DNS Auto-Check & Alerting
  // Add a test domain
  const addDomainRes = await superPost('/admin/domains/create', { domain: 'verified-company.org', display_name: 'Verified Org' });
  assert.equal(addDomainRes.status, 303);

  // Mark domain unverified to simulate DNS propagation lapse / failure
  await db.prepare('UPDATE managed_domains SET is_verified=0, verification_token=? WHERE domain=?')
    .bind('test-failed-token-12345', 'verified-company.org').run();

  // Try sending an email with unverified domain -> must be rejected with 422 to prevent scams/spoofing
  await db.prepare("INSERT INTO sender_identities (id,email_address,display_name,is_default,is_active,created_at,owner_subject) VALUES ('id-1','admin@verified-company.org','Admin',1,1,unixepoch(),'super@neomail.internal')").run();

  const sendAttempt = await superPost('/admin/send-test', {
    to: 'recipient@example.com',
    from: 'admin@verified-company.org',
    subject: 'Test delivery',
    message: 'Hello'
  });
  assert.equal(sendAttempt.status, 422, 'Sending from unverified domain must be halted to prevent scams');

  // Trigger manual domain verify which fails (token won't match live DNS)
  const verifyRes = await superPost('/admin/domains/verify', { domain: 'verified-company.org' });
  assert.equal(verifyRes.status, 303);

  // Check that security alert was inserted into admin_alerts
  const alerts = await db.prepare("SELECT * FROM admin_alerts WHERE domain=? AND type='DNS_FAILED' AND is_read=0").bind('verified-company.org').all();
  assert.ok(alerts.results.length > 0, 'Must record DNS_FAILED alert in admin_alerts');
  assert.ok(alerts.results[0].message.includes('DNS verification failed'));

  // Verify that active alert is displayed in UI page banner
  const pageWithAlert = await call('super@neomail.internal', '/admin/overview', { headers: { cookie: superCookie } });
  const alertHtml = await pageWithAlert.text();
  assert.ok(alertHtml.includes('dns-alert-banner'), 'Must render security alert banner in workspace');
  assert.ok(alertHtml.includes('Domain Security Alert · Outbound Mail Paused'), 'Banner must warn admin that mail is paused');
  assert.ok(alertHtml.includes('verified-company.org'), 'Banner must name the affected domain');

  // Test Auto-Check All DNS endpoint
  const autoCheckRes = await superPost('/admin/domains/auto-check', {});
  assert.equal(autoCheckRes.status, 303);
  assert.ok(autoCheckRes.headers.get('location').includes('notice='));

  // Now simulate successful DNS restoration
  await db.prepare("UPDATE managed_domains SET verification_token='bootstrap-verified' WHERE domain=?").bind('verified-company.org').run();
  const verifySuccess = await superPost('/admin/domains/verify', { domain: 'verified-company.org' });
  assert.equal(verifySuccess.status, 303);

  // Active alert must now be cleared (is_read = 1)
  const activeAlerts = await db.prepare("SELECT * FROM admin_alerts WHERE domain=? AND type='DNS_FAILED' AND is_read=0").bind('verified-company.org').all();
  assert.equal(activeAlerts.results.length, 0, 'Active DNS alert must be cleared once DNS is verified');

  // Domain status must be restored to 1
  const domainStatus = await db.prepare('SELECT is_verified FROM managed_domains WHERE domain=?').bind('verified-company.org').first('is_verified');
  assert.equal(domainStatus, 1, 'Domain must be verified');

  // Next page load must no longer show alert banner
  const pageRestored = await call('super@neomail.internal', '/admin/overview', { headers: { cookie: superCookie } });
  const restoredHtml = await pageRestored.text();
  assert.ok(!restoredHtml.includes('class="dns-alert-banner"'), 'Alert banner element must disappear once DNS is restored');
  assert.ok(!restoredHtml.includes('Domain Security Alert · Outbound Mail Paused'), 'Alert message must disappear');
});
