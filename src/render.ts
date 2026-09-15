import {
  profile, identity, prologue, education, professional, legislator, constituency, callToServe,
  ministryGroups, stats, recognition, quotes, letter, imageCredits,
} from './content';
import type { Fact, Entry } from './content';

/* ── Source registry: every cited fact gets a footnote number, listed in the Sources chapter ── */
interface Src { url: string; label: string; chapter: string }
const registry: Src[] = [];
function cite(f: Fact, chapter: string): string {
  let i = registry.findIndex((r) => r.url === f.source);
  if (i < 0) {
    let label = f.sourceLabel;
    if (label === undefined) {
      try {
        label = new URL(f.source).hostname.replace(/^www\./, '');
      } catch (error: unknown) {
        console.error('Invalid citation URL; displaying the raw source.', f.source, error);
        label = f.source;
      }
    }
    registry.push({ url: f.source, label, chapter });
    i = registry.length - 1;
  }
  return `<sup class="fn"><a href="#src-${i + 1}" aria-label="Source ${i + 1}: ${esc(registry[i].label)}">${i + 1}</a></sup>`;
}
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));

/* ── Chapter table (drives the rail, numerals and the sources grouping) ── */
export interface Chapter { id: string; label: string; numeral: string; span: string; title: string }
export const chapters: Chapter[] = [
  { id: 'hero', label: 'Cover', numeral: '', span: '', title: '' },
  { id: 'prologue', label: 'Prologue', numeral: 'I', span: 'A documented record', title: 'From a market stall in Akure to the <em>Federal Executive Council.</em>' },
  { id: 'origins', label: 'Origins', numeral: 'II', span: '1982 — 1993', title: 'Origins in <em>Akoko.</em>' },
  { id: 'education', label: 'Education', numeral: 'III', span: '1987 — 2025', title: 'The education of a <em>minister.</em>' },
  { id: 'professional', label: 'The Professional', numeral: 'IV', span: '2004 — 2018', title: 'Engineer, consultant, <em>founder.</em>' },
  { id: 'legislator', label: 'The Legislator', numeral: 'V', span: '2019 — 2023', title: 'Four years in the <em>Green Chamber.</em>' },
  { id: 'call-to-serve', label: 'The Call', numeral: 'VI', span: 'July — August 2023', title: 'The call to <em>serve.</em>' },
  { id: 'ministry', label: 'Interior', numeral: 'VII', span: '2023 — 2026', title: 'Minister of <em>Interior.</em>' },
  { id: 'numbers', label: 'Numbers', numeral: 'VIII', span: 'The record, measured', title: 'By the <em>numbers.</em>' },
  { id: 'recognition', label: 'Honours', numeral: 'IX', span: '2019 — 2026', title: '<em>Recognition.</em>' },
  { id: 'words', label: 'In His Words', numeral: 'X', span: 'Verbatim, sourced', title: 'In his <em>own words.</em>' },
  { id: 'letter', label: 'The Letter', numeral: 'XI', span: 'A vote of confidence', title: 'A vote of <em>confidence.</em>' },
  { id: 'sources', label: 'Sources', numeral: 'XII', span: 'Every claim, traced', title: 'Sources & <em>credits.</em>' },
];
const ch = (id: string) => chapters.find((c) => c.id === id)!;

function head(id: string, lede?: string): string {
  const c = ch(id);
  return `
    <div class="chapter__num" aria-hidden="true" data-numeral>${c.numeral}</div>
    <header class="chapter__head">
      <p class="eyebrow" data-reveal>Chapter ${c.numeral} · ${esc(c.span)}</p>
      <h2 class="display" data-split>${c.title}</h2>
      ${lede ? `<p class="lede" data-reveal>${lede}</p>` : ''}
    </header>`;
}

function figure(src: string, alt: string, cls = 'figure--wide', cap = '', eager = false): string {
  return `
    <figure class="figure ${cls}" data-figure>
      <img src="${src}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'} />
      <span class="figure__frame" aria-hidden="true"></span>
      ${cap ? `<figcaption class="figure__cap">${esc(cap)}</figcaption>` : ''}
    </figure>`;
}

function ledger(entries: Entry[], chapter: string): string {
  return `<div class="ledger" data-reveal-group>${entries
    .map((e) => `
      <div class="ledger__row" data-reveal>
        <div class="ledger__year">${esc(e.year)}</div>
        <div>
          <div class="ledger__title">${esc(e.title)}</div>
          <p class="ledger__text">${esc(e.text)}${cite(e, chapter)}</p>
        </div>
      </div>`)
    .join('')}</div>`;
}

/* ── Sections ── */
const loader = () => `
  <div class="loader" role="status" aria-label="Loading the documented record">
    <div class="loader__inner" aria-hidden="true">
      <div class="loader__name">Olubunmi <em>Tunji-Ojo</em></div>
      <div class="loader__meta"><div class="loader__bar"><i></i></div><div class="loader__pct">00</div></div>
    </div>
  </div>`;

const chrome = () => `
  <div class="progress" aria-hidden="true"><i></i></div>
  <nav class="rail" aria-label="Chapters">
    ${chapters.map((c) => `<a class="rail__item" href="#${c.id}" data-rail="${c.id}"><span class="rail__dot"></span><span class="rail__label">${esc(c.label)}</span></a>`).join('')}
  </nav>
  <div class="chapter-tag" aria-hidden="true"><b data-tag-num></b> <span data-tag-label></span></div>`;

const hero = () => `
  <section class="hero" id="hero" data-chapter>
    <div class="hero__crest" data-hero-crest>
      <img src="/images/coat-of-arms.png" alt="Coat of arms of the Federal Republic of Nigeria" width="46" height="40" />
      <span>Federal Republic of Nigeria<br />Federal Ministry of Interior</span>
    </div>
    <div class="hero__copy">
      <h1 class="hero__name" data-hero-name><span class="dr">${esc(profile.honorific)}</span>Olubunmi <em>Tunji-Ojo</em></h1>
      <div class="hero__office" data-hero-fade>
        <strong>${esc(profile.office)}</strong>
        <span>${esc(profile.nation)} · since ${esc(profile.swornIn)}${cite(identity[1], 'hero')}</span>
      </div>
      <dl class="hero__meta" data-hero-fade>
        <div><dt>Born</dt><dd>${esc(profile.born)}${cite(identity[0], 'hero')}</dd></div>
        <div><dt>Of</dt><dd>${esc(profile.origin)}</dd></div>
        <div><dt>Known as</dt><dd>${esc(profile.nickname)}</dd></div>
      </dl>
    </div>
    <figure class="hero__figure" data-hero-figure>
      <img src="/images/hero-portrait.jpg" alt="Dr. Olubunmi Tunji-Ojo, Minister of Interior, photographed in London in November 2024" fetchpriority="high" />
      <span class="figure__frame" aria-hidden="true"></span>
    </figure>
    <div class="hero__scroll" data-hero-fade><i></i><span>Scroll to read</span></div>
  </section>`;

const prologueS = () => `
  <section class="chapter" id="prologue" data-chapter>
    ${head('prologue', 'This is a record, not a tribute. Every date, figure and quotation on this page is drawn from a cited public source, numbered as you read and listed in full at the end.')}
    <dl class="glance" data-reveal-group>
      <div data-reveal><dt>Born</dt><dd>${esc(profile.born)}, ${esc(profile.origin)}${cite(identity[0], 'prologue')}</dd></div>
      <div data-reveal><dt>Education</dt><dd>Electronics &amp; Communication Engineering; MSc Digital Communication &amp; Networking, London${cite(education[6], 'prologue')}</dd></div>
      <div data-reveal><dt>Before politics</dt><dd>Chief Executive, Matrix IT Solutions, at 24${cite(professional[1], 'prologue')}</dd></div>
      <div data-reveal><dt>Legislature</dt><dd>Member, House of Representatives, Akoko North-East/North-West, 2019–2023${cite(legislator[0], 'prologue')}</dd></div>
      <div data-reveal><dt>Office</dt><dd>Minister of Interior since 21 August 2023${cite(identity[1], 'prologue')}</dd></div>
    </dl>
  </section>`;

const originsS = () => `
  <section class="chapter" id="origins" data-chapter>
    ${head('origins', 'An only child of the Akoko hills, who lost his father to violence in Kaduna at ten and learned the value of a naira at a market stall in Akure.')}
    <div class="two-col">
      <div class="ledger ledger--plain" data-reveal-group>
        ${prologue.map((f) => `<div class="ledger__row" data-reveal><p class="ledger__text">${esc(f.text)}${cite(f, 'origins')}</p></div>`).join('')}
      </div>
      <div class="origins__map">
        ${figure('/images/ondo-map.jpg', 'Map of Nigeria with Ondo State highlighted', 'figure--wide', 'Ondo State, south-western Nigeria')}
        <img class="origins__seal" src="/images/ondo-seal.png" alt="Seal of Ondo State" width="92" height="92" loading="lazy" />
      </div>
    </div>
  </section>`;

const educationS = () => `
  <section class="chapter" id="education" data-chapter>
    ${head('education', 'Three primary schools in three cities, a senior-prefect year in Akure, an engineering start at Ife, degrees in London, and the professional certifications that made him a technologist before he was a politician.')}
    <div class="edu">
      <aside class="edu__aside">
        <div>
          <div class="edu__year" data-edu-year>${esc(education[0].year)}</div>
          <div class="edu__year-label">The year</div>
        </div>
        ${figure('/images/official-portrait.jpg', 'Official portrait of Dr. Olubunmi Tunji-Ojo with the Nigerian flag and coat of arms', 'figure--tall', 'Official portrait')}
      </aside>
      <div class="edu__entries">
        <div class="edu__line" aria-hidden="true"><i data-edu-line></i></div>
        <ol class="edu__list">
        ${education.map((e) => `
          <li class="edu-entry" data-edu-entry data-year="${esc(e.year)}">
            <span class="edu-entry__year">${esc(e.year)}</span>
            <h3 class="edu-entry__title">${esc(e.title)}</h3>
            <p class="edu-entry__text">${esc(e.text)}${cite(e, 'education')}</p>
          </li>`).join('')}
        </ol>
      </div>
    </div>
  </section>`;

const professionalS = () => `
  <section class="chapter" id="professional" data-chapter>
    ${head('professional', 'Network security in London, then a consulting practice in Abuja whose clients were the institutions of the Nigerian state.')}
    <div class="two-col two-col--flip">
      ${figure('/images/at-desk-2023.jpg', 'Dr. Tunji-Ojo seated at his desk during his inaugural week as Minister, September 2023', 'figure--tall', 'Inaugural week, September 2023')}
      ${ledger(professional, 'professional')}
    </div>
  </section>`;

const legislatorS = () => `
  <section class="chapter" id="legislator" data-chapter>
    ${head('legislator', 'Elected at 36, chairman of the NDDC committee at 37, and the lawmaker who stepped aside from his own probe so that no one could question its fairness.')}
    <div class="two-col">
      ${ledger(legislator, 'legislator')}
      <div>
        ${figure('/images/house-of-reps.jpg', 'Dr. Tunji-Ojo walking out of the House of Representatives with fellow lawmakers', 'figure--wide', 'The House of Representatives')}
        <div class="constituency">
          <p class="eyebrow constituency__heading" data-reveal>For the constituency</p>
          <div class="ledger ledger--plain" data-reveal-group>
            ${constituency.map((f) => `<div class="ledger__row" data-reveal><p class="ledger__text">${esc(f.text)}${cite(f, 'legislator')}</p></div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  </section>`;

const callS = () => `
  <section class="chapter" id="call-to-serve" data-chapter>
    ${head('call-to-serve', 'Twenty-six days from nomination to oath. He resigned a seat he had just won with 84.5% of the vote to take it.')}
    <ol class="steps">
      ${callToServe.map((s) => `
        <li class="step" data-step>
          <div class="step__date">${esc(s.year)}<small>2023</small></div>
          <div class="step__title">${esc(s.title)}</div>
          <p class="step__text">${esc(s.text)}${cite(s, 'call-to-serve')}</p>
        </li>`).join('')}
    </ol>
    <div class="call__figures">
      ${figure('/images/podium-speech.jpg', 'Dr. Tunji-Ojo addressing a launch event from the podium', 'figure--wide', 'Addressing a launch event')}
      ${figure('/images/tinubu-portrait.jpg', 'Official portrait of President Bola Ahmed Tinubu', 'figure--tall', 'Appointed by President Bola Ahmed Tinubu')}
    </div>
  </section>`;

const ministryS = () => `
  <section class="chapter ministry" id="ministry" data-chapter>
    ${head('ministry', 'One ministry, four uniformed services. What follows is a dated ledger of what changed, agency by agency, from August 2023 to September 2026.')}
    <div class="ministry__pin" data-ministry-pin>
      <div class="ministry__track" data-ministry-track>
        <article class="agency agency--intro">
          <div class="agency__count">${ministryGroups.length} portfolios</div>
          <h3 class="agency__name">Portfolios under the Interior</h3>
          <p>The Ministry supervises the Nigeria Immigration Service, the Nigerian Correctional Service, the Nigeria Security and Civil Defence Corps and the Federal Fire Service, alongside citizenship, marriage and business-permit administration.</p>
          <div class="agency__logos">
            <img src="/images/ministry-logo.png" alt="Federal Ministry of Interior emblem" loading="lazy" />
            <img src="/images/nis-logo.png" alt="Nigeria Immigration Service crest" loading="lazy" />
            <img src="/images/nscdc-logo.png" alt="Nigeria Security and Civil Defence Corps crest" loading="lazy" />
          </div>
          <p class="small agency__cue">Scroll on →</p>
        </article>
        ${ministryGroups.map((g, i) => `
          <article class="agency" data-agency="${g.key}">
            <div class="agency__media">
              <div class="agency__index">${String(i + 1).padStart(2, '0')}</div>
              <h3 class="agency__name">${esc(g.name)}</h3>
              <p class="agency__intro">${esc(g.intro)}</p>
              ${figure(g.image, g.imageAlt, 'figure--wide')}
            </div>
            <ol class="agency__items">
              ${g.items.map((it) => `<li><span class="y">${esc(it.year)}</span><span class="t">${esc(it.title)}</span><span class="x">${esc(it.text)}${cite(it, 'ministry')}</span></li>`).join('')}
            </ol>
          </article>`).join('')}
      </div>
    </div>
  </section>`;

const numbersS = () => `
  <section class="chapter" id="numbers" data-chapter>
    ${head('numbers', 'Figures as reported at the time, each with its source.')}
    <div class="stats" data-reveal-group>
      ${stats.map((s) => `
        <div class="stat" data-reveal>
          <div class="stat__value" data-count="${s.value}" data-prefix="${esc(s.prefix ?? '')}" data-suffix="${esc(s.suffix ?? '')}">${esc(s.prefix ?? '')}${Math.round(s.value).toLocaleString('en-NG')}${esc(s.suffix ?? '')}</div>
          <p class="stat__label">${esc(s.label)}${cite(s, 'numbers')}</p>
        </div>`).join('')}
    </div>
  </section>`;

const recognitionS = () => `
  <section class="chapter" id="recognition" data-chapter>
    ${head('recognition')}
    <div class="honours">
      ${ledger(recognition, 'recognition')}
      <div class="honours__figures">
        ${figure('/images/vanguard-award.jpg', 'Dr. Tunji-Ojo receiving the Vanguard Personality of the Year award on stage', 'figure--wide', 'Vanguard Personality of the Year')}
        ${figure('/images/leadership-plaque-2025.jpg', 'Dr. Tunji-Ojo receiving a leadership plaque in 2025', 'figure--square', 'Exemplary leadership plaque, 2025')}
      </div>
    </div>
  </section>`;

const wordsS = () => `
  <section class="chapter" id="words" data-chapter>
    ${head('words')}
    <div class="quotes">
      ${quotes.map((q) => `
        <blockquote class="quote" data-quote>
          <p data-split>${esc(q.text)}</p>
          <div class="quote__meta" data-reveal>${q.speaker ? `<b>${esc(q.speaker)}</b>` : ''}<span>${esc(q.context)}${cite(q, 'words')}</span></div>
        </blockquote>`).join('')}
    </div>
  </section>`;

const letterS = () => {
  const has = letter.paragraphs.length > 0;
  return `
  <section class="chapter" id="letter" data-chapter>
    ${head('letter')}
    <div class="letter__frame" data-reveal>
      <img class="letter__crest" src="/images/coat-of-arms.png" alt="" aria-hidden="true" />
      <p class="letter__to">${esc(letter.addressedTo)}</p>
      ${has
        ? `<div class="letter__body">${letter.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
           <div class="letter__sign"><b>${esc(letter.signatory)}</b><span>${esc(letter.signatoryTitle)}${letter.dated ? ` · ${esc(letter.dated)}` : ''}</span></div>`
        : `<p class="letter__reserved">This chapter is reserved for the author’s letter of confidence. Its words are the author’s own and are added from <code>src/content/letter.ts</code>; nothing here is written on their behalf.</p>`}
    </div>
  </section>`;
};

const sourcesS = () => {
  const groups = chapters.filter((c) => registry.some((r) => r.chapter === c.id));
  return `
  <section class="chapter" id="sources" data-chapter>
    ${head('sources', 'Numbered in order of first citation. Government releases, national newspapers, professional advisories and public records; where reports disagreed, the more conservative figure was used.')}
    ${groups.map((c) => `
      <div class="sources__group">
        <h3>${c.numeral ? `Chapter ${c.numeral} · ` : ''}${esc(c.label)}</h3>
        <ol class="sources__list">
          ${registry.map((r, i) => (r.chapter === c.id ? `<li id="src-${i + 1}" tabindex="-1"><b>${i + 1}</b><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.label)}<small>${esc(r.url)}</small></a></li>` : '')).join('')}
        </ol>
      </div>`).join('')}
    <div class="credits">
      <div class="sources__group"><h3>Image credits</h3></div>
      <ul>
        ${imageCredits.map((c) => `<li><img src="${c.file}" alt="" loading="lazy" decoding="async" /><span>${esc(c.description)} — <a href="${c.source}" target="_blank" rel="noopener noreferrer">${esc(c.credit)}</a></span></li>`).join('')}
      </ul>
    </div>
  </section>`;
};

const footer = () => `
  <footer class="footer">
    <div class="footer__brand"><img src="/images/coat-of-arms.png" alt="" aria-hidden="true" /><span>Dr. Olubunmi Tunji-Ojo · Minister of Interior</span></div>
    <span>Prepared as a companion to a vote of confidence · ${new Date().getFullYear()}</span>
  </footer>`;

export function renderApp(): string {
  registry.length = 0;
  // Order matters: cite() numbers sources in reading order, and sourcesS() must run last.
  const body = [hero(), prologueS(), originsS(), educationS(), professionalS(), legislatorS(), callS(), ministryS(), numbersS(), recognitionS(), wordsS(), letterS()].join('');
  return '<a class="skip-link" href="#main">Skip to main content</a>' + loader() + chrome() + '<main id="main" tabindex="-1">' + body + sourcesS() + '</main>' + footer();
}
