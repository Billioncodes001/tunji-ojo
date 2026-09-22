import { renderPage, esc } from '../../../src/editorial/render'
import { pageMeta, structuredData } from '../../../src/editorial/seo'
import type { BlogPost } from '../../../src/editorial/blog'
import { styles, scripts } from '../generated/assets'
export const siteURL = 'https://olubunmitunjiojo.com/'
export function documentHTML({ route, title, description, posts, content, noindex = false, canonical, preview = false }: { route: string; title: string; description: string; posts: BlogPost[]; content?: string; noindex?: boolean; canonical?: string; preview?: boolean }) {
 const meta = pageMeta(route, title, description, posts)
 const resolvedTitle = content ? title : meta.title
 const resolvedDescription = content ? description : meta.description
 const url = canonical || `${siteURL}${route ? route + '/' : ''}`
 const image = new URL(meta.image, siteURL).href
 const schema = structuredData(route, title, description, siteURL, posts)
 return `<!doctype html><html lang="en-NG"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(resolvedTitle)}</title><meta name="description" content="${esc(resolvedDescription)}"><link rel="canonical" href="${esc(url)}"><meta name="robots" content="${noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}"><meta property="og:title" content="${esc(resolvedTitle)}"><meta property="og:description" content="${esc(resolvedDescription)}"><meta property="og:url" content="${esc(url)}"><meta property="og:type" content="${meta.type}"><meta property="og:image" content="${esc(image)}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/favicon.svg"><link rel="alternate" type="application/rss+xml" title="The Tunji-Ojo Journal" href="${siteURL}feed.xml">${styles}<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script></head><body>${preview ? '<div class="preview-banner">Private editorial preview · This draft is not published. <a href="/admin/collections/posts">Return to the newsroom ↗</a></div>' : ''}<div id="app">${renderPage(route, '/', siteURL, posts, content)}</div>${scripts}</body></html>`
}
export const htmlResponse = (html: string, status = 200, privatePage = false) => new Response(html, { status, headers: { 'Content-Type':'text/html; charset=utf-8', 'Cache-Control': privatePage ? 'private, no-store' : 'public, max-age=0, must-revalidate', 'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'strict-origin-when-cross-origin', ...(privatePage ? {'X-Robots-Tag':'noindex, nofollow'} : {}) } })
