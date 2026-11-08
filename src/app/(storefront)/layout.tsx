import React from 'react';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { CartProvider } from '@/context/CartContext';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-canvas">
        <AnnouncementBar />
        <Header />
        <main className="flex-1">{children}</main>
        <CartDrawer />
        <Footer />
      </div>
    </CartProvider>
  );
}

