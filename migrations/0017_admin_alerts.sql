-- Migration 0017: Admin Security Alerts & Continuous DNS Verification
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
