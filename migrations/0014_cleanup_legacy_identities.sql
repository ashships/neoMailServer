-- Migration 0014: remove legacy sender identities for mail.neopathshala.com
-- These were seeded historically; tenant/workspace model now requires verified managed domains.
DELETE FROM sender_identities WHERE email_address LIKE '%@mail.neopathshala.com';
