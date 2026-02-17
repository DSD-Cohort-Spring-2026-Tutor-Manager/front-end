import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    const rewriteUrl = new URL('https://back-end-main.onrender.com' +
        request.nextUrl.pathname
    )
    return NextResponse.rewrite(rewriteUrl)
  }
}

 
export const config = {
  matcher: [
    '/api/:path*',
],
}