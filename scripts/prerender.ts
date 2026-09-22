import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { pages, renderPage, esc } from '../src/editorial/render';
import { blogPosts, postRoute } from '../src/editorial/blog';
import { pageMeta, structuredData } from '../src/editorial/seo';
import { photoById } from '../src/editorial/media';
import { siteConfig } from './site-config';
const base = process.env.SITE_BASE ?? '/';
const { base: productionBase, url: siteUrl } = siteConfig();
const assetBase = process.env.SITE_URL ? productionBase : base;
const template = await readFile('dist/index.html', 'utf8');
export const routes: readonly (readonly [string, string, string])[] = [
 ...pages, ...blogPosts.map(p => [postRoute(p), p.title, p.excerpt] as const),
];
for (const [route, title, description] of [...routes, ['404', 'Page not found', 'Explore the documented record of Olubunmi Tunji-Ojo.']]) {
 const canonical = `${siteUrl}${route ? route + '/' : ''}`;
 const meta = pageMeta(route, title, description);
 let html = template
  .replace('<div id="app"></div>', () => `<div id="app">${renderPage(route, assetBase, siteUrl)}</div>`)
  .replace(/<title>.*?<\/title>/, () => `<title>${esc(meta.title)}</title>`)
  .replace(/(<meta (?:name|property)="(?:description|og:description|twitter:description)" content=")[^"]*("\s*\/?>)/g, (_m, prefix, suffix) => `${prefix}${esc(meta.description)}${suffix}`)
  .replace(/(<link rel="canonical" href=")[^"]*/, () => `<link rel="canonical" href="${canonical}`)
  .replace(/(<meta property="og:url" content=")[^"]*/, () => `<meta property="og:url" content="${canonical}`)
  .replace(/(<meta (?:property|name)="(?:og:title|twitter:title)" content=")[^"]*/g, (_m, prefix) => `${prefix}${esc(meta.title)}`)
  .replace(/(<meta (?:property|name)="(?:og:image|twitter:image)" content=")[^"]*/g, (_m, prefix) => `${prefix}${siteUrl}${meta.image}`)
  .replace(/(<meta property="og:type" content=")[^"]*/, (_m, prefix) => `${prefix}${meta.type}`)
  .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, () => `<script type="application/ld+json">${JSON.stringify(structuredData(route, title, description, siteUrl)).replace(/</g, '\\u003c')}</script>`);
 if (meta.post) {
  html = html.replace(/\s*<meta property="og:image:(?:width|height)"[^>]+>/g, '')
   .replace(/(<meta property="og:image:alt" content=")[^"]*/, (_m, prefix) => `${prefix}${esc(photoById(meta.post!.image).description)}`)
   .replace('</head>', `<meta property="article:published_time" content="${meta.post.date}T00:00:00+01:00"><meta property="article:section" content="${esc(meta.post.category)}"></head>`);
 }
 html = html.replace('</head>', `<link rel="alternate" type="application/rss+xml" title="Tunji-Ojo Blog" href="${siteUrl}feed.xml"><meta name="robots" content="${route === '404' ? 'noindex, follow' : 'index, follow, max-image-preview:large'}"></head>`);
 if (route === '404') { await writeFile('dist/404.html', html); continue; }
 const directory = route ? `dist/${route}` : 'dist';
 await mkdir(directory, { recursive: true });
 await writeFile(`${directory}/index.html`, html);
}
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(([route]) => {
 const post = blogPosts.find(p => postRoute(p) === route);
 return `<url><loc>${siteUrl}${route ? route + '/' : ''}</loc>${post ? `<lastmod>${post.date}</lastmod>` : ''}</url>`;
}).join('')}</urlset>`);
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${siteUrl}sitemap.xml\n`);
await writeFile('dist/feed.xml', `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Olubunmi Tunji-Ojo Blog — Independent Profile</title><link>${siteUrl}blog/</link><description>Original explainers on public service, with dated sources.</description><language>en-ng</language><atom:link href="${siteUrl}feed.xml" rel="self" type="application/rss+xml"/>${blogPosts.map(p => `<item><title>${esc(p.title)}</title><link>${siteUrl}${postRoute(p)}/</link><guid isPermaLink="true">${siteUrl}${postRoute(p)}/</guid><pubDate>${new Date(p.date + 'T00:00:00+01:00').toUTCString()}</pubDate><description>${esc(p.excerpt)}</description><category>${esc(p.category)}</category></item>`).join('')}</channel></rss>`);
console.log(`Prerendered ${routes.length} pages, a 404 page, sitemap and RSS feed.`);
