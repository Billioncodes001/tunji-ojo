import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
const base='http://localhost:3000'
const accounts=JSON.parse(await readFile('.test-accounts.json','utf8'))
const request=async(path:string,token?:string,method='GET',data?:unknown)=>{
 const response=await fetch(base+path,{method,headers:{...(token?{Authorization:`JWT ${token}`} :{}),...(data?{'Content-Type':'application/json'}:{})},body:data?JSON.stringify(data):undefined})
 const body=await response.json().catch(()=>null)
 return {response,body}
}
const tokens=[] as string[]
for(const account of accounts){const r=await request('/api/users/login',undefined,'POST',{email:account.email,password:account.password});assert.equal(r.response.status,200);tokens.push(r.body.token)}
const [admin,editor,writer,other]=tokens
const cat=(await request('/api/categories')).body.docs[0].id
const author=(await request('/api/authors')).body.docs[0].id
const suffix=Date.now()
const content={title:`Test article ${suffix}`,slug:`test-story-${suffix}`,excerpt:'A test of protected editorial publishing.',category:cat,author,archiveImage:'official-portrait',period:'Test period',takeaway:'Test takeaway',sections:[{heading:'Test section',anchor:'test-section',body:{root:{type:'root',version:1,format:'',indent:0,direction:null,children:[{type:'paragraph',version:1,format:'',indent:0,direction:null,children:[{type:'text',version:1,text:'A documented test article.',format:0,detail:0,mode:'normal',style:''}]}]}}}],sources:[{title:'Test source',url:'https://bto.ng/about/',date:'Accessed today'}],relatedPage:{route:'story',title:'Read more'},editorNotes:'PRIVATE TEST NOTE',_status:'draft'}
let articleID:number
await test('Public cannot register or inspect staff accounts',async()=>{
 assert.equal((await request('/api/users/first-register',undefined,'POST',{email:'x@example.test',password:'does-not-create-account'})).response.status,403)
 assert.equal((await request('/api/users')).response.status,403)
 assert.equal((await request('/api/users',undefined,'POST',{email:'x@example.test',password:'does-not-create-account'})).response.status,403)
})
await test('Writer creates only an owned draft, with public preview blocked',async()=>{
 const created=await request('/api/posts',writer,'POST',{...content,owner:accounts[0].id})
 assert.equal(created.response.status,201,JSON.stringify(created.body));articleID=created.body.doc.id
 assert.equal(created.body.doc.owner.id || created.body.doc.owner,accounts[2].id)
 const result=await request(`/api/posts/${articleID}`)
 assert.ok([403,404].includes(result.response.status))
 const page=await fetch(`${base}/blog/${content.slug}/`);assert.equal(page.status,404)
 const preview=await fetch(`${base}/preview/${articleID}`,{redirect:'manual'});assert.ok([302,307,308].includes(preview.status))
})
await test('Writer cannot publish, approve review, edit another writer, or promote self',async()=>{
 assert.equal((await request(`/api/posts/${articleID}`,writer,'PATCH',{_status:'published'})).response.status,403)
 assert.equal((await request(`/api/posts/${articleID}`,writer,'PATCH',{reviewStage:'approved'})).response.status,403)
 assert.ok([403,404].includes((await request(`/api/posts/${articleID}`,other,'PATCH',{title:'Hijack'})).response.status))
 await request(`/api/users/${accounts[2].id}`,writer,'PATCH',{role:'admin'})
 const self=await request(`/api/users/${accounts[2].id}`,writer);assert.equal(self.body.role,'writer')
 assert.equal((await request('/api/users',editor,'POST',{name:'Not allowed',email:'unauthorized@example.test',password:'this-password-is-long-enough',role:'admin'})).response.status,403)
})
await test('Editor publishes and public sees story without team notes or ownership',async()=>{
 const submitted=await request(`/api/posts/${articleID}?draft=true`,writer,'PATCH',{reviewStage:'in-review'});assert.equal(submitted.response.status,200,JSON.stringify(submitted.body))
 const published=await request(`/api/posts/${articleID}`,editor,'PATCH',{_status:'published'});assert.equal(published.response.status,200,JSON.stringify(published.body))
 const result=await request(`/api/posts/${articleID}`);assert.equal(result.response.status,200)
 assert.equal(result.body.editorNotes,undefined);assert.equal(result.body.owner,undefined);assert.equal(result.body.reviewStage,undefined)
 const page=await fetch(`${base}/blog/${content.slug}/`);assert.equal(page.status,200);assert.ok(!(await page.text()).includes('PRIVATE TEST NOTE'))
})
await test('Saving a newer draft preserves the live version and hides draft text',async()=>{
 const changed=await request(`/api/posts/${articleID}?draft=true`,editor,'PATCH',{title:'UNPUBLISHED SECRET REVISION',_status:'draft'});assert.equal(changed.response.status,200,JSON.stringify(changed.body))
 const live=await request(`/api/posts/${articleID}`);assert.equal(live.body.title,content.title)
 const draftQuery=await request(`/api/posts/${articleID}?draft=true`);assert.ok(draftQuery.response.status===404 || draftQuery.body.title===content.title)
 const versions=await request(`/api/posts/versions?where[parent][equals]=${articleID}`);assert.equal(versions.response.status,403)
 const page=await fetch(`${base}/blog/${content.slug}/`);assert.ok(!(await page.text()).includes('UNPUBLISHED SECRET REVISION'))
})
await test('Disabled users lose editorial access, including existing tokens',async()=>{
 assert.equal((await request(`/api/users/${accounts[3].id}`,admin,'PATCH',{active:false})).response.status,200)
 assert.equal((await request('/api/posts',other,'POST',{...content,slug:`disabled-${suffix}`})).response.status,403)
 assert.equal((await request('/api/users/login',undefined,'POST',{email:accounts[3].email,password:accounts[3].password})).response.status,403)
})
await test('Search, archives, canonical metadata and indexing exclude private routes',async()=>{
 for(const url of ['/blog/','/blog/topic/background/','/blog/author/editorial-desk/','/blog/?q=engineering']){
 const response=await fetch(base+url);assert.equal(response.status,200,url);const html=await response.text();assert.match(html,/<h1>/);assert.match(html,/rel="canonical"/)
 }
 const results=await fetch(base+'/blog/?q=engineering');assert.match(await results.text(),/noindex, nofollow/)
 assert.equal((await fetch(base+'/blog/?page=9999')).status,404)
 const sitemap=await (await fetch(base+'/sitemap.xml')).text();assert.ok(sitemap.includes('/blog/topic/background/'));assert.ok(!sitemap.includes('/preview/'));assert.ok(!sitemap.includes('/admin/'))
})
console.log(`Local test article ID: ${articleID!}; fixtures are isolated from the production database.`)
await request(`/api/posts/${articleID!}`,editor,'PATCH',{_status:'draft'})
await request(`/api/users/${accounts[3].id}`,admin,'PATCH',{active:true})
