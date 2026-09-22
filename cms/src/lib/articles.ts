import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import type { Post } from '../payload-types'
import type { BlogPost } from '../../../src/editorial/blog'
export function toArticle(doc: Post): BlogPost {
 const category = typeof doc.category === 'object' ? doc.category : null
 const author = typeof doc.author === 'object' ? doc.author : null
 const cover = typeof doc.cover === 'object' ? doc.cover : null
 return {
  slug: doc.slug, title: doc.title, excerpt: doc.excerpt, category: category?.name || 'Journal', image: doc.archiveImage || 'official-portrait',
  cover: cover?.url ? { url: cover.url, description: cover.alt, credit: cover.credit, source: cover.source } : undefined,
  author: author ? { name: author.name, slug: author.slug, bio: author.bio } : undefined,
  date: (doc.publishedAt || doc.createdAt).slice(0, 10), updatedAt: doc.updatedAt, correction: doc.correction || undefined,
  period: doc.period, takeaway: doc.takeaway,
  sections: (doc.sections || []).map(s => { const html = convertLexicalToHTML({ data: s.body as any, disableContainer: true }); return { id: s.anchor, title: s.heading, html, paragraphs: [html.replace(/<[^>]*>/g, ' ')], sources: s.references?.map(r => r.sourceNumber - 1).filter(n => n >= 0 && n < doc.sources.length) } }),
  sources: doc.sources, relatedPage: { route: doc.relatedPage.route, title: doc.relatedPage.title },
 }
}
