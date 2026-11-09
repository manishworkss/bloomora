import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatusAsync, getOrdersAsync } from '@/lib/orders-store';
import { OrderStatus } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['READY_FOR_DELIVERY', 'CANCELLED'],
  READY_FOR_DELIVERY: ['OUT_FOR_DELIVERY', 'CANCELLED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'CANCELLED'],
  DELIVERED: ['RETURNED'],
  CANCELLED: [],
  RETURNED: [],
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { newStatus, notes } = body;

    const allOrders = await getOrdersAsync();
    const currentOrder = allOrders.find((o) => o.id === id || o.orderNumber === id);

    if (!currentOrder) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Order not found.' } },
        { status: 404 }
      );
    }

    const allowed = VALID_TRANSITIONS[currentOrder.orderStatus] || [];
    if (!allowed.includes(newStatus)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_TRANSITION',
            message: `Cannot transition order status directly from ${currentOrder.orderStatus} to ${newStatus}.`,
          },
        },
        { status: 400 }
      );
    }

    const updated = await updateOrderStatusAsync(id, newStatus, notes);

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Order status advanced to ${newStatus}.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

