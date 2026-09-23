import 'dotenv/config'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {getPayload} from 'payload'
import config from '../src/payload.config'
import {processTelegramUpdate} from '../src/lib/telegram'
import {journalExpansion} from '../../src/editorial/journal-expansion'
if(process.env.CMS_REMOTE||process.env.NODE_ENV==='production')throw Error('Local test only')
const p=await getPayload({config})
const accounts=JSON.parse(readFileSync('.test-accounts.json','utf8'))
const owner=accounts.find((u:any)=>u.role==='admin')
await p.update({collection:'users',id:owner.id,data:{telegramUserId:'42424242'}})
const messageID=Date.now();const a=journalExpansion[0],slug=`telegram-local-${messageID}`
const text=`/publish\nTitle: ${a.title}\nSlug: ${slug}\nCategory: public-services\nSummary: ${a.excerpt}\nPeriod: ${a.period}\nTakeaway: ${a.takeaway}\nImage: ${a.image}\n\nBody:\n${a.sections.map(s=>`## ${s.title}\n${s.paragraphs.join('\n\n')}`).join('\n\n')}\n\nSources:\n${a.sources.map(s=>`${s.title} | ${s.url} | ${s.date}`).join('\n')}`
const update={update_id:1,message:{message_id:messageID,from:{id:42424242},chat:{id:42424242,type:'private'},text}}
const replies:string[]=[]
const api={send:async(_id:number,t:string)=>{replies.push(t)},document:async()=>text}
await processTelegramUpdate(update,p,api)
assert.match(replies[0],/Published:/)
await processTelegramUpdate(update,p,api)
assert.match(replies[1],/Already received/)
const result=await p.find({collection:'posts',where:{slug:{equals:slug}},depth:0})
assert.equal(result.totalDocs,1);assert.equal(result.docs[0].owner,owner.id);assert.equal(result.docs[0].telegramSubmissionId,`telegram:42424242:${messageID}`)
const publicResult=await p.find({collection:'posts',overrideAccess:false,where:{slug:{equals:slug}},depth:0})
assert.equal(publicResult.docs[0].telegramSubmissionId,undefined)
await p.update({collection:'posts',id:result.docs[0].id,data:{_status:'draft'}})
const photoText=text.replace(slug,slug+'-photo').replace(`Image: ${a.image}`,'Image: attached\nImageDescription: Local test pixel\nImageCredit: Test fixture\nImageSource: https://example.com/test-fixture\nImageRights: Generated local test fixture')
const bytes=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aG1cAAAAASUVORK5CYII=','base64')
await processTelegramUpdate({update_id:2,message:{...update.message,message_id:messageID+1,text:photoText,reply_to_message:{photo:[{file_id:'test',width:1,height:1}]}}},p,{...api,photo:async()=>({data:bytes,name:`telegram-test-${messageID}.png`,mimetype:'image/png',size:bytes.length})})
const photoPost=(await p.find({collection:'posts',where:{slug:{equals:slug+'-photo'}},depth:1})).docs[0]
assert.equal(photoPost._status,'published');assert.equal((photoPost.cover as any).credit,'Test fixture');assert.equal(photoPost.archiveImage,null)
await p.update({collection:'posts',id:photoPost.id,data:{_status:'draft'}})
console.log('Attached photo saved to the local media library with credit and assigned as cover.')
await p.update({collection:'users',id:owner.id,data:{telegramUserId:null}})
console.log('Real CMS Telegram flow passed: published, attributed, duplicate prevented, internal key private; local test article withdrawn.')
await p.destroy();process.exit(0)
