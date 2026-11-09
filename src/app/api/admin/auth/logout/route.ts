import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Signed out successfully.',
  });

  response.cookies.set('thc_admin_auth', '', {
    path: '/',
    maxAge: 0,
  });

  return response;
}

