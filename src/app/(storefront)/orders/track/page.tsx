'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, CheckCircle2, MessageCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatINR, formatDateIST } from '@/lib/formatters';
import { DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';

const STEPS = [
  { key: 'PENDING', label: 'Order Received', desc: 'Awaiting payment verification' },
  { key: 'CONFIRMED', label: 'Confirmed', desc: 'Accepted by creator' },
  { key: 'PROCESSING', label: 'Handcrafting & Packing', desc: 'Items being crafted with love' },
  { key: 'READY_FOR_DELIVERY', label: 'Ready for Dispatch', desc: 'Packaged in gift box' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Local rider en route in Vadodara' },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Received with smiles' },
];

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get('token');

  const [query, setQuery] = useState(tokenParam || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<any>(null);

  const fetchOrder = async (searchToken: string) => {
    if (!searchToken.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/store/orders/${encodeURIComponent(searchToken.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error?.message || 'Order not found. Please verify your reference or token.');
        setOrder(null);
      } else {
        setOrder(data.data);
      }
    } catch {
      setError('Unable to fetch tracking data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tokenParam) {
      fetchOrder(tokenParam);
    }
  }, [tokenParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(query);
  };

  const currentStepIndex = order
    ? STEPS.findIndex((s) => s.key === order.orderStatus)
    : 0;

  return (
    <div className="space-y-12">
      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. BLOOM-202611-0042..."
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-surface border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary shadow-sm font-mono"
          />
        </div>
        <Button type="submit" variant="primary" size="lg" isLoading={loading} className="shrink-0">
          <span>Track Order</span>
        </Button>
      </form>

      {error && (
        <div className="max-w-xl mx-auto p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Order Display */}
      {order && (
        <div className="bg-surface rounded-2xl border border-border-subtle p-6 sm:p-10 shadow-craft space-y-10 animate-in fade-in duration-300">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-subtle pb-6">
            <div>
              <p className="text-xs text-rose font-bold uppercase tracking-wider">Order Reference</p>
              <h2 className="font-serif text-2xl font-bold text-ink">{order.orderNumber}</h2>
              <p className="text-xs text-ink-muted mt-1">Placed on {formatDateIST(order.createdAt)}</p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Status: {order.orderStatus}
              </span>
              <p className="text-sm font-bold text-ink mt-2">Total: {formatINR(order.grandTotal)}</p>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-6">
            <h3 className="font-serif text-lg font-bold text-ink">Fulfillment Progress</h3>
            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-border-subtle">
              {STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.key} className="relative flex items-start gap-4">
                    <div
                      className={`absolute -left-6 sm:-left-8 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isPassed
                          ? 'bg-primary text-white ring-4 ring-primary/20'
                          : 'bg-canvas border border-border-subtle text-ink-muted'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    <div className="space-y-0.5">
                      <p
                        className={`text-sm font-bold ${
                          isCurrent ? 'text-primary' : isPassed ? 'text-ink' : 'text-ink-muted'
                        }`}
                      >
                        {step.label} {isCurrent && '— Currently in progress'}
                      </p>
                      <p className="text-xs text-ink-muted">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items Summary */}
          {order.items && order.items.length > 0 && (
            <div className="space-y-3 border-t border-border-subtle/80 pt-6">
              <h4 className="font-serif text-base font-bold text-ink">Items in This Order</h4>
              <div className="divide-y divide-border-subtle/50">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between py-2 text-xs">
                    <span className="font-medium text-ink">
                      {item.productTitle} × {item.quantity}
                    </span>
                    <span className="font-bold text-primary">{formatINR(item.totalPrice)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recipient & WhatsApp Help */}
          <div className="p-4 rounded-xl bg-canvas border border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs space-y-1">
              <p className="font-semibold text-ink">
                Recipient: {order.customerName} ({order.customerPhoneMasked})
              </p>
              <p className="text-ink-muted">
                Delivery: {order.deliveryAddress}, Vadodara PIN {order.postalCode}
              </p>
            </div>

            <Link
              href={`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Hi Bloomora! I'm checking in on my order ${order.orderNumber}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="whatsapp" size="sm">
                <MessageCircle className="w-4 h-4 fill-current mr-1.5" />
                <span>WhatsApp Order Support</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-xs uppercase font-bold tracking-widest text-secondary">
          Vadodara Fulfillment Tracker
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink">
          Track Your Handmade Order
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed">
          Enter your Order Reference Number (e.g. <code>BLOOM-202611-0042</code>) or your tracking token received after purchase.
        </p>
      </div>

      <Suspense fallback={<div className="text-center py-10 text-xs text-ink-muted">Loading tracker...</div>}>
        <OrderTrackingContent />
      </Suspense>
    </div>
  );
}
