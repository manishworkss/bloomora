'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Menu, X, Heart, MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export const Header: React.FC = () => {
  const { totalItems, openDrawer } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-canvas/95 backdrop-blur-md border-b border-border-subtle transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ink hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Identity / Logo - Sized to fit comfortably inside the header box */}
          <div className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start">
            <Link
              href="/"
              aria-label="Bloomora - Handcrafted Creations"
              className="inline-flex items-center group focus-visible:outline-none py-1"
            >
              {/* Perfectly fitting transparent logo without overflowing the header box */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/bloomora-logo.png"
                  alt="Bloomora Handcrafted Creations"
                  fill
                  priority
                  className="object-contain drop-shadow-sm"
                  sizes="(max-width: 640px) 56px, 64px"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/shop"
              className="text-sm font-medium text-ink hover:text-primary transition-colors py-1"
            >
              Shop All
            </Link>
            <Link
              href="/shop?category=bouquets"
              className="text-sm font-medium text-ink hover:text-primary transition-colors py-1"
            >
              Bouquets
            </Link>
            <Link
              href="/shop?category=keychains"
              className="text-sm font-medium text-ink hover:text-primary transition-colors py-1"
            >
              Keychains
            </Link>
            <Link
              href="/shop?category=flowers"
              className="text-sm font-medium text-ink hover:text-primary transition-colors py-1"
            >
              Desk Pots
            </Link>
            <Link
              href="/custom-orders"
              className="text-sm font-medium text-primary hover:text-primary-hover flex items-center gap-1.5 py-1"
            >
              <Heart className="w-3.5 h-3.5 fill-primary/20" />
              Custom Orders
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-ink hover:text-primary transition-colors py-1"
            >
              Our Story
            </Link>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            {/* WhatsApp Quick Link */}
            <Link
              href={`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                "Hi Bloomora! 🌸 I'm browsing your website and have a question."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold tracking-wide transition-all shadow-sm"
              title="Chat with Bloomora creator on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-whatsapp fill-whatsapp" />
              <span>WhatsApp Us</span>
            </Link>

            {/* Shopping Bag Button */}
            <button
              type="button"
              onClick={openDrawer}
              className="relative p-2.5 text-ink hover:text-primary hover:bg-surface rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`Shopping bag with ${totalItems} items`}
            >
              <ShoppingBag className="w-6 h-6 stroke-[1.8]" />
              {totalItems > 0 && (
                <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[11px] font-bold text-white bg-primary rounded-full animate-in zoom-in-75 duration-200">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface border-b border-border-subtle animate-in slide-in-from-top-4 duration-200">
          <div className="px-5 pt-3 pb-6 space-y-3">
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-ink hover:text-primary py-2 border-b border-border-subtle/50"
            >
              Shop All Creations
            </Link>
            <Link
              href="/shop?category=bouquets"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-ink hover:text-primary py-2 border-b border-border-subtle/50"
            >
              Floral Bouquets
            </Link>
            <Link
              href="/shop?category=keychains"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-ink hover:text-primary py-2 border-b border-border-subtle/50"
            >
              Handmade Keychains
            </Link>
            <Link
              href="/shop?category=flowers"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-ink hover:text-primary py-2 border-b border-border-subtle/50"
            >
              Crochet Desk Pots
            </Link>
            <Link
              href="/custom-orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-primary py-2 border-b border-border-subtle/50"
            >
              🌸 Request Custom Gift
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-ink hover:text-primary py-2 border-b border-border-subtle/50"
            >
              About Bloomora
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-ink hover:text-primary py-2"
            >
              Contact & Vadodara Delivery
            </Link>

            <div className="pt-2">
              <Link
                href={`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-whatsapp text-white font-medium shadow-sm hover:brightness-105"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Chat on WhatsApp (+91 8271735190)</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
