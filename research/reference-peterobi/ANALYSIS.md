# Reference study: peterobi.online

Studied 21 September 2026 for the Tunji-Ojo redesign. Reference: https://peterobi.online/.

## Scope and method

Downloaded the sitemap and all 84 listed pages: 14 page types across English, Yoruba, Igbo, Hausa, Nigerian Pidgin and Arabic. Extracted headings, links, media references, section IDs and interaction attributes. The corrected inventory contains 538 unique link targets. Relative fragment links are resolved against the page they occur on. Every internal page and fragment resolves against the downloaded inventory; the separately linked testimonials PDF is outside the HTML sitemap.

Visually reviewed the 14 English page types, the five additional language homepages, the expanded navigation, gallery filtering and the home video lightbox. Inspected the shared stylesheet and interaction code to understand timing, fallbacks and mobile behavior. Translated inner pages were inspected structurally from HTML; they were not each manually watched through every animation. External destinations were inventoried and checked for HTTP reachability, not recursively audited as separate websites. A blocked request or timeout is not evidence that a destination is broken in an ordinary browser.

The external/file check covered 357 destinations: 311 returned HTTP 200, one 202, two 404, 36 returned 403, one 405, one 406 and five could not be verified within the timeout. These are recorded responses, not content-validation verdicts.

`inventory.json` contains the page-by-page structural audit. `links.json` contains all unique link targets. `internal-link-check.json` records internal resolution; `external-link-check.json` records best-effort HEAD results. Raw downloaded HTML/CSS/JS remains local research and is not part of the published implementation.

## Page-by-page findings and adaptation

| Reference page | Observed structure and behavior | Tunji-Ojo adaptation |
|---|---|---|
| Home | Fullscreen film hero, huge stacked name, introductory portrait, seven expanding chapter panels, counters, photo sequences, testimonials, campaign feature, generosity, news | Large field photograph, stacked name, biography introduction, six expanding chapter panels, dated counters, two film cards, quote image, journal and NANS letter |
| Story | Chronological narrative with anchors, photographs and extensive sources | Story page with origins, education and professional chronology |
| Governor | Record grouped by policy area, figures and citations | Interior record grouped by ministry, immigration, corrections, civil defence and fire service |
| Offices | Light editorial layout and dated offices | Elections, legislative career, appointment and swearing-in chronology |
| Honours | Oversized heading and recognition list | Sourced award chronology with presentation photograph |
| Giving | Light background, donation/service record and images | Community and constituency record, education, infrastructure and opportunities |
| Media | Category filters, photo grid, source captions, photo/film modal, previous/next | 18 credited photographs, six category filters, keyboard/swipe gallery, two Channels Television films |
| Words | Large quotations with attribution and context | Existing sourced quotations, retaining distinct speakers |
| Testimonials | Grid of endorsements, expandable text, social/report references, PDF | Authored NANS Southwest Zone D letter with clear attribution and print action |
| Nigeria decides 2027 | Election ticket, countdown and participation links | No invented campaign. Public service, ministry and community pages cover this subject’s actual record |
| FAQ | Grouped questions, jump links and reading guidance | Compact accessible native disclosures linking to relevant pages |
| Press | Short biography, media resources and sources | Copyable biography, credited media archive and official destinations |
| Privacy | Plain-language text about hosting, analytics and embeds | Accurate policy for this implementation: no analytics/account forms; click-to-load video; self-hosted fonts/images |
| Share | Copyable message and outgoing sharing options | Copy message and link, with clipboard failure selection fallback |

The redesign adds dedicated Sources and Journal pages. It ships 15 English pages. It does not claim to provide unreviewed translations or to reproduce Peter Obi’s political content.

## Visual system

- Reference uses Oswald for condensed uppercase display headings and Instrument Sans for body text, with near-black, warm white and green accents.
- Fixed black header, compact identity at left and a tracked menu action at right. Expanded navigation fills the viewport.
- Display type reaches approximately 200px on the desktop home hero; secondary headings range roughly 80–130px. Body copy stays restrained and readable.
- Generous section spacing and alternating dark/light surfaces distinguish chapters. Photographs carry much of the visual storytelling.
- Desktop chapter panels expand on hover and focus; photographs transition from monochrome to colour. On smaller screens, panels become horizontally browsable cards.
- Media pages rely on asymmetry and varied photo ratios, restrained category pills and obvious open/play affordances.
- Film and photograph overlays use a large viewing area with a caption/source column, close action, index and next/previous controls.

The new site uses independently written templates, CSS and interactions. Reference source code and media are not shipped.

## Motion and interaction

Observed: slow hero film playback, fade/translate section entry, eased numerical counters, grayscale-to-colour hover, expanding chapter panels, clip-reveal menu, smooth scrolling and click-to-play video. Reference code includes motion reduction, data-saving behavior and offscreen video handling.

Implemented: hero image entrance, type entrance, viewport-triggered reveals, 1.4-second eased counters, expanding chapter cards, focus/hover colour treatment, menu reveal, native smooth anchor scrolling and browser-supported cross-document view transitions. Native scrolling remains available. Reduced-motion preferences disable animations, transitions and smooth scrolling. There is no content-blocking preloader. All production pages are prerendered and remain readable without JavaScript.

Films load the privacy-enhanced YouTube player only after a user chooses to watch. Closing the dialog removes the iframe and stops playback. Photographs support arrow keys, swipe, previous/next buttons, Escape and focus restoration. The fullscreen navigation uses a native modal dialog with browser focus containment.

The hero uses a genuine official field photograph rather than an unrelated video clip. A downloaded National Assembly hearing clip was rejected after visual inspection because the visible speaker was not Tunji-Ojo. No unrelated footage is presented as his own. External video playback remains subject to the publisher’s availability and browser/network restrictions; original recording links are always provided.

## Corrections and content handling

- Preserved the existing 102 sourced content entries and the full user-provided letter.
- Kept the letter’s assessments attributed to its authors, separate from the site’s source-linked record.
- Used the actual 2024 retreat article photograph for the 2024 journal entry, avoiding a misleading 2026 image.
- Added six downloaded images from the official bto.ng media archive, with stable source URLs and visually checked descriptions.
- Added two verified Channels Television video IDs from the iframe URLs of the original broadcaster’s articles, plus locally hosted provider thumbnails.
- Created optimized WebP image derivatives and self-hosted the two typefaces.
- Kept the independent-profile identity visible in the footer, FAQ and source page.
- No external sharing messages were sent and no unsupported candidacy, endorsements or campaign actions were introduced.

## Verification

Automated browser checks cover all 15 pages without JavaScript, source metadata, local images, direct subpath routes, modal focus, gallery filters and keyboard wrapping, lazy video loading/unloading, all-page mobile overflow at 320px, reduced motion, FAQ expansion and the complete attributed letter. Video lifecycle tests use a fixture and do not claim to verify the third-party broadcast itself. Live visual checks are separate and include desktop/mobile homepage, media archive, photo dialog and embedded player.
