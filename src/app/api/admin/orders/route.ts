import { NextResponse } from 'next/server';
import { getOrders } from '@/lib/orders-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const orders = getOrders();
  return NextResponse.json({
    success: true,
    data: orders,
  });
}

