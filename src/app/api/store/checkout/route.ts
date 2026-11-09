import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { saveOrderAsync } from '@/lib/orders-store';
import { Order } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().regex(/^[0-9]{10}$/, 'Must be a 10-digit Indian phone number'),
    email: z.string().email().optional().or(z.literal('')),
    deliveryAddress: z.string().min(5, 'Delivery address is required'),
    landmark: z.string().optional(),
    postalCode: z.string().regex(/^390\d{3}$/, 'Only Vadodara PIN codes (390xxx) are serviceable at launch'),
    deliveryInstructions: z.string().optional(),
  }),
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().optional(),
      title: z.string().optional(),
      unitPrice: z.number().optional(),
      quantity: z.number().int().positive(),
      imageUrl: z.string().optional(),
    })
  ).min(1, 'At least one item required in cart'),
  paymentMethod: z.enum(['MANUAL_UPI', 'COD']).default('MANUAL_UPI'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = checkoutSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Invalid checkout data provided.',
            details: validated.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const { customer, items, paymentMethod } = validated.data;

    // Generate unique reference and high-entropy secret token
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `BLOOM-${new Date().getFullYear()}${String(
      new Date().getMonth() + 1
    ).padStart(2, '0')}-${randomSuffix}`;
    const lookupToken = nanoid(24);
    const orderId = `ord-${Date.now()}`;

    const subtotal = items.reduce((sum, item) => sum + (item.unitPrice || 0) * item.quantity, 0);
    const deliveryFee = 50.0;
    const grandTotal = subtotal + deliveryFee;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      lookupToken,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      deliveryAddress: customer.deliveryAddress,
      landmark: customer.landmark,
      postalCode: customer.postalCode,
      deliveryInstructions: customer.deliveryInstructions,
      itemsSubtotal: subtotal,
      deliveryFee,
      discountTotal: 0,
      grandTotal,
      orderStatus: 'PENDING',
      paymentStatus: 'PENDING',
      paymentMethod,
      items: items.map((i, idx) => ({
        id: `item-${orderId}-${idx}`,
        orderId,
        productId: i.productId,
        variantId: i.variantId,
        productTitle: i.title || 'Handmade Creation',
        unitPrice: i.unitPrice || 0,
        quantity: i.quantity,
        totalPrice: (i.unitPrice || 0) * i.quantity,
        imageUrl: i.imageUrl,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveOrderAsync(newOrder);

    return NextResponse.json(
      {
        success: true,
        data: {
          orderNumber,
          lookupToken,
          trackingUrl: `/orders/track?token=${lookupToken}`,
          customerName: customer.name,
          paymentMethod,
          deliveryFee,
          grandTotal,
          orderStatus: 'PENDING',
          paymentStatus: 'PENDING',
          createdAt: newOrder.createdAt,
        },
        message: 'Order created successfully. Please confirm via WhatsApp to complete!',
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || 'An error occurred during checkout.',
        },
      },
      { status: 500 }
    );
  }
}
