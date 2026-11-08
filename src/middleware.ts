import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Guard all /admin routes except /admin/login
  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login')
  ) {
    // Check for admin session cookie
    const adminSession = request.cookies.get('thc_admin_auth')?.value;
    const isLocalDev = process.env.NODE_ENV !== 'production';

    // Allow local development preview or verified admin cookie
    if (!adminSession && !isLocalDev) {
      const redirectUrl = new URL('/admin/login', request.url);
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
