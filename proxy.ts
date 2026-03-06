import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ROLE_HOME: Record<string, string> = {
  ADMIN:  '/admin',
  TUTOR:  '/tutor',
  PARENT: '/parent',
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const queryParamString = request.nextUrl.searchParams.size
    ? `?${request.nextUrl.searchParams.toString()}`
    : ''

  if (pathname === '/api/login') {
    return NextResponse.next()
  }

  // API Proxy
  if (pathname.startsWith('/api/base')) {
    const path = pathname.substring(9)
    return NextResponse.rewrite(
      new URL('https://back-end-main.onrender.com' + path + queryParamString)
    )
  }
  if (pathname.startsWith('/api')) {
    return NextResponse.rewrite(
      new URL('https://back-end-main.onrender.com' + pathname + queryParamString)
    )
  }

  // Role Protection
  const isProtectedRoute =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/tutor') ||
    pathname.startsWith('/parent')

  if (!isProtectedRoute) return NextResponse.next()

  const role = request.cookies.get('tt_role')?.value

  if (!role || !ROLE_HOME[role]) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname + queryParamString)
    return NextResponse.redirect(loginUrl)
  }

  const allowedPrefix = ROLE_HOME[role]
  if (!pathname.startsWith(allowedPrefix)) {
    return NextResponse.redirect(new URL(allowedPrefix, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*', '/tutor/:path*', '/parent/:path*'],
}
