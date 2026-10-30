import { HttpError, reply, redirect, hash, equal, email, text, cookie, local, sameOrigin, form, json, readBody, rate, audit, access, session, csrf, sessionCookie, bytes64, headers } from './security.js';
import { config, saveSettings, saveSecret, PROVIDERS } from './config.js';
import { dispatch, validateMail, verifyWebhook, applyWebhook } from './providers.js';
import * as ui from './ui.js';
import { getProfile, saveProfile, profileForm, profileImage } from './profile.js';

const now = () => Math.floor(Date.now() / 1000);
const flash = message => redirect('/admin?notice=' + encodeURIComponent(message));
async function rows(env, sql, ...params) { return (await env.DB.prepare(sql).bind(...params).all()).results || []; }
async function identities(env) { return rows(env, 'SELECT * FROM sender_identities ORDER BY is_default DESC,email_address'); }
function requireMethod(request, methods) { if (!methods.includes(request.method)) throw new HttpError(405, 'Method not allowed.'); }
async function activeIdentity(env, address) { return env.DB.prepare('SELECT * FROM sender_identities WHERE email_address=? AND is_active=1').bind(address).first(); }
async function adminVerifier(request, env) {
  if (!local(request, env)) return 'access-v2:' + env.ACCESS_TEAM_DOMAIN + ':' + env.ACCESS_AUD;
  return env.LOCAL_ADMIN_TOKEN ? hash(env.LOCAL_ADMIN_TOKEN) : env.ADMIN_TOKEN_HASH;
}
async function reauthenticate(request, env, data) {
  if (!local(request, env)) {
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
  if (path === '/health') { requireMethod(request, ['GET']); return reply({ status: 'ok', service: 'neomail' }); }
  if (path === '/') { requireMethod(request, ['GET']); return redirect('/admin'); }
  if (request.method === 'OPTIONS') return reply({ error: 'Browser cross-origin API calls are not supported.' }, 405);
  if (!env.DB) throw new HttpError(503, 'Database binding unavailable.');
  if (!local(request, env) && url.protocol !== 'https:') throw new HttpError(403, 'HTTPS required.');
  if (path === '/api/v1/send' || path === '/api/send') {
    requireMethod(request, ['POST']);
    await rate(env, 'api-auth:' + ip, 120, 60);
    const { values: cfg } = await config(env);
    const bearer = request.headers.get('authorization') || '';
    if (!cfg.API_SECRET_KEY || cfg.API_SECRET_KEY.length < 43) throw new HttpError(503, 'API credential is not configured.');
    if (!bearer.startsWith('Bearer ') || !await equal(bearer.slice(7), cfg.API_SECRET_KEY)) throw new HttpError(401, 'Invalid API credential.');
    await rate(env, 'api:dispatch', +cfg.API_RATE_LIMIT_PER_MINUTE, 60);
    const data = await json(request); const mail = validateMail(data, cfg);
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
  if (path !== '/admin' && !path.startsWith('/admin/')) throw new HttpError(404, 'Endpoint not found.');
  const subject = await access(request, env);
  if (path === '/admin/login') {
    requireMethod(request, ['GET', 'POST']);
    if (request.method === 'GET') return reply(local(request, env) ? ui.login() : ui.accessLogin());
    sameOrigin(request);
    const { values: cfg } = await config(env);
    await rate(env, 'login:ip:' + ip, +cfg.MAX_LOGIN_ATTEMPTS, 900);
    await rate(env, 'login:subject:' + subject, +cfg.MAX_LOGIN_ATTEMPTS, 900);
    const data = await form(request);
    try { await reauthenticate(request, env, data); } catch (e) {
      await audit(env, request, 'AUTH_FAILURE'); return reply(ui.login('Sign-in failed. Check your administrator token.'), e.status || 401);
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
