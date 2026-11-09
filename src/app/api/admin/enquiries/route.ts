import { NextResponse } from 'next/server';
import { getEnquiriesAsync } from '@/lib/enquiries-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const enquiries = await getEnquiriesAsync();
  return NextResponse.json({
    success: true,
    data: enquiries,
  });
}

