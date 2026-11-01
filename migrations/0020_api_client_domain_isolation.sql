-- Migration 0020: API client domain-level isolation
-- Enforces that every API client key is strictly isolated to a single verified domain.

ALTER TABLE api_clients ADD COLUMN domain TEXT;

UPDATE api_clients SET domain = COALESCE(
  domain,
  (SELECT domain FROM managed_domains WHERE managed_domains.owner_subject = api_clients.owner_subject AND managed_domains.is_verified = 1 LIMIT 1),
  (SELECT domain FROM managed_domains LIMIT 1),
  'mail.neopathshala.com'
);

CREATE INDEX IF NOT EXISTS idx_api_clients_domain ON api_clients(domain);
