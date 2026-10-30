CREATE TABLE IF NOT EXISTS managed_domains (
 domain TEXT PRIMARY KEY,
 display_name TEXT NOT NULL,
 is_verified INTEGER NOT NULL DEFAULT 0 CHECK(is_verified IN (0,1)),
 created_at INTEGER NOT NULL,
 created_by TEXT
);
