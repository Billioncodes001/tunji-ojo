import { timingSafeEqual } from 'node:crypto'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getPayload } from 'payload'
import config from '@payload-config'
import { createBotAPI, processTelegramUpdate } from '../../../lib/telegram'
export const dynamic='force-dynamic'
const response=(status:number)=>new Response(null,{status,headers:{'Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow'}})
export async function POST(request:Request) {
 const {env}=await getCloudflareContext({async:true})
 const {TELEGRAM_BOT_TOKEN:token,TELEGRAM_WEBHOOK_SECRET:secret}=env as any
 if(!token || !secret) return response(503)
 const received=request.headers.get('X-Telegram-Bot-Api-Secret-Token')||''
 const a=Buffer.from(received),b=Buffer.from(secret)
 if(a.length!==b.length || !timingSafeEqual(a,b)) return response(403)
 if(!request.headers.get('content-type')?.includes('application/json'))return response(415)
 if(Number(request.headers.get('content-length')||0)>96_000)return response(413)
 let update
 try {const text=await request.text();if(new TextEncoder().encode(text).length>96_000)return response(413);update=JSON.parse(text);if(!Number.isSafeInteger(update?.update_id))return response(400)}catch{return response(400)}
 try {await processTelegramUpdate(update,await getPayload({config}),createBotAPI(token));return response(200)}
 catch {console.error('Telegram publishing request failed; safe to retry.');return response(500)}
}
