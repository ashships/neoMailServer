# NeoMail security review and operating limits

> **Authentication update:** Production now uses Cloudflare Access with email OTP and a passkey-capable identity provider, without the shared admin token. Local HTTP retains its development token. See [current administrator sign-in instructions](ADMIN-SIGN-IN.md); these supersede older token/MFA/credential-reauthentication instructions below. Account configuration and live OTP/passkey verification remain pending.


27 October 2026. This is a code-level hardening pass and automated regression suite, not a third-party penetration test, certification, or a guarantee against breach.

## Fixed in this change

| Original behavior / risk | Implemented control |
| --- | --- |
| Generic webhook could be accepted without a configured or submitted secret | Generic path removed; only explicitly supported signed Resend/Mailgun events accepted |
| API credential absence fell back to admin authentication | Dedicated API bearer credential required, fail closed |
| Signed stateless session could be replayed after logout | Opaque random session with SHA-256 token hash in D1; logout deletes it |
| Admin verifier reused as session signing secret | No session signing with the admin verifier; separate opaque server-side sessions |
| Legacy raw admin token accepted in a cookie | Removed; only new opaque cookie sessions accepted |
| Admin mutation method and origin checks inconsistent | POST-only mutation routing, strict same-origin check, session CSRF token |
| Unbounded request parsing | Streamed 128 KiB limit plus type and field length validation |
| Isolate-local / KV counter behavior could be bypassed through distributed requests or races | Atomic D1 fixed-window conditional UPSERT counters; no memory fail-open |
| Configurable credentials required redeploy or unsafe plaintext storage | Allowlisted panel settings; write-only credential replacement, admin reconfirmation, AES-GCM ciphertext in D1 |
| Fallback after timeout risked duplicate delivery | D1 idempotency reservation and payload binding; ambiguous outcomes stop fallback |
| Provider HTTP response bodies could leak credentials/content into logs | Store safe HTTP status categories only; never persist upstream response bodies |
| Sender could be any arbitrary syntactically valid address | Active configured identity required for API and console sends |
| Webhooks could update an unrelated message by recipient fallback | Match exact provider plus message ID; no recipient-only lookup |
| Duplicate/out-of-order callbacks could regress delivery state | Replay table and conditional monotonic state updates in a D1 transaction |
| Runtime schema initialization added DDL overhead and swallowed errors | Explicit schema/migration commands; missing storage fails visibly |
| Email HTML could fetch remote tracking pixels | Isolated sandboxed preview endpoint with CSP blocking external content |
| Console cached sensitive responses | no-store, same-origin referrer policy, noindex, strict CSP and defensive response headers |
| Bodies stored indefinitely | Off by default; configurable mail retention and scheduled bounded cleanup |
| Unsafe broad CORS preflight | Browser cross-origin API access rejected; backend integration documented |
| Inflated “1000% secure” / guaranteed inbox placement claims | Removed from active source and documentation |

## Administrator model

Production requires a correctly signed Cloudflare Access application JWT and a high-entropy administrator token to establish a session. JWT validation checks RS256, the configured team issuer, audience, expiry, issued-at and subject. The subject and admin verifier version bind each D1 session. Rotating `ADMIN_TOKEN_HASH` invalidates sessions; logout/revoke-all removes them directly. Maximum session lifetime is one hour.

Local HTTP bypass is explicit and restricted to loopback hosts. The local setup script creates a dedicated local admin token. A production public hostname cannot use this bypass or local token even if LOCAL_DEV is set.

This is a single-administrator-role console. It does not implement individual application accounts, role-based settings permissions, tenant isolation, passkeys, or native TOTP. Individual administrator identity, enrollment, MFA and revocation should be controlled through Cloudflare Access. Anyone allowed through Access who possesses the admin token has full console authority, including reading retained mail and replacing integration credentials.

## Threat model

Protected assets: provider credentials, integration credential, mail metadata/bodies, dispatch availability, sender authority, and audit records.

Relevant attackers: unauthenticated Internet callers, stolen API token holders, malicious email senders, CSRF/XSS attackers, compromised administrator browsers or accounts, compromised provider accounts, and insiders with Cloudflare/D1 access.

Controls reduce unauthenticated access, replay, injection, cross-origin mutation, duplicate dispatch, and accidental secret disclosure. SQL values are bound parameters; dynamic SQL is assembled only from fixed application clauses. Email HTML is untrusted and only rendered in a sandbox with no script execution and no remote images. Browser page scripts are disabled by CSP; the panel uses standard forms.

Cloudflare Access policy mistakes, runtime compromise, credential theft, or malicious authorized administrators can defeat application protections. App audit records share D1 with the app and are not tamper-evident or immutable. A content hash is only a content fingerprint; it is not a digital signature or proof that a privileged database operator has not modified both body and hash.

## Remaining risks and launch requirements

- Configure real Cloudflare Access policies and MFA; this source change does not create them. Keep workers.dev/preview URLs disabled or covered by equivalent enforcement.
- A single API token authorizes all configured senders. It has no per-service scopes or recipient restrictions. Rotate if leaked; enforce business authorization and rate limits in the calling neopathshala backend.
- D1 counters are strict per fixed-window key but are not protection against all volumetric attacks, distributed IP traffic, D1 query-cost exhaustion, or provider quota abuse. Add Cloudflare edge WAF/rate controls and account spending alerts, appropriate to your plan.
- Rate-limited response Retry-After is a conservative 60-second hint, not the exact remaining login lockout interval. Login windows can last up to fifteen minutes. Do not lower production protections just to resolve lockout.
- Idempotency protects against repeats under the same key, not an attacker using a new key each time. Caller outbox design and operation identifiers matter. Records are retained indefinitely and need capacity monitoring.
- External sends and D1 cannot share a transaction. Crashes or network ambiguity require provider reconciliation. There is no exactly-once delivery claim.
- Unmatched early webhooks are not queued for replay. Some callback race conditions require manual inspection; implement durable pending-event processing before high-volume use.
- Resend/Mailgun webhook paths need real signed callback tests. Brevo, Mailtrap and MailerSend callback verification is not implemented. Provider fallback contracts and actual account capabilities need staged verification.
- No automatic suppression list, unsubscribe system, bulk marketing tool, attachment scanning, SMTP/IMAP service, multi-tenant API isolation, background delivery queue, or external alerting is implemented.
- Body retention includes potentially sensitive OTPs, reset links and personal information if enabled. Keep it off for authentication mail. D1 metadata, audit events, retained bodies, backups and exports still require organizational access controls and privacy handling.
- The application encryption key is a bootstrap secret outside D1. Loss prevents recovering encrypted settings; theft plus a D1 export exposes them. There is no automatic encryption-key migration UI.
- The available Wrangler dependency is outdated. A registry upgrade attempt failed because outbound npm DNS was unavailable. Upgrade Wrangler and inspect a full dependency audit before production; the production-only audit does not assess development-tool supply-chain risk.
- Live browser interaction and native workerd/D1 execution were not completed here due local port restrictions. The automated SQLite and crypto tests and a successful bundle do not substitute for production verification or independent review.

## Incident response

1. Restrict Access and pause or disable dispatch at the edge if active abuse is occurring.
2. Revoke all application sessions and replace the administrator verifier if compromised.
3. Rotate the separate API token and provider keys, then update dependent backends.
4. Retain logs and inspect Cloudflare/provider activity; do not print secrets or mail bodies into diagnostics.
5. Reconcile Queued/ambiguous dispatches before sending replacements.
6. Use a recorded D1 bookmark/export only after evaluating what later messages and idempotency records would be lost.
7. Re-test auth, sender restrictions, callbacks and integration before reopening traffic.

Report suspected vulnerabilities privately to the project owner; no public vulnerability inbox or automated bounty process is configured by this change.

## Multi-tenant isolation and verified-domain sending (31 October 2026)

Workspaces are isolated per `admin_users` subject. Only two roles exist:
`superadmin` (deployment owner) and `admin` (a fully isolated tenant workspace).
Superadmin creates admins from the panel; admins can never grant themselves
superadmin powers, change global settings, provider credentials or routing,
view other workspaces' mail or events, or send from other workspaces' domains.

| Area | Control |
| --- | --- |
| Sending domains | Every outbound send requires a **verified domain** (`managed_domains.is_verified=1`). Unregistered or unverified sender domains are rejected by `dispatch()` for both API and console sends (the deployment's own Mailgun sandbox domain is the only exception). |
| Identity creation | Console identities can only be created on the workspace's own verified domains. |
| Verified-domain enforcement | A domain owner claim: tenants may only use domains whose `owner_subject` matches their subject; superadmin sees every workspace's domains. No domain is seeded — a fresh deployment must add and DNS-verify its first sending domain (the optional `bootstrap-verified` token is reserved for infrastructure domains controlled outside DNS TXT records). |
| Propagation refresh | The Domains view offers a **Re-check** for verified domains; `/api/v1/domains/verify` and the console verify endpoint now confirm on DNS pass and **revoke** on DNS fail. The daily cron re-validates a bounded batch of verified domains; when the TXT record is removed, `is_verified` flips to 0, an audit event records the lapse, and the dispatch gate immediately stops all sending from that domain. |
| Ownership stamping | Outbound (`dispatch`) and inbound (email worker) `email_logs` rows are stamped with `owner_subject`; the mail activity views, message inspector and HTML preview are owner-scoped. Cross-tenant message reads 404. |
| API clients | Keys inherit their creator's tenant; restricted senders must be identities owned by the same tenant. Dispatch enforces identity ownership and tenants namespace their idempotency keys. |
| Rate limits | Per-IP login/API limits, per-client API limit, admin console actions (30/min), test sends (5/min), and per-IP domain verification checks (10/min) bound abuse even with valid credentials. |
| Access JWT role | Fails closed on lookup errors and bare subjects; role always comes from `admin_users`. |

Legacy environment `API_SECRET_KEY` behaves as the deployment owner
(`local-admin`) and is subject to the same verified-domain gate.
