import type { CollectionConfig } from 'payload'
import { editors, admins, httpsURL } from '../lib/access'
const slug = { name: 'slug', type: 'text' as const, required: true, unique: true, index: true, validate: (value: unknown) => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) || 'Use lowercase words separated by hyphens.' }
export const Categories: CollectionConfig = {
 slug: 'categories', admin: { useAsTitle: 'name', group: 'Editorial' }, access: { read: () => true, create: editors, update: editors, delete: admins },
 fields: [{ name: 'name', type: 'text', required: true }, slug, { name: 'description', type: 'textarea', required: true }],
}
export const Authors: CollectionConfig = {
 slug: 'authors', admin: { useAsTitle: 'name', group: 'Editorial' }, access: { read: () => true, create: editors, update: editors, delete: admins },
 fields: [{ name: 'name', type: 'text', required: true }, slug, { name: 'bio', type: 'textarea', required: true }, { name: 'website', type: 'text', validate: httpsURL }],
}
