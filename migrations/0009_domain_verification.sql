ALTER TABLE managed_domains ADD COLUMN verification_token TEXT;
UPDATE managed_domains SET verification_token = lower(hex(randomblob(16))) WHERE verification_token IS NULL;
