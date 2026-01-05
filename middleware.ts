import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Allow access to login page without authentication
  if (pathname === '/login') {
    return NextResponse.next()
  }

  // Check for auth token in cookies or localStorage equivalent
  const token = request.cookies.get('authToken')?.value

  // If no token and trying to access protected route, redirect to login
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Apply middleware to all routes except static files and API
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
