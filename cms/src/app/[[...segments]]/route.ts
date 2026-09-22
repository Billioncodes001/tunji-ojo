import { getPayload, type Where } from 'payload'
import config from '@payload-config'
import { pages, esc } from '../../../../src/editorial/render'
import { postRoute } from '../../../../src/editorial/blog'
import { toArticle } from '../../lib/articles'
import { magazine } from '../../lib/magazine'
import { documentHTML, htmlResponse, siteURL } from '../../lib/page'
import { isStaff } from '../../lib/access'
export const dynamic = 'force-dynamic'
export async function GET(request: Request, { params }: { params: Promise<{ segments?: string[] }> }) {
 const route = ((await params).segments || []).join('/')
 const url = new URL(request.url)
 const payload = await getPayload({ config })
 const published: Where = { _status: { equals: 'published' } }
 const publicOptions = { overrideAccess: false as const, user: null, draft: false, depth: 2 }
 if (route === 'robots.txt') return new Response(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\nDisallow: /preview\nSitemap: ${siteURL}sitemap.xml\n`, { headers: {'Content-Type':'text/plain'} })
 if (route === 'sitemap.xml' || route === 'feed.xml') {
  const docs = []
  let page = 1
  while (true) {
   const result = await payload.find({ collection: 'posts', ...publicOptions, where: published, page, limit: 200, sort: '-publishedAt' })
   docs.push(...result.docs)
   if (!result.hasNextPage || route === 'feed.xml') break
   page++
  }
  const posts = docs.map(toArticle)
  if (route === 'feed.xml') return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>The Tunji-Ojo Journal</title><link>${siteURL}blog/</link><description>Independent reporting and context on public service.</description><atom:link href="${siteURL}feed.xml" rel="self" type="application/rss+xml"/>${posts.map(p=>`<item><title>${esc(p.title)}</title><description>${esc(p.excerpt)}</description><link>${siteURL}${postRoute(p)}/</link><guid>${siteURL}${postRoute(p)}/</guid><pubDate>${new Date(p.date).toUTCString()}</pubDate></item>`).join('')}</channel></rss>`,{headers:{'Content-Type':'application/rss+xml; charset=utf-8'}})
  const [categories, authors] = await Promise.all([payload.find({collection:'categories',overrideAccess:false,limit:1000}),payload.find({collection:'authors',overrideAccess:false,limit:1000})])
  const links = [...pages.map(p=>({route:p[0],date:''})), ...posts.map(p=>({route:postRoute(p),date:p.updatedAt || p.date})), ...categories.docs.map(c=>({route:`blog/topic/${c.slug}`,date:''})),...authors.docs.map(a=>({route:`blog/author/${a.slug}`,date:''}))]
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${links.map(l=>`<url><loc>${siteURL}${l.route ? l.route+'/' : ''}</loc>${l.date?`<lastmod>${l.date}</lastmod>`:''}</url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml; charset=utf-8'}})
 }
 const notFound = () => htmlResponse(documentHTML({route:'404',title:'Page not found — Tunji-Ojo Journal',description:'Find another article in the journal.',posts:[],noindex:true}),404)
 if (route.startsWith('preview/')) {
  const { user } = await payload.auth({headers:request.headers})
  if (!isStaff(user)) return new Response(null,{status:302,headers:{Location:'/admin/login','Cache-Control':'private, no-store'}})
  try {
   const doc = await payload.findByID({ collection:'posts',id:route.split('/')[1],draft:true,overrideAccess:false,user,depth:2 })
   const post = toArticle(doc)
   return htmlResponse(documentHTML({route:postRoute(post),title:post.title,description:post.excerpt,posts:[post],preview:true,noindex:true}),200,true)
  } catch { return notFound() }
 }
 if (route === 'blog' || route.startsWith('blog/topic/') || route.startsWith('blog/author/')) {
  const categories = await payload.find({ collection:'categories',overrideAccess:false,limit:100,sort:'name' })
  let title: string | undefined; let description: string | undefined
  const conditions: Where[] = [published]
  if (route.startsWith('blog/topic/')) {
   const category = categories.docs.find(c=>`blog/topic/${c.slug}`===route)
   if (!category) return notFound()
   title=category.name;description=category.description;conditions.push({category:{equals:category.id}})
  }
  if (route.startsWith('blog/author/')) {
   const result = await payload.find({collection:'authors',overrideAccess:false,where:{slug:{equals:route.split('/')[2]}},limit:1})
   const author=result.docs[0];if(!author || route.split('/').length!==3) return notFound()
   title=author.name;description=author.bio;conditions.push({author:{equals:author.id}})
  }
  const q=(url.searchParams.get('q')||'').trim().slice(0,120)
  if(q) conditions.push({or:[{title:{contains:q}},{excerpt:{contains:q}},{takeaway:{contains:q}}]})
  const rawPage=url.searchParams.get('page')||'1'
  if (!/^[1-9][0-9]*$/.test(rawPage) || Number(rawPage)>10000) return notFound()
  const page=Number(rawPage)
  const result=await payload.find({collection:'posts',...publicOptions,where:{and:conditions},limit:9,page,sort:'-publishedAt'})
  if(page>Math.max(1,result.totalPages)) return notFound()
  const posts=result.docs.map(toArticle)
  const pathname=`/${route}/`
  const content=magazine({posts,categories:categories.docs,title,description,page,totalPages:result.totalPages,totalDocs:result.totalDocs,pathname,query:q})
  return htmlResponse(documentHTML({route,title:`${title || 'Olubunmi Tunji-Ojo Journal'}${page>1?` — Page ${page}`:''} | Public Service in Context`,description:description||'Explore original articles on Olubunmi Tunji-Ojo’s background, public office and Interior record, with source references and editorial context.',posts,content,noindex:!!q,canonical:`${siteURL}${route}/${page>1?`?page=${page}`:''}`}))
 }
 if (route.startsWith('blog/')) {
  const result=await payload.find({collection:'posts',...publicOptions,where:{and:[published,{slug:{equals:route.slice(5)}}]},limit:1})
  if(!result.docs[0]) return notFound()
  const post=toArticle(result.docs[0])
  const related=await payload.find({collection:'posts',...publicOptions,where:{and:[published,{id:{not_equals:result.docs[0].id}}]},limit:3,sort:'-publishedAt'})
  return htmlResponse(documentHTML({route,title:post.title,description:post.excerpt,posts:[post,...related.docs.map(toArticle)]}))
 }
 const page=pages.find(p=>p[0]===route)
 if(!page) return notFound()
 const recent=await payload.find({collection:'posts',...publicOptions,where:published,limit:3,sort:'-publishedAt'})
 return htmlResponse(documentHTML({route,title:page[1]+' — Olubunmi Tunji-Ojo',description:page[2],posts:recent.docs.map(toArticle)}))
}
