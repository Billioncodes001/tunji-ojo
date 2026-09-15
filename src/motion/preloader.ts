import gsap from 'gsap';

export async function runPreloader(): Promise<void> {
  const el = document.querySelector<HTMLElement>('.loader');
  if (!el) return;
  const bar = el.querySelector<HTMLElement>('.loader__bar i');
  const pct = el.querySelector<HTMLElement>('.loader__pct');
  if (!bar || !pct) {
    console.error('Preloader skipped: missing progress bar or percentage element.');
    el.remove();
    return;
  }
  const state = { v: 0 };
  const paint = () => {
    bar.style.width = `${state.v}%`;
    pct.textContent = String(Math.round(state.v)).padStart(2, '0');
  };
  const heroImg = document.querySelector<HTMLImageElement>('.hero__figure img');
  let imageLoaded: (() => void) | undefined;
  let imageFailed: (() => void) | undefined;
  let minimumTimer: ReturnType<typeof setTimeout> | undefined;
  let ceilingTimer: ReturnType<typeof setTimeout> | undefined;
  let creep: gsap.core.Tween | undefined;
  let outro: gsap.core.Timeline | undefined;
  // One ceiling bounds both asset readiness and the outro, even if the ticker stalls.
  const ceiling = new Promise<never>((_, reject) => {
    ceilingTimer = setTimeout(() => reject(new Error('Preloader exceeded its 4000 ms ceiling.')), 4000);
  });

  try {
    creep = gsap.to(state, { v: 86, duration: 1.6, ease: 'power2.out', onUpdate: paint });
    const fontsReady: Promise<unknown> = document.fonts?.ready ?? Promise.resolve();
    const imgReady = heroImg && !heroImg.complete
      ? new Promise<void>((resolve, reject) => {
        imageLoaded = resolve;
        imageFailed = () => reject(new Error(`Preloader hero image failed: ${heroImg.currentSrc || heroImg.src}`));
        heroImg.addEventListener('load', imageLoaded, { once: true });
        heroImg.addEventListener('error', imageFailed, { once: true });
      })
      : heroImg && heroImg.naturalWidth === 0
        ? Promise.reject(new Error(`Preloader hero image failed: ${heroImg.currentSrc || heroImg.src}`))
        : Promise.resolve();
    const minimum = new Promise<void>((resolve) => { minimumTimer = setTimeout(resolve, 1100); });
    await Promise.race([Promise.all([fontsReady, imgReady, minimum]), ceiling]);
    creep.kill();
    await Promise.race([new Promise<void>((resolve) => {
      outro = gsap.timeline({ onComplete: resolve })
        .to(state, { v: 100, duration: 0.45, ease: 'power2.inOut', onUpdate: paint })
        .to(el.querySelectorAll('.loader__name, .loader__meta'), { yPercent: -40, opacity: 0, duration: 0.55, ease: 'power3.in', stagger: 0.05 }, '+=0.12')
        .to(el, { clipPath: 'inset(0 0 100% 0)', duration: 1.0, ease: 'expo.inOut' }, '-=0.25');
    }), ceiling]);
  } catch (error: unknown) {
    // A stalled ticker in a background tab is expected, not a fault; only a real asset failure is worth an error.
    const stalled = document.hidden || (error instanceof Error && error.message.includes('ceiling'));
    if (stalled) console.info('Preloader cut short; revealing the page.');
    else console.error('Preloader failed; revealing the page.', error);
  } finally {
    clearTimeout(ceilingTimer);
    clearTimeout(minimumTimer);
    if (imageLoaded) heroImg?.removeEventListener('load', imageLoaded);
    if (imageFailed) heroImg?.removeEventListener('error', imageFailed);
    creep?.kill();
    outro?.kill();
    el.remove();
  }
}
