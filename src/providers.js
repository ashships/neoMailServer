import { HttpError, hash, email, text, escape, hmac, base64, equal } from './security.js';
import { PROVIDERS, resolveAccountProviderSecrets } from './config.js';
import { safeFetch } from './security.js';

export async function sendSmtp(cfg, mail) {
  let connect;
  try {
    ({ connect } = await import('cloudflare:sockets'));
  } catch {
    throw new Error('SMTP is not supported in this runtime.');
  }
  const host = cfg.SMTP_HOST;
  const port = Number(cfg.SMTP_PORT || 465);
  const secure = cfg.SMTP_SECURE !== 'false';
  const socket = connect({ hostname: host, port }, { secureTransport: secure ? 'on' : 'off', allowHalfOpen: false });
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const writer = socket.writable.getWriter();
  const reader = socket.readable.getReader();
  let buffer = '';
  async function readResponse() {
    while (true) {
      const { value, done } = await reader.read();
      if (value) buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\r\n');
      const last = lines[lines.length - 2] || '';
      if (/^\d{3} /.test(last)) break;
      if (done) break;
    }
    const match = buffer.match(/^(\d{3})/);
    const code = match ? Number(match[1]) : 0;
    const data = buffer;
    buffer = '';
    return { code, data };
  }
  async function write(command) { await writer.write(encoder.encode(command + '\r\n')); }
  const greet = await readResponse();
  console.error('SMTP GREET', greet.code, JSON.stringify(greet.data.slice(0,80)));
  await write('EHLO neomail');
  const ehlo = await readResponse();
  console.error('SMTP EHLO', ehlo.code);
  if (ehlo.code !== 250) throw new Error('SMTP EHLO failed.');
  await write('AUTH LOGIN');
  const authStart = await readResponse();
  if (authStart.code !== 334) throw new Error('SMTP auth not supported.');
  await write(btoa(cfg.SMTP_USER));
  const userResp = await readResponse();
  if (userResp.code !== 334) throw new Error('SMTP username rejected.');
  await write(btoa(cfg.SMTP_PASS));
  const passResp = await readResponse();
  if (passResp.code !== 235) throw new Error('SMTP authentication failed.');
  await write('MAIL FROM:<' + mail.from + '>');
  const mailFrom = await readResponse();
  if (mailFrom.code !== 250) throw new Error('SMTP MAIL FROM rejected.');
  await write('RCPT TO:<' + mail.to + '>');
  const rcpt = await readResponse();
  if (rcpt.code !== 250 && rcpt.code !== 251) throw new Error('SMTP RCPT TO rejected.');
  await write('DATA');
  const dataStart = await readResponse();
  if (dataStart.code !== 354) throw new Error('SMTP DATA rejected.');
  const message = 'From: ' + mail.fromName + ' <' + mail.from + '>\r\n' +
    'To: ' + mail.to + '\r\n' +
    'Subject: ' + mail.subject + '\r\n' +
    'MIME-Version: 1.0\r\n' +
    'Content-Type: text/html; charset=UTF-8\r\n' +
    '\r\n' + (mail.html || '') + '\r\n.\r\n';
  await writer.write(encoder.encode(message));
  const dataResp = await readResponse();
  if (dataResp.code !== 250) throw new Error('SMTP message rejected.');
  await write('QUIT');
  await socket.close();
  const match = dataResp.data.match(/<([^>]+)>/);
  return (match && match[1]) || crypto.randomUUID();
}

export function validateMail(body, settings) {
  const to = email(body.to), from = email(body.from || settings.DEFAULT_SENDER);
  if (!to || !from) throw new HttpError(422, 'Valid recipient and sender addresses are required.');
  const subject = text(body.subject, 255), fromName = text(body.from_name || settings.DEFAULT_SENDER_NAME, 100);
  for (const field of ['html', 'text']) if (body[field] !== undefined && (typeof body[field] !== 'string' || body[field].length > 50000)) throw new HttpError(422, 'Email bodies must be strings of at most 50,000 characters.');
  if (!body.html?.trim() && !body.text?.trim()) throw new HttpError(422, 'Provide an HTML or plain text body.');
  return { to, from, subject, fromName, useIdentityName: !body.from_name, html: body.html || `<p>${escape(body.text)}</p>`, text: body.text || '' };
}
export async function send(provider, env, mail, requestId) {
  const { from, to, fromName, subject, html, text } = mail;
  if (provider === 'smtp') return sendSmtp(env, mail);
  const formattedSender = `"${fromName.replace(/["\\]/g, '\\$&')}" <${from}>`;
  const credential = env[provider.toUpperCase() + '_API_KEY'];
  let url, body, headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${credential}` };
  if (provider === 'resend') {
    url = 'https://api.resend.com/emails'; headers['Idempotency-Key'] = requestId;
    body = { from: formattedSender, to: [to], subject, html, text: text || undefined };
  } else if (provider === 'brevo') {
    url = 'https://api.brevo.com/v3/smtp/email'; headers = { 'Content-Type': 'application/json', 'api-key': credential };
    body = { sender: { email: from, name: fromName }, to: [{ email: to }], subject, htmlContent: html, textContent: text || undefined };
  } else if (provider === 'mailgun') {
    url = `https://api.mailgun.net/v3/${encodeURIComponent(env.MAILGUN_DOMAIN)}/messages`;
    headers = { Authorization: `Basic ${btoa('api:' + credential)}`, 'Content-Type': 'application/x-www-form-urlencoded' };
    body = new URLSearchParams({ from: formattedSender, to, subject, html, text });
  } else {
    url = provider === 'mailtrap' ? 'https://send.api.mailtrap.io/api/send' : 'https://api.mailersend.com/v1/email';
    body = { from: { email: from, name: fromName }, to: [{ email: to }], subject, html, text: text || undefined };
  }
  const response = await safeFetch(url, { method: 'POST', headers, body: body instanceof URLSearchParams ? body.toString() : JSON.stringify(body), signal: AbortSignal.timeout(+env.REQUEST_TIMEOUT_MS), redirect: 'manual' });
  if (!response.ok) {
    // Never store upstream response bodies: they may echo content or credentials.
    const error = new Error(`Provider returned HTTP ${response.status}`);
    error.definitive = [400, 401, 403, 404, 422, 429].includes(response.status);
    await response.body?.cancel(); throw error;
  }
  const data = provider === 'mailersend' ? {} : await response.json();
  const id = data.id || data.messageId || data.message_ids?.[0] || response.headers.get('x-message-id');
  if (typeof id !== 'string' || id.length > 512 || !id) throw new Error('Provider accepted request without a usable message identifier');
  return id;
}
export async function dispatch(env, mail, idempotencyKey, ownerSubject = null) {
  if (!/^[a-zA-Z0-9_:.\-]{8,128}$/.test(idempotencyKey || '')) throw new HttpError(422, 'Idempotency-Key must contain 8–128 letters, digits, dots, colons, underscores or hyphens.');
  const identity = await env.DB.prepare('SELECT email_address,display_name,owner_subject FROM sender_identities WHERE email_address=? AND is_active=1').bind(mail.from).first();
  if (!identity) throw new HttpError(422, 'Sender must be an active identity configured in the console.');
  // Tenant isolation: a workspace may only send from identities it owns.
  if (ownerSubject && identity.owner_subject && identity.owner_subject !== ownerSubject) throw new HttpError(403, 'Sender identity belongs to another workspace.');
  // Verified domains only: the sender domain must exist and be verified, except the
  // deployment's own Mailgun sandbox used for console testing.
  const senderDomain = (mail.from || '').split('@')[1];
  if (senderDomain && !(senderDomain === env.MAILGUN_SANDBOX_DOMAIN && senderDomain.endsWith('.mailgun.org'))) {
    const domainRow = await env.DB.prepare('SELECT is_verified FROM managed_domains WHERE domain=?').bind(senderDomain).first();
    if (!domainRow || !domainRow.is_verified) throw new HttpError(422, 'Sender domain is not verified. Add and verify the domain before sending.');
  }
  if (mail.useIdentityName) mail = { ...mail, fromName: identity.display_name };
  delete mail.useIdentityName;
  // Idempotency keys are namespaced per tenant so one workspace can never observe another's operations.
  const key = await hash((ownerSubject || 'local-admin') + '\u0000' + idempotencyKey), payloadHash = await hash(JSON.stringify(mail)), logId = crypto.randomUUID();
  const reservation = await env.DB.prepare('INSERT INTO dispatch_requests (request_key,payload_hash,log_id,created_at) VALUES (?,?,?,unixepoch()) ON CONFLICT(request_key) DO NOTHING RETURNING request_key').bind(key, payloadHash, logId).first();
  if (!reservation) {
    const prior = await env.DB.prepare('SELECT payload_hash,response_json FROM dispatch_requests WHERE request_key=?').bind(key).first();
    if (prior.payload_hash !== payloadHash) throw new HttpError(409, 'Idempotency key already used for different content.');
    if (!prior.response_json) throw new HttpError(409, 'Dispatch in progress or outcome unknown. Inspect its mail log before retrying.');
    return { ...JSON.parse(prior.response_json), replayed: true };
  }
  const keep = env.STORE_MESSAGE_BODIES === 'true';
  const ownerText = ownerSubject || 'local-admin';
  await env.DB.prepare(`INSERT INTO email_logs (id,direction,provider_used,sender_address,recipient_address,subject,html_body,text_body,html_hash,transmission_status,attempt_history,unix_timestamp,updated_at,owner_subject)
    VALUES (?,'outbound','unassigned',?,?,?,?,?,?,'Queued','[]',unixepoch(),unixepoch(),?)`)
    .bind(logId, mail.from, mail.to, mail.subject, keep ? mail.html : null, keep ? mail.text : null, await hash(mail.html), ownerText).run();
  const attempts = []; let status = 'Failed', providerUsed = null, messageId = null, uncertain = false;
  const health = (await env.DB.prepare('SELECT * FROM provider_health').all()).results || [];
  const accountSecrets = await resolveAccountProviderSecrets(env, ownerSubject);
  const effectiveEnv = { ...env, ...accountSecrets };
  for (const provider of (effectiveEnv.FALLBACK_ORDER || 'resend,brevo,mailgun,mailtrap,mailersend,smtp').split(',')) {
    if (!PROVIDERS.includes(provider)) continue;
    if (provider === 'smtp') {
      const hasSmtp = (effectiveEnv.SMTP_HOST && effectiveEnv.SMTP_USER && effectiveEnv.SMTP_PASS) || (effectiveEnv.cfg && effectiveEnv.cfg.SMTP_HOST && effectiveEnv.cfg.SMTP_USER && effectiveEnv.cfg.SMTP_PASS);
      if (!hasSmtp) continue;
    } else if (!effectiveEnv[provider.toUpperCase() + '_API_KEY'] || (provider === 'mailgun' && !effectiveEnv.MAILGUN_DOMAIN)) continue;
    const state = health.find(p => p.provider_name === provider);
    if (state && (!state.is_active || (state.consecutive_failures >= 5 && state.updated_at > Date.now() / 1000 - 300))) continue;
    const started = Date.now();
    // Record intent before the external side effect. A crash leaves a Queued log requiring reconciliation.
    await env.DB.prepare('UPDATE email_logs SET provider_used=?,updated_at=unixepoch() WHERE id=?').bind(provider, logId).run();
    try {
      messageId = await send(provider, effectiveEnv, mail, key); providerUsed = provider; status = 'Sent';
    } catch (error) {
      uncertain = !error.definitive;
      const reason = uncertain ? 'Outcome uncertain; automatic fallback stopped to avoid duplicates.' : error.message;
      const errorCode = ['TimeoutError','AbortError','TypeError','SyntaxError'].includes(error.name) ? error.name : 'ProviderError';
      attempts.push({ provider, success: false, latencyMs: Date.now() - started, error: reason, errorCode });
      await env.DB.prepare('UPDATE provider_health SET consecutive_failures=consecutive_failures+1,last_failure_reason=?,updated_at=unixepoch() WHERE provider_name=?').bind(reason, provider).run();
      if (uncertain) { providerUsed = provider; status = 'Queued'; break; }
      continue;
    }
    // Database failures after acceptance must never cause another provider send.
    attempts.push({ provider, success: true, latencyMs: Date.now() - started });
    await env.DB.prepare('UPDATE provider_health SET consecutive_failures=0,last_failure_reason=NULL,last_used_timestamp=unixepoch(),updated_at=unixepoch() WHERE provider_name=?').bind(provider).run();
    break;
  }
  const result = { id: logId, success: status === 'Sent', status, provider: providerUsed, providerMessageId: messageId, uncertain };
  await env.DB.batch([
    env.DB.prepare('UPDATE email_logs SET provider_used=?,transmission_status=?,provider_message_id=?,attempt_history=?,retry_count=?,error_message=?,updated_at=unixepoch() WHERE id=?')
      .bind(providerUsed || 'none', status, messageId, JSON.stringify(attempts), Math.max(0, attempts.length - 1), status === 'Sent' ? null : (uncertain ? 'Outcome uncertain; reconcile with provider.' : 'No provider accepted this message.'), logId),
    env.DB.prepare('UPDATE dispatch_requests SET response_json=? WHERE request_key=?').bind(JSON.stringify(result), key),
  ]);
  return result;
}
export async function verifyWebhook(provider, request, raw, env) {
  let body; try { body = JSON.parse(raw); } catch { throw new HttpError(400, 'Invalid JSON.'); }
  if (!body || typeof body !== 'object') throw new HttpError(400, 'Invalid event.');
  let eventId, messageId, status;
  if (provider === 'resend') {
    const id = request.headers.get('svix-id'), ts = request.headers.get('svix-timestamp'), signature = request.headers.get('svix-signature');
    if (!env.RESEND_WEBHOOK_SECRET || !id || !/^\d+$/.test(ts || '') || !signature || Math.abs(Date.now() / 1000 - +ts) > 300) throw new HttpError(403, 'Invalid webhook authentication.');
    const expected = base64(await hmac(env.RESEND_WEBHOOK_SECRET.replace(/^whsec_/, ''), `${id}.${ts}.${raw}`, true));
    let ok = false; for (const item of signature.split(' ')) if (item.startsWith('v1,') && await equal(item.slice(3), expected)) ok = true;
    if (!ok) throw new HttpError(403, 'Invalid webhook signature.');
    eventId = id; messageId = body.data?.email_id;
    status = ({ 'email.sent': 'Sent', 'email.delivered': 'Delivered', 'email.bounced': 'Bounced', 'email.complained': 'Bounced', 'email.failed': 'Failed' })[body.type];
  } else if (provider === 'mailgun') {
    const sig = body.signature;
    if (!env.MAILGUN_WEBHOOK_SIGNING_KEY || !sig || !/^\d+$/.test(String(sig.timestamp)) || typeof sig.token !== 'string' || sig.token.length > 256 || Math.abs(Date.now() / 1000 - +sig.timestamp) > 300) throw new HttpError(403, 'Invalid webhook authentication.');
    const expected = Array.from(await hmac(env.MAILGUN_WEBHOOK_SIGNING_KEY, `${sig.timestamp}${sig.token}`), b => b.toString(16).padStart(2, '0')).join('');
    if (!await equal(sig.signature, expected)) throw new HttpError(403, 'Invalid webhook signature.');
    const event = body['event-data']; eventId = sig.token; messageId = event?.message?.headers?.['message-id'];
    status = ({ accepted: 'Sent', delivered: 'Delivered', failed: 'Bounced' })[event?.event];
  } else throw new HttpError(404, 'Webhook provider not supported.');
  if (typeof eventId !== 'string' || eventId.length > 256) throw new HttpError(422, 'Invalid event identifier.');
  if (!status) return null; // Opens/clicks/delays must not regress delivery state.
  if (typeof messageId !== 'string' || messageId.length > 512) throw new HttpError(422, 'Missing provider message identifier.');
  return { eventId: await hash(provider + ':' + eventId), messageId, status };
}
export async function applyWebhook(env, provider, event) {
  if (!event) return;
  // One D1 batch transaction: replay claim and state change succeed or fail together.
  // The unique event key is recorded AFTER the conditional update within the same transaction.
  await env.DB.batch([
    env.DB.prepare(`UPDATE email_logs SET transmission_status=?,updated_at=unixepoch() WHERE provider_used=? AND provider_message_id=? AND direction='outbound'
      AND NOT EXISTS (SELECT 1 FROM webhook_events WHERE event_key=?)
      AND (transmission_status IN ('Queued','Sent') OR (transmission_status='Delivered' AND ?='Bounced'))`)
      .bind(event.status, provider, event.messageId, event.eventId, event.status),
    env.DB.prepare('INSERT INTO webhook_events (event_key,created_at) VALUES (?,unixepoch()) ON CONFLICT(event_key) DO NOTHING').bind(event.eventId),
  ]);
}
