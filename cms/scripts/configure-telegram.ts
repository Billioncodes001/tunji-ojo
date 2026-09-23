import {readFileSync} from 'node:fs'
import {parse} from 'dotenv'
const env=parse(readFileSync('.env.telegram.local'))
if(!env.TELEGRAM_BOT_TOKEN||!env.TELEGRAM_WEBHOOK_SECRET)throw Error('Private Telegram configuration is incomplete')
async function call(method:string,data:unknown){
 try {const r=await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const result:any=await r.json();if(!result.ok)throw Error();return result.result}catch{throw Error(`Telegram ${method} failed`)}
}
await call('setMyCommands',{commands:[{command:'help',description:'Publishing instructions'},{command:'template',description:'Copy the article format'},{command:'categories',description:'Available journal sections'},{command:'images',description:'Credited archive photographs'},{command:'whoami',description:'Your ID for newsroom account linking'}]})
await call('setMyDescription',{description:'Submit sourced articles to the independent Tunji-Ojo Journal. Publishing-team accounts only. Administrators and editors publish; writers submit drafts for review.'})
await call('setMyShortDescription',{short_description:'Private publishing assistant for the independent Tunji-Ojo Journal.'})
await call('setWebhook',{url:'https://olubunmitunjiojo.com/api/telegram/',secret_token:env.TELEGRAM_WEBHOOK_SECRET,allowed_updates:['message'],max_connections:1})
const info=await call('getWebhookInfo',{})
console.log(JSON.stringify({configured:true,url:info.url,pending:info.pending_update_count,lastError:info.last_error_message||null}))
