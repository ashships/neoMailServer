# Administrator sign-in: email OTP and passkey

27 October 2026. This document supersedes earlier production administrator-token instructions.

## Implemented application behavior

Production uses Cloudflare Access as the authentication broker. Users select email OTP or a configured passkey-capable identity provider on the Access login page, then continue into NeoMail. The Worker validates the signed Access assertion and creates an opaque one-hour session bound to its subject and configured Access application. No shared administrator token is requested in production.

Both methods are alternatives, not two factors required together. Email OTP remains the weaker fallback: mailbox compromise can grant access. Offering it means passkey phishing resistance does not protect every possible login. For administrators requiring stronger security, restrict their Access policy to the passkey-capable provider.

Credential updates require a valid session, same-origin form, CSRF token, and an Access assertion issued within five minutes. This checks assertion age, not proof of a fresh biometric ceremony or a second factor. Access session reuse can issue a fresh assertion without a fresh IdP login; enforce actual reauthentication requirements through Access/IdP policy. If rejected, sign out of Access and authenticate again. The backend API token remains separate.

Production logout deletes the application session and redirects to /cdn-cgi/access/logout. Application “Sign out all sessions” removes D1 sessions but does not revoke every user's IdP/Access session. Revoke those through the Access dashboard when needed.

## Cloudflare configuration required before either option is usable

1. Confirm the actual mail console hostname and protect /admin and /admin/* using one self-hosted Access application. Keep API and webhook endpoints outside this admin policy.
2. In Zero Trust → Integrations → Identity providers, add One-time PIN for email OTP. Cloudflare sends the codes; NeoMail does not deliver its own login mail.
3. Add a passkey-capable identity provider such as your organization's OIDC/SAML provider. Enroll administrator passkeys and configure its authentication policy to require passkey/WebAuthn authentication for this application. Merely adding a provider or naming a button “Passkey” does not enforce passkeys.
4. Enable both configured login methods for the Access application. Disable automatic redirection to a single provider if you want the chooser to remain visible.
5. Explicitly allowlist administrator email addresses for both paths. Do not rely only on IdP groups for OTP users: group claims from a prior IdP login do not persist when the user switches to OTP. Do not use an everyone/bypass policy.
6. Put the actual Access team hostname and application audience into ACCESS_TEAM_DOMAIN and ACCESS_AUD in wrangler.toml. Deploy using the operations guide.
7. Test each option with a real approved account, then test a disallowed account and an unsigned assertion. Verify email delivery, passkey enforcement, policy coverage, session expiry, logout, and recovery.

No Cloudflare account changes, identity provider enrollment, or real OTP/passkey verification were performed in this workspace. Administrator emails and provider configuration have not been supplied. Native passkey registration/verification is delegated to the identity provider; there is no custom in-app WebAuthn implementation or local OTP mailer.

## Local HTTP testing

Run npm run dev and visit http://localhost:8787/admin. The existing localhost-only development token remains available and is printed in your terminal. Production never accepts this local token. To exercise actual email OTP and passkeys, use an HTTPS staging hostname protected by the configured Access application. Loopback development does not simulate those identity-provider ceremonies.

## Bootstrap and session revocation

CONFIG_ENCRYPTION_KEY and the independent API_SECRET_KEY remain required for their existing purposes. ADMIN_TOKEN_HASH is no longer required in production; legacy token-based sessions are invalidated by the new credential-version binding. Old token variables may be removed from deployed Worker secrets after confirming the new deployment works. Keep LOCAL_ADMIN_TOKEN only in the ignored local .dev.vars file.

Changes to the Access team hostname or audience invalidate existing application sessions. Console session revocation is immediate in D1; enforce user offboarding at Access/IdP as well.

## Verification

npm test: 14 tests passing, including signed production Access session issuance without an admin token, wrong-subject isolation, stale-assertion credential-write rejection, and Access logout redirect. Worker deployment dry-run passes. Live OTP delivery/passkey ceremonies and browser verification remain deployment checks, not completed tests.

References:
https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/one-time-pin/
https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/
https://developers.cloudflare.com/cloudflare-one/faq/authentication-faq/
https://developers.cloudflare.com/cloudflare-one/access-controls/access-settings/session-management/
