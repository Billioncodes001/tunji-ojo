import "@fontsource-variable/oswald/index.css";
import "@fontsource-variable/instrument-sans/index.css";
import "./editorial/site.css";
import { initializeHero } from "./editorial/hero";
import { renderPage, esc } from "./editorial/render";
import { photographs, films } from "./editorial/media";
const base = import.meta.env.BASE_URL;
const route = decodeURIComponent(location.pathname)
  .slice(base.length)
  .replace(/^\/+|\/+$/g, "")
  .replace(/index\.html$/, "");
const app = document.querySelector<HTMLDivElement>("#app")!;
if (!app.querySelector("main")) app.innerHTML = renderPage(route, base);
initializeHero();
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const menu = document.querySelector<HTMLDialogElement>("#menu-dialog")!;
const media = document.querySelector<HTMLDialogElement>("#media-dialog")!;
const mediaContent = document.querySelector<HTMLDivElement>("#media-content")!;
let opener: HTMLElement | null = null;
function openDialog(dialog: HTMLDialogElement) {
  opener = document.activeElement as HTMLElement;
  dialog.showModal();
  document.dispatchEvent(new Event("site:dialogchange"));
  document.body.classList.add("modal-open");
  dialog.querySelector<HTMLButtonElement>("[data-close]")?.focus();
}
for (const dialog of [menu, media]) {
  dialog
    .querySelector("[data-close]")
    ?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    if (dialog === media) mediaContent.replaceChildren();
    document.dispatchEvent(new Event("site:dialogchange"));
    opener?.focus();
  });
}
document
  .querySelector(".menu-toggle")
  ?.addEventListener("click", () => openDialog(menu));
const photoButtons = [
  ...document.querySelectorAll<HTMLButtonElement>("[data-photo]"),
];
let visiblePhotos = photoButtons.map((b) => b.dataset.photo!);
let currentPhoto = 0;
function displayPhoto(index: number) {
  currentPhoto = (index + visiblePhotos.length) % visiblePhotos.length;
  const p = photographs.find((p) => p.id === visiblePhotos[currentPhoto])!;
  document.querySelector("#media-kind")!.textContent =
    `Photograph ${currentPhoto + 1} / ${visiblePhotos.length}`;
  mediaContent.innerHTML = `<div class="media-layout"><div class="media-visual"><img src="${base}images/optimized/${p.id}.webp" alt="${esc(p.description)}"></div><div class="media-info"><p class="eyebrow">${p.category}</p><h2 id="media-title">${esc(p.title)}</h2><p>${esc(p.description)}</p><p>Photography: ${esc(p.credit)}</p><a class="source" href="${esc(p.source)}" target="_blank" rel="noopener noreferrer">View original source ↗</a><div class="lightbox-controls"><button aria-label="Previous photograph" data-previous>←</button><button aria-label="Next photograph" data-next>→</button></div><p class="eyebrow">Use ← → to browse · Esc to close</p></div></div>`;
  mediaContent
    .querySelector("[data-previous]")
    ?.addEventListener("click", () => {
      displayPhoto(currentPhoto - 1);
      mediaContent.querySelector<HTMLButtonElement>("[data-previous]")?.focus();
    });
  mediaContent.querySelector("[data-next]")?.addEventListener("click", () => {
    displayPhoto(currentPhoto + 1);
    mediaContent.querySelector<HTMLButtonElement>("[data-next]")?.focus();
  });
}
photoButtons.forEach((b) =>
  b.addEventListener("click", () => {
    displayPhoto(visiblePhotos.indexOf(b.dataset.photo!));
    openDialog(media);
  }),
);
media.addEventListener("keydown", (e) => {
  if (!mediaContent.querySelector("[data-next]")) return;
  if (e.key === "ArrowRight") {
    e.preventDefault();
    displayPhoto(currentPhoto + 1);
  }
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    displayPhoto(currentPhoto - 1);
  }
});
let touchX = 0;
mediaContent.addEventListener(
  "touchstart",
  (e) => {
    touchX = e.changedTouches[0].clientX;
  },
  { passive: true },
);
mediaContent.addEventListener(
  "touchend",
  (e) => {
    if (!mediaContent.querySelector("[data-next]")) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 65) displayPhoto(currentPhoto + (dx < 0 ? 1 : -1));
  },
  { passive: true },
);
document
  .querySelectorAll<HTMLButtonElement>("[data-filter]")
  .forEach((button) =>
    button.addEventListener("click", () => {
      document
        .querySelectorAll("[data-filter]")
        .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
      photoButtons.forEach((b) => {
        b.hidden =
          button.dataset.filter !== "All" &&
          b.dataset.category !== button.dataset.filter;
      });
      visiblePhotos = photoButtons
        .filter((b) => !b.hidden)
        .map((b) => b.dataset.photo!);
      document.querySelector("#gallery-status")!.textContent =
        `${visiblePhotos.length} photograph${visiblePhotos.length === 1 ? "" : "s"}`;
    }),
  );
document.querySelectorAll<HTMLElement>("[data-film]").forEach((b) =>
  b.addEventListener("click", () => {
    const f = films.find((f) => f.id === b.dataset.film)!;
    document.querySelector("#media-kind")!.textContent = "Watch & listen";
    mediaContent.innerHTML = `<div class="media-layout"><div class="media-visual"><iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/${f.youtube}?autoplay=1&rel=0" title="${esc(f.title)} — ${f.publisher}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><div class="media-info"><p class="eyebrow">${f.publisher} · ${f.date}</p><h2 id="media-title">${f.title}</h2><p>${f.description}</p><p>Playback is provided by YouTube. If the embedded player is unavailable, open the original recording.</p><a class="text-link" href="https://www.youtube.com/watch?v=${f.youtube}" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a><a class="source" href="${f.source}" target="_blank" rel="noopener noreferrer">Original broadcast reporting ↗</a></div></div>`;
    openDialog(media);
  }),
);
let toastTimer: ReturnType<typeof setTimeout>;
function status(message: string) {
  const node = document.querySelector("#action-status")!;
  node.textContent = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (node.textContent = ""), 5000);
}
document.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((b) =>
  b.addEventListener("click", async () => {
    const node = document.getElementById(b.dataset.copy!)!;
    try {
      await navigator.clipboard.writeText(node.textContent ?? "");
      status("Copied to your clipboard.");
    } catch {
      const range = document.createRange();
      range.selectNodeContents(node);
      const selection = getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      status("Text selected. Use your device’s Copy command.");
    }
  }),
);
document
  .querySelector("[data-print]")
  ?.addEventListener("click", () => window.print());
if (!reduced.matches) {
  const revealObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          revealObserver.unobserve(e.target);
        }
      }),
    { threshold: 0.12 },
  );
  document
    .querySelectorAll(".reveal")
    .forEach((el) => revealObserver.observe(el));
  const countObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        countObserver.unobserve(e.target);
        const el = e.target as HTMLElement;
        const end = Number(el.dataset.count);
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / 1400, 1);
          el.textContent = Math.round(
            end * (1 - Math.pow(1 - progress, 3)),
          ).toLocaleString("en-NG");
          if (progress < 1 && !reduced.matches) requestAnimationFrame(tick);
          else el.textContent = end.toLocaleString("en-NG");
        };
        requestAnimationFrame(tick);
      }),
    { threshold: 1 },
  );
  document
    .querySelectorAll("[data-count]")
    .forEach((el) => countObserver.observe(el));
}
