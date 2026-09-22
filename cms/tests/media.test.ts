import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
const base='http://localhost:3000'
const accounts=JSON.parse(await readFile('.test-accounts.json','utf8'))
await test('Images require staff authentication and persist with credits in the media store',async()=>{
 const login=await fetch(base+'/api/users/login/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(accounts[2])}).then(r=>r.json())
 assert.ok(login.token)
 const makeForm=()=>{const f=new FormData();f.set('_payload',JSON.stringify({alt:'Local test pixel',credit:'Test fixture',source:'https://example.com/test-fixture',rights:'Generated test fixture, no third-party content'}));f.set('file',new Blob([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aG1cAAAAASUVORK5CYII=','base64')],{type:'image/png'}),`test-pixel-${Date.now()}.png`);return f}
 assert.equal((await fetch(base+'/api/media/',{method:'POST',body:makeForm()})).status,403)
 const uploaded=await fetch(base+'/api/media/',{method:'POST',headers:{Authorization:`JWT ${login.token}`},body:makeForm()})
 const result=await uploaded.json();assert.equal(uploaded.status,201,JSON.stringify(result))
 assert.equal(result.doc.credit,'Test fixture')
 const image=await fetch(new URL(result.doc.url,base));assert.equal(image.status,200);assert.match(image.headers.get('content-type')||'',/image\/png/)
 assert.ok((await image.arrayBuffer()).byteLength>0)
})
