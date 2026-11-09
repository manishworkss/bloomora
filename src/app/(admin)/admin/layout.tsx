'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MapPin,
  MessageSquare,
  Settings,
  ExternalLink,
  LogOut,
} from 'lucide-react';

const ADMIN_LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders & Fulfillment', icon: ShoppingBag },
  { href: '/admin/products', label: 'Product Catalog', icon: Package },
  { href: '/admin/enquiries', label: 'Custom Enquiries', icon: MessageSquare },
  { href: '/admin/delivery-zones', label: 'Vadodara Zones & PINs', icon: MapPin },
  { href: '/admin/settings', label: 'Site & WhatsApp Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If on admin login page, render clean full-page without sidebar
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-canvas flex flex-col">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-canvas flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border-subtle flex flex-col shrink-0 hidden md:flex">
        {/* Brand Header with Melting Logo */}
        <div className="p-5 border-b border-border-subtle">
          <Link href="/admin/dashboard" className="block">
            <div className="relative w-40 h-14">
              <Image
                src="/images/bloomora-logo.png"
                alt="Bloomora Admin Logo"
                fill
                className="object-contain"
                sizes="160px"
              />
            </div>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-primary block mt-1">
              Admin Console
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {ADMIN_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-ink-muted hover:text-ink hover:bg-canvas'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border-subtle space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-ink-muted hover:text-ink hover:bg-canvas transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Bloomora Storefront</span>
          </Link>

          <Link
            href="/admin/login"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-700 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-surface border-b border-border-subtle p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image
                src="/images/bloomora-logo.png"
                alt="Bloomora Logo"
                fill
                className="object-contain"
                sizes="32px"
              />
            </div>
            <Link href="/admin/dashboard" className="font-serif font-bold text-base text-ink">
              Bloomora Admin
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-xs text-primary font-semibold">
              Storefront ↗
            </Link>
            <Link href="/admin/login" className="text-xs text-red-600 font-semibold">
              Sign Out
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
