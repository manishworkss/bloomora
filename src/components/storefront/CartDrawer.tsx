'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/formatters';
import { Button } from '@/components/ui/Button';
import { getOrderInquiryLink } from '@/lib/whatsapp';

export const CartDrawer: React.FC = () => {
  const { items, isDrawerOpen, closeDrawer, updateQuantity, removeItem, subtotal, totalItems } =
    useCart();

  if (!isDrawerOpen) return null;

  const itemsSummary = items
    .map((i) => `${i.title}${i.variantTitle ? ` (${i.variantTitle})` : ''} x ${i.quantity}`)
    .join(', ');

  const whatsappCheckoutLink = getOrderInquiryLink('NEW-CART-ENQUIRY', formatINR(subtotal), itemsSummary);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-300"
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-canvas border-l border-border-subtle shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-6 border-b border-border-subtle flex items-center justify-between bg-surface">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="font-serif text-xl font-bold text-ink">Your Shopping Bag</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {totalItems}
              </span>
            </div>
            <button
              type="button"
              onClick={closeDrawer}
              className="p-2 text-ink-muted hover:text-ink rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-surface border border-border-subtle flex items-center justify-center mx-auto text-ink-muted">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <p className="font-serif text-lg font-medium text-ink">Your bag is empty</p>
                  <p className="text-sm text-ink-muted">
                    Explore our handmade flowers, bouquets, and bespoke keychains.
                  </p>
                </div>
                <div className="pt-2">
                  <Button variant="primary" onClick={closeDrawer} className="w-full">
                    <Link href="/shop" className="w-full">
                      Explore Creations
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId || 'base'}`}
                  className="flex gap-4 p-3.5 bg-surface rounded-xl border border-border-subtle/80 shadow-sm"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-canvas border border-border-subtle shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-ink line-clamp-1">
                        {item.title}
                      </h4>
                      {item.variantTitle && (
                        <p className="text-xs text-ink-muted font-medium mt-0.5">
                          {item.variantTitle}
                        </p>
                      )}
                      <p className="text-xs text-primary font-bold mt-1">
                        {formatINR(item.unitPrice)}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2 pt-1">
                      <div className="flex items-center border border-border-subtle rounded-md bg-canvas">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                          className="p-1 hover:text-primary transition-colors text-ink-muted"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-ink">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                          className="p-1 hover:text-primary transition-colors text-ink-muted"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="text-ink-muted hover:text-red-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-border-subtle bg-surface space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-ink-muted">Estimated Subtotal</span>
                  <span className="font-serif text-lg font-bold text-ink">
                    {formatINR(subtotal)}
                  </span>
                </div>
                <p className="text-[11px] text-ink-muted flex items-center gap-1">
                  <span>🌸 Vadodara local delivery calculated at checkout</span>
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <Link href="/checkout" onClick={closeDrawer} className="block w-full">
                  <Button variant="primary" className="w-full">
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>

                <Link
                  href={whatsappCheckoutLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button variant="whatsapp" className="w-full">
                    <MessageCircle className="w-4 h-4 fill-current mr-1" />
                    <span>Order Directly via WhatsApp</span>
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
