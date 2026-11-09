import { NextResponse } from 'next/server';
import { getOrdersAsync } from '@/lib/orders-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const orders = await getOrdersAsync();
  return NextResponse.json({
    success: true,
    data: orders,
  });
}

