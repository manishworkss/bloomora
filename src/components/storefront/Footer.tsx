import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, MessageCircle, MapPin, Heart, ShieldCheck } from 'lucide-react';
import { DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-border-subtle mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Info with Big Bold Melting Logo */}
          <div className="space-y-4">
            <Link
              href="/"
              aria-label="Bloomora - Handcrafted Creations"
              className="inline-block group focus-visible:outline-none"
            >
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 shrink-0 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/bloomora-logo.png"
                  alt="Bloomora Handcrafted Creations"
                  fill
                  className="object-contain mix-blend-multiply drop-shadow-sm"
                  sizes="(max-width: 640px) 128px, 176px"
                />
              </div>
            </Link>

            <p className="text-sm text-ink-muted leading-relaxed">
              Little Creations. Endless Emotions. Each floral bouquet, keychain, and potted flower is thoughtfully hand-knitted and assembled with care in Vadodara, Gujarat.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href="https://instagram.com/the_.handmadecraft"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-canvas border border-border-subtle flex items-center justify-center text-ink hover:text-primary hover:border-primary transition-colors"
                aria-label="Follow Bloomora on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </Link>
              <Link
                href={`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-canvas border border-border-subtle flex items-center justify-center text-emerald-700 hover:text-whatsapp hover:border-whatsapp transition-colors"
                aria-label="Chat with Bloomora on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Catalog Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-ink">Our Creations</h4>
            <ul className="space-y-2.5 text-sm text-ink-muted">
              <li>
                <Link href="/shop" className="hover:text-primary transition-colors">
                  All Handmade Gifts
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bouquets" className="hover:text-primary transition-colors">
                  Floral Bouquets
                </Link>
              </li>
              <li>
                <Link href="/shop?category=keychains" className="hover:text-primary transition-colors">
                  Crochet Keychains
                </Link>
              </li>
              <li>
                <Link href="/shop?category=flowers" className="hover:text-primary transition-colors">
                  Desk Flower Pots
                </Link>
              </li>
              <li>
                <Link href="/custom-orders" className="hover:text-primary font-medium text-primary transition-colors">
                  Custom Gift Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care & Delivery */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-ink">Local Care & Delivery</h4>
            <ul className="space-y-2.5 text-sm text-ink-muted">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Serving all areas across Vadodara, Gujarat</span>
              </li>
              <li>
                <Link href="/orders/track" className="hover:text-primary transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Bloomora Studio
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact Us & WhatsApp Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Reassurance */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-ink">Trust & Policies</h4>
            <ul className="space-y-2.5 text-sm text-ink-muted">
              <li className="flex items-center gap-1.5 text-xs text-ink-muted">
                <ShieldCheck className="w-4 h-4 text-sage shrink-0" />
                <span>100% Authentic Handmade Products</span>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-primary transition-colors">
                  Delivery & Fulfillment Rules
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-primary transition-colors">
                  Non-Refundable Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border-subtle/80 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-muted gap-4">
          <p>© {new Date().getFullYear()} Bloomora. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Handmade with</span>
            <Heart className="w-3.5 h-3.5 fill-primary text-primary" />
            <span>in Vadodara, Gujarat.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
