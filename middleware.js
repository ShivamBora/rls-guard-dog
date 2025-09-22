import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();

  const { data: { session } } = await supabase.auth.getSession();

   
  if (!session && req.nextUrl.pathname !== '/login' && req.nextUrl.pathname !== '/signup') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

   
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/teacher', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};