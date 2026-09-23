import type { Payload } from 'payload'
import { isEditor, isStaff } from './access'
import { photographs } from '../../../src/editorial/media'
import { MAX_ARTICLE_BYTES, parseArticle, richText, SubmissionError, template } from './telegram-format'
export type TelegramMessage = { message_id:number; from?:{id:number;is_bot?:boolean}; chat:{id:number;type:string}; text?:string; caption?:string; photo?:{file_id:string;file_size?:number;width:number;height:number}[]; reply_to_message?:{photo?:{file_id:string;file_size?:number;width:number;height:number}[]}; forward_origin?:unknown; document?:{file_id:string;file_name?:string;file_size?:number} }
export type TelegramUpdate = { update_id:number; message?:TelegramMessage }
export interface BotAPI { send(chat:number,text:string):Promise<void>; photo?(file:{file_id:string;file_size?:number}):Promise<{data:Buffer;name:string;mimetype:string;size:number}>; document(file:NonNullable<TelegramMessage['document']>):Promise<string> }
const origin='https://olubunmitunjiojo.com'
export async function processTelegramUpdate(update:TelegramUpdate,payload:Payload,api:BotAPI) {
 const message=update.message
 if (!message || message.chat?.type!=='private' || !Number.isSafeInteger(message.from?.id) || message.from?.is_bot || message.chat.id!==message.from!.id || !Number.isSafeInteger(message.message_id)) return
 const sender=message.from!.id
 const command=(message.text||message.caption||'').trim().split(/\s/)[0].toLowerCase().replace('@tunjiojojournalbot','')
 if(command==='/whoami') { await api.send(sender,`Your Telegram user ID: ${sender}\nAn administrator can link it under Publishing team → your account → Telegram user ID.`);return }
 const result=await payload.find({collection:'users',overrideAccess:true,where:{telegramUserId:{equals:String(sender)}},limit:1,depth:0})
 const user=result.docs[0]
 if(!isStaff(user)) { await api.send(sender,`This Telegram account is not linked to an active publishing-team account.\nYour Telegram user ID: ${sender}\nAsk the administrator to link it in the newsroom. No article was published.`);return }
 const help=`Tunji-Ojo Journal Publisher\n\n/template — copy the submission format\n/publish + article — publish immediately (editors/admins)\n/draft + article — save for review\n/categories — section names\n/images — credited archive photographs\n/whoami — your Telegram ID\n\nSend one complete message, or a UTF-8 .txt/.md file up to 64 KB starting with /publish or /draft. Every article requires Image. Use an archive ID, or Image: attached with a photo, ImageDescription, ImageCredit, ImageSource and ImageRights. Reply to a photo with the article if it does not fit a caption. A successful submission returns its link. Editing a Telegram message does not change the website; edit published stories in the newsroom.\n\n${origin}/admin/`
 if(message.photo?.length && !message.caption && !message.text) {await api.send(sender,'Photo received. Reply to this photo with the complete /publish or /draft article. Use Image: attached plus ImageDescription, ImageCredit, ImageSource and ImageRights. Nothing is published until the complete article passes validation.');return}
 if(command==='/start' || command==='/help') { await api.send(sender,help);return }
 if(command==='/template') { await api.send(sender,template);await api.send(sender,'An image is mandatory. To use a new photo, replace Image with Image: attached and add these headers before Body:\nImageDescription: Describe the photograph\nImageCredit: Photographer or organisation\nImageSource: https://original-source.example/photo\nImageRights: Permission or licence allowing publication\n\nAttach the photo with the article as its caption, or send the photo first and reply to it with the complete article (or .txt file). Use one cover photo per article.');return }
 if(command==='/categories') {const cats=await payload.find({collection:'categories',overrideAccess:false,user,limit:100,sort:'name'});await api.send(sender,cats.docs.map(c=>`${c.slug} — ${c.name}`).join('\n'));return}
 if(command==='/images') {await api.send(sender,photographs.map(p=>`${p.id} — ${p.title}`).join('\n')+'\n\nUse the ID after Image:. Existing image credits are preserved.');return}
 try {
  if(message.forward_origin) throw new SubmissionError('Paste your original article into the template instead of forwarding a message.')
  const key=`telegram:${sender}:${message.message_id}`
  const findExisting=async()=> (await payload.find({collection:'posts',overrideAccess:true,where:{telegramSubmissionId:{equals:key}},limit:1,depth:0})).docs[0]
  const reply=async(doc:any,existing=false)=>api.send(sender,`${existing?'Already received. ':''}${doc._status==='published'?'Published':'Draft saved for review'}: ${doc.title}\n${doc._status==='published'?`${origin}/blog/${doc.slug}/`:`${origin}/admin/collections/posts/${doc.id}`}\n${doc._status==='published'?'The article is now on the website.':'An editor can review and publish it in the newsroom.'}`)
  const existing=await findExisting();if(existing?._status==='published'){await reply(existing,true);return}
  const text=message.document?await api.document(message.document):message.text||message.caption||''
  const article=parseArticle(text)
  if(article.mode==='publish' && !isEditor(user)) throw new SubmissionError('Your writer account can save drafts only. Replace /publish with /draft and submit for editorial review.')
  if(article.image!=='attached' && !photographs.some(p=>p.id===article.image)) throw new SubmissionError('Unknown Image ID. Use /images to choose a credited archive photograph.')
  const [categories,authors,slugs]=await Promise.all([
   payload.find({collection:'categories',overrideAccess:false,user,where:{slug:{equals:article.category}},limit:1}),
   payload.find({collection:'authors',overrideAccess:false,user,where:{slug:{equals:article.author}},limit:1}),
   payload.find({collection:'posts',overrideAccess:true,where:{slug:{equals:article.slug}},limit:1,depth:0}),
  ])
  if(!categories.docs[0]) throw new SubmissionError('Unknown Category. Use /categories for the available section IDs.')
  if(!authors.docs[0]) throw new SubmissionError('Unknown Author slug. Omit Author to use editorial-desk, or create a public author in the newsroom.')
  if(slugs.docs.some(p=>p.id!==existing?.id)) throw new SubmissionError('That Slug already belongs to an article. Choose a new slug, or edit the existing article in the newsroom. Nothing was overwritten.')
  let cover:number|undefined=typeof existing?.cover==='number'?existing.cover:undefined
  if(article.image==='attached' && !cover) {
   const photos=message.photo||message.reply_to_message?.photo
   if(!photos?.length || !api.photo) throw new SubmissionError('Attach a photo with the article as its caption, or reply to your photo with the complete article. Include Image: attached and the four image details.')
   const photo=[...photos].sort((a,b)=>b.width*b.height-a.width*a.height)[0]
   const file=await api.photo(photo)
   const media=await payload.create({collection:'media',overrideAccess:false,user,data:article.imageDetails!,file})
   cover=media.id
  }
  // D1 collection writes span multiple statements. Keep content private until every
  // section/source has been saved; a delivery retry repairs an incomplete draft.
  const data:any={title:article.title,slug:article.slug,excerpt:article.excerpt,period:article.period,takeaway:article.takeaway,category:categories.docs[0].id,author:authors.docs[0].id,archiveImage:cover?undefined:article.image,cover,sections:article.sections.map(s=>({heading:s.heading,anchor:s.anchor,body:richText(s.paragraphs),references:article.sources.map((_,i)=>({sourceNumber:i+1}))})),sources:article.sources,relatedPage:{route:'interior',title:'Explore the Interior record'},_status:'draft',reviewStage:'in-review'}
  let doc
  const complete=existing && existing.sources?.length===article.sources.length && existing.sections?.length===article.sections.length && existing.sections.every(s=>s.body && s.references?.length===article.sources.length)
  if(complete) doc=existing
  else if(existing) doc=await payload.update({collection:'posts',id:existing.id,overrideAccess:false,user,data})
  else {
   try {doc=await payload.create({collection:'posts',overrideAccess:false,user,context:{telegramSubmissionId:key},data})}
   catch(error) {const concurrent=await findExisting();if(concurrent?._status!=='published')throw error;doc=concurrent}
  }
  if(article.mode==='publish' && doc._status!=='published') doc=await payload.update({collection:'posts',id:doc.id,overrideAccess:false,user,data:{_status:'published',reviewStage:'approved'}})

  await reply(doc)
 } catch(error) {
  if(error instanceof SubmissionError) {await api.send(sender,`Not published: ${error.message}\n\nSend /template for the format.`);return}
  throw error
 }
}

export function createBotAPI(token:string):BotAPI {
 const call=async(method:string,data:unknown)=>{
  // Never include request URLs in error messages: Telegram embeds the credential there.
  let response:Response
  try {response=await fetch(`https://api.telegram.org/bot${token}/${method}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(12000)})} catch {throw new Error('Telegram API is unavailable')}
  const body:any=await response.json().catch(()=>null)
  if(!response.ok || !body?.ok) throw new Error('Telegram API request failed')
  return body.result
 }
 async function download(file:{file_id:string;file_size?:number},limit:number) {
  if(file.file_size && file.file_size>limit) throw new SubmissionError('File exceeds the allowed size.')
  const info=await call('getFile',{file_id:file.file_id})
  if(typeof info.file_path!=='string' || !/^[a-zA-Z0-9_./-]+$/.test(info.file_path) || info.file_path.includes('..') || info.file_size>limit) throw new SubmissionError('Telegram could not provide a valid file.')
  let response:Response
  try {response=await fetch(`https://api.telegram.org/file/bot${token}/${info.file_path}`,{redirect:'error',signal:AbortSignal.timeout(12000)})} catch {throw new Error('Telegram file download failed')}
  if(!response.ok) throw new Error('Telegram file download failed')
  const reader=response.body?.getReader();if(!reader) throw new Error('Empty Telegram file response')
  const chunks:Uint8Array[]=[];let size=0
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>limit){await reader.cancel();throw new SubmissionError('File exceeds the allowed size.')}chunks.push(value)}
  return Buffer.concat(chunks,size)
 }
 return {
  send:async(chat,text)=>{await call('sendMessage',{chat_id:chat,text,link_preview_options:{is_disabled:true}})},
  photo:async file=>{
   const data=await download(file,8_000_000)
   const jpeg=data[0]===255&&data[1]===216&&data[2]===255
   const png=data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
   const webp=data.subarray(0,4).toString()==='RIFF'&&data.subarray(8,12).toString()==='WEBP'
   if(!jpeg&&!png&&!webp)throw new SubmissionError('Use a JPEG, PNG or WebP photograph up to 8 MB.')
   const ext=jpeg?'jpeg':png?'png':'webp'
   return {data,name:`telegram-${crypto.randomUUID()}.${ext}`,mimetype:`image/${ext}`,size:data.length}
  },
  document:async file=>{
   if(!/\.(txt|md)$/i.test(file.file_name||'') || !file.file_size || file.file_size>MAX_ARTICLE_BYTES) throw new SubmissionError('Attach a UTF-8 .txt or .md file no larger than 64 KB.')
   const bytes=await download(file,MAX_ARTICLE_BYTES)
   try{return new TextDecoder('utf-8',{fatal:true}).decode(bytes)}catch{throw new SubmissionError('Save the document as UTF-8 plain text.')}
  },
 }
}
