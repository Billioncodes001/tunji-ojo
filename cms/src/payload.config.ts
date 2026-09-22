import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import { lexicalEditor, BoldFeature, ItalicFeature, LinkFeature, ParagraphFeature, UnorderedListFeature, OrderedListFeature, BlockquoteFeature, FixedToolbarFeature } from '@payloadcms/richtext-lexical'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { r2Storage } from '@payloadcms/storage-r2'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { Users } from './collections/Users'
import { Posts } from './collections/Posts'
import { Categories, Authors } from './collections/Taxonomy'
import { newsroomEmail } from './lib/email'
import { Media } from './collections/Media'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const isCLI = process.argv.some(v => v.includes('payload') && v.endsWith('bin.js'))
const production = process.env.NODE_ENV === 'production'
const cloudflare = process.env.CMS_BUILD === '1' ? { env: { D1: {}, R2: {} } } : isCLI || !production || process.env.CMS_REMOTE
 ? await import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`).then(({ getPlatformProxy }) => getPlatformProxy({ remoteBindings: Boolean(process.env.CMS_REMOTE), configPath: process.env.CMS_REMOTE ? './.remote.wrangler.json' : './wrangler.jsonc' }))
 : await getCloudflareContext({ async: true })
const env = cloudflare.env as any
const secret = process.env.PAYLOAD_SECRET || env.PAYLOAD_SECRET
if (!secret) throw new Error('PAYLOAD_SECRET is required. See cms/.env.example.')
const log = (level: string) => (obj: unknown, msg?: string) => console.log(JSON.stringify({ level, message: typeof obj === 'string' ? obj : msg || (obj as any)?.msg || (obj as any)?.message || (obj as any)?.err?.message?.split('\n')[0] || 'CMS event' }))
const logger = { level: 'info', trace: log('trace'), debug: log('debug'), info: log('info'), warn: log('warn'), error: log('error'), fatal: log('fatal'), silent() {} } as any
export default buildConfig({
 serverURL: process.env.SITE_URL || 'https://olubunmitunjiojo.com',
 admin: { user: 'users', importMap: { baseDir: dirname }, meta: { titleSuffix: ' — Tunji-Ojo Newsroom' }, components: { graphics: { Logo: './components/Brand#Logo', Icon: './components/Brand#Icon' }, beforeDashboard: ['./components/Welcome#Welcome'] } },
 collections: [Posts, Categories, Authors, Media, Users],
 editor: lexicalEditor({ features: () => [ParagraphFeature(), BoldFeature(), ItalicFeature(), LinkFeature({ enabledCollections: [] }), UnorderedListFeature(), OrderedListFeature(), BlockquoteFeature(), FixedToolbarFeature()] }),
 secret,
 email: newsroomEmail(env.EMAIL),
 db: sqliteD1Adapter({ binding: env.D1, migrationDir: path.resolve(dirname, 'migrations'), push: false }),
 typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
 plugins: [r2Storage({ bucket: env.R2, collections: { media: true } })],
 graphQL: { disable: true },
 upload: { limits: { fileSize: 8_000_000 } },
 logger: production ? logger : undefined,
 csrf: [process.env.SITE_URL || 'https://olubunmitunjiojo.com'],
 cors: [],
})
