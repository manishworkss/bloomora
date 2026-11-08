'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Clock, CheckCircle2, Package, Truck, MessageCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatINR } from '@/lib/formatters';
import { DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';

const STEPS = [
  { key: 'PENDING', label: 'Order Received', desc: 'Awaiting payment verification' },
  { key: 'CONFIRMED', label: 'Confirmed', desc: 'Accepted by creator' },
  { key: 'PROCESSING', label: 'Handcrafting & Packing', desc: 'Items being crafted with love' },
  { key: 'READY_FOR_DELIVERY', label: 'Ready for Dispatch', desc: 'Packaged in gift box' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Local rider en route in Vadodara' },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Received with smiles' },
];

export default function OrderTrackingPage() {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [mockOrder, setMockOrder] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearched(true);

    // Mock order resolution for demonstration/preview
    setMockOrder({
      orderNumber: query.toUpperCase().startsWith('THC') ? query.toUpperCase() : `THC-202611-0042`,
      customerName: 'Ananya P.',
      phoneMasked: '+91 98765 ****0',
      postalCode: '390021 (Vadodara)',
      orderStatus: 'PROCESSING',
      createdAt: '09 Nov 2026, 01:15 AM',
      grandTotal: 949,
      items: [
        {
          title: 'Everlasting Crochet Lavender & Tulip Bouquet',
          qty: 1,
          price: 899,
        },
      ],
      deliveryFee: 50,
    });
  };

  const currentStepIndex = mockOrder
    ? STEPS.findIndex((s) => s.key === mockOrder.orderStatus)
    : 0;

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
          Enter your Order Reference Number (e.g. <code>THC-202611-0042</code>) or your tracking token received after purchase.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Order Reference Number..."
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-surface border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary shadow-sm uppercase font-mono"
          />
        </div>
        <Button type="submit" variant="primary" size="lg" className="shrink-0">
          <span>Track Order</span>
        </Button>
      </form>

      {/* Order Display */}
      {searched && mockOrder && (
        <div className="bg-surface rounded-2xl border border-border-subtle p-6 sm:p-10 shadow-craft space-y-10 animate-in fade-in duration-300">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-subtle pb-6">
            <div>
              <p className="text-xs text-secondary font-bold uppercase tracking-wider">Order Reference</p>
              <h2 className="font-serif text-2xl font-bold text-ink">{mockOrder.orderNumber}</h2>
              <p className="text-xs text-ink-muted mt-1">Placed on {mockOrder.createdAt}</p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Status: In Crafting / Processing
              </span>
              <p className="text-sm font-bold text-ink mt-2">Total: {formatINR(mockOrder.grandTotal)}</p>
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

          {/* Recipient & WhatsApp Help */}
          <div className="p-4 rounded-xl bg-canvas border border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs space-y-1">
              <p className="font-semibold text-ink">Recipient: {mockOrder.customerName} ({mockOrder.phoneMasked})</p>
              <p className="text-ink-muted">Delivery Location: Vadodara PIN {mockOrder.postalCode}</p>
            </div>

            <Link
              href={`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Hi The Handmade Craft! I'm checking in on my order ${mockOrder.orderNumber}.`
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
