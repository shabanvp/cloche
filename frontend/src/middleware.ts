import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const role = request.cookies.get('user_role')?.value;
  const path = request.nextUrl.pathname;

  // Define protected route prefixes
  const isCustomerRoute = path.startsWith('/dashboard');
  const isVendorRoute = path.startsWith('/vendor');
  const isAdminRoute = path.startsWith('/admin');

  // If accessing a protected route without a token
  if (!token && (isCustomerRoute || isVendorRoute || isAdminRoute)) {
    if (isAdminRoute) {
      return NextResponse.redirect(new URL('/adminlogin.html', request.url));
    }
    if (isVendorRoute) {
      return NextResponse.redirect(new URL('/boutiquelogin.html', request.url));
    }
    return NextResponse.redirect(new URL('/login.html', request.url));
  }

  // Cross-role access prevention
  if (token && role) {
    if (isCustomerRoute && role !== 'user' && role !== 'customer') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    if (isVendorRoute && role !== 'vendor' && role !== 'partner') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (isAdminRoute && role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/vendor/:path*',
    '/admin/:path*'
  ]
};
