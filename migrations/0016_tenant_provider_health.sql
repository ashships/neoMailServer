-- Migration 0016: per-workspace provider circuit breakers.
-- provider_health was keyed only by provider_name, so one tenant's failures paused
-- delivery for every workspace. Rebuild the table with a composite primary key and
-- preserve the existing state as the deployment-wide ('local-admin') defaults.

CREATE TABLE IF NOT EXISTS provider_health_tenant (
  owner_subject TEXT NOT NULL DEFAULT 'local-admin',
  provider_name TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  consecutive_failures INTEGER DEFAULT 0,
  last_failure_reason TEXT,
  last_used_timestamp INTEGER,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (owner_subject, provider_name)
);

INSERT OR IGNORE INTO provider_health_tenant (owner_subject, provider_name, is_active, consecutive_failures, last_failure_reason, last_used_timestamp, updated_at)
SELECT 'local-admin', provider_name, is_active, consecutive_failures, last_failure_reason, last_used_timestamp, updated_at
FROM provider_health;

INSERT OR IGNORE INTO provider_health_tenant (owner_subject, provider_name, is_active, consecutive_failures, updated_at) VALUES
('local-admin', 'resend', 1, 0, unixepoch()),
('local-admin', 'sendfox', 1, 0, unixepoch()),
('local-admin', 'brevo', 1, 0, unixepoch()),
('local-admin', 'mailgun', 1, 0, unixepoch()),
('local-admin', 'mailtrap', 1, 0, unixepoch()),
('local-admin', 'mailersend', 1, 0, unixepoch()),
('local-admin', 'smtp', 1, 0, unixepoch());

DROP TABLE provider_health;
ALTER TABLE provider_health_tenant RENAME TO provider_health;
