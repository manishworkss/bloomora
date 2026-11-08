import React from 'react';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { WhatsAppConcierge } from '@/components/storefront/WhatsAppConcierge';
import { CartProvider } from '@/context/CartContext';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-canvas w-full max-w-full overflow-x-hidden">
        <AnnouncementBar />
        <Header />
        <main className="flex-1 w-full max-w-full overflow-x-hidden">{children}</main>
        <CartDrawer />
        <WhatsAppConcierge />
        <Footer />
      </div>
    </CartProvider>
  );
}

