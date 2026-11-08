'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, MessageCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatINR } from '@/lib/formatters';
import { OrderStatus } from '@/types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');

  const loadOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.success && data.data) {
        setOrders(data.data);
      }
    } catch (e) {
      console.error('Failed to load orders', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setActionError('');
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStatus }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setActionError(data.error?.message || 'Failed to advance order status.');
        return;
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    } catch (e: any) {
      setActionError(e.message || 'Network error updating status');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === 'all') return true;
    return o.orderStatus === filter;
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
          {['all', 'PENDING', 'CONFIRMED', 'PROCESSING', 'READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map((f) => (
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

      {actionError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-xs text-ink-muted">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-xs text-ink-muted bg-surface rounded-xl border border-border-subtle">
            No orders found under this filter.
          </div>
        ) : (
          filteredOrders.map((order) => (
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
                  <span className="text-xs text-ink-muted">
                    • Token: <code className="bg-canvas px-1.5 py-0.5 rounded text-[11px]">{order.lookupToken}</code>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-ink-muted">Status:</span>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    className="px-3 py-1.5 rounded-lg bg-canvas border border-border-subtle text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PROCESSING">PROCESSING (In Crafting)</option>
                    <option value="READY_FOR_DELIVERY">READY FOR DELIVERY</option>
                    <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="RETURNED">RETURNED</option>
                  </select>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                {/* Customer */}
                <div className="space-y-1">
                  <p className="font-semibold text-secondary uppercase tracking-wider">Recipient Details</p>
                  <p className="font-bold text-ink text-sm">{order.customerName}</p>
                  <p className="text-ink-muted font-mono">{order.customerPhone}</p>
                  <p className="text-ink-muted pt-1 leading-relaxed">
                    {order.deliveryAddress}, Vadodara PIN {order.postalCode}
                  </p>
                </div>

                {/* Items */}
                <div className="space-y-1">
                  <p className="font-semibold text-secondary uppercase tracking-wider">Ordered Creations</p>
                  <div className="space-y-1 text-ink">
                    {order.items?.map((item: any, i: number) => (
                      <p key={i}>
                        • {item.productTitle} × {item.quantity} ({formatINR(item.totalPrice)})
                      </p>
                    ))}
                  </div>
                  <p className="text-primary font-bold text-sm pt-2">
                    Total: {formatINR(order.grandTotal)} (Includes ₹{order.deliveryFee} Vadodara delivery)
                  </p>
                </div>

                {/* Actions & WhatsApp Contact */}
                <div className="space-y-2 flex flex-col justify-between">
                  <div>
                    <p className="font-semibold text-secondary uppercase tracking-wider">Special Note / Instructions</p>
                    <p className="text-ink-muted italic">&ldquo;{order.deliveryInstructions || 'None'}&rdquo;</p>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`https://wa.me/91${order.customerPhone}?text=${encodeURIComponent(
                        `Hi ${order.customerName}! 🌸 This is The Handmade Craft updating you on your order ${order.orderNumber}.`
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
          ))
        )}
      </div>
    </div>
  );
}
