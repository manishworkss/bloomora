import React from 'react';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { WhatsAppConcierge } from '@/components/storefront/WhatsAppConcierge';
import { CartProvider } from '@/context/CartContext';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://bloomora.in').replace(/\/$/, '');

const STORE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'Bloomora Studio',
  description:
    'Handcrafted crochet keychains, customized bouquets, handmade forever flowers, birthday surprise cards, seasonal collections, and personalized keepsake gifts made in Vadodara.',
  url: SITE_URL,
  telephone: '+91-8271735190',
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Vadodara',
    addressRegion: 'Gujarat',
    addressCountry: 'IN',
  },
  sameAs: ['https://wa.me/918271735190'],
};

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STORE_JSON_LD) }}
      />
      <div className="min-h-screen flex flex-col bg-canvas w-full max-w-full overflow-x-clip">
        <Header />
        <main className="flex-1 w-full max-w-full overflow-x-clip">{children}</main>
        <CartDrawer />
        <WhatsAppConcierge />
        <Footer />
      </div>
    </CartProvider>
  );
}
