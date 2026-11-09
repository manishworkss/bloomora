import { Order, OrderStatus } from '@/types';
import { readJsonFile, writeJsonFile } from './json-db';
import { createAdminClient } from './supabase/admin';
import { isSupabaseConfigured } from './supabase/status';

const ORDERS_FILE = 'orders.json';

export const SEED_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'BLM-202611-0042',
    lookupToken: 'tok_lavender_42',
    customerName: 'Ananya Patel',
    customerPhone: '9876543210',
    customerEmail: 'ananya.p@example.com',
    deliveryAddress: 'B-402, Shivalik Greens, Near Gotri Lake Road',
    landmark: 'Gotri Lake',
    postalCode: '390021',
    deliveryInstructions: 'Please add a pink ribbon bow.',
    itemsSubtotal: 899,
    deliveryFee: 50,
    discountTotal: 0,
    grandTotal: 949,
    orderStatus: 'PROCESSING',
    paymentStatus: 'PAID',
    paymentMethod: 'MANUAL_UPI',
    items: [
      {
        id: 'item-1',
        orderId: 'ord-101',
        productId: 'prod-001',
        productTitle: 'Everlasting Crochet Lavender & Tulip Bouquet',
        unitPrice: 899,
        quantity: 1,
        totalPrice: 899,
        imageUrl:
          'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=400&auto=format&fit=crop',
      },
    ],
    createdAt: '2026-11-09T01:15:00Z',
    updatedAt: '2026-11-09T01:15:00Z',
  },
  {
    id: 'ord-102',
    orderNumber: 'BLM-202611-0041',
    lookupToken: 'tok_sunflower_41',
    customerName: 'Pooja Shah',
    customerPhone: '9825012345',
    customerEmail: 'pooja.shah@example.com',
    deliveryAddress: 'Flat 12, Alkapuri Arcade, Race Course Road',
    landmark: 'Opposite Inox',
    postalCode: '390001',
    deliveryInstructions: 'Birthday gift on 12th Nov.',
    itemsSubtotal: 798,
    deliveryFee: 50,
    discountTotal: 0,
    grandTotal: 848,
    orderStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    paymentMethod: 'MANUAL_UPI',
    items: [
      {
        id: 'item-2',
        orderId: 'ord-102',
        productId: 'prod-002',
        productTitle: 'Mini Smiling Sunflower Crochet Desk Pot',
        unitPrice: 399,
        quantity: 2,
        totalPrice: 798,
        imageUrl:
          'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=400&auto=format&fit=crop',
      },
    ],
    createdAt: '2026-11-08T21:30:00Z',
    updatedAt: '2026-11-08T21:30:00Z',
  },
  {
    id: 'ord-103',
    orderNumber: 'BLM-202611-0040',
    lookupToken: 'tok_daisy_40',
    customerName: 'Kavita Joshi',
    customerPhone: '9909012345',
    customerEmail: 'kavita.j@example.com',
    deliveryAddress: '14 Royal Residency, Manjalpur',
    postalCode: '390020',
    itemsSubtotal: 627,
    deliveryFee: 50,
    discountTotal: 0,
    grandTotal: 677,
    orderStatus: 'DELIVERED',
    paymentStatus: 'PAID',
    paymentMethod: 'MANUAL_UPI',
    items: [
      {
        id: 'item-3',
        orderId: 'ord-103',
        productId: 'prod-003',
        productTitle: 'Handmade Daisy Flower Charm Keychain',
        unitPrice: 199,
        quantity: 2,
        totalPrice: 398,
        imageUrl:
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&auto=format&fit=crop',
      },
      {
        id: 'item-4',
        orderId: 'ord-103',
        productId: 'prod-006',
        productTitle: 'Fluffy Strawberry Amigurumi Keychain',
        unitPrice: 229,
        quantity: 1,
        totalPrice: 229,
        imageUrl:
          'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=400&auto=format&fit=crop',
      },
    ],
    createdAt: '2026-11-08T16:10:00Z',
    updatedAt: '2026-11-08T16:10:00Z',
  },
];

export function getOrders(): Order[] {
  return readJsonFile<Order[]>(ORDERS_FILE, SEED_ORDERS);
}

export function findOrderByTokenOrNumber(identifier: string): Order | undefined {
  const orders = getOrders();
  const clean = identifier.trim().toLowerCase();
  return orders.find(
    (o) => o.lookupToken.toLowerCase() === clean || o.orderNumber.toLowerCase() === clean
  );
}

export function saveOrder(order: Order): Order {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === order.id || o.orderNumber === order.orderNumber);

  if (index > -1) {
    orders[index] = { ...order, updatedAt: new Date().toISOString() };
    writeJsonFile(ORDERS_FILE, orders);
    return orders[index];
  }

  orders.unshift(order);
  writeJsonFile(ORDERS_FILE, orders);
  return order;
}

export function updateOrderStatus(orderId: string, newStatus: OrderStatus, notes?: string): Order | null {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) return null;

  orders[index] = {
    ...orders[index],
    orderStatus: newStatus,
    internalNotes: notes !== undefined ? notes : orders[index].internalNotes,
    updatedAt: new Date().toISOString(),
  };

  writeJsonFile(ORDERS_FILE, orders);
  return orders[index];
}

function mapSupabaseOrder(row: any, items: any[] = []): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    lookupToken: row.lookup_token,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email || undefined,
    deliveryAddress: row.delivery_address,
    landmark: row.delivery_landmark || undefined,
    postalCode: row.postal_code,
    deliveryInstructions: row.delivery_instructions || undefined,
    itemsSubtotal: Number(row.items_subtotal),
    deliveryFee: Number(row.delivery_fee),
    discountTotal: Number(row.discount_total || 0),
    grandTotal: Number(row.grand_total),
    orderStatus: row.order_status,
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method,
    paymentReference: row.payment_reference || undefined,
    internalNotes: row.internal_notes || undefined,
    items: items.map((it: any) => ({
      id: it.id,
      orderId: it.order_id,
      productId: it.product_id || '',
      variantId: it.variant_id || undefined,
      productTitle: it.product_title_snapshot,
      unitPrice: Number(it.unit_price_snapshot),
      quantity: Number(it.quantity),
      totalPrice: Number(it.total_price_snapshot),
      imageUrl: it.image_url_snapshot || undefined,
    })),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getOrdersAsync(): Promise<Order[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const { data: ordersData, error: ordersErr } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!ordersErr && ordersData && ordersData.length > 0) {
        const orderIds = ordersData.map((o) => o.id);
        const { data: itemsData } = await supabase
          .from('order_items')
          .select('*')
          .in('order_id', orderIds);

        const itemsByOrderId: Record<string, any[]> = {};
        for (const item of itemsData || []) {
          if (!itemsByOrderId[item.order_id]) itemsByOrderId[item.order_id] = [];
          itemsByOrderId[item.order_id].push(item);
        }

        const localOrders = getOrders();
        const mapped = ordersData.map((row) =>
          mapSupabaseOrder(row, itemsByOrderId[row.id] || [])
        );

        // Merge any local-only mock orders that aren't in Supabase yet
        const cloudOrderNumbers = new Set(mapped.map((o) => o.orderNumber));
        for (const lo of localOrders) {
          if (!cloudOrderNumbers.has(lo.orderNumber)) {
            mapped.push(lo);
          }
        }
        return mapped;
      }
    } catch {
      // Fall back to JSON
    }
  }
  return getOrders();
}

export async function saveOrderAsync(order: Order): Promise<Order> {
  const saved = saveOrder(order);
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const orderPayload = {
        order_number: order.orderNumber,
        lookup_token: order.lookupToken,
        idempotency_key: order.id,
        customer_name: order.customerName,
        customer_phone: order.customerPhone,
        customer_email: order.customerEmail || null,
        delivery_address: order.deliveryAddress,
        delivery_landmark: order.landmark || null,
        postal_code: order.postalCode,
        delivery_instructions: order.deliveryInstructions || null,
        items_subtotal: order.itemsSubtotal,
        delivery_fee: order.deliveryFee,
        discount_total: order.discountTotal || 0,
        grand_total: order.grandTotal,
        order_status: order.orderStatus,
        payment_status: order.paymentStatus,
        payment_method: order.paymentMethod,
        internal_notes: order.internalNotes || null,
      };

      const { data: created, error } = await supabase
        .from('orders')
        .insert(orderPayload)
        .select()
        .single();

      if (!error && created && order.items && order.items.length > 0) {
        const itemsPayload = order.items.map((item) => ({
          order_id: created.id,
          product_title_snapshot: item.productTitle,
          unit_price_snapshot: item.unitPrice,
          quantity: item.quantity,
          total_price_snapshot: item.totalPrice,
          image_url_snapshot: item.imageUrl || null,
        }));
        await supabase.from('order_items').insert(itemsPayload);
      }
    } catch {
      // JSON already saved
    }
  }
  return saved;
}

export async function updateOrderStatusAsync(
  orderId: string,
  newStatus: OrderStatus,
  notes?: string
): Promise<Order | null> {
  const updated = updateOrderStatus(orderId, newStatus, notes);
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const updatePayload: Record<string, any> = {
        order_status: newStatus,
        updated_at: new Date().toISOString(),
      };
      if (notes !== undefined) {
        updatePayload.internal_notes = notes;
      }
      await supabase
        .from('orders')
        .update(updatePayload)
        .or(`id.eq.${orderId},order_number.eq.${orderId}`);
    } catch {
      // JSON already updated
    }
  }
  return updated;
}
