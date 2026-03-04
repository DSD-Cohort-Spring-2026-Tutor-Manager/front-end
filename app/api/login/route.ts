// app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL =
  process.env.BACKEND_URL ?? 'https://back-end-main.onrender.com'

export async function POST(request: NextRequest) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)

  try {
    const body = await request.json()

    const backendRes = await fetch(`${BACKEND_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!backendRes.ok) {
      console.error('Login upstream error status:', backendRes.status)

      return NextResponse.json(
        { success: false, message: 'Unable to login. Please try again.' },
        { status: backendRes.status },
      )
    }

    const data = await backendRes.json()

    const response = NextResponse.json(data, { status: backendRes.status })

    if (data.success && data.role) {
      response.cookies.set('tt_role', data.role, {
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
    }

    return response
  } catch (error) {
    clearTimeout(timeout)
    console.error('Login route error:', error)

    const status =
      error instanceof DOMException && error.name === 'AbortError' ? 504 : 500

    return NextResponse.json(
      { success: false, message: 'Login service unavailable. Please try again.' },
      { status },
    )
  }
}