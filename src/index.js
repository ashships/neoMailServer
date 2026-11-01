import { HttpError, reply, redirect, hash, hashOtp, equal, email, text, hostname, cookie, local, sameOrigin, form, json, readBody, rate, audit, access, session, csrf, sessionCookie, bytes64, headers } from './security.js';
import { config, redactConfig, saveSettings, saveSecret, PROVIDERS, getAccountProviderKeys, saveAccountProviderKey, deleteAccountProviderKey, toggleAccountProviderKey, resolveAccountProviderSecrets } from './config.js';
import { dispatch, validateMail, verifyWebhook, applyWebhook, sendSmtp, send, getProviderLimits, getProviderUsage } from './providers.js';
import { safeFetch } from './security.js';
import * as ui from './ui.js';
import { getProfile, saveProfile, profileForm, profileImage } from './profile.js';

const now = () => Math.floor(Date.now() / 1000);
const flash = message => redirect('/admin?notice=' + encodeURIComponent(message));
async function rows(env, sql, ...params) {
  try {
    return (await env.DB.prepare(sql).bind(...params).all()).results || [];
  } catch (err) {
    console.error(JSON.stringify({ event: 'QUERY_FAILED', sql, error: err?.message || String(err) }));
    return [];
  }
}
async function identities(env, subject = null) {
  const superadmin = subject ? await adminRole(env, subject) === 'superadmin' : true;
  return rows(env, superadmin ? 'SELECT * FROM sender_identities ORDER BY is_default DESC,email_address' : 'SELECT * FROM sender_identities WHERE owner_subject=? ORDER BY is_default DESC,email_address', ...(superadmin?[]:[subject]));
}
function requireMethod(request, methods) { if (!methods.includes(request.method)) throw new HttpError(405, 'Method not allowed.'); }
async function activeIdentity(env, address) { return env.DB.prepare('SELECT * FROM sender_identities WHERE email_address=? AND is_active=1').bind(address).first(); }
async function verifyDomainDns(domain, token) {
  if (!domain || !token) return false;
  try {
    const res = await safeFetch('https://cloudflare-dns.com/dns-query?name=' + encodeURIComponent('_neomail-verification.' + domain) + '&type=TXT', { headers: { Accept: 'application/dns-json' } });
    if (!res.ok) return false;
    const data = await res.json();
    return (data.Answer || []).some(a => String(a.data || '').replace(/"/g, '').includes(token));
  } catch { return false; }
}

async function isSuperadmin(env, subject) {
  if (subject === 'local-admin') return true;
  const role = await adminRole(env, subject);
  return role === 'superadmin';
}
// Subjects are opaque Cloudflare Access identities or panel email addresses.
function subjectValue(value) {
  const subject = typeof value === 'string' ? value.trim() : '';
  if (!subject || subject.length > 254 || /[\x00-\x1f\x7f]/.test(subject)) throw new HttpError(422, 'A valid administrator subject is required.');
  return subject;
}
async function getAdminCount(env) {
  if (!env.DB) return 0;
  try {
    const res = await env.DB.prepare('SELECT COUNT(*) AS n FROM admin_users').first();
    if (res === null || res === undefined) return 0;
    return typeof res === 'object' ? Number(res.n ?? 0) : Number(res || 0);
  } catch {
    return 0;
  }
}
async function adminRole(env, subject) {
  if (!subject) return null;
  // The loopback development identity is the only implicit superadmin, and only
  // while LOCAL_DEV is explicitly enabled. Production always resolves from D1.
  if (subject === 'local-admin' && env.LOCAL_DEV === 'true') return 'superadmin';
  if (!env.DB) return null;
  try {
    const count = await getAdminCount(env);
    // An empty directory is the one-time bootstrap path. Once any administrator
    // exists, every subject must have an explicit role.
    if (count === 0) return 'superadmin';
    const row = await env.DB.prepare('SELECT role FROM admin_users WHERE subject=? AND is_active=1').bind(subject).first();
    return row?.role || null;
  } catch { return null; } // Fail closed on database errors: no role means no tenant or superadmin powers.
}
async function sessionSubject(env) {
  const count = await getAdminCount(env);
  if (count === 0) return 'local-admin';
  const row = await env.DB.prepare("SELECT subject FROM admin_users WHERE role='superadmin' AND is_active=1 ORDER BY created_at LIMIT 1").first();
  if (!row?.subject) throw new HttpError(403, 'No active superadmin is provisioned for token sign-in.');
  return row.subject;
}
async function apiClient(env, token) {
  if (typeof token !== 'string' || !token) return null;
  const digest = await hash(token);
  const row = await env.DB.prepare('SELECT * FROM api_clients WHERE key_hash=? AND is_active=1').bind(digest).first();
  if (row) {
    // Throttle last-used writes so a high-volume key cannot amplify every request
    // into an additional D1 write.
    if (!row.last_used_at || now() - row.last_used_at > 60) {
      await env.DB.prepare('UPDATE api_clients SET last_used_at=unixepoch() WHERE id=?').bind(row.id).run();
    }
    return row;
  }
  const { values: cfg } = await config(env);
  if (cfg.API_SECRET_KEY && await equal(token, cfg.API_SECRET_KEY)) return { id: 'legacy', name: 'Legacy API key', sender_address: null, owner_subject: 'local-admin' };
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
  // Never undefined: session credential_version is derived from this value and must stay consistent.
  if (local(request, env)) return env.LOCAL_ADMIN_TOKEN ? hash(env.LOCAL_ADMIN_TOKEN) : (env.ADMIN_TOKEN_HASH || '');
  if (accessConfigured(env)) return 'access-v2:' + env.ACCESS_TEAM_DOMAIN + ':' + env.ACCESS_AUD;
  return env.ADMIN_TOKEN_HASH || '';
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
  const url = new URL(request.url); let path = url.pathname; const ip = request.headers.get('cf-connecting-ip') || 'local';
  if (path === '/login') {
    const existingSubject = await access(request, env).catch(() => null);
    if (existingSubject) {
      const existingRole = await adminRole(env, existingSubject);
      return redirect(existingRole === 'superadmin' ? '/admin' : '/dashboard');
    }
    path = '/admin/login';
  }
  // Public probes do not disclose configuration, secrets, or database details.
  if (path.startsWith('/docs/')) {
    requireMethod(request, ['GET']);
    return redirect('/docs');
  }
  if (path === '/docs') {
    requireMethod(request, ['GET']);
    const row = await env.DB.prepare("SELECT value FROM app_settings WHERE name='DOCS_CONTENT'").first();
    const content = row?.value || 'NeoMail documentation. Configure your deployment and providers in the admin panel.';
    const isDark = cookie(request, 'neomail_theme') === 'dark';
    return reply(ui.publicDocs(content, isDark), 200, { 'Content-Type': 'text/html; charset=utf-8' });
  }
  if (path === '/health') { requireMethod(request, ['GET']); return reply({ status: 'ok', service: 'neoMailer' }); }
  if (path === '/favicon.ico' || path === '/favicon.svg') {
    requireMethod(request, ['GET']);
    return new Response(ui.faviconSvg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  }
  if (path === '/') { requireMethod(request, ['GET']); return redirect('/login'); }

  if (request.method === 'OPTIONS') return reply({ error: 'Browser cross-origin API calls are not supported.' }, 405);
  if (!env.DB) throw new HttpError(503, 'Database binding unavailable.');
  if (env.REQUIRES_CLOUDFLARE_PROXY === 'true' && !local(request, env) && !request.headers.get('cf-ray')) throw new HttpError(403, 'Direct access not allowed.');
  if (!local(request, env) && url.protocol !== 'https:') throw new HttpError(403, 'HTTPS required.');
  if (path === '/api/v1/send' || path === '/api/send') {
    requireMethod(request, ['POST']);
    await rate(env, 'api-auth:' + ip, 120, 60);
    const bearer = request.headers.get('authorization') || '';
    const token = bearer.startsWith('Bearer ') ? bearer.slice(7) : '';
    const client = await apiClient(env, token);
    if (!client) throw new HttpError(401, 'Invalid API credential.');
    const { values: cfg } = await config(env, request.method === 'POST');
    await rate(env, 'api:client:' + client.id, +cfg.API_RATE_LIMIT_PER_MINUTE, 60);
    const data = await json(request);
    if (client.sender_address) {
      if (data.from && email(data.from) !== client.sender_address) throw new HttpError(403, 'This API client is restricted to its assigned sender.');
      if (!data.from) data.from = client.sender_address;
    }
    const mail = validateMail(data, cfg);
    const result = await dispatch(env, cfg, mail, request.headers.get('idempotency-key'), client.owner_subject || 'local-admin');
    return reply(result, result.success ? 200 : result.uncertain ? 202 : 502);
  }
  if (path.startsWith('/webhooks/')) {
    requireMethod(request, ['POST']);
    const provider = path.slice('/webhooks/'.length);
    if (!['resend', 'mailgun'].includes(provider)) throw new HttpError(404, 'Webhook provider not supported.');
    const { values: cfg } = await config(env, request.method === 'POST');
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
    const owner = client.owner_subject || 'local-admin';
    if (request.method === 'GET') {
      const list = await rows(env, 'SELECT domain,display_name,is_verified,created_at FROM managed_domains WHERE owner_subject=? ORDER BY created_at DESC', owner);
      return reply({ domains: list });
    }
    await rate(env, 'api:client:' + client.id, + (await config(env)).values.API_RATE_LIMIT_PER_MINUTE, 60);
    const data = await json(request);
    const domain = hostname(typeof data.domain === 'string' ? data.domain : '');
    if (!domain) throw new HttpError(422, 'Enter a valid domain such as client.example.com.');
    const name = text(typeof data.display_name === 'string' ? data.display_name : '', 100, false) || domain;
    const vtoken = crypto.randomUUID().replace(/-/g, '');
    try {
      await env.DB.prepare('INSERT INTO managed_domains (domain,display_name,is_verified,created_at,created_by,owner_subject,verification_token) VALUES (?,?,0,unixepoch(),?,?,?)').bind(domain, name, client.id, owner, vtoken).run();
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
    await rate(env, 'api-auth:' + ip, 120, 60);
    await rate(env, 'domain-verify:' + ip, 10, 60);
    const bearer = request.headers.get('authorization') || '';
    const token = bearer.startsWith('Bearer ') ? bearer.slice(7) : '';
    const client = await apiClient(env, token);
    if (!client) throw new HttpError(401, 'Invalid API credential.');
    const data = await json(request);
    const domain = hostname(typeof data.domain === 'string' ? data.domain : '');
    if (!domain) throw new HttpError(422, 'Enter a valid domain such as client.example.com.');
    const owner = client.owner_subject || 'local-admin';
    const row = await env.DB.prepare('SELECT verification_token FROM managed_domains WHERE domain=? AND owner_subject=?').bind(domain, owner).first();
    if (!row) throw new HttpError(404, 'Domain not found.');
    // Propagation refresh: pass confirms, fail revokes — removed records stop all sending.
    const ok = row.verification_token === 'bootstrap-verified' ? true : await verifyDomainDns(domain, row.verification_token);
    await env.DB.prepare('UPDATE managed_domains SET is_verified=? WHERE domain=? AND owner_subject=?').bind(ok ? 1 : 0, domain, owner).run();
    await audit(env, request, 'DOMAIN_VERIFIED', { domain, ok, client: client.id });
    return reply({ domain, verified: ok, status: ok ? 'verified' : 'pending_dns' });
  }
  if (path !== '/admin' && path !== '/dashboard' && !path.startsWith('/admin/') && !path.startsWith('/dashboard/')) throw new HttpError(404, 'Endpoint not found.');
  const subject = await access(request, env);
  if (!subject && path !== '/admin/login' && path !== '/login') return redirect('/login');
  const role = subject ? await adminRole(env, subject) : null;
  const dashboardMode = path === '/dashboard' || path.startsWith('/dashboard/');
  if (dashboardMode && role === 'superadmin') {
    const sub = path.startsWith('/dashboard/') ? path.slice('/dashboard/'.length) : '';
    return redirect(sub ? `/admin/${sub}${url.search || ''}` : `/admin${url.search || ''}`);
  }
  // Tenant workspaces may mutate their own resources via scoped action endpoints and inspect their
  // own messages; every other admin path (global settings, users, providers, docs, views) requires the superadmin role.
  const tenantForm = (request.method === 'POST' && ['/admin/identities/create','/admin/identities/update','/admin/api-clients/create','/admin/api-clients/revoke','/admin/domains/create','/dashboard/domains/create','/admin/domains/verify','/dashboard/domains/verify','/admin/domains/delete','/dashboard/domains/delete','/admin/domains/auto-check','/dashboard/domains/auto-check','/admin/providers/limit','/dashboard/providers/limit','/admin/send-test','/admin/logout','/admin/sessions/revoke','/admin/profile','/dashboard/profile','/admin/account-keys/save','/admin/account-keys/delete','/admin/account-keys/toggle'].includes(path))
    || (request.method === 'GET' && ['/admin/view-mail','/admin/email','/admin/preview','/admin/profile-image','/dashboard/profile-image'].includes(path));
  if (!dashboardMode && path.startsWith('/admin') && role !== 'superadmin' && path !== '/admin/login' && !tenantForm) {
    if (request.method === 'GET' && !url.searchParams.has('view')) {
      const sub = path.slice('/admin/'.length).split('/')[0];
      const VALID_SLUGS = ['overview','mail','providers','identities','clients','users','domains','docs','security','settings','setup','compose'];
      if (VALID_SLUGS.includes(sub)) {
        return redirect(`/dashboard/${sub}${url.search || ''}`);
      }
    }
    return redirect('/dashboard' + (url.search || ''));
  }
  if (path === '/admin/login') {
    requireMethod(request, ['GET', 'POST']);
    const isDark = cookie(request, 'neomail_theme') === 'dark';
    if (request.method === 'GET') {
      if (otpLoginConfigured(env) && url.searchParams.get('mode') !== 'token') {
        const email = (url.searchParams.get('email') || '').slice(0, 254);
        const pending = email ? await env.DB.prepare('SELECT 1 FROM admin_otps WHERE subject=? AND expires_at>unixepoch()').bind(email).first() : null;
        return reply(pending ? ui.otpVerify(email, '', isDark) : ui.otpRequest('', isDark));
      }
      return reply((local(request, env) || tokenLoginConfigured(env)) ? ui.login('', isDark) : ui.accessLogin());
    }
    sameOrigin(request);
    const { values: cfg } = await config(env, request.method === 'POST');
    await rate(env, 'login:ip:' + ip, +cfg.MAX_LOGIN_ATTEMPTS, 60);
    const data = await form(request);
    if (otpLoginConfigured(env) && data.get('step')) {
      const step = data.get('step');
      if (step === 'request') {
        const emailAddr = email(data.get('email'));
        if (!emailAddr) throw new HttpError(422, 'Valid administrator email required.');
        await rate(env, 'login:ip:' + ip, +cfg.MAX_LOGIN_ATTEMPTS, 60);
        await rate(env, 'login:subject:' + emailAddr, +cfg.MAX_LOGIN_ATTEMPTS, 60);
        // Hard cap on outbound login mail per IP so the OTP endpoint cannot be used
        // to bomb a mailbox or burn provider quota.
        await rate(env, 'otp:request:' + ip, 10, 3600);
        const totalAdmins = await getAdminCount(env);
        const allowedUser = await env.DB.prepare('SELECT role, is_active FROM admin_users WHERE subject=?').bind(emailAddr).first().catch(() => null);
        const isBootstrap = totalAdmins === 0;
        const authorized = isBootstrap || (allowedUser && allowedUser.is_active === 1);

        if (!authorized) {
          await audit(env, request, 'AUTH_REJECTED_UNREGISTERED', { subject: emailAddr });
          return reply(ui.otpRequest("We couldn't find an account associated with this email address. Please check your email address.", isDark, emailAddr), 403);
        }

        const existing = await env.DB.prepare('SELECT created_at FROM admin_otps WHERE subject=?').bind(emailAddr).first().catch(() => null);
        const nowSec = now();
        if (existing && nowSec - existing.created_at < 60) {
          return reply(ui.otpVerify(emailAddr, '', isDark));
        }
        {
          const otpBytes = new Uint32Array(1); crypto.getRandomValues(otpBytes); const code = String(100000 + (otpBytes[0] % 900000));
          const saltBytes = new Uint8Array(16); crypto.getRandomValues(saltBytes);
          const salt = [...saltBytes].map(b => b.toString(16).padStart(2, '0')).join('');
          const expires = nowSec + 300;
          try {
            await env.DB.prepare('INSERT INTO admin_otps (subject,salt,code_hash,expires_at,attempts,created_at) VALUES (?,?,?,?,0,unixepoch()) ON CONFLICT(subject) DO UPDATE SET salt=excluded.salt,code_hash=excluded.code_hash,expires_at=excluded.expires_at,attempts=0,created_at=unixepoch()').bind(emailAddr, salt, await hashOtp(salt, code), expires).run();
          } catch (dbErr) {
            await env.DB.prepare(`CREATE TABLE IF NOT EXISTS admin_otps (
              subject TEXT PRIMARY KEY,
              salt TEXT,
              code_hash TEXT NOT NULL,
              expires_at INTEGER NOT NULL,
              attempts INTEGER NOT NULL DEFAULT 0,
              created_at INTEGER NOT NULL
            )`).run().catch(() => {});
            await env.DB.prepare('ALTER TABLE admin_otps ADD COLUMN salt TEXT').run().catch(() => {});
            await env.DB.prepare('INSERT INTO admin_otps (subject,salt,code_hash,expires_at,attempts,created_at) VALUES (?,?,?,?,0,unixepoch()) ON CONFLICT(subject) DO UPDATE SET salt=excluded.salt,code_hash=excluded.code_hash,expires_at=excluded.expires_at,attempts=0,created_at=unixepoch()').bind(emailAddr, salt, await hashOtp(salt, code), expires).run();
          }
          try {
            const masterCfg = {
              SMTP_HOST: env.OTP_SMTP_HOST || env.SMTP_HOST || cfg.SMTP_HOST,
              SMTP_PORT: env.OTP_SMTP_PORT || env.SMTP_PORT || cfg.SMTP_PORT || '465',
              SMTP_USER: env.OTP_SMTP_USER || env.OTP_SMTP_USERNAME || env.SMTP_USER || env.SMTP_USERNAME || cfg.SMTP_USER || cfg.SMTP_USERNAME,
              SMTP_PASS: env.OTP_SMTP_PASS || env.OTP_SMTP_PASSWORD || env.SMTP_PASS || env.SMTP_PASSWORD || cfg.SMTP_PASS || cfg.SMTP_PASSWORD,
              DEFAULT_SENDER: cfg.DEFAULT_SENDER,
              DEFAULT_SENDER_NAME: 'neoMailer',
            };
            const defaultSender = email(cfg.DEFAULT_SENDER) || email(env.DEFAULT_SENDER) || 'no-reply@mail.neopathshala.com';
            const isGmail = (masterCfg.SMTP_HOST || '').toLowerCase().includes('gmail') || (masterCfg.SMTP_HOST || '').toLowerCase().includes('google');
            const smtpUserEmail = email(masterCfg.SMTP_USER);
            const smtpSender = (isGmail && smtpUserEmail) ? smtpUserEmail : (defaultSender || smtpUserEmail || 'no-reply@mail.neopathshala.com');
            masterCfg.DEFAULT_SENDER = smtpSender;

            const mailText = `Your neoMailer verification code is: ${code}\n\nIt expires in 5 minutes.\nIf you did not request this code, you can safely ignore this email.`;
            const mailHtml = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:520px;margin:24px auto;padding:32px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;color:#0f172a;">
  <div style="font-size:20px;font-weight:700;color:#087d54;margin-bottom:16px;">neoMailer</div>
  <h2 style="font-size:18px;font-weight:600;margin:0 0 12px 0;">Sign-in verification code</h2>
  <p style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 24px 0;">Enter the following 6-digit verification code to complete your login to the neoMailer administration panel. This code is valid for 5 minutes.</p>
  <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:20px;text-align:center;font-size:32px;font-weight:700;letter-spacing:6px;color:#0f172a;font-family:monospace;margin:0 0 24px 0;">${code}</div>
  <p style="font-size:12px;line-height:1.5;color:#94a3b8;margin:0;">If you did not request this login code, you can safely ignore this email. Do not share this code with anyone.</p>
</div>`;

            const mail = validateMail({
              to: emailAddr,
              from: smtpSender,
              from_name: masterCfg.DEFAULT_SENDER_NAME || 'neoMailer',
              subject: 'neoMailer verification code',
              text: mailText,
              html: mailHtml,
            }, masterCfg);

            let sent = false;
            let dispatchErr = null;

            // 1. Try master SMTP first if configured
            if (masterCfg.SMTP_HOST && masterCfg.SMTP_USER && masterCfg.SMTP_PASS) {
              try {
                await sendSmtp(masterCfg, mail);
                sent = true;
              } catch (err) {
                dispatchErr = err;
                console.error('Master SMTP failed during OTP dispatch:', err.message || err);
              }
            }

            // 2. Fallback across active system providers if SMTP failed or was not configured
            if (!sent) {
              const providers = (cfg.FALLBACK_ORDER || 'resend,brevo,mailgun,mailtrap,mailersend').split(',');
              const adminSecrets = await resolveAccountProviderSecrets(env, 'local-admin').catch(() => ({}));
              const mergedEnv = { REQUEST_TIMEOUT_MS: '6000', ...env, ...cfg, ...adminSecrets };
              for (const p of providers) {
                if (p === 'smtp' || !PROVIDERS.includes(p)) continue;
                if (!mergedEnv[p.toUpperCase() + '_API_KEY']) continue;
                if (p === 'mailgun' && !mergedEnv.MAILGUN_DOMAIN) continue;
                try {
                  const providerMail = { ...mail, from: defaultSender };
                  await send(p, mergedEnv, providerMail, 'otp-' + crypto.randomUUID());
                  sent = true;
                  break;
                } catch (provErr) {
                  dispatchErr = provErr;
                  console.error(`Provider ${p} failed during OTP dispatch:`, provErr.message || provErr);
                }
              }
            }

            if (!sent) {
              const reason = dispatchErr?.message ? `: ${dispatchErr.message}` : '';
              throw new Error('Unable to deliver login code' + reason);
            }
          } catch (err) {
            await env.DB.prepare('DELETE FROM admin_otps WHERE subject=?').bind(emailAddr).run().catch(() => {});
            // Upstream errors may echo credentials or addresses; log a correlation
            // reference only and return a generic retry message.
            console.error(JSON.stringify({ event: 'OTP_DELIVERY_FAILED', reference: crypto.randomUUID(), error: err?.message || String(err) }));
            if (err instanceof HttpError) throw err;
            throw new HttpError(503, 'Unable to deliver a login code right now. Check your email provider configuration and try again shortly.');
          }
          await audit(env, request, 'OTP_SENT', { subject: emailAddr });
        }
        return reply(ui.otpVerify(emailAddr, '', isDark));
      }
      if (step === 'verify') {
        const emailAddr = email(data.get('email'));
        const code = String(data.get('code') || '');
        if (!emailAddr || !/^[0-9]{6}$/.test(code)) throw new HttpError(422, 'Invalid code.');
        await rate(env, 'otp:verify:' + ip, 10, 300);
        const row = await env.DB.prepare('SELECT * FROM admin_otps WHERE subject=?').bind(emailAddr).first();
        // Five failed attempts (or expiry) burn the code. A successful check deletes it.
        if (!row || row.expires_at <= now() || row.attempts >= 5) {
          await env.DB.prepare('DELETE FROM admin_otps WHERE subject=?').bind(emailAddr).run();
          throw new HttpError(403, 'Login code expired or invalid.');
        }
        if (!await equal(await hashOtp(row.salt, code), row.code_hash)) {
          await env.DB.prepare('UPDATE admin_otps SET attempts=attempts+1 WHERE subject=?').bind(emailAddr).run();
          throw new HttpError(403, 'Invalid or expired login code.');
        }
        await env.DB.prepare('DELETE FROM admin_otps WHERE subject=?').bind(emailAddr).run();
        const totalAdmins = await getAdminCount(env);
        if (totalAdmins === 0) {
          await env.DB.prepare('INSERT OR IGNORE INTO admin_users (subject,role,is_active,created_at,created_by) VALUES (?,?,1,unixepoch(),?)').bind(emailAddr, 'superadmin', 'bootstrap').run();
        }

        const userAccount = await env.DB.prepare('SELECT role, is_active FROM admin_users WHERE subject=?').bind(emailAddr).first();
        if (!userAccount || userAccount.is_active !== 1) {
          await audit(env, request, 'AUTH_VERIFY_UNREGISTERED', { subject: emailAddr });
          throw new HttpError(403, "We couldn't find an account associated with this email address. Please check your email address.");
        }

        const targetRole = userAccount.role;
        if (targetRole !== 'superadmin' && targetRole !== 'admin') {
          throw new HttpError(403, 'Account role not permitted.');
        }
        const token = crypto.randomUUID(), csrfToken = crypto.randomUUID();
        const prior = cookie(request, '__Host-neomail');
        await env.DB.batch([
          env.DB.prepare('DELETE FROM admin_sessions WHERE token_hash=? OR expires_at<=unixepoch()').bind(await hash(prior)),
          env.DB.prepare('INSERT INTO admin_sessions (token_hash,csrf_token,access_subject,credential_version,expires_at) VALUES (?,?,?,?,?)').bind(await hash(token), csrfToken, emailAddr, await hash(await adminVerifier(request, env)), now() + 3600),
        ]);
        await audit(env, request, 'AUTH_SUCCESS');
        return redirect(targetRole === 'superadmin' ? '/admin' : '/dashboard', { 'Set-Cookie': sessionCookie(token) });
      }
      throw new HttpError(422, 'Invalid login step.');
    }
    await rate(env, 'login:subject:' + (subject || 'token'), +cfg.MAX_LOGIN_ATTEMPTS, 60);
    const data2 = data;
    try { await reauthenticate(request, env, data2); } catch (e) {
      await audit(env, request, 'AUTH_FAILURE'); return reply((local(request, env) || tokenLoginConfigured(env) || otpLoginConfigured(env)) ? ui.login('Sign-in failed. Check your administrator token.', isDark) : ui.accessLogin(), e.status || 401);
    }
    // Token sign-in has no per-user identity of its own. Bind the session to the
    // first active superadmin; the deployment identity is used only during the
    // empty-directory bootstrap window.
    const sessionIdentity = subject || await sessionSubject(env);
    const sessionRole = await adminRole(env, sessionIdentity);
    if (!sessionRole) throw new HttpError(403, 'This administrator account is not authorized.');
    const token = crypto.randomUUID(), csrfToken = crypto.randomUUID();
    const prior = cookie(request, '__Host-neomail');
    await env.DB.batch([
      env.DB.prepare('DELETE FROM admin_sessions WHERE token_hash=? OR expires_at<=unixepoch()').bind(await hash(prior)),
      env.DB.prepare('INSERT INTO admin_sessions (token_hash,csrf_token,access_subject,credential_version,expires_at) VALUES (?,?,?,?,?)').bind(await hash(token), csrfToken, sessionIdentity, await hash(await adminVerifier(request, env)), now() + 3600),
    ]);
    await audit(env, request, 'AUTH_SUCCESS');
    return redirect(sessionRole === 'superadmin' ? '/admin' : '/dashboard', { 'Set-Cookie': sessionCookie(token) });
  }
  const sess = await session(request, { ...env, ADMIN_TOKEN_HASH: await adminVerifier(request, env) }, subject);
  if (!sess) return redirect('/admin/login');
  // Revocation is immediate: a session for a deactivated/deleted administrator is
  // destroyed before any tenant or superadmin handler runs.
  if (!role) {
    await env.DB.prepare('DELETE FROM admin_sessions WHERE token_hash=?').bind(sess.token_hash).run();
    return redirect('/admin/login');
  }
  sess.local_dev = local(request, env);
  sess.theme = cookie(request, 'neomail_theme') || '';
  sess.profile = await getProfile(env, subject);
  if (path === '/admin/profile-image' || path === '/dashboard/profile-image') {
    requireMethod(request, ['GET']);
    const targetSubject = ((await isSuperadmin(env, subject)) && url.searchParams.get('subject')) ? url.searchParams.get('subject') : subject;
    return profileImage(env, targetSubject);
  }
  const { values: cfg } = await config(env, request.method === 'POST');
  if (request.method === 'POST') {
    const isProfilePost = path === '/admin/profile' || path === '/dashboard/profile';
    const data = isProfilePost ? await profileForm(request) : await form(request); await csrf(request, data, sess);
    // Controls all console mutations, including test email dispatch.
    await rate(env, 'admin:' + subject, 30, 60);
    if (isProfilePost) {
      const result = await saveProfile(env, subject, data);
      await audit(env, request, 'PROFILE_UPDATED', result);
      const redirectBase = role === 'superadmin' ? '/admin/settings' : '/dashboard/settings';
      return redirect(redirectBase + '?notice=' + encodeURIComponent('Profile updated.') + '#profile');
    }
    if (path === '/admin/logout') {
      await env.DB.prepare('DELETE FROM admin_sessions WHERE token_hash=?').bind(sess.token_hash).run();
      await audit(env, request, 'LOGOUT'); return redirect((local(request, env) || !accessConfigured(env)) ? '/login' : '/cdn-cgi/access/logout', { 'Set-Cookie': sessionCookie('', 0) });
    }
    if (path === '/admin/sessions/revoke') {
      // Tenants may only revoke their own sessions; superadmins revoke the whole deployment.
      if (await isSuperadmin(env, subject)) await env.DB.prepare('DELETE FROM admin_sessions').run();
      else await env.DB.prepare('DELETE FROM admin_sessions WHERE access_subject=?').bind(subject).run();
      await audit(env, request, 'SESSIONS_REVOKED'); return redirect((local(request, env) || !accessConfigured(env)) ? '/login' : '/cdn-cgi/access/logout', { 'Set-Cookie': sessionCookie('', 0) });
    }
    if (path === '/admin/settings') {
      if (await adminRole(env, subject) !== 'superadmin') throw new HttpError(403, 'Superadmin required.');
      const sender = email(data.get('DEFAULT_SENDER'));
      if (!sender || !await activeIdentity(env, sender)) throw new HttpError(422, 'Default sender must match an active sender identity. Add the identity first.');
      await audit(env, request, 'SETTINGS_CHANGE_REQUESTED');
      const changed = await saveSettings(env, data);
      await audit(env, request, 'SETTINGS_UPDATED', { keys: changed });
      return redirect('/admin?view=settings&notice=Settings+saved');
    }
    if (path === '/admin/credentials') {
      if (await adminRole(env, subject) !== 'superadmin') throw new HttpError(403, 'Superadmin required.');
      await rate(env, 'credential-reauth:' + subject, 5, 900);
      await reauthenticate(request, env, data);
      await audit(env, request, 'CREDENTIAL_CHANGE_REQUESTED', { name: data.get('name') });
      await saveSecret(env, data.get('name'), data.get('value'));
      await audit(env, request, 'CREDENTIAL_UPDATED', { name: data.get('name') });
      return redirect('/admin?view=settings&notice=Credential+saved');
    }
    if (path === '/admin/account-keys/save') {
      const provider = data.get('provider');
      if (!PROVIDERS.includes(provider)) throw new HttpError(422, 'Invalid provider.');
      const apiKey = data.get('api_key');
      let extraConfig = null;
      if (provider === 'mailgun') {
        const domain = data.get('mailgun_domain')?.trim();
        if (domain) extraConfig = { domain };
      } else if (provider === 'smtp') {
        // Routing metadata only: the API key field is the SMTP password and is
        // encrypted separately, never duplicated into extra_config.
        extraConfig = {
          smtp_host: data.get('smtp_host')?.trim(),
          smtp_port: data.get('smtp_port')?.trim() || '465',
          smtp_user: data.get('smtp_user')?.trim(),
        };
      }
      await rate(env, 'account-keys:' + subject, 10, 60);
      await saveAccountProviderKey(env, subject, provider, apiKey, extraConfig);
      await audit(env, request, 'ACCOUNT_PROVIDER_KEY_SAVED', { provider, subject });
      const targetBase = role === 'superadmin' ? '/admin' : '/dashboard';
      return redirect(targetBase + '?view=settings&notice=' + encodeURIComponent('Provider API key encrypted with AES-256-GCM and saved. Stored keys are strictly write-only and cannot be viewed.'));
    }
    if (path === '/admin/account-keys/delete') {
      const provider = data.get('provider');
      await deleteAccountProviderKey(env, subject, provider);
      await audit(env, request, 'ACCOUNT_PROVIDER_KEY_DELETED', { provider, subject });
      const targetBase = role === 'superadmin' ? '/admin' : '/dashboard';
      return redirect(targetBase + '?view=settings&notice=' + encodeURIComponent('Provider API key removed.'));
    }
    if (path === '/admin/account-keys/toggle') {
      const provider = data.get('provider');
      await toggleAccountProviderKey(env, subject, provider);
      await audit(env, request, 'ACCOUNT_PROVIDER_KEY_TOGGLED', { provider, subject });
      const targetBase = role === 'superadmin' ? '/admin' : '/dashboard';
      return redirect(targetBase + '?view=settings&notice=' + encodeURIComponent('Provider status updated.'));
    }
    if (path === '/admin/providers/toggle') {
      if (await adminRole(env, subject) !== 'superadmin') throw new HttpError(403, 'Superadmin required.');
      const provider = data.get('provider'); if (!PROVIDERS.includes(provider)) throw new HttpError(422, 'Unknown provider.');
      await env.DB.prepare(`INSERT INTO provider_health (owner_subject,provider_name,is_active,consecutive_failures,updated_at)
        VALUES ('local-admin',?,0,0,unixepoch())
        ON CONFLICT(owner_subject,provider_name) DO UPDATE SET is_active=1-is_active,consecutive_failures=0,updated_at=unixepoch()`).bind(provider).run();
      await audit(env, request, 'PROVIDER_TOGGLED', { provider }); return redirect('/admin?view=providers&notice=Provider+updated');
    }
    if (path === '/admin/providers/reorder') {
      if (await adminRole(env, subject) !== 'superadmin') throw new HttpError(403, 'Superadmin required.');
      const provider = data.get('provider');
      const direction = data.get('direction');
      const currentOrder = (cfg.FALLBACK_ORDER || 'resend,brevo,mailgun,mailtrap,mailersend').split(',').map(p => p.trim()).filter(Boolean);
      const idx = currentOrder.indexOf(provider);
      if (idx === -1) throw new HttpError(422, 'Provider not in routing order.');
      if (direction === 'up' && idx > 0) {
        const tmp = currentOrder[idx];
        currentOrder[idx] = currentOrder[idx - 1];
        currentOrder[idx - 1] = tmp;
      } else if (direction === 'down' && idx < currentOrder.length - 1) {
        const tmp = currentOrder[idx];
        currentOrder[idx] = currentOrder[idx + 1];
        currentOrder[idx + 1] = tmp;
      }
      const newOrderStr = currentOrder.join(',');
      await env.DB.prepare("INSERT INTO app_settings (name,value,is_secret,updated_at) VALUES ('FALLBACK_ORDER',?,0,unixepoch()) ON CONFLICT(name) DO UPDATE SET value=excluded.value,is_secret=0,updated_at=unixepoch()").bind(newOrderStr).run();
      await audit(env, request, 'PROVIDER_ORDER_UPDATED', { order: newOrderStr });
      return redirect('/admin?view=providers&notice=' + encodeURIComponent('Provider priority order updated.'));
    }
    if (path === '/admin/providers/add') {
      if (await adminRole(env, subject) !== 'superadmin') throw new HttpError(403, 'Superadmin required.');
      const provider = data.get('provider');
      if (!PROVIDERS.includes(provider)) throw new HttpError(422, 'Invalid provider.');
      const currentOrder = (cfg.FALLBACK_ORDER || 'resend,brevo,mailgun,mailtrap,mailersend').split(',').map(p => p.trim()).filter(Boolean);
      if (currentOrder.includes(provider)) throw new HttpError(422, 'Provider is already in routing order.');
      currentOrder.push(provider);
      const newOrderStr = currentOrder.join(',');
      await env.DB.prepare("INSERT INTO app_settings (name,value,is_secret,updated_at) VALUES ('FALLBACK_ORDER',?,0,unixepoch()) ON CONFLICT(name) DO UPDATE SET value=excluded.value,is_secret=0,updated_at=unixepoch()").bind(newOrderStr).run();
      await audit(env, request, 'PROVIDER_ADDED_TO_ROUTING', { provider });
      return redirect('/admin?view=providers&notice=' + encodeURIComponent('Provider added to fallback routing.'));
    }
    if (path === '/admin/providers/remove') {
      if (await adminRole(env, subject) !== 'superadmin') throw new HttpError(403, 'Superadmin required.');
      const provider = data.get('provider');
      const currentOrder = (cfg.FALLBACK_ORDER || 'resend,brevo,mailgun,mailtrap,mailersend').split(',').map(p => p.trim()).filter(Boolean);
      if (currentOrder.length <= 1) throw new HttpError(422, 'At least one provider must remain in routing order.');
      const newOrder = currentOrder.filter(p => p !== provider);
      const newOrderStr = newOrder.join(',');
      await env.DB.prepare("INSERT INTO app_settings (name,value,is_secret,updated_at) VALUES ('FALLBACK_ORDER',?,0,unixepoch()) ON CONFLICT(name) DO UPDATE SET value=excluded.value,is_secret=0,updated_at=unixepoch()").bind(newOrderStr).run();
      await audit(env, request, 'PROVIDER_REMOVED_FROM_ROUTING', { provider });
      return redirect('/admin?view=providers&notice=' + encodeURIComponent('Provider removed from fallback routing.'));
    }
    if (path === '/admin/providers/reset-health') {
      if (await adminRole(env, subject) !== 'superadmin') throw new HttpError(403, 'Superadmin required.');
      const provider = data.get('provider');
      if (!PROVIDERS.includes(provider)) throw new HttpError(422, 'Invalid provider.');
      await env.DB.prepare("INSERT INTO provider_health (owner_subject,provider_name,is_active,consecutive_failures,updated_at) VALUES ('local-admin',?,1,0,unixepoch()) ON CONFLICT(owner_subject,provider_name) DO UPDATE SET consecutive_failures=0, is_active=1, updated_at=unixepoch()").bind(provider).run();
      await audit(env, request, 'PROVIDER_HEALTH_RESET', { provider });
      return redirect('/admin?view=providers&notice=' + encodeURIComponent('Circuit breaker reset for ' + provider + '.'));
    }
    if (path === '/admin/providers/configure') {
      if (await adminRole(env, subject) !== 'superadmin') throw new HttpError(403, 'Superadmin required.');
      const provider = data.get('provider');
      if (!PROVIDERS.includes(provider)) throw new HttpError(422, 'Invalid provider.');
      if (provider === 'smtp') {
        const host = data.get('smtp_host');
        const port = data.get('smtp_port');
        const user = data.get('smtp_user');
        const pass = data.get('smtp_pass');
        const smtpMap = new Map();
        if (host) smtpMap.set('SMTP_HOST', host);
        if (port) smtpMap.set('SMTP_PORT', port);
        if (user) smtpMap.set('SMTP_USER', user);
        if (smtpMap.size) await saveSettings(env, smtpMap);
        if (pass && pass.trim()) await saveSecret(env, 'SMTP_PASS', pass.trim());
      } else {
        const key = data.get('api_key');
        if (key && key.trim()) {
          await saveSecret(env, provider.toUpperCase() + '_API_KEY', key.trim());
        }
        if (provider === 'mailgun' && data.get('mailgun_domain')) {
          await saveSettings(env, new Map([['MAILGUN_DOMAIN', data.get('mailgun_domain').trim()]]));
        }
      }
      if (data.get('add_to_routing') === 'true') {
        const currentOrder = (cfg.FALLBACK_ORDER || 'resend,brevo,mailgun,mailtrap,mailersend').split(',').map(p => p.trim()).filter(Boolean);
        if (!currentOrder.includes(provider)) {
          currentOrder.push(provider);
          const newOrderStr = currentOrder.join(',');
          await env.DB.prepare("INSERT INTO app_settings (name,value,is_secret,updated_at) VALUES ('FALLBACK_ORDER',?,0,unixepoch()) ON CONFLICT(name) DO UPDATE SET value=excluded.value,is_secret=0,updated_at=unixepoch()").bind(newOrderStr).run();
        }
      }
      await audit(env, request, 'PROVIDER_CONFIGURED', { provider });
      return redirect('/admin?view=providers&notice=' + encodeURIComponent('Provider ' + provider + ' configured.'));
    }
    if (path === '/admin/identities/create') {
      const localPart = data.get('local_part') ? text(data.get('local_part'), 64) : '';
      const domain = data.get('domain') ? text(data.get('domain'), 253) : '';
      const address = email(data.get('email_address')) || (localPart && domain ? email(localPart + '@' + domain) : null);
      const displayName = text(data.get('display_name'), 100);
      if (!address) throw new HttpError(422, 'Invalid sender address.');
      // Tenants may only create identities on their own verified sending domains.
      const senderDomain = address.split('@')[1];
      const domainRow = await env.DB.prepare('SELECT is_verified,owner_subject FROM managed_domains WHERE domain=?').bind(senderDomain).first();
      if (!domainRow || !domainRow.is_verified) throw new HttpError(422, 'Add and verify the sending domain before creating an identity for it.');
      if (domainRow.owner_subject !== subject) throw new HttpError(422, 'This sending domain belongs to another workspace.');
      const result = await env.DB.prepare('INSERT INTO sender_identities (id,email_address,display_name,is_default,is_active,created_at,owner_subject) VALUES (?,?,?,0,1,unixepoch(),?) ON CONFLICT(email_address) DO NOTHING RETURNING id').bind(crypto.randomUUID(), address, displayName, subject).first();
      if (!result) throw new HttpError(409, 'Sender identity already exists.');
      await audit(env, request, 'IDENTITY_CREATED', { address }); return redirect('/admin?view=identities&notice=Identity+created');
    }
    if (path === '/admin/identities/update') {
      const address = email(data.get('email_address')), action = data.get('action');
      if (!address || !['default','toggle','rename','delete'].includes(action)) throw new HttpError(422, 'Invalid identity action.');
      const identity = await env.DB.prepare('SELECT * FROM sender_identities WHERE email_address=?').bind(address).first();
      if (!identity) throw new HttpError(404, 'Identity not found.');
      const admin = await isSuperadmin(env, subject);
      if (!admin && identity.owner_subject !== subject) throw new HttpError(403, 'This identity belongs to another workspace.');
      // Tenant mutations are scoped to their own identities; the global default sender stays superadmin-only.
      const ownClause = admin ? '' : ' AND owner_subject=?';
      const ownParams = admin ? [] : [subject];
      if (action === 'delete') {
        if (identity.is_default || address === cfg.DEFAULT_SENDER) throw new HttpError(409, 'Choose another default sender before deleting this identity.');
        await env.DB.prepare(`DELETE FROM sender_identities WHERE email_address=?${ownClause}`).bind(address,...ownParams).run();
        await audit(env, request, 'IDENTITY_DELETED', { address }); return redirect('/admin?view=identities&notice=Identity+deleted');
      }
      if (action === 'rename') {
        const displayName=text(data.get('display_name'),100);
        const changes=[env.DB.prepare(`UPDATE sender_identities SET display_name=? WHERE email_address=?${ownClause}`).bind(displayName,address,...ownParams)];
        if (admin && address===cfg.DEFAULT_SENDER) changes.push(env.DB.prepare('INSERT INTO app_settings(name,value,is_secret,updated_at) VALUES (?,?,0,unixepoch()) ON CONFLICT(name) DO UPDATE SET value=excluded.value,updated_at=unixepoch()').bind('DEFAULT_SENDER_NAME',displayName));
        await env.DB.batch(changes);
      } else if (action === 'toggle') {
        if (identity.is_default || address === cfg.DEFAULT_SENDER) throw new HttpError(409, 'Choose another default sender before pausing this identity.');
        await env.DB.prepare(`UPDATE sender_identities SET is_active=1-is_active WHERE email_address=?${ownClause}`).bind(address,...ownParams).run();
      } else {
        if (!identity.is_active) throw new HttpError(422, 'Enable this identity first.');
        // Tenants set a default among their own identities only; no global setting is touched.
        await env.DB.batch([
          env.DB.prepare(admin ? 'UPDATE sender_identities SET is_default=CASE WHEN email_address=? THEN 1 ELSE 0 END' : 'UPDATE sender_identities SET is_default=CASE WHEN email_address=? THEN 1 ELSE 0 END WHERE owner_subject=?').bind(address,...(admin?[]:[subject])),
          ...(admin ? [env.DB.prepare('INSERT INTO app_settings (name,value,is_secret,updated_at) VALUES (?,?,0,unixepoch()) ON CONFLICT(name) DO UPDATE SET value=excluded.value,updated_at=unixepoch()').bind('DEFAULT_SENDER', address)] : []),
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
      // A client key may only be pinned to a sender identity the workspace owns.
      const admin = await isSuperadmin(env, subject);
      if (sender) {
        const identityRow = await env.DB.prepare(admin ? 'SELECT 1 FROM sender_identities WHERE email_address=? AND is_active=1' : 'SELECT 1 FROM sender_identities WHERE email_address=? AND is_active=1 AND owner_subject=?').bind(sender,...(admin?[]:[subject])).first();
        if (!identityRow) throw new HttpError(422, 'Sender must be an active identity owned by this workspace.');
        const d = sender.split('@')[1]; const dr = await env.DB.prepare('SELECT is_verified FROM managed_domains WHERE domain=?').bind(d).first(); if (dr && !dr.is_verified) throw new HttpError(422, 'Sender domain must be verified first.');
      }
      const bytes = new Uint8Array(32); crypto.getRandomValues(bytes);
      const key = btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      await env.DB.prepare('INSERT INTO api_clients (id,name,key_hash,sender_address,is_active,created_at,owner_subject) VALUES (?,?,?,?,1,unixepoch(),?)').bind(crypto.randomUUID(), name, await hash(key), sender, subject).run();
      await audit(env, request, 'API_CLIENT_CREATED', { name, sender });
      return redirect('/admin?view=clients&created_key=' + encodeURIComponent(key) + '&notice=' + encodeURIComponent('API client created. Copy the key now; it will not be shown again.'));
    }
    if (path === '/admin/api-clients/revoke') {
      const id = data.get('id');
      if (typeof id !== 'string' || !id || id.length > 100) throw new HttpError(422, 'Invalid client.');
      const admin = await isSuperadmin(env, subject);
      await env.DB.prepare(admin ? 'UPDATE api_clients SET is_active=0 WHERE id=?' : 'UPDATE api_clients SET is_active=0 WHERE id=? AND owner_subject=?').bind(id,...(admin?[]:[subject])).run();
      await audit(env, request, 'API_CLIENT_REVOKED', { id });
      return redirect('/admin?view=clients&notice=' + encodeURIComponent('API client revoked.'));
    }
    if (path === '/admin/users/add') {
      if (await adminRole(env, subject) !== 'superadmin') throw new HttpError(403, 'Superadmin required.');
      const newSubject = subjectValue(data.get('subject'));
      if (newSubject === 'local-admin') throw new HttpError(422, 'The local administrator subject is reserved for deployment bootstrap.');
      // Only the fully isolated 'admin' tenant role is assignable; superadmins are never created by the panel.
      const role = data.get('role') === 'admin' ? 'admin' : null;
      if (!role) throw new HttpError(422, 'Invalid role. Only the admin workspace role can be assigned.');
      const existing = await env.DB.prepare('SELECT role FROM admin_users WHERE subject=?').bind(newSubject).first();
      if (existing?.role === 'superadmin') throw new HttpError(409, 'Cannot demote or replace a superadmin from this panel.');
      await env.DB.prepare('INSERT INTO admin_users (subject,role,is_active,created_at,created_by) VALUES (?,?,1,unixepoch(),?) ON CONFLICT(subject) DO UPDATE SET role=excluded.role,is_active=1').bind(newSubject, role, subject).run();
      await audit(env, request, 'ADMIN_USER_ADDED', { subject: newSubject, role }); return redirect('/admin?view=users&notice=' + encodeURIComponent('Administrator added.'));
    }
    if (path === '/admin/users/revoke') {
      if (await adminRole(env, subject) !== 'superadmin') throw new HttpError(403, 'Superadmin required.');
      const target = subjectValue(data.get('subject'));
      if (target === subject) throw new HttpError(422, 'Invalid target.');
      const row = await env.DB.prepare('SELECT role FROM admin_users WHERE subject=?').bind(target).first();
      if (!row) throw new HttpError(404, 'User not found.');
      if (row.role === 'superadmin') throw new HttpError(409, 'Cannot revoke a superadmin.');
      // Revocation is immediate: deactivate the directory entry and delete every
      // live session and pending one-time code in the same batch.
      await env.DB.batch([
        env.DB.prepare('UPDATE admin_users SET is_active=0 WHERE subject=?').bind(target),
        env.DB.prepare('DELETE FROM admin_sessions WHERE access_subject=?').bind(target),
        env.DB.prepare('DELETE FROM admin_otps WHERE subject=?').bind(target),
      ]);
      await audit(env, request, 'ADMIN_USER_REVOKED', { subject: target }); return redirect('/admin?view=users&notice=' + encodeURIComponent('Administrator revoked.'));
    }
    if (path === '/admin/domains/create' || path === '/dashboard/domains/create') {
      const domain = hostname(data.get('domain') || '');
      if (!domain) throw new HttpError(422, 'Enter a valid domain such as client.example.com.');
      const name = text(data.get('display_name'), 100, false) || domain;
      const existing = await env.DB.prepare('SELECT owner_subject FROM managed_domains WHERE domain=?').bind(domain).first();
      if (existing) throw new HttpError(409, existing.owner_subject === subject ? 'This domain is already in your workspace.' : 'This domain is already registered to another workspace.');
      const token = crypto.randomUUID().replace(/-/g, '');
      await env.DB.prepare('INSERT INTO managed_domains (domain,display_name,is_verified,created_at,created_by,owner_subject,verification_token) VALUES (?,?,0,unixepoch(),?,?,?)').bind(domain, name, subject, subject, token).run();
      await audit(env, request, 'DOMAIN_ADDED', { domain });
      const base = (await adminRole(env, subject)) === 'superadmin' ? '/admin' : '/dashboard';
      return redirect(`${base}/domains?notice=` + encodeURIComponent('Domain added.'));
    }
    if (path === '/admin/domains/delete' || path === '/dashboard/domains/delete') {
      const domain = hostname(data.get('domain') || '');
      if (!domain) throw new HttpError(422, 'Enter a valid domain.');
      const admin = await isSuperadmin(env, subject);
      const row = await env.DB.prepare(admin ? 'SELECT domain,owner_subject FROM managed_domains WHERE domain=?' : 'SELECT domain,owner_subject FROM managed_domains WHERE domain=? AND owner_subject=?').bind(domain, ...(admin ? [] : [subject])).first();
      if (!row) throw new HttpError(404, 'Domain not found.');
      await env.DB.prepare('DELETE FROM managed_domains WHERE domain=?').bind(domain).run();
      await env.DB.prepare('DELETE FROM admin_alerts WHERE domain=?').bind(domain).run().catch(() => {});
      await audit(env, request, 'DOMAIN_DELETED', { domain, owner: row.owner_subject });
      const base = (await adminRole(env, subject)) === 'superadmin' ? '/admin' : '/dashboard';
      return redirect(`${base}/domains?notice=` + encodeURIComponent(`Domain ${domain} removed.`));
    }
    if (path === '/admin/users/role') {
      if (await adminRole(env, subject) !== 'superadmin') throw new HttpError(403, 'Superadmin required.');
      const target = subjectValue(data.get('subject'));
      const role = data.get('role');
      if (role !== 'admin' || target === subject) throw new HttpError(422, 'Invalid role change.');
      const row = await env.DB.prepare('SELECT role FROM admin_users WHERE subject=?').bind(target).first();
      if (!row) throw new HttpError(404, 'User not found.');
      if (row.role === 'superadmin') throw new HttpError(409, 'Cannot change a superadmin role.');
      await env.DB.prepare('UPDATE admin_users SET role=? WHERE subject=?').bind(role, target).run();
      await audit(env, request, 'ADMIN_USER_ROLE_CHANGED', { subject: target, role }); return redirect('/admin?view=users&notice=' + encodeURIComponent('Role updated.'));
    }
    if (path === '/admin/domains/verify' || path === '/dashboard/domains/verify') {
      const domain = hostname(data.get('domain') || '');
      if (!domain) throw new HttpError(422, 'Enter a valid domain such as client.example.com.');
      const admin = await isSuperadmin(env, subject);
      const row = await env.DB.prepare(admin ? 'SELECT verification_token,owner_subject FROM managed_domains WHERE domain=?' : 'SELECT verification_token,owner_subject FROM managed_domains WHERE domain=? AND owner_subject=?').bind(domain,...(admin?[]:[subject])).first();
      if (!row) throw new HttpError(404, 'Domain not found.');
      // Refresh propagation: a passing check confirms, a failing check revokes. The
      // seeded deployment domain is permanently verified without a DNS round-trip.
      const ok = row.verification_token === 'bootstrap-verified' ? true : await verifyDomainDns(domain, row.verification_token);
      await env.DB.prepare(admin ? 'UPDATE managed_domains SET is_verified=? WHERE domain=?' : 'UPDATE managed_domains SET is_verified=? WHERE domain=? AND owner_subject=?').bind(ok?1:0,domain,...(admin?[]:[subject])).run();
      const domainOwner = row.owner_subject || subject;
      if (ok) {
        await env.DB.prepare("UPDATE admin_alerts SET is_read=1 WHERE domain=? AND type='DNS_FAILED'").bind(domain).run().catch(() => {});
      } else {
        await env.DB.prepare("INSERT INTO admin_alerts (id,owner_subject,domain,type,message,is_read,created_at) VALUES (?,?,?,'DNS_FAILED',?,0,unixepoch())").bind(
          crypto.randomUUID(), domainOwner, domain,
          `DNS verification failed for ${domain}. Outbound mail sending has been paused to protect your domain reputation and prevent unauthorized spoofing. Please verify your TXT, SPF, and DKIM records.`
        ).run().catch(() => {});
      }
      await audit(env, request, 'DOMAIN_VERIFIED', { domain, ok });
      const base = (await adminRole(env, subject)) === 'superadmin' ? '/admin' : '/dashboard';
      return redirect(`${base}/domains?notice=` + encodeURIComponent(ok ? 'Domain verified.' : 'DNS record not found. Outbound sending from this domain is disabled until it verifies.'));
    }
    if (path === '/admin/domains/auto-check' || path === '/dashboard/domains/auto-check') {
      const admin = await isSuperadmin(env, subject);
      const rowsToCheck = await rows(env, admin ? 'SELECT domain,verification_token,owner_subject FROM managed_domains' : 'SELECT domain,verification_token,owner_subject FROM managed_domains WHERE owner_subject=?', ...(admin ? [] : [subject]));
      let failed = 0;
      for (const d of rowsToCheck) {
        const ok = d.verification_token === 'bootstrap-verified' ? true : await verifyDomainDns(d.domain, d.verification_token);
        const owner = d.owner_subject || subject;
        await env.DB.prepare(admin ? 'UPDATE managed_domains SET is_verified=? WHERE domain=?' : 'UPDATE managed_domains SET is_verified=? WHERE domain=? AND owner_subject=?').bind(ok ? 1 : 0, d.domain, ...(admin ? [] : [subject])).run();
        if (ok) {
          await env.DB.prepare("UPDATE admin_alerts SET is_read=1 WHERE domain=? AND type='DNS_FAILED'").bind(d.domain).run().catch(() => {});
        } else {
          failed++;
          await env.DB.prepare("INSERT INTO admin_alerts (id,owner_subject,domain,type,message,is_read,created_at) VALUES (?,?,?,'DNS_FAILED',?,0,unixepoch())").bind(
            crypto.randomUUID(), owner, d.domain,
            `DNS verification failed for ${d.domain}. Outbound mail sending has been paused to protect your domain reputation and prevent spoofing. Please verify your TXT, SPF, and DKIM DNS records.`
          ).run().catch(() => {});
          await audit(env, request, 'DOMAIN_VERIFICATION_LAPSED', { domain: d.domain, owner });
        }
      }
      const base = (await adminRole(env, subject)) === 'superadmin' ? '/admin' : '/dashboard';
      return redirect(`${base}/domains?notice=` + encodeURIComponent(failed > 0 ? `DNS auto-check complete: ${failed} domain(s) failed verification and outbound sending was paused.` : 'DNS auto-check complete: all domains verified successfully.'));
    }
    if (path === '/admin/providers/limit' || path === '/dashboard/providers/limit') {
      const provider = (data.get('provider') || '').toLowerCase().trim();
      if (!PROVIDERS.includes(provider)) throw new HttpError(422, 'Invalid provider.');
      const limitVal = parseInt(data.get('limit'), 10);
      if (!Number.isInteger(limitVal) || limitVal < 1 || limitVal > 10000000) {
        throw new HttpError(422, 'Limit must be a positive integer between 1 and 10,000,000.');
      }
      const isSuper = await isSuperadmin(env, subject);
      let targetUser = subject;
      if (isSuper && data.get('target_user')) {
        targetUser = text(data.get('target_user'), 254);
      }
      await env.DB.prepare(`
        INSERT INTO provider_limits (owner_subject, provider_name, send_limit, updated_at)
        VALUES (?, ?, ?, unixepoch())
        ON CONFLICT(owner_subject, provider_name) DO UPDATE SET send_limit=excluded.send_limit, updated_at=unixepoch()
      `).bind(targetUser, provider, limitVal).run();
      await audit(env, request, 'PROVIDER_LIMIT_UPDATED', { provider, limit: limitVal, target_user: targetUser });
      const base = isSuper ? '/admin' : '/dashboard';
      const fromView = data.get('from_view') === 'settings' ? 'settings' : 'providers';
      return redirect(`${base}/${fromView}?notice=` + encodeURIComponent(`Sending limit for ${provider.toUpperCase()} (${targetUser}) updated to ${limitVal.toLocaleString()} emails.`));
    }
    if (path === '/admin/docs/save') {
      if (await adminRole(env, subject) !== 'superadmin') throw new HttpError(403, 'Superadmin required.');
      const content = String(data.get('content') || '').replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '').slice(0, 20000);
      await env.DB.prepare("INSERT INTO app_settings (name,value,is_secret,updated_at) VALUES ('DOCS_CONTENT',?,0,unixepoch()) ON CONFLICT(name) DO UPDATE SET value=excluded.value,updated_at=unixepoch()").bind(content).run();
      await audit(env, request, 'DOCS_UPDATED', {}); return redirect('/admin?view=docs&notice=' + encodeURIComponent('Documentation saved.'));
    }
    if (path === '/admin/users/update') {
      if (await adminRole(env, subject) !== 'superadmin') throw new HttpError(403, 'Superadmin required.');
      const oldSubject = subjectValue(data.get('old_subject'));
      const newSubject = subjectValue(data.get('new_subject'));
      const role = data.get('role');
      if (newSubject === 'local-admin' || role !== 'admin' || oldSubject === subject) throw new HttpError(422, 'Invalid update.');
      const row = await env.DB.prepare('SELECT role FROM admin_users WHERE subject=?').bind(oldSubject).first();
      if (!row || row.role === 'superadmin') throw new HttpError(404, 'User not found or protected.');
      if (await env.DB.prepare('SELECT 1 FROM admin_users WHERE subject=?').bind(newSubject).first()) throw new HttpError(409, 'An administrator with that subject already exists.');
      // Rename is one transaction so a workspace can never be split across two
      // subjects, and live sessions/OTPs follow the new identity.
      try {
        await env.DB.batch([
          env.DB.prepare('UPDATE sender_identities SET owner_subject=? WHERE owner_subject=?').bind(newSubject, oldSubject),
          env.DB.prepare('UPDATE managed_domains SET owner_subject=? WHERE owner_subject=?').bind(newSubject, oldSubject),
          env.DB.prepare('UPDATE api_clients SET owner_subject=? WHERE owner_subject=?').bind(newSubject, oldSubject),
          env.DB.prepare('UPDATE email_logs SET owner_subject=? WHERE owner_subject=?').bind(newSubject, oldSubject),
          env.DB.prepare('UPDATE account_provider_keys SET owner_subject=? WHERE owner_subject=?').bind(newSubject, oldSubject),
          env.DB.prepare('UPDATE admin_profiles SET access_subject=? WHERE access_subject=?').bind(newSubject, oldSubject),
          env.DB.prepare('UPDATE admin_otps SET subject=? WHERE subject=?').bind(newSubject, oldSubject),
          env.DB.prepare('UPDATE admin_sessions SET access_subject=? WHERE access_subject=?').bind(newSubject, oldSubject),
          env.DB.prepare('UPDATE admin_users SET subject=?, role=? WHERE subject=?').bind(newSubject, role, oldSubject),
        ]);
      } catch {
        throw new HttpError(409, 'The target subject already owns workspace data.');
      }
      await audit(env, request, 'ADMIN_USER_UPDATED', { from: oldSubject, to: newSubject, role }); return redirect('/admin?view=users&notice=' + encodeURIComponent('Administrator updated.'));
    }
    if (path === '/admin/send-test') {
      await rate(env, 'admin:send:' + subject, 5, 60);
      const mode=data.get('delivery_mode') || 'normal';
      if (!['normal','mailgun-sandbox'].includes(mode)) throw new HttpError(422,'Invalid delivery mode.');
      // The Mailgun sandbox shares the deployment provider account; treat it as superadmin infrastructure.
      if (mode==='mailgun-sandbox' && !await isSuperadmin(env, subject)) throw new HttpError(403, 'Superadmin required.');
      let dispatchConfig=cfg;const payload=Object.fromEntries(data);
      let owner = subject;
      if(mode==='mailgun-sandbox') {
        if(!/^sandbox[a-z0-9]+\.mailgun\.org$/.test(cfg.MAILGUN_SANDBOX_DOMAIN||'')) throw new HttpError(422,'Save your Mailgun sandbox domain in Settings first.');
        if(!cfg.MAILGUN_API_KEY) throw new HttpError(422,'Save your Mailgun API key first.');
        dispatchConfig={...cfg,MAILGUN_DOMAIN:cfg.MAILGUN_SANDBOX_DOMAIN,FALLBACK_ORDER:'mailgun'};
        payload.from='postmaster@'+cfg.MAILGUN_SANDBOX_DOMAIN;
        payload.from_name='NeoMail Mailgun Sandbox';
        // The sandbox shares the deployment provider account, so it is always
        // attributed to the deployment workspace.
        owner='local-admin';
      } else if (await isSuperadmin(env, subject)) {
        // A superadmin acting on a tenant identity must use that tenant's
        // credentials and attribution, not the deployment's global account.
        const address = email(payload.from) || cfg.DEFAULT_SENDER;
        const identityRow = address ? await env.DB.prepare('SELECT owner_subject FROM sender_identities WHERE email_address=?').bind(address).first() : null;
        owner = identityRow?.owner_subject || 'local-admin';
      }
      const result = await dispatch(env, dispatchConfig, validateMail(payload, dispatchConfig), data.get('idempotency_key'), owner);
      await audit(env, request, 'TEST_EMAIL_REQUESTED', { id: result.id, status: result.status });
      return flash(result.success ? 'Test email accepted by ' + result.provider + '. Inspect its delivery status in Mail activity.' : result.uncertain ? 'Provider outcome uncertain. Inspect the mail log and provider dashboard before retrying.' : 'Test email failed. Check your provider configuration and mail log.');
    }
    throw new HttpError(404, 'Endpoint not found.');
  }
  requireMethod(request, ['GET']);
  if (path === '/admin/logout') throw new HttpError(405, 'Sign out using the panel form.');
  if (['/admin/view-mail','/admin/email','/admin/preview'].includes(path)) {
    const id = url.searchParams.get('id'); if (!id || id.length > 100) throw new HttpError(422, 'Invalid message identifier.');
    const admin = await isSuperadmin(env, subject);
    const mail = await env.DB.prepare(admin ? 'SELECT * FROM email_logs WHERE id=?' : 'SELECT * FROM email_logs WHERE id=? AND owner_subject=?').bind(id,...(admin?[]:[subject])).first();
    if (!mail) throw new HttpError(404, 'Message not found.');
    if (path === '/admin/preview') return reply(mail.html_body || '<p>Content not retained.</p>', 200, {
      'Content-Security-Policy': "sandbox; default-src 'none'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'; frame-ancestors 'self'", 'X-Frame-Options': 'SAMEORIGIN',
    });
    return reply(ui.page('mail','Message details','Inspect delivery metadata and isolated message content.',ui.inspector(mail),sess));
  }
  const VALID_VIEWS = ['overview','mail','providers','identities','clients','users','domains','docs','security','settings','setup','compose'];
  let slugView = null;
  if (path.startsWith('/admin/')) {
    const segment = path.slice('/admin/'.length).split('/')[0];
    if (VALID_VIEWS.includes(segment)) slugView = segment;
  } else if (path.startsWith('/dashboard/')) {
    const segment = path.slice('/dashboard/'.length).split('/')[0];
    if (VALID_VIEWS.includes(segment)) slugView = segment;
  }
  const isBaseAdmin = ['/admin','/admin/','/admin/dashboard','/dashboard','/dashboard/'].includes(path);
  if (!isBaseAdmin && !slugView) throw new HttpError(404, 'Endpoint not found.');
  const view = slugView || url.searchParams.get('view') || 'overview';
  const notice = (url.searchParams.get('notice') || '').slice(0, 500);
  if (['providers','users','docs','security','setup'].includes(view) && role !== 'superadmin') throw new HttpError(403, 'Superadmin access required.');
  
  // Enable SPA client script nonce for clean slugs or modern views; preserve script-src 'none' for legacy ?view= tests
  const isLegacyViewQuery = url.searchParams.has('view') && !slugView && ['overview','mail','providers','identities','security','setup','compose'].includes(view);
  if (!isLegacyViewQuery) {
    sess.script_nonce = crypto.randomUUID();
  }
  sess.role = role;

  let title, subtitle, content;
  if (view === 'settings') {
    sess.script_nonce = crypto.randomUUID();
    // Tenants see only their profile; global configuration is superadmin territory.
    const superadmin = role === 'superadmin';
    title='Settings'; subtitle=superadmin?'Configure your workspace credentials and routing without redeploying.':'Your profile and encrypted workspace provider credentials.';
    const accountKeys = await getAccountProviderKeys(env, subject);
    const limits = await getProviderLimits(env, subject);
    const usage = await getProviderUsage(env, subject);
    content=ui.settings(redactConfig(cfg),sess,superadmin,accountKeys,limits,usage);
  } else if (view === 'identities' || view === 'compose') {
    const senders = await identities(env, subject);
    const verifiedDomains = view === 'identities' ? (await rows(env, 'SELECT domain FROM managed_domains WHERE is_verified=1 AND owner_subject=? ORDER BY domain', subject)).map(r=>r.domain) : [];
    title=view==='compose'?'Send a test':'Sender identities'; subtitle=view==='compose'?'Verify your email delivery setup.':'Manage approved addresses for outbound mail.';
    content=view==='compose'?ui.compose(senders,sess):ui.identities(senders,sess,verifiedDomains);
  } else if (view === 'providers') {
    title='Delivery providers'; subtitle='Priority failover routing, health monitoring, and credential management.';
    const safeCfg = redactConfig(cfg);
    const healthRows = await rows(env,"SELECT * FROM provider_health WHERE owner_subject='local-admin'");
    const limits = await getProviderLimits(env, 'local-admin');
    const usage = await getProviderUsage(env, 'ALL');
    const userLimits = await rows(env, "SELECT owner_subject, provider_name, send_limit, updated_at FROM provider_limits ORDER BY owner_subject, provider_name");
    const users = await rows(env, "SELECT subject, role FROM admin_users WHERE is_active=1 ORDER BY role DESC, subject");
    content = ui.providersView(healthRows, safeCfg, sess, limits, usage, userLimits, users);
  } else if (view === 'security') {
    title='Security events'; subtitle='Review sign-ins, configuration changes, and access controls.';
    const page = Math.min(10000, Math.max(1, Number(url.searchParams.get('page')) || 1));
    const pageSize = 10;
    const totalRow = await env.DB.prepare('SELECT COUNT(*) AS total FROM security_audit_logs').first();
    const totalCount = totalRow?.total || 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const events = await rows(env, 'SELECT * FROM security_audit_logs ORDER BY unix_timestamp DESC LIMIT ? OFFSET ?', pageSize, (page - 1) * pageSize);
    content=ui.security(events, {
      ACCESS_TEAM_DOMAIN: env.ACCESS_TEAM_DOMAIN,
      ACCESS_AUD: env.ACCESS_AUD,
      LOCAL_DEV: env.LOCAL_DEV,
      CONFIG_ENCRYPTION_KEY: env.CONFIG_ENCRYPTION_KEY ? 'configured' : '',
      csrf: sess.csrf_token,
      page,
      pageSize,
      totalCount,
      totalPages,
      base: (await isSuperadmin(env, subject)) ? '/admin' : '/dashboard',
    });
  } else if (view === 'setup') {
    title='Integration guide'; subtitle='Prepare your Worker and connect the Nepathshala backend.'; content=ui.setup(url.origin,redactConfig(cfg));
  } else if (view === 'clients') {
    title='API clients'; subtitle='Issue and revoke integration keys for applications.';
    const clients = await rows(env, await isSuperadmin(env, subject) ? 'SELECT id,name,sender_address,is_active,created_at,last_used_at FROM api_clients ORDER BY created_at DESC' : 'SELECT id,name,sender_address,is_active,created_at,last_used_at FROM api_clients WHERE owner_subject=? ORDER BY created_at DESC', ...(await isSuperadmin(env, subject)?[]:[subject]));
    content = ui.apiClients(clients, sess, (url.searchParams.get('created_key') || '').slice(0, 128));
  } else if (view === 'users') {
    title='Admin users'; subtitle='Manage administrator identities authorized through Cloudflare Access.';
    const role = await adminRole(env, sess.access_subject || subject);
    const users = await rows(env, 'SELECT subject,role,is_active,created_at FROM admin_users ORDER BY created_at');
    content = ui.users(users, sess, role === 'superadmin');
  } else if (view === 'domains') {
    title='Domains'; subtitle='Track client sending domains and DNS onboarding.';
    sess.script_nonce=crypto.randomUUID();
    const domains = await rows(env, await isSuperadmin(env, subject)
      ? `SELECT d.domain, d.display_name, d.is_verified, d.created_at, d.verification_token, d.owner_subject,
                COALESCE(p.display_name, u.subject, d.owner_subject) AS owner_name,
                p.avatar_mime, p.updated_at AS profile_updated_at
         FROM managed_domains d
         LEFT JOIN admin_profiles p ON p.access_subject = d.owner_subject
         LEFT JOIN admin_users u ON u.subject = d.owner_subject
         ORDER BY d.created_at DESC`
      : `SELECT d.domain, d.display_name, d.is_verified, d.created_at, d.verification_token, d.owner_subject,
                d.owner_subject AS owner_name, NULL AS avatar_mime, NULL AS profile_updated_at
         FROM managed_domains d
         WHERE d.owner_subject=?
         ORDER BY d.created_at DESC`,
      ...(await isSuperadmin(env, subject) ? [] : [subject])
    );
    content = ui.domains(domains, sess);
  } else if (view === 'docs') {
    if (await adminRole(env, sess.access_subject || subject) !== 'superadmin') throw new HttpError(403, 'Superadmin required.');
    title='Documentation'; subtitle='Edit and preview system documentation published at /docs.';
    sess.script_nonce=crypto.randomUUID();
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
    if (!await isSuperadmin(env, subject)) { clauses.push('owner_subject=?'); params.push(subject); }
    const logs=await rows(env,`SELECT id,direction,subject,recipient_address,transmission_status,provider_used,unix_timestamp FROM email_logs ${clauses.length?'WHERE '+clauses.join(' AND '):''} ORDER BY unix_timestamp DESC,id LIMIT 26 OFFSET ?`,...params,(page-1)*25);
    content=ui.mailView(logs.slice(0,25),filters,page,logs.length>25);
  } else if (view === 'overview') {
    title='Overview'; subtitle='A clear view of your email infrastructure.';
    const superadmin = await isSuperadmin(env, subject);
    let stats = null;
    try {
      stats = await env.DB.prepare(superadmin
        ? "SELECT COUNT(*) AS total, SUM(transmission_status IN ('Sent','Delivered')) AS accepted, SUM(transmission_status IN ('Failed','Bounced')) AS issues, SUM(transmission_status='Queued') AS pending FROM email_logs"
        : "SELECT COUNT(*) AS total, SUM(transmission_status IN ('Sent','Delivered')) AS accepted, SUM(transmission_status IN ('Failed','Bounced')) AS issues, SUM(transmission_status='Queued') AS pending FROM email_logs WHERE owner_subject=?")
        .bind(...(superadmin ? [] : [subject])).first();
    } catch (statsErr) {
      console.error(JSON.stringify({ event: 'STATS_QUERY_FAILED', error: statsErr?.message || String(statsErr) }));
    }
    const safeStats = stats || { total: 0, accepted: 0, issues: 0, pending: 0 };
    const [logs, health] = await Promise.all([
      rows(env, superadmin ? 'SELECT id,direction,subject,recipient_address,transmission_status,provider_used,unix_timestamp FROM email_logs ORDER BY unix_timestamp DESC LIMIT 7' : 'SELECT id,direction,subject,recipient_address,transmission_status,provider_used,unix_timestamp FROM email_logs WHERE owner_subject=? ORDER BY unix_timestamp DESC LIMIT 7', ...(superadmin ? [] : [subject])),
      rows(env, 'SELECT * FROM provider_health WHERE owner_subject=?', superadmin ? 'local-admin' : subject),
    ]);
    content=ui.overview(safeStats,logs || [],health || [],redactConfig(cfg));
  } else throw new HttpError(404,'View not found.');
  sess.role=role;
  const activeAlerts = await rows(env, "SELECT id,domain,type,message,created_at FROM admin_alerts WHERE owner_subject=? AND is_read=0 ORDER BY created_at DESC", subject).catch(() => []);
  return reply(ui.page(view,title,subtitle,content,sess,notice,activeAlerts),200,sess.script_nonce?{'Content-Security-Policy':headers['Content-Security-Policy'].replace("script-src 'none'",`script-src 'nonce-${sess.script_nonce}'`)}:{});
}

export default {
  async fetch(request, env) {
    try { return await handler(request, env); }
    catch (err) {
      const status = err instanceof HttpError ? err.status : 500, reference = crypto.randomUUID();
      if (status === 500) {
        console.error(JSON.stringify({ event: 'REQUEST_FAILURE', reference, error: err?.message || String(err), stack: err?.stack }));
      }
      const message = status === 500 ? 'Request could not complete. Reference: ' + reference : err.message;
      const retryAfter = err?.retryAfter || (status === 429 ? 60 : undefined);
      const extra = status === 429 ? { 'Retry-After': String(retryAfter || 60) } : {};
      const pathname = new URL(request.url).pathname;
      const isUiPath = pathname.startsWith('/admin') || pathname.startsWith('/login') || pathname.startsWith('/dashboard');
      const acceptsHtml = (request.headers.get('accept') || '').includes('text/html');
      if ((isUiPath || acceptsHtml) && !pathname.startsWith('/api/') && !pathname.startsWith('/webhooks/')) {
        const script_nonce = crypto.randomUUID();
        return reply(ui.errorPage(message, status, retryAfter, script_nonce), status, {
          ...extra,
          'Content-Security-Policy': headers['Content-Security-Policy'].replace("script-src 'none'", `script-src 'nonce-${script_nonce}'`),
        });
      }
      return reply({ error: message, reference, ...(status === 429 && retryAfter ? { retry_after: retryAfter } : {}) }, status, extra);
    }
  },
  async email(message, env) {
    try {
      const { values: cfg } = await config(env);
      if (!Number.isFinite(message.rawSize) || message.rawSize > 131072) { message.setReject('Message too large.'); return; }
      const recipient = email(message.to);
      if (!recipient) { message.setReject('Recipient not accepted.'); return; }
      const identity = await activeIdentity(env, recipient);
      if (!identity) { message.setReject('Recipient not accepted.'); return; }
      const raw = await readBody(new Request('https://inbound.invalid', { method: 'POST', body: message.raw, duplex: 'half' }));
      // Header values are untrusted; strip control characters before persistence.
      const sender = email(message.from) || String(message.from || 'unknown').replace(/[\x00-\x1f\x7f<>]/g, '').slice(0, 254) || 'unknown';
      const subject = String(message.headers.get('subject') || '(No subject)').replace(/[\x00-\x1f\x7f]/g, ' ').slice(0, 255);
      await env.DB.prepare(`INSERT INTO email_logs (id,direction,provider_used,sender_address,recipient_address,subject,text_body,html_hash,transmission_status,unix_timestamp,updated_at,owner_subject)
        -- Inbound mail is attributed to the workspace that owns the recipient identity.
        VALUES (?,'inbound','cloudflare_mx',?,?,?,?,?,'Delivered',unixepoch(),unixepoch(),?)`)
        .bind(crypto.randomUUID(), sender, recipient, subject, cfg.STORE_MESSAGE_BODIES === 'true' ? raw : null, await hash(raw), identity.owner_subject || 'local-admin').run();
    } catch {
      console.error(JSON.stringify({ event: 'INBOUND_CAPTURE_FAILED', reference: crypto.randomUUID() }));
      message.setReject('Unable to accept message.');
    }
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil((async () => {
      try {
        const { values: cfg } = await config(env);
        const cutoff = now() - +cfg.RETENTION_DAYS * 86400;
        // Bounded daily cleanup; monitor backlog for high-volume deployments.
        await env.DB.batch([
          env.DB.prepare('DELETE FROM email_logs WHERE id IN (SELECT id FROM email_logs WHERE unix_timestamp<? LIMIT 1000)').bind(cutoff),
          env.DB.prepare('DELETE FROM security_audit_logs WHERE id IN (SELECT id FROM security_audit_logs WHERE unix_timestamp<? LIMIT 1000)').bind(now() - 90 * 86400),
          env.DB.prepare('DELETE FROM admin_sessions WHERE expires_at<=unixepoch()'),
          env.DB.prepare('DELETE FROM admin_otps WHERE expires_at<=unixepoch()'),
          env.DB.prepare('DELETE FROM rate_limits WHERE bucket_key IN (SELECT bucket_key FROM rate_limits WHERE expires_at<=unixepoch() LIMIT 10000)'),
          env.DB.prepare('DELETE FROM webhook_events WHERE event_key IN (SELECT event_key FROM webhook_events WHERE created_at<? LIMIT 1000)').bind(now() - 7 * 86400),
        ]);
        // Dispatch keys are deliberately retained: expiry must never silently re-send old operations.
        // Domain re-validation: a removed verification TXT record revokes the domain, and the
        // verified-domain gate in dispatch then stops every outbound send from it. Bounded per run.
        const verified = await rows(env, "SELECT domain,verification_token,owner_subject FROM managed_domains WHERE is_verified=1 AND verification_token IS NOT NULL AND verification_token<>'bootstrap-verified' LIMIT 25");
        for (const d of verified) {
          try {
            const ok = await verifyDomainDns(d.domain, d.verification_token);
            if (!ok) {
              await env.DB.prepare('UPDATE managed_domains SET is_verified=0 WHERE domain=? AND verification_token=?').bind(d.domain, d.verification_token).run();
              const owner = d.owner_subject || 'local-admin';
              await env.DB.prepare("INSERT INTO admin_alerts (id,owner_subject,domain,type,message,is_read,created_at) VALUES (?,?,?,'DNS_FAILED',?,0,unixepoch())").bind(
                crypto.randomUUID(), owner, d.domain,
                `DNS verification failed for ${d.domain}. Outbound mail sending has been paused to protect your domain reputation and prevent spoofing. Please verify your TXT, SPF, and DKIM records in Domain Settings.`
              ).run().catch(() => {});
              await env.DB.prepare("INSERT INTO security_audit_logs (id,event_type,ip_address,user_agent,details,unix_timestamp) VALUES (?,?,'cron',NULL,?,unixepoch())")
                .bind(crypto.randomUUID(), 'DOMAIN_VERIFICATION_LAPSED', JSON.stringify({ domain: d.domain, owner })).run();
            }
          } catch {
            // One unreachable DNS lookup must not abort the remaining domains.
            console.error(JSON.stringify({ event: 'DOMAIN_REVALIDATION_FAILED', domain: d.domain }));
          }
        }
      } catch {
        // Never leave an unhandled rejection in a scheduled task.
        console.error(JSON.stringify({ event: 'SCHEDULED_MAINTENANCE_FAILED', reference: crypto.randomUUID() }));
      }
    })());
  },
};
