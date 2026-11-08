import { NextResponse } from 'next/server';
import { getEnquiries } from '@/lib/enquiries-store';

export async function GET() {
  const enquiries = getEnquiries();
  return NextResponse.json({
    success: true,
    data: enquiries,
  });
}

