import { HttpError, email, text, encrypt, decrypt, bytes64 } from './security.js';
export const PROVIDERS = ['resend', 'brevo', 'mailgun', 'mailtrap', 'mailersend', 'smtp'];
export const SETTINGS = {
  BIMI_LOGO_URL: ['Public BIMI SVG logo URL', 'https-url', ''],
  BIMI_CERTIFICATE_URL: ['Public VMC / CMC certificate URL', 'https-url', ''],
  DEFAULT_SENDER: ['Default sender', 'email', ''],
  DEFAULT_SENDER_NAME: ['Sender name', 'text', 'neoPathshala'],
  FALLBACK_ORDER: ['Provider order (comma separated)', 'providers', 'resend,brevo,mailgun,mailtrap,mailersend'],
  REQUEST_TIMEOUT_MS: ['Provider timeout (milliseconds)', 'number', '6000', 1000, 15000],
  API_RATE_LIMIT_PER_MINUTE: ['API requests per minute', 'number', '60', 1, 1000],
  WEBHOOK_RATE_LIMIT_PER_MINUTE: ['Webhook requests per minute / IP', 'number', '120', 1, 1000],
  MAX_LOGIN_ATTEMPTS: ['Login attempts per 15 minutes / IP', 'number', '5', 1, 10],
  RETENTION_DAYS: ['Message retention (days)', 'number', '30', 1, 365],
  STORE_MESSAGE_BODIES: ['Store message bodies (false recommended for OTPs)', 'boolean', 'false'],
  MAILGUN_DOMAIN: ['Mailgun production domain (verified custom domain)', 'optional-domain', ''],
  SMTP_HOST: ['SMTP host (e.g. smtp.gmail.com)', 'text', ''],
  SMTP_PORT: ['SMTP port', 'number', '465', 1, 65535],
  SMTP_USER: ['SMTP username', 'text', ''],
  SMTP_SECURE: ['SMTP implicit TLS (port 465)', 'boolean', 'true'],
  MAILGUN_SANDBOX_DOMAIN: ['Mailgun sandbox domain (testing only)', 'sandbox-domain', ''],
};
export const SECRETS = ['API_SECRET_KEY', ...PROVIDERS.map(p => p.toUpperCase() + '_API_KEY'), 'RESEND_WEBHOOK_SECRET', 'MAILGUN_WEBHOOK_SIGNING_KEY', 'SMTP_PASS'];
export function validateSetting(name, value) {
  const spec = SETTINGS[name]; if (!spec) throw new HttpError(422, 'Unknown setting.');
  if (typeof value !== 'string' || value.length > 255) throw new HttpError(422, 'Invalid setting.');
  const kind = spec[1]; value = value.trim();
  if (kind === 'https-url' && value) {
    try {
      const parsed = new URL(value);
      if(parsed.protocol!=='https:' || parsed.username || parsed.password || parsed.hash || /[;\s]/.test(value)) throw Error();
    } catch {throw new HttpError(422,'BIMI URLs must be public HTTPS URLs without credentials, fragments, whitespace or semicolons.');}
  }
  if (kind === 'email' && !email(value)) throw new HttpError(422, 'Invalid sender address.');
  if (kind === 'number' && (!/^\d+$/.test(value) || +value < spec[3] || +value > spec[4])) throw new HttpError(422, `${spec[0]} must be between ${spec[3]} and ${spec[4]}.`);
  if (kind === 'boolean' && !['true', 'false'].includes(value)) throw new HttpError(422, 'Choose true or false.');
  if (kind === 'sandbox-domain' && value && !/^sandbox[a-z0-9]+\.mailgun\.org$/.test(value)) throw new HttpError(422, 'Enter the sandbox domain from your Mailgun dashboard, without https:// or an email address.');
  if (kind === 'optional-domain' && value && !/^(?=.{1,253}$)[a-z0-9]+(?:[a-z0-9.-]*[a-z0-9])?\.[a-z]{2,63}$/.test(value)) throw new HttpError(422, 'Invalid Mailgun production domain.');
  if (kind === 'optional-domain' && value.startsWith('sandbox') && value.endsWith('.mailgun.org')) throw new HttpError(422, 'Put your Mailgun sandbox in the separate sandbox field.');
  if (kind === 'domain' && !/^(?=.{1,253}$)[a-z0-9]+(?:[a-z0-9.-]*[a-z0-9])?\.[a-z]{2,63}$/.test(value)) throw new HttpError(422, 'Invalid domain.');
  if (kind === 'providers') {
    const order = value.split(',').map(p => p.trim());
    if (!order.length || order.some(p => !PROVIDERS.includes(p)) || new Set(order).size !== order.length) throw new HttpError(422, 'Use unique supported provider names.');
    value = order.join(',');
  }
  return kind === 'text' ? text(value, 100) : value;
}
export async function config(env) {
  const result = { ...env }; const configured = new Set();
  for (const [name, spec] of Object.entries(SETTINGS)) result[name] = env[name] ?? spec[2];
  const rows = await env.DB.prepare('SELECT name,value,is_secret FROM app_settings').all();
  for (const row of rows.results || []) {
    if (row.is_secret && SECRETS.includes(row.name)) {
      if (!env.CONFIG_ENCRYPTION_KEY) throw new HttpError(503, 'Configuration encryption key unavailable.');
      result[row.name] = await decrypt(env.CONFIG_ENCRYPTION_KEY, row.value, row.name); configured.add(row.name);
    } else if (SETTINGS[row.name]) result[row.name] = validateSetting(row.name, row.value);
  }
  return { values: result, configured };
}
export async function saveSettings(env, data) {
  const statements = []; const changed = [];
  for (const name of Object.keys(SETTINGS)) {
    if (!data.has(name)) continue;
    const value = validateSetting(name, data.get(name));
    statements.push(env.DB.prepare('INSERT INTO app_settings (name,value,is_secret,updated_at) VALUES (?,?,0,unixepoch()) ON CONFLICT(name) DO UPDATE SET value=excluded.value,is_secret=0,updated_at=unixepoch()').bind(name, value)); changed.push(name);
  }
  if (data.has('DEFAULT_SENDER')) {
    // Only reset the is_default flag among identities owned by the default sender's workspace.
    const ownerRow = await env.DB.prepare('SELECT owner_subject FROM sender_identities WHERE email_address=?').bind(data.get('DEFAULT_SENDER').trim()).first();
    const owner = ownerRow?.owner_subject || 'local-admin';
    statements.push(env.DB.prepare('UPDATE sender_identities SET is_default=CASE WHEN email_address=? THEN 1 ELSE 0 END WHERE owner_subject=?').bind(data.get('DEFAULT_SENDER').trim(), owner));
  }
  if (data.has('DEFAULT_SENDER') && data.has('DEFAULT_SENDER_NAME')) {
    statements.push(env.DB.prepare("UPDATE sender_identities SET display_name=? WHERE email_address=? AND owner_subject='local-admin'").bind(data.get('DEFAULT_SENDER_NAME').trim(), data.get('DEFAULT_SENDER').trim()));
  }
  const sandbox=data.get('MAILGUN_SANDBOX_DOMAIN');
  if (sandbox?.trim()) statements.push(env.DB.prepare("INSERT INTO sender_identities(id,email_address,display_name,is_default,is_active,created_at,owner_subject) VALUES (?,?,?,0,1,unixepoch(),'local-admin') ON CONFLICT(email_address) DO NOTHING").bind(crypto.randomUUID(),'postmaster@'+sandbox.trim(),'NeoMail Mailgun Sandbox'));
  if (statements.length) await env.DB.batch(statements);
  return changed;
}
export async function saveSecret(env, name, value) {
  if (!SECRETS.includes(name) || typeof value !== 'string' || value.length < 16 || value.length > 4096 || /[\s\x00-\x1f\x7f]/.test(value)) throw new HttpError(422, 'Use an allowed credential with 16–4096 non-whitespace characters.');
  if (!env.CONFIG_ENCRYPTION_KEY || bytes64(env.CONFIG_ENCRYPTION_KEY).length !== 32) throw new HttpError(503, 'Configure the 32-byte CONFIG_ENCRYPTION_KEY Worker secret first.');
  if (name === 'API_SECRET_KEY' && value.length < 43) throw new HttpError(422, 'Use a cryptographically random API token of at least 43 characters.');
  const encrypted = await encrypt(env.CONFIG_ENCRYPTION_KEY, value, name);
  await env.DB.prepare('INSERT INTO app_settings (name,value,is_secret,updated_at) VALUES (?,?,1,unixepoch()) ON CONFLICT(name) DO UPDATE SET value=excluded.value,is_secret=1,updated_at=unixepoch()').bind(name, encrypted).run();
}
