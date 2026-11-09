import { NextResponse } from 'next/server';
import { getSettingsAsync } from '@/lib/settings-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getSettingsAsync();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve settings' },
      { status: 500 }
    );
  }
}

