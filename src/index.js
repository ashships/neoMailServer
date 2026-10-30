import { HttpError, reply, redirect, hash, equal, email, text, cookie, local, sameOrigin, form, json, readBody, rate, audit, access, session, csrf, sessionCookie, bytes64, headers } from './security.js';
import { config, saveSettings, saveSecret, PROVIDERS } from './config.js';
import { dispatch, validateMail, verifyWebhook, applyWebhook, sendSmtp } from './providers.js';
import * as ui from './ui.js';
import { getProfile, saveProfile, profileForm, profileImage } from './profile.js';

const now = () => Math.floor(Date.now() / 1000);
const flash = message => redirect('/admin?notice=' + encodeURIComponent(message));
async function rows(env, sql, ...params) { return (await env.DB.prepare(sql).bind(...params).all()).results || []; }
async function identities(env) { return rows(env, 'SELECT * FROM sender_identities ORDER BY is_default DESC,email_address'); }
function requireMethod(request, methods) { if (!methods.includes(request.method)) throw new HttpError(405, 'Method not allowed.'); }
async function activeIdentity(env, address) { return env.DB.prepare('SELECT * FROM sender_identities WHERE email_address=? AND is_active=1').bind(address).first(); }
async function verifyDomainDns(domain, token) {
  if (!domain || !token) return false;
  try {
    const res = await fetch('https://cloudflare-dns.com/dns-query?name=' + encodeURIComponent('_neomail-verification.' + domain) + '&type=TXT', { headers: { Accept: 'application/dns-json' } });
    if (!res.ok) return false;
    const data = await res.json();
    return (data.Answer || []).some(a => String(a.data || '').replace(/"/g, '').includes(token));
  } catch { return false; }
}

async function adminRole(env, subject) {
  if (subject === 'local-admin' || subject === 'admin') return 'superadmin';
  if (!env.DB) return 'superadmin';
  if (tokenLoginConfigured(env)) return 'superadmin';
  const count = await env.DB.prepare('SELECT COUNT(*) AS n FROM admin_users').first('n');
  if ((count?.n || 0) === 0) return 'superadmin';
  const row = await env.DB.prepare('SELECT role FROM admin_users WHERE subject=? AND is_active=1').bind(subject).first();
  return row?.role || null;
}
async function apiClient(env, token) {
  if (typeof token !== 'string' || !token) return null;
  const digest = await hash(token);
  const row = await env.DB.prepare('SELECT * FROM api_clients WHERE key_hash=? AND is_active=1').bind(digest).first();
  if (row) {
    await env.DB.prepare('UPDATE api_clients SET last_used_at=unixepoch() WHERE id=?').bind(row.id).run();
    return row;
  }
  const { values: cfg } = await config(env);
  if (cfg.API_SECRET_KEY && await equal(token, cfg.API_SECRET_KEY)) return { id: 'legacy', name: 'Legacy API key', sender_address: null };
  return null;
}
function accessConfigured(env) {
  const team = env.ACCESS_TEAM_DOMAIN, audience = env.ACCESS_AUD;
  return /^[a-z0-9-]+\.cloudflareaccess\.com$/.test(team || '') && !!audience;
}
function tokenLoginConfigured(env) {
  return env.ALLOW_TOKEN_LOGIN === 'true' && !accessConfigured(env) && typeof env.ADMIN_TOKEN_HASH === 'string' && env.ADMIN_TOKEN_HASH.length > 0;
}
function otpLoginConfigured(env) {
  return env.EMAIL_OTP_LOGIN === 'true' && !accessConfigured(env);
}
async function adminVerifier(request, env) {
  if (local(request, env)) return env.LOCAL_ADMIN_TOKEN ? hash(env.LOCAL_ADMIN_TOKEN) : env.ADMIN_TOKEN_HASH;
  if (accessConfigured(env)) return 'access-v2:' + env.ACCESS_TEAM_DOMAIN + ':' + env.ACCESS_AUD;
  return env.ADMIN_TOKEN_HASH;
}
async function reauthenticate(request, env, data) {
  if (!local(request, env) && accessConfigured(env)) {
    // access() has already verified this exact JWT's signature and claims.
    const claims = JSON.parse(new TextDecoder().decode(bytes64(request.headers.get('cf-access-jwt-assertion').split('.')[1])));
    if (now() - claims.iat > 300) throw new HttpError(403, 'Sign out of Cloudflare Access and sign in again before changing credentials (five-minute freshness required).');
    return;
  }
  const verifier = await adminVerifier(request, env);
  const token = data.get('admin_token');
  if (typeof token !== 'string' || !/^[A-Za-z0-9_-]{43,128}$/.test(token) || !verifier || !await equal(await hash(token), verifier)) throw new HttpError(401, 'Administrator token required for credential changes.');
}
async function handler(request, env) {
  const url = new URL(request.url), path = url.pathname, ip = request.headers.get('cf-connecting-ip') || 'local';
  // Public probes do not disclose configuration, secrets, or database details.
  if (path === '/docs' || path.startsWith('/docs/')) {
    requireMethod(request, ['GET']);
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NeoMail Docs</title><style>body{font-family:Inter,system-ui,sans-serif;max-width:900px;margin:40px auto;padding:0 20px;line-height:1.6;color:#172820}h1,h2{color:#087d54}code,pre{background:#f1f4f2;padding:2px 6px;border-radius:4px}pre{padding:12px;overflow:auto}a{color:#087d54}</style></head><body><h1>NeoMail Documentation</h1><p>Private transactional email for Cloudflare Workers and D1.</p><h2>Quick start</h2><ol><li>Create D1 and run schema/migrations.</li><li>Set secrets and vars in wrangler.toml / dashboard.</li><li>Deploy with <code>npx wrangler deploy</code>.</li><li>Open <code>/admin</code> and sign in.</li></ol><h2>Provider setup</h2><p>Configure credentials in Settings. Supported providers: SMTP, Resend, Brevo, Mailgun, Mailtrap, MailerSend. Add provider DNS records (SPF, DKIM, DMARC) from each provider dashboard.</p><h2>API</h2><pre>POST /api/v1/send
Authorization: Bearer &lt;api-key&gt;
Content-Type: application/json
Idempotency-Key: unique-key

{"from":"no-reply@example.com","to":"user@example.com","subject":"Hello","text":"Hi"}</pre><h2>Domains</h2><p>Clients can register domains via <code>POST /api/v1/domains</code>. DNS records are provider-specific.</p><h2>Support</h2><p>See repository docs for full operations, security, and validation guides.</p></body></html>`;
    return reply(html, 200, { 'Content-Type': 'text/html; charset=utf-8' });
  }
  if (path === '/docs') {
    requireMethod(request, ['GET']);
    const row = await env.DB.prepare("SELECT value FROM app_settings WHERE name='DOCS_CONTENT'").first();
    const content = row?.value || 'NeoMail documentation. Configure your deployment and providers in the admin panel.';
    const html = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NeoMail Docs</title><style>body{font-family:Inter,system-ui,sans-serif;max-width:900px;margin:40px auto;padding:0 20px;line-height:1.6;color:#172820;white-space:pre-wrap}h1{color:#087d54}</style></head><body><h1>NeoMail Documentation</h1><p>' + content.replace(/&/g,'&amp;').replace(/</g,'&lt;') + '</p></body></html>';
    return reply(html, 200, { 'Content-Type': 'text/html; charset=utf-8' });
  }
  if (path === '/health') { requireMethod(request, ['GET']); return reply({ status: 'ok', service: 'neomail' }); }
  if (path === '/') { requireMethod(request, ['GET']); return redirect('/admin'); }
  if (request.method === 'OPTIONS') return reply({ error: 'Browser cross-origin API calls are not supported.' }, 405);
  if (!env.DB) throw new HttpError(503, 'Database binding unavailable.');
  if (!local(request, env) && url.protocol !== 'https:') throw new HttpError(403, 'HTTPS required.');
  if (path === '/api/v1/send' || path === '/api/send') {
    requireMethod(request, ['POST']);
    await rate(env, 'api-auth:' + ip, 120, 60);
    const bearer = request.headers.get('authorization') || '';
    const token = bearer.startsWith('Bearer ') ? bearer.slice(7) : '';
    const client = await apiClient(env, token);
    if (!client) throw new HttpError(401, 'Invalid API credential.');
    const { values: cfg } = await config(env);
    await rate(env, 'api:client:' + client.id, +cfg.API_RATE_LIMIT_PER_MINUTE, 60);
    const data = await json(request);
    if (client.sender_address) {
      if (data.from && email(data.from) !== client.sender_address) throw new HttpError(403, 'This API client is restricted to its assigned sender.');
      if (!data.from) data.from = client.sender_address;
    }
    const mail = validateMail(data, cfg);
    const result = await dispatch(cfg, mail, request.headers.get('idempotency-key'));
    return reply(result, result.success ? 200 : result.uncertain ? 202 : 502);
  }
  if (path.startsWith('/webhooks/')) {
    requireMethod(request, ['POST']);
    const provider = path.slice('/webhooks/'.length);
    if (!['resend', 'mailgun'].includes(provider)) throw new HttpError(404, 'Webhook provider not supported.');
    const { values: cfg } = await config(env);
    await rate(env, 'webhook:' + provider + ':' + ip, +cfg.WEBHOOK_RATE_LIMIT_PER_MINUTE, 60);
    const event = await verifyWebhook(provider, request, await readBody(request), cfg);
    await applyWebhook(env, provider, event); return reply({ received: true });
  }
  if (path === '/api/v1/domains' || path === '/api/domains') {
    requireMethod(request, ['GET', 'POST']);
    await rate(env, 'api-auth:' + ip, 120, 60);
    const bearer = request.headers.get('authorization') || '';
    const token = bearer.startsWith('Bearer ') ? bearer.slice(7) : '';
    const client = await apiClient(env, token);
    if (!client) throw new HttpError(401, 'Invalid API credential.');
    if (request.method === 'GET') {
      const rows = await rows(env, 'SELECT domain,display_name,is_verified,created_at FROM managed_domains WHERE created_by=? ORDER BY created_at DESC', client.id);
      return reply({ domains: rows });
    }
    await rate(env, 'api:client:' + client.id, + (await config(env)).values.API_RATE_LIMIT_PER_MINUTE, 60);
    const data = await json(request);
    const domain = (typeof data.domain === 'string' ? data.domain.trim().toLowerCase() : '');
    const name = (typeof data.display_name === 'string' ? data.display_name.trim().slice(0, 100) : domain);
    if (!/^[a-z0-9.-]+$/.test(domain) || domain.length > 253) throw new HttpError(422, 'Invalid domain.');
    if (!name) throw new HttpError(422, 'Display name is required.');
    try {
      const vtoken = crypto.randomUUID().replace(/-/g, '');
      await env.DB.prepare('INSERT INTO managed_domains (domain,display_name,is_verified,created_at,created_by,verification_token) VALUES (?,?,0,unixepoch(),?,?)').bind(domain, name, client.id, vtoken).run();
    } catch {
      throw new HttpError(409, 'Domain already registered.');
    }
    await audit(env, request, 'DOMAIN_ADDED', { domain, client: client.id });
    return reply({ domain, status: 'pending_dns', verification_token: vtoken, dns_record: { type: 'TXT', name: '_neomail-verification.' + domain, value: vtoken }, dns: [
      { type: 'TXT', name: domain, value: 'v=spf1 include:_spf.' + domain + ' ~all (provider-specific; replace with your provider SPF)' },
      { type: 'TXT', name: '_dmarc.' + domain, value: 'v=DMARC1; p=quarantine; rua=mailto:postmaster@' + domain },
      { type: 'TXT', name: 'selector._domainkey.' + domain, value: 'Provider-specific DKIM record' },
    ] }, 201);
  }
  if (path === '/api/v1/domains/verify' || path === '/api/domains/verify') {
    requireMethod(request, ['POST']);
    const bearer = request.headers.get('authorization') || '';
    const token = bearer.startsWith('Bearer ') ? bearer.slice(7) : '';
    const client = await apiClient(env, token);
    if (!client) throw new HttpError(401, 'Invalid API credential.');
    const data = await json(request);
    const domain = (typeof data.domain === 'string' ? data.domain.trim().toLowerCase() : '');
    if (!domain) throw new HttpError(422, 'Domain required.');
    const row = await env.DB.prepare('SELECT verification_token FROM managed_domains WHERE domain=? AND created_by=?').bind(domain, client.id).first();
    if (!row) throw new HttpError(404, 'Domain not found.');
    const ok = await verifyDomainDns(domain, row.verification_token);
    if (ok) await env.DB.prepare('UPDATE managed_domains SET is_verified=1 WHERE domain=?').bind(domain).run();
    return reply({ domain, verified: ok });
  }
  if (path !== '/admin' && !path.startsWith('/admin/')) throw new HttpError(404, 'Endpoint not found.');
  const subject = await access(request, env);
  if (path === '/admin/login') {
    requireMethod(request, ['GET', 'POST']);
    if (request.method === 'GET') {
      if (otpLoginConfigured(env) && url.searchParams.get('mode') !== 'token') {
        const email = (url.searchParams.get('email') || '').slice(0, 254);
        const pending = email ? await env.DB.prepare('SELECT 1 FROM admin_otps WHERE subject=? AND expires_at>unixepoch()').bind(email).first() : null;
        return reply(pending ? ui.otpVerify(email) : ui.otpRequest());
      }
      return reply((local(request, env) || tokenLoginConfigured(env)) ? ui.login() : ui.accessLogin());
    }
    sameOrigin(request);
    const { values: cfg } = await config(env);
    await rate(env, 'login:ip:' + ip, +cfg.MAX_LOGIN_ATTEMPTS, 900);
    const data = await form(request);
    if (otpLoginConfigured(env) && data.get('step')) {
      const step = data.get('step');
      if (step === 'request') {
        const emailAddr = email(data.get('email'));
        if (!emailAddr) throw new HttpError(422, 'Valid administrator email required.');
        const allowed = await env.DB.prepare('SELECT 1 FROM admin_users WHERE subject=? AND is_active=1').bind(emailAddr).first();
        const count = await env.DB.prepare('SELECT COUNT(*) AS n FROM admin_users').first('n');
        if ((count?.n || 0) > 0 && !allowed) throw new HttpError(403, 'Administrator account is not authorized.');
        await rate(env, 'login:subject:' + emailAddr, +cfg.MAX_LOGIN_ATTEMPTS, 900);
        const code = String(Math.floor(100000 + Math.random() * 900000));
        const expires = now() + 600;
        await env.DB.prepare('INSERT INTO admin_otps (subject,code_hash,expires_at,attempts,created_at) VALUES (?,?,?,0,unixepoch()) ON CONFLICT(subject) DO UPDATE SET code_hash=excluded.code_hash,expires_at=excluded.expires_at,attempts=0').bind(emailAddr, await hash(code), expires).run();
        try {
          const masterCfg = {
            SMTP_HOST: env.OTP_SMTP_HOST || env.SMTP_HOST || cfg.SMTP_HOST,
            SMTP_PORT: env.OTP_SMTP_PORT || env.SMTP_PORT || cfg.SMTP_PORT || '465',
            SMTP_USER: env.OTP_SMTP_USER || env.OTP_SMTP_USERNAME || env.SMTP_USER || env.SMTP_USERNAME || cfg.SMTP_USER || cfg.SMTP_USERNAME,
            SMTP_PASS: env.OTP_SMTP_PASS || env.OTP_SMTP_PASSWORD || env.SMTP_PASS || env.SMTP_PASSWORD || cfg.SMTP_PASS || cfg.SMTP_PASSWORD,
            SMTP_SECURE: env.OTP_SMTP_SECURE || env.SMTP_SECURE || cfg.SMTP_SECURE || 'true',
            DEFAULT_SENDER: cfg.DEFAULT_SENDER,
            DEFAULT_SENDER_NAME: cfg.DEFAULT_SENDER_NAME,
          };
          if (!masterCfg.SMTP_HOST || !masterCfg.SMTP_USER || !masterCfg.SMTP_PASS) throw new Error('master smtp not configured');
          const mail = validateMail({ to: emailAddr, subject: 'NeoMail login code', text: 'Your NeoMail login code is ' + code + '. It expires in 10 minutes.' }, masterCfg);
          await sendSmtp(masterCfg, mail);
        } catch (e) {
          await env.DB.prepare('DELETE FROM admin_otps WHERE subject=?').bind(emailAddr).run();
          throw new HttpError(503, 'Unable to send login code. Configure a provider first.');
        }
        await audit(env, request, 'OTP_SENT', { subject: emailAddr });
        return reply(ui.otpVerify(emailAddr));
      }
      if (step === 'verify') {
        const emailAddr = email(data.get('email'));
        const code = String(data.get('code') || '');
        if (!emailAddr || !/^[0-9]{6}$/.test(code)) throw new HttpError(422, 'Invalid code.');
        const row = await env.DB.prepare('SELECT * FROM admin_otps WHERE subject=?').bind(emailAddr).first();
        if (!row || row.expires_at <= now() || row.attempts >= 5) {
          await env.DB.prepare('DELETE FROM admin_otps WHERE subject=?').bind(emailAddr).run();
          throw new HttpError(403, 'Login code expired or invalid.');
        }
        await env.DB.prepare('UPDATE admin_otps SET attempts=attempts+1 WHERE subject=?').bind(emailAddr).run();
        if (!await equal(await hash(code), row.code_hash)) throw new HttpError(403, 'Invalid login code.');
        await env.DB.prepare('DELETE FROM admin_otps WHERE subject=?').bind(emailAddr).run();
        const token = crypto.randomUUID(), csrfToken = crypto.randomUUID();
        const prior = cookie(request, '__Host-neomail');
        await env.DB.batch([
          env.DB.prepare('DELETE FROM admin_sessions WHERE token_hash=? OR expires_at<=unixepoch()').bind(await hash(prior)),
          env.DB.prepare('INSERT INTO admin_sessions (token_hash,csrf_token,access_subject,credential_version,expires_at) VALUES (?,?,?,?,?)').bind(await hash(token), csrfToken, 'admin', await hash(await adminVerifier(request, env)), now() + 3600),
        ]);
        await audit(env, request, 'AUTH_SUCCESS');
        return redirect('/admin', { 'Set-Cookie': sessionCookie(token) });
      }
      throw new HttpError(422, 'Invalid login step.');
    }
    await rate(env, 'login:subject:' + subject, +cfg.MAX_LOGIN_ATTEMPTS, 900);
    const data2 = data;
    try { await reauthenticate(request, env, data2); } catch (e) {
      await audit(env, request, 'AUTH_FAILURE'); return reply((local(request, env) || tokenLoginConfigured(env)) ? ui.login('Sign-in failed. Check your administrator token.') : ui.accessLogin(), e.status || 401);
    }
    const token = crypto.randomUUID(), csrfToken = crypto.randomUUID();
    const prior = cookie(request, '__Host-neomail');
    await env.DB.batch([
      env.DB.prepare('DELETE FROM admin_sessions WHERE token_hash=? OR expires_at<=unixepoch()').bind(await hash(prior)),
      env.DB.prepare('INSERT INTO admin_sessions (token_hash,csrf_token,access_subject,credential_version,expires_at) VALUES (?,?,?,?,?)').bind(await hash(token), csrfToken, subject, await hash(await adminVerifier(request, env)), now() + 3600),
    ]);
    await audit(env, request, 'AUTH_SUCCESS');
    return redirect('/admin', { 'Set-Cookie': sessionCookie(token) });
  }
  const sess = await session(request, { ...env, ADMIN_TOKEN_HASH: await adminVerifier(request, env) }, subject);
  if (!sess) return redirect('/admin/login');
  sess.local_dev = local(request, env);
  sess.profile = await getProfile(env, subject);
  if (path === '/admin/profile-image') { requireMethod(request, ['GET']); return profileImage(env, subject); }
  const { values: cfg } = await config(env);
  if (request.method === 'POST') {
    const data = path === '/admin/profile' ? await profileForm(request) : await form(request); await csrf(request, data, sess);
    // Controls all console mutations, including test email dispatch.
    await rate(env, 'admin:' + subject, 30, 60);
    if (path === '/admin/profile') {
      const result = await saveProfile(env, subject, data);
      await audit(env, request, 'PROFILE_UPDATED', result);
      return redirect('/admin?view=settings&notice=Profile+updated#profile');
    }
    if (path === '/admin/logout') {
      await env.DB.prepare('DELETE FROM admin_sessions WHERE token_hash=?').bind(sess.token_hash).run();
      await audit(env, request, 'LOGOUT'); return redirect(local(request, env) ? '/admin/login' : '/cdn-cgi/access/logout', { 'Set-Cookie': sessionCookie('', 0) });
    }
    if (path === '/admin/sessions/revoke') {
      await env.DB.prepare('DELETE FROM admin_sessions').run();
      await audit(env, request, 'SESSIONS_REVOKED'); return redirect(local(request, env) ? '/admin/login' : '/cdn-cgi/access/logout', { 'Set-Cookie': sessionCookie('', 0) });
    }
    if (path === '/admin/settings') {
      const sender = email(data.get('DEFAULT_SENDER'));
      if (!sender || !await activeIdentity(env, sender)) throw new HttpError(422, 'Default sender must match an active sender identity. Add the identity first.');
      await audit(env, request, 'SETTINGS_CHANGE_REQUESTED');
      const changed = await saveSettings(env, data);
      await audit(env, request, 'SETTINGS_UPDATED', { keys: changed });
      return redirect('/admin?view=settings&notice=Settings+saved');
    }
    if (path === '/admin/credentials') {
      await rate(env, 'credential-reauth:' + subject, 5, 900);
      await reauthenticate(request, env, data);
      await audit(env, request, 'CREDENTIAL_CHANGE_REQUESTED', { name: data.get('name') });
      await saveSecret(env, data.get('name'), data.get('value'));
      await audit(env, request, 'CREDENTIAL_UPDATED', { name: data.get('name') });
      return redirect('/admin?view=settings&notice=Credential+saved');
    }
    if (path === '/admin/providers/toggle') {
      const provider = data.get('provider'); if (!PROVIDERS.includes(provider)) throw new HttpError(422, 'Unknown provider.');
      await env.DB.prepare('UPDATE provider_health SET is_active=1-is_active,consecutive_failures=0,updated_at=unixepoch() WHERE provider_name=?').bind(provider).run();
      await audit(env, request, 'PROVIDER_TOGGLED', { provider }); return redirect('/admin?view=providers&notice=Provider+updated');
    }
    if (path === '/admin/identities/create') {
      const address = email(data.get('email_address')), displayName = text(data.get('display_name'), 100);
      if (!address) throw new HttpError(422, 'Invalid sender address.');
      const result = await env.DB.prepare('INSERT INTO sender_identities (id,email_address,display_name,is_default,is_active,created_at) VALUES (?,?,?,0,1,unixepoch()) ON CONFLICT(email_address) DO NOTHING RETURNING id').bind(crypto.randomUUID(), address, displayName).first();
      if (!result) throw new HttpError(409, 'Sender identity already exists.');
      await audit(env, request, 'IDENTITY_CREATED', { address }); return redirect('/admin?view=identities&notice=Identity+created');
    }
    if (path === '/admin/identities/update') {
      const address = email(data.get('email_address')), action = data.get('action');
      if (!address || !['default','toggle','rename'].includes(action)) throw new HttpError(422, 'Invalid identity action.');
      const identity = await env.DB.prepare('SELECT * FROM sender_identities WHERE email_address=?').bind(address).first();
      if (!identity) throw new HttpError(404, 'Identity not found.');
      if (action === 'rename') {
        const displayName=text(data.get('display_name'),100);
        const changes=[env.DB.prepare('UPDATE sender_identities SET display_name=? WHERE email_address=?').bind(displayName,address)];
        if (address===cfg.DEFAULT_SENDER) changes.push(env.DB.prepare('INSERT INTO app_settings(name,value,is_secret,updated_at) VALUES (?,?,0,unixepoch()) ON CONFLICT(name) DO UPDATE SET value=excluded.value,updated_at=unixepoch()').bind('DEFAULT_SENDER_NAME',displayName));
        await env.DB.batch(changes);
      } else if (action === 'toggle') {
        if (identity.is_default || address === cfg.DEFAULT_SENDER) throw new HttpError(409, 'Choose another default sender before pausing this identity.');
        await env.DB.prepare('UPDATE sender_identities SET is_active=1-is_active WHERE email_address=?').bind(address).run();
      } else {
        if (!identity.is_active) throw new HttpError(422, 'Enable this identity first.');
        await env.DB.batch([
          env.DB.prepare('UPDATE sender_identities SET is_default=CASE WHEN email_address=? THEN 1 ELSE 0 END').bind(address),
          env.DB.prepare('INSERT INTO app_settings (name,value,is_secret,updated_at) VALUES (?,?,0,unixepoch()) ON CONFLICT(name) DO UPDATE SET value=excluded.value,updated_at=unixepoch()').bind('DEFAULT_SENDER', address),
        ]);
      }
      await audit(env, request, 'IDENTITY_UPDATED', { address, action }); return redirect('/admin?view=identities&notice=Identity+updated');
    }
    if (path === '/admin/api-clients/create') {
      const name = text(data.get('name'), 80);
      if (!name) throw new HttpError(422, 'Client name is required.');
      const senderRaw = data.get('sender_address');
      const sender = senderRaw ? email(senderRaw) : null;
      if (senderRaw && !sender) throw new HttpError(422, 'Invalid sender address.');
      if (sender && !await env.DB.prepare('SELECT 1 FROM sender_identities WHERE email_address=? AND is_active=1').bind(sender).first()) throw new HttpError(422, 'Sender must be an active identity.');
      const bytes = new Uint8Array(32); crypto.getRandomValues(bytes);
      const key = btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      await env.DB.prepare('INSERT INTO api_clients (id,name,key_hash,sender_address,is_active,created_at) VALUES (?,?,?,?,1,unixepoch())').bind(crypto.randomUUID(), name, await hash(key), sender).run();
      await audit(env, request, 'API_CLIENT_CREATED', { name, sender });
      return redirect('/admin?view=clients&created_key=' + encodeURIComponent(key) + '&notice=' + encodeURIComponent('API client created. Copy the key now; it will not be shown again.'));
    }
    if (path === '/admin/api-clients/revoke') {
      const id = data.get('id');
      if (typeof id !== 'string' || !id || id.length > 100) throw new HttpError(422, 'Invalid client.');
      await env.DB.prepare('UPDATE api_clients SET is_active=0 WHERE id=?').bind(id).run();
      await audit(env, request, 'API_CLIENT_REVOKED', { id });
      return redirect('/admin?view=clients&notice=' + encodeURIComponent('API client revoked.'));
    }
    if (path === '/admin/users/add') {
      if (await adminRole(env, subject) !== 'superadmin') throw new HttpError(403, 'Superadmin required.');
      const newSubject = text(data.get('subject'), 254);
      if (!newSubject) throw new HttpError(422, 'Subject is required.');
      const requestedRole = data.get('role');
      const role = ['admin','client','staff'].includes(requestedRole) ? requestedRole : null;
      if (!role) throw new HttpError(422, 'Invalid role.');
      await env.DB.prepare('INSERT INTO admin_users (subject,role,is_active,created_at,created_by) VALUES (?,?,1,unixepoch(),?) ON CONFLICT(subject) DO UPDATE SET role=excluded.role,is_active=1').bind(newSubject, role, subject).run();
      await audit(env, request, 'ADMIN_USER_ADDED', { subject: newSubject, role }); return redirect('/admin?view=users&notice=' + encodeURIComponent('Administrator added.'));
    }
    if (path === '/admin/users/revoke') {
      if (await adminRole(env, subject) !== 'superadmin') throw new HttpError(403, 'Superadmin required.');
      const target = text(data.get('subject'), 254);
      if (!target || target === subject) throw new HttpError(422, 'Invalid target.');
      const row = await env.DB.prepare('SELECT role FROM admin_users WHERE subject=?').bind(target).first();
      if (!row) throw new HttpError(404, 'User not found.');
      if (row.role === 'superadmin') throw new HttpError(409, 'Cannot revoke a superadmin.');
      await env.DB.prepare('UPDATE admin_users SET is_active=0 WHERE subject=?').bind(target).run();
      await audit(env, request, 'ADMIN_USER_REVOKED', { subject: target }); return redirect('/admin?view=users&notice=' + encodeURIComponent('Administrator revoked.'));
    }
    if (path === '/admin/domains/create') {
      const domain = text(data.get('domain'), 253);
      const name = text(data.get('display_name'), 100);
      if (!domain || !/^[a-z0-9.-]+$/i.test(domain) || !name) throw new HttpError(422, 'Valid domain and name required.');
      const token = crypto.randomUUID().replace(/-/g, '');
      await env.DB.prepare('INSERT INTO managed_domains (domain,display_name,is_verified,created_at,created_by,verification_token) VALUES (?,?,0,unixepoch(),?,?)').bind(domain.toLowerCase(), name, subject, token).run();
      await audit(env, request, 'DOMAIN_ADDED', { domain }); return redirect('/admin?view=domains&notice=' + encodeURIComponent('Domain added.'));
    }
    if (path === '/admin/users/role') {
      if (await adminRole(env, subject) !== 'superadmin') throw new HttpError(403, 'Superadmin required.');
      const target = text(data.get('subject'), 254);
      const role = data.get('role');
      if (!target || !['admin','client','staff'].includes(role) || target === subject) throw new HttpError(422, 'Invalid role change.');
      const row = await env.DB.prepare('SELECT role FROM admin_users WHERE subject=?').bind(target).first();
      if (!row) throw new HttpError(404, 'User not found.');
      if (row.role === 'superadmin') throw new HttpError(409, 'Cannot change a superadmin role.');
      await env.DB.prepare('UPDATE admin_users SET role=? WHERE subject=?').bind(role, target).run();
      await audit(env, request, 'ADMIN_USER_ROLE_CHANGED', { subject: target, role }); return redirect('/admin?view=users&notice=' + encodeURIComponent('Role updated.'));
    }
    if (path === '/admin/domains/verify') {
      const domain = text(data.get('domain'), 253);
      if (!domain) throw new HttpError(422, 'Domain required.');
      const row = await env.DB.prepare('SELECT verification_token FROM managed_domains WHERE domain=?').bind(domain).first();
      if (!row) throw new HttpError(404, 'Domain not found.');
      const ok = await verifyDomainDns(domain, row.verification_token);
      if (ok) await env.DB.prepare('UPDATE managed_domains SET is_verified=1 WHERE domain=?').bind(domain).run();
      await audit(env, request, 'DOMAIN_VERIFIED', { domain, ok });
      return redirect('/admin?view=domains&notice=' + encodeURIComponent(ok ? 'Domain verified.' : 'DNS record not found yet.'));
    }
    if (path === '/admin/docs/save') {
      if (await adminRole(env, subject) !== 'superadmin') throw new HttpError(403, 'Superadmin required.');
      const content = (data.get('content') || '').toString().slice(0, 20000);
      await env.DB.prepare("INSERT INTO app_settings (name,value,is_secret,updated_at) VALUES ('DOCS_CONTENT',?,0,unixepoch()) ON CONFLICT(name) DO UPDATE SET value=excluded.value,updated_at=unixepoch()").bind(content).run();
      await audit(env, request, 'DOCS_UPDATED', {}); return redirect('/admin?view=docs&notice=' + encodeURIComponent('Documentation saved.'));
    }
    if (path === '/admin/send-test') {
      await rate(env, 'admin:send:' + subject, 5, 60);
      const mode=data.get('delivery_mode') || 'normal';
      if (!['normal','mailgun-sandbox'].includes(mode)) throw new HttpError(422,'Invalid delivery mode.');
      let dispatchConfig=cfg;const payload=Object.fromEntries(data);
      if(mode==='mailgun-sandbox') {
        if(!/^sandbox[a-z0-9]+\.mailgun\.org$/.test(cfg.MAILGUN_SANDBOX_DOMAIN||'')) throw new HttpError(422,'Save your Mailgun sandbox domain in Settings first.');
        if(!cfg.MAILGUN_API_KEY) throw new HttpError(422,'Save your Mailgun API key first.');
        dispatchConfig={...cfg,MAILGUN_DOMAIN:cfg.MAILGUN_SANDBOX_DOMAIN,FALLBACK_ORDER:'mailgun'};
        payload.from='postmaster@'+cfg.MAILGUN_SANDBOX_DOMAIN;
        payload.from_name='NeoMail Mailgun Sandbox';
      }
      const result = await dispatch(dispatchConfig, validateMail(payload, dispatchConfig), data.get('idempotency_key'));
      await audit(env, request, 'TEST_EMAIL_REQUESTED', { id: result.id, status: result.status });
      return flash(result.success ? 'Test email accepted by ' + result.provider + '. Inspect its delivery status in Mail activity.' : result.uncertain ? 'Provider outcome uncertain. Inspect the mail log and provider dashboard before retrying.' : 'Test email failed. Check your provider configuration and mail log.');
    }
    throw new HttpError(404, 'Endpoint not found.');
  }
  requireMethod(request, ['GET']);
  if (path === '/admin/logout') throw new HttpError(405, 'Sign out using the panel form.');
  if (['/admin/view-mail','/admin/email','/admin/preview'].includes(path)) {
    const id = url.searchParams.get('id'); if (!id || id.length > 100) throw new HttpError(422, 'Invalid message identifier.');
    const mail = await env.DB.prepare('SELECT * FROM email_logs WHERE id=?').bind(id).first();
    if (!mail) throw new HttpError(404, 'Message not found.');
    if (path === '/admin/preview') return reply(mail.html_body || '<p>Content not retained.</p>', 200, {
      'Content-Security-Policy': "sandbox; default-src 'none'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'; frame-ancestors 'self'", 'X-Frame-Options': 'SAMEORIGIN',
    });
    return reply(ui.page('mail','Message details','Inspect delivery metadata and isolated message content.',ui.inspector(mail),sess));
  }
  if (!['/admin','/admin/dashboard'].includes(path)) throw new HttpError(404, 'Endpoint not found.');
  const view = url.searchParams.get('view') || 'overview', notice = (url.searchParams.get('notice') || '').slice(0, 500);
  let title, subtitle, content;
  if (view === 'settings') {
    sess.script_nonce=crypto.randomUUID();
    title='Settings'; subtitle='Configure your workspace without redeploying.'; content=ui.settings(cfg,sess);
  } else if (view === 'identities' || view === 'compose') {
    const senders = await identities(env);
    title=view==='compose'?'Send a test':'Sender identities'; subtitle=view==='compose'?'Verify your email delivery setup.':'Manage approved addresses for outbound mail.';
    content=view==='compose'?ui.compose(senders,sess):ui.identities(senders,sess);
  } else if (view === 'providers') {
    title='Delivery providers'; subtitle='Control routing availability and inspect provider health.';
    content=`<div class="notice">Routing order: ${cfg.FALLBACK_ORDER.split(',').map(p=>ui.badge(p)).join(' → ')}. Circuit breakers pause a provider for five minutes after five consecutive failures.</div><section class="panel">${ui.providerList(await rows(env,'SELECT * FROM provider_health'),cfg,sess.csrf_token)}</section><div class="notice warn">SendFox is excluded until a supported transactional sending API is verified. Built-in delivery webhooks support Resend and Mailgun; other providers show acceptance only.</div>`;
  } else if (view === 'security') {
    title='Security events'; subtitle='Review sign-ins, configuration changes, and access controls.';
    content=ui.security(await rows(env,'SELECT * FROM security_audit_logs ORDER BY unix_timestamp DESC LIMIT 100'),{...env,csrf:sess.csrf_token});
  } else if (view === 'setup') {
    title='Integration guide'; subtitle='Prepare your Worker and connect the Nepathshala backend.'; content=ui.setup(url.origin,cfg);
  } else if (view === 'clients') {
    title='API clients'; subtitle='Issue and revoke integration keys for applications.';
    const clients = await rows(env, 'SELECT id,name,sender_address,is_active,created_at,last_used_at FROM api_clients ORDER BY created_at DESC');
    content = ui.apiClients(clients, sess, (url.searchParams.get('created_key') || '').slice(0, 128));
  } else if (view === 'users') {
    title='Admin users'; subtitle='Manage administrator identities authorized through Cloudflare Access.';
    const role = await adminRole(env, sess.access_subject || subject);
    const users = await rows(env, 'SELECT subject,role,is_active,created_at FROM admin_users ORDER BY created_at');
    content = ui.users(users, sess, role === 'superadmin');
  } else if (view === 'domains') {
    title='Domains'; subtitle='Track client sending domains and DNS onboarding.';
    const domains = await rows(env, 'SELECT domain,display_name,is_verified,created_at FROM managed_domains ORDER BY created_at DESC');
    content = ui.domains(domains, sess);
  } else if (view === 'docs') {
    if (await adminRole(env, sess.access_subject || subject) !== 'superadmin') throw new HttpError(403, 'Superadmin required.');
    title='Documentation'; subtitle='Edit the public /docs page.';
    const row = await env.DB.prepare("SELECT value FROM app_settings WHERE name='DOCS_CONTENT'").first();
    content = ui.docsEditor(row?.value || '', sess);
  } else if (view === 'mail') {
    title='Mail activity'; subtitle='Trace every message from request to provider.';
    const page = Math.min(10000, Math.max(1, Number(url.searchParams.get('page')) || 1));
    if (!Number.isInteger(page)) throw new HttpError(422, 'Invalid page.');
    const filters={search:(url.searchParams.get('search')||'').slice(0,100),direction:url.searchParams.get('direction')||'',status:url.searchParams.get('status')||''};
    const clauses=[], params=[];
    if (filters.direction) { if (!['inbound','outbound'].includes(filters.direction)) throw new HttpError(422,'Invalid direction.'); clauses.push('direction=?'); params.push(filters.direction); }
    if (filters.status) { if (!['Queued','Sent','Delivered','Bounced','Failed'].includes(filters.status)) throw new HttpError(422,'Invalid status.'); clauses.push('transmission_status=?'); params.push(filters.status); }
    if (filters.search) { clauses.push('(subject LIKE ? OR recipient_address LIKE ?)'); const term='%'+filters.search.replace(/[\\%_]/g,'\\$&')+'%'; clauses[clauses.length-1]="(subject LIKE ? ESCAPE '\\' OR recipient_address LIKE ? ESCAPE '\\')"; params.push(term,term); }
    const logs=await rows(env,`SELECT id,direction,subject,recipient_address,transmission_status,provider_used,unix_timestamp FROM email_logs ${clauses.length?'WHERE '+clauses.join(' AND '):''} ORDER BY unix_timestamp DESC,id LIMIT 26 OFFSET ?`,...params,(page-1)*25);
    content=ui.mailView(logs.slice(0,25),filters,page,logs.length>25);
  } else if (view === 'overview') {
    title='Overview'; subtitle='A clear view of your email infrastructure.';
    const stats=await env.DB.prepare("SELECT COUNT(*) AS total, SUM(transmission_status IN ('Sent','Delivered')) AS accepted, SUM(transmission_status IN ('Failed','Bounced')) AS issues, SUM(transmission_status='Queued') AS pending FROM email_logs").first();
    const [logs,health]=await Promise.all([rows(env,'SELECT id,direction,subject,recipient_address,transmission_status,provider_used,unix_timestamp FROM email_logs ORDER BY unix_timestamp DESC LIMIT 7'),rows(env,'SELECT * FROM provider_health')]);
    content=ui.overview(stats,logs,health,cfg);
  } else throw new HttpError(404,'View not found.');
  return reply(ui.page(view,title,subtitle,content,sess,notice),200,sess.script_nonce?{'Content-Security-Policy':headers['Content-Security-Policy'].replace("script-src 'none'",`script-src 'nonce-${sess.script_nonce}'`)}:{});
}

export default {
  async fetch(request, env) {
    try { return await handler(request, env); }
    catch (err) {
      const status = err instanceof HttpError ? err.status : 500, reference = crypto.randomUUID();
      if (status === 500) console.error(JSON.stringify({event:'REQUEST_FAILURE',reference}));
      const message = status === 500 ? 'Request could not complete. Reference: ' + reference : err.message;
      const extra = status===429 ? {'Retry-After':'60'} : {};
      return new URL(request.url).pathname.startsWith('/admin') ? reply(ui.errorPage(message,status),status,extra) : reply({error:message,reference},status,extra);
    }
  },
  async email(message, env) {
    try {
      const {values:cfg}=await config(env);
      if (message.rawSize>131072 || !await activeIdentity(env,email(message.to)||'')) { message.setReject('Message too large or recipient not accepted.'); return; }
      const raw=await readBody(new Request('https://inbound.invalid',{method:'POST',body:message.raw,duplex:'half'}));
      await env.DB.prepare(`INSERT INTO email_logs (id,direction,provider_used,sender_address,recipient_address,subject,text_body,html_hash,transmission_status,unix_timestamp,updated_at)
        VALUES (?,'inbound','cloudflare_mx',?,?,?,?,?,'Delivered',unixepoch(),unixepoch())`)
        .bind(crypto.randomUUID(),String(message.from).slice(0,254),message.to,String(message.headers.get('subject')||'(No subject)').slice(0,255),cfg.STORE_MESSAGE_BODIES==='true'?raw:null,await hash(raw)).run();
    } catch { console.error('Inbound capture failed'); message.setReject('Unable to accept message.'); }
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil((async()=>{
      const {values:cfg}=await config(env); const cutoff=now()-+cfg.RETENTION_DAYS*86400;
      // Bounded daily cleanup; monitor backlog for high-volume deployments.
      await env.DB.batch([
        env.DB.prepare('DELETE FROM email_logs WHERE id IN (SELECT id FROM email_logs WHERE unix_timestamp<? LIMIT 1000)').bind(cutoff),
        env.DB.prepare('DELETE FROM security_audit_logs WHERE id IN (SELECT id FROM security_audit_logs WHERE unix_timestamp<? LIMIT 1000)').bind(now()-90*86400),
        env.DB.prepare('DELETE FROM admin_sessions WHERE expires_at<=unixepoch()'),
        env.DB.prepare('DELETE FROM rate_limits WHERE bucket_key IN (SELECT bucket_key FROM rate_limits WHERE expires_at<=unixepoch() LIMIT 10000)'),
        env.DB.prepare('DELETE FROM webhook_events WHERE event_key IN (SELECT event_key FROM webhook_events WHERE created_at<? LIMIT 1000)').bind(now()-7*86400),
      ]);
      // Dispatch keys are deliberately retained: expiry must never silently re-send old operations.
    })());
  },
};
