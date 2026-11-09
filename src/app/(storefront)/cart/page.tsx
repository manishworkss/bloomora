'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, MessageCircle, Flower2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/formatters';
import { Button } from '@/components/ui/Button';
import { getOrderInquiryLink } from '@/lib/whatsapp';

export default function CartPage() {
  const { items, subtotal, totalItems, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-surface border border-border-subtle flex items-center justify-center mx-auto text-ink-muted">
          <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-ink">Your Shopping Bag is Empty</h1>
          <p className="text-sm text-ink-muted">
            Looking for a handmade bouquet, flower pot, or delicate keychain? Explore our handcrafted collections made with love in Vadodara.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/shop">
            <Button variant="primary" size="lg">
              <span>Explore Creations</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const itemsSummary = items
    .map((i) => `${i.title} x ${i.quantity}`)
    .join(', ');

  const whatsappInquiryUrl = getOrderInquiryLink('BAG-INQUIRY', formatINR(subtotal), itemsSummary);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 w-full max-w-full overflow-hidden">
      <div className="space-y-2 text-center sm:text-left">
        <span className="text-xs uppercase font-bold tracking-widest text-secondary">
          Review Your Selections
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
          Shopping Bag ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Items List */}
        <div className="lg:col-span-8 bg-surface rounded-2xl border border-border-subtle p-6 sm:p-8 shadow-craft space-y-6">
          <div className="divide-y divide-border-subtle/80 space-y-6">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId || 'base'}`}
                className="flex flex-col sm:flex-row gap-5 pt-6 first:pt-0"
              >
                {/* Image */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-canvas border border-border-subtle shrink-0 flex items-center justify-center">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="112px" />
                  ) : (
                    <Flower2 className="w-10 h-10 text-rose/60" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-ink">{item.title}</h3>
                      {item.variantTitle && (
                        <p className="text-xs text-ink-muted font-medium mt-0.5">{item.variantTitle}</p>
                      )}
                      <p className="text-xs font-semibold text-secondary mt-1">
                        {item.productType === 'READY_MADE' ? 'Ready to Ship' : 'Handcrafted to Order'}
                      </p>
                    </div>

                    <span className="font-serif text-base sm:text-lg font-bold text-ink">
                      {formatINR(item.unitPrice * item.quantity)}
                    </span>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-border-subtle rounded-lg bg-canvas">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                        className="p-1.5 hover:text-primary transition-colors text-ink-muted"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center text-xs font-bold text-ink">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                        className="p-1.5 hover:text-primary transition-colors text-ink-muted"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="text-xs font-medium text-ink-muted hover:text-red-600 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Box */}
        <div className="lg:col-span-4 bg-surface rounded-2xl border border-border-subtle p-6 sm:p-8 shadow-craft space-y-6">
          <h2 className="font-serif text-xl font-bold text-ink border-b border-border-subtle pb-3">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-ink-muted">
              <span>Items Subtotal</span>
              <span className="font-medium text-ink">{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink-muted">
              <span>Vadodara Delivery</span>
              <span className="text-xs font-semibold text-sage">Calculated at Checkout (₹50)</span>
            </div>
            <div className="flex justify-between text-base font-bold text-ink pt-3 border-t border-border-subtle">
              <span>Estimated Total</span>
              <span className="font-serif text-2xl text-primary">{formatINR(subtotal)}</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Link href="/checkout" className="block w-full">
              <Button variant="primary" size="lg" className="w-full font-semibold">
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>

            <Link href={whatsappInquiryUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
              <Button variant="whatsapp" size="lg" className="w-full font-semibold">
                <MessageCircle className="w-4 h-4 fill-current mr-1.5" />
                <span>Order via WhatsApp</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

