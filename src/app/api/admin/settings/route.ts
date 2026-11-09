import { NextResponse } from 'next/server';
import { getSettingsAsync, saveSettingsAsync } from '@/lib/settings-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getSettingsAsync();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve admin settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const updates = await request.json();
    const updated = await saveSettingsAsync(updates);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

