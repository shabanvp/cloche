import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('cloche_auth_token')?.value || request.cookies.get('auth_token')?.value;
  const roleCookie = request.cookies.get('user_role')?.value || '';
  const role = roleCookie.toLowerCase();
  const path = request.nextUrl.pathname;

  // Define protected route prefixes
  const isUserRoute = path.startsWith('/user') || path.startsWith('/dashboard');
  const isVendorRoute = path.startsWith('/vendor') && !path.startsWith('/vendor/login') && !path.startsWith('/vendor/register');
  const isAdminRoute = path.startsWith('/admin');

  // If accessing a protected route without a token
  if (!token && (isUserRoute || isVendorRoute || isAdminRoute)) {
    if (isAdminRoute) {
      return NextResponse.redirect(new URL('/login?role=admin&unauthorized=true', request.url));
    }
    if (isVendorRoute) {
      return NextResponse.redirect(new URL('/vendor/login?unauthorized=true', request.url));
    }
    return NextResponse.redirect(new URL('/login?unauthorized=true', request.url));
  }

  // Cross-role access prevention
  if (token && role) {
    // If a vendor tries to access user route -> Redirect ONLY to /vendor/dashboard
    if (isUserRoute && (role === 'vendor' || role === 'partner')) {
      return NextResponse.redirect(new URL('/vendor/dashboard', request.url));
    }

    // If a user tries to access vendor route -> Redirect ONLY to /user/dashboard
    if (isVendorRoute && (role === 'user' || role === 'customer')) {
      return NextResponse.redirect(new URL('/user/dashboard', request.url));
    }

    // If a non-admin tries to access admin route -> Redirect to their specific role dashboard
    if (isAdminRoute && role !== 'admin' && role !== 'super_admin') {
      if (role === 'vendor' || role === 'partner') {
        return NextResponse.redirect(new URL('/vendor/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/user/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/user/:path*',
    '/dashboard/:path*',
    '/vendor/:path*',
    '/admin/:path*'
  ]
};
