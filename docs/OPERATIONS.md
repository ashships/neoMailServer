# NeoMail deployment and Nepathshala integration

> **Authentication update:** Production now uses Cloudflare Access with email OTP and a passkey-capable identity provider, without the shared admin token. Local HTTP retains its development token. See [current administrator sign-in instructions](ADMIN-SIGN-IN.md); these supersede older token/MFA/credential-reauthentication instructions below. Account configuration and live OTP/passkey verification remain pending.


Prepared: 27 October 2026. Target: Cloudflare Workers (ES modules) and D1.

## 1. What you need

| Requirement | Purpose | Where it is configured |
| --- | --- | --- |
| Correct domain and DNS ownership | Worker hostname and verified sending identities | Cloudflare DNS / provider dashboard |
| Cloudflare account with Workers and D1 | Application and persistent database | Cloudflare account |
| D1 database ID | Bind application storage | `wrangler.toml`, binding `DB` |
| Cloudflare Access team domain and application audience | Verify administrator identity on every admin request | Access dashboard and Worker vars |
| Administrator allowlist and MFA | Limit console access to your team | Access identity provider / policies |
| Random admin token + SHA-256 verifier | Additional administrator proof | Token in password manager; `ADMIN_TOKEN_HASH` Worker secret |
| Independent 32-byte encryption key | Encrypt panel-managed credentials | `CONFIG_ENCRYPTION_KEY` Worker secret |
| Provider account, verified sender domain, restricted API key | Outbound delivery | Provider dashboard, then panel Settings |
| Separate random integration token | Backend-only send authorization | Panel `API_SECRET_KEY` and Nepathshala server environment |
| Webhook signing key (optional) | Authenticated delivery updates | Provider dashboard and panel |
| Node.js 22.13+, npm and current Wrangler | Build, test, deploy, recover | Development machine / CI |
| Monitoring and recovery owner | Respond to failures and compromise | Your operational process |

**Confirmed domain:** the owner confirmed `no-reply@mail.neopathshala.com`. Use `mail.neopathshala.com` for sender verification and the intended Worker hostname. DNS ownership and live provider authentication remain unverified.

## 2. Architecture and boundaries

- `/admin` and `/admin/*`: Cloudflare Access JWT verification plus a one-hour opaque database session. The production console rejects requests without Access configuration.
- `/api/v1/send`: backend-to-backend bearer authorization with a credential separate from the admin token. No cookies or admin fallback are accepted.
- `/webhooks/resend`, `/webhooks/mailgun`: signed provider events with timestamp checks and replay tracking. These endpoints must remain reachable by their providers.
- `email()` handler: optional inbound Email Routing capture to approved active identities. This is raw message capture, not an IMAP mailbox or a full MIME/attachment client.
- `scheduled()` handler: daily bounded retention cleanup at 02:17 UTC (08:02 Nepal time).
- D1 stores metadata, encrypted application credentials, hashed session tokens, fixed-window rate counters, idempotency records, replay identifiers, and security audit events.
- Mail bodies are not stored by default. Enabling retention stores bodies in D1 without application-level body encryption. Only configuration credentials receive AES-GCM encryption at the application layer.
- Five outbound adapters: Resend, Brevo, Mailgun (US API endpoint), Mailtrap sending API, MailerSend. SendFox is disabled because the original transactional endpoint was not verified.
- Delivery tracking is implemented for Resend and Mailgun only. Other providers show acceptance status until tracking is implemented and tested against their official contracts.

## 3. Local HTTP development

```bash
npm ci
npm run db:init:local
npm run db:migrate:local
npm run dev
```

Open `http://localhost:8787/admin`. The predev script prints the local administrator token; keep it private. It generates missing local bootstrap material while preserving unrelated `.dev.vars` entries. To print it again, run `npm run setup:local` in your terminal.

The Access bypass requires BOTH `LOCAL_DEV=true` and a loopback HTTP URL. It does not work on a public hostname or public HTTPS deployment. Use localhost or 127.0.0.1 consistently; sessions are host-bound. Secure cookies remain enabled; current mainstream browsers special-case localhost. If a browser rejects the cookie, use local HTTPS rather than weakening production cookie flags.

Use provider sandbox accounts or recipients you control. Sending a test from the panel is a real provider request. The automated test suite mocks all provider requests and does not send mail.

## 4. Fresh production deployment

### 4.1 Prepare tooling and configuration

```bash
npm install --save-dev wrangler@4
npm test
npm run build
npm run test:worker
npx wrangler login
npx wrangler d1 create neomail-db
```

Insert the returned D1 `database_id` into `wrangler.toml`. Choose a new database for initial production rather than accidentally reusing development data. Select the actual mail domain, sender defaults, and Access vars. `workers_dev=false` and `preview_urls=false` prevent alternate public Worker URLs by default.

Enable your verified domain route:

```toml
[[routes]]
pattern = "mail.neopathshala.com"
custom_domain = true
```

Update it if that spelling is incorrect. A production deployment without a configured custom route and with workers.dev disabled has no intended public hostname.

### 4.2 Initialize storage

```bash
npm run db:init:remote
npm run db:migrate:remote
```

The fresh schema seeds sender identities for `mail.neopathshala.com`. The migration adds the configuration, session, rate limit, idempotency and webhook tables. Schema changes occur explicitly at deploy time; HTTP requests never run DDL.

### 4.3 Bootstrap secrets

```bash
npm run credentials
npx wrangler secret put ADMIN_TOKEN_HASH
npm run encryption-key
npx wrangler secret put CONFIG_ENCRYPTION_KEY
```

Save the printed administrator token in a password manager. Put only its generated verifier in `ADMIN_TOKEN_HASH`. The token contains 256 bits of randomness; do not substitute a human password. The SHA-256 verifier is suitable here because the token has high entropy; this is not a password hashing scheme.

Save the encryption key in a separate protected recovery store. Do not paste secrets into `wrangler.toml`, shell history arguments, documentation, chat, or source control.

### 4.4 Configure Cloudflare Access

1. Create a self-hosted Access application for both `mail.neopathshala.com/admin` and `mail.neopathshala.com/admin/*` as supported by the dashboard path configuration. Verify that the bare `/admin` path is covered too.
2. Allow only explicitly approved administrator identities. Require MFA through the identity provider or applicable Access policy. Do not create an everyone/bypass policy.
3. Set `ACCESS_TEAM_DOMAIN` to your actual `TEAM.cloudflareaccess.com` hostname and `ACCESS_AUD` to the application audience tag in Worker vars.
4. Leave `/api/*`, `/webhooks/*`, and `/health` outside the admin Access path policy; they have separate application controls. A broad domain-wide Access policy can prevent provider callbacks and backend calls.
5. Verify the Worker validates signature, issuer, audience, expiry, issue time, and subject. Merely trusting the JWT header or an identity email header is insufficient.
6. Remove local development variables from production configuration. Even if accidentally present, the runtime loopback check prevents a public-host bypass.

For key rotation in Access, the application caches JWKS for five minutes; an unfamiliar key can be rejected until refresh. Monitor sign-in failures around identity-provider key rotations.

### 4.5 Deploy and configure the panel

```bash
npm run deploy
```

Sign in through Access, then use the administrator token. Add the required sender addresses; verify domains with providers separately. Set the default sender to an active identity. Save provider keys and the independent `API_SECRET_KEY` in Settings. Test one provider first, then add fallback providers in order.

Bindings and bootstrap secrets must be deployed correctly before the panel works. The panel intentionally does not contain a Cloudflare account API token or permission to redeploy itself.

## 5. Panel configuration reference

Panel settings take precedence over Worker vars; values are read afresh on subsequent requests.

| Key | Default | Allowed range / behavior |
| --- | --- | --- |
| DEFAULT_SENDER | no-reply@mail.neopathshala.com | Must match an active sender identity |
| DEFAULT_SENDER_NAME | Nepathshala | 1–100 safe text characters |
| FALLBACK_ORDER | resend,brevo,mailgun,mailtrap,mailersend | Unique supported provider names |
| REQUEST_TIMEOUT_MS | 6000 | 1000–15000 |
| API_RATE_LIMIT_PER_MINUTE | 60 | 1–1000, global per integration credential scope |
| WEBHOOK_RATE_LIMIT_PER_MINUTE | 120 | 1–1000 per provider/IP |
| MAX_LOGIN_ATTEMPTS | 5 | 1–10 per 15-minute fixed window per IP and Access subject |
| RETENTION_DAYS | 30 | 1–365; applies to mail records |
| STORE_MESSAGE_BODIES | false | false / true; affects newly stored messages only |
| MAILGUN_DOMAIN | mail.neopathshala.com | Verified domain; US Mailgun endpoint only |

Writable credentials: `API_SECRET_KEY`, provider-specific `*_API_KEY` for the five adapters, `RESEND_WEBHOOK_SECRET`, and `MAILGUN_WEBHOOK_SIGNING_KEY`. Forms never return their stored value. Updating requires CSRF and reconfirmation of the admin token. Blank/invalid submissions fail without deleting the current credential. The UI supports replacement, not deletion; disabling a provider uses Providers → Pause.

Credentials entered through the panel are encrypted with AES-256-GCM, a random 96-bit nonce, and setting-name authenticated data. D1 never stores their plaintext. A compromised Worker runtime or stolen master key can still decrypt them. Worker secrets can alternatively supply credentials; a stored panel credential overrides the matching Worker secret.

Both Settings and Sender identities → Set default update the sender used by API dispatch and the visible default identity marker.

## 6. Nepathshala backend integration

Configure in the **server environment only**:

```dotenv
NEOMAIL_URL=https://mail.neopathshala.com
NEOMAIL_API_KEY=YOUR_SEPARATE_RANDOM_INTEGRATION_TOKEN
```

Do not use a public client environment prefix such as `NEXT_PUBLIC_`. Do not call NeoMail directly from browser code. Integrate inside authenticated registration, reset, billing, and notification handlers, ideally through a backend outbox tied to your own business database transaction.

```js
export async function sendWelcome(user) {
  const response = await fetch(`${process.env.NEOMAIL_URL}/api/v1/send`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NEOMAIL_API_KEY}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `welcome:${user.id}:v1`,
    },
    body: JSON.stringify({
      from: 'no-reply@mail.neopathshala.com',
      to: user.email,
      subject: 'Welcome to Nepathshala',
      text: 'Your account is ready.',
    }),
    signal: AbortSignal.timeout(90000),
  });
  const result = await response.json();
  if (response.status === 202 || result.uncertain) {
    // Record for reconciliation; never blindly send again under a new key.
    return { pendingReview: true, mailId: result.id };
  }
  if (!response.ok) throw new Error(`NeoMail error ${response.status}`);
  return result;
}
```

Use a stable operation-specific idempotency key. The same key must carry the same normalized message. Never generate a new key for a retry of the same business operation. If an upstream timeout interrupts your request, retry the identical payload with the same key and backoff; a 409 means in-progress or different content and must be inspected. Global fallback can take up to five provider timeouts, so use a backend job/outbox to keep registration page latency low. Do not wait for all providers inside a user-facing request if low latency matters.

User-provided text embedded in HTML must be escaped by the caller. Authorization, recipient eligibility, OTP generation/expiry/attempt limits, password reset token hashing, and account enumeration prevention remain the responsibility of the Nepathshala backend. NeoMail does not issue authentication tokens or decide whether a user may request a password reset.

### Request contract

`POST /api/v1/send` (legacy alias `/api/send`)

Required headers: `Authorization: Bearer TOKEN`, `Content-Type: application/json`, `Idempotency-Key: VALUE`.

Required fields: `to`, `subject`, one of `text` or `html`. Optional `from` and `from_name`; omitted values use panel defaults. One recipient per request. The sender must be an active identity. Maximum request: 128 KiB of streamed bytes; each body field: 50,000 characters; subject: 255 characters; from_name: 100 characters. Attachments, CC/BCC, scheduling and templates are not implemented.

| Status | Meaning / caller action |
| --- | --- |
| 200 | Provider accepted; not proof of recipient inbox placement. Replayed requests include `replayed:true`. |
| 202 | Outcome uncertain; message remains Queued. Reconcile with provider; do not create a new send key. |
| 400 / 415 / 422 | Invalid JSON, media type, fields, identity or idempotency key. Fix request. |
| 401 | Invalid/missing independent API credential. |
| 403 | HTTPS or origin/authentication requirement rejected. |
| 409 | Key already used for different content or dispatch pending/unknown. Inspect before retrying. |
| 413 | Request exceeds size limit. |
| 429 | Fixed-window quota exceeded. Back off using Retry-After; repeated requests consume quota too. |
| 502 | No available provider accepted; result is persisted under the key. Fix configuration; create an intentionally new business attempt only after reviewing the failed record. |
| 503 | Required bootstrap credential/binding is unavailable. |
| 500 | Internal failure; reference ID returned. Outcome may be uncertain, so retry only with the same key. |

No CORS access is granted. CORS is not an authentication mechanism. `/health` is a liveness probe only; it does not test database/provider readiness.

## 7. Delivery semantics and fallback

Requests reserve an idempotency key atomically in D1 before sending. Retries return the stored result, or 409 while the outcome remains unknown. Records are retained indefinitely to prevent old keys silently becoming new sends. Capacity planning must include this table; do not prune it without an explicit business deduplication policy.

Fallback occurs after definitive HTTP rejection (400, 401, 403, 404, 422, 429). Timeouts, network errors, malformed success responses, 5xx, and other ambiguous outcomes stop fallback and leave the message Queued. This prioritizes avoiding duplicates over automatic recovery. Provider acceptance followed by a D1 failure cannot trigger another provider in the same dispatch.

No exactly-once delivery guarantee is possible across D1 and external providers. A Worker crash after external acceptance may leave a Queued record with provider name but no provider message ID. Reconcile in the provider dashboard before any manual resend. There is no automatic background dispatch queue or retry worker in this version.

After five consecutive failures a provider cools down for five minutes; Providers can be paused manually. A successful request resets its failures. Health indicators reflect configuration and recent attempts, not synthetic uptime checks or guaranteed credential validity. Sandbox/test limitations and provider quotas still apply.

## 8. Webhooks

- Resend URL: `https://mail.neopathshala.com/webhooks/resend`. Enable sent, delivered, bounced, complained, and failed events. Save its exact signing secret as `RESEND_WEBHOOK_SECRET`. Verification checks Svix ID, timestamp (five-minute tolerance), and HMAC over the raw body.
- Mailgun URL: `https://mail.neopathshala.com/webhooks/mailgun`. Save the webhook signing key as `MAILGUN_WEBHOOK_SIGNING_KEY`, not its sending API key. The verifier checks timestamp, token, and HMAC. API/message-id formatting must be confirmed against a real staged callback before launch.
- Unsupported/generic/Brevo webhook paths are rejected. There is no query-string token authentication.
- Events match both provider and provider message ID. Recipient-only matching is prohibited. Duplicate events are tracked in D1; update and replay insert share a database batch transaction.
- Delivered/Bounced terminal states do not regress to Sent. A complaint/bounce can supersede Delivered. Open/click/delay events are ignored for delivery-state updates. Mailgun `failed` currently maps to Bounced regardless of temporary/permanent severity; refine before depending on temporary-failure reporting.
- Webhooks arriving before provider_message_id is stored are acknowledged without a matched update. There is no pending-event replay queue. At volume, implement durable unmatched-event reconciliation; currently use the provider dashboard for unresolved deliveries.
- Clocks must be reasonably synchronized. Old signed events are rejected; replay IDs are kept seven days.

## 9. DNS and inbound mail

Do not import the original combined SPF example: provider includes and selectors vary and can exceed SPF lookup limits. Use `dns-records.txt` as instructions, not an importable production zone. Copy each provider’s generated records exactly, verify DNS-only/proxy state per provider, and maintain a single SPF record per hostname with at most ten DNS-triggering lookups.

Enable DKIM and inspect actual `Authentication-Results` in a delivered test. Start DMARC monitoring for the actual sender domain and move to quarantine/reject after confirming legitimate traffic alignment. Inbox placement depends on reputation, consent, content, recipients, provider behavior and authentication; no code or DNS record guarantees it.

For inbound capture, enable Cloudflare Email Routing for the required subdomain in the current dashboard and route approved addresses to this Worker. Copy the exact Cloudflare-generated MX/TXT records. Avoid blindly replacing existing mail-provider MX records. The handler accepts active local identities and rejects messages over 128 KiB. The stored raw message is not MIME-parsed; attachments are not extracted. The inbound feature needs live Cloudflare routing verification after deployment.

## 10. Rotation, backup and recovery

- **API token:** generate with `npm run api-key`, update panel `API_SECRET_KEY`, then update the Nepathshala backend immediately. There is no overlapping dual-key rotation window. Use a controlled maintenance change and never reuse the admin token.
- **Provider key:** replace in Settings and send a controlled test. Revoke the old key in the provider dashboard after validating replacement. Restrict to required sending scopes and domains where supported.
- **Admin token:** generate a new token/verifier with `npm run credentials`, then replace `ADMIN_TOKEN_HASH` using Wrangler. Every session is bound to a hash of the current verifier and becomes invalid on rotation. Console “Sign out all sessions” also removes sessions immediately.
- **Encryption key:** do not simply replace the Worker secret. Existing stored panel credentials become unreadable. There is no automatic re-encryption tool. Take a backup, securely retain the old key, stage a decrypt-and-re-encrypt migration, verify all credentials, and only then revoke the old key. For small installations, remove/re-enter encrypted setting rows in a controlled maintenance window with backups; avoid changing unrelated settings.
- **D1 backup:** inspect `npx wrangler d1 time-travel info neomail-db` and note the current bookmark before migrations. Recovery windows depend on Cloudflare plan. Protect logical exports with encryption and strict access; they contain mail metadata and possibly bodies. Store the encryption key separately; a D1 backup alone is insufficient to restore encrypted settings.
- **Restore:** restore only in an incident-controlled maintenance window; it overwrites data. Prefer rehearsal against isolated staging data first. After restoring, revoke sessions, rotate integration/provider credentials if exposure is possible, and inspect for resurrected idempotency records or records lost after the restore point. A restored database can no longer know about later successful sends.
- **Rollback:** retain a known-good Worker version and database bookmark. Do not roll back to the original insecure webhook/authentication paths. The database upgrade is additive; avoid destructive migrations during routine rollback.

## 11. Monitoring and launch gate

Observe HTTP 5xx/429 volume, Queued/Failed/Bounced messages, provider health, D1 storage/latency, retention backlog, cron invocation success, new configuration audit events, and unexpected sign-ins. No external alert delivery or uptime monitor has been configured by this code change. Configure your team’s actual alert channels in Cloudflare/provider monitoring.

Daily cleanup deletes up to 1,000 old messages, 1,000 security events, 1,000 webhook events, and 10,000 expired rate counters. Sessions are removed after expiry. Security audit events are retained 90 days. With higher volume, increase cleanup frequency/batch strategy and monitor backlog. Retention changes do not erase provider-side copies, D1 point-in-time backups, or external exports.

Before live integration: pass unit/SQLite flow tests and native Miniflare tests; verify desktop and mobile browser flows, production Access MFA and allowlist, blocked alternate hosts, correct DNS domain, one real delivery per provider, signed delivery callbacks, duplicate keys, logout replay rejection, backups/restoration, and operational alerting. Obtain an independent security review before sending sensitive production traffic.

## 12. Primary references

Reviewed 27 October 2026:

- https://developers.cloudflare.com/workers/configuration/secrets/
- https://developers.cloudflare.com/workers/best-practices/workers-best-practices/
- https://developers.cloudflare.com/workers/runtime-apis/web-crypto/
- https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/
- https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/ (native binding is approximate per location; this implementation instead uses atomic D1 fixed-window counters)
- https://developers.cloudflare.com/d1/reference/time-travel/
- https://developers.cloudflare.com/email-service/configuration/subdomains/
- https://developers.cloudflare.com/email-service/get-started/route-emails/
- https://github.com/resend/resend-openapi/blob/main/resend.yaml
- https://developers.brevo.com/reference/send-transac-email

Provider contracts and Cloudflare UI can change. Validate real staged credentials, regions, plan limits, payloads and callback examples before enabling production traffic.

## 13. Profile names, profile images, and sender names

Open Settings → Your profile, or click your profile in the top bar. Set a display name and upload a PNG or JPEG logo/photo up to 128 KiB. Images are limited to 4096 pixels per side and 4 megapixels. SVG, GIF, WebP and animated formats are not supported. Leave the file empty to preserve the current image; select Remove current image to remove it. Uploading and removing together is rejected. Names and images are scoped to the authenticated Access subject; local testing uses the shared local development identity.

Uploads are streamed through a bounded multipart parser, protected by same-origin and CSRF checks, and verified by raster headers and dimensions. Images are stored as base64 in D1, served only after session and Access checks with their verified image media type, nosniff, and no-store. There is no public upload bucket or external image URL. Metadata such as JPEG EXIF is preserved; strip sensitive metadata before uploading. These are small profile images, not general-purpose email attachments or image hosting. Image decoding in real browsers remains a manual validation step.

Apply npm run db:migrate:remote before deploying to an existing production database. Migration 0002_admin_profiles.sql is additive. This workspace's local migration was applied already. Profile records persist until explicitly updated or removed; changing email-log retention does not remove them.

Sender identities → Edit name updates that identity's display name. Outbound sends use its saved name by default; explicit API from_name overrides it. Renaming the current default synchronizes DEFAULT_SENDER_NAME. Changing DEFAULT_SENDER_NAME in Settings also updates the default identity's name. Changing a name can change the normalized message used for idempotency matching, so do not rename identities during an in-flight retry/reconciliation operation.

The uploaded profile image brands the NeoMail admin panel only. It is not sent as an email avatar, and it is not proof of sender authenticity. Recipient inbox logos require separate supported provider/domain configuration; do not assume a panel upload will appear in Gmail or Outlook. Domain authentication and reputation remain separate from visual branding.

## 14. WebP profile optimization (supersedes image-format limits in section 13)

The Settings profile uploader now accepts PNG, JPEG and static WebP. With JavaScript enabled, it accepts source images up to 8 MiB and 16 megapixels, decodes them in the browser, resizes without upscaling to a maximum of 512 pixels on the longest side, and encodes WebP at quality 0.86. If necessary it retries at 0.72 and 0.55 to meet the 128 KiB upload limit. Transparency is preserved by the canvas encoder. Original file metadata is not copied to the converted image. Compression does not guarantee a smaller result for every source image.

Only the Settings response permits the inline compressor script, using a fresh CSP nonce. Other pages retain script-src none; no unsafe-inline script permission or external script source is added. The compressor submits the existing same-origin multipart form with its session CSRF token; there are no third-party uploads.

The server independently verifies WebP RIFF/container lengths, image chunk dimensions, MIME, size and animation flags. It accepts static VP8, VP8L and VP8X variants. Animated WebP is rejected if uploaded directly. Browser conversion produces a static image; do not use animated sources if retaining animation matters. PNG/JPEG remain accepted under the existing server limits for no-JavaScript clients. Without JavaScript, upload an already optimized file under 128 KiB and 4 megapixels; the 8 MiB source limit applies only before browser conversion.

Existing profile images are preserved, not automatically recompressed. Re-upload to optimize them. Apply migration 0003_profile_webp.sql via npm run db:migrate:remote before deploying this version to an existing production database. It rebuilds the profile table to extend the MIME constraint, preserving profile data. The existing local database was upgraded with a backup. No new production dependency or paid Cloudflare image-processing binding is needed.

## 15. Mailgun sandbox field and test mode

Settings now separates MAILGUN_DOMAIN (optional verified production custom domain) from MAILGUN_SANDBOX_DOMAIN (optional sandbox*.mailgun.org domain). Blank production domain skips Mailgun in normal dispatch. Store the sandbox in the dedicated field; URLs and email addresses are rejected. Saving a sandbox field creates its postmaster sender identity if absent without changing your default identity or provider order.

To test: Settings → Mailgun sandbox domain → Save settings; Send a test → Delivery mode → Mailgun sandbox only. Enter an authorized recipient, subject and body. This mode overrides the sender with postmaster@the-sandbox and routes only through Mailgun for this request. It does not change global routing. Normal API dispatch never selects sandbox mode automatically; the sender-address selector is ignored in sandbox test mode. Activate the recipient using Mailgun's verification email first. Your real sender requires a verified custom domain for production.

The supplied sandbox was prefilled in the existing local database. Its former value in the production-domain field was cleared. Production must be configured separately when ready. No additional live email was sent while adding this UI; automated tests mock sending.
