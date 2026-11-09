import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ADMIN_CREDENTIALS = {
  email: 'krmanishh18@gmail.com',
  password: 'Manish@827173@@',
};

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const normalizedEmail = (email || '').trim().toLowerCase();
    const isEmailValid = normalizedEmail === ADMIN_CREDENTIALS.email.toLowerCase();
    const isPasswordValid = password === ADMIN_CREDENTIALS.password;

    if (!isEmailValid || !isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid credentials. Please verify your artisan email and password.',
        },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Signed in successfully to Bloomora Admin.',
      user: {
        email: ADMIN_CREDENTIALS.email,
        name: 'Manish Kumar',
        role: 'OWNER_ARTISAN',
      },
    });

    // Set secure authentication cookie for 7 days
    response.cookies.set('thc_admin_auth', 'authenticated', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal login error' },
      { status: 500 }
    );
  }
}

