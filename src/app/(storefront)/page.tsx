import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, ArrowRight, MessageCircle, Truck, Flower2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/storefront/ProductCard';
import { DEFAULT_WHATSAPP_NUMBER, getCustomOrderInquiryLink } from '@/lib/whatsapp';
import { Product } from '@/types';

// Curated Initial Catalog Baseline for Vadodara Storefront
const FEATURED_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    categoryId: 'cat-bouquets',
    category: {
      id: 'cat-bouquets',
      name: 'Floral Bouquets',
      slug: 'bouquets',
      displayOrder: 1,
      isActive: true,
      createdAt: '2026-11-09',
    },
    title: 'Everlasting Crochet Lavender & Tulip Bouquet',
    slug: 'everlasting-lavender-tulip-bouquet',
    shortDescription:
      'Handcrafted with soft milk-cotton yarn in pastel lilac and cream, tied with natural jute twine.',
    fullDescription:
      'A timeless arrangement of handcrafted lavender sprigs and pastel tulips. Hand-knitted with love in Vadodara, this bouquet never withers and stays vibrant forever.',
    basePrice: 899,
    compareAtPrice: 1049,
    productType: 'READY_MADE',
    preparationDays: 0,
    isPublished: true,
    isFeatured: true,
    hasVariants: false,
    stockQuantity: 6,
    lowStockThreshold: 2,
    images: [
      {
        id: 'img-001',
        productId: 'prod-001',
        cloudinaryPublicId: 'the-handmade-craft/sample-1',
        imageUrl:
          'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800&auto=format&fit=crop',
        altText: 'Handmade crochet bouquet with lavender and cream tulips',
        displayOrder: 0,
        isPrimary: true,
      },
    ],
    createdAt: '2026-11-09',
    updatedAt: '2026-11-09',
  },
  {
    id: 'prod-002',
    categoryId: 'cat-flowers',
    category: {
      id: 'cat-flowers',
      name: 'Flower Pots',
      slug: 'flowers',
      displayOrder: 2,
      isActive: true,
      createdAt: '2026-11-09',
    },
    title: 'Mini Smiling Sunflower Crochet Desk Pot',
    slug: 'mini-smiling-sunflower-crochet-pot',
    shortDescription:
      'Adorable handmade yellow sunflower with a joyful face sitting in a cozy terracotta yarn pot.',
    fullDescription:
      'Brighten any work desk, study table, or gifting occasion with this cheerful smiling sunflower. Hand-crocheted stitch-by-stitch.',
    basePrice: 399,
    compareAtPrice: 450,
    productType: 'READY_MADE',
    preparationDays: 0,
    isPublished: true,
    isFeatured: true,
    hasVariants: false,
    stockQuantity: 10,
    lowStockThreshold: 3,
    images: [
      {
        id: 'img-002',
        productId: 'prod-002',
        cloudinaryPublicId: 'the-handmade-craft/sample-2',
        imageUrl:
          'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=800&auto=format&fit=crop',
        altText: 'Cute crochet sunflower desk pot',
        displayOrder: 0,
        isPrimary: true,
      },
    ],
    createdAt: '2026-11-09',
    updatedAt: '2026-11-09',
  },
  {
    id: 'prod-003',
    categoryId: 'cat-keychains',
    category: {
      id: 'cat-keychains',
      name: 'Keychains',
      slug: 'keychains',
      displayOrder: 3,
      isActive: true,
      createdAt: '2026-11-09',
    },
    title: 'Handmade Daisy Flower Charm Keychain',
    slug: 'handmade-daisy-flower-charm-keychain',
    shortDescription:
      'Delicate white daisy with yellow pistil charm, durable alloy golden ring, and ribbon bow.',
    fullDescription:
      'A lightweight yet durable handmade keychain to keep keys organized or attach to your favorite handbag or backpack.',
    basePrice: 199,
    compareAtPrice: 249,
    productType: 'READY_MADE',
    preparationDays: 0,
    isPublished: true,
    isFeatured: true,
    hasVariants: false,
    stockQuantity: 15,
    lowStockThreshold: 5,
    images: [
      {
        id: 'img-003',
        productId: 'prod-003',
        cloudinaryPublicId: 'the-handmade-craft/sample-3',
        imageUrl:
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
        altText: 'Handmade daisy crochet keychain charm',
        displayOrder: 0,
        isPrimary: true,
      },
    ],
    createdAt: '2026-11-09',
    updatedAt: '2026-11-09',
  },
  {
    id: 'prod-004',
    categoryId: 'cat-bouquets',
    category: {
      id: 'cat-bouquets',
      name: 'Floral Bouquets',
      slug: 'bouquets',
      displayOrder: 1,
      isActive: true,
      createdAt: '2026-11-09',
    },
    title: 'Customizable Pastel Rose & Daisy Keepsake Bouquet',
    slug: 'customizable-pastel-rose-daisy-keepsake-bouquet',
    shortDescription:
      'Bespoke bouquet customized with your favorite color palette. Handcrafted to order.',
    fullDescription:
      'Select your personalized colors and let our artisan craft an exclusive floral bouquet just for your special person.',
    basePrice: 1199,
    productType: 'MADE_TO_ORDER',
    preparationDays: 3,
    isPublished: true,
    isFeatured: true,
    hasVariants: false,
    stockQuantity: 99,
    lowStockThreshold: 1,
    images: [
      {
        id: 'img-004',
        productId: 'prod-004',
        cloudinaryPublicId: 'the-handmade-craft/sample-4',
        imageUrl:
          'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop',
        altText: 'Customizable handmade rose bouquet in Vadodara',
        displayOrder: 0,
        isPrimary: true,
      },
    ],
    createdAt: '2026-11-09',
    updatedAt: '2026-11-09',
  },
];

export default function HomePage() {
  const customWhatsAppUrl = getCustomOrderInquiryLink();

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface via-canvas to-canvas pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left Copy */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/15 border border-secondary/30 text-xs font-semibold text-primary tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Vadodara&apos;s Artisan Studio • Delivering City-Wide</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink tracking-tight leading-[1.15]">
                Little Creations. <br />
                <span className="text-primary italic font-normal">Endless Emotions.</span>
              </h1>

              <p className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-xl mx-auto lg:mx-0">
                Thoughtfully crocheted flowers, eternal bouquets, and handcrafted keychains.
                Every piece is made slowly with care, warmth, and emotion right here in Vadodara.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link href="/shop" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    <span>Explore Our Creations</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>

                <Link
                  href={`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button variant="whatsapp" size="lg" className="w-full sm:w-auto">
                    <MessageCircle className="w-4 h-4 fill-current mr-1" />
                    <span>WhatsApp Order / Inquiry</span>
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-border-subtle/70 max-w-lg mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <p className="font-serif text-lg font-bold text-ink">100%</p>
                  <p className="text-xs text-ink-muted">Handcrafted Stitch</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="font-serif text-lg font-bold text-ink">Forever</p>
                  <p className="text-xs text-ink-muted">Never Withers</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="font-serif text-lg font-bold text-ink">Vadodara</p>
                  <p className="text-xs text-ink-muted">Local Delivery</p>
                </div>
              </div>
            </div>

            {/* Right Visual Collage */}
            <div className="relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-surface relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=1000&auto=format&fit=crop"
                    alt="Handcrafted bouquet by The Handmade Craft"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent flex items-end p-6">
                    <div className="text-white space-y-1">
                      <p className="text-xs uppercase tracking-widest text-secondary font-semibold">
                        Artisan Spotlight
                      </p>
                      <p className="font-serif text-xl font-bold">Pastel Dreams Crochet Bouquet</p>
                      <p className="text-xs text-white/80">Available across all Vadodara PIN codes</p>
                    </div>
                  </div>
                </div>

                {/* Floating Artisan Quote */}
                <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-surface/95 backdrop-blur-md border border-border-subtle p-4 rounded-xl shadow-craft-elevated items-center gap-3 max-w-xs">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Heart className="w-5 h-5 fill-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink">Handmade with Endless Love</p>
                    <p className="text-[11px] text-ink-muted">No machines. Real handmade craftsmanship.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-secondary">
            Curated Collections
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
            Crafted for Every Heartfelt Moment
          </h2>
          <p className="text-sm text-ink-muted">
            Explore our signature handmade categories, designed for birthdays, anniversaries, desk decor, and thoughtful keepsakes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1: Bouquets */}
          <Link
            href="/shop?category=bouquets"
            className="group relative rounded-xl overflow-hidden aspect-[4/5] bg-surface border border-border-subtle shadow-craft hover:shadow-craft-elevated transition-all"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop"
              alt="Handmade bouquets category"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-xs uppercase tracking-wider text-secondary font-semibold">
                Everlasting Blooms
              </span>
              <h3 className="font-serif text-2xl font-bold">Floral Bouquets</h3>
              <p className="text-xs text-white/80 mt-1">Tulips, roses, and lavender arrangements</p>
            </div>
          </Link>

          {/* Card 2: Keychains */}
          <Link
            href="/shop?category=keychains"
            className="group relative rounded-xl overflow-hidden aspect-[4/5] bg-surface border border-border-subtle shadow-craft hover:shadow-craft-elevated transition-all"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop"
              alt="Handmade keychains category"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-xs uppercase tracking-wider text-secondary font-semibold">
                Pocket Charms
              </span>
              <h3 className="font-serif text-2xl font-bold">Keychains & Charms</h3>
              <p className="text-xs text-white/80 mt-1">Daisies, animals, and cute bag tags</p>
            </div>
          </Link>

          {/* Card 3: Flower Pots */}
          <Link
            href="/shop?category=flowers"
            className="group relative rounded-xl overflow-hidden aspect-[4/5] bg-surface border border-border-subtle shadow-craft hover:shadow-craft-elevated transition-all"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=800&auto=format&fit=crop"
              alt="Desk flower pots category"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-xs uppercase tracking-wider text-secondary font-semibold">
                Desk Companions
              </span>
              <h3 className="font-serif text-2xl font-bold">Crochet Flower Pots</h3>
              <p className="text-xs text-white/80 mt-1">Smiling sunflowers & potted plants</p>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-secondary">
              Handpicked Creations
            </span>
            <h2 className="font-serif text-3xl font-bold text-ink mt-1">Featured in Vadodara</h2>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold text-primary hover:text-primary-hover flex items-center gap-1 group"
          >
            <span>View All Creations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. WHY HANDMADE? — ARTISANAL VALUE PROPOSITION */}
      <section className="bg-surface border-y border-border-subtle py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 max-w-xl mx-auto mb-14">
            <span className="text-xs uppercase font-bold tracking-widest text-secondary">
              The Artisan Promise
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
              Why Choose The Handmade Craft?
            </h2>
            <p className="text-sm text-ink-muted">
              In a world of mass-produced plastic, we believe in the human soul behind every loop of yarn.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-xl bg-canvas border border-border-subtle space-y-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto sm:mx-0">
                <Flower2 className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-ink">Never Withering</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Real flowers dry up in 3 days. Our handmade crochet blooms stay vibrant forever, keeping memories fresh.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-canvas border border-border-subtle space-y-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto sm:mx-0">
                <Truck className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-ink">Whole Vadodara Delivery</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                From Alkapuri and Gotri to Manjalpur and Karelibaug, we deliver safely to your doorstep across all Vadodara PIN codes.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-canvas border border-border-subtle space-y-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto sm:mx-0">
                <Clock className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-ink">Quick Preparation</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Ready-made items dispatch quickly; custom orders are knitted and packed in just 2–4 days.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-canvas border border-border-subtle space-y-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto sm:mx-0">
                <MessageCircle className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-ink">Direct WhatsApp Care</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Chat directly with the creator (+91 8271735190) for color customizations, gift tags, and special requests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CUSTOM GIFT COMMISSION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-primary via-primary-hover to-[#934C37] p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left max-w-2xl">
            <span className="text-xs uppercase font-bold tracking-widest text-secondary">
              Personalized Commissions
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Want a Custom Bouquet or Personalized Gift?
            </h2>
            <p className="text-sm text-white/90 leading-relaxed">
              Have an idea for specific flowers, custom colors, or bulk wedding/birthday favors?
              Send us a photo or describe what you have in mind—we craft custom orders with love!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
            <Link href={customWhatsAppUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="whatsapp" size="lg" className="w-full sm:w-auto font-semibold">
                <MessageCircle className="w-4 h-4 fill-current mr-1.5" />
                <span>Discuss on WhatsApp</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
