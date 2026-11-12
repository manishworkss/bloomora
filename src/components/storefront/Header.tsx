'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Menu,
  X,
  MessageCircle,
  ChevronDown,
  Clock,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const { totalItems, openDrawer } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      setIsScrolled(scrollTop > 10);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  useEffect(() => {
    fetch('/api/store/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories.filter((c: any) => c.isActive !== false));
        }
      })
      .catch(() => {});
  }, []);

  // Lock body scroll when mobile menu drawer is open & clear residual hover state on close
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsHovered(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Luxury editorial transparent overlay over Homepage hero before scroll/hover; crisp white surface on scroll or inner pages
  const isTransparentHero =
    isHomePage && !isScrolled && !isHovered && !mobileMenuOpen && !shopDropdownOpen;

  const getNavLinkClass = (href: string, isGroup = false) => {
    const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
    const hoverText = isGroup ? 'group-hover:text-blush' : 'hover:text-blush';
    const lightHoverText = isGroup ? 'group-hover:text-primary' : 'hover:text-primary';

    if (isTransparentHero) {
      return `text-xs uppercase font-medium tracking-widest transition-colors py-1 whitespace-nowrap ${
        isActive
          ? 'text-white border-b border-white/70'
          : `text-white/90 ${hoverText}`
      } drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]`;
    }
    return `text-xs uppercase font-medium tracking-widest transition-colors py-1 whitespace-nowrap ${
      isActive ? 'text-primary font-semibold' : `text-ink ${lightHoverText}`
    }`;
  };

  return (
    <>
      <header
        onMouseEnter={() => {
          if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
            setIsHovered(true);
          }
        }}
        onMouseLeave={() => setIsHovered(false)}
        className={`z-40 w-full max-w-full transition-colors duration-300 ${
          isHomePage ? 'fixed top-0 left-0 right-0' : 'sticky top-0'
        } ${
          isTransparentHero
            ? 'bg-gradient-to-b from-[#180E10]/55 via-[#180E10]/20 to-transparent border-b border-transparent'
            : 'bg-surface/95 backdrop-blur-md border-b border-border-subtle shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 w-full">
            {/* Mobile Menu Hamburger */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 -ml-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg ${
                  isTransparentHero
                    ? 'text-white hover:bg-white/15 drop-shadow-sm'
                    : 'text-ink hover:text-primary'
                }`}
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
                    className={`object-contain transition-all duration-300 ${
                      isTransparentHero
                        ? 'brightness-0 invert drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]'
                        : ''
                    }`}
                    sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 176px"
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Single-Line Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 xl:space-x-10 whitespace-nowrap">
              <Link href="/" className={getNavLinkClass('/')}>
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
                  className={`inline-flex items-center gap-1.5 ${getNavLinkClass('/shop', true)}`}
                >
                  <span>Shop</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 ${
                      isTransparentHero
                        ? 'text-white/80 group-hover:text-blush'
                        : 'text-ink-muted group-hover:text-primary'
                    }`}
                  />
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
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/shop?category=${cat.slug}`}
                          className="block px-3.5 py-2.5 rounded-xl text-xs text-ink-muted hover:text-ink hover:bg-canvas transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
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

              {/* Happy Family & Reviews Link */}
              <Link
                href="/happy-family"
                className={`flex items-center gap-1.5 ${getNavLinkClass('/happy-family')}`}
              >
                <span>Happy Family & Reviews</span>
              </Link>

              <Link href="/about" className={getNavLinkClass('/about')}>
                Our Story
              </Link>

              <Link href="/contact" className={getNavLinkClass('/contact')}>
                Contact
              </Link>
            </nav>

            {/* Right Action Controls (Search option removed as requested) */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              {/* Order Tracking / Lookup */}
              <Link
                href="/orders/track"
                className={`p-2 rounded-lg transition-colors hidden sm:inline-flex ${
                  isTransparentHero
                    ? 'text-white/95 hover:text-white hover:bg-white/15'
                    : 'text-ink hover:text-primary hover:bg-canvas'
                }`}
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
                className={`hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold tracking-wide transition-all shadow-subtle ${
                  isTransparentHero
                    ? 'bg-white/15 hover:bg-white/25 text-white border-white/35 backdrop-blur-md'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-200'
                }`}
                title="Chat with Bloomora on WhatsApp"
              >
                <MessageCircle
                  className={`w-3.5 h-3.5 ${
                    isTransparentHero
                      ? 'text-emerald-300 fill-emerald-300'
                      : 'text-whatsapp fill-whatsapp'
                  }`}
                />
                <span>WhatsApp Us</span>
              </Link>

              {/* Shopping Bag Button */}
              <button
                type="button"
                onClick={openDrawer}
                className={`relative p-2 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isTransparentHero
                    ? 'text-white hover:bg-white/15'
                    : 'text-ink hover:text-primary hover:bg-canvas'
                }`}
                aria-label={`Shopping bag with ${totalItems} items`}
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                {totalItems > 0 && (
                  <span
                    className={`absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full animate-in zoom-in-75 duration-200 ${
                      isTransparentHero
                        ? 'text-primary bg-white shadow-sm'
                        : 'text-white bg-primary'
                    }`}
                  >
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
                      className="block text-ink font-semibold hover:text-primary py-1.5"
                    >
                      • All Handmade Creations
                    </Link>
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/shop?category=${cat.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-ink-muted hover:text-primary py-1.5"
                      >
                        • {cat.name}
                      </Link>
                    ))}
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

              {/* Happy Family & Reviews Mobile Link */}
              <Link
                href="/happy-family"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-ink hover:text-primary py-2.5 border-b border-border-subtle/50 flex items-center justify-between"
              >
                <span>Happy Family & Reviews</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blush text-rose">
                  Photos & Videos
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
                className="block text-sm font-semibold text-ink hover:text-primary py-2.5 border-b border-border-subtle/50"
              >
                Contact Us
              </Link>

              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-semibold text-rose hover:text-primary py-2.5 flex items-center justify-between"
              >
                <span>Studio Admin Portal</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blush text-rose uppercase font-bold">Sign In ↗</span>
              </Link>

              <div className="pt-4">
                <Link
                  href={`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    "Hi Bloomora! 🌸 I would like to place an order."
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
