export function initializeReading() {
  const years = [...document.querySelectorAll<HTMLAnchorElement>('[data-year]')];
  const panels = [...document.querySelectorAll<HTMLElement>('.journey-panel')];
  if (years.length) {
    const selectYear = (id: string) => {
      years.forEach(a => a.setAttribute('aria-current', a.hash === `#${id}` ? 'true' : 'false'));
      panels.forEach(p => p.hidden = p.id !== id);
    };
    years.forEach(a => a.addEventListener('click', event => {
      event.preventDefault();
      selectYear(`year-${a.dataset.year}`);
    }));
    selectYear(panels.some(p => '#' + p.id === location.hash) ? location.hash.slice(1) : panels[0].id);
    window.addEventListener('hashchange', () => {
      if (panels.some(p => '#' + p.id === location.hash)) selectYear(location.hash.slice(1));
    });
    document.querySelector('.journey-panels')?.classList.add('is-enhanced');
  }
  const search = document.querySelector<HTMLInputElement>('#blog-search');
  if (search) {
    document.querySelector<HTMLElement>('[data-blog-tools]')!.hidden = false;
    const filters = [...document.querySelectorAll<HTMLButtonElement>('[data-blog-filter]')];
    const cards = [...document.querySelectorAll<HTMLElement>('[data-blog-card]')];
    let topic = 'All';
    const apply = () => {
      const terms = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
      cards.forEach(card => card.hidden = (topic !== 'All' && card.dataset.topic !== topic) || !terms.every(word => card.dataset.search!.includes(word)));
      const count = cards.filter(card => !card.hidden).length;
      document.querySelector('#blog-status')!.textContent = `${count} article${count === 1 ? '' : 's'}`;
      document.querySelector<HTMLElement>('.blog-empty')!.hidden = count !== 0;
      document.querySelector('#blog-results')!.classList.toggle('is-filtered', terms.length > 0 || topic !== 'All');
      filters.forEach(f => f.setAttribute('aria-pressed', String(f.dataset.blogFilter === topic)));
    };
    search.addEventListener('input', apply);
    filters.forEach(f => f.addEventListener('click', () => { topic = f.dataset.blogFilter!; apply(); }));
    document.querySelector('[data-blog-reset]')?.addEventListener('click', () => { search.value = ''; topic = 'All'; apply(); search.focus(); });
  }
  const body = document.querySelector<HTMLElement>('[data-article-body]');
  const progress = document.querySelector<HTMLElement>('[data-reading-progress]');
  if (body && progress) {
    let scheduled = false;
    const links = [...document.querySelectorAll<HTMLAnchorElement>('.article-aside nav a')];
    const sections = links.map(a => document.getElementById(a.hash.slice(1))!);
    const update = () => {
      const bounds = body.getBoundingClientRect();
      const fraction = Math.min(1, Math.max(0, (innerHeight - bounds.top) / Math.max(1, bounds.height)));
      progress.style.transform = `scaleX(${fraction})`;
      let current = sections[0];
      sections.forEach(section => { if (section.getBoundingClientRect().top < innerHeight * .4) current = section; });
      links.forEach(a => { if (a.hash === '#' + current.id) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
      scheduled = false;
    };
    const schedule = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } };
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    update();
  }
}
