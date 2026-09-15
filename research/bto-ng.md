# bto.ng — Site Research Report

**Site:** https://bto.ng — "Hon. Olubunmi Tunji-Ojo | Minister of Interior, Federal Republic of Nigeria"
**Researched:** 2026-09-15
**Method:** curl with Chrome UA (-L), WordPress REST API (`/wp-json/wp/v2/*`), WordPress core sitemap (`/wp-sitemap.xml`), RSS feed (`/feed/`).
**Platform:** WordPress (tagDiv Newspaper theme, "Coaching Pro" demo layout; Contact Form 7). Author account: "BTO Media" (`/author/admin/`). Site tagline via REST: "Minister of Interior, Federal Republic of Nigeria".

**Reachability during research:** Homepage, /about/, /contact/, category pages, single posts, REST API, sitemap and feed all returned HTTP 200. Only `/rep/` ("As A Rep") returned HTTP 500 on every attempt (3 retries with pauses) — see Section 5. `/post-sitemap.xml`, `/page-sitemap.xml`, `/sitemap_index.xml` are 404 (site uses core `/wp-sitemap.xml`, not Yoast). The `/wp-json/wp/v2/menus` and `/menu-items` endpoints return 401 (not public).

> Important caveat on scope: the site is very thin. It contains exactly **4 news posts**, all published on **2024-06-25**, and nothing has been posted since (REST `X-WP-Total: 4`; feed has 4 items; sitemap lists 4 posts). The homepage was last modified 2025-01-08, /about/ and /contact/ on 2024-06-25. So the "20–30 most recent posts" request cannot be met from this site — only 4 exist.

---

## 1. Social links

### Linked on bto.ng (exact hrefs as found in the HTML)

| Platform | Handle | URL as linked on site | Where it appears | Status |
|---|---|---|---|---|
| X (Twitter) | **@BTOofficial** | `https://x.com/BTOofficial` | Header button "FOLLOW ME ON X" / "FOLLOW ON X", hero button "FOLLOW ME", "See more activities" button, homepage tweet embeds, post author link | Working absolute link |
| X (Twitter) | @BTOofficial | `href="BTOofficial"` (relative, **broken**) | Header/footer social icon row (title="X", class `tdm-social-item`) | Resolves to `https://bto.ng/BTOofficial` → 404 (theme misconfiguration: handle entered without the platform URL) |
| Facebook | **OlubunmiTunjiOjoBTO** | `href="OlubunmiTunjiOjoBTO"` (relative, **broken**) | Header/footer social icon row (title="Facebook", class `tdm-social-item`), and "Follow me: Facebook" on /contact/ | Resolves to `https://bto.ng/OlubunmiTunjiOjoBTO` → 404. The intended target is evidently a Facebook page/username `OlubunmiTunjiOjoBTO` (i.e. `https://www.facebook.com/OlubunmiTunjiOjoBTO`), but the site itself never emits a facebook.com URL — I have not verified that Facebook page exists. |

**Not linked anywhere on bto.ng:** Instagram, YouTube, LinkedIn, TikTok, Telegram, WhatsApp. No `mailto:` or `tel:` links. (The strings "linkedin"/"twitter"/"facebook" that appear in the homepage source are only theme CSS selectors, not links.)

### Other X accounts referenced in content (not BTO's own)
- `https://x.com/officialABAT` — President Bola Ahmed Tinubu; tagged as "@officialABAT" in every post.
- `https://x.com/hashtag/RenewedHope` — the #RenewedHope hashtag, linked in 3 of 4 posts.

### Ministry of Interior handles
**None.** bto.ng does not link to any Federal Ministry of Interior website or social account, nor to NIS / NSCDC / NCoS / FFS accounts (those agencies are only mentioned by name in the "Top Management Retreat" post).

---

## 2. About / profile details

Source pages: `https://bto.ng/about/` (page id 58, modified 2024-06-25) and homepage `https://bto.ng/` (page id 60, modified 2025-01-08).

### Name as styled on site
"Hon. Olubunmi Tunji-Ojo" / "Hon. (Dr) Olubunmi Tunji-Ojo" / "Hon. BTO". Footer: "Honorable Olubunmi Tunji Ojo". Site author account: "BTO Media".

### Biography text (as published on /about/)
- Described as "a distinguished business management and consulting executive with over seventeen years of remarkable experience in both the public and private sectors, specializing in project and strategic management."
- Became CEO of **Matrix IT Solutions Limited** ("Nigeria's leading indigenous consulting firm") at age 24.
- Sector expertise listed: Oil and Gas, Information Technology, Agriculture, Research, Finance, Management Consultancy, Manufacturing; also policy-making and development.
- Education: began Electrical and Electronics Engineering at **Obafemi Awolowo University, Ile-Ife**; transferred in third year to the **University of North London (now London Metropolitan University)**, Electronics and Communication Engineering, graduated **2005**; **MSc Digital Communication and Networking**, same institution, **2006**.
- Claims **eighteen professional qualifications**; "among the first Certified Ethical Hackers from the esteemed Royal Britannia Training Academy in the United Kingdom" — achieved before his 24th birthday.

### Homepage "cards"
- **Appointment:** "In August 2023, Dr. Olubunmi Tunji-Ojo appointed Nigerian Minister of Interior by President Bola Ahmed Tinubu, recognized for dedication, accomplishments, and visionary leadership."
- **Recognitions:** "Honorary Doctorate from Joseph Ayo Babalola University, Sir Ahmadu Bello Platinum Leadership Award, and Kwame Nkrumah Leadership Award."
- **Reelection:** "On February 26, Dr. Olubunmi Tunji-Ojo was re-elected as the federal lawmaker representing Akoko North East and North West Federal Constituency with 51,539 votes, totaling 84.5% of valid votes." (Year not stated on the page; this is the Feb 2023 House of Reps election.)
- **Testimonial:** "Tunji-Ojo's commitment to public service and nation-building is a beacon of hope for a brighter future, illuminating the path to progress for generations to come." — Femi Salako, Publisher, Triangle News International.

### Mottos, slogans, taglines found on the site
- **"Don't judge us by what you hear. Judge us by what you see."** — displayed twice on the homepage as a pull-quote (attached to the "Passport Backlog Cleared" tweet card, tagged #PoliticsToday).
- **"Nigeria first, Nigeria second, and Nigeria ALWAYS."** — "Our creed will always remain…" (closing line of the "2023 Personality of the Year" post).
- **"Join Me In Renewing Hope Together"** — homepage section heading; body copy: "Renewing Hope Together: Join the Journey to Community Development. Every step counts towards realizing our shared vision… Start your journey with me today!"
- **#RenewedHope** — used in every post as the government's agenda tag ("the #RenewedHope government of President @officialABAT").
- **"Shining the Spotlight"** / "Celebrating the Hero" — homepage section about "Hon. BTO crucial roles in national development".
- **"Communities Development As A Rep"** — homepage section: "I am committed to public services — From effective representation to call to national duties".
- **"Connect with Hon. Minister"** — newsletter block: "Subscribe to the newsletter and get updates from Hon. Olubunmi Tunji Ojo and his team straight to your Inbox."
- The phrase "Renewed Hope with BTO" does **not** appear anywhere on the site.

### Core values (listed on /about/ under "My Core Values")
1. Do good
2. Change Lives
3. Improve
4. Never stop learning
5. Be grateful
6. Always give back

### Foundation / initiatives
No foundation, NGO, or named initiative is mentioned on the site. The only "initiatives" referenced are ministry programmes described in the posts (e-gates at airports, passport backlog clearance, Kuje Correctional Centre renovation, top management retreat).

### Contact details
- **Email:** `contact@bto.ng` (only address on the site, on /contact/).
- **Contact form:** /contact/ — Contact Form 7 shortcode is **broken** (renders as literal text `[contact-form-7 id="771" title="Contact form 1"]`), so the form does not work.
- **Office address:** none published. **Phone:** none published. **Press contact:** none published (no separate press/media contact).
- Copyright line: "Copyright © 2025 Honorable Olubunmi Tunji Ojo. All Rights Reserved."

---

## 3. News posts (all posts on the site — only 4 exist)

Newest first. All are in categories **Activities** (id 7, child of "Recent Activities" id 6) and **Featured** (id 2). No tags. Author: BTO Media. Featured images resolved via `/wp-json/wp/v2/media`.

| # | Date (ISO) | Title | URL | Category | Featured image |
|---|---|---|---|---|---|
| 1 | 2024-06-25T11:14:17 | e-gates Inspection | https://bto.ng/2024/06/25/e-gates-inspection/ | Activities, Featured | https://bto.ng/wp-content/uploads/2024/06/egate.jpeg |
| 2 | 2024-06-25T11:08:23 | 2023 Personality of the Year | https://bto.ng/2024/06/25/2023-personality-of-the-year/ | Activities, Featured | https://bto.ng/wp-content/uploads/2024/06/GOaw2nWWAAAMiyl-1.jpeg |
| 3 | 2024-06-25T11:04:26 | Top Management Retreat | https://bto.ng/2024/06/25/top-management-retreat/ | Activities, Featured | https://bto.ng/wp-content/uploads/2024/06/GOmTa1xXQAAZJ_R.jpeg |
| 4 | 2024-06-25T10:52:36 | NEW FACE OF THE KUJE CORRECTIONAL CENTRE | https://bto.ng/2024/06/25/new-face-of-the-kuje-correctional-centre/ | Activities, Featured | https://bto.ng/wp-content/uploads/2024/06/GQDh6YiXMAAldUz.jpeg |

(Image filenames like `GOaw2nWWAAAMiyl`, `GOmTa1xXQAAZJ_R`, `GQDh6YiXMAAldUz` are X/Twitter media IDs — the posts are reposted tweets.)

### One-sentence excerpts (plain text)

1. **e-gates Inspection** (post id 278) — Inspection in Lagos of 21 electronic gates being installed at Murtala Mohammed International Airport Terminal 2 (Wings D and E) and the private terminal; Abuja's installation is complete and awaiting commissioning, with Kano, Port Harcourt and Enugu to follow, all linked to a new command and control centre in Abuja.
2. **2023 Personality of the Year** (id 275) — Received Vanguard Newspaper's 2023 Personality of the Year award in Lagos, crediting the #RenewedHope government's first year of innovation; closes with "Our creed will always remain Nigeria first, Nigeria second, and Nigeria ALWAYS."
3. **Top Management Retreat** (id 272) — The Ministry held a weekend top management retreat for the ministry and its agencies (NSCDC, NIS, NCoS, FFS, CDCFIB) with guests from EFCC, ICPC, CCB and ONSA, to refine operations in line with the President's #RenewedHope agenda of building strong institutions.
4. **NEW FACE OF THE KUJE CORRECTIONAL CENTRE** (id 266) — Thanks President Tinubu for commitment to the welfare of vulnerable citizens, noting that extensive renovations have brought the Kuje Correctional Centre up to international standards.

---

## 4. Speeches, statements, and "in his words" quotes on the site

There is no dedicated speeches/statements section. The following first-person statements are published (all on 2024-06-25 unless noted; the homepage tweet cards link to the original X posts):

1. **"Don't judge us by what you hear. Judge us by what you see."** — pull-quote on homepage, paired with the "Passport Backlog Cleared" card. Linked source: https://x.com/BTOofficial/status/1801688371040833918 (tweet dated ~2024-06-14 by ID). Homepage: https://bto.ng/
2. **"Today, we do not have a single backlog. In fact, we have about 97,000 passports across Nigeria that have been printed and waiting to be collected."** — "PASSPORT BACKLOG CLEARED" card, tagged #PoliticsToday. Linked source: https://x.com/BTOofficial/status/1801688371040833918. Homepage: https://bto.ng/
3. **"Our creed will always remain Nigeria first, Nigeria second, and Nigeria ALWAYS."** — 2024-06-25, https://bto.ng/2024/06/25/2023-personality-of-the-year/ ; homepage "Personality of the Year Award" card links https://x.com/BTOofficial/status/1794315973094170971 (~2024-05-25).
4. **"We owe President @officialABAT GCFR immeasurable gratitude for his unwavering commitment to the welfare of all citizens, including the most vulnerable… The extensive renovations have elevated the facility to meet international standards."** — 2024-06-25, https://bto.ng/2024/06/25/new-face-of-the-kuje-correctional-centre/ ; homepage card links https://x.com/BTOofficial/status/1798992469683785940 (~2024-06-07).
5. **"The #RenewedHope government under President @officialABAT (GCFR) recognizes that technology is designed to enhance services and processes, particularly in border security."** — 2024-06-25, https://bto.ng/2024/06/25/e-gates-inspection/ (on e-gates as "a strategic border management solution [that] will… enhance internal security while also providing travelers with ease of passage and comfort").
6. **"The goal was to refine operations and strategize in line with President @officialABAT's #RenewedHope agenda of building strong institutions that Nigerians can be proud of."** — 2024-06-25, https://bto.ng/2024/06/25/top-management-retreat/
7. **"I am committed to public services — From effective representation to call to national duties"** — homepage "Communities Development As A Rep" section, https://bto.ng/ (links to the broken /rep app).
8. **"Renewing Hope Together: Join the Journey to Community Development. Every step counts towards realizing our shared vision… Start your journey with me today!"** — homepage, https://bto.ng/

---

## 5. Site structure

### Main navigation (header menu; same in mobile modal)
| Label | Target | Notes |
|---|---|---|
| Home | https://bto.ng/ | Landing page |
| About | https://bto.ng/about/ | Bio + core values |
| Do You Know? | https://bto.ng/category/recent-activities/ | Custom menu link to the "Recent Activities" category archive (lists the 4 posts) |
| Contact | https://bto.ng/contact/ | Email + (broken) form |
| As A Rep | https://bto.ng/rep | **HTTP 500** — separate CodeIgniter PHP app at `/rep/` (not WordPress); error page exposes `mysqli_sql_exception: Access denied for user 'bto_repdata'@'localhost'`. Unreachable after 3 retries. Presumably his constituency/House-of-Reps record. |
| (button) FOLLOW ME ON X | https://x.com/BTOofficial | Header CTA |

### Homepage sections (top to bottom)
1. Hero: "Minister of Interior, Federal Republic of Nigeria — Hon. Olubunmi Tunji-Ojo" + bio blurb; buttons LEARN MORE (/about/) and FOLLOW ME (X).
2. Three cards: Appointment / Recognitions / Reelection.
3. "Join Me In Renewing Hope Together" banner.
4. Three tweet cards with "Explore" buttons: Personality of the Year Award; Correctional Centre New Face; Passport Backlog Cleared (each links to an x.com status).
5. Pull-quote "Don't judge us by what you hear. Judge us by what you see."
6. Bio excerpt + "More about me" (/about/).
7. "Shining the Spotlight" / "Communities Development As A Rep" (button → /rep).
8. Testimonial (Femi Salako).
9. "Latest from Events" — 4 posts; "See more activities" button (→ X profile, not the archive).
10. "Ask me anything" button (→ /contact/).
11. Footer: "Connect with Hon. Minister" newsletter, copyright, "Resources / Articles" (3 latest posts), "Socials" (Facebook, X icon links — both broken relative hrefs).

### Categories
- Featured (id 2, slug `featured`) — 4 posts — https://bto.ng/category/featured/
- Recent Activities (id 6, slug `recent-activities`, parent) — 0 direct posts — https://bto.ng/category/recent-activities/
  - Activities (id 7, slug `activities`) — 4 posts — https://bto.ng/category/recent-activities/activities/
- Uncategorized (id 1) — 0 posts

### Other pages in sitemap (theme demo leftovers, publicly reachable, HTTP 200)
`/sample-page/`, `/courses/`, `/megamenu-courses/`, `/mobile-menu-modal/`, `/pricing/`, `/checkout-coaching_pro/`, `/my-account-coaching_pro/`, `/login-register-coaching_pro/`, plus 17 `tdb_templates` (tagDiv Cloud Library templates). These are unrelated to BTO content.

### Machine-readable endpoints (all working)
- REST posts: https://bto.ng/wp-json/wp/v2/posts
- REST categories: https://bto.ng/wp-json/wp/v2/categories
- REST media: https://bto.ng/wp-json/wp/v2/media
- Sitemap index: https://bto.ng/wp-sitemap.xml (posts: `/wp-sitemap-posts-post-1.xml`, pages: `/wp-sitemap-posts-page-1.xml`)
- RSS: https://bto.ng/feed/ (4 items)
- robots.txt: allows all except /wp-admin/

---

## Summary of gaps / things the site does not provide
- Only 4 posts, all dated 2024-06-25; no updates since. Not a news source for current activity — his X account (@BTOofficial) is where the site itself points for "more activities".
- No Instagram / YouTube / LinkedIn / TikTok / Telegram links.
- Facebook and X social icons use broken relative hrefs (`OlubunmiTunjiOjoBTO`, `BTOofficial`).
- No office address, phone, or press contact; contact form is broken; only `contact@bto.ng`.
- No Ministry of Interior links or handles.
- No foundation/initiative pages; no dedicated speeches section.
- "As A Rep" (/rep) is down with a database error.
