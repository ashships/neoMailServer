import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import worker from '../src/index.js';
import { database } from './local-db.js';

test('superadmin provider order, adding, credentials, circuit breaker reset and rich text editor features', async () => {
  const db = database(await readFile('schema.sql', 'utf8'));
  const token = randomBytes(32).toString('base64url');
  const env = {
    DB: db,
    LOCAL_DEV: 'true',
    LOCAL_ADMIN_TOKEN: token,
    CONFIG_ENCRYPTION_KEY: randomBytes(32).toString('base64'),
    RESEND_API_KEY: 're_1234567890abcdef123456',
    DEFAULT_SENDER: 'admin@mail.neopathshala.com',
  };

  await db.prepare("INSERT INTO admin_users (subject,role,is_active,created_at,created_by) VALUES ('local-admin','superadmin',1,unixepoch(),'bootstrap'),('tenant@example.com','admin',1,unixepoch(),'local-admin')").run();

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

  const superCookie = await login('local-admin');
  const tenantCookie = await login('tenant@example.com');

  const superPost = async (path, data) => call('local-admin', path, {
    method: 'POST',
    headers: { cookie: superCookie, origin: 'http://localhost', 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ csrf: await getCsrf('local-admin'), ...data })
  });

  const tenantPost = async (path, data) => call('tenant@example.com', path, {
    method: 'POST',
    headers: { cookie: tenantCookie, origin: 'http://localhost', 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ csrf: await getCsrf('tenant@example.com'), ...data })
  });

  // 1. Initial view checks: Steady UI, neoPathshala brand, dark mode toggle, favicon
  const providersPage = await call('local-admin', '/admin?view=providers', { headers: { cookie: superCookie } });
  assert.equal(providersPage.status, 200);
  const providersHtml = await providersPage.text();
  assert.ok(providersHtml.includes('neoPathshala'));
  assert.ok(providersHtml.includes('theme-toggle'));
  assert.ok(providersHtml.includes('image/svg+xml'));
  assert.ok(providersHtml.includes('compose-quickbtn'));
  assert.match(providersHtml, /class="compose-quickbtn"[^>]*><svg/);
  assert.ok(providersHtml.includes('Active Routing Priority Order'));

  // 2. Superadmin provider reordering: Move down
  // Default order is 'resend,brevo,mailgun,mailtrap,mailersend'
  const reorderRes = await superPost('/admin/providers/reorder', { provider: 'resend', direction: 'down' });
  assert.equal(reorderRes.status, 303);
  let orderRow = await db.prepare("SELECT value FROM app_settings WHERE name='FALLBACK_ORDER'").first('value');
  assert.equal(orderRow, 'brevo,resend,mailgun,mailtrap,mailersend');

  // Move up
  const reorderUp = await superPost('/admin/providers/reorder', { provider: 'resend', direction: 'up' });
  assert.equal(reorderUp.status, 303);
  orderRow = await db.prepare("SELECT value FROM app_settings WHERE name='FALLBACK_ORDER'").first('value');
  assert.equal(orderRow, 'resend,brevo,mailgun,mailtrap,mailersend');

  // 3. Superadmin adding provider to routing
  const addRes = await superPost('/admin/providers/add', { provider: 'smtp' });
  assert.equal(addRes.status, 303);
  orderRow = await db.prepare("SELECT value FROM app_settings WHERE name='FALLBACK_ORDER'").first('value');
  assert.equal(orderRow, 'resend,brevo,mailgun,mailtrap,mailersend,smtp');

  // Duplicate add fails gracefully
  const addDup = await superPost('/admin/providers/add', { provider: 'smtp' });
  assert.equal(addDup.status, 422);

  // 4. Superadmin removing provider from routing
  const removeRes = await superPost('/admin/providers/remove', { provider: 'smtp' });
  assert.equal(removeRes.status, 303);
  orderRow = await db.prepare("SELECT value FROM app_settings WHERE name='FALLBACK_ORDER'").first('value');
  assert.equal(orderRow, 'resend,brevo,mailgun,mailtrap,mailersend');

  // 5. Superadmin configuring provider credentials directly
  const cfgRes = await superPost('/admin/providers/configure', {
    provider: 'brevo',
    api_key: 'xkeysib-1234567890abcdef12345678',
    add_to_routing: 'true',
  });
  assert.equal(cfgRes.status, 303);
  const brevoKeyRow = await db.prepare("SELECT is_secret FROM app_settings WHERE name='BREVO_API_KEY'").first();
  assert.equal(brevoKeyRow.is_secret, 1);

  // 6. Circuit breaker / health reset
  await db.prepare("INSERT INTO provider_health (owner_subject, provider_name, is_active, consecutive_failures, updated_at) VALUES ('local-admin', 'resend', 1, 5, unixepoch()) ON CONFLICT(owner_subject, provider_name) DO UPDATE SET consecutive_failures=5").run();
  assert.equal(await db.prepare("SELECT consecutive_failures FROM provider_health WHERE owner_subject='local-admin' AND provider_name='resend'").first('consecutive_failures'), 5);

  const resetRes = await superPost('/admin/providers/reset-health', { provider: 'resend' });
  assert.equal(resetRes.status, 303);
  assert.equal(await db.prepare("SELECT consecutive_failures FROM provider_health WHERE owner_subject='local-admin' AND provider_name='resend'").first('consecutive_failures'), 0);

  // 7. Security guard: tenant admin CANNOT access or mutate provider controls
  const tenantReorder = await tenantPost('/admin/providers/reorder', { provider: 'resend', direction: 'down' });
  assert.equal(tenantReorder.headers.get('location'), '/dashboard', 'Tenants must be redirected away from provider actions');

  const tenantAdd = await tenantPost('/admin/providers/add', { provider: 'smtp' });
  assert.equal(tenantAdd.headers.get('location'), '/dashboard');

  const tenantRemove = await tenantPost('/admin/providers/remove', { provider: 'resend' });
  assert.equal(tenantRemove.headers.get('location'), '/dashboard');

  const tenantReset = await tenantPost('/admin/providers/reset-health', { provider: 'resend' });
  assert.equal(tenantReset.headers.get('location'), '/dashboard');

  const tenantCfg = await tenantPost('/admin/providers/configure', { provider: 'mailersend', api_key: 'mlsn.test12345678' });
  assert.equal(tenantCfg.headers.get('location'), '/dashboard');

  // 8. Superadmin Rich Text Documentation Editor
  const docsEditorPage = await call('local-admin', '/admin?view=docs', { headers: { cookie: superCookie } });
  assert.equal(docsEditorPage.status, 200);
  const docsEditorHtml = await docsEditorPage.text();
  assert.ok(docsEditorHtml.includes('rich-editor-toolbar'), 'Must render rich editor toolbar');
  assert.ok(docsEditorHtml.includes('editor-workspace'), 'Must render editor workspace');
  assert.ok(docsEditorHtml.includes('editor-preview'), 'Must render editor preview');
  assert.ok(docsEditorHtml.includes('editor-counter'), 'Must render counter');
  assert.ok(docsEditorPage.headers.get('content-security-policy').includes('script-src \'nonce-'), 'Docs editor must have script nonce in CSP');

  // Publish docs via rich editor
  const saveDocs = await superPost('/admin/docs/save', { content: '# System Guide\n\nWelcome to **neoPathshala Mail**.\n\n- Zero-trust architecture\n- Failover routing' });
  assert.equal(saveDocs.status, 303);
  const savedDocsRow = await db.prepare("SELECT value FROM app_settings WHERE name='DOCS_CONTENT'").first('value');
  assert.ok(savedDocsRow.includes('# System Guide'));

  // Public /docs endpoint reflects published documentation
  const publicDocs = await worker.fetch(new Request('http://localhost/docs'), env);
  assert.equal(publicDocs.status, 200);
  const publicDocsHtml = await publicDocs.text();
  assert.ok(publicDocsHtml.includes('neoPathshala Documentation'));
  assert.ok(publicDocsHtml.includes('System Guide'));

  // 9. Verify GET /admin (default overview view) renders 200 OK without errors
  const overviewRes = await call('local-admin', '/admin', { headers: { cookie: superCookie } });
  assert.equal(overviewRes.status, 200);
  const overviewHtml = await overviewRes.text();
  assert.ok(overviewHtml.includes('Overview'));
  assert.ok(overviewHtml.includes('Total messages'));
  assert.ok(overviewHtml.includes('Delivery providers'));
});
