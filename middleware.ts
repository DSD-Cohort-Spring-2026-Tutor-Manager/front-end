// middleware.ts  (root of project, same level as /app)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ROLE_HOME: Record<string, string> = {
  ADMIN:  '/admin',
  TUTOR:  '/tutor',
  PARENT: '/parent',
}

export function middleware(request: NextRequest) {
  console.log('🍪 ALL COOKIES:', request.cookies.getAll())  // ← add this
  console.log('🔑 tt_role:', request.cookies.get('tt_role')?.value) 
  const { pathname } = request.nextUrl
  const queryParamString = request.nextUrl.searchParams.size
    ? `?${request.nextUrl.searchParams.toString()}`
    : ''

  // ── 0. LET /api/login HIT THE ROUTE HANDLER ────────────────────────────────
  // This must run before the generic /api proxy so that our
  // `app/api/login/route.ts` handler can set cookies and normalize the response.
  if (pathname === '/api/login') {
    return NextResponse.next()
  }

  // ── 1. API PROXY (moved from proxy.ts) ────────────────────────────────────
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

  // ── 2. ROLE-BASED PROTECTION ──────────────────────────────────────────────
  const isProtectedRoute =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/tutor') ||
    pathname.startsWith('/parent')

  if (!isProtectedRoute) return NextResponse.next()

  const role = request.cookies.get('tt_role')?.value  // "ADMIN" | "TUTOR" | "PARENT"

  // Not logged in → send to login
  if (!role || !ROLE_HOME[role]) {
    const loginUrl = new URL('/login', request.url)
    // Preserve the originally requested path so the UI can
    // send the user back to a valid destination after login.
    loginUrl.searchParams.set('redirect', pathname + queryParamString)
    return NextResponse.redirect(loginUrl)
  }

  // Wrong role for this route → send to their actual home
  const allowedPrefix = ROLE_HOME[role]
  if (!pathname.startsWith(allowedPrefix)) {
    return NextResponse.redirect(new URL(allowedPrefix, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*', '/tutor/:path*', '/parent/:path*'],
}