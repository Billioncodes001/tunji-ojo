import type { CollectionConfig } from 'payload'
import { staff, editors, httpsURL } from '../lib/access'
export const Media: CollectionConfig = {
 slug: 'media', admin: { useAsTitle: 'alt', group: 'Editorial' },
 access: { read: () => true, create: staff, update: editors, delete: () => false },
 upload: { pasteURL: false, crop: false, focalPoint: false, mimeTypes: ['image/jpeg', 'image/png', 'image/webp'], staticDir: 'media' },
 fields: [
  { name: 'alt', type: 'text', required: true, label: 'Image description' },
  { name: 'credit', type: 'text', required: true },
  { name: 'source', type: 'text', required: true, validate: httpsURL },
  { name: 'rights', type: 'textarea', required: true, label: 'Permission / licence', admin: { description: 'Record how this image may be used before uploading. Uploaded images are public.' } },
 ],
}
