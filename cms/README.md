# Tunji-Ojo Newsroom

Payload 3 / Next.js publishing application, deployed through OpenNext to Cloudflare Workers. D1 stores content, accounts and revisions; private R2 storage serves uploaded photographs through Payload. The public site renders complete HTML for every request, including search, archives, articles, sitemap and RSS. Publishing a story does not require a Git commit or rebuild.

## Editorial access

| Role | Articles | Accounts |
| --- | --- | --- |
| Administrator | All drafts, review, publishing and revisions | Create and edit team members, assign roles, disable access |
| Editor | All drafts, review, publishing, categories, bylines and media | Own profile |
| Writer | Create and edit own unpublished drafts, submit for review, upload credited media | Own profile |

Reader registration is disabled. Disabled staff cannot use previously issued tokens. Private ownership, editor notes, review state and modification attribution are removed from public API responses. Article revisions preserve the previous published version until an editor publishes again. Public pages and API reads explicitly use access controls; previews require a staff session. An administrator cannot demote or disable their own administrator account.

## Publishing

1. Sign in at `/admin/`.
2. Open Articles and create a draft. Add title, permanent slug, summary, category and public byline.
3. Choose an archive photograph or upload a JPEG, PNG or WebP (maximum 8 MB). Add a description, source, credit and permission/licence. Uploaded images are public assets; do not upload confidential material.
4. Add the period covered, takeaway, rich-text sections and source list. Section source numbers refer to the numbered source list, starting at 1.
5. Set review state to Ready for review. Private editorial notes are visible only to the team.
6. An editor checks the sources, uses Preview and publishes. The article, archive, RSS and sitemap update immediately.
7. For later changes, save a draft while the published version remains visible. Add a public correction note for substantive corrections. Published slugs are locked to protect inbound links. To withdraw a story, use Unpublish; public requests then return 404.

The public byline is separate from a staff login. Do not publish staff email addresses as author profiles. Historical event dates are separate from the publication date. The publication is an independent profile, not an authorised government website.

## Local setup

Install root dependencies and `cms/` dependencies with Bun. Copy `.env.example` to `.env` and generate a random PAYLOAD_SECRET. Secrets, local database files and account setup links are gitignored.

From the repository root:

```sh
SITE_URL=https://olubunmitunjiojo.com/ bun run build
cd cms
bun run prepare:assets
bun run db:migrate
OWNER_EMAIL=your-email@example.com bun run seed
bun run dev
```

Use migrations in development and production; automatic schema pushing is disabled. `scripts/seed.ts` is idempotent: it inserts missing source articles, categories, the editorial desk and the named owner without replacing edits. It generates an unknown random initial password. Set `CREATE_OWNER_SETUP=1` and `SETUP_SITE_URL=http://localhost:3000` to write a private 24-hour owner password-reset URL to `.owner-setup-url`. Share that link only with the owner. Never commit it.

## Verification

With the local server running:

```sh
bun run test:setup
bun run test
bun run check
```

These API integration tests run only against localhost. They cover registration denial, ownership, publishing permissions, role escalation, account disablement, preservation of a live article during revision, private field and revision protection, archives/search/SEO and authenticated R2 image uploads. Publishing tests withdraw their local test article afterwards. Test credentials are stored only in `.test-accounts.json`.

The root `bun run test:e2e` covers the static fallback, video playback, keyboard navigation, articles without JavaScript, mobile overflow and search metadata. Local review also checks the actual server-rendered journal and CMS sign-in.

## Production

Resources:

- Worker: `tunji-ojo-newsroom`
- D1: `tunji-ojo-newsroom`, ID `0c20de95-c70a-49b7-9352-7e07d02c63d2`
- R2: `tunji-ojo-newsroom-media` (no public bucket endpoint)
- Account emails: `accounts@newsroom.olubunmitunjiojo.com`, via Cloudflare Email Service

The Workers paid plan and R2 already exist in the account. No plan upgrade was purchased. Production contains seven source articles and one owner account. No local test accounts are seeded remotely.

Deployed on 22 September 2026 after the owner explicitly approved the Wrangler permission expansion. All 31 sitemap routes returned HTTP 200. Public staff and revision endpoints and account registration returned 403; published API responses omitted private editorial fields. The `/admin/login/` page renders successfully. Apex and www traffic now reaches the Worker through proxied DNS records. The Worker redirects www to the HTTPS apex while preserving the path and query; its workers.dev address is excluded from indexing. Version preview URLs are disabled.

From the root, `bun run cms:build` builds public assets and the Worker. From `cms/`, `bun run db:migrate:remote` applies pending production migrations. Set a strong persistent `PAYLOAD_SECRET` with `wrangler secret put PAYLOAD_SECRET` and deploy with `bun run deploy`. Do not use a new secret on each release: it would invalidate sessions. The domain routes are declared in `wrangler.jsonc`. Keep the four apex A records and the www CNAME proxied. `worker.js` wraps the generated entry point for canonical redirects and preview indexing protection. The private `.env.production.local` file preserves the production environment locally; it is excluded from Git. Never copy it into `public/` or a build artifact.

Database maintenance uses a temporary `.remote.wrangler.json`, generated by `scripts/remote-config.ts`. `CMS_REMOTE=1` is the explicit switch for remote D1 access. The remote config does not expose email bindings. Never point test fixtures at production.

Before a schema change, export D1 to a secure location using `wrangler d1 export tunji-ojo-newsroom --remote --output <private-backup.sql>` and use Cloudflare D1 recovery if needed. These exports contain private user and authentication data: never commit them. Keep originals of licensed photographs. Retain the previous Worker deployment for rollback. Restoring code alone does not roll back a database schema.

## Boundaries

This is a complete CMS foundation for a publishing team. It does not claim the operational scale or staffing of TIME or Forbes. Scheduled publication, enterprise SSO, subscriptions and reader accounts are not enabled. Editors should publish when a story is ready; future publication dates are rejected. Credentials require at least 16 characters, login attempts are limited, and reset links expire. The owner still needs to choose their password. Recovery email inbox delivery must be confirmed during that onboarding; deployment alone does not verify delivery.

## Worker password compatibility

`worker.js` installs the scoped PBKDF2 compatibility adapter in `src/lib/workers-crypto.ts`. Workers native crypto rejects Payload 3.90’s 600,000 iterations. The adapter uses the locked RustCrypto PBKDF2 implementation compiled to WASM (see `crypto/README.md`) for exactly Payload’s SHA-256 / 600,000-iteration / 32-byte string-input format, preserving Node-compatible hashes and salt encoding. All other operations, including legacy password hashes, keep native crypto. Do not reduce the iteration count or change the stored hash prefix. CI compares both ordinary and Unicode passwords against Node crypto.

On 22 September 2026 the live reset flow was checked with a temporary diagnostic account: minimum length, invalid token, successful reset, authenticated session, single-use token, fresh login and wrong-password rejection. The diagnostic account was removed afterward. The owner’s password remains private and is entered only by the owner.
