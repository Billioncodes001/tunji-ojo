/** A silent local film, loaded only when playback is allowed or requested. */
export function initializeHero() {
  const hero = document.querySelector<HTMLElement>(".hero");
  const video = hero?.querySelector<HTMLVideoElement>("[data-hero-video]");
  const button = hero?.querySelector<HTMLButtonElement>("[data-hero-toggle]");
  if (!hero || !video || !button) return;

  type Connection = EventTarget & {
    saveData?: boolean;
    effectiveType?: string;
  };
  const connection = (navigator as Navigator & { connection?: Connection })
    .connection;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let visible = true;
  let manuallyPaused = false;
  let explicitPlay = false;
  let loaded = false;
  let failed = false;
  let attempt = 0;

  const prefersStill = () =>
    reduced.matches ||
    connection?.saveData ||
    ["slow-2g", "2g"].includes(connection?.effectiveType ?? "");
  const isPlaying = () => !video.paused && !video.ended;
  const updateControl = () => {
    const playing = isPlaying();
    button.dataset.state = playing ? "playing" : "paused";
    button.setAttribute(
      "aria-label",
      playing ? "Pause background video" : "Play background video",
    );
    button.querySelector("[data-hero-control-label]")!.textContent = playing
      ? "Pause film"
      : "Play film";
  };
  const sync = () => {
    const currentAttempt = ++attempt;
    const allowed =
      !failed &&
      !manuallyPaused &&
      (explicitPlay || !prefersStill()) &&
      visible &&
      !document.hidden &&
      !document.querySelector("dialog[open]");
    if (!allowed) {
      video.pause();
      updateControl();
      return;
    }
    if (!loaded) {
      video
        .querySelectorAll<HTMLSourceElement>("source[data-src]")
        .forEach((source) => (source.src = source.dataset.src!));
      video.load();
      loaded = true;
    }
    video.muted = true;
    void video.play().catch(() => {
      // A user pause or an offscreen transition can interrupt a pending play().
      if (currentAttempt !== attempt) return;
      manuallyPaused = true;
      updateControl();
    });
  };
  button.hidden = false;
  button.addEventListener("click", () => {
    if (isPlaying()) manuallyPaused = true;
    else {
      manuallyPaused = false;
      explicitPlay = true;
    }
    sync();
  });
  video.addEventListener("playing", () => {
    hero.classList.add("has-film");
    updateControl();
  });
  video.addEventListener("pause", updateControl);
  const markFailed = () => {
    failed = true;
    ++attempt;
    video.pause();
    hero.classList.remove("has-film");
    button.hidden = true;
  };
  video.addEventListener("error", markFailed);
  const sources = [...video.querySelectorAll<HTMLSourceElement>("source")];
  const failedSources = new Set<HTMLSourceElement>();
  sources.forEach((source) =>
    source.addEventListener("error", () => {
      failedSources.add(source);
      if (failedSources.size === sources.length) markFailed();
    }),
  );
  const preferencesChanged = () => {
    explicitPlay = false;
    if (prefersStill()) hero.classList.remove("has-film");
    sync();
  };
  reduced.addEventListener("change", preferencesChanged);
  connection?.addEventListener("change", preferencesChanged);
  document.addEventListener("visibilitychange", sync);
  document.addEventListener("site:dialogchange", sync);
  window.addEventListener("pagehide", () => {
    ++attempt;
    video.pause();
  });
  window.addEventListener("pageshow", sync);
  new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      sync();
    },
    { threshold: 0 },
  ).observe(hero);
  updateControl();
  sync();
}
