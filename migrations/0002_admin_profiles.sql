CREATE TABLE IF NOT EXISTS admin_profiles (
 access_subject TEXT PRIMARY KEY,
 display_name TEXT NOT NULL,
 avatar_data TEXT,
 avatar_mime TEXT CHECK(avatar_mime IN ('image/png','image/jpeg')),
 updated_at INTEGER NOT NULL
);
