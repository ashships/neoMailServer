-- Migration 0015: Encrypted per-account provider API keys in SQLite (D1)
-- Stores credentials with AES-256-GCM encryption per tenant account for complete isolation.

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
