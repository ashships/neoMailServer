-- Rebuild only the profile table to extend its MIME CHECK; preserve all existing data.
CREATE TABLE admin_profiles_webp (
 access_subject TEXT PRIMARY KEY, display_name TEXT NOT NULL, avatar_data TEXT,
 avatar_mime TEXT CHECK(avatar_mime IN ('image/png','image/jpeg','image/webp')),
 updated_at INTEGER NOT NULL
);
INSERT INTO admin_profiles_webp SELECT access_subject,display_name,avatar_data,avatar_mime,updated_at FROM admin_profiles;
DROP TABLE admin_profiles;
ALTER TABLE admin_profiles_webp RENAME TO admin_profiles;
