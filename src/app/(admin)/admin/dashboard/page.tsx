'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Clock,
  Package,
  Truck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatINR } from '@/lib/formatters';
import { DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';

const RECENT_ORDERS = [
  {
    id: 'ord-101',
    orderNumber: 'THC-202611-0042',
    customer: 'Ananya Patel',
    phone: '9876543210',
    area: 'Gotri Road (390021)',
    items: 'Everlasting Lavender Bouquet x 1',
    total: 949,
    status: 'PROCESSING',
    date: '09 Nov, 01:15 AM',
  },
  {
    id: 'ord-102',
    orderNumber: 'THC-202611-0041',
    customer: 'Pooja Shah',
    phone: '9825012345',
    area: 'Alkapuri (390001)',
    items: 'Mini Sunflower Pot x 2',
    total: 848,
    status: 'CONFIRMED',
    date: '08 Nov, 09:30 PM',
  },
  {
    id: 'ord-103',
    orderNumber: 'THC-202611-0040',
    customer: 'Kavita Joshi',
    phone: '9909012345',
    area: 'Manjalpur (390020)',
    items: 'Daisy Keychain x 2, Strawberry Keychain x 1',
    total: 677,
    status: 'DELIVERED',
    date: '08 Nov, 04:10 PM',
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-secondary">
            Operational Overview
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            Studio Dashboard
          </h1>
          <p className="text-xs text-ink-muted">
            Managing orders, catalog inventory, and fulfillment across Vadodara.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/products">
            <Button variant="outline" size="sm">
              <Package className="w-4 h-4 mr-1.5" />
              <span>Manage Products</span>
            </Button>
          </Link>
          <Link
            href={`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="whatsapp" size="sm">
              <MessageCircle className="w-4 h-4 fill-current mr-1.5" />
              <span>WhatsApp Store Chat</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-xl bg-surface border border-border-subtle shadow-craft space-y-2">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Awaiting Confirm</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-ink">1</p>
          <p className="text-[11px] text-ink-muted">Requires payment check</p>
        </div>

        <div className="p-5 rounded-xl bg-surface border border-border-subtle shadow-craft space-y-2">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">In Crafting</span>
            <Package className="w-4 h-4 text-primary" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-ink">2</p>
          <p className="text-[11px] text-ink-muted">Knitting / packing</p>
        </div>

        <div className="p-5 rounded-xl bg-surface border border-border-subtle shadow-craft space-y-2">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Low Stock Alert</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-ink">1 item</p>
          <p className="text-[11px] text-red-600 font-medium">Lavender Bouquet (2 left)</p>
        </div>

        <div className="p-5 rounded-xl bg-surface border border-border-subtle shadow-craft space-y-2">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Today&apos;s Sales</span>
            <TrendingUp className="w-4 h-4 text-sage" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-ink">{formatINR(2474)}</p>
          <p className="text-[11px] text-sage font-semibold">3 orders across Vadodara</p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-surface rounded-2xl border border-border-subtle shadow-craft p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-border-subtle/80 pb-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-ink">Recent Customer Orders</h2>
            <p className="text-xs text-ink-muted">Order fulfillment pipeline in Vadodara</p>
          </div>
          <Link href="/admin/orders" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border-subtle/70 text-ink-muted uppercase tracking-wider font-semibold">
                <th className="pb-3 pr-4">Order Ref</th>
                <th className="pb-3 px-4">Customer & Phone</th>
                <th className="pb-3 px-4">Area / PIN</th>
                <th className="pb-3 px-4">Items</th>
                <th className="pb-3 px-4">Total</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50 text-ink">
              {RECENT_ORDERS.map((ord) => (
                <tr key={ord.id} className="hover:bg-canvas/50 transition-colors">
                  <td className="py-3.5 pr-4 font-mono font-bold text-primary">{ord.orderNumber}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-ink">{ord.customer}</p>
                    <p className="text-[11px] text-ink-muted">{ord.phone}</p>
                  </td>
                  <td className="py-3.5 px-4 text-ink-muted">{ord.area}</td>
                  <td className="py-3.5 px-4 max-w-xs truncate">{ord.items}</td>
                  <td className="py-3.5 px-4 font-bold">{formatINR(ord.total)}</td>
                  <td className="py-3.5 px-4">
                    {ord.status === 'PROCESSING' && <Badge variant="terracotta">In Crafting</Badge>}
                    {ord.status === 'CONFIRMED' && <Badge variant="amber">Confirmed</Badge>}
                    {ord.status === 'DELIVERED' && <Badge variant="sage">Delivered</Badge>}
                  </td>
                  <td className="py-3.5 pl-4 text-right">
                    <Link
                      href={`/admin/orders`}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Update ↗
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
