// middleware.ts (or src/middleware.ts)
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If user is not signed in and the current path starts with /dashboard
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  // If user is signed in and the current path starts with /auth
  if (session && req.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

// Define which routes to run the middleware on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*'
  ],
};