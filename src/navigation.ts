/** Resolve IDs directly: URL fragments are not CSS selectors. */
export function anchorTarget(hash: string): HTMLElement | null {
  if (!hash.startsWith('#') || hash.length < 2) return null;
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
}

export type ScrollToAnchor = (target: HTMLElement, complete: () => void) => void;

/** Use the same focus and history behavior for native and animated navigation. */
export function initAnchorNavigation(scrollTo: ScrollToAnchor): void {
  const navigate = (event: MouseEvent): void => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const hash = link.getAttribute('href') ?? '';
    const target = anchorTarget(hash);
    if (!target) return;
    event.preventDefault();
    scrollTo(target, () => {
      if (!target.hasAttribute('tabindex') && target.tabIndex < 0) target.tabIndex = -1;
      target.focus({ preventScroll: true });
      if (location.hash !== hash) history.pushState(history.state, '', hash);
    });
  };
  document.addEventListener('click', navigate);
  if (import.meta.hot) import.meta.hot.dispose(() => document.removeEventListener('click', navigate));
}
