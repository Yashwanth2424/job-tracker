import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

const guestPages = ['/', '/login', '/register']

async function isLoggedIn(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  if (!token) {
    return false
  }

  try {
    await verifyToken(token)
    return true
  } catch {
    return false
  }
}

export async function proxy(req: NextRequest) {
  const loggedIn = await isLoggedIn(req)
  const isGuestPage = guestPages.includes(req.nextUrl.pathname)

  if (isGuestPage && loggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (!isGuestPage && !loggedIn) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/register', '/dashboard/:path*'],
}
