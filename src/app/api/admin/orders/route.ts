import { NextResponse } from 'next/server';
import { getOrders } from '@/lib/orders-store';

export async function GET() {
  const orders = getOrders();
  return NextResponse.json({
    success: true,
    data: orders,
  });
}
