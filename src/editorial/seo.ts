import { blogPosts, blogAuthor, postRoute, type BlogPost } from './blog';
import { channels } from './channels';
export const pageDescriptions: Record<string, string> = {
  '': 'Explore Olubunmi Tunji-Ojo’s biography, public service and Ministry of Interior record. An independent profile with photographs, videos and sourced articles.',
  story: 'Read Olubunmi Tunji-Ojo’s biography: his Akoko roots, education, engineering career and journey into public service, with sources for the key milestones.',
  interior: 'Explore Olubunmi Tunji-Ojo’s Ministry of Interior record: immigration, passports, correctional services, civil defence and fire safety, with dated sources.',
  offices: 'Follow Olubunmi Tunji-Ojo’s public-office timeline, from representing Akoko in the House of Representatives to his 2023 appointment as Minister of Interior.',
  community: 'Read the documented constituency record of Olubunmi Tunji-Ojo in Akoko: education, roads, scholarships and community projects, linked to original reporting.',
  honours: 'Explore awards and honours associated with Olubunmi Tunji-Ojo, with dates, original reporting and photographs from the public record.',
  media: 'Browse photographs and watch interviews and reports featuring Olubunmi Tunji-Ojo. Explore a visual archive with captions, dates and original-source credits.',
  words: 'Read selected public statements by Olubunmi Tunji-Ojo on passports, public service and national priorities, with context and links to original reporting.',
  news: 'Browse selected 2024 dispatches from Olubunmi Tunji-Ojo’s official archive, covering airport e-gates, ministry retreats, recognition and Kuje renovations.',
  letter: 'Read the attributed NANS Southwest Zone D letter assessing Olubunmi Tunji-Ojo’s public service and its impact on the student constituency.',
  faq: 'Find answers about Olubunmi Tunji-Ojo’s background, public office and Interior record, plus the sources and independent status of this profile.',
  press: 'Find a concise Olubunmi Tunji-Ojo biography, credited photographs and original references for research, press enquiries and further reading.',
  sources: 'Explore the sources behind this independent Olubunmi Tunji-Ojo profile, including public reporting, photographic credits and the blog’s editorial approach.',
  privacy: 'Learn how this independent Olubunmi Tunji-Ojo website handles privacy, local media, links to external websites and optional YouTube playback.',
  share: 'Share a starting point for exploring Olubunmi Tunji-Ojo’s documented biography, public service and Ministry of Interior record.',
  connect: 'Find Olubunmi Tunji-Ojo’s verified social channels and links to official office contacts, the Ministry of Interior and Nigeria Immigration Service.',
};
const pageTitles: Record<string, string> = {
  '': 'Olubunmi Tunji-Ojo | Biography, Public Service & Blog',
  story: 'Olubunmi Tunji-Ojo Biography | Education & Career',
  interior: 'Olubunmi Tunji-Ojo | Ministry of Interior Record',
  offices: 'Olubunmi Tunji-Ojo | Public Office & Career Timeline',
  blog: 'Olubunmi Tunji-Ojo Blog | Public Service in Context',
};
export function pageMeta(route: string, title: string, description: string, posts: BlogPost[] = blogPosts) {
 const post = posts.find(p => postRoute(p) === route);
 return {
  title: post ? `${post.title} | Tunji-Ojo Blog` : pageTitles[route] ?? `${title} — Olubunmi Tunji-Ojo`,
  description: post?.excerpt ?? pageDescriptions[route] ?? description,
  image: post ? (post.cover?.url ?? `images/optimized/${post.image}.webp`) : 'images/share-card.jpg',
  type: post ? 'article' : 'website',
  post,
 };
}
export function structuredData(route: string, title: string, description: string, siteUrl: string, posts: BlogPost[] = blogPosts) {
 const meta = pageMeta(route, title, description, posts);
 const canonical = `${siteUrl}${route ? route + '/' : ''}`;
 const person = { '@type': 'Person', '@id': `${siteUrl}#person`, name: 'Olubunmi Tunji-Ojo', alternateName: ['BTO', 'Bunmi Tunji-Ojo'], url: siteUrl, image: `${siteUrl}images/optimized/official-portrait.webp`, sameAs: ['https://bto.ng/', ...channels.map(c => c.url)] };
 const publisher = { '@type': 'Organization', '@id': `${siteUrl}#publisher`, name: blogAuthor, url: `${siteUrl}sources/#editorial-policy` };
 const website = { '@type': 'WebSite', '@id': `${siteUrl}#website`, url: siteUrl, name: 'Olubunmi Tunji-Ojo — Independent Profile', inLanguage: 'en-NG', publisher: { '@id': publisher['@id'] } };
 const breadcrumbs = [{ '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl }];
 if (meta.post) breadcrumbs.push({ '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}blog/` });
 if (route) breadcrumbs.push({ '@type': 'ListItem', position: breadcrumbs.length + 1, name: title, item: canonical });
 const webPage = { '@type': 'WebPage', '@id': canonical, url: canonical, name: meta.title, description: meta.description, inLanguage: 'en-NG', isPartOf: { '@id': website['@id'] }, about: { '@id': person['@id'] }, breadcrumb: { '@id': `${canonical}#breadcrumbs` }, primaryImageOfPage: { '@type': 'ImageObject', url: new URL(meta.image, siteUrl).href } };
 const graph: object[] = [person, publisher, website, webPage, { '@type': 'BreadcrumbList', '@id': `${canonical}#breadcrumbs`, itemListElement: breadcrumbs }];
 if (route === 'blog') graph.push({ '@type': 'Blog', '@id': `${canonical}#blog`, name: 'The record, in context', url: canonical, publisher: { '@id': publisher['@id'] }, blogPost: posts.map(p => ({ '@type': 'BlogPosting', '@id': `${siteUrl}${postRoute(p)}/#article`, headline: p.title, url: `${siteUrl}${postRoute(p)}/` })) });
 if (meta.post) graph.push({ '@type': 'BlogPosting', '@id': `${canonical}#article`, headline: meta.post.title, description: meta.post.excerpt, image: [new URL(meta.image, siteUrl).href], datePublished: `${meta.post.date}T00:00:00+01:00`, dateModified: meta.post.updatedAt ?? `${meta.post.date}T00:00:00+01:00`, author: { '@type': 'Organization', name: meta.post.author?.name ?? blogAuthor, url: meta.post.author ? `${siteUrl}blog/author/${meta.post.author.slug}/` : `${siteUrl}sources/#editorial-policy` }, publisher: { '@id': publisher['@id'] }, mainEntityOfPage: { '@id': canonical }, isPartOf: { '@id': `${siteUrl}blog/#blog` }, about: { '@id': person['@id'] }, articleSection: meta.post.category, inLanguage: 'en-NG', citation: meta.post.sources.map(s => s.url) });
 return { '@context': 'https://schema.org', '@graph': graph };
}
