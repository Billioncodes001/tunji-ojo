import test from 'node:test'
import assert from 'node:assert/strict'
import {parseArticle,SubmissionError} from '../src/lib/telegram-format'
import {processTelegramUpdate,createBotAPI} from '../src/lib/telegram'
const article=`/publish
Title: A sourced article
Slug: a-sourced-article
Category: institutions
Summary: A documented examination of public accountability.
Period: February 2025
Takeaway: Public records help readers assess public service.
Image: official-portrait

Body:
## The record
${'Readers need clear information about public institutions and the decisions that affect their lives. '.repeat(6)}

Sources:
Ministry report | https://fmino.gov.ng/tunji-ojo-hosts-nuj/ | 14 February 2025`
function harness(role='admin',active=true){
 const docs:any[]=[],replies:string[]=[],calls:any[]=[]
 const user={id:1,role,active,collection:'users'}
 const payload:any={find:async(a:any)=>{let result:any[]=[];if(a.collection==='users')result=[user];else if(a.collection==='posts')result=docs.filter(d=>Object.entries(a.where).every(([k,v]:any)=>d[k]===v.equals));else result=[{id:1,slug:'editorial-desk'}];return{docs:result,totalDocs:result.length}},create:async(a:any)=>{calls.push(a);const d={...a.data,id:docs.length+1,telegramSubmissionId:a.context.telegramSubmissionId};docs.push(d);return d},update:async(a:any)=>{const d=docs.find(p=>p.id===a.id);Object.assign(d,a.data);return d}}
 const api={send:async(_chat:number,text:string)=>{replies.push(text)},document:async()=>article}
 const update=(text=article,id=1):any=>({update_id:id,message:{message_id:id,from:{id:42},chat:{id:42,type:'private'},text}})
 return{docs,replies,calls,payload,api,update}
}
test('parses complete articles and rejects invalid formats',()=>{
 const a=parseArticle(article);assert.equal(a.mode,'publish');assert.equal(a.sections.length,1)
 for(const bad of [article.replace('Image: official-portrait\n',''),article.replace('Sources:','References:'),article.replace('Title:','Slug: duplicated\nTitle:'),article.replace('https:','http:'),article.replace(/Readers[\s\S]*\n\nSources:/,'Too short\n\nSources:')])assert.throws(()=>parseArticle(bad),SubmissionError)
})
test('publishes with access checks, attribution, and idempotency',async()=>{
 const h=harness();await processTelegramUpdate(h.update(),h.payload,h.api);await processTelegramUpdate(h.update(),h.payload,h.api)
 assert.equal(h.docs.length,1);assert.equal(h.calls[0].overrideAccess,false);assert.equal(h.calls[0].user.role,'admin');assert.equal(h.docs[0]._status,'published');assert.equal(h.docs[0].telegramSubmissionId,'telegram:42:1');assert.match(h.replies[1],/Already received/)
 await processTelegramUpdate(h.update(article,2),h.payload,h.api);assert.equal(h.docs.length,1);assert.match(h.replies[2],/Nothing was overwritten/)
})
test('writers only submit drafts; disabled accounts cannot submit',async()=>{
 const h=harness('writer');await processTelegramUpdate(h.update(),h.payload,h.api);assert.equal(h.docs.length,0)
 await processTelegramUpdate(h.update(article.replace('/publish','/draft'),2),h.payload,h.api);assert.equal(h.docs[0]._status,'draft');assert.equal(h.docs[0].reviewStage,'in-review')
 const inactive=harness('admin',false);await processTelegramUpdate(inactive.update(),inactive.payload,inactive.api);assert.equal(inactive.docs.length,0)
})
test('groups, forwarded messages and edited updates cannot publish',async()=>{
 const h=harness();const group=h.update();group.message.chat.type='group';await processTelegramUpdate(group,h.payload,h.api)
 const forwarded=h.update();forwarded.message.forward_origin={type:'user'};await processTelegramUpdate(forwarded,h.payload,h.api)
 await processTelegramUpdate({update_id:2,edited_message:h.update().message} as any,h.payload,h.api);assert.equal(h.docs.length,0)
})
test('reply failure and retry do not duplicate an article',async()=>{
 const h=harness();await assert.rejects(processTelegramUpdate(h.update(),h.payload,{...h.api,send:async()=>{throw Error('network')}}))
 await processTelegramUpdate(h.update(),h.payload,h.api);assert.equal(h.docs.length,1);assert.match(h.replies[0],/Already received/)
})

test('attached images require provenance and a real photo before publication',async()=>{
 const h=harness();const attached=article.replace('Image: official-portrait','Image: attached\nImageDescription: The minister at an event\nImageCredit: Ministry photographer\nImageSource: https://interior.gov.ng/\nImageRights: Permission granted for this use')
 assert.throws(()=>parseArticle(article.replace('Image: official-portrait','Image: attached')),SubmissionError)
 await processTelegramUpdate(h.update(attached),h.payload,h.api);assert.equal(h.docs.length,0);assert.match(h.replies[0],/Attach a photo/)
 const u=h.update(attached,2);u.message.reply_to_message={photo:[{file_id:'photo',width:100,height:100}]}
 const media:any[]=[];const create=h.payload.create;h.payload.create=async(a:any)=>{if(a.collection==='media'){media.push(a);return{id:99}}return create(a)}
 await processTelegramUpdate(u,h.payload,{...h.api,photo:async()=>({data:Buffer.from('fake test photo'),name:'test.jpg',mimetype:'image/jpeg',size:15})})
 assert.equal(h.docs.length,1);assert.equal(h.docs[0].cover,99);assert.equal(h.docs[0].archiveImage,undefined);assert.equal(media[0].data.credit,'Ministry photographer');assert.equal(media[0].overrideAccess,false)
})

test('photo downloads enforce image signatures and byte limits',async()=>{
 const original=globalThis.fetch
 try {
  let bytes=Buffer.from([255,216,255,224,0,0]);let advertised=bytes.length
  globalThis.fetch=(async(url:any)=>String(url).includes('/getFile')?new Response(JSON.stringify({ok:true,result:{file_path:'photos/file.jpg',file_size:advertised}})):new Response(bytes)) as typeof fetch
  const api=createBotAPI('test-token');const file=await api.photo!({file_id:'test',file_size:6});assert.equal(file.mimetype,'image/jpeg')
  bytes=Buffer.from('<script>alert(1)</script>');advertised=bytes.length;await assert.rejects(api.photo!({file_id:'test',file_size:bytes.length}),SubmissionError)
  advertised=8_000_001;await assert.rejects(api.photo!({file_id:'test',file_size:1}),SubmissionError)
 }finally{globalThis.fetch=original}
})
test('interrupted content writes stay private and are repaired on retry',async()=>{
 const h=harness();const create=h.payload.create
 h.payload.create=async(a:any)=>{await create({...a,data:{...a.data,sources:[]}});throw Error('interrupted write')}
 await assert.rejects(processTelegramUpdate(h.update(),h.payload,h.api));assert.equal(h.docs[0]._status,'draft');assert.equal(h.docs[0].sources.length,0)
 await processTelegramUpdate(h.update(),h.payload,h.api);assert.equal(h.docs.length,1);assert.equal(h.docs[0]._status,'published');assert.equal(h.docs[0].sources.length,1)
})
