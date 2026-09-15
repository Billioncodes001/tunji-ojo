import '@fontsource-variable/fraunces/full.css';
import '@fontsource-variable/fraunces/full-italic.css';
import '@fontsource-variable/manrope';
import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';
import './styles/motion.css';
import { chapters, renderApp } from './render';
import { initObsidian } from './gl/obsidian';

const root = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
root.classList.add(reduced ? 'no-motion' : 'motion');

const app = document.getElementById('app');
if (!app) throw new Error('Cannot render the page: missing #app element.');
app.innerHTML = renderApp();

const canvas = document.getElementById('gl') as HTMLCanvasElement | null;
if (!canvas || !initObsidian(canvas)) root.classList.add('no-gl');

if (!reduced) {
  // Native module loading has no abort API; the browser owns its network wait.
  import('./motion').then((m) => m.initMotion()).catch((error: unknown) => {
    console.error('Motion initialisation failed; revealing the static page.', error);
    root.classList.remove('motion', 'lenis-stopped');
    root.classList.add('no-motion');
    document.querySelector('.loader')?.remove();
    trackStaticChapters();
  });
} else {
  document.querySelector('.loader')?.remove();
  trackStaticChapters();
}

/* ── Static chapter tracking ── */
function trackStaticChapters(): void {
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-rail]'));
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter]'));
  const tagNum = document.querySelector<HTMLElement>('[data-tag-num]');
  const tagLabel = document.querySelector<HTMLElement>('[data-tag-label]');
  const update = (): void => {
    // Recompute on entry AND exit; nearest chapter wins in gaps and after large jumps.
    const centre = window.innerHeight / 2;
    let active: HTMLElement | undefined;
    let nearest = Infinity;
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const distance = Math.max(rect.top - centre, centre - rect.bottom, 0);
      if (distance < nearest) { active = section; nearest = distance; }
    });
    const chapter = chapters.find((c) => c.id === active?.id);
    items.forEach((item) => item.classList.toggle('is-active', item.dataset.rail === chapter?.id));
    if (tagNum) tagNum.textContent = chapter?.numeral ? `Ch. ${chapter.numeral}` : '';
    if (tagLabel) tagLabel.textContent = chapter?.label ?? '';
  };
  let io: IntersectionObserver | undefined;
  const disconnect = (): void => io?.disconnect();
  const observe = (): void => {
    disconnect();
    // Observer percentages use width; pixels keep this band tied to viewport height.
    const inset = window.innerHeight * 0.45;
    io = new IntersectionObserver(update, { rootMargin: `-${inset}px 0px -${inset}px 0px` });
    sections.forEach((section) => io?.observe(section));
    update();
  };
  const restore = (event: PageTransitionEvent): void => {
    if (event.persisted) observe(); // Ordinary loads are already observed below.
  };
  observe();
  window.addEventListener('pagehide', disconnect);
  window.addEventListener('pageshow', restore);
  window.addEventListener('resize', observe);
  if (import.meta.hot) import.meta.hot.dispose(() => {
    disconnect();
    window.removeEventListener('pagehide', disconnect);
    window.removeEventListener('pageshow', restore);
    window.removeEventListener('resize', observe);
  });
}

/* Dev-only: `?from=<chapter-id>` shifts the document so headless screenshots can frame a chapter without scrolling. */
if (import.meta.env.DEV) {
  const from = new URLSearchParams(location.search).get('from');
  const target = from ? document.getElementById(from) : null;
  if (target) {
    const offset = Number(new URLSearchParams(location.search).get('offset') ?? 0);
    document.body.style.marginTop = `${-(target.offsetTop + offset)}px`;
  }
}
