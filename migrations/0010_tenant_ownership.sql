ALTER TABLE sender_identities ADD COLUMN owner_subject TEXT;
ALTER TABLE managed_domains ADD COLUMN owner_subject TEXT;
ALTER TABLE api_clients ADD COLUMN owner_subject TEXT;
ALTER TABLE email_logs ADD COLUMN owner_subject TEXT;
UPDATE sender_identities SET owner_subject = COALESCE(owner_subject, 'local-admin');
UPDATE managed_domains SET owner_subject = COALESCE(owner_subject, created_by, 'local-admin');
UPDATE api_clients SET owner_subject = COALESCE(owner_subject, 'local-admin');
UPDATE email_logs SET owner_subject = COALESCE(owner_subject, 'local-admin');
