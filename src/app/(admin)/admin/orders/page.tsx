'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  MessageCircle,
  AlertCircle,
  Clock,
  Package,
  Truck,
  CheckCircle2,
  Search,
  ExternalLink,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatINR } from '@/lib/formatters';
import { OrderStatus } from '@/types';

const ORDER_STEPS: { key: OrderStatus; label: string; actionText?: string; nextStatus?: OrderStatus }[] = [
  { key: 'PENDING', label: '1. Received', actionText: 'Confirm Order ✓', nextStatus: 'CONFIRMED' },
  { key: 'CONFIRMED', label: '2. Confirmed', actionText: 'Start Crafting 🧶', nextStatus: 'PROCESSING' },
  { key: 'PROCESSING', label: '3. In Crafting', actionText: 'Mark Ready 📦', nextStatus: 'READY_FOR_DELIVERY' },
  { key: 'READY_FOR_DELIVERY', label: '4. Ready for Dispatch', actionText: 'Dispatch Rider 🚚', nextStatus: 'OUT_FOR_DELIVERY' },
  { key: 'OUT_FOR_DELIVERY', label: '5. Out for Delivery', actionText: 'Mark Delivered 🌸', nextStatus: 'DELIVERED' },
  { key: 'DELIVERED', label: '6. Delivered', actionText: undefined, nextStatus: undefined },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');

  const loadOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders', { cache: 'no-store' });
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
    if (filter !== 'all' && o.orderStatus !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = o.customerName?.toLowerCase().includes(q);
      const matchPhone = o.customerPhone?.includes(q);
      const matchRef = o.orderNumber?.toLowerCase().includes(q);
      const matchArea = o.deliveryAddress?.toLowerCase().includes(q);
      return matchName || matchPhone || matchRef || matchArea;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-6 rounded-2xl border border-border-subtle shadow-subtle">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blush text-rose text-[10px] font-bold uppercase tracking-wider">
            <ShoppingBag className="w-3 h-3" />
            <span>Fulfillment Pipeline</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            Customer Orders & Dispatch Manager
          </h1>
          <p className="text-xs text-ink-muted">
            Accept orders, track preparation progress, coordinate Vadodara delivery riders, and message customers.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <Truck className="w-4 h-4 text-emerald-600" />
          <span>Vadodara Local Flat Rate ₹50 Active</span>
        </div>
      </div>

      {/* 2. Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-surface rounded-2xl border border-border-subtle shadow-subtle">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'PENDING', label: 'Received' },
            { id: 'CONFIRMED', label: 'Confirmed' },
            { id: 'PROCESSING', label: 'In Crafting' },
            { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
            { id: 'DELIVERED', label: 'Delivered' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === f.id
                  ? 'bg-rose text-white shadow-subtle'
                  : 'bg-canvas text-ink-muted hover:text-ink border border-border-subtle'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, or area..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-canvas border border-border-subtle text-xs text-ink placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {actionError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* 3. Orders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-xs text-ink-muted">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-xs text-ink-muted bg-surface rounded-2xl border border-border-subtle p-6 space-y-2">
            <ShoppingBag className="w-8 h-8 text-ink-muted/40 mx-auto" />
            <p className="font-semibold text-ink">No customer orders found under this filter</p>
            <p className="text-[11px]">When customers place an order, it will appear here immediately.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const currentStep = ORDER_STEPS.find((s) => s.key === order.orderStatus);
            const currentStepIdx = ORDER_STEPS.findIndex((s) => s.key === order.orderStatus);

            return (
              <div
                key={order.id}
                className="bg-surface rounded-2xl border border-border-subtle p-6 shadow-subtle space-y-5"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border-subtle/80 pb-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono font-bold text-base text-rose">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-ink-muted">
                      Token: <code className="bg-canvas px-1.5 py-0.5 rounded text-[11px] font-mono">{order.lookupToken}</code>
                    </span>
                    <Link
                      href={`/orders/track?token=${order.lookupToken}`}
                      target="_blank"
                      className="text-[11px] text-rose hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>Public Tracking Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-ink-muted">Manual Override:</span>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="px-3 py-1.5 rounded-lg bg-canvas border border-border-subtle text-xs font-semibold text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="PENDING">1. PENDING (Order Received)</option>
                      <option value="CONFIRMED">2. CONFIRMED (Payment Verified)</option>
                      <option value="PROCESSING">3. PROCESSING (In Crafting)</option>
                      <option value="READY_FOR_DELIVERY">4. READY (Packed in Box)</option>
                      <option value="OUT_FOR_DELIVERY">5. OUT FOR DELIVERY (Rider En Route)</option>
                      <option value="DELIVERED">6. DELIVERED (Received with Smiles)</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>

                {/* Visual Step Progress Bar */}
                <div className="py-2">
                  <div className="flex items-center justify-between text-[10px] sm:text-xs font-semibold">
                    {ORDER_STEPS.map((step, idx) => {
                      const isCompleted = idx <= currentStepIdx && order.orderStatus !== 'CANCELLED';
                      const isCurrent = step.key === order.orderStatus;
                      return (
                        <div
                          key={step.key}
                          className={`flex-1 text-center py-1.5 px-1 border-b-2 transition-colors ${
                            isCurrent
                              ? 'border-rose text-rose font-bold'
                              : isCompleted
                              ? 'border-sage text-sage'
                              : 'border-border-subtle text-ink-muted/50'
                          }`}
                        >
                          <span className="hidden sm:inline">{step.label}</span>
                          <span className="sm:hidden">{idx + 1}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs pt-1">
                  {/* Customer */}
                  <div className="space-y-1">
                    <p className="font-semibold text-rose uppercase tracking-wider text-[10px]">Recipient & Address</p>
                    <p className="font-bold text-ink text-sm">{order.customerName}</p>
                    <p className="text-ink-muted font-mono">{order.customerPhone}</p>
                    <p className="text-ink-muted pt-1 leading-relaxed">
                      {order.deliveryAddress}, Vadodara PIN {order.postalCode}
                    </p>
                  </div>

                  {/* Items */}
                  <div className="space-y-1">
                    <p className="font-semibold text-rose uppercase tracking-wider text-[10px]">Handcrafted Items</p>
                    <div className="space-y-1 text-ink">
                      {order.items?.map((item: any, i: number) => (
                        <p key={i}>
                          • {item.productTitle} × {item.quantity} ({formatINR(item.totalPrice)})
                        </p>
                      ))}
                    </div>
                    <p className="text-rose font-bold text-sm pt-2">
                      Total: {formatINR(order.grandTotal)} (Includes ₹{order.deliveryFee || 50} Vadodara delivery)
                    </p>
                  </div>

                  {/* Action & WhatsApp */}
                  <div className="space-y-3 flex flex-col justify-between">
                    <div>
                      <p className="font-semibold text-rose uppercase tracking-wider text-[10px]">Gift Note / Instructions</p>
                      <p className="text-ink-muted italic">&ldquo;{order.deliveryInstructions || 'No note attached'}&rdquo;</p>
                    </div>

                    <div className="space-y-2 pt-2">
                      {/* One-Click Advance Button */}
                      {currentStep?.nextStatus && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleStatusChange(order.id, currentStep.nextStatus!)}
                          className="w-full gap-1.5"
                        >
                          <span>{currentStep.actionText}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      )}

                      {/* WhatsApp Customer Update */}
                      <Link
                        href={`https://wa.me/91${order.customerPhone}?text=${encodeURIComponent(
                          `Hi ${order.customerName}! 🌸 This is Bloomora updating you on your handcrafted order ${order.orderNumber}. Your order status is now: ${order.orderStatus}. Thank you for supporting slow handmade craft in Vadodara!`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full"
                      >
                        <Button variant="whatsapp" size="sm" className="w-full gap-1.5">
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span>WhatsApp Update to Customer</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
