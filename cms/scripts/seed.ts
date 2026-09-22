import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { blogPosts } from '../../src/editorial/blog'
import { randomBytes } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
const payload=await getPayload({config})
const email=process.env.OWNER_EMAIL
if(!email) throw new Error('OWNER_EMAIL must identify the owner; no default account is created.')
const existing=await payload.find({collection:'users',where:{email:{equals:email}},limit:1})
const owner=existing.docs[0] || await payload.create({collection:'users',data:{name:'Publishing administrator',email,password:randomBytes(40).toString('base64url'),role:'admin',active:true}})
const categoryDescriptions:Record<string,string>={Background:'Education, early career and the background to a life in public service.','Public office':'The parliamentary years, public responsibilities and the transition to the Interior portfolio.',Immigration:'Passports, border administration and the dated record of digital immigration reform.',Community:'Community initiatives, youth opportunity and the relationship between local needs and public institutions.',Institutions:'Oversight, accountability and the systems behind public service.','Public services':'Clear starting points for finding official services and understanding who is responsible.'}
const categories=new Map<string,number>()
for(const name of new Set(blogPosts.map(p=>p.category))) {
 const slug=name.toLowerCase().replaceAll(' ','-')
 const found=await payload.find({collection:'categories',where:{slug:{equals:slug}},limit:1})
 const category=found.docs[0]||await payload.create({collection:'categories',data:{name,slug,description:categoryDescriptions[name]}})
 categories.set(name,category.id)
}
const authors=await payload.find({collection:'authors',where:{slug:{equals:'editorial-desk'}},limit:1})
const author=authors.docs[0]||await payload.create({collection:'authors',data:{name:'The Editorial Desk',slug:'editorial-desk',bio:'The editorial desk of this independent Olubunmi Tunji-Ojo profile publishes original research notes and explainers drawn from dated public sources. These articles are not written by the minister or his office. Sources, photo credits and corrections are provided with each story.'}})
const richText=(paragraphs:string[])=>({root:{type:'root',version:1,format:'' as const,indent:0,direction:null,children:paragraphs.map(text=>({type:'paragraph',version:1,format:'',indent:0,direction:null,children:[{type:'text',version:1,text,format:0,detail:0,mode:'normal',style:''}]}))}})
let added=0
for(const post of blogPosts) {
 const found=await payload.find({collection:'posts',where:{slug:{equals:post.slug}},limit:1})
 if(found.totalDocs) continue
 await payload.create({collection:'posts',data:{title:post.title,slug:post.slug,excerpt:post.excerpt,category:categories.get(post.category)!,author:author.id,owner:owner.id,archiveImage:post.image as any,period:post.period,takeaway:post.takeaway,sections:post.sections.map(s=>({heading:s.title,anchor:s.id,body:richText(s.paragraphs),references:s.sources?.map(i=>({sourceNumber:i+1}))})),sources:post.sources,relatedPage:post.relatedPage as any,publishedAt:post.date+'T12:00:00.000Z',_status:'published',reviewStage:'approved'}})
 added++
}
if(process.env.CREATE_OWNER_SETUP==='1') {
 const token=await payload.forgotPassword({collection:'users',data:{email},disableEmail:true,expiration:86400000})
 await writeFile('.owner-setup-url',`${process.env.SETUP_SITE_URL||'http://localhost:3000'}/admin/reset/${token}`,{mode:0o600})
 console.log('Owner setup link saved to private .owner-setup-url file (expires in 24 hours).')
}
console.log(`Seed complete: ${added} new articles, ${categories.size} sections. Existing content was preserved.`)
await payload.destroy()
process.exit(0)
