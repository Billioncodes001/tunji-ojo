import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { randomBytes } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
if(process.env.CMS_REMOTE || process.env.NODE_ENV==='production') throw new Error('Test accounts are local only.')
const p=await getPayload({config})
const accounts=[]
for(const role of ['admin','editor','writer','writer']) {
 const password=randomBytes(24).toString('base64url')
 const email=`test-${role}-${randomBytes(5).toString('hex')}@example.test`
 const user=await p.create({collection:'users',data:{email,password,name:`Test ${role}`,role:role as any,active:true}})
 accounts.push({id:user.id,email,password,role})
}
await writeFile('.test-accounts.json',JSON.stringify(accounts),{mode:0o600})
await p.destroy();process.exit(0)
