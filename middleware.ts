import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { UserRole } from './types/user';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // Admin routes - only admins can access
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (token?.role !== UserRole.ADMIN) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Staff routes - managers and admins can access
    if (req.nextUrl.pathname.startsWith('/staff')) {
      if (
        token?.role !== UserRole.MANAGER &&
        token?.role !== UserRole.ADMIN
      ) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: '/auth/login',
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/restaurants/:path*',
    '/menus/:path*',
    '/admin/:path*',
    '/staff/:path*',
  ],
};


