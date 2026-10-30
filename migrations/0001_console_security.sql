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
