import { mkdir, readFile, writeFile } from "node:fs/promises";
import { pages, renderPage, esc } from "../src/editorial/render";
import { channels } from "../src/editorial/channels";
import { siteConfig } from "./site-config";
const base = process.env.SITE_BASE ?? "/";
const { origin, base: productionBase, url: siteUrl } = siteConfig();
const assetBase = process.env.SITE_URL ? productionBase : base;
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
      () => `<div id="app">${renderPage(route, assetBase, siteUrl)}</div>`,
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
    )
    .replace(/(<meta (?:property|name)="(?:og:image|twitter:image)" content=")[^"]*/g,
      (_match, prefix) => `${prefix}${siteUrl}images/share-card.jpg`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      (script) => {
        const person = JSON.parse(script.replace(/<[^>]+>/g, ""));
        person.url = siteUrl;
        person.image = `${siteUrl}images/optimized/official-portrait.webp`;
        person.sameAs = ["https://bto.ng/", ...channels.map(c => c.url)];
        return `<script type="application/ld+json">${JSON.stringify(person).replace(/</g, "\\u003c")}</script>`;
      });
  if (route === "404") {
    html = html.replace("</head>", '<meta name="robots" content="noindex, follow"></head>');
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
