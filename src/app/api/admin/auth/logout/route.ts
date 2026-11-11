import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, LEGACY_ADMIN_COOKIE_NAME } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Signed out successfully.',
  });

  const clearOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };

  response.cookies.set(ADMIN_COOKIE_NAME, '', clearOptions);
  response.cookies.set(LEGACY_ADMIN_COOKIE_NAME, '', clearOptions);

  return response;
}
