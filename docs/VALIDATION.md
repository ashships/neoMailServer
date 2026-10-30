# Validation record

> **Authentication update:** Production now uses Cloudflare Access with email OTP and a passkey-capable identity provider, without the shared admin token. Local HTTP retains its development token. See [current administrator sign-in instructions](ADMIN-SIGN-IN.md); these supersede older token/MFA/credential-reauthentication instructions below. Account configuration and live OTP/passkey verification remain pending.


27 October 2026. No real mail was sent and no production deployment was performed.

## Completed

- `npm test`: 13 tests passing. Node Web Crypto and SQLite-backed application flow tests.
- Entire application-flow coverage includes local HTTP sign-in, production Access fail-closed behavior, opaque session issuance, GET logout rejection, logout invalidation, all seven console sections, same-origin and CSRF enforcement, identity creation, encrypted credential replacement, atomic validation failure, sender allowlisting, admin/API credential separation, duplicate send replay, conflicting idempotency payload rejection, ambiguous-provider outcomes, unsupported/unsigned webhook rejection, sandbox preview policy, search SQL execution, and concurrent fixed-window counter limits.
- Signed webhook tests cover verified Resend events, provider isolation, duplicate events, and status non-regression.
- Cryptographic tests cover AES-GCM randomized ciphertext, successful decryption, wrong setting-name rejection, wrong-key rejection, and fixed-size digest comparisons.
- Access tests use real RSA signatures and reject wrong audiences, issuers, expired/future claims, and invalid signatures.
- Input tests cover body overflow without Content-Length, header injection, invalid body types, missing content, invalid setting names, provider list injection, duplicate providers, unsafe domains, invalid numeric bounds, and malformed cookies.
- Syntax checks passed for Worker, UI and provider modules.
- Wrangler deployment dry-run succeeded. Final bundle: approximately 95 KiB raw / 27 KiB gzip. No remote state was deployed.
- `npm audit --omit=dev --json`: zero reported production dependency vulnerabilities; the application has no added production dependencies. This does not cover development tooling.
- Local-only HTTP mode enabled in the existing development configuration. Missing local admin/encryption material prepared without displaying secrets. Production credentials were preserved.
- Additive console migration applied to the existing local D1 SQLite file with a pre-migration local backup. Existing mail and identity records were preserved. The normal documented setup uses Wrangler migration commands.

## Blocked / not verified

- Native Miniflare/workerd integration (`npm run test:worker`) could not start: `listen EPERM: operation not permitted 127.0.0.1`. The test file remains available for an unrestricted local terminal.
- Live server/browser workflow and visual QA could not run because the environment prevents opening local ports. A static file inspection was also rejected by the browser's allowed-protocol policy. Browser security was not bypassed.
- npm registry upgrade failed with ENOTFOUND for registry.npmjs.org. Wrangler remains the installed 3.114.17 version within the original compatible dependency range. Upgrade to Wrangler 4 and rerun the build/native tests before production.
- Cloudflare account access, actual D1 binding ID, custom domain ownership/spelling, Access allowlist/MFA, provider credentials/DNS, signed live callbacks, inbound routing, cron execution, recovery rehearsal, and external monitoring were not verified.
- Provider traffic is mocked; passing tests do not verify real account quotas, regional endpoints, deliverability, or production provider API contracts.

## Run next on your machine

```bash
npm run dev
# Read the local admin token printed above the Wrangler startup output.
# Visit http://localhost:8787/admin using the same hostname throughout sign-in.
```

The local database upgrade was already applied in this workspace. For a fresh checkout follow README.md initialization steps. Before production, upgrade Wrangler, rerun `npm test`, `npm run build`, and `npm run test:worker`, then complete the launch gate in OPERATIONS.md.

## Browser form origin fix

Changed the panel Referrer-Policy from no-referrer to same-origin: no-referrer can make browser navigation form POSTs send Origin: null. Origin validation and session CSRF tokens remain enforced. Added regression coverage for the response policy, localhost form origins, and rejection of null/cross-site origins. npm test: 15 tests passing. Reload the sign-in page before resubmitting so the browser uses the new policy. Live browser verification remains pending.

## Profile and sender-name update

15 tests pass with added integration assertions for profile naming, valid PNG upload and protected retrieval, invalid SVG rejection, oversized upload rejection, CSRF/origin rejection, cross-subject isolation, preserve-image behavior, image removal, header rendering, and sender identity renaming. Worker dry-run build passes. Local D1 profile migration applied with a pre-change backup. Live browser visual validation and production deployment remain pending.

## WebP compression update

18 tests pass. Added real lossy, lossless and alpha WebP fixture validation, truncated-container and spoofed-MIME rejection, animated-flag rejection, browser-compressor logic with mocked Canvas showing 2048×1024 → 512×256 and quality fallback, and preservation of legacy profiles through the MIME-constraint migration. Worker build passes. Canvas encoding behavior in a real browser still requires live UI verification. Existing images are unchanged until re-uploaded.

## BIMI configuration

19 tests pass, including HTTPS URL validation and domain-specific record generation. BIMI panel and guide added; no certificate, public logo hosting, DNS publication, or real inbox verification is complete. SVG materialization failed.

## Local dispatch root-cause fix and live send verification

The provider and Access JWKS fetches used redirect:'error', which workerd rejects before sending a request. Replaced both with redirect:'manual'; non-success responses remain rejected and redirects are never followed. Ambiguous attempts now include a safe error-type code without logging raw exception text or credentials.

On 27 October 2026, one owner-authorized live message was sent through the running localhost Worker to aashish@neopathshala.com. Subject: NeoMail diagnostic: Worker redirect fix. Resend accepted in 1255 ms, provider ID 01a17cae-f870-72f2-8e23-7697917d2d23, local log ID 9911dc1e-1a42-4942-b7ed-26c5b94230b6. Status: Sent, not proven Delivered. A provider delivery lookup returned HTTP 401, so no inbox delivery assertion is made. Old ambiguous records were not resent or rewritten.

Native Miniflare integration now runs: 2 tests pass. Fixed its temporary module loading and made client test redirects manual so responses can be asserted correctly. All 19 application/crypto tests and the deployment dry-run build also pass. This supersedes earlier native-runtime startup blockers for this execution; live browser visual verification remains separate. Mailtrap uses the same corrected fetch path but no additional live Mailtrap message was sent.

## Separate Mailgun sandbox input

20 tests pass, including sandbox domain validation, postmaster identity creation, sandbox-only dispatch and unchanged normal routing. Worker dry-run build passes.
