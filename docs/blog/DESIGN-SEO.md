# Blog and design expansion — 22 September 2026

## References reviewed visually

- https://barackobama.com/ — full-bleed photography, restrained navigation and a clear video action. Keep our real, controllable silent film; no need to add a competing hero effect.
- https://www.elysee.fr/en/ — strong featured-story hierarchy, editorial cards and a visible search entry. Adapted as an asymmetric featured blog story with search and topic filtering.
- https://www.obama.org/about/administration/ — browsing the record by year and topic. Adapted into a four-year photographic journey with keyboard-accessible year links and a complete no-JavaScript fallback.

Our interpretation uses the existing charcoal, paper and green palette. No third-party site code, logos or brand assets were copied.

## Delivered

- `/blog/`, three original sourced explainers, related stories and home-page previews.
- Filter and keyword search with an announced result count and recovery from no results.
- Publication dates distinct from periods covered, reading time, source notes and editorial authorship.
- Sticky article contents, active section indication, reading progress and copy-link action.
- Full static HTML for all 20 pages; content and navigation remain accessible without JavaScript.
- Descriptive unique titles and summaries, canonical URLs, article-specific social images, BreadcrumbList, WebSite, Blog and BlogPosting structured data.
- Updated sitemap, explicit indexability, article lastmod dates and RSS at `/feed.xml`.
- Reduced-motion support; lower-page blog photographs load lazily.

## Publishing an article

Add a `BlogPost` to `src/editorial/blog.ts` with a unique slug, truthful publication date, credited photograph, original prose, period covered and source links. The renderer, route builder, sitemap, structured data and RSS all use this collection. Build checks reject duplicate slugs, broken citation indexes and uncredited photographs. Do not invent updates or date an old event as if it just happened.

Google does not guarantee indexing, rich results or ranking. Keep future articles useful and accurate; use Search Console to track indexed pages, queries and crawl issues. No keyword stuffing, hidden text or FAQ rich-result promises are used.

Guidance: https://developers.google.com/search/docs/fundamentals/seo-starter-guide and https://developers.google.com/search/docs/appearance/structured-data/article

## Validation

15 automated browser checks passed against the custom-domain root path. Coverage includes no-JavaScript content, metadata, schema, sitemap/RSS, filtering, keyboard navigation, narrow 320px layouts and existing hero-video behavior. Desktop and mobile layouts were visually reviewed in the in-app browser. CI also checks the GitHub project subpath before deployment.

Google Search Console domain ownership was verified on 22 September 2026 through a Cloudflare TXT record. Retain that record. The property covers the apex, subdomains and both protocols; the preferred public URLs remain HTTPS without www.
