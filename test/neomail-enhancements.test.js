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

  // 7. Verify superadmin domain separation for other tenant domains
  await db.prepare("INSERT INTO managed_domains (domain,display_name,is_verified,created_at,created_by,owner_subject,verification_token) VALUES ('tenant-client.com','Tenant Client',0,unixepoch(),'other-admin','other-tenant@neomail.internal','other-token-1234')").run();
  const superDomainsRes = await call('super@neomail.internal', '/admin/domains', { headers: { cookie: superCookie } });
  const superDomainsHtml = await superDomainsRes.text();
  assert.ok(superDomainsHtml.includes('Tenant domains · Other admin workspaces'), 'Must separate other tenant domains into dedicated section in superadmin panel');
  assert.ok(superDomainsHtml.includes('other-tenant@neomail.internal'), 'Must show owning admin workspace tag');
  assert.ok(superDomainsHtml.includes('tenant-client.com'), 'Must list other admin domain');

  // 8. Verify Documentation page hides pagehead (2nd image contents)
  const docsRes = await call('super@neomail.internal', '/admin/docs', { headers: { cookie: superCookie } });
  const docsHtml = await docsRes.text();
  assert.ok(!docsHtml.includes('class="pagehead"'), 'Must hide pagehead on docs view');
  assert.ok(docsHtml.includes('Documentation Content & Live Editor'), 'Must still render docs editor panel');

  // 9. Verify Dark mode hover color is darker than primary, and selection text is black
  assert.ok(superDomainsHtml.includes('--accent: #10b981;'), 'Dark mode primary accent must be emerald green');
  assert.ok(superDomainsHtml.includes('--accent-hover: #059669;'), 'Hover color must be darker than primary accent');
  assert.ok(superDomainsHtml.includes('color: #000000 !important;'), 'Selection text color must be black');

  // 10. Verify Viewport lock & scroll glitch prevention CSS
  assert.ok(superDomainsHtml.includes('overscroll-behavior: none;'), 'Must have overscroll-behavior none to stop bounce space');
  assert.ok(superDomainsHtml.includes('position: fixed;'), 'Must lock html/body fixed position to prevent scroll drift');

  // 11. Verify Profile Settings (3rd image design)
  const settingsRes = await call('super@neomail.internal', '/admin/settings', { headers: { cookie: superCookie } });
  const settingsHtml = await settingsRes.text();
  assert.ok(settingsHtml.includes('Profile photo'), 'Must render Profile photo heading');
  assert.ok(settingsHtml.includes('avatar-squircle'), 'Must render squircle avatar container');
  assert.ok(settingsHtml.includes('btn-camera-trigger'), 'Must render camera badge overlay trigger');
  assert.ok(settingsHtml.includes('Change photo'), 'Must render Change photo button');
  assert.ok(settingsHtml.includes('JPG, PNG, or WebP · Up to 3 MB'), 'Must render 3 MB WebP hint');

  // 12. Verify Deleting domains (both superadmin and tenant)
  await db.prepare("INSERT INTO managed_domains (domain,display_name,is_verified,created_at,created_by,owner_subject,verification_token) VALUES ('unused-domain.com','Unused',0,unixepoch(),'super','super@neomail.internal','token-del')").run();
  const delRes = await superPost('/admin/domains/delete', { domain: 'unused-domain.com' });
  assert.equal(delRes.status, 303, 'Delete domain should redirect');
  const checkDeleted = await db.prepare("SELECT 1 FROM managed_domains WHERE domain='unused-domain.com'").first();
  assert.ok(!checkDeleted, 'Domain must be removed from managed_domains');

  // 13. Verify Superadmin cannot create identities on another admin's verified domain
  await db.prepare("INSERT INTO managed_domains (domain,display_name,is_verified,created_at,created_by,owner_subject,verification_token) VALUES ('tenant-verified.com','Tenant Verified',1,unixepoch(),'other','tenant@neomail.internal','token-tv')").run();
  const identityHijackRes = await superPost('/admin/identities/create', {
    email_address: 'admin@tenant-verified.com',
    display_name: 'Hijacked Identity'
  });
  assert.equal(identityHijackRes.status, 422, 'Superadmin must NOT be able to create identities on other admins verified domains');

  // 14. Verify Security Events pagination (10 per page limit)
  for (let i = 0; i < 25; i++) {
    await db.prepare("INSERT INTO security_audit_logs (id, unix_timestamp, ip_address, user_agent, event_type, details) VALUES (?, unixepoch() - ?, '127.0.0.1', 'Node/Test', 'TEST_EVENT', ?)").bind(crypto.randomUUID(), i, `Audit event #${i}`).run();
  }
  const secPage1Res = await call('super@neomail.internal', '/admin/security?page=1', { headers: { cookie: superCookie } });
  const secPage1Html = await secPage1Res.text();
  assert.ok(secPage1Html.includes('Page 1 of'), 'Must render pagination page info');
  assert.ok(secPage1Html.includes('Showing 1–10 of'), 'Must limit to 10 events per page');
  assert.ok(secPage1Html.includes('Next'), 'Must have Next button');

  // 15. Verify Provider Sending Limits and Usage
  // Set limit via POST
  const limitRes = await superPost('/admin/providers/limit', {
    provider: 'resend',
    limit: '250',
    from_view: 'providers'
  });
  assert.equal(limitRes.status, 303, 'Setting provider limit should redirect');
  const storedLimit = await db.prepare("SELECT send_limit FROM provider_limits WHERE owner_subject='super@neomail.internal' AND provider_name='resend'").first('send_limit');
  assert.equal(storedLimit, 250, 'Stored limit in provider_limits table must match');

  // Superadmin setting limit for another user workspace
  const userLimitRes = await superPost('/admin/providers/limit', {
    target_user: 'tenant@neomail.internal',
    provider: 'resend',
    limit: '50',
    from_view: 'providers'
  });
  assert.equal(userLimitRes.status, 303);
  const tenantLimit = await db.prepare("SELECT send_limit FROM provider_limits WHERE owner_subject='tenant@neomail.internal' AND provider_name='resend'").first('send_limit');
  assert.equal(tenantLimit, 50, 'Tenant limit set by superadmin must be stored');

  // Verify Provider limits UI rendering
  const provPageRes = await call('super@neomail.internal', '/admin/providers', { headers: { cookie: superCookie } });
  const provPageHtml = await provPageRes.text();
  assert.ok(provPageHtml.includes('Provider Usage & Sending Limits'), 'Must render provider limits section');
  assert.ok(provPageHtml.includes('limit'), 'Must render limit count');
  assert.ok(provPageHtml.includes('Set Provider Limit Per User Workspace'), 'Must render per-user limits section');
  assert.ok(provPageHtml.includes('tenant@neomail.internal'), 'Must list configured tenant in per-user limits');

  // 16. Verify Tenant updating limit from Settings and deleting own domain
  const tenantCsrf = await getCsrf('tenant@neomail.internal');
  const tenantLimitRes = await call('tenant@neomail.internal', '/dashboard/providers/limit', {
    method: 'POST',
    headers: { cookie: tenantCookie, origin: 'http://localhost', 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ csrf: tenantCsrf, provider: 'brevo', limit: '75', from_view: 'settings' })
  });
  assert.equal(tenantLimitRes.status, 303);
  assert.ok(tenantLimitRes.headers.get('location').includes('/dashboard/settings'), 'Should redirect back to dashboard settings');

  // Verify settings page renders provider limits for tenant
  const tenantSettingsRes = await call('tenant@neomail.internal', '/dashboard/settings', { headers: { cookie: tenantCookie } });
  const tenantSettingsHtml = await tenantSettingsRes.text();
  assert.ok(tenantSettingsHtml.includes('Provider Sending Limits (Your Workspace)'), 'Settings must render provider limits panel');
  assert.ok(tenantSettingsHtml.includes('BREVO'), 'Must display configured provider in limits panel');

  // Tenant deletes own domain
  await db.prepare("INSERT INTO managed_domains (domain,display_name,is_verified,created_at,created_by,owner_subject,verification_token) VALUES ('tenant-to-delete.com','To Delete',0,unixepoch(),'tenant@neomail.internal','tenant@neomail.internal','del-tok')").run();
  const tenantDelRes = await call('tenant@neomail.internal', '/dashboard/domains/delete', {
    method: 'POST',
    headers: { cookie: tenantCookie, origin: 'http://localhost', 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ csrf: tenantCsrf, domain: 'tenant-to-delete.com' })
  });
  assert.equal(tenantDelRes.status, 303);
  const checkTenantDel = await db.prepare("SELECT 1 FROM managed_domains WHERE domain='tenant-to-delete.com'").first();
  assert.ok(!checkTenantDel, 'Tenant domain must be deleted');

  // 17. Verify Add domain placeholders
  const domainsRes = await call('super@neomail.internal', '/admin/domains', { headers: { cookie: superCookie } });
  const domainsHtml = await domainsRes.text();
  assert.ok(domainsHtml.includes('placeholder="mail.your-domain.com"'), 'Domain input must have mail.your-domain.com placeholder');
  assert.ok(domainsHtml.includes('placeholder="e.g. yourDomain Mail"'), 'Display name input must have e.g. yourDomain Mail placeholder');

  // 18. Verify Docs Studio layout and full-height studio architecture
  const studioDocsRes = await call('super@neomail.internal', '/admin/docs', { headers: { cookie: superCookie } });
  const studioDocsHtml = await studioDocsRes.text();
  assert.ok(studioDocsHtml.includes('docs-main-studio'), 'Docs page main must have docs-main-studio class');
  assert.ok(studioDocsHtml.includes('docs-studio-sidebar-left'), 'Must render left navigation sidebar');
  assert.ok(studioDocsHtml.includes('docs-studio-sidebar-right'), 'Must render right projects sidebar');
  assert.ok(studioDocsHtml.includes('studio-projects-container'), 'Must render projects container');
  assert.ok(studioDocsHtml.includes('neoCodebase Workspace'), 'Must reference neoCodebase integration');

  // 19. Verify removal of old infrastructure footnote across pages
  assert.ok(!domainsHtml.includes('neoMail · Private transactional email infrastructure · UTC'), 'Footnote must be removed from domains page');
  assert.ok(!studioDocsHtml.includes('neoMail · Private transactional email infrastructure · UTC'), 'Footnote must be removed from docs page');
});
