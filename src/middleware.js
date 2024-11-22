import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';

export function middleware(request) {
  // Get token from cookies
  const token = request.cookies.get('token')?.value;

  // Check if the request is for protected routes
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith('/api/transactions') ||
    request.nextUrl.pathname.startsWith('/transactions') ||
    request.nextUrl.pathname === '/dashboard';

  // If it's a protected route and no valid token, redirect to login
  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      verifyToken(token);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard',
    '/transactions',
    '/api/transactions/:path*',
    '/api/accounts/:path*'
  ]
};
