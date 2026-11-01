-- 0018_provider_limits.sql
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
