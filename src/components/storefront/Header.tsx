'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Menu,
  X,
  Heart,
  MessageCircle,
  ChevronDown,
  Clock,
  Sparkles,
  Users,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export const Header: React.FC = () => {
  const { totalItems, openDrawer } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(true);

  // Lock body scroll when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-canvas/95 backdrop-blur-md border-b border-border-subtle transition-all duration-200 w-full max-w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 w-full">
            {/* Mobile Menu Hamburger */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 -ml-2 text-ink hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Identity / Bloomora Wordmark Logo */}
            <div className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start">
              <Link
                href="/"
                aria-label="Bloomora - Handcrafted Creations"
                className="inline-flex items-center group focus-visible:outline-none py-1"
              >
                <div className="relative w-32 h-10 sm:w-40 sm:h-12 md:w-44 md:h-13 shrink-0 transition-transform duration-300 group-hover:scale-[1.02]">
                  <Image
                    src="/images/bloomora-logo.png"
                    alt="Bloomora Handcrafted Creations"
                    fill
                    priority
                    className="object-contain"
                    sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 176px"
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Single-Line Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 xl:space-x-10 whitespace-nowrap">
              <Link
                href="/"
                className="text-xs uppercase font-medium tracking-widest text-ink hover:text-primary transition-colors py-1 whitespace-nowrap"
              >
                Home
              </Link>

              {/* Shop with Dropdown (all categories consolidated here as requested) */}
              <div
                className="relative group py-2"
                onMouseEnter={() => setShopDropdownOpen(true)}
                onMouseLeave={() => setShopDropdownOpen(false)}
              >
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 text-xs uppercase font-medium tracking-widest text-ink group-hover:text-primary transition-colors whitespace-nowrap"
                >
                  <span>Shop</span>
                  <ChevronDown className="w-3.5 h-3.5 text-ink-muted group-hover:text-primary transition-transform duration-200 group-hover:rotate-180" />
                </Link>

                {/* Rich Dropdown Panel */}
                {shopDropdownOpen && (
                  <div className="absolute top-full left-0 w-64 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="bg-surface rounded-2xl border border-border-subtle shadow-craft-elevated p-2 space-y-1">
                      <Link
                        href="/shop"
                        className="block px-3.5 py-2.5 rounded-xl text-xs font-semibold text-ink hover:bg-canvas hover:text-primary transition-colors"
                      >
                        All Handmade Creations
                      </Link>
                      <Link
                        href="/shop?category=flowers"
                        className="block px-3.5 py-2.5 rounded-xl text-xs text-ink-muted hover:text-ink hover:bg-canvas transition-colors"
                      >
                        Handmade Flowers & Desk Pots
                      </Link>
                      <Link
                        href="/shop?category=bouquets"
                        className="block px-3.5 py-2.5 rounded-xl text-xs text-ink-muted hover:text-ink hover:bg-canvas transition-colors"
                      >
                        Everlasting Floral Bouquets
                      </Link>
                      <Link
                        href="/shop?category=keychains"
                        className="block px-3.5 py-2.5 rounded-xl text-xs text-ink-muted hover:text-ink hover:bg-canvas transition-colors"
                      >
                        Handmade Crochet Keychains
                      </Link>
                      <Link
                        href="/custom-orders"
                        className="block px-3.5 py-2.5 rounded-xl text-xs text-primary font-semibold hover:bg-blush/40 transition-colors"
                      >
                        Personalised Gifts & Custom
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Our Happy Family (New Dedicated Category) */}
              <Link
                href="/happy-family"
                className="text-xs uppercase font-medium tracking-widest text-ink hover:text-primary transition-colors py-1 whitespace-nowrap flex items-center gap-1.5"
              >
                <span>Our Happy Family</span>
              </Link>

              <Link
                href="/about"
                className="text-xs uppercase font-medium tracking-widest text-ink hover:text-primary transition-colors py-1 whitespace-nowrap"
              >
                Our Story
              </Link>

              <Link
                href="/contact"
                className="text-xs uppercase font-medium tracking-widest text-ink hover:text-primary transition-colors py-1 whitespace-nowrap"
              >
                Contact
              </Link>
            </nav>

            {/* Right Action Controls (Search option removed as requested) */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              {/* Order Tracking / Lookup */}
              <Link
                href="/orders/track"
                className="p-2 text-ink hover:text-primary hover:bg-surface rounded-lg transition-colors hidden sm:inline-flex"
                aria-label="Track your order"
                title="Track order status"
              >
                <Clock className="w-5 h-5 stroke-[1.8]" />
              </Link>

              {/* WhatsApp Quick Link */}
              <Link
                href={`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  "Hi Bloomora! 🌸 I'm browsing your website and have a question."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold tracking-wide transition-all shadow-subtle"
                title="Chat with Bloomora on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-whatsapp fill-whatsapp" />
                <span>WhatsApp Us</span>
              </Link>

              {/* Shopping Bag Button */}
              <button
                type="button"
                onClick={openDrawer}
                className="relative p-2 text-ink hover:text-primary hover:bg-surface rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={`Shopping bag with ${totalItems} items`}
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-primary rounded-full animate-in zoom-in-75 duration-200">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu (Rendered OUTSIDE <header> at z-[100] to cover entire viewport cleanly) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] flex">
          {/* Darkened Backdrop */}
          <div
            className="fixed inset-0 bg-ink/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel Sliding in from Left */}
          <div className="relative w-[85vw] max-w-xs bg-surface h-full shadow-2xl flex flex-col z-[101] overflow-y-auto overscroll-contain animate-in slide-in-from-left duration-250 border-r border-border-subtle">
            {/* Drawer Header */}
            <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-canvas/60">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="relative w-32 h-10 shrink-0 block"
              >
                <Image
                  src="/images/bloomora-logo.png"
                  alt="Bloomora Handcrafted Creations"
                  fill
                  className="object-contain"
                  sizes="128px"
                />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-ink-muted hover:text-ink hover:bg-canvas rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Links */}
            <div className="p-5 space-y-3 flex-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-ink hover:text-primary py-2.5 border-b border-border-subtle/50"
              >
                Home
              </Link>

              {/* Shop Collapsible Sub-items */}
              <div className="border-b border-border-subtle/50 pb-2">
                <button
                  type="button"
                  onClick={() => setMobileShopOpen(!mobileShopOpen)}
                  className="w-full flex items-center justify-between text-sm font-semibold text-ink hover:text-primary py-2.5 text-left"
                >
                  <span>Shop Collections</span>
                  <ChevronDown
                    className={`w-4 h-4 text-ink-muted transition-transform duration-200 ${
                      mobileShopOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {mobileShopOpen && (
                  <div className="pl-3 py-1 space-y-2 text-xs">
                    <Link
                      href="/shop"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-ink-muted hover:text-primary py-1.5"
                    >
                      • All Handmade Creations
                    </Link>
                    <Link
                      href="/shop?category=flowers"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-ink-muted hover:text-primary py-1.5"
                    >
                      • Handmade Flowers & Desk Pots
                    </Link>
                    <Link
                      href="/shop?category=bouquets"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-ink-muted hover:text-primary py-1.5"
                    >
                      • Everlasting Floral Bouquets
                    </Link>
                    <Link
                      href="/shop?category=keychains"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-ink-muted hover:text-primary py-1.5"
                    >
                      • Handmade Crochet Keychains
                    </Link>
                    <Link
                      href="/custom-orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-primary font-semibold py-1.5"
                    >
                      • Personalised Gifts & Custom
                    </Link>
                  </div>
                )}
              </div>

              {/* Our Happy Family Mobile Link */}
              <Link
                href="/happy-family"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-ink hover:text-primary py-2.5 border-b border-border-subtle/50 flex items-center justify-between"
              >
                <span>Our Happy Family</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blush text-rose">
                  Stories
                </span>
              </Link>

              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-ink hover:text-primary py-2.5 border-b border-border-subtle/50"
              >
                Our Story
              </Link>

              <Link
                href="/orders/track"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-ink hover:text-primary py-2.5 border-b border-border-subtle/50"
              >
                Track Your Order
              </Link>

              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-ink hover:text-primary py-2.5"
              >
                Contact & Vadodara Delivery
              </Link>

              <div className="pt-4">
                <Link
                  href={`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    "Hi Bloomora! 🌸 I would like to place an order in Vadodara."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold shadow-subtle hover:bg-emerald-100 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-whatsapp fill-whatsapp" />
                  <span>Chat on WhatsApp (+91 8271735190)</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
