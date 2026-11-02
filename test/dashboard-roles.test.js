import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import worker from '../src/index.js';
import { database } from './local-db.js';

const token = randomBytes(32).toString('base64url');

test('unified /dashboard portal: superadmin and admin roles, role-specific menus, and strict permission barriers', async t => {
  const db = database(await readFile('schema.sql', 'utf8'));
  const baseEnv = {
    DB: db,
    LOCAL_DEV: 'true',
    LOCAL_ADMIN_TOKEN: token,
    CONFIG_ENCRYPTION_KEY: randomBytes(32).toString('base64'),
    DEFAULT_SENDER: 'no-reply@example.com',
  };

  const call = (subject, path, opts = {}) =>
    worker.fetch(new Request('http://localhost' + path, opts), { ...baseEnv, LOCAL_DEV_SUBJECT: subject });

  await db.prepare(`
    INSERT INTO admin_users (subject, role, is_active, created_at, created_by)
    VALUES
      ('super@example.com', 'superadmin', 1, unixepoch(), 'bootstrap'),
      ('tenant@example.com', 'admin', 1, unixepoch(), 'super@example.com')
  `).run();

  const login = async subject => {
    const res = await call(subject, '/admin/login', {
      method: 'POST',
      headers: { origin: 'http://localhost', 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ admin_token: token })
    });
    assert.equal(res.status, 303, `${subject} login must redirect`);
    assert.equal(res.headers.get('location'), '/dashboard', `${subject} login must redirect to /dashboard`);
    return res.headers.get('set-cookie').split(';')[0];
  };

  const csrf = async subject =>
    db.prepare('SELECT csrf_token FROM admin_sessions WHERE access_subject=?').bind(subject).first('csrf_token');

  const post = async (subject, cookie, path, data = {}) =>
    call(subject, path, {
      method: 'POST',
      headers: { cookie, origin: 'http://localhost', 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ csrf: await csrf(subject), ...data })
    });

  const superCookie = await login('super@example.com');
  const tenantCookie = await login('tenant@example.com');

  // 1. Authenticated /login visit redirects directly to /dashboard
  const superLoginVisit = await call('super@example.com', '/login', { headers: { cookie: superCookie } });
  assert.equal(superLoginVisit.status, 303);
  assert.equal(superLoginVisit.headers.get('location'), '/dashboard');

  const tenantLoginVisit = await call('tenant@example.com', '/login', { headers: { cookie: tenantCookie } });
  assert.equal(tenantLoginVisit.status, 303);
  assert.equal(tenantLoginVisit.headers.get('location'), '/dashboard');

  // 2. Superadmin view access across all 11 dashboard views
  const superViews = ['overview', 'mail', 'providers', 'identities', 'clients', 'users', 'domains', 'docs', 'security', 'settings', 'setup'];
  for (const view of superViews) {
    const res = await call('super@example.com', `/dashboard/${view}`, { headers: { cookie: superCookie } });
    assert.equal(res.status, 200, `Superadmin must be able to view /dashboard/${view}`);
    const html = await res.text();
    assert.ok(html.includes('id="app-main"'), `/dashboard/${view} must render app-main container`);
  }

  // 3. Superadmin sidebar menu verification (all 11 items + Docs edit shortcut + Footer credit edit shortcut)
  const superOverviewRes = await call('super@example.com', '/dashboard/overview', { headers: { cookie: superCookie } });
  const superOverviewHtml = await superOverviewRes.text();

  for (const view of superViews) {
    assert.ok(superOverviewHtml.includes(`href="/dashboard/${view}"`), `Superadmin sidebar must include link to /dashboard/${view}`);
  }
  assert.ok(!superOverviewHtml.includes('side-docs-edit-btn'), 'Superadmin sidebar must not render Docs Studio edit shortcut');
  assert.ok(superOverviewHtml.includes('sidefoot-credit-edit'), 'Superadmin sidebar must render footer credit edit icon');
  assert.ok(superOverviewHtml.includes('/dashboard/security'), 'Superadmin profile dropdown must include Security events link');
  assert.ok(superOverviewHtml.includes('Delivery providers'), 'Superadmin overview must render Delivery providers panel');
  assert.ok(superOverviewHtml.includes('href="/dashboard/setup"'), 'Superadmin overview must link to Integration guide');

  // 4. Tenant admin view access across authorized 6 workspace views
  const tenantAllowedViews = ['overview', 'mail', 'identities', 'clients', 'domains', 'settings'];
  for (const view of tenantAllowedViews) {
    const res = await call('tenant@example.com', `/dashboard/${view}`, { headers: { cookie: tenantCookie } });
    assert.equal(res.status, 200, `Tenant admin must be able to view /dashboard/${view}`);
  }

  // 5. Tenant admin sidebar menu verification (strictly 6 items, no superadmin items)
  const tenantOverviewRes = await call('tenant@example.com', '/dashboard/overview', { headers: { cookie: tenantCookie } });
  const tenantOverviewHtml = await tenantOverviewRes.text();

  for (const view of tenantAllowedViews) {
    assert.ok(tenantOverviewHtml.includes(`href="/dashboard/${view}"`), `Tenant admin sidebar must include link to /dashboard/${view}`);
  }
  const superOnlyViews = ['providers', 'users', 'docs', 'security', 'setup'];
  for (const view of superOnlyViews) {
    assert.ok(!tenantOverviewHtml.includes(`href="/dashboard/${view}"`), `Tenant admin sidebar must NOT include link to /dashboard/${view}`);
  }
  assert.ok(!tenantOverviewHtml.includes('side-docs-edit-btn'), 'Tenant admin sidebar must NOT render Docs Studio edit shortcut');
  assert.ok(!tenantOverviewHtml.includes('sidefoot-credit-edit'), 'Tenant admin sidebar must NOT render footer credit edit icon');
  assert.ok(!tenantOverviewHtml.includes('sidefoot-credit-edit'), 'Tenant admin sidebar must NOT render credit edit icon');
  assert.ok(!tenantOverviewHtml.includes('/dashboard/security'), 'Tenant admin profile dropdown must NOT include Security events link');
  assert.ok(tenantOverviewHtml.includes('Workspace Delivery'), 'Tenant admin overview must render Workspace Delivery panel');
  assert.ok(tenantOverviewHtml.includes('href="/dashboard/clients"'), 'Tenant admin overview must link to API clients');
  assert.ok(!tenantOverviewHtml.includes('href="/dashboard/setup"'), 'Tenant admin overview must NOT link to setup guide');

  // 6. Strict HTTP 403 Forbidden for tenant admin accessing superadmin views
  for (const view of superOnlyViews) {
    const res = await call('tenant@example.com', `/dashboard/${view}`, { headers: { cookie: tenantCookie } });
    assert.equal(res.status, 403, `/dashboard/${view} must return 403 Forbidden for tenant admin`);
    const html = await res.text();
    assert.ok(html.includes('Superadmin access required.'), `Error response must explain superadmin access required`);
  }

  // 7. Tenant admin unauthorized POST mutations are safely redirected to /dashboard
  const badPostSettings = await post('tenant@example.com', tenantCookie, '/dashboard/settings', {
    DEFAULT_SENDER: 'hacked@example.com'
  });
  assert.equal(badPostSettings.status, 303);
  assert.equal(badPostSettings.headers.get('location'), '/dashboard', 'Unauthorized tenant POST to settings must redirect to /dashboard');

  const badPostProviders = await post('tenant@example.com', tenantCookie, '/dashboard/providers/toggle', {
    provider: 'resend'
  });
  assert.equal(badPostProviders.status, 303);
  assert.equal(badPostProviders.headers.get('location'), '/dashboard', 'Unauthorized tenant POST to providers/toggle must redirect to /dashboard');

  const badPostUsers = await post('tenant@example.com', tenantCookie, '/dashboard/users/add', {
    subject: 'attacker@example.com',
    role: 'superadmin'
  });
  assert.equal(badPostUsers.status, 303);
  assert.equal(badPostUsers.headers.get('location'), '/dashboard', 'Unauthorized tenant POST to users/add must redirect to /dashboard');

  // 8. Tenant admin authorized mutations on /dashboard work seamlessly
  const addDomainRes = await post('tenant@example.com', tenantCookie, '/dashboard/domains/create', {
    domain: 'tenant-dash.org',
    display_name: 'Tenant Dash Domain'
  });
  assert.equal(addDomainRes.status, 303);
  assert.ok(addDomainRes.headers.get('location').includes('domains'), 'Add domain must redirect to domains view');

  // Verify domain in DB so identities can be created under it
  await db.prepare("UPDATE managed_domains SET is_verified=1 WHERE domain='tenant-dash.org'").run();

  const addIdentityRes = await post('tenant@example.com', tenantCookie, '/dashboard/identities/create', {
    display_name: 'Dash Alerts',
    local_part: 'alerts',
    domain: 'tenant-dash.org'
  });
  assert.equal(addIdentityRes.status, 303);
  assert.ok(addIdentityRes.headers.get('location').includes('identities'), 'Add identity must redirect to identities view');

  const addClientRes = await post('tenant@example.com', tenantCookie, '/dashboard/api-clients/create', {
    name: 'Dashboard API Client'
  });
  assert.equal(addClientRes.status, 303);
  assert.ok(addClientRes.headers.get('location').includes('clients'), 'Add client must redirect to clients view');

  // 9. Superadmin authorized POST mutation on /dashboard work seamlessly
  const saveDocsRes = await post('super@example.com', superCookie, '/dashboard/docs/save', {
    content: '## Updated Documentation via Dashboard'
  });
  assert.equal(saveDocsRes.status, 303);
  assert.ok(saveDocsRes.headers.get('location').includes('docs'), 'Docs save must redirect to docs view');
});
