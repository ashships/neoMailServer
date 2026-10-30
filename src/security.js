const enc = new TextEncoder();
export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export const headers = {
  'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; img-src 'self' data:; frame-src 'self'; script-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
  'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY',
  // no-referrer turns Origin into "null" on browser form POSTs, breaking CSRF checks.
  'Strict-Transport-Security': 'max-age=31536000', 'Referrer-Policy': 'same-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Resource-Policy': 'same-origin',
  'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow',
};
export function reply(body, status = 200, extra = {}) {
  return new Response(typeof body === 'string' ? body : JSON.stringify(body), {
    status, headers: { ...headers, 'Content-Type': typeof body === 'string' ? 'text/html; charset=utf-8' : 'application/json; charset=utf-8', ...extra },
  });
}
export function redirect(path, extra = {}) { return reply('', 303, { Location: path, ...extra }); }
export function escape(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
export async function hash(s) { return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(s))), b => b.toString(16).padStart(2, '0')).join(''); }
export function bytes64(s) { return Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)); }
export function base64(b) { return btoa(String.fromCharCode(...new Uint8Array(b))); }
export async function equal(a, b) {
  // Compare fixed-length digests, including when inputs have different lengths.
  const x = await hash(String(a)), y = await hash(String(b));
  let diff = 0; for (let i = 0; i < x.length; i++) diff |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return diff === 0;
}
export async function hmac(secret, message, isBase64 = false) {
  const key = await crypto.subtle.importKey('raw', isBase64 ? bytes64(secret) : enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(message)));
}
export function email(value) {
  if (typeof value !== 'string' || value.length > 254 || /[\s\x00-\x1f\x7f]/.test(value)) return null;
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9.-]{0,251}[a-zA-Z0-9])?\.[a-zA-Z]{2,63}$/.test(value) ? value.toLowerCase() : null;
}
export function text(value, max = 255, required = true) {
  if (typeof value !== 'string' || value.length > max || /[\x00-\x1f\x7f<>]/.test(value) || (required && !value.trim())) throw new HttpError(422, 'Invalid text field or field too long.');
  return value.trim();
}
export function cookie(request, name) {
  const item = (request.headers.get('cookie') || '').split(';').find(v => v.trim().startsWith(name + '='));
  if (!item) return ''; try { return decodeURIComponent(item.trim().slice(name.length + 1)); } catch { return ''; }
}
export function local(request, env) { const u = new URL(request.url); return env.LOCAL_DEV === 'true' && u.protocol === 'http:'; }
export function sameOrigin(request) {
  if (request.headers.get('origin') !== new URL(request.url).origin || request.headers.get('sec-fetch-site') === 'cross-site') throw new HttpError(403, 'Request origin rejected.');
}
export async function readBody(request, maxBytes = 131072) {
  if (Number(request.headers.get('content-length')) > maxBytes) throw new HttpError(413, 'Request body too large.');
  if (!request.body) return '';
  const reader = request.body.getReader(); let size = 0; const chunks = [];
  try {
    for (;;) { const { done, value } = await reader.read(); if (done) break; size += value.length;
      if (size > maxBytes) { await reader.cancel(); throw new HttpError(413, 'Request body too large.'); } chunks.push(value); }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0; for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return new TextDecoder().decode(bytes);
}
export async function form(request) {
  if (!request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded')) throw new HttpError(415, 'Expected a URL-encoded form.');
  return new URLSearchParams(await readBody(request));
}
export async function json(request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) throw new HttpError(415, 'Expected application/json.');
  let parsed; try { parsed = JSON.parse(await readBody(request)); } catch (e) { if (e instanceof HttpError) throw e; throw new HttpError(400, 'Invalid JSON.'); }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new HttpError(422, 'Expected a JSON object.');
  return parsed;
}
export async function rate(env, key, max, windowSeconds) {
  if (env.LOCAL_DEV === 'true') return;
  const bucket = Math.floor(Date.now() / 1000 / windowSeconds); const expires = (bucket + 1) * windowSeconds;
  const row = await env.DB.prepare(`INSERT INTO rate_limits (bucket_key, count, expires_at) VALUES (?, 1, ?)
    ON CONFLICT(bucket_key) DO UPDATE SET count = count + 1 WHERE count < ? RETURNING count`)
    .bind(`${await hash(key)}:${bucket}`, expires, max).first();
  if (!row) throw new HttpError(429, 'Rate limit reached. Try again after the current window.');
}
export async function audit(env, request, event, details = {}) {
  await env.DB.prepare('INSERT INTO security_audit_logs (id,event_type,ip_address,user_agent,details,unix_timestamp) VALUES (?,?,?,?,?,unixepoch())')
    .bind(crypto.randomUUID(), event, request.headers.get('cf-connecting-ip') || 'local', (request.headers.get('user-agent') || '').slice(0, 200), JSON.stringify(details)).run();
}

const ALLOWED_FETCH_HOSTS = new Set(['api.resend.com','api.brevo.com','api.mailgun.net','api.mailtrap.io','api.mailersend.com','cloudflare-dns.com']);
export function assertAllowedFetch(url) {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:') throw new HttpError(403, 'Outbound requests must use HTTPS.');
  const host = parsed.hostname;
  if (ALLOWED_FETCH_HOSTS.has(host) || host.endsWith('.cloudflareaccess.com')) return;
  throw new HttpError(403, 'Outbound host is not allowed.');
}
export async function safeFetch(url, init) {
  assertAllowedFetch(url);
  return fetch(url, init);
}

const jwksCache = new Map();
export function accessConfigured(env) {
  const team = env.ACCESS_TEAM_DOMAIN, audience = env.ACCESS_AUD;
  return /^[a-z0-9-]+\.cloudflareaccess\.com$/.test(team || '') && !!audience;
}
export function tokenLoginConfigured(env) {
  return env.ALLOW_TOKEN_LOGIN === 'true' && !accessConfigured(env) && typeof env.ADMIN_TOKEN_HASH === 'string' && env.ADMIN_TOKEN_HASH.length > 0;
}
export function otpLoginConfigured(env) {
  return env.EMAIL_OTP_LOGIN === 'true' && !accessConfigured(env);
}
export async function access(request, env) {
  if (local(request, env)) return env.LOCAL_DEV_SUBJECT || 'local-admin';
  if (new URL(request.url).protocol !== 'https:') throw new HttpError(403, 'HTTPS required.');
  if (tokenLoginConfigured(env) || otpLoginConfigured(env)) {
    const token = cookie(request, '__Host-neomail');
    if (token && /^[a-f0-9-]{36}$/.test(token)) {
      const row = await env.DB.prepare('SELECT access_subject FROM admin_sessions WHERE token_hash=? AND expires_at>unixepoch()').bind(await hash(token)).first();
      if (row?.access_subject) return row.access_subject;
    }
    return null;
  }
  if (!accessConfigured(env)) throw new HttpError(503, 'Cloudflare Access must be configured before admin access.');
  const team = env.ACCESS_TEAM_DOMAIN, audience = env.ACCESS_AUD;
  const token = request.headers.get('cf-access-jwt-assertion') || '';
  try {
    if (token.length > 16000) throw Error();
    const parts = token.split('.'); if (parts.length !== 3) throw Error();
    const head = JSON.parse(new TextDecoder().decode(bytes64(parts[0]))), claims = JSON.parse(new TextDecoder().decode(bytes64(parts[1])));
    const now = Math.floor(Date.now() / 1000);
    if (head.alg !== 'RS256' || !head.kid || claims.iss !== `https://${team}` || !Array.isArray(claims.aud) || !claims.aud.includes(audience) ||
      !Number.isFinite(claims.exp) || claims.exp <= now || !Number.isFinite(claims.iat) || claims.iat > now + 30 || (claims.nbf && claims.nbf > now + 30) || !claims.sub) throw Error();
    let cached = jwksCache.get(team);
    if (!cached || cached.expires < Date.now()) {
      const res = await safeFetch(`https://${team}/cdn-cgi/access/certs`, { signal: AbortSignal.timeout(5000), redirect: 'manual' });
      if (!res.ok) throw Error(); cached = { keys: (await res.json()).keys, expires: Date.now() + 300000 }; jwksCache.set(team, cached);
    }
    const jwk = cached.keys.find(k => k.kid === head.kid && k.kty === 'RSA'); if (!jwk) throw Error();
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    if (!await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, bytes64(parts[2]), enc.encode(parts[0] + '.' + parts[1]))) throw Error();
    if (env.DB) {
    try {
      const count = await env.DB.prepare('SELECT COUNT(*) AS n FROM admin_users').first('n');
      if ((count?.n || 0) > 0) {
        const account = await env.DB.prepare('SELECT role FROM admin_users WHERE subject=? AND is_active=1').bind(claims.sub).first();
        if (!account) throw new HttpError(403, 'Administrator account is not authorized.');
      }
    } catch { /* table may not exist yet */ }
  }
    return claims.sub;
  } catch { throw new HttpError(403, 'Valid Cloudflare Access authentication required.'); }
}

export async function session(request, env, subject) {
  const token = cookie(request, '__Host-neomail'); if (!/^[a-f0-9-]{36}$/.test(token)) return null;
  return env.DB.prepare('SELECT * FROM admin_sessions WHERE token_hash = ? AND expires_at > unixepoch() AND access_subject = ? AND credential_version = ?')
    .bind(await hash(token), subject, await hash(env.ADMIN_TOKEN_HASH || '')).first();
}
export async function csrf(request, data, sess) {
  sameOrigin(request);
  if (!sess || !await equal(data.get('csrf') || '', sess.csrf_token)) throw new HttpError(403, 'Form expired. Reload the page and try again.');
}
export function sessionCookie(value, age = 3600) { return `__Host-neomail=${value}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${age}`; }
export async function encrypt(secret, value, name) {
  const key = await crypto.subtle.importKey('raw', bytes64(secret), 'AES-GCM', false, ['encrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  return base64(iv) + '.' + base64(await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: enc.encode(name) }, key, enc.encode(value)));
}
export async function decrypt(secret, value, name) {
  const [iv, data] = value.split('.');
  const key = await crypto.subtle.importKey('raw', bytes64(secret), 'AES-GCM', false, ['decrypt']);
  return new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes64(iv), additionalData: enc.encode(name) }, key, bytes64(data)));
}
