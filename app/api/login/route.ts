// app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const backendRes = await fetch('https://back-end-main.onrender.com/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await backendRes.json()
  
  console.log('🔑 Backend response:', data) // ← shows us exact shape

  const response = NextResponse.json(data, { status: backendRes.status })

  if (data.success && data.role) {
    response.cookies.set('tt_role', data.role, {
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      httpOnly: false,
    })
  }

  return response
}