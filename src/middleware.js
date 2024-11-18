import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';

export function middleware(request) {
  // Get token from cookies
  const token = request.cookies.get('token')?.value;

  // Check if the request is for protected routes
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/api/transactions') ||
                          request.nextUrl.pathname === '/';

  // If it's a protected route and no valid token, redirect to login
  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/',
    '/api/transactions/:path*'
  ]
};
