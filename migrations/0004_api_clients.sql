CREATE TABLE IF NOT EXISTS api_clients (
 id TEXT PRIMARY KEY,
 name TEXT NOT NULL,
 key_hash TEXT NOT NULL UNIQUE,
 sender_address TEXT,
 is_active INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0,1)),
 created_at INTEGER NOT NULL,
 last_used_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_api_clients_active ON api_clients(is_active);
