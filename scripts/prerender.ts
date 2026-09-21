import { mkdir, readFile, writeFile } from "node:fs/promises";
import { pages, renderPage, esc } from "../src/editorial/render";
const base = process.env.SITE_BASE ?? "/";
const origin = process.env.SITE_ORIGIN ?? "https://billioncodes001.github.io";
const productionBase = process.env.SITE_BASE ?? "/tunji-ojo/";
const template = await readFile("dist/index.html", "utf8");
for (const [route, title, description] of [
  ...pages,
  [
    "404",
    "Page not found",
    "Explore the documented record of Olubunmi Tunji-Ojo.",
  ],
]) {
  const canonical = `${origin}${productionBase}${route ? route + "/" : ""}`;
  const pageTitle = route
    ? `${title} — Olubunmi Tunji-Ojo`
    : "Olubunmi Tunji-Ojo — A Life in Service";
  let html = template
    .replace(
      '<div id="app"></div>',
      () => `<div id="app">${renderPage(route, base)}</div>`,
    )
    .replace(/<title>.*?<\/title>/, () => `<title>${esc(pageTitle)}</title>`)
    .replace(
      /(<meta (?:name|property)="(?:description|og:description|twitter:description)" content=")[^"]*("\s*\/?>)/g,
      (_match, prefix, suffix) => `${prefix}${esc(description)}${suffix}`,
    )
    .replace(
      /(<link rel="canonical" href=")[^"]*/,
      () => `<link rel="canonical" href="${canonical}`,
    )
    .replace(
      /(<meta property="og:url" content=")[^"]*/,
      () => `<meta property="og:url" content="${canonical}`,
    )
    .replace(
      /(<meta (?:property|name)="(?:og:title|twitter:title)" content=")[^"]*/g,
      (match) => match.replace(/content=".*/, 'content="' + esc(pageTitle)),
    );
  if (route === "404") {
    await writeFile("dist/404.html", html);
    continue;
  }
  const directory = route ? `dist/${route}` : "dist";
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, html);
}
await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(([p]) => `<url><loc>${origin}${productionBase}${p ? p + "/" : ""}</loc></url>`).join("")}</urlset>`,
);
await writeFile(
  "dist/robots.txt",
  `User-agent: *\nAllow: /\nSitemap: ${origin}${productionBase}sitemap.xml\n`,
);
console.log(`Prerendered ${pages.length} pages, a 404 page and sitemap.`);
