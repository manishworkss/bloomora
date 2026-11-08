import { NextRequest, NextResponse } from 'next/server';
import { findOrderByTokenOrNumber } from '@/lib/orders-store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lookupToken: string }> }
) {
  const { lookupToken } = await params;

  if (!lookupToken) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'MISSING_TOKEN', message: 'Tracking identifier required.' },
      },
      { status: 400 }
    );
  }

  const order = findOrderByTokenOrNumber(lookupToken);

  if (!order) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'ORDER_NOT_FOUND',
          message: 'No order found matching this tracking token or order number.',
        },
      },
      { status: 404 }
    );
  }

  // Mask phone for PII safety on public tracking
  const maskedPhone =
    order.customerPhone.length >= 10
      ? `${order.customerPhone.slice(0, 3)}****${order.customerPhone.slice(-3)}`
      : '***';

  return NextResponse.json({
    success: true,
    data: {
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhoneMasked: maskedPhone,
      deliveryAddress: order.deliveryAddress,
      landmark: order.landmark,
      postalCode: order.postalCode,
      itemsSubtotal: order.itemsSubtotal,
      deliveryFee: order.deliveryFee,
      grandTotal: order.grandTotal,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      items: order.items,
      createdAt: order.createdAt,
    },
  });
}

