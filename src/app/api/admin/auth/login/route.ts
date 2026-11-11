import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  ADMIN_COOKIE_NAME,
  LEGACY_ADMIN_COOKIE_NAME,
  checkLoginRateLimit,
  clearLoginRateLimit,
  signAdminSessionToken,
  verifyAdminCredentials,
} from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

function getClientIdentifier(request: NextRequest, email: string): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIp = request.headers.get('x-real-ip')?.trim();
  const ip = forwarded || realIp || 'local';
  return `${ip}:${email.trim().toLowerCase()}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || 'Email and password are required.',
        },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const rateKey = getClientIdentifier(request, email);
    const rate = checkLoginRateLimit(rateKey);

    if (!rate.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many login attempts. Please retry in ${Math.ceil(rate.retryAfterSeconds / 60)} minute(s).`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rate.retryAfterSeconds) },
        }
      );
    }

    const valid = await verifyAdminCredentials(email, password);
    if (!valid) {
      return NextResponse.json(
        { success: false, error: 'Invalid Studio credentials. Please check and retry.' },
        { status: 401 }
      );
    }

    const signedToken = await signAdminSessionToken(email);
    if (!signedToken) {
      return NextResponse.json(
        { success: false, error: 'Admin session secret is not configured on the server.' },
        { status: 500 }
      );
    }

    clearLoginRateLimit(rateKey);

    const response = NextResponse.json({
      success: true,
      message: 'Welcome back to Bloomora Studio!',
      user: {
        email: email.trim().toLowerCase(),
        role: 'Studio Owner',
      },
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    };

    response.cookies.set(ADMIN_COOKIE_NAME, signedToken, cookieOptions);
    // Clear legacy unsigned cookie if still present in browser
    response.cookies.set(LEGACY_ADMIN_COOKIE_NAME, '', { path: '/', maxAge: 0 });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred during sign in.' },
      { status: 500 }
    );
  }
}
