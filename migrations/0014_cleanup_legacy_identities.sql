-- Migration 0014: remove legacy, unowned sender identities for mail.neopathshala.com
-- Identities that belong to a workspace which has verified the domain are real
-- tenant data and must survive. Only stale/foreign rows are removed.
DELETE FROM sender_identities
WHERE email_address LIKE '%@mail.neopathshala.com'
  AND NOT EXISTS (
    SELECT 1
    FROM managed_domains d
    WHERE d.domain = 'mail.neopathshala.com'
      AND d.is_verified = 1
      AND d.owner_subject IS sender_identities.owner_subject
  );
