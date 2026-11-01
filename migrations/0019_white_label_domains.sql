-- 0019_white_label_domains.sql: White-label custom API endpoints and domain enforcement
ALTER TABLE managed_domains ADD COLUMN custom_api_hostname TEXT;
ALTER TABLE managed_domains ADD COLUMN custom_hostname_status TEXT DEFAULT 'disabled';
ALTER TABLE managed_domains ADD COLUMN enforce_custom_hostname INTEGER DEFAULT 0 CHECK(enforce_custom_hostname IN (0,1));
