import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/settings-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = getSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve settings' },
      { status: 500 }
    );
  }
}

