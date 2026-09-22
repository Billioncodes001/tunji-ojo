import { esc } from "./html";
import { blogPosts, postRoute, type BlogPost } from "./blog";
import { blogPreview, renderBlog, renderArticle } from "./blog-render";
import { renderJourney } from "./journey";
import {
  identity,
  prologue,
  education,
  professional,
  legislator,
  constituency,
  callToServe,
  ministryGroups,
  stats,
  recognition,
  quotes,
  letter,
  news,
  allFacts,
  coreValues,
  siteProfile,
  imageCredits,
} from "../content";
import type { Fact, Entry } from "../content";
import { photographs, films, photoById } from "./media";
import { channels, officialContact } from "./channels";
export const pages = [
  ["", "Home", "A life in service. A record in focus."],
  ["story", "The story", "From Akoko to the national stage."],
  [
    "interior",
    "The Interior years",
    "Institutions. Reforms. The public record.",
  ],
  [
    "offices",
    "Public office",
    "From the Green Chamber to the Federal Executive Council.",
  ],
  ["community", "Community", "Where service begins."],
  ["honours", "Honours", "Recognition along the way."],
  [
    "media",
    "In the frame",
    "Photographs, conversations and moments from public life.",
  ],
  ["words", "In his words", "Ideas, commitments and reflections, in context."],
  ["news", "The journal", "Dispatches from the official archive."],
  [
    "letter",
    "A vote of confidence",
    "The verdict of the Southwest student constituency.",
  ],
  ["faq", "Questions, answered", "A guide to the person and the record."],
  ["press", "Press room", "Biography, photographs and useful references."],
  ["sources", "The source record", "Follow the evidence behind the story."],
  ["privacy", "Privacy", "A small site. A clear approach to privacy."],
  ["share", "Pass it on", "Share the documented record."],
  ["connect", "Connect", "Social channels, official contacts and public services."],
  ["blog", "Blog", "Original explainers on Olubunmi Tunji-Ojo, immigration and Nigeria’s Ministry of Interior, with dated sources and practical public-service links."],
] as const;
export type PageKey = (typeof pages)[number][0];
export { esc } from "./html";
export function renderPage(route: string, base: string, siteUrl = "https://olubunmitunjiojo.com/", posts: BlogPost[] = blogPosts, customContent?: string) {
  const url = (p = "") => `${base}${p ? p + "/" : ""}`;
  const img = (id: string, cls = "", eager = false) => {
    const p = photoById(id);
    return `<img class="${cls}" src="${base}images/optimized/${p.id}.webp" alt="${esc(p.description)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" width="1600" height="1067">`;
  };
  const source = (f: Fact) =>
    `<a class="source" href="${esc(f.source)}" target="_blank" rel="noopener noreferrer">${esc(f.sourceLabel ?? "View source")} <span aria-hidden="true">↗</span></a>`;
  const facts = (items: Fact[]) =>
    items
      .map(
        (f) =>
          `<div class="fact reveal"><p>${esc(f.text)}</p>${source(f)}</div>`,
      )
      .join("");
  const timeline = (items: Entry[]) =>
    `<div class="timeline">${items.map((f) => `<article class="timeline-row reveal"><span class="eyebrow">${esc(f.year)}</span><div><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p>${source(f)}</div></article>`).join("")}</div>`;
  const arrow = (text: string, href: string) =>
    `<a class="text-link" href="${href}">${text}<span aria-hidden="true">↗</span></a>`;
  const head = (label: string, title: string, desc: string) =>
    `<section class="page-heading wrap"><p class="eyebrow">${label}</p><h1>${title}</h1><p class="lede">${desc}</p></section>`;
  const statGrid = (all = false) =>
    `<div class="stat-grid">${(all ? stats : [stats[0], stats[7], stats[5]]).map((s) => `<article class="stat reveal"><div class="stat-value">${esc(s.prefix ?? "")}<span data-count="${s.value}">${s.value.toLocaleString("en-NG")}</span>${esc(s.suffix ?? "")}</div><p>${esc(s.label)}.</p>${source(s)}</article>`).join("")}</div>`;
  const filmCards = (all = false) =>
    (all ? films : films.slice(0, 2))
      .map(
        (f, i) =>
          `<button class="film-card" data-film="${f.id}" aria-label="Watch ${esc(f.title)}"><div class="film-poster"><img src="${base}images/video-${f.id}.jpg" alt="" loading="lazy" width="480" height="360"><span class="play" aria-hidden="true">▶</span><span class="film-time">${f.publisher} · Film 0${i + 1}</span></div><span class="eyebrow">${f.date}</span><h3>${f.title}</h3><p>${f.description}</p></button>`,
      )
      .join("");
  const newsCards = () =>
    news
      .map(
        (n, i) =>
          `<a class="news-card reveal" href="${esc(n.source)}" target="_blank" rel="noopener noreferrer">${img(["bto-inspection-egates", "vanguard-award", "bto-retreat-2024", "bto-kuje-visit"][i])}<span class="eyebrow">25 June 2024 · Official archive ↗</span><h3>${esc(n.text)}</h3><p>${esc(n.excerpt)}</p></a>`,
      )
      .join("");
  const chapters: [string, string, string, string][] = [
    ["story", "The story", "01", "official-portrait"],
    ["offices", "Public office", "02", "house-of-reps"],
    ["interior", "The Interior years", "03", "at-desk-2023"],
    ["community", "Community", "04", "bto-public-service"],
    ["honours", "Honours", "05", "vanguard-award"],
    ["media", "In the frame", "06", "bto-inspection-egates"],
  ];
  let content = "";
  const post = posts.find(p => postRoute(p) === route);
  switch (route) {
    case "blog":
      content = renderBlog(base, posts);
      break;
    case "":
      content = `<section class="hero" aria-label="Olubunmi Tunji-Ojo, a life in service"><div class="hero-image"><picture><source media="(max-width: 650px)" srcset="${base}images/hero-film-poster-mobile.jpg"><img src="${base}images/hero-film-poster.jpg" alt="Tunji-Ojo at the commissioning of Arrival E at Lagos airport, December 2023" width="1920" height="1080" fetchpriority="high" decoding="async"></picture></div><video class="hero-video" data-hero-video muted loop playsinline preload="none" aria-hidden="true" tabindex="-1" disablepictureinpicture><source data-src="${base}media/tunji-ojo-airport-hd.webm" data-mobile-src="${base}media/tunji-ojo-airport-mobile.webm" type="video/webm"><source data-src="${base}media/tunji-ojo-airport-hd.mp4" data-mobile-src="${base}media/tunji-ojo-airport-mobile.mp4" type="video/mp4"></video><div class="hero-shade"></div><div class="hero-copy"><p class="eyebrow"><span class="live-dot"></span> Olubunmi Tunji-Ojo · Nigeria</p><h1>TUNJI<span>OJO.</span></h1><div class="hero-bottom"><p>A life in service.<br>A record in focus.</p><a class="circle-link" href="#introduction" aria-label="Explore the story">↓</a></div></div><div class="hero-film-bar"><a class="hero-watch" href="https://www.youtube.com/watch?v=fMgmL2v1ZpY" data-film="airport-commissioning" aria-haspopup="dialog" target="_blank" rel="noopener noreferrer"><span class="film-dot" aria-hidden="true">▶</span> Watch the full film <span aria-hidden="true">↗</span></a><div class="hero-film-meta"><a href="https://www.youtube.com/watch?v=fMgmL2v1ZpY" target="_blank" rel="noopener noreferrer">Lagos, December 2023 · OMP ↗</a><button class="hero-film-toggle" data-hero-toggle aria-label="Play background video" hidden><span class="playback-icon" aria-hidden="true"></span><span data-hero-control-label>Play film</span></button></div></div></section>
 <section class="paper section" id="introduction"><div class="wrap intro-grid"><div><p class="eyebrow">The person behind the office</p><h2 class="display reveal">ROOTED IN<br>AKOKO.<br><em>WORKING FOR<br>NIGERIA.</em></h2></div><div class="intro-copy reveal"><p class="lede">Engineer. Legislator.<br>Minister of Interior.</p><p>From Ondo State to the House of Representatives and the Ministry of Interior, explore the life, public service and documented record of Hon. (Dr.) Olubunmi Tunji-Ojo.</p>${source(identity[1])}${arrow("Meet Olubunmi", url("story"))}<div class="mini-portrait">${img("official-portrait")}<span>Olubunmi Tunji-Ojo<br><small>Honourable Minister of Interior</small></span></div></div></div></section>
 <section class="section chapters-section"><div class="wrap section-top"><div><p class="eyebrow">Explore the chapters</p><h2 class="display">ONE LIFE.<br>MANY CHAPTERS.</h2></div><p class="muted">The people, places and work<br>that shape the story.</p></div><div class="chapters">${chapters.map(([p, t, n, id]) => `<a class="chapter" href="${url(p)}">${img(id)}<span class="chapter-number">${n}</span><div><h3>${t}</h3><span class="chapter-arrow" aria-hidden="true">↗</span></div></a>`).join("")}</div></section>
 <section class="paper section"><div class="wrap"><div class="section-top"><div><p class="eyebrow">The public record</p><h2 class="display reveal">BEYOND<br>THE HEADLINES.</h2></div>${arrow("Explore the Interior years", url("interior"))}</div><p class="measure-note">Selected reported outcomes, with dates and original sources.</p>${statGrid()}</div></section>
 <section class="section wrap"><div class="section-top"><div><p class="eyebrow">Watch & listen</p><h2 class="display">IN HIS<br>OWN WORDS.</h2></div>${arrow("Explore all media", url("media"))}</div><div class="film-grid">${filmCards()}</div></section>
 <section class="image-quote">${img("podium-speech")}<div class="wrap"><p class="eyebrow">A conviction, on the record</p><blockquote>“VISA IS A PRIVILEGE.<br>PASSPORT IS A RIGHT.”</blockquote><p>Olubunmi Tunji-Ojo · October 2023</p>${source(quotes[0])}</div></section>
 <section class="paper section"><div class="wrap"><div class="section-top"><div><p class="eyebrow">From the archive</p><h2 class="display">THE JOURNAL.</h2></div>${arrow("Read the archive", url("news"))}</div><div class="news-grid">${newsCards()}</div></div></section>
 ${renderJourney(base)}
 ${blogPreview(base, posts)}
 <section class="section wrap letter-teaser"><p class="eyebrow">A student constituency’s perspective</p><h2 class="display reveal">A RECORD<br>THAT SPEAKS.</h2><div><p class="lede">A vote of confidence from NANS Southwest Zone D.</p><p>The letter that occasioned this documented record: an assessment of public service and its impact on students.</p>${arrow("Read the full letter", url("letter"))}</div></section>`;
      break;
    case "story":
      content =
        head(
          "01 / The story",
          "FROM AKOKO.<br>TO THE NATION.",
          "A journey through education, enterprise and public service.",
        ) +
        `<div class="wrap story-opening">${img("official-portrait", "portrait", true)}<div>${facts(identity)}${facts(prologue)}</div></div><section class="paper section"><div class="wrap reading"><p class="eyebrow">Learning & formation</p><h2 class="display">THE EARLY YEARS.</h2>${timeline(education)}</div></section><section class="section wrap reading"><p class="eyebrow">Enterprise & experience</p><h2 class="display">BEFORE PUBLIC OFFICE.</h2>${facts(siteProfile)}${timeline(professional)}</section>`;
      break;
    case "interior":
      content =
        head(
          "03 / The Interior years",
          "THE WORK.<br>THE RECORD.",
          "A dated account of reform across the Ministry of Interior and its services.",
        ) +
        `<section class="wrap bottom-space">${statGrid(true)}</section><nav class="jump-nav wrap" aria-label="Ministry services">${ministryGroups.map((g) => `<a href="#${g.key}">${esc(g.name)}</a>`).join("")}</nav>` +
        ministryGroups
          .map(
            (g, i) =>
              `<section id="${g.key}" class="section ${i % 2 === 0 ? "paper" : ""}"><div class="wrap agency-grid"><div class="agency-heading"><p class="eyebrow">0${i + 1} / The institutions</p><h2>${esc(g.name)}</h2><p>${esc(g.intro)}</p><img src="${base}${g.image.replace(/^\//, "")}" alt="${esc(g.imageAlt)}" loading="lazy" width="1200" height="800"></div>${timeline(g.items)}</div></section>`,
          )
          .join("");
      break;
    case "offices":
      content =
        head(
          "02 / Public office",
          "A MANDATE<br>TO SERVE.",
          "The elections, appointments and responsibilities along the way.",
        ) +
        `<div class="wide-photo wrap">${img("house-of-reps", "", true)}</div><section class="section wrap reading"><h2 class="display">THE GREEN CHAMBER.</h2>${timeline(legislator)}</section><section class="paper section"><div class="wrap reading"><h2 class="display">THE CALL TO SERVE.</h2>${timeline(callToServe)}</div></section>`;
      break;
    case "community":
      content =
        head(
          "04 / Community",
          "SERVICE<br>STARTS HERE.",
          "Education, opportunity and the constituency record.",
        ) +
        `<div class="wide-photo wrap">${img("bto-public-service", "", true)}</div><section class="section wrap reading"><h2 class="display">CLOSE TO HOME.</h2>${facts(constituency)}<div class="pullquote"><p class="eyebrow">His stated values</p><blockquote>${esc(coreValues.text)}</blockquote>${source(coreValues)}</div>${arrow("The student perspective", url("letter"))}</section>`;
      break;
    case "honours":
      content =
        head(
          "05 / Honours",
          "MOMENTS OF<br>RECOGNITION.",
          "Awards and distinctions, presented with their original reporting.",
        ) +
        `<div class="wide-photo wrap">${img("vanguard-award", "", true)}</div><section class="section wrap reading">${timeline(recognition)}</section>`;
      break;
    case "media":
      content =
        head(
          "06 / In the frame",
          "PUBLIC LIFE.<br>IN FOCUS.",
          "A visual archive of the minister, the institutions and the work.",
        ) +
        `<section class="wrap bottom-space"><h2 class="section-label">Watch & listen</h2><div class="film-grid">${filmCards(true)}</div></section><section class="paper section"><div class="wrap"><div class="section-top"><h2 class="display">THE PHOTO<br>JOURNAL.</h2><p class="muted">Open a photograph for<br>its caption and original source.</p></div><div class="filters" role="group" aria-label="Filter photographs">${["All", "Portraits", "Public service", "In the field", "International", "Recognition"].map((s, i) => `<button data-filter="${s}" aria-pressed="${i === 0}">${s}</button>`).join("")}</div><p id="gallery-status" class="eyebrow" role="status">${photographs.length} photographs</p><div class="gallery">${photographs.map((p, i) => `<button class="photo-card" data-photo="${p.id}" data-category="${p.category}" aria-label="Open photograph: ${esc(p.title)}">${img(p.id)}<span><span>${String(i + 1).padStart(2, "0")} / ${esc(p.title)}</span><span aria-hidden="true">↗</span></span></button>`).join("")}</div></div></section>`;
      break;
    case "words":
      content =
        head(
          "07 / In his words",
          "WORDS.<br>WITH CONTEXT.",
          "A selection of public statements, with attribution and sources.",
        ) +
        `<section class="wrap bottom-space quotes">${quotes.map((q, i) => `<article class="pullquote reveal"><span class="eyebrow">${String(i + 1).padStart(2, "0")} / ${esc(q.speaker ?? "Olubunmi Tunji-Ojo")}</span><blockquote>“${esc(q.text)}”</blockquote><p>${esc(q.context)}</p>${source(q)}</article>`).join("")}</section>`;
      break;
    case "news":
      content =
        head(
          "08 / The journal",
          "FROM THE<br>OFFICIAL ARCHIVE.",
          "Selected dispatches published on bto.ng. Each story opens its original article.",
        ) +
        `<section class="wrap section"><div class="news-grid">${newsCards()}</div></section>`;
      break;
    case "letter":
      content =
        head(
          "09 / The student perspective",
          "A VOTE OF<br>CONFIDENCE.",
          esc(letter.subject),
        ) +
        `<section class="paper section"><article class="wrap reading letter-body"><p class="eyebrow">${esc(letter.from)}</p><p><strong>To:</strong> ${esc(letter.addressedTo)}</p><p class="editor-note">The letter below is presented as the assessment of its authors. Its figures and opinions retain that attribution.</p>${letter.fullText.map((p, i) => (i === 9 ? `<h2>${esc(p)}</h2>` : `<p>${esc(p)}</p>`)).join("")}<p><strong>${esc(letter.closing)}</strong></p><p class="signature">${esc(letter.signatory)}<br><span>${esc(letter.signatoryTitle)}</span></p><button class="text-link" data-print>Print this letter <span>↗</span></button></article></section>`;
      break;
    case "faq":
      content =
        head(
          "10 / A quick guide",
          "QUESTIONS,<br>ANSWERED.",
          "A few starting points for exploring the record.",
        ) +
        `<section class="wrap reading bottom-space faq">${[
          [
            "Who is Olubunmi Tunji-Ojo?",
            identity.map((f) => f.text).join(" "),
            "story",
            "Read his story",
          ],
          [
            "What did he do before becoming a minister?",
            "His career spans engineering, enterprise and two elections to the House of Representatives.",
            "offices",
            "Explore public office",
          ],
          [
            "What is covered in the Interior record?",
            "Immigration and passports, correctional services, civil defence, fire safety and ministry administration. Claims are dated and linked to reporting.",
            "interior",
            "Explore the record",
          ],
          [
            "Is this an official government website?",
            "This is an independent documented profile. The official personal website is bto.ng; ministry services are available through interior.gov.ng.",
            "sources",
            "About the sources",
          ],
          [
            "Where do the photographs and films come from?",
            "Photographs include the minister’s official website and credited public reporting. Full reports from Channels Television and TVC News load when you choose to watch. The homepage uses a short, silent Full HD event film credited to Olumide Mikel Pictures (OMP).",
            "media",
            "Visit the media archive",
          ],
          [
            "What is the NANS letter?",
            "A vote of confidence from the NANS Southwest Zone D leadership. The full letter is reproduced with its authorship and assessment clearly attributed.",
            "letter",
            "Read the letter",
          ],
        ]
          .map(
            ([q, a, p, l]) =>
              `<details><summary>${q}<span aria-hidden="true">+</span></summary><p>${a}</p>${arrow(l, url(p))}</details>`,
          )
          .join("")}</section>`;
      break;
    case "press":
      content =
        head(
          "11 / Press room",
          "THE ESSENTIALS.<br>IN ONE PLACE.",
          "A concise biography and links to the original record.",
        ) +
        `<section class="wrap story-opening bottom-space">${img("official-portrait", "portrait", true)}<div><h2>Olubunmi Tunji-Ojo</h2><p id="press-bio">Olubunmi Tunji-Ojo is Nigeria’s Minister of Interior, sworn in on 21 August 2023. From Akoko North-West, Ondo State, he previously represented Akoko North-East / North-West in the House of Representatives. His career spans engineering, business and public service.</p>${source(identity[1])}<button class="text-link" data-copy="press-bio">Copy biography <span>↗</span></button><p class="editor-note">Photographs remain subject to the rights of their credited owners. Consult the original source for publication permission.</p>${arrow("Browse photographs & credits", url("media"))}${arrow("Official website", "https://bto.ng/")}${arrow("Ministry of Interior", "https://interior.gov.ng/")}</div></section>`;
      break;
    case "sources":
      content =
        head(
          "12 / Sources",
          "A RECORD<br>YOU CAN FOLLOW.",
          "Every claim leads back to its source. Reporting dates describe the record; figures are not live service metrics.",
        ) +
        `<section class="wrap reading bottom-space"><p class="editor-note">An independent profile, not a government service portal. Sources include official releases, original reporting and the attributed NANS letter. Media credits identify their publishers and do not imply endorsement.</p><h2>Public channels</h2><p>Profile links checked on 21 September 2026.</p>${channels.map(c => `<div class="fact"><h3>${c.name} / ${esc(c.handle)}</h3><a class="source" href="${c.evidence}" target="_blank" rel="noopener noreferrer">Profile reference ↗</a></div>`).join("")}<h2>Claims & reporting</h2><div class="source-list">${allFacts()
          .map(
            (f, i) =>
              `<article><span class="eyebrow">${String(i + 1).padStart(3, "0")}</span><div><p>${esc(f.text)}</p>${source(f)}</div></article>`,
          )
          .join(
            "",
          )}</div><h2>Photography</h2>${[...photographs, ...imageCredits.filter((c) => !photographs.some((p) => p.file === c.file)).map((c) => ({ ...c, title: c.description }))].map((p) => `<div class="fact"><h3>${esc(p.title)}</h3><p>${esc(p.credit)}</p><a class="source" href="${esc(p.source)}" target="_blank" rel="noopener noreferrer">Original photograph / reporting ↗</a></div>`).join("")}<h2>Films</h2>${films.map((f) => `<div class="fact"><h3>${f.title}</h3><p>${f.publisher} · ${f.date}</p><a class="source" href="${f.source}" target="_blank" rel="noopener noreferrer">Original film / reporting ↗</a></div>`).join("")}</section>`;
      content += `<section id="editorial-policy" class="paper section"><div class="wrap reading"><p class="eyebrow">Blog / Editorial approach</p><h2>Context, with a clear source.</h2><p>Blog research notes are published by Olubunmi Tunji-Ojo — Independent Profile. They are not authored or approved by the minister or his office. Articles distinguish dated government statements from independently established outcomes and link to the documents they discuss.</p><p>The publication date belongs to our explainer; the period covered identifies the historical events. Photographs retain captions and original-source credits. Material corrections will be identified in the affected article, with its update date.</p><a class="text-link" href="${url("blog")}">Read the blog <span>↗</span></a></div></section>`;
      break;
    case "privacy":
      content =
        head(
          "13 / Privacy",
          "YOUR VISIT.<br>YOUR CHOICE.",
          "How this website handles your visit.",
        ) +
        `<section class="wrap reading bottom-space"><h2>Reading without an account</h2><p>Articles and public pages are available without registration. This site does not use advertising or analytics scripts.</p><h2>Publishing-team accounts</h2><p>Administrators, editors and writers sign in to a private newsroom. We store their names, email addresses, roles, encrypted password hashes and editorial revisions to operate the publication. Essential session cookies support sign-in, and account emails support password recovery. Accounts can be disabled by the administrator; article attribution and revision history are retained.</p><h2>The background film</h2><p>The short, silent homepage film is served directly from this website. It does not connect to a video platform. Reduced-motion or data-saving preferences keep the still image until you choose to play.</p><h2>Full reports load when you choose.</h2><p>YouTube videos use the privacy-enhanced youtube-nocookie.com player. A connection to YouTube is made only when you open a film. Playback is then subject to YouTube’s privacy practices.</p><h2>Fonts and photographs</h2><p>Fonts and displayed photographs are served with this website. Opening a source link takes you to a separate publisher with its own privacy policy.</p><h2>Hosting</h2><p>The publishing platform uses Cloudflare for hosting, its database, uploaded media and account email. The hosting provider may process technical information such as IP addresses and error logs to deliver and secure the site.</p>${arrow("Cloudflare privacy policy", "https://www.cloudflare.com/privacypolicy/")}<h2>Sharing</h2><p>Copy buttons write the selected text to your clipboard when you choose to use them. Nothing is posted or sent automatically.</p></section>`;
      break;
    case "connect":
      content = head("15 / Stay connected", "THE CONVERSATION.<br>CONTINUES.", "Follow the public channels. Find the right place to get in touch.") +
        `<section class="wrap bottom-space"><div class="connect-grid">${channels.map((c, i) => `<a class="connect-card reveal" href="${c.url}" target="_blank" rel="noopener noreferrer"><span class="eyebrow">0${i + 1} / ${c.name}</span><h2>${esc(c.handle)}</h2><p>${c.description}</p><span class="text-link">Visit ${c.name} <span aria-hidden="true">↗</span></span></a>`).join("")}</div></section><section class="paper section"><div class="wrap contact-grid"><div><p class="eyebrow">Official enquiries</p><h2 class="display">THE RIGHT<br>CONTACT.</h2><p class="lede">For correspondence, start with the official office.</p><p>Contact details and enquiry options are maintained on the official website.</p>${arrow("Contact the official office", officialContact)}</div><div><p class="eyebrow">Public services</p><h3>Ministry of Interior</h3><p>For ministry information and links to its agencies, visit the government website.</p>${arrow("Visit the Ministry", "https://interior.gov.ng/")}<h3>Nigeria Immigration Service</h3><p>For passport and immigration information, start with the Nigeria Immigration Service.</p>${arrow("Visit Immigration", "https://immigration.gov.ng/")}</div></div></section><section class="section wrap reading"><p class="eyebrow">About this website</p><h2>A documented public record.</h2><p>This is an independent profile. It does not receive official correspondence or process government-service applications. The links above take you to the relevant public channels.</p>${arrow("Explore the sources", url("sources"))}</section>`;
      break;
    case "share":
      content =
        head(
          "14 / Share the record",
          "A STORY<br>WORTH READING.",
          "Send someone a starting point for their own exploration.",
        ) +
        `<section class="wrap reading bottom-space"><p id="share-message" class="lede">Explore the documented life and public service of Olubunmi Tunji-Ojo — from Akoko to the Ministry of Interior. ${esc(siteUrl)}</p><button class="text-link" data-copy="share-message">Copy message & link <span>↗</span></button>${arrow("Explore the story", url("story"))}</section>`;
      break;
    default:
      if (customContent) { content = customContent; break; }
      if (post) { content = renderArticle(post, base, siteUrl, posts); break; }
      content =
        head(
          "404 / Not found",
          "A DIFFERENT<br>TURN.",
          "The page you requested could not be found.",
        ) +
        `<div class="wrap bottom-space">${arrow("Return home", url())}</div>`;
  }
  content = customContent ?? content;
  return `<a class="skip-link" href="#main">Skip to content</a><header class="site-header"><a class="brand" href="${url()}" aria-label="Olubunmi Tunji-Ojo home"><img src="${base}images/optimized/official-portrait-thumb.webp" width="32" height="32" alt=""><span>OLUBUNMI TUNJI-OJO</span></a><nav class="header-links" aria-label="Quick navigation"><a href="${url("interior")}">The record</a><a href="${url("blog")}" ${route.startsWith("blog") ? 'aria-current="page"' : ""}>Blog <span class="live-dot"></span></a></nav><button class="menu-toggle" aria-label="Open navigation" aria-haspopup="dialog" aria-controls="menu-dialog">MENU <span class="hamburger" aria-hidden="true"></span></button></header><main id="main" tabindex="-1" data-route="${esc(route)}">${content}</main><footer class="site-footer"><div class="wrap"><div class="footer-top"><a class="footer-name" href="${url()}">TUNJI OJO<span>↗</span></a><p>A life in service.<br>A record in focus.</p></div><div class="footer-links"><div><p class="eyebrow">Explore</p>${pages
    .slice(1, 6)
    .map(([p, t]) => `<a href="${url(p)}">${t}</a>`)
    .join("")}</div><div><p class="eyebrow">The archive</p>${pages
    .slice(6, 11)
    .map(([p, t]) => `<a href="${url(p)}">${t}</a>`)
    .join("")}</div><div><p class="eyebrow">Further reading</p>${pages
    .slice(11)
    .map(([p, t]) => `<a href="${url(p)}">${t}</a>`)
    .join(
      "",
    )}<a href="https://bto.ng/" target="_blank" rel="noopener noreferrer">Official website ↗</a></div><div><p class="eyebrow">Stay connected</p>${channels.map(c => `<a href="${c.url}" target="_blank" rel="noopener noreferrer">${c.name} / ${esc(c.handle)} ↗</a>`).join("")}<a href="${url("connect")}">Contact & public services ↗</a></div></div><div class="footer-bottom"><span>Independent profile · Nigeria</span><span>Photography & reporting credited to their original publishers.</span><a href="#main">Back to top ↑</a></div></div></footer><dialog id="menu-dialog" class="menu-dialog" aria-labelledby="menu-title"><div class="dialog-top"><span id="menu-title" class="eyebrow">Explore the record</span><button data-close aria-label="Close navigation">CLOSE <span>×</span></button></div><nav aria-label="Main navigation">${pages
    .filter(([p], i) => i < 11 || p === "blog")
    .map(
      ([p, t], i) =>
        `<a href="${url(p)}" ${route === p ? 'aria-current="page"' : ""}><span class="menu-number">${String(i).padStart(2, "0")}</span>${t}<span class="menu-arrow">↗</span></a>`,
    )
    .join("")}</nav><div class="menu-bottom">${pages
    .slice(11).filter(([p]) => p !== "blog")
    .map(([p, t]) => `<a href="${url(p)}">${t}</a>`)
    .join(
      "",
    )}</div></dialog><dialog id="media-dialog" class="media-dialog" aria-labelledby="media-title"><div class="dialog-top"><span class="eyebrow" id="media-kind">The visual archive</span><button data-close aria-label="Close media">CLOSE <span>×</span></button></div><div id="media-content"></div></dialog><p class="toast" role="status" id="action-status"></p>`;
}
