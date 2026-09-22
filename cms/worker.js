import handler from './.open-next/worker.js'
import crypto from 'node:crypto'
import { createWorkersPbkdf2 } from './src/lib/workers-crypto.ts'
import passwordKdf from './crypto/payload-pbkdf2.wasm'
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from './.open-next/worker.js'

crypto.pbkdf2 = createWorkersPbkdf2(crypto.pbkdf2, passwordKdf)

export default {
 async fetch(request, env, ctx) {
  const url = new URL(request.url)
  if (url.hostname === 'www.olubunmitunjiojo.com' || url.protocol === 'http:') {
   url.hostname = 'olubunmitunjiojo.com'
   url.protocol = 'https:'
   return Response.redirect(url.href, 308)
  }
  const previewHost = url.hostname.endsWith('.workers.dev')
  if (previewHost && url.pathname === '/robots.txt') {
   return new Response('User-agent: *\nDisallow: /\n', {headers: {'Content-Type': 'text/plain', 'X-Robots-Tag': 'noindex, nofollow'}})
  }
  const response = await handler.fetch(request, env, ctx)
  if (!previewHost) return response
  const protectedResponse = new Response(response.body, response)
  protectedResponse.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return protectedResponse
 },
}
