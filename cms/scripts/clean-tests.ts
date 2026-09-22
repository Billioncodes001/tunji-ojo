import 'dotenv/config'
import {getPayload} from 'payload'
import config from '../src/payload.config'
if(process.env.CMS_REMOTE || process.env.NODE_ENV==='production') throw new Error('Local fixtures only.')
const p=await getPayload({config})
const found=await p.find({collection:'posts',where:{slug:{like:'test-story-'}},limit:100})
for(const doc of found.docs) if(doc.slug.startsWith('test-story-')) await p.delete({collection:'posts',id:doc.id,overrideAccess:true})
await p.destroy();process.exit(0)
