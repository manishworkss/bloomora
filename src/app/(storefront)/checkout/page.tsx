'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MessageCircle,
  MapPin,
  ShoppingBag,
  CheckCircle2,
  Flower2,
  AlertCircle,
} from 'lucide-react';
import { useCart, getCartItemKey, formatCartLineExtras } from '@/context/CartContext';
import { formatINR } from '@/lib/formatters';
import { Button } from '@/components/ui/Button';
import { buildWhatsAppLink } from '@/lib/whatsapp';

function normalizeIndianPhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState<any>(null);

  const grandTotal = subtotal;

  const [errorMsg, setErrorMsg] = useState('');

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const cleanPhone = normalizeIndianPhone(phone);
    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!/^[0-9]{6}$/.test(postalCode.trim())) {
      setErrorMsg('Please enter a valid 6-digit PIN code.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const orderPayload = {
        customer: {
          name: name.trim(),
          phone: cleanPhone,
          deliveryAddress: address.trim(),
          landmark: landmark.trim() || undefined,
          postalCode: postalCode.trim(),
          deliveryInstructions: notes.trim() || undefined,
        },
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          title: `${i.title}${formatCartLineExtras(i)}`,
          unitPrice: i.unitPrice,
          quantity: i.quantity,
          imageUrl: i.imageUrl,
          addOnIds: i.addOns?.map((a) => a.id),
          giftMessage: i.giftMessage,
        })),
        paymentMethod: 'MANUAL_UPI' as const,
      };

      const res = await fetch('/api/store/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.data?.orderNumber) {
        setErrorMsg(
          data?.error?.message ||
            'Please verify your contact details and mobile number, then try again.'
        );
        setIsSubmitting(false);
        return;
      }

      const finalOrderNumber = data.data.orderNumber;
      const lookupToken = data.data.lookupToken;
      const finalGrandTotal =
        typeof data.data.grandTotal === 'number' ? data.data.grandTotal : grandTotal;

      const itemsSummary = items
        .map(
          (i) =>
            `• ${i.title}${formatCartLineExtras(i)} x ${i.quantity} (${formatINR(
              i.unitPrice * i.quantity
            )})`
        )
        .join('\n');

      // WhatsApp Message
      const message = `Hi Bloomora! 👋🌸\nI have placed an order on your website!\n\n🛍️ *Order Ref:* ${finalOrderNumber}\n\n*Items Ordered:*\n${itemsSummary}\n\n📋 *Customer Details:*\n${name}\nPhone: ${cleanPhone}\n${address}\nLandmark: ${landmark || 'N/A'}\nPIN Code: ${postalCode}\nSpecial Notes: ${notes || 'None'}\n\n💵 *Total Amount:* ${formatINR(finalGrandTotal)}\n\nPlease share your UPI QR so I can complete payment and you can start handcrafting! 💖`;

      const whatsappUrl = buildWhatsAppLink({ message });

      setOrderCompleted({
        orderNumber: finalOrderNumber,
        lookupToken,
        whatsappUrl,
        grandTotal: finalGrandTotal,
        name: name.trim(),
      });

      // Clear cart
      clearCart();
      setIsSubmitting(false);

      // Open WhatsApp in new tab
      if (typeof window !== 'undefined') {
        window.open(whatsappUrl, '_blank');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMsg('Something went wrong submitting your order. Please retry or chat with us on WhatsApp.');
      setIsSubmitting(false);
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

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
          <Link
            href={orderCompleted.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button variant="whatsapp" size="lg" className="w-full sm:w-auto">
              <MessageCircle className="w-5 h-5 fill-current mr-2" />
              <span>Confirm on WhatsApp (+91 8271735190)</span>
            </Button>
          </Link>
          {orderCompleted.lookupToken && (
            <Link
              href={`/orders/track?token=${encodeURIComponent(orderCompleted.lookupToken)}`}
              className="w-full sm:w-auto"
            >
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                <span>Track Order</span>
              </Button>
            </Link>
          )}
          <Link href="/shop" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
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
          Order Details &amp; Review
        </h1>
        <p className="text-sm text-ink-muted">
          Handcrafted with care. Orders confirm directly with our studio on WhatsApp.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Form: Customer & Recipient Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-craft space-y-5">
            <div className="flex items-center gap-2 border-b border-border-subtle/80 pb-3">
              <MapPin className="w-4 h-4 text-primary" />
              <h3 className="font-serif text-lg font-bold text-ink">
                Recipient &amp; Contact Details
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
                  WhatsApp / Mobile Number <span className="text-primary">*</span>
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
                  PIN Code <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="6-digit PIN code"
                  className="w-full px-4 py-2.5 rounded-lg bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                />
              </div>
            </div>

            {errorMsg && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                Gift Note / Special Instructions (Optional)
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
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-craft space-y-5">
            <h3 className="font-serif text-lg font-bold text-ink border-b border-border-subtle/80 pb-3">
              Order Summary ({items.length} {items.length === 1 ? 'creation' : 'creations'})
            </h3>

            {/* Items list */}
            <div className="divide-y divide-border-subtle/60 max-h-64 overflow-y-auto pr-1 space-y-3">
              {items.map((item) => (
                <div key={getCartItemKey(item)} className="flex gap-3 pt-3 first:pt-0">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-canvas border border-border-subtle shrink-0 flex items-center justify-center">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="56px" />
                    ) : (
                      <Flower2 className="w-6 h-6 text-rose/60" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-ink truncate">{item.title}</p>
                    {item.addOns && item.addOns.length > 0 && (
                      <p className="text-[10px] text-ink-muted line-clamp-1">
                        +{item.addOns.map((a) => a.name).join(', ')}
                      </p>
                    )}
                    {item.giftMessage && (
                      <p className="text-[10px] text-rose italic truncate">
                        💌 &ldquo;{item.giftMessage}&rdquo;
                      </p>
                    )}
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
                <span>Handcrafted Gift Wrap</span>
                <span className="text-sage font-medium">Complimentary</span>
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
