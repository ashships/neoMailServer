-- Migration 0012: tenant isolation hardening and verified-domain sending.
-- Every stored row must carry an owner subject; historical NULLs belong to the deployment owner.
UPDATE email_logs SET owner_subject = COALESCE(owner_subject, 'local-admin') WHERE owner_subject IS NULL;
UPDATE sender_identities SET owner_subject = COALESCE(owner_subject, 'local-admin') WHERE owner_subject IS NULL;

-- Sending domains are added and DNS-verified per workspace; no domain is seeded.

-- Owner-scoped indexes keep tenant dashboards fast without full-table scans.
CREATE INDEX IF NOT EXISTS idx_email_logs_owner ON email_logs(owner_subject, unix_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_sender_identities_owner ON sender_identities(owner_subject);
CREATE INDEX IF NOT EXISTS idx_api_clients_owner ON api_clients(owner_subject);
CREATE INDEX IF NOT EXISTS idx_managed_domains_owner ON managed_domains(owner_subject);
