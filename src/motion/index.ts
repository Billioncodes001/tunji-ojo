import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { splitWords } from './split';
import { runPreloader } from './preloader';
import { chapters } from '../render';

gsap.registerPlugin(ScrollTrigger);

const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(s));

function anchorTarget(href: string | null): HTMLElement | null {
  if (!href || !href.startsWith('#') || href.length < 2) return null;
  try {
    return $(href);
  } catch (error: unknown) {
    console.warn(`Invalid in-page anchor ${href}; retaining native navigation.`, error);
    return null;
  }
}

export function initMotion(): void {
  const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, syncTouch: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  $$<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      const target = anchorTarget(href);
      if (!target) return;
      e.preventDefault();
      // The 1.6-second scroll owns completion; interrupted scrolls deliberately do not move focus.
      lenis.scrollTo(target, {
        duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4),
        onComplete: () => {
          if (target.tabIndex < 0 && !target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
          history.replaceState(history.state, '', href);
        },
      });
    });
  });

  // Start at the cover unless the visitor arrived with a chapter anchor.
  const anchor = anchorTarget(location.hash);
  lenis.stop();
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!anchor) window.scrollTo(0, 0);
  const resume = (): void => {
    lenis.start();
    if (anchor) lenis.scrollTo(anchor, { immediate: true });
    heroIntro();
    ScrollTrigger.refresh();
  };
  // runPreloader bounds its wait to four seconds; retain recovery for unexpected rejection.
  runPreloader().then(resume, (error: unknown) => {
    console.error('Preloader rejected; restoring scrolling and the hero intro.', error);
    $('.loader')?.remove();
    resume();
  }).catch((error: unknown) => console.error('Motion intro failed after scrolling was restored.', error));

  progress();
  rail();
  headings();
  reveals();
  figures();
  numerals();
  educationTimeline();
  steps();
  ministryTrack();
  counters();
  if (document.readyState === 'complete') ScrollTrigger.refresh();
  else window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}

/* ── Hero intro: portrait wipes up, name rises word by word, meta fades ── */
function heroIntro() {
  const name = $('[data-hero-name]')!;
  const words = splitWords(name);
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .to('[data-hero-figure]', { clipPath: 'inset(0 0 0% 0)', duration: 1.6, ease: 'expo.inOut' }, 0)
    .to('[data-hero-figure] img', { scale: 1.06, duration: 2.2, ease: 'expo.out' }, 0.1)
    .to(words, { y: 0, duration: 1.3, stagger: 0.06 }, 0.5)
    .fromTo('[data-hero-crest]', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 1 }, 0.9)
    .fromTo('[data-hero-fade]', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12 }, 1.0);
  // subtle parallax on the hero as it leaves
  gsap.to('[data-hero-figure]', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__copy', { yPercent: 18, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
}

/* ── Top progress line ── */
function progress() {
  gsap.to('.progress i', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 } });
}

/* ── Rail + chapter tag: which chapter is under the reader ── */
function rail() {
  const items = $$('[data-rail]');
  const tagNum = $('[data-tag-num]')!;
  const tagLabel = $('[data-tag-label]')!;
  chapters.forEach((c) => {
    const section = document.getElementById(c.id);
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (!self.isActive) return;
        items.forEach((i) => i.classList.toggle('is-active', i.dataset.rail === c.id));
        tagNum.textContent = c.numeral ? `Ch. ${c.numeral}` : '';
        tagLabel.textContent = c.label;
      },
    });
  });
}

/* ── Display headings and quotes: masked word rise ── */
function headings() {
  $$('[data-split]').forEach((el) => {
    const words = splitWords(el);
    gsap.to(words, {
      y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.035,
      scrollTrigger: { trigger: el, start: 'top 82%', once: true },
    });
  });
}

/* ── Generic reveals, staggered within a group ── */
function reveals() {
  $$('[data-reveal-group]').forEach((group) => {
    const kids = $$('[data-reveal]', group);
    gsap.to(kids, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: group, start: 'top 80%', once: true } });
  });
  $$('[data-reveal]').forEach((el) => {
    if (el.closest('[data-reveal-group]')) return;
    gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  });
}

/* ── Figures: clip-wipe on entry, slow parallax while in view ── */
function figures() {
  $$('[data-figure]').forEach((fig) => {
    const img = $('img', fig);
    gsap.to(fig, { clipPath: 'inset(0% 0 0 0)', duration: 1.5, ease: 'expo.inOut', scrollTrigger: { trigger: fig, start: 'top 85%', once: true } });
    if (img) gsap.fromTo(img, { yPercent: -7, scale: 1.12 }, { yPercent: 7, scale: 1.12, ease: 'none', scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

/* ── Chapter numerals drift against the scroll ── */
function numerals() {
  $$('[data-numeral]').forEach((n) => {
    gsap.fromTo(n, { yPercent: 30, opacity: 0.4 }, { yPercent: -30, opacity: 1, ease: 'none', scrollTrigger: { trigger: n.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

/* ── Education: golden line fills as you read; the sticky year follows the active entry ── */
function educationTimeline() {
  const list = $('.edu__list');
  const line = $('[data-edu-line]');
  const year = $('[data-edu-year]');
  if (!list || !line || !year) return;
  gsap.to(line, { height: '100%', ease: 'none', scrollTrigger: { trigger: list, start: 'top 55%', end: 'bottom 55%', scrub: 0.4 } });
  const entries = $$('[data-edu-entry]');
  let yearSwap: gsap.core.Timeline | undefined;
  entries.forEach((entry, i) => {
    ScrollTrigger.create({
      trigger: entry,
      start: 'top 58%',
      end: 'bottom 58%',
      onToggle: (self) => {
        // Deactivation retains the last active entry until another entry takes over.
        if (!self.isActive) return;
        entries.forEach((e, j) => {
          e.classList.toggle('is-active', j === i);
          e.classList.toggle('is-past', j < i);
        });
        yearSwap?.kill();
        const next = entry.dataset.year ?? '';
        yearSwap = gsap.timeline();
        if (year.textContent !== next) {
          yearSwap
            .to(year, { yPercent: -18, opacity: 0, duration: 0.22, ease: 'power2.in', onComplete: () => { year.textContent = next; } })
            .fromTo(year, { yPercent: 18, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'expo.out' });
        } else {
          yearSwap.to(year, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'expo.out' });
        }
      },
    });
  });
}

/* ── Call to serve: steps draw their rule and rise one after another ── */
function steps() {
  const all = $$('[data-step]');
  if (!all.length) return;
  const timeline = gsap.timeline({
    scrollTrigger: { trigger: '.steps', start: 'top 78%', once: true },
  });
  all.forEach((step, i) => {
    timeline.fromTo(step, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 1.1, ease: 'expo.out',
      onStart: () => { step.classList.add('is-in'); },
    }, i * 0.14);
  });
}

/* ── Ministry: pinned horizontal ledger on wide screens; vertical stack on narrow ── */
function ministryTrack() {
  const pin = $('[data-ministry-pin]');
  const track = $('[data-ministry-track]');
  if (!pin || !track) return;
  const mm = gsap.matchMedia();
  // Runs after matchMedia has reverted the old context and installed the new one.
  ScrollTrigger.addEventListener('matchMedia', () => ScrollTrigger.refresh());
  mm.add('(min-width: 1001px)', () => {
    const distance = (): number => Math.max(0, track.scrollWidth - window.innerWidth);
    if (distance() === 0) return; // No overflow means no pin and no dead scroll.
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => `+=${distance() * 1.15}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
    // Measure the pin before containerAnimation triggers read its scroll range.
    tween.scrollTrigger?.refresh();
    $$('.agency', track).forEach((panel) => {
      gsap.fromTo(panel, { opacity: 0.35 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left 90%', end: 'left 55%', scrub: true, invalidateOnRefresh: true } });
    });
    // matchMedia owns teardown of the pin and every panel trigger in this context.
  });
}

/* ── Numbers: count up once, with real figures ── */
function counters() {
  $$('[data-count]').forEach((el) => {
    const value = Number(el.dataset.count);
    if (!Number.isFinite(value)) {
      console.error('Counter skipped: invalid data-count.', el.dataset.count);
      return;
    }
    const prefix = el.dataset.prefix ?? '';
    const suffix = el.dataset.suffix ?? '';
    const state = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        el.textContent = `${prefix}0${suffix}`;
        gsap.to(state, {
          v: value, duration: 2.2, ease: 'power3.out',
          onUpdate: () => { el.textContent = `${prefix}${Math.round(state.v).toLocaleString('en-NG')}${suffix}`; },
        });
      },
    });
  });
}

// Dev-only hook so browser-automation verification can re-arm the ticker after patching rAF.
if (import.meta.env.DEV) (window as unknown as { __gsap: typeof gsap }).__gsap = gsap;
