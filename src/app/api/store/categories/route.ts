import { NextResponse } from 'next/server';
import { getCategoriesAsync } from '@/lib/categories-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await getCategoriesAsync(true);
    return NextResponse.json({ success: true, categories });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
