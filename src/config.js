import { HttpError, email, text, hostname, isPrivateHost, encrypt, decrypt, bytes64 } from './security.js';
export const PROVIDERS = ['resend', 'brevo', 'mailgun', 'mailtrap', 'mailersend', 'smtp'];
export const SETTINGS = {
  BIMI_LOGO_URL: ['Public BIMI SVG logo URL', 'https-url', ''],
  BIMI_CERTIFICATE_URL: ['Public VMC / CMC certificate URL', 'https-url', ''],
  DEFAULT_SENDER: ['Default sender', 'email', 'no-reply@mail.neopathshala.com'],
  DEFAULT_SENDER_NAME: ['Sender name', 'text', 'NeoMail'],
  FALLBACK_ORDER: ['Provider order (comma separated)', 'providers', 'resend,brevo,mailgun,mailtrap,mailersend'],
  REQUEST_TIMEOUT_MS: ['Provider timeout (milliseconds)', 'number', '6000', 1000, 15000],
  API_RATE_LIMIT_PER_MINUTE: ['API requests per minute', 'number', '60', 1, 1000],
  WEBHOOK_RATE_LIMIT_PER_MINUTE: ['Webhook requests per minute / IP', 'number', '120', 1, 1000],
  MAX_LOGIN_ATTEMPTS: ['Login attempts per 15 minutes / IP', 'number', '5', 1, 10],
  RETENTION_DAYS: ['Message retention (days)', 'number', '30', 1, 365],
  STORE_MESSAGE_BODIES: ['Store message bodies (false recommended for OTPs)', 'boolean', 'false'],
  MAILGUN_DOMAIN: ['Mailgun production domain (verified custom domain)', 'optional-domain', ''],
  SMTP_HOST: ['SMTP host (e.g. smtp.gmail.com)', 'hostname', ''],
  SMTP_PORT: ['SMTP port (465 implicit TLS or 587 STARTTLS)', 'smtp-port', '465'],
  SMTP_USER: ['SMTP username', 'text', ''],
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
  // SMTP relays must be public DNS names on the two standards-compliant ports;
  // IP literals, localhost and internal suffixes are rejected to prevent SSRF.
  if (kind === 'hostname' && (!hostname(value) || isPrivateHost(value))) throw new HttpError(422, 'Enter a public SMTP hostname such as smtp.example.com.');
  if (kind === 'smtp-port' && !['465', '587'].includes(value)) throw new HttpError(422, 'SMTP port must be 465 (implicit TLS) or 587 (STARTTLS).');
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
// Rendering helpers receive a redacted copy so a template bug can never echo a
// decrypted credential into HTML. The real values stay in server-side scope.
export function redactConfig(values = {}) {
  const out = { ...values };
  for (const name of SECRETS) if (out[name]) out[name] = '[configured]';
  return out;
}
export async function config(env, decryptSecrets = true) {
  const result = { ...env }; const configured = new Set();
  for (const [name, spec] of Object.entries(SETTINGS)) result[name] = env[name] ?? spec[2];
  let rows = [];
  try {
    const res = await env.DB.prepare('SELECT name,value,is_secret FROM app_settings').all();
    rows = res?.results || [];
  } catch (err) {
    console.error(JSON.stringify({ event: 'LOAD_SETTINGS_FAILED', error: err?.message || String(err) }));
  }
  for (const row of rows) {
    if (row.is_secret && SECRETS.includes(row.name)) {
      if (decryptSecrets && env.CONFIG_ENCRYPTION_KEY) {
        try {
          result[row.name] = await decrypt(env.CONFIG_ENCRYPTION_KEY, row.value, row.name);
          configured.add(row.name);
        } catch (decryptErr) {
          console.error(JSON.stringify({ event: 'SETTING_DECRYPT_FAILED', setting: row.name, error: decryptErr?.message || String(decryptErr) }));
          result[row.name] = '[configured]';
          configured.add(row.name);
        }
      } else {
        result[row.name] = '[configured]';
        configured.add(row.name);
      }
    } else if (SETTINGS[row.name]) {
      try {
        result[row.name] = validateSetting(row.name, row.value);
      } catch (valErr) {
        console.error(JSON.stringify({ event: 'INVALID_SETTING_SKIPPED', setting: row.name, error: valErr?.message || String(valErr) }));
      }
    }
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

export function keyHint(key) {
  if (typeof key !== 'string' || !key) return '';
  const trimmed = key.trim();
  if (trimmed.startsWith('re_')) return 're_••••••••' + trimmed.slice(-4);
  if (trimmed.startsWith('xkeysib-')) return 'xkeysib-••••••••' + trimmed.slice(-4);
  if (trimmed.startsWith('mlsn.')) return 'mlsn.••••••••' + trimmed.slice(-4);
  // Generic secrets (including SMTP passwords) expose only the final two characters.
  return '••••••••' + trimmed.slice(-2);
}

export async function saveAccountProviderKey(env, ownerSubject, providerName, apiKey, extraConfig = null) {
  const owner = typeof ownerSubject === 'string' ? ownerSubject.trim() : '';
  if (!owner || owner.length > 254 || /[\x00-\x1f\x7f]/.test(owner)) throw new HttpError(403, 'Owner workspace required.');
  if (!PROVIDERS.includes(providerName)) throw new HttpError(422, 'Invalid provider.');
  if (typeof apiKey !== 'string' || apiKey.length < 8 || apiKey.length > 4096 || /[\s\x00-\x1f\x7f]/.test(apiKey)) {
    throw new HttpError(422, 'API key must be 8–4096 non-whitespace characters.');
  }
  if (!env.CONFIG_ENCRYPTION_KEY || bytes64(env.CONFIG_ENCRYPTION_KEY).length !== 32) {
    throw new HttpError(503, 'Configuration encryption key unavailable.');
  }
  // extra_config holds routing metadata only. Passwords always live in the
  // encrypted_key column and are never duplicated into plaintext JSON.
  let extra = null;
  if (providerName === 'smtp') {
    const host = hostname(extraConfig?.smtp_host || '');
    const port = String(extraConfig?.smtp_port || '465');
    const user = typeof extraConfig?.smtp_user === 'string' ? extraConfig.smtp_user.trim() : '';
    if (!host || isPrivateHost(host)) throw new HttpError(422, 'Enter a public SMTP hostname such as smtp.example.com.');
    if (!['465', '587'].includes(port)) throw new HttpError(422, 'SMTP port must be 465 (implicit TLS) or 587 (STARTTLS).');
    if (!user || user.length > 255 || /[\x00-\x1f\x7f]/.test(user)) throw new HttpError(422, 'SMTP username is required.');
    extra = { smtp_host: host, smtp_port: port, smtp_user: user };
  } else if (providerName === 'mailgun') {
    const domain = String(extraConfig?.domain || '').trim().toLowerCase();
    if (domain) {
      if (!/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(domain) || domain.startsWith('sandbox')) {
        throw new HttpError(422, 'Enter a verified Mailgun production domain, without https:// or an email address.');
      }
      extra = { domain };
    }
  }
  const encrypted = await encrypt(env.CONFIG_ENCRYPTION_KEY, apiKey, owner + ':' + providerName);
  const hint = keyHint(apiKey);
  const extraStr = extra ? JSON.stringify(extra) : null;
  const id = crypto.randomUUID();
  await env.DB.prepare(`
    INSERT INTO account_provider_keys (id, owner_subject, provider_name, encrypted_key, key_hint, extra_config, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 1, unixepoch(), unixepoch())
    ON CONFLICT(owner_subject, provider_name) DO UPDATE SET
      encrypted_key = excluded.encrypted_key,
      key_hint = excluded.key_hint,
      extra_config = excluded.extra_config,
      is_active = 1,
      updated_at = unixepoch()
  `).bind(id, owner, providerName, encrypted, hint, extraStr).run();
  return { providerName, hint };
}

function ownerKey(ownerSubject) {
  const owner = typeof ownerSubject === 'string' ? ownerSubject.trim() : '';
  if (!owner || owner.length > 254 || /[\x00-\x1f\x7f]/.test(owner)) throw new HttpError(403, 'Owner workspace required.');
  return owner;
}

export async function deleteAccountProviderKey(env, ownerSubject, providerName) {
  const owner = ownerKey(ownerSubject);
  if (!PROVIDERS.includes(providerName)) throw new HttpError(422, 'Invalid request.');
  await env.DB.prepare('DELETE FROM account_provider_keys WHERE owner_subject=? AND provider_name=?').bind(owner, providerName).run();
}

export async function toggleAccountProviderKey(env, ownerSubject, providerName) {
  const owner = ownerKey(ownerSubject);
  if (!PROVIDERS.includes(providerName)) throw new HttpError(422, 'Invalid request.');
  await env.DB.prepare('UPDATE account_provider_keys SET is_active=1-is_active, updated_at=unixepoch() WHERE owner_subject=? AND provider_name=?').bind(owner, providerName).run();
}

export async function getAccountProviderKeys(env, ownerSubject) {
  if (!ownerSubject || !env.DB) return [];
  try {
    const res = await env.DB.prepare(
      'SELECT id, provider_name, key_hint, extra_config, is_active, updated_at FROM account_provider_keys WHERE owner_subject=? ORDER BY provider_name'
    ).bind(ownerSubject).all();
    return res.results || [];
  } catch {
    return [];
  }
}

export async function resolveAccountProviderSecrets(env, ownerSubject) {
  if (!ownerSubject || !env.DB || !env.CONFIG_ENCRYPTION_KEY) return {};
  let owner;
  try { owner = ownerKey(ownerSubject); } catch { return {}; }
  try {
    const res = await env.DB.prepare(
      'SELECT provider_name, encrypted_key, extra_config FROM account_provider_keys WHERE owner_subject=? AND is_active=1'
    ).bind(owner).all();
    const secrets = {};
    for (const row of res.results || []) {
      try {
        if (!PROVIDERS.includes(row.provider_name)) continue;
        const decrypted = await decrypt(env.CONFIG_ENCRYPTION_KEY, row.encrypted_key, owner + ':' + row.provider_name);
        let extra = {};
        if (row.extra_config) { try { extra = JSON.parse(row.extra_config) || {}; } catch { extra = {}; } }
        if (row.provider_name === 'smtp') {
          const host = hostname(extra.smtp_host || '');
          const port = String(extra.smtp_port || '465');
          if (!host || isPrivateHost(host) || !['465', '587'].includes(port)) throw new Error('Invalid SMTP routing metadata.');
          secrets.SMTP_HOST = host;
          secrets.SMTP_PORT = port;
          secrets.SMTP_USER = String(extra.smtp_user || '').slice(0, 255);
          // The encrypted key is the SMTP password; plaintext passwords are never read from extra_config.
          secrets.SMTP_PASS = decrypted;
          continue;
        }
        secrets[row.provider_name.toUpperCase() + '_API_KEY'] = decrypted;
        if (row.provider_name === 'mailgun') {
          const domain = hostname(extra.domain || '');
          if (domain && !domain.startsWith('sandbox')) secrets.MAILGUN_DOMAIN = domain;
        }
      } catch {
        // A single corrupt/foreign row must not disable other providers or leak details.
        console.error(JSON.stringify({ event: 'PROVIDER_KEY_DECRYPT_FAILED', provider: row.provider_name }));
      }
    }
    return secrets;
  } catch {
    return {};
  }
}

