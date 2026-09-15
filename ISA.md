---
task: "Animated shiny-black showcase site for Minister Tunji-Ojo"
slug: 20260915-092000_tunji-ojo-showcase
project: olubunmiOjo
effort: advanced
effort_source: classifier
phase: execute
progress: 0/44
mode: interactive
started: 2026-09-15T09:20:00-07:00
updated: 2026-09-15T10:20:00-07:00
---

## Problem

Josiah has written a vote-of-confidence letter on Nigeria's Minister of Interior, Dr. Olubunmi Tunji-Ojo, and wants a companion web experience that documents the man behind the office: his education from his teenage years through tertiary study, his background, his pre-politics and legislative career, and his record as Minister. Nothing exists yet — the project directory is empty, no research has been compiled, no images have been collected. Generic template output would be unacceptable: this is meant to stand as a government-grade showcase.

## Vision

A visitor opens the page onto a deep, glossy obsidian surface with a moving sheen, the Minister's portrait emerging from it, and immediately feels they are holding an official commemorative publication rather than a web template. As they scroll, the page moves through dated chapters — Origins, Education, The Professional, The Legislator, The Call to Serve, Minister of Interior, By the Numbers, Recognition, In His Words, Vote of Confidence, Sources — each arriving with a distinct, deliberate transition. A timeline rail on the edge shows where they are and what is still ahead, so they keep going. Every figure they read is real and traceable. Euphoric surprise: the reader reaches the Sources section and realises they read the entire thing without meaning to.

## Out of Scope

- No CMS, admin panel, authentication, or database. This is a static site.
- No fabricated content of any kind — no invented dates, figures, quotes, or the text of Josiah's letter (which was not supplied). A clearly marked slot exists for the letter.
- No partisan attack content, no comparisons with other politicians, no editorialising beyond what sources support.
- No third-party analytics, trackers, or cookie banners.
- No multi-language support in v1 (English only).
- No React/Vue/Svelte framework — vanilla TypeScript keeps the bundle lean and the design unconstrained.
- No deployment to a live domain in this run (build output is produced; hosting is a follow-up).

## Principles

- Chronology is the engine; animation is the vehicle. Every motion serves the story's forward pull.
- One accent colour, generous negative space, editorial typography — restraint reads as authority.
- Truth is a hard constraint: a claim without a source is a claim that does not ship.
- Native scrolling always works. Enhancement layers on top; it never traps the user.
- The design must be recognisably specific to this subject (Nigeria, Ondo, the Interior portfolio), not swappable to anyone.

## Constraints

- Toolchain: bun only (no npm/npx). Vite + vanilla TypeScript. All libraries installed via bun and bundled — no runtime CDN dependence.
- Animation stack: GSAP + ScrollTrigger for scroll-driven transitions, Lenis for smooth scroll, Three.js for the obsidian shader background. Fonts self-hosted via @fontsource packages.
- Content lives in typed data files under `src/content/` with a mandatory `source` field on every fact entry; layout code never hardcodes a fact.
- Images live in `public/images/` and are referenced by relative path only.
- Palette: near-black base with specular highlights (`#050505`–`#141414` range), single accent (Nigerian green `#008751` family) plus a warm gold for metallic sheen. No purple/violet, no neon.
- Typography: an editorial serif for display (Fraunces) and a humanist sans for body (Manrope). No Inter, no Roboto, no system-default look.
- `prefers-reduced-motion: reduce` must be honoured — content fully readable with motion disabled.
- `bun run build` must succeed with zero TypeScript errors.

## Goal

Ship a static Vite/TypeScript site in this directory that presents Dr. Olubunmi Tunji-Ojo's education, background, legislative career and ministerial record as dated, scroll-driven chapters on a glossy obsidian background, where every fact and figure traces to a cited source in the built page, every image is locally stored and attributed, the build passes cleanly, and Interceptor screenshots confirm the hero, at least four chapter transitions, the timeline rail, and the sources section render as designed on desktop and mobile widths.

## Criteria

### Research foundation

- [ ] ISC-1: `research/early-life-education.md` exists with ≥15 sourced facts (each with URL and confidence) covering birth, schooling, tertiary education and certifications.
- [ ] ISC-2: `research/legislative-career.md` exists with ≥15 sourced facts covering 2019 election, 9th Assembly committee work, bills, constituency projects, 2023 nomination and swearing-in.
- [ ] ISC-3: `research/ministerial-record.md` exists with a dated timeline of ≥25 sourced milestones from August 2023 to 2026.
- [ ] ISC-4: `research/images/MANIFEST.md` lists every downloaded image with source URL and attribution/licence note.
- [ ] ISC-5: ≥5 photographs of the Minister and ≥4 agency/national emblems exist in `public/images/` at ≥600px width (probe: `sips -g pixelWidth`).

### Project scaffold and build

- [ ] ISC-6: `package.json` exists with `vite`, `typescript`, `gsap`, `lenis`, `three` as dependencies installed via bun (`bun.lock` present).
- [ ] ISC-7: `bun run build` exits 0 and produces `dist/index.html`.
- [ ] ISC-8: `bunx tsc --noEmit` exits 0.
- [ ] ISC-9: `bun run dev` serves the page at a localhost port returning HTTP 200 (probe: `curl -I`).

### Content model integrity

- [ ] ISC-10: `src/content/` contains typed modules (profile, education, career, ministry, quotes, sources) exporting data conforming to a `Fact` type with a required `source: string` field.
- [ ] ISC-11: A build-time or test script (`bun scripts/check-sources.ts`) confirms every fact entry has a non-empty `source` URL and exits 0.
- [ ] ISC-12: Anti: no string "Lorem", "placeholder", "TODO", or "[insert" appears in `dist/` (probe: `rg -i` returns 0 matches).
- [ ] ISC-13: Anti: no fact, figure, or quote in `src/content/` lacks a corresponding entry in the research reports (probe: spot-check 10 random entries against research files; all traced).
- [ ] ISC-14: The vote-of-confidence section renders a clearly labelled slot (from `src/content/letter.ts`) and contains no invented letter text.

### Visual identity — shiny black

- [ ] ISC-15: Hero background is a Three.js WebGL plane with a fragment shader producing a moving specular sheen over near-black (probe: `rg "ShaderMaterial|RawShaderMaterial" src/`).
- [ ] ISC-16: WebGL failure falls back to a CSS radial/conic gradient that still reads as glossy black (probe: force `webgl` unavailable and screenshot).
- [ ] ISC-17: Page base colour is within `#050505`–`#141414` (probe: computed `background-color` of `body` via Interceptor JS).
- [ ] ISC-18: Anti: no purple/violet hues anywhere in CSS (probe: `rg -i "purple|violet|#7|#8.*f|#a.*f" src/styles` review returns no purple values).
- [ ] ISC-19: Display headings use Fraunces and body text uses Manrope (probe: computed `font-family` via Interceptor JS on `h1` and `p`).
- [ ] ISC-20: Anti: no emoji used as icons in the UI (probe: `rg -P "[\x{1F300}-\x{1FAFF}]" src/` returns 0).

### Structure and narrative

- [ ] ISC-21: The page contains these sections in order, each with `id`: hero, prologue, origins, education, professional, legislator, call-to-serve, ministry, numbers, recognition, words, letter, sources (probe: `rg 'id="' src/` list).
- [ ] ISC-22: Education chapter presents entries teenage → secondary → tertiary → postgraduate/certifications as a dated vertical timeline (probe: DOM query for `.edu-entry` count ≥ 4 with year labels).
- [ ] ISC-23: Ministry chapter groups achievements by agency (Ministry, NIS, NCoS, NSCDC, FFS) with ≥3 dated items each where research supports it (probe: DOM count per group).
- [ ] ISC-24: A persistent timeline/progress rail is visible on every section and highlights the active chapter (probe: Interceptor screenshot at 3 scroll positions shows rail with changing active state).
- [ ] ISC-25: A sources section renders every source URL used, grouped by chapter, as clickable links (probe: DOM count of `#sources a[href^="http"]` ≥ 30).
- [ ] ISC-26: An image-credits list renders attribution for every image in `public/images/` used on the page.

### Motion and transitions

- [ ] ISC-27: Lenis smooth scroll is initialised and synced to GSAP ticker (probe: `rg "new Lenis" src/` and `rg "ScrollTrigger.update" src/`).
- [ ] ISC-28: Each chapter entry triggers a distinct GSAP ScrollTrigger animation (heading line-split reveal, image parallax, or pinned scrub) — ≥5 distinct animation patterns exist (probe: `rg "ScrollTrigger.create|scrollTrigger:" src/` ≥ 8 and code review of variety).
- [ ] ISC-29: At least one pinned, scrub-driven section exists (e.g., the education timeline or ministry horizontal scroll) (probe: `rg "pin: true" src/`).
- [ ] ISC-30: Numeric stats in the numbers chapter count up on entry using real sourced figures (probe: `rg "snap|innerText" src/` around counter code + screenshot mid-animation).
- [ ] ISC-31: A preloader shows the name/brand and progress, then reveals the hero (probe: screenshot at t=0 and t=2s).
- [ ] ISC-32: `prefers-reduced-motion: reduce` disables ScrollTrigger tweens and Lenis, leaving all content visible (probe: Interceptor with reduced-motion emulation, screenshot shows all sections readable).
- [ ] ISC-33: Anti: no scroll-jacking — the native wheel/touch scroll always moves the page (probe: Interceptor `window.scrollTo` and wheel event moves `scrollY`).

### Responsiveness and performance

- [ ] ISC-34: Layout holds at 390px, 768px and 1440px widths without horizontal overflow (probe: Interceptor `document.documentElement.scrollWidth <= innerWidth` at each width).
- [ ] ISC-35: Images below the fold use `loading="lazy"` and are served as optimised JPEG/WebP ≤ 400KB each (probe: `rg 'loading="lazy"'` + `du -h public/images`).
- [ ] ISC-36: Built JS bundle (gzipped) ≤ 450KB total (probe: `bun run build` output sizes).
- [ ] ISC-37: Zero console errors on load in Interceptor (probe: console capture).
- [ ] ISC-38: All `<img>` elements have non-empty `alt` (probe: Interceptor JS count of `img:not([alt]), img[alt=""]` = 0 for content images).

### Experiential antecedents

- [ ] ISC-39: Antecedent: the hero renders the Minister's portrait with the sheen passing over it within the first 2 seconds after preloader — the "hook" (probe: screenshot at 2.5s shows portrait + heading).
- [ ] ISC-40: Antecedent: every chapter opens with a tracked-caps eyebrow (chapter number + years) above a serif display heading — consistent editorial rhythm (probe: DOM check every `section .eyebrow` exists).
- [ ] ISC-41: Antecedent: no chapter is a wall of text — each has ≥1 visual element (image, timeline, stat, or pull quote) (probe: DOM check per section for `img|.stat|.timeline|blockquote`).

### Verification and hygiene

- [ ] ISC-42: Interceptor screenshots of hero, education, ministry, numbers, and sources sections saved under `research/screenshots/` (probe: `ls`).
- [ ] ISC-43: A `README.md` documents how to run, build, update content, and add images.
- [ ] ISC-44: Anti: no remote image URLs in `src/` or `dist/` HTML (probe: `rg 'src="http' src/ dist/` returns 0).

## Test Strategy

```yaml
- isc: ISC-1..ISC-4
  type: file-existence + content-count
  check: research files present with sourced entries
  threshold: counts as stated
  tool: Read + rg -c "http" research/*.md

- isc: ISC-5
  type: asset-check
  check: images present and large enough
  threshold: ≥5 portraits, ≥4 emblems, width ≥600
  tool: ls public/images; sips -g pixelWidth

- isc: ISC-7, ISC-8
  type: build
  check: production build and typecheck
  threshold: exit 0
  tool: bun run build; bunx tsc --noEmit

- isc: ISC-11
  type: script
  check: every fact has a source
  threshold: exit 0
  tool: bun scripts/check-sources.ts

- isc: ISC-12, ISC-18, ISC-20, ISC-44
  type: negative-grep
  check: forbidden strings absent
  threshold: 0 matches
  tool: rg

- isc: ISC-15..ISC-41 (UI)
  type: live-probe
  check: rendered page at 390/768/1440, reduced-motion, console
  threshold: screenshots match intent, 0 console errors
  tool: Skill("Interceptor") + JS evaluation

- isc: ISC-36
  type: bundle-size
  check: gzipped JS total
  threshold: ≤ 450KB
  tool: bun run build output
```

## Features

```yaml
- name: Research
  description: Four parallel background agents — early life/education, legislative career, ministerial record, image sourcing — writing sourced reports and an image manifest
  satisfies: [ISC-1, ISC-2, ISC-3, ISC-4, ISC-5]
  depends_on: []
  parallelizable: true

- name: Scaffold
  description: Vite + vanilla TS project via bun; install gsap, lenis, three, @fontsource; base styles, tokens, typography
  satisfies: [ISC-6, ISC-7, ISC-8, ISC-9, ISC-17, ISC-19]
  depends_on: []
  parallelizable: true

- name: ContentModel
  description: Typed content modules with mandatory source field; check-sources script; letter slot
  satisfies: [ISC-10, ISC-11, ISC-12, ISC-13, ISC-14]
  depends_on: [Research, Scaffold]
  parallelizable: false

- name: ObsidianBackground
  description: Three.js shader plane with moving specular sheen; CSS fallback
  satisfies: [ISC-15, ISC-16]
  depends_on: [Scaffold]
  parallelizable: true

- name: Chapters
  description: Section markup for all 13 sections, eyebrows, editorial headings, education timeline, ministry agency groups, numbers, quotes, sources, credits
  satisfies: [ISC-21, ISC-22, ISC-23, ISC-25, ISC-26, ISC-40, ISC-41, ISC-38]
  depends_on: [ContentModel]
  parallelizable: false

- name: Motion
  description: Lenis + GSAP ScrollTrigger; preloader; line-split reveals; parallax; pinned scrub; counters; timeline rail; reduced-motion guard
  satisfies: [ISC-24, ISC-27, ISC-28, ISC-29, ISC-30, ISC-31, ISC-32, ISC-33, ISC-39]
  depends_on: [Chapters, ObsidianBackground]
  parallelizable: false

- name: Polish
  description: Responsive passes at 390/768/1440, image optimisation, lazy loading, bundle budget, README
  satisfies: [ISC-34, ISC-35, ISC-36, ISC-37, ISC-43, ISC-44]
  depends_on: [Motion]
  parallelizable: false

- name: Verify
  description: Interceptor screenshots and JS probes; save to research/screenshots
  satisfies: [ISC-42]
  depends_on: [Polish]
  parallelizable: false
```

## Decisions

- 2026-09-15 09:20: Classifier returned E3; honoured verbatim. The work is larger than a 10-minute budget but the tier's structural requirements (≥32 ISCs, ≥4 thinking capabilities, Forge) fit the task.
- 2026-09-15 09:20: Vanilla TypeScript over a framework — the design must be bespoke; a component framework adds nothing for a static narrative page and constrains layout freedom.
- 2026-09-15 09:20: Three.js chosen for the shiny-black surface over CSS-only gradients — a static gradient cannot read as "shiny"; a moving specular highlight can. CSS fallback preserved.
- 2026-09-15 09:20: The vote-of-confidence letter was referenced but not supplied. Reserved a slot; will not fabricate.
- 2026-09-15 09:20: Delegation floor (≥2) met via four research agents plus Forge at EXECUTE.
- 2026-09-15 10:15: ❌ Advisor tool unavailable — `Inference.ts --mode advisor` fails with "unknown option '--tools'" (CLI drift). Substituting the commitment-boundary second opinion with Forge's GPT-5.4 review at EXECUTE; recorded as a doctrine deviation, not a silent skip.
- 2026-09-15 10:40: ❌ Interceptor CLI not installed (`interceptor` absent from PATH and `~/Projects/interceptor` missing). Live-probe verification performed with the desktop app's built-in Chrome browser pane (real Chromium rendering, console + JS evaluation available). Recorded as a doctrine deviation; install Interceptor for future runs.
