# Olubunmi Tunji-Ojo — A Life in Service

A source-linked editorial website covering Olubunmi Tunji-Ojo’s life and public record. This independent profile is not an official government website.

[Live website](https://olubunmitunjiojo.com/) · [Deployment checks](https://github.com/Billioncodes001/tunji-ojo/actions)

## The website

Sixteen prerendered pages cover the story, public office, Interior record, community, honours, media, quotations, official journal, the NANS Southwest letter, FAQ, press resources, sources, privacy, sharing and contact channels. The interface uses bold condensed typography, dark and light editorial sections, expanding photo chapters, counters, a fullscreen menu and an accessible media gallery.

The media archive contains 18 credited photographs and four films from Channels Television, TVC News and Olumide Mikel Pictures. An 8.5-second silent hero loop is served locally in WebM and MP4 at native 1920×1080 on desktop, with a separately framed 720×1080 portrait version for phones, with a pause control and a still-image fallback. Images and fonts are also local; YouTube connects only when a visitor opens a full report. Closing the player removes the embed. Each film provides links to the original recording and broadcaster’s reporting.

## Develop and build

```bash
bun install --frozen-lockfile
bun run dev
bun run check
bun run build
bun run preview
```

The build checks source attribution, type-checks, bundles assets and prerenders every route. Production content and navigation links work without JavaScript. Interactive media controls need JavaScript.

| Path | Purpose |
|---|---|
| `src/content/` | Sourced facts, chronologies, quotations and attributed letter |
| `src/editorial/render.ts` | Shared page templates and route definitions |
| `src/editorial/media.ts` | Selected photographs, new image credits and video provenance |
| `src/editorial/site.css` | Responsive visual system and motion |
| `src/editorial/hero.ts` | Preference-aware video loading, playback and pause lifecycle |
| `src/main.ts` | Menu, media dialogs, filtering, copying and progressive animation |
| `scripts/prerender.ts` | Static route pages, page metadata, sitemap and 404 page |
| `scripts/check-sources.ts` | Attribution and local media checks |
| `public/images/` | Original-sized assets, WebP derivatives and video thumbnails |
| `research/reference-peterobi/ANALYSIS.md` | Reference study, page mapping and implementation decisions |
| `tests/*.spec.ts` | Browser regression checks |

Earlier rendering, motion and WebGL modules remain in the repository to preserve existing work; the redesigned entry point does not import them.

## Content updates

Edit the appropriate `src/content/` file, keeping the original source URL. Add selected media and credits in `src/editorial/media.ts`, and place an optimized WebP at `public/images/optimized/<id>.webp`. Run `bun run check` and the browser checks. Source presence is not independent verification of a publisher’s claims or a guarantee that an external link remains available.

## Publishing platform

The `cms/` application adds Payload CMS, a server-rendered journal, searchable topic and author archives, staff accounts, draft review, revision history and a credited media library. Seven sourced articles are included. Administrators manage the publishing team; editors publish; writers prepare their own drafts. Reader registration is disabled.

See [the newsroom guide](cms/README.md) for setup, publishing, permission tests, database migrations and recovery. Run `bun run cms:build` to prepare the Cloudflare Worker, or `bun run cms:dev` after local setup. The root Vite build remains the static fallback.

Deployment status, 22 September 2026: the production domain now serves the Cloudflare Worker. D1 stores seven published articles and the publishing-team accounts; R2 stores uploads. The journal is at `/blog/` and the newsroom is at `/admin/`. The previous GitHub Pages build remains available as an origin fallback. Account email uses the verified newsroom sending subdomain; inbox delivery must be confirmed during owner onboarding.

## Accessibility and verification

Native dialog focus containment, Escape dismissal and focus restoration support keyboard navigation. Gallery arrows and swipe work within the selected category. Reduced-motion and data-saving preferences prevent automatic hero downloads; visitors can explicitly play the film. Reduced motion disables other movement and counters. No preloader hides the record while scripts load.

```bash
bunx playwright install chromium
bun run test:e2e
```

Tests build under `/tunji-ojo/` and cover all pages without JavaScript, direct routes, page metadata, image paths, menu focus, gallery navigation, lazy video loading, mobile overflow, reduced motion, FAQs and the letter. To use an existing Chromium installation, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to its executable path. Run the same suite with `TEST_SITE_URL=https://example.com/` to verify a domain served at the root. Embedded-video tests mock the player to verify lifecycle and privacy; publisher playback must be checked separately.

## Deployment

The Cloudflare Worker is the production application. Deploy application-code changes with the commands in `cms/README.md`; publishing articles in the CMS takes effect immediately. `check-cms.yml` validates the Worker build without production credentials. The existing GitHub Pages workflow continues to test and build the static fallback on pushes to `main`. Pull requests run checks without deploying. The `SITE_URL` repository variable controls the production address, including its path. It is set to `https://olubunmitunjiojo.com/`. For a future domain change, update this variable; asset paths, canonical URLs, social cards, structured data, sharing text, robots.txt and sitemap update together. See `docs/launch/DOMAIN.md` for the launch sequence. Do not change the production address until domain ownership and DNS are ready.

All photographs and third-party packages retain their owners’ rights and licences. The letter represents its attributed authors’ assessment. The public record is dated editorial content, not live government-service data.
