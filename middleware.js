import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  // Create a response object to pass down the chain
  const res = NextResponse.next();

  // Create a Supabase client configured for middleware
  const supabase = createMiddlewareClient({ req, res });

  // Refresh the session if it's expired. This is crucial for keeping users logged in.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If the user is not signed in and is trying to access any page
  // other than the login page, redirect them to the login page.
  if (!session && req.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If the user is signed in and tries to go to the login page,
  // redirect them to a default page (e.g., /teacher).
  if (session && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/teacher', req.url));
  }

  // If none of the above conditions are met, allow the request to proceed
  return res;
}

// This config ensures the middleware runs on all paths except for static assets.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};