import { APIError, type CollectionConfig } from 'payload'
import { publishedOrTeam, editPosts, ownVersions, staff, staffField, isEditor, isStaff, httpsURL } from '../lib/access'
import { photographs } from '../../../src/editorial/media'
export const Posts: CollectionConfig = {
 slug: 'posts', labels: { singular: 'Article', plural: 'Articles' },
 admin: { useAsTitle: 'title', group: 'Editorial', defaultColumns: ['title', 'category', 'reviewStage', '_status', 'updatedAt'], preview: (doc) => `/preview/${doc.id}` },
 versions: { maxPerDoc: 50, drafts: { autosave: { interval: 15000 }, validate: true } },
 access: { read: publishedOrTeam, create: staff, update: editPosts, delete: () => false, readVersions: ownVersions },
 hooks: { beforeOperation: [({ args, operation, req }) => {
  if ((operation === 'create' || operation === 'update') && isStaff(req.user) && !isEditor(req.user) && 'data' in args && args.data?._status === 'published') throw new APIError('Only editors and administrators may publish.', 403)
  return args
 }], beforeChange: [async ({ data, originalDoc, operation, req }) => {
  if (isStaff(req.user) && !isEditor(req.user)) {
   if (data._status === 'published') throw new APIError('Only editors and administrators may publish.', 403)
   if (data.reviewStage === 'approved' || data.reviewStage === 'changes-requested') throw new APIError('This review decision requires an editor.', 403)
   data.owner = req.user!.id
  }
  if (req.user) data.updatedBy = req.user.id
  if (operation === 'create' && !data.owner && req.user) data.owner = req.user.id
  if (originalDoc?._status === 'published' && data.slug && data.slug !== originalDoc.slug) throw new APIError('Published URLs are permanent. Keep this slug to preserve incoming links.', 400)
  if (data._status === 'published') {
   const final = { ...originalDoc, ...data }
   if (!final.sources?.length || !final.sections?.length || !final.author || !final.category || !final.title || !final.excerpt || !final.takeaway || !final.period || (!final.archiveImage && !final.cover)) throw new APIError('Publishing requires an author, category, cover, summary, period, article sections and sources.', 400)
   const ids = final.sections.map((s: any) => s.anchor)
   if (new Set(ids).size !== ids.length) throw new APIError('Section anchors must be unique.', 400)
   for (const s of final.sections) for (const ref of s.references || []) if (ref.sourceNumber < 1 || ref.sourceNumber > final.sources.length) throw new APIError('A section references a source number that does not exist.', 400)
   data.reviewStage = 'approved'
   data.publishedAt = originalDoc?.publishedAt || data.publishedAt || new Date().toISOString()
   if (new Date(data.publishedAt).getTime() > Date.now()) throw new APIError('Publication dates cannot be in the future. Publish when the article is ready to go live.', 400)
  }
  return data
 }] },
 fields: [
  { name: '_status', type: 'select', options: ['draft','published'], defaultValue: 'draft', access: { create: ({ req }) => isEditor(req.user), update: ({ req }) => isEditor(req.user) }, admin: { position: 'sidebar' } },
  { name: 'updatedBy', type: 'relationship', relationTo: 'users', access: { read: staffField, create: () => false, update: () => false }, admin: { readOnly: true, position: 'sidebar' } },
  { name: 'title', type: 'text', required: true, maxLength: 160 },
  { name: 'slug', type: 'text', required: true, unique: true, index: true, validate: (v: unknown) => typeof v === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v) || 'Use lowercase words separated by hyphens.' },
  { name: 'excerpt', type: 'textarea', required: true, maxLength: 320, admin: { description: 'The story summary used on cards and in search results.' } },
  { type: 'row', fields: [
   { name: 'category', type: 'relationship', relationTo: 'categories', required: true },
   { name: 'author', type: 'relationship', relationTo: 'authors', required: true },
  ] },
  { name: 'archiveImage', type: 'select', options: photographs.map(p => ({ label: p.title, value: p.id })), admin: { description: 'Choose a credited photograph from the existing archive, or upload a cover below.' } },
  { name: 'cover', type: 'upload', relationTo: 'media' },
  { name: 'period', type: 'text', required: true, admin: { description: 'The dates the article discusses, separate from its publication date.' } },
  { name: 'takeaway', type: 'textarea', required: true },
  { name: 'sections', type: 'array', required: true, minRows: 1, fields: [
   { name: 'heading', type: 'text', required: true },
   { name: 'anchor', type: 'text', required: true, validate: (v: unknown) => typeof v === 'string' && /^[a-z][a-z0-9-]*$/.test(v) && !['article-sources','article-share-url','app'].includes(v) || 'Use a unique lowercase section name, such as early-life.' },
   { name: 'body', type: 'richText', required: true },
   { name: 'references', type: 'array', fields: [{ name: 'sourceNumber', type: 'number', min: 1, required: true, admin: { description: 'Source position in the numbered list below (starting at 1).' } }] },
  ] },
  { name: 'sources', type: 'array', required: true, minRows: 1, fields: [
   { name: 'title', type: 'text', required: true }, { name: 'url', type: 'text', required: true, validate: httpsURL }, { name: 'date', type: 'text', required: true, label: 'Source date / access date' },
  ] },
  { name: 'correction', type: 'textarea', admin: { description: 'Public correction note. Explain substantive changes to a previously published article.' } },
  { name: 'relatedPage', type: 'group', fields: [{ name: 'route', type: 'select', defaultValue: 'story', options: ['story','interior','offices','community','media','sources','connect'], required: true }, { name: 'title', type: 'text', defaultValue: 'Explore the public record', required: true }] },
  { name: 'reviewStage', type: 'select', defaultValue: 'draft', options: [{label:'Writing',value:'draft'},{label:'Ready for review',value:'in-review'},{label:'Changes requested',value:'changes-requested'},{label:'Approved',value:'approved'}], access: { read: staffField }, admin: { position: 'sidebar' } },
  { name: 'editorNotes', type: 'textarea', access: { read: staffField }, admin: { position: 'sidebar', description: 'Private notes for the publishing team.' } },
  { name: 'owner', type: 'relationship', relationTo: 'users', access: { read: staffField, update: ({ req }) => isEditor(req.user) }, admin: { position: 'sidebar' } },
  { name: 'publishedAt', type: 'date', access: { create: ({ req }) => isEditor(req.user), update: ({ req }) => isEditor(req.user) }, admin: { position: 'sidebar', description: 'Set automatically on first publication. Historical event dates belong in Period covered.' } },
 ],
}
