import { NextResponse, type NextRequest } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  LEGACY_ADMIN_COOKIE_NAME,
  verifyAdminSessionToken,
} from '@/lib/admin-auth';

const PUBLIC_ADMIN_PATHS = new Set(['/admin/login']);
const PUBLIC_ADMIN_API_PATHS = new Set(['/api/admin/auth/login', '/api/admin/auth/logout']);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ADMIN_PATHS.has(pathname) || PUBLIC_ADMIN_API_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const token =
    request.cookies.get(ADMIN_COOKIE_NAME)?.value ||
    request.cookies.get(LEGACY_ADMIN_COOKIE_NAME)?.value;

  const session = await verifyAdminSessionToken(token);

  if (!session) {
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Valid studio admin session required.' },
        { status: 401 }
      );
    }

    const redirectUrl = new URL('/admin/login', request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin', '/api/admin/:path*'],
};
