import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { saveOrderAsync } from '@/lib/orders-store';
import { getSettingsAsync } from '@/lib/settings-store';
import { getProductsAsync } from '@/lib/products-store';
import { getDeliveryZonesAsync } from '@/lib/delivery-zones-store';
import { resolveAuthoritativeOrderPricing } from '@/lib/gift-addons';
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
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        variantId: z.string().optional(),
        title: z.string().optional(),
        unitPrice: z.number().optional(),
        quantity: z.number().int().positive().max(25, 'Maximum 25 units per item per order'),
        imageUrl: z.string().optional(),
        addOnIds: z.array(z.string()).optional(),
        giftMessage: z.string().max(180).optional(),
      })
    )
    .min(1, 'At least one item required in cart'),
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

    const [settings, catalogProducts, deliveryZones] = await Promise.all([
      getSettingsAsync(),
      getProductsAsync(true),
      getDeliveryZonesAsync(),
    ]);

    const fallbackDeliveryFee =
      typeof settings.deliveryFee === 'number' && settings.deliveryFee >= 0
        ? settings.deliveryFee
        : 50.0;

    const pricing = resolveAuthoritativeOrderPricing({
      inputs: items,
      catalogProducts,
      deliveryZones,
      postalCode: customer.postalCode,
      fallbackDeliveryFee,
    });

    if (pricing.inactiveZonePin) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'ZONE_UNAVAILABLE',
            message: `Delivery is currently paused for PIN ${pricing.inactiveZonePin}. Please contact us on WhatsApp to arrange studio pickup or special courier.`,
          },
        },
        { status: 400 }
      );
    }

    if (pricing.unknownProductIds.length > 0 || pricing.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_CART_ITEMS',
            message: 'One or more items in your bag are no longer available. Please refresh your cart.',
          },
        },
        { status: 400 }
      );
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `BLOOM-${new Date().getFullYear()}${String(
      new Date().getMonth() + 1
    ).padStart(2, '0')}-${randomSuffix}`;
    const lookupToken = nanoid(24);
    const orderId = `ord-${Date.now()}`;
    const nowIso = new Date().toISOString();

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
      itemsSubtotal: pricing.itemsSubtotal,
      deliveryFee: pricing.deliveryFee,
      discountTotal: 0,
      grandTotal: pricing.grandTotal,
      orderStatus: 'PENDING',
      paymentStatus: 'PENDING',
      paymentMethod,
      items: pricing.items.map((line, idx) => ({
        id: `item-${orderId}-${idx}`,
        orderId,
        productId: line.productId,
        variantId: line.variantId,
        productTitle: line.productTitle,
        unitPrice: line.unitPrice,
        quantity: line.quantity,
        totalPrice: line.totalPrice,
        imageUrl: line.imageUrl,
      })),
      createdAt: nowIso,
      updatedAt: nowIso,
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
          itemsSubtotal: pricing.itemsSubtotal,
          deliveryFee: pricing.deliveryFee,
          grandTotal: pricing.grandTotal,
          orderStatus: 'PENDING',
          paymentStatus: 'PENDING',
          createdAt: newOrder.createdAt,
        },
        message: 'Order created successfully. Please confirm via WhatsApp to complete!',
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred during checkout.';
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message,
        },
      },
      { status: 500 }
    );
  }
}
