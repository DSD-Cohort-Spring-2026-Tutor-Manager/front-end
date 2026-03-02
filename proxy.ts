import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function proxy(request: NextRequest) {
  const queryParamString = request.nextUrl.searchParams.size ? `?${request.nextUrl.searchParams.toString()}` : '';
  if (request.nextUrl.pathname.startsWith('/api')) {
    const rewriteUrl = new URL('https://back-end-main.onrender.com' + request.nextUrl.pathname + queryParamString)
    console.debug(rewriteUrl);
    return NextResponse.rewrite(rewriteUrl)
  }

  if (request.nextUrl.pathname.startsWith('/api/base')) {
    const path = request.nextUrl.pathname.substring(9);
    const rewriteUrl = new URL('https://back-end-main.onrender.com' + path + queryParamString)
    console.debug(rewriteUrl);
    return NextResponse.rewrite(rewriteUrl)

  }
}

 
export const config = {
  matcher: [
    '/api/:path*',
  ],
}