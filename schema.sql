-- Cloudflare D1 Database Schema for Enterprise Multi-Identity Email Infrastructure
-- Apply explicitly using: npx wrangler d1 execute neomailserver --file=./schema.sql

-- 1. Main Email Audit, Storage & Transmission Log Table
CREATE TABLE IF NOT EXISTS email_logs (
    id TEXT PRIMARY KEY,
    direction TEXT NOT NULL DEFAULT 'outbound' CHECK(direction IN ('outbound', 'inbound')),
    provider_used TEXT NOT NULL,
    sender_address TEXT NOT NULL,
    recipient_address TEXT NOT NULL,
    subject TEXT NOT NULL,
    html_body TEXT,           -- Preserved HTML content for visual sandboxed preview
    text_body TEXT,           -- Plain text fallback content
    html_hash TEXT NOT NULL,  -- Cryptographic SHA-256 integrity hash
    transmission_status TEXT NOT NULL CHECK(transmission_status IN ('Queued', 'Sent', 'Delivered', 'Bounced', 'Failed')),
    provider_message_id TEXT,
    error_message TEXT,
    attempt_history TEXT,     -- Serialized JSON array of execution telemetry
    retry_count INTEGER DEFAULT 0,
    unix_timestamp INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    owner_subject TEXT
);

-- Fast Indexing for Audit Trails, Status Filtering, and Telemetry Lookups
CREATE INDEX IF NOT EXISTS idx_email_logs_direction ON email_logs(direction);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(transmission_status);
CREATE INDEX IF NOT EXISTS idx_email_logs_provider ON email_logs(provider_used);
CREATE INDEX IF NOT EXISTS idx_email_logs_timestamp ON email_logs(unix_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_provider_msg_id ON email_logs(provider_message_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_sender ON email_logs(sender_address);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient_address);
CREATE INDEX IF NOT EXISTS idx_email_logs_owner ON email_logs(owner_subject, unix_timestamp DESC);

-- 2. Sender Identities & Dynamic Mailboxes Management Table
CREATE TABLE IF NOT EXISTS sender_identities (
    id TEXT PRIMARY KEY,
    email_address TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    is_default INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER NOT NULL,
    owner_subject TEXT
);


-- 3. Security Audit & Zero-Trust Event Log Table
CREATE TABLE IF NOT EXISTS security_audit_logs (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL, -- 'AUTH_SUCCESS', 'AUTH_FAILURE', 'RATE_LIMIT_BLOCKED', 'WEBHOOK_INVALID_SIGNATURE', 'DISPATCH_FAILURE', 'IDENTITY_CREATED'
    ip_address TEXT NOT NULL,
    user_agent TEXT,
    details TEXT,
    unix_timestamp INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_security_audit_timestamp ON security_audit_logs(unix_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_security_audit_event ON security_audit_logs(event_type);

-- 4. Provider Real-Time Health & Circuit Breaker Tracking
-- Per-workspace circuit breakers. The 'local-admin' rows are the deployment-wide
-- defaults; a tenant row overrides them for that workspace only.
CREATE TABLE IF NOT EXISTS provider_health (
    owner_subject TEXT NOT NULL DEFAULT 'local-admin',
    provider_name TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    consecutive_failures INTEGER DEFAULT 0,
    last_failure_reason TEXT,
    last_used_timestamp INTEGER,
    updated_at INTEGER NOT NULL,
    PRIMARY KEY (owner_subject, provider_name)
);

INSERT OR IGNORE INTO provider_health (owner_subject, provider_name, is_active, consecutive_failures, updated_at) VALUES
('local-admin', 'resend', 1, 0, unixepoch()),
('local-admin', 'sendfox', 1, 0, unixepoch()),
('local-admin', 'brevo', 1, 0, unixepoch()),
('local-admin', 'mailgun', 1, 0, unixepoch()),
('local-admin', 'mailtrap', 1, 0, unixepoch()),
('local-admin', 'mailersend', 1, 0, unixepoch()),
('local-admin', 'smtp', 1, 0, unixepoch());

CREATE TABLE IF NOT EXISTS provider_limits (
    owner_subject TEXT NOT NULL DEFAULT 'local-admin',
    provider_name TEXT NOT NULL,
    send_limit INTEGER NOT NULL DEFAULT 100,
    updated_at INTEGER NOT NULL,
    PRIMARY KEY (owner_subject, provider_name)
);

INSERT OR IGNORE INTO provider_limits (owner_subject, provider_name, send_limit, updated_at) VALUES
('local-admin', 'resend', 100, unixepoch()),
('local-admin', 'sendfox', 100, unixepoch()),
('local-admin', 'brevo', 100, unixepoch()),
('local-admin', 'mailgun', 100, unixepoch()),
('local-admin', 'mailtrap', 100, unixepoch()),
('local-admin', 'mailersend', 100, unixepoch()),
('local-admin', 'smtp', 100, unixepoch());

-- Application settings: only allowlisted names are loaded; secrets use AES-256-GCM.
CREATE TABLE IF NOT EXISTS app_settings (
 name TEXT PRIMARY KEY, value TEXT NOT NULL, is_secret INTEGER NOT NULL DEFAULT 0 CHECK(is_secret IN (0,1)), updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS admin_sessions (
 token_hash TEXT PRIMARY KEY, csrf_token TEXT NOT NULL, access_subject TEXT NOT NULL,
 credential_version TEXT NOT NULL, expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON admin_sessions(expires_at);
CREATE TABLE IF NOT EXISTS rate_limits (
 bucket_key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_limits_expiry ON rate_limits(expires_at);
CREATE TABLE IF NOT EXISTS dispatch_requests (
 request_key TEXT PRIMARY KEY, payload_hash TEXT NOT NULL, log_id TEXT NOT NULL,
 response_json TEXT, created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_dispatch_created ON dispatch_requests(created_at);
CREATE TABLE IF NOT EXISTS webhook_events (event_key TEXT PRIMARY KEY, created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS idx_webhooks_created ON webhook_events(created_at);
CREATE TABLE IF NOT EXISTS admin_profiles (
 access_subject TEXT PRIMARY KEY,
 display_name TEXT NOT NULL,
 avatar_data TEXT,
 avatar_mime TEXT CHECK(avatar_mime IN ('image/png','image/jpeg','image/webp')),
 updated_at INTEGER NOT NULL
);

-- 5. API clients / integration keys for central multi-application use.
CREATE TABLE IF NOT EXISTS api_clients (
 id TEXT PRIMARY KEY,
 name TEXT NOT NULL,
 key_hash TEXT NOT NULL UNIQUE,
 sender_address TEXT,
 is_active INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0,1)),
 created_at INTEGER NOT NULL,
 last_used_at INTEGER,
 owner_subject TEXT
);
CREATE INDEX IF NOT EXISTS idx_api_clients_active ON api_clients(is_active);
CREATE INDEX IF NOT EXISTS idx_api_clients_owner ON api_clients(owner_subject);

-- 6. Application-level administrator accounts authorized through Cloudflare Access identities.
CREATE TABLE IF NOT EXISTS admin_users (
 subject TEXT PRIMARY KEY,
 role TEXT NOT NULL CHECK(role IN ('superadmin','admin')),
 is_active INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0,1)),
 created_at INTEGER NOT NULL,
 created_by TEXT
);

-- 7. One-time codes for email-based administrator login.
CREATE TABLE IF NOT EXISTS admin_otps (
 subject TEXT NOT NULL,
 salt TEXT NOT NULL,
 code_hash TEXT NOT NULL,
 expires_at INTEGER NOT NULL,
 attempts INTEGER NOT NULL DEFAULT 0,
 created_at INTEGER NOT NULL,
 PRIMARY KEY (subject)
);

-- 8. Client domains tracked for sender onboarding.
CREATE TABLE IF NOT EXISTS managed_domains (
 domain TEXT PRIMARY KEY,
 display_name TEXT NOT NULL,
 is_verified INTEGER NOT NULL DEFAULT 0 CHECK(is_verified IN (0,1)),
 created_at INTEGER NOT NULL,
 created_by TEXT,
 owner_subject TEXT,
 verification_token TEXT
);
CREATE INDEX IF NOT EXISTS idx_managed_domains_owner ON managed_domains(owner_subject);
CREATE INDEX IF NOT EXISTS idx_sender_identities_owner ON sender_identities(owner_subject);

-- 9. Encrypted per-account provider credentials in SQLite (D1).
-- Credentials are encrypted with AES-256-GCM using CONFIG_ENCRYPTION_KEY and isolated per workspace.
CREATE TABLE IF NOT EXISTS account_provider_keys (
  id TEXT PRIMARY KEY,
  owner_subject TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  encrypted_key TEXT NOT NULL,
  key_hint TEXT NOT NULL,
  extra_config TEXT,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0,1)),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(owner_subject, provider_name)
);
CREATE INDEX IF NOT EXISTS idx_account_provider_keys_owner ON account_provider_keys(owner_subject);

-- 10. Admin security alerts and continuous DNS verification tracking.
CREATE TABLE IF NOT EXISTS admin_alerts (
  id TEXT PRIMARY KEY,
  owner_subject TEXT NOT NULL,
  domain TEXT NOT NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_admin_alerts_owner ON admin_alerts (owner_subject, is_read);



