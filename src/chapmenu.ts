import { chapters } from './render';

/** Mobile chapter menu: a button that opens the chapter list; closes on selection, Escape, or outside click. */
export function initChapterMenu(): void {
  const btn = document.querySelector<HTMLButtonElement>('[data-chapmenu-toggle]');
  const panel = document.querySelector<HTMLElement>('[data-chapmenu]');
  if (!btn || !panel) return;
  const items = Array.from(panel.querySelectorAll<HTMLAnchorElement>('a[data-chap]'));
  const open = (state: boolean) => {
    panel.hidden = !state;
    btn.setAttribute('aria-expanded', String(state));
    document.documentElement.classList.toggle('chapmenu-open', state);
    if (state) (items.find((i) => i.getAttribute('aria-current') === 'true') ?? items[0])?.focus();
    else if (panel.contains(document.activeElement)) btn.focus();
  };
  btn.addEventListener('click', () => open(Boolean(panel.hidden)));
  items.forEach((a) => a.addEventListener('click', (e) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    open(false);
  }));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { open(false); btn.focus(); } });
  document.addEventListener('click', (e) => { if (!panel.hidden && !panel.contains(e.target as Node) && !btn.contains(e.target as Node)) open(false); });
  document.addEventListener('focusin', (e) => { if (!panel.hidden && !panel.contains(e.target as Node) && !btn.contains(e.target as Node)) open(false); });
  window.matchMedia('(min-width: 1001px)').addEventListener('change', (e) => { if (e.matches) open(false); });
}

/** Reflect the active chapter in the rail, the chapter tag, and the mobile menu. */
export function setActiveChapter(id: string): void {
  const chapter = chapters.find((c) => c.id === id);
  document.querySelectorAll<HTMLElement>('[data-rail], [data-chap]').forEach((el) => {
    const on = (el.dataset.rail ?? el.dataset.chap) === id;
    el.classList.toggle('is-active', on);
    if (on) el.setAttribute('aria-current', 'true'); else el.removeAttribute('aria-current');
  });
  const tagNum = document.querySelector<HTMLElement>('[data-tag-num]');
  const tagLabel = document.querySelector<HTMLElement>('[data-tag-label]');
  const menuLabel = document.querySelector<HTMLElement>('[data-chapmenu-label]');
  if (tagNum) tagNum.textContent = chapter?.numeral ? `Ch. ${chapter.numeral}` : '';
  if (tagLabel) tagLabel.textContent = chapter?.label ?? '';
  if (menuLabel) menuLabel.textContent = chapter?.numeral ? `${chapter.numeral} · ${chapter.label}` : (chapter?.label ?? 'Chapters');
}
