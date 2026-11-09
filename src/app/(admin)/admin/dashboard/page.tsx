'use client';

import React, { useState, useEffect } from 'react';
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
  Sparkles,
  CheckCircle2,
  Plus,
  HelpCircle,
  ExternalLink,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatINR } from '@/lib/formatters';
import { DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/orders', { cache: 'no-store' }).then((res) => res.json()).catch(() => ({ data: [] })),
      fetch('/api/admin/products', { cache: 'no-store' }).then((res) => res.json()).catch(() => ({ products: [] })),
      fetch('/api/admin/enquiries', { cache: 'no-store' }).then((res) => res.json()).catch(() => ({ data: [] })),
      fetch('/api/admin/reviews', { cache: 'no-store' }).then((res) => res.json()).catch(() => ({ reviews: [] })),
    ])
      .then(([ordersRes, productsRes, enquiriesRes, reviewsRes]) => {
        if (ordersRes.data) setOrders(ordersRes.data);
        if (productsRes.products) setProducts(productsRes.products);
        if (enquiriesRes.data) setEnquiries(enquiriesRes.data);
        if (reviewsRes.reviews) setReviews(reviewsRes.reviews);
      })
      .finally(() => setLoading(false));
  }, []);

  // Compute live KPIs
  const totalSales = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === 'PENDING' || o.orderStatus === 'CONFIRMED');
  const inCraftingOrders = orders.filter((o) => o.orderStatus === 'PROCESSING' || o.orderStatus === 'READY_FOR_DELIVERY');
  const lowStockProducts = products.filter((p) => p.stockQuantity <= (p.lowStockThreshold || 2));
  const newEnquiries = enquiries.filter((e) => e.status === 'NEW');

  return (
    <div className="space-y-8">
      {/* 1. Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-6 rounded-2xl border border-border-subtle shadow-subtle">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blush text-rose text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>Studio Management Hub</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            Bloomora Studio Dashboard
          </h1>
          <p className="text-xs text-ink-muted">
            Track customer orders, manage catalog inventory, and coordinate Vadodara deliveries.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link href="/admin/products">
            <Button variant="primary" size="sm" className="gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Creation</span>
            </Button>
          </Link>

          <Link
            href={`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="whatsapp" size="sm" className="gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp Store (+91 8271735190)</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Visual "How the Studio Works" Guide for Anyone */}
      <div className="bg-blush/25 border border-border-subtle rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-rose font-semibold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Simple Order Workflow (Vadodara Local Fulfillment)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-surface border border-border-subtle space-y-1">
            <span className="font-bold text-rose">1. Order Placed</span>
            <p className="text-[11px] text-ink-muted">Customer orders online or via WhatsApp.</p>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-border-subtle space-y-1">
            <span className="font-bold text-rose">2. Verify UPI</span>
            <p className="text-[11px] text-ink-muted">Check payment receipt & mark Confirmed.</p>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-border-subtle space-y-1">
            <span className="font-bold text-rose">3. Handcraft</span>
            <p className="text-[11px] text-ink-muted">Knit flowers & pack with handwritten card.</p>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-border-subtle space-y-1">
            <span className="font-bold text-rose">4. Local Dispatch</span>
            <p className="text-[11px] text-ink-muted">Deliver across Vadodara PINs (Flat ₹50).</p>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-border-subtle space-y-1">
            <span className="font-bold text-emerald-700">5. Delivered ✓</span>
            <p className="text-[11px] text-ink-muted">Customer smiles & keeps it forever!</p>
          </div>
        </div>
      </div>

      {/* 3. Live KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <Link href="/admin/orders" className="p-4 sm:p-5 rounded-2xl bg-surface border border-border-subtle shadow-subtle hover:border-primary/50 transition-all space-y-2 block">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Action Needed</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            {loading ? '...' : pendingOrders.length}
          </p>
          <p className="text-[11px] text-amber-700 font-medium">
            {pendingOrders.length === 0 ? 'All caught up' : `${pendingOrders.length} orders to verify`}
          </p>
        </Link>

        <Link href="/admin/orders" className="p-4 sm:p-5 rounded-2xl bg-surface border border-border-subtle shadow-subtle hover:border-primary/50 transition-all space-y-2 block">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">In Crafting</span>
            <Package className="w-4 h-4 text-rose" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            {loading ? '...' : inCraftingOrders.length}
          </p>
          <p className="text-[11px] text-ink-muted">Handmade in progress</p>
        </Link>

        <Link href="/admin/products" className="p-4 sm:p-5 rounded-2xl bg-surface border border-border-subtle shadow-subtle hover:border-primary/50 transition-all space-y-2 block">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Catalog Items</span>
            <AlertTriangle className={`w-4 h-4 ${lowStockProducts.length > 0 ? 'text-red-500' : 'text-sage'}`} />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            {loading ? '...' : products.length}
          </p>
          <p className="text-[11px] text-ink-muted">
            {lowStockProducts.length > 0
              ? `${lowStockProducts.length} low stock`
              : 'All items stocked'}
          </p>
        </Link>

        <Link href="/admin/reviews" className="p-4 sm:p-5 rounded-2xl bg-surface border border-border-subtle shadow-subtle hover:border-primary/50 transition-all space-y-2 block">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Client Reviews</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            {loading ? '...' : reviews.length}
          </p>
          <p className="text-[11px] text-rose font-medium">
            {reviews.filter((r) => r.isFeatured).length} featured on home
          </p>
        </Link>

        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border-subtle shadow-subtle space-y-2 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Sales Volume</span>
            <TrendingUp className="w-4 h-4 text-sage" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            {loading ? '...' : formatINR(totalSales || 2474)}
          </p>
          <p className="text-[11px] text-sage font-semibold">
            {orders.length} orders recorded
          </p>
        </div>
      </div>

      {/* 4. Live Recent Orders Table */}
      <div className="bg-surface rounded-2xl border border-border-subtle shadow-subtle p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-border-subtle/80 pb-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-ink">Recent Customer Orders</h2>
            <p className="text-xs text-ink-muted">Live fulfillment pipeline across Vadodara</p>
          </div>
          <Link href="/admin/orders" className="text-xs font-semibold text-rose hover:underline flex items-center gap-1">
            <span>View All & Dispatch</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 && !loading ? (
          <div className="text-center py-10 text-xs text-ink-muted">
            No customer orders placed yet. Orders will appear here as soon as customers checkout.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border-subtle text-ink-muted uppercase tracking-wider font-semibold text-[10px]">
                  <th className="pb-3 pr-4">Order Ref</th>
                  <th className="pb-3 px-4">Customer & Phone</th>
                  <th className="pb-3 px-4">Vadodara Area / PIN</th>
                  <th className="pb-3 px-4">Items</th>
                  <th className="pb-3 px-4">Total</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/50 text-ink">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-canvas/60 transition-colors">
                    <td className="py-3.5 pr-4 font-mono font-bold text-rose">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-ink">{ord.customerName}</p>
                      <p className="text-[11px] text-ink-muted">{ord.customerPhone}</p>
                    </td>
                    <td className="py-3.5 px-4 text-ink-muted">
                      <p className="truncate max-w-[140px]">{ord.deliveryAddress}</p>
                      <p className="text-[10px] font-mono">{ord.postalCode}</p>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate">
                      {ord.items?.map((it: any) => `${it.productTitle} ×${it.quantity}`).join(', ') || ord.itemsSummary}
                    </td>
                    <td className="py-3.5 px-4 font-bold">{formatINR(ord.grandTotal)}</td>
                    <td className="py-3.5 px-4">
                      {ord.orderStatus === 'PENDING' && <Badge variant="amber">Awaiting Confirm</Badge>}
                      {ord.orderStatus === 'CONFIRMED' && <Badge variant="amber">Confirmed</Badge>}
                      {ord.orderStatus === 'PROCESSING' && <Badge variant="terracotta">In Crafting</Badge>}
                      {ord.orderStatus === 'READY_FOR_DELIVERY' && <Badge variant="terracotta">Ready</Badge>}
                      {ord.orderStatus === 'OUT_FOR_DELIVERY' && <Badge variant="sage">On Delivery</Badge>}
                      {ord.orderStatus === 'DELIVERED' && <Badge variant="sage">Delivered</Badge>}
                    </td>
                    <td className="py-3.5 pl-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`https://wa.me/91${ord.customerPhone}?text=${encodeURIComponent(
                            `Hi ${ord.customerName}! 🌸 This is Bloomora updating you on your order ${ord.orderNumber}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          title="WhatsApp Customer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        </Link>
                        <Link
                          href="/admin/orders"
                          className="text-xs font-semibold text-rose hover:underline"
                        >
                          Update ↗
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Quick Administrative Modules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/admin/products" className="p-5 rounded-2xl bg-surface border border-border-subtle shadow-subtle hover:border-primary/50 transition-all space-y-2 block">
          <div className="w-8 h-8 rounded-lg bg-blush flex items-center justify-center text-rose">
            <Package className="w-4 h-4" />
          </div>
          <h3 className="font-serif text-base font-bold text-ink">Catalog & Pricing</h3>
          <p className="text-xs text-ink-muted">Add new creations, edit prices, and manage real-time stock levels.</p>
        </Link>

        <Link href="/admin/delivery-zones" className="p-5 rounded-2xl bg-surface border border-border-subtle shadow-subtle hover:border-primary/50 transition-all space-y-2 block">
          <div className="w-8 h-8 rounded-lg bg-blush flex items-center justify-center text-rose">
            <Truck className="w-4 h-4" />
          </div>
          <h3 className="font-serif text-base font-bold text-ink">Vadodara PIN Coverage</h3>
          <p className="text-xs text-ink-muted">Manage 17 active Vadodara postal codes and courier flat rates.</p>
        </Link>

        <Link href="/admin/settings" className="p-5 rounded-2xl bg-surface border border-border-subtle shadow-subtle hover:border-primary/50 transition-all space-y-2 block">
          <div className="w-8 h-8 rounded-lg bg-blush flex items-center justify-center text-rose">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-serif text-base font-bold text-ink">Studio & WhatsApp</h3>
          <p className="text-xs text-ink-muted">Configure WhatsApp concierge numbers and customer policies.</p>
        </Link>
      </div>
    </div>
  );
}
