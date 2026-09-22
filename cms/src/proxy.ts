import { NextResponse, type NextRequest } from 'next/server'
export function proxy(request: NextRequest) {
 // Team accounts are provisioned by the owner, never through public registration.
 if (request.nextUrl.pathname.replace(/\/$/,'') === '/api/users/first-register') return NextResponse.json({errors:[{message:'Public registration is disabled.'}]},{status:403})
 const response=NextResponse.next()
 if (/^\/(admin|api|preview)(\/|$)/.test(request.nextUrl.pathname)) {
  response.headers.set('X-Robots-Tag','noindex, nofollow')
  response.headers.set('Cache-Control','private, no-store')
 }
 response.headers.set('X-Content-Type-Options','nosniff')
 response.headers.set('Referrer-Policy','strict-origin-when-cross-origin')
 response.headers.set('X-Frame-Options','SAMEORIGIN')
 return response
}
export const config={matcher:['/admin/:path*','/api/:path*','/preview/:path*']}
