'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, MessageCircle, CheckCircle, Clock, Truck, Package, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatINR } from '@/lib/formatters';
import { OrderStatus } from '@/types';

const INITIAL_ORDERS = [
  {
    id: 'ord-101',
    orderNumber: 'THC-202611-0042',
    customer: 'Ananya Patel',
    phone: '9876543210',
    address: 'B-402, Shivalik Greens, Near Gotri Lake Road, Vadodara - 390021',
    items: 'Everlasting Lavender & Tulip Bouquet x 1',
    total: 949,
    status: 'PROCESSING' as OrderStatus,
    date: '09 Nov 2026, 01:15 AM',
    notes: 'Please add a pink ribbon bow.',
  },
  {
    id: 'ord-102',
    orderNumber: 'THC-202611-0041',
    customer: 'Pooja Shah',
    phone: '9825012345',
    address: 'Flat 12, Alkapuri Arcade, Race Course Road, Vadodara - 390001',
    items: 'Mini Smiling Sunflower Desk Pot x 2',
    total: 848,
    status: 'CONFIRMED' as OrderStatus,
    date: '08 Nov 2026, 09:30 PM',
    notes: 'Birthday gift on 12th Nov.',
  },
  {
    id: 'ord-103',
    orderNumber: 'THC-202611-0040',
    customer: 'Kavita Joshi',
    phone: '9909012345',
    address: '14 Royal Residency, Manjalpur, Vadodara - 390020',
    items: 'Handmade Daisy Keychain x 2, Strawberry Keychain x 1',
    total: 677,
    status: 'DELIVERED' as OrderStatus,
    date: '08 Nov 2026, 04:10 PM',
    notes: 'None',
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [filter, setFilter] = useState<string>('all');

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === 'all') return true;
    return o.status === filter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-secondary">
            Fulfillment Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            Customer Orders & Dispatch
          </h1>
          <p className="text-xs text-ink-muted">
            Update lifecycle states, review recipient delivery addresses, and coordinate local riders.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {['all', 'PENDING', 'CONFIRMED', 'PROCESSING', 'DELIVERED'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === f
                  ? 'bg-primary text-white'
                  : 'bg-surface text-ink-muted hover:text-ink border border-border-subtle'
              }`}
            >
              {f === 'all' ? 'All Orders' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-surface rounded-2xl border border-border-subtle p-6 shadow-craft space-y-4"
          >
            {/* Header row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border-subtle/80 pb-4">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-base text-primary">
                  {order.orderNumber}
                </span>
                <span className="text-xs text-ink-muted">• {order.date}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-ink-muted">Status:</span>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                  className="px-3 py-1.5 rounded-lg bg-canvas border border-border-subtle text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="PENDING">PENDING (Awaiting Verification)</option>
                  <option value="CONFIRMED">CONFIRMED (Accepted)</option>
                  <option value="PROCESSING">PROCESSING (In Crafting)</option>
                  <option value="READY_FOR_DELIVERY">READY FOR DELIVERY (Packaged)</option>
                  <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY (Rider En Route)</option>
                  <option value="DELIVERED">DELIVERED (Completed)</option>
                  <option value="CANCELLED">CANCELLED (Restock)</option>
                </select>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              {/* Customer */}
              <div className="space-y-1">
                <p className="font-semibold text-secondary uppercase tracking-wider">Recipient Details</p>
                <p className="font-bold text-ink text-sm">{order.customer}</p>
                <p className="text-ink-muted font-mono">{order.phone}</p>
                <p className="text-ink-muted pt-1 leading-relaxed">{order.address}</p>
              </div>

              {/* Items */}
              <div className="space-y-1">
                <p className="font-semibold text-secondary uppercase tracking-wider">Ordered Creations</p>
                <p className="font-medium text-ink">{order.items}</p>
                <p className="text-primary font-bold text-sm pt-2">
                  Total: {formatINR(order.total)} (Includes Vadodara delivery)
                </p>
              </div>

              {/* Actions & WhatsApp Contact */}
              <div className="space-y-2 flex flex-col justify-between">
                <div>
                  <p className="font-semibold text-secondary uppercase tracking-wider">Special Note</p>
                  <p className="text-ink-muted italic">&ldquo;{order.notes}&rdquo;</p>
                </div>

                <div className="pt-2">
                  <Link
                    href={`https://wa.me/91${order.phone}?text=${encodeURIComponent(
                      `Hi ${order.customer}! 🌸 This is The Handmade Craft updating you on your order ${order.orderNumber}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="whatsapp" size="sm" className="w-full sm:w-auto">
                      <MessageCircle className="w-3.5 h-3.5 fill-current mr-1.5" />
                      <span>Message Customer on WhatsApp</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
