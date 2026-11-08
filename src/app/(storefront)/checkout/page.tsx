'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Truck,
  ArrowRight,
  MessageCircle,
  MapPin,
  ShoppingBag,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/formatters';
import { Button } from '@/components/ui/Button';
import { DEFAULT_WHATSAPP_NUMBER, buildWhatsAppLink } from '@/lib/whatsapp';

const VADODARA_PINS = [
  '390001', '390002', '390004', '390007', '390008', '390010',
  '390011', '390012', '390015', '390018', '390019', '390020',
  '390021', '390022', '390023', '390024', '390025',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [postalCode, setPostalCode] = useState('390001');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState<any>(null);

  // Vadodara Local Delivery Fee
  const deliveryFee = 50;
  const grandTotal = subtotal + deliveryFee;

  const isVadodaraPin =
    postalCode.length === 6 &&
    (VADODARA_PINS.includes(postalCode) || postalCode.startsWith('390'));

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `BLM-${new Date().getFullYear()}${String(
      new Date().getMonth() + 1
    ).padStart(2, '0')}-${randomSuffix}`;

    const itemsSummary = items
      .map((i) => `• ${i.title}${i.variantTitle ? ` (${i.variantTitle})` : ''} x ${i.quantity} (${formatINR(i.unitPrice * i.quantity)})`)
      .join('\n');

    // WhatsApp Message
    const message = `Hi Bloomora! 👋🌸\nI would like to place an order from your website!\n\n🛍️ *Order Ref:* ${orderNumber}\n\n*Items Ordered:*\n${itemsSummary}\n\n📦 *Delivery Address:*\n${name}\nPhone: ${phone}\n${address}\nLandmark: ${landmark || 'N/A'}\nVadodara PIN: ${postalCode}\nSpecial Notes: ${notes || 'None'}\n\n💵 *Total Amount:* ${formatINR(grandTotal)} (Includes ₹${deliveryFee} Vadodara delivery)\n\nPlease share your UPI payment QR or details so I can confirm my order! 💖`;

    const whatsappUrl = buildWhatsAppLink({ message });

    setOrderCompleted({
      orderNumber,
      whatsappUrl,
      grandTotal,
      name,
    });

    // Clear cart
    clearCart();
    setIsSubmitting(false);

    // Open WhatsApp in new tab
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
    }
  };

  if (orderCompleted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-rose">
            Order Submitted to Bloomora via WhatsApp
          </span>
          <h1 className="font-serif text-3xl font-bold text-ink">
            Thank You, {orderCompleted.name}! 🌸
          </h1>
          <p className="text-sm font-semibold text-primary">
            Order Reference: {orderCompleted.orderNumber}
          </p>
          <p className="text-sm text-ink-muted max-w-md mx-auto leading-relaxed">
            Your order details have been prepared for WhatsApp. If WhatsApp didn&apos;t open automatically, click the button below to message Bloomora directly to confirm your order and UPI payment.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href={orderCompleted.whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="whatsapp" size="lg">
              <MessageCircle className="w-5 h-5 fill-current mr-2" />
              <span>Confirm on WhatsApp (+91 8271735190)</span>
            </Button>
          </Link>
          <Link href="/shop">
            <Button variant="outline" size="lg">
              <span>Continue Shopping</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-surface border border-border-subtle flex items-center justify-center mx-auto text-ink-muted">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-ink">Your Bag is Empty</h2>
        <p className="text-sm text-ink-muted">
          Add some handmade flowers, bouquets, or keychains before checking out.
        </p>
        <Link href="/shop">
          <Button variant="primary">Explore Bloomora Creations</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-2 text-center sm:text-left">
        <span className="text-xs uppercase font-bold tracking-widest text-rose">
          Bloomora Checkout
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
          Delivery Details & Order Review
        </h1>
        <p className="text-sm text-ink-muted">
          Providing local delivery across all Vadodara postal codes. Order confirms directly via WhatsApp.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Form: Delivery Address */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-craft space-y-5">
            <div className="flex items-center gap-2 border-b border-border-subtle/80 pb-3">
              <MapPin className="w-4 h-4 text-primary" />
              <h3 className="font-serif text-lg font-bold text-ink">
                Vadodara Delivery Address
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                  Full Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ananya Patel"
                  className="w-full px-4 py-2.5 rounded-lg bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                  Mobile Number (For Delivery Call) <span className="text-primary">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-2.5 rounded-lg bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                Full Street Address, House/Flat No. <span className="text-primary">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. B-402, Shivalik Greens, Near Gotri Lake Road"
                className="w-full px-4 py-2.5 rounded-lg bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                  Nearby Landmark
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opposite Sterling Hospital"
                  className="w-full px-4 py-2.5 rounded-lg bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                  Vadodara PIN Code <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 390021"
                  className="w-full px-4 py-2.5 rounded-lg bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                />
              </div>
            </div>

            {/* PIN validation note */}
            {isVadodaraPin ? (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Vadodara PIN verified: Flat local courier delivery of ₹50 applied.</span>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                ⚠️ We currently deliver within Vadodara (PIN codes starting with 390...). Please confirm your PIN code.
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                Gift Note / Delivery Instructions (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Please add a handwritten 'Happy Birthday' note"
                className="w-full px-4 py-2.5 rounded-lg bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Right Summary: Items & WhatsApp Checkout */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-craft space-y-5">
            <h3 className="font-serif text-lg font-bold text-ink border-b border-border-subtle/80 pb-3">
              Order Summary ({items.length} creations)
            </h3>

            {/* Items list */}
            <div className="divide-y divide-border-subtle/60 max-h-64 overflow-y-auto pr-1 space-y-3">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId || 'base'}`} className="flex gap-3 pt-3 first:pt-0">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-canvas border border-border-subtle shrink-0">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-ink truncate">{item.title}</p>
                    <p className="text-[11px] text-ink-muted">Qty: {item.quantity}</p>
                    <p className="text-xs font-semibold text-primary">{formatINR(item.unitPrice * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 pt-3 border-t border-border-subtle text-sm">
              <div className="flex justify-between text-ink-muted">
                <span>Items Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink-muted">
                <span>Vadodara Delivery</span>
                <span>{formatINR(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-ink pt-2 border-t border-border-subtle/80">
                <span>Grand Total</span>
                <span className="font-serif text-xl text-primary">{formatINR(grandTotal)}</span>
              </div>
            </div>

            {/* Assisted Checkout Notice */}
            <div className="p-3.5 rounded-xl bg-canvas border border-border-subtle space-y-2 text-xs">
              <div className="flex items-center gap-2 font-semibold text-ink">
                <MessageCircle className="w-4 h-4 text-whatsapp fill-current" />
                <span>WhatsApp Assisted Payment & Confirmation</span>
              </div>
              <p className="text-ink-muted leading-relaxed">
                Clicking the button below submits your order to Bloomora and connects you directly to our WhatsApp (+91 8271735190) with your full receipt pre-filled.
              </p>
            </div>

            {/* Submit Action Button */}
            <Button
              type="submit"
              variant="whatsapp"
              size="lg"
              disabled={isSubmitting}
              className="w-full font-semibold shadow-md"
            >
              <MessageCircle className="w-5 h-5 fill-current mr-2" />
              <span>Confirm & Order via WhatsApp</span>
            </Button>

            <div className="text-center">
              <Link href="/policies/returns" className="text-[11px] text-ink-muted hover:text-primary underline">
                Handmade & Non-Refundable Policy
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
