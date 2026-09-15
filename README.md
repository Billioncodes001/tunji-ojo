# Dr. Olubunmi Tunji-Ojo — Showcase

A static, scroll-driven record of Nigeria's Minister of Interior: origins, education, professional career, legislative years, and the ministerial record from August 2023 onward. Every fact carries a source URL; every image is stored locally and credited.

## Run

```bash
bun install
bun run dev        # http://localhost:5173
bun run build      # runs the source check + typecheck, then builds to dist/
bun run preview    # serve the production build
```

## Structure

| Path | Purpose |
|---|---|
| `src/content/*.ts` | All facts, dates, figures and quotes. Each entry has a required `source` URL. |
| `src/content/letter.ts` | The vote-of-confidence letter. Add paragraphs and the signatory here. |
| `src/content/images.ts` | Image credits rendered in the Sources chapter. |
| `src/render.ts` | Builds the page from content; numbers footnotes in reading order. |
| `src/gl/obsidian.ts` | Three.js fragment shader — the moving specular sheen behind the page. CSS fallback in `base.css`. |
| `src/motion/` | Lenis smooth scroll + GSAP ScrollTrigger: preloader, hero intro, word reveals, figure wipes, parallax, education timeline, pinned horizontal ministry ledger, counters, chapter rail. |
| `public/images/` | Optimised images (≤1800px). Originals and provenance in `research/images/MANIFEST.md`. |
| `research/` | Fact-check reports with confidence ratings, and the image manifest. |
| `scripts/check-sources.ts` | Fails the build if any fact or image credit lacks a source URL. |

## Updating content

1. Edit the relevant file in `src/content/`. Keep `source` pointing at the page where the fact was verified.
2. Run `bun run check`.
3. For new images: place the optimised file in `public/images/`, add a credit in `src/content/images.ts`, and note provenance in `research/images/MANIFEST.md`.

## Accessibility

`prefers-reduced-motion: reduce` disables smooth scrolling and all scroll animations; the page renders fully static. Native scrolling is never blocked.
