-- Migration 0013: simplify roles to 'superadmin' and 'admin'.
-- 'admin' is a fully isolated tenant workspace role; 'client' and 'staff' are merged into it.
-- SQLite cannot alter a CHECK constraint, so the admin_users table is rebuilt.
CREATE TABLE admin_users_new (
 subject TEXT PRIMARY KEY,
 role TEXT NOT NULL CHECK(role IN ('superadmin','admin')),
 is_active INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0,1)),
 created_at INTEGER NOT NULL,
 created_by TEXT
);
INSERT INTO admin_users_new (subject, role, is_active, created_at, created_by)
 SELECT subject, CASE WHEN role = 'superadmin' THEN 'superadmin' ELSE 'admin' END, is_active, created_at, created_by FROM admin_users;
DROP TABLE admin_users;
ALTER TABLE admin_users_new RENAME TO admin_users;
