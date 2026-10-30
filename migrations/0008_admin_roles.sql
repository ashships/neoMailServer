CREATE TABLE admin_users_expanded (
 subject TEXT PRIMARY KEY,
 role TEXT NOT NULL CHECK(role IN ('superadmin','admin','client','staff')),
 is_active INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0,1)),
 created_at INTEGER NOT NULL,
 created_by TEXT
);
INSERT INTO admin_users_expanded (subject,role,is_active,created_at,created_by)
 SELECT subject,role,is_active,created_at,created_by FROM admin_users;
DROP TABLE admin_users;
ALTER TABLE admin_users_expanded RENAME TO admin_users;
