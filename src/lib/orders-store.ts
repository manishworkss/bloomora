import { Order, OrderStatus } from '@/types';
import { readJsonFile, writeJsonFile } from './json-db';

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
