import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Handle requests here if needed
    const  token  = req.cookies;
    if (!token) {
      return NextResponse.redirect('/auth/login');
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/auth/login',
    },
  }
);

export const config = {
  matcher: [
    '/profile',
    '/orders',
    '/settings',
  ],
}; 