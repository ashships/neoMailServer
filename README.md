# NeoMail Server

> **Authentication update:** Production now uses Cloudflare Access with email OTP and a passkey-capable identity provider, without the shared admin token. Local HTTP retains its development token. See [current administrator sign-in instructions](docs/ADMIN-SIGN-IN.md); these supersede older token/MFA/credential-reauthentication instructions below. Account configuration and live OTP/passkey verification remain pending.


A private transactional email console for Cloudflare Workers and D1. Redesigned console: overview, mail activity, provider routing, sender identities, test dispatch, settings, security events, and integration guide.

**Security is an ongoing process; this project does not guarantee immunity from compromise.** Deployment, provider DNS, Access policy, and account security must be configured and verified before production.

## Run locally over HTTP

Requirements: Node.js 22.13+ (Node 24 LTS recommended), installed npm dependencies.

```bash
npm ci
npm run db:init:local
npm run db:migrate:local
npm run dev
```

Open **http://localhost:8787/admin**. `npm run dev` prepares `.dev.vars` and prints a local administrator token. Use that token on the sign-in page. Local HTTP works without Cloudflare Access only on `localhost` or `127.0.0.1` when `LOCAL_DEV=true`. Use the same hostname throughout sign-in and use a current browser that treats localhost as a secure context for Secure cookies.

The setup preserves existing provider credentials and the production administrator verifier. It adds a local-only admin token and an encryption key if missing. `.dev.vars` is ignored and restricted to owner read/write. Never share or commit it.

For an existing local database, apply `npm run db:migrate:local`; fresh installations also need `db:init:local`. The additive migration does not overwrite existing messages or identities. The new version invalidates legacy cookies, requires separate API credentials, requires `Idempotency-Key`, and restricts webhooks to signed Resend/Mailgun events.

## Manage from the panel

1. Add sender identities matching your provider-verified domain.
2. Open Settings, set a default sender, configure routing and retention, and save.
3. Save provider keys using the write-only credential forms. Confirm your admin token when replacing a credential.
4. Generate a separate integration token with `npm run api-key`; save it as `API_SECRET_KEY` in Settings and in your backend’s secret environment.
5. Send a test email to an inbox you control.

Panel settings override Worker defaults for allowlisted keys. Credentials entered in the panel are AES-256-GCM encrypted in D1. Bootstrap secrets, Access policy, bindings, and deployment routes remain in Cloudflare.

## Documentation

- [Complete deployment, API, integration and operations guide](docs/OPERATIONS.md)
- [Security changes, threat model and limitations](docs/SECURITY.md)
- [Validation results and remaining launch checks](docs/VALIDATION.md)
- [Provider-specific DNS instructions](dns-records.txt)

Confirmed sender: **no-reply@mail.neopathshala.com**. Use this domain consistently in DNS, provider verification, and Worker routes.

## Validate

```bash
npm test
npm run build
npm run test:worker
```

`npm test` uses Node’s built-in SQLite for application flows and Web Crypto for security primitives. `test:worker` separately exercises Miniflare/D1 and requires permission to open local ports. All external sends are mocked in tests. The dry-run build does not deploy.

The available dependencies use Wrangler 3.114.17. Upgrade with `npm install --save-dev wrangler@4` and rerun checks before production. An attempted upgrade in this workspace was blocked by unavailable npm registry DNS; the lockfile remains consistent with the installed dependency range.
