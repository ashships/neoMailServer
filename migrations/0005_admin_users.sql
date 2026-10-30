CREATE TABLE IF NOT EXISTS admin_users (
 subject TEXT PRIMARY KEY,
 role TEXT NOT NULL CHECK(role IN ('superadmin','admin')),
 is_active INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0,1)),
 created_at INTEGER NOT NULL,
 created_by TEXT
);
INSERT OR IGNORE INTO admin_users (subject, role, is_active, created_at) VALUES ('aashishydv.np@gmail.com', 'superadmin', 1, unixepoch());
INSERT OR IGNORE INTO admin_users (subject, role, is_active, created_at) VALUES ('local-admin', 'superadmin', 1, unixepoch());
