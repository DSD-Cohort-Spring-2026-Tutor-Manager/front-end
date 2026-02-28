import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const BASE_URL = 'https://back-end-main.onrender.com';
 
export function proxy(request: NextRequest) {
  console.log('Original nextUrl:', request.nextUrl.toString())
  const queryParamString = request.nextUrl.searchParams.size ? `?${request.nextUrl.searchParams.toString()}` : '';

  if (request.nextUrl.pathname.startsWith('/api/base')) {
    const path = request.nextUrl.pathname.substring(9);
    const rewriteUrl = new URL(BASE_URL + path + queryParamString);
    console.debug('Rewritten to:', rewriteUrl.toString());
    return NextResponse.rewrite(rewriteUrl)
  } else if (request.nextUrl.pathname.startsWith('/api')) {
    const rewriteUrl = new URL(BASE_URL + request.nextUrl.pathname + queryParamString);
    console.debug('Rewritten to:', rewriteUrl.toString());
    return NextResponse.rewrite(rewriteUrl)
  }
}

 
export const config = {
  matcher: [
    '/api/:path*',
  ],
}