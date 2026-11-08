import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Heart, ArrowRight, MessageCircle, Truck, Flower2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/storefront/ProductCard';
import { DEFAULT_WHATSAPP_NUMBER, getCustomOrderInquiryLink } from '@/lib/whatsapp';
import { getProducts } from '@/lib/products-store';

export default function HomePage() {
  const customWhatsAppUrl = getCustomOrderInquiryLink();
  const featuredProducts = getProducts(true).slice(0, 4);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION WITH MELTING BLOOMORA EMBROIDERY LOGO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface via-canvas to-canvas pt-10 pb-20 lg:pt-16 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left Copy */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/15 border border-secondary/30 text-xs font-semibold text-primary tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Vadodara&apos;s Artisan Studio • Delivering City-Wide</span>
              </div>

              <div className="space-y-2">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink tracking-tight leading-[1.12]">
                  Bloomora <br />
                  <span className="text-primary italic font-normal text-3xl sm:text-4xl lg:text-5xl">
                    Little Creations. Endless Emotions.
                  </span>
                </h1>
              </div>

              <p className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-xl mx-auto lg:mx-0">
                Thoughtfully crocheted flowers, everlasting bouquets, and personalized keychains.
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
                    <span>WhatsApp Order (+91 8271735190)</span>
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
                  <p className="text-xs text-ink-muted">City-Wide Delivery</p>
                </div>
              </div>
            </div>

            {/* Right Visual Collage featuring the Melting Bloomora Logo */}
            <div className="relative flex justify-center items-center">
              <div className="relative w-full max-w-md lg:max-w-lg aspect-square flex items-center justify-center">
                {/* Background decorative warm ring */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-secondary/20 via-primary/5 to-transparent blur-2xl" />

                {/* Clean Transparent Bloomora Logo */}
                <div className="relative w-full h-full p-2 sm:p-4">
                  <Image
                    src="/images/bloomora-hoop.png"
                    alt="Bloomora Handcrafted Creations Embroidery Showcase"
                    fill
                    priority
                    className="object-contain drop-shadow-md hover:scale-[1.02] transition-transform duration-500 ease-out"
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                </div>

                {/* Floating Artisan Badge */}
                <div className="absolute -bottom-2 sm:bottom-4 left-2 sm:left-4 bg-surface/95 backdrop-blur-md border border-border-subtle p-3.5 rounded-xl shadow-craft-elevated flex items-center gap-3 max-w-[240px]">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Heart className="w-4 h-4 fill-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ink">Handmade with Love</p>
                    <p className="text-[10px] text-ink-muted">Vadodara, Gujarat</p>
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
            Explore Bloomora&apos;s signature handmade creations, designed for birthdays, anniversaries, desk decor, and thoughtful keepsakes.
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
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. WHY BLOOMORA? — ARTISANAL VALUE PROPOSITION */}
      <section className="bg-surface border-y border-border-subtle py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 max-w-xl mx-auto mb-14">
            <span className="text-xs uppercase font-bold tracking-widest text-secondary">
              The Bloomora Promise
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
              Why Choose Bloomora?
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
