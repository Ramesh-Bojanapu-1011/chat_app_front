import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get('next-auth.session-token');
  const varcel_sessionToken = req.cookies.get(
    '__Secure-next-auth.session-token'
  );

  if (!sessionToken || !varcel_sessionToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'], // Protect specific routes
};
