import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Heart,
  ArrowRight,
  MessageCircle,
  Truck,
  Flower2,
  Clock,
  Instagram,
  CheckCircle2,
  Package,
  Scissors,
  Palette,
  Gift,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/storefront/ProductCard';
import { FAQAccordion, FAQItem } from '@/components/storefront/FAQAccordion';
import { DEFAULT_WHATSAPP_NUMBER, getCustomOrderInquiryLink } from '@/lib/whatsapp';
import { getProductsAsync } from '@/lib/products-store';
import { getSettingsAsync } from '@/lib/settings-store';
import { getReviewsAsync } from '@/lib/reviews-store';
import { HappyFamilySection } from '@/components/storefront/HappyFamilySection';

export const dynamic = 'force-dynamic';

const BRAND_VALUES_MARQUEE = [
  'Made with Love',
  'Thoughtfully Handmade',
  'Unique Creations',
  'Personalised Gifting',
  'Crafted with Care',
  '100% Slow Crochet',
  'Vadodara Artisan Studio',
  'Everlasting Memories',
];

const CATEGORIES = [
  {
    id: 'flowers',
    name: 'Handmade Flowers',
    tagline: 'Single blossoms & smiling desk pots',
    href: '/shop?category=flowers',
    imageUrl:
      'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'bouquets',
    name: 'Everlasting Bouquets',
    tagline: 'Hand-knitted blooms wrapped in craft paper',
    href: '/shop?category=bouquets',
    imageUrl:
      'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'keychains',
    name: 'Handmade Keychains',
    tagline: 'Daisies, strawberries & bag charms',
    href: '/shop?category=keychains',
    imageUrl:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'custom',
    name: 'Personalised Gifts',
    tagline: 'Bespoke colors & handwritten cards',
    href: '/custom-orders',
    imageUrl:
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=600&auto=format&fit=crop',
  },
];

const PROCESS_STEPS = [
  {
    number: '01',
    icon: Palette,
    title: 'Curated Pastel Yarns',
    description:
      'We hand-select hypoallergenic milk-cotton threads known for their feather-soft texture and enduring pastel luster.',
  },
  {
    number: '02',
    icon: Scissors,
    title: 'Stitch-by-Stitch Craft',
    description:
      'Every petal, leaf, and stem is patiently crocheted with delicate needlework in our Vadodara studio.',
  },
  {
    number: '03',
    icon: Flower2,
    title: 'Floral Architecture',
    description:
      'Blooms are balanced into lasting arrangements, secured with natural jute twine and timeless aesthetics.',
  },
  {
    number: '04',
    icon: Gift,
    title: 'Boutique Unboxing',
    description:
      'Wrapped in signature kraft paper, tied with satin ribbon, and accompanied by your personalised message note.',
  },
];

const ORDER_STEPS = [
  {
    step: '1',
    title: 'Explore the Collection',
    desc: 'Browse our everlasting bouquets, desk pots, and keepsake keychains.',
  },
  {
    step: '2',
    title: 'Choose Your Favourite',
    desc: 'Select ready-to-ship creations or specify your custom colorway.',
  },
  {
    step: '3',
    title: 'Add Personal Touches',
    desc: 'Include a custom gift message for your recipient in Vadodara.',
  },
  {
    step: '4',
    title: 'Delivered with Love',
    desc: 'Receive your handcrafted treasure safely across all Vadodara PIN codes.',
  },
];

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How long do Bloomora handmade flowers last?',
    answer:
      'Forever! Unlike fresh-cut flowers that wither in days, our crochet blossoms are handcrafted from premium milk-cotton yarn that never fades, wilts, or requires water.',
  },
  {
    question: 'Do you deliver all across Vadodara?',
    answer:
      'Yes, we deliver across all 17 Vadodara PIN codes (390001 through 390025) with a flat ₹50 local courier fee. We coordinate delivery directly with you on WhatsApp once your handcrafted creation is wrapped.',
  },
  {
    question: 'Can I request a custom color palette or flower type?',
    answer:
      'Absolutely! We love crafting bespoke commissions. Simply visit our Custom Orders page or message us directly on WhatsApp (+91 8271735190) with your ideas or reference photos.',
  },
  {
    question: 'What is your return and cancellation policy?',
    answer:
      'Because every piece is meticulously handmade, orders are strictly non-refundable once dispatched. In the rare event of transit damage, notify us on WhatsApp within 24 hours with photos for an immediate replacement.',
  },
  {
    question: 'What payment options do you support?',
    answer:
      'We support all UPI payment apps including Google Pay, PhonePe, Paytm, and BHIM. Once your order is created, you are redirected to WhatsApp with your itemized receipt to confirm payment.',
  },
];

const INSTAGRAM_POSTS = [
  {
    id: 'ig-1',
    imageUrl:
      'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=400&auto=format&fit=crop',
    caption: 'Pastel lilac tulips crafted for an anniversary celebration in Alkapuri.',
  },
  {
    id: 'ig-2',
    imageUrl:
      'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=400&auto=format&fit=crop',
    caption: 'Smiling sunflower desk pot bringing cheer to a home office table.',
  },
  {
    id: 'ig-3',
    imageUrl:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&auto=format&fit=crop',
    caption: 'Daisy charm keychains hand-crocheted for bridesmaid return favors.',
  },
  {
    id: 'ig-4',
    imageUrl:
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=400&auto=format&fit=crop',
    caption: 'Custom pastel rose bouquet ready for gift wrapping with satin ribbon.',
  },
];

export default async function HomePage() {
  const customWhatsAppUrl = getCustomOrderInquiryLink();
  const [settings, allPublished, reviews] = await Promise.all([
    getSettingsAsync(),
    getProductsAsync(true),
    getReviewsAsync(true),
  ]);
  const featured = allPublished.filter((p) => p.isFeatured);
  const featuredProducts = (featured.length > 0 ? featured : allPublished).slice(0, 8);

  return (
    <div className="space-y-8 sm:space-y-12 pb-12 w-full max-w-full overflow-x-hidden">
      {/* 1. EDITORIAL HERO SECTION (Atmospheric Boutique Aesthetics) */}
      <section className="relative overflow-hidden pt-3 pb-6 lg:pt-8 lg:pb-8 w-full bg-gradient-to-b from-blush/25 via-canvas/60 to-canvas">
        {/* Soft diffused ambient lighting circles */}
        <div className="pointer-events-none absolute -top-20 -right-20 w-80 sm:w-[28rem] h-80 sm:h-[28rem] rounded-full bg-blush/40 blur-3xl -z-10" />
        <div className="pointer-events-none absolute top-1/3 -left-24 w-72 sm:w-80 h-72 sm:h-80 rounded-full bg-[#F4ECE4]/80 blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-center">
            {/* Left Hand Side (LHS): Handcrafted Bouquet Photo */}
            <div className="lg:col-span-6 relative w-full">
              <div className="relative">
                {/* Soft ambient backlight glow */}
                <div className="pointer-events-none absolute -inset-2 bg-gradient-to-tr from-rose/25 via-blush/35 to-amber-100/30 rounded-[2rem] blur-2xl opacity-70 -z-10" />

                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-border-subtle bg-surface shadow-craft-elevated">
                  {/* Full fit in half area for mobile view (~44vh) and balanced on desktop */}
                  <div className="relative w-full h-[44vh] sm:h-[48vh] min-h-[260px] max-h-[400px] lg:h-[460px] xl:h-[500px] lg:max-h-none overflow-hidden">
                    <Image
                      src="/images/bloomora-hero-bouquet.jpg"
                      alt="Bloomora Handcrafted Crochet Bouquet - Made with Love in Vadodara"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                      priority
                      className="object-cover object-center w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hand Side (RHS): Narrative Column */}
            <div className="lg:col-span-6 space-y-4 text-center lg:text-left min-w-0">
              <div className="space-y-3">
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.85rem] xl:text-[3.25rem] text-ink font-normal tracking-tight leading-[1.14]">
                  Little details. <br />
                  <span className="italic font-light text-rose">
                    Beautiful emotions.
                  </span>
                </h1>
                <p className="text-xs sm:text-base text-ink-muted leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                  Thoughtfully crocheted everlasting flowers, bespoke bouquets, and keepsake charms.
                  Each piece is slow-crafted stitch by stitch with warmth, patient care, and genuine feeling in Vadodara, Gujarat.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1.5 w-full sm:w-auto">
                <Link href="/shop" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-craft hover:shadow-craft-elevated transition-all">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>

                <Link href="/custom-orders" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-surface/85 hover:bg-surface border-border-subtle hover:border-primary/50 transition-all">
                    <span>Customise Your Gift</span>
                  </Button>
                </Link>
              </div>

              {/* Social Proof & Local Trust */}
              <div className="flex items-center justify-center lg:justify-start gap-3 pt-1">
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="inline-block h-7 w-7 rounded-full ring-2 ring-canvas bg-blush flex items-center justify-center text-[10px] font-bold text-rose">
                    MD
                  </div>
                  <div className="inline-block h-7 w-7 rounded-full ring-2 ring-canvas bg-surface border border-border-subtle flex items-center justify-center text-[10px] font-bold text-ink">
                    AP
                  </div>
                  <div className="inline-block h-7 w-7 rounded-full ring-2 ring-canvas bg-rose/15 flex items-center justify-center text-[10px] font-bold text-rose">
                    PS
                  </div>
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-[11px] text-ink-muted">
                    <strong className="text-ink font-semibold">500+ smiles</strong> delivered across Vadodara
                  </p>
                </div>
              </div>

              {/* Quiet Trust Attributes Card */}
              <div className="pt-2">
                <div className="bg-surface/85 backdrop-blur-sm rounded-2xl border border-border-subtle/80 p-3 sm:p-4 grid grid-cols-3 divide-x divide-border-subtle/70 text-center shadow-subtle max-w-md mx-auto lg:mx-0">
                  <div className="px-2">
                    <p className="font-serif text-lg sm:text-2xl font-bold text-ink">100%</p>
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-ink-muted mt-0.5">
                      Slow Crochet
                    </p>
                  </div>
                  <div className="px-2">
                    <p className="font-serif text-lg sm:text-2xl font-bold text-rose">Forever</p>
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-ink-muted mt-0.5">
                      Never Withers
                    </p>
                  </div>
                  <div className="px-2">
                    <p className="font-serif text-lg sm:text-2xl font-bold text-ink">Vadodara</p>
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-ink-muted mt-0.5">
                      City Delivery
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BRAND VALUES MARQUEE (Primary Theme Ribbon) */}
      <section className="relative bg-primary text-canvas py-2.5 sm:py-3 w-full overflow-hidden !mt-0 border-y border-rose-dark/30 shadow-sm select-none">
        {/* Soft edge fade masks for seamless luxury appearance */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-primary to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-primary to-transparent z-10" />

        <div className="flex overflow-hidden w-full">
          <div className="animate-marquee flex items-center whitespace-nowrap text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em]">
            {/* Set 1 */}
            <div className="flex items-center gap-8 sm:gap-12 shrink-0 pr-8 sm:pr-12">
              {BRAND_VALUES_MARQUEE.map((item, idx) => (
                <span key={`val-1-${idx}`} className="flex items-center gap-2.5 sm:gap-3 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-blush shrink-0" />
                  <span className="text-canvas tracking-[0.2em]">{item}</span>
                </span>
              ))}
            </div>
            {/* Set 2 (Seamless loop copy) */}
            <div className="flex items-center gap-8 sm:gap-12 shrink-0 pr-8 sm:pr-12" aria-hidden="true">
              {BRAND_VALUES_MARQUEE.map((item, idx) => (
                <span key={`val-2-${idx}`} className="flex items-center gap-2.5 sm:gap-3 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-blush shrink-0" />
                  <span className="text-canvas tracking-[0.2em]">{item}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6 w-full">
        <div className="text-center space-y-1.5 max-w-xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-widest text-rose">
            Curated Collections
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-ink font-normal">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            Explore our curated selection of everlasting florals, desk accents, and keepsake charms.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group relative block aspect-[3/4] rounded-2xl overflow-hidden bg-canvas border border-border-subtle shadow-subtle hover:border-primary/50 transition-all duration-300"
            >
              <Image
                src={cat.imageUrl}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />

              <div className="absolute inset-x-5 bottom-5 text-white space-y-1">
                <h3 className="font-serif text-xl sm:text-2xl font-semibold leading-tight">
                  {cat.name}
                </h3>
                <p className="text-xs text-white/80 line-clamp-1">{cat.tagline}</p>
                <span className="inline-flex items-center gap-1.5 text-xs text-blush pt-2 group-hover:translate-x-1 transition-transform">
                  <span>Explore category</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED COLLECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border-subtle pb-4">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-widest text-rose">
              Signature Works
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-ink font-normal">
              Featured Creations
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted">
              Hand-crocheted favorites cherished by gifting lovers across Vadodara.
            </p>
          </div>

          <Link href="/shop" className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <span>View All Creations</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl bg-surface border border-border-subtle/80 max-w-xl mx-auto space-y-3.5 shadow-subtle">
            <div className="w-12 h-12 rounded-full bg-blush/60 flex items-center justify-center mx-auto text-rose">
              <Flower2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-ink font-normal">
              New Creations in the Studio
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-md mx-auto">
              Our Vadodara artisan is actively looping fresh stitches. Need something bespoke? Message us on WhatsApp or request a custom order!
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/custom-orders">
                <Button variant="primary" size="sm">
                  <span>Customise a Bouquet</span>
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="sm">
                  <span>Contact Studio</span>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* 5. OUR STORY / FOUNDER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-surface rounded-3xl border border-border-subtle p-6 sm:p-8 lg:p-10 shadow-subtle">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden bg-canvas border border-border-subtle w-full">
              <Image
                src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop"
                alt="Bloomora handmade crafting studio in Vadodara"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div className="space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blush/40 text-xs font-semibold text-rose uppercase tracking-wider">
                <Heart className="w-3 h-3 fill-rose" />
                <span>Our Philosophy</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl text-ink font-normal leading-tight">
                Little details. <br />
                <span className="italic text-rose">Beautiful emotions.</span>
              </h2>

              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                Bloomora began with a simple belief: that a handmade gift carries warmth and feeling that mass-produced items can never replicate. In our Vadodara studio, we take the slow path — looping milk-cotton yarn stitch by stitch to create flowers that remain in full bloom for years.
              </p>

              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                Whether you are celebrating an anniversary, surprising a friend with a smiling desk flower, or gifting yourself a moment of calm, each creation is crafted with genuine patience and packed with care.
              </p>

              <div className="pt-2 flex justify-center lg:justify-start">
                <Link href="/about">
                  <Button variant="outline" size="sm">
                    <span>Read Our Full Story</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. OUR HAPPY FAMILY (Real Unboxings, Photos, Videos & Stories) */}
      <HappyFamilySection initialReviews={reviews} />

      {/* 7. THE ART OF HANDMADE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 w-full">
        <div className="text-center space-y-1.5 max-w-xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-widest text-rose">
            Craftsmanship
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-ink font-normal">
            The Art of Handmade
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            From yarn skein to your doorstep, every step is executed with precision and intention.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {PROCESS_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-surface rounded-2xl border border-border-subtle p-5 sm:p-6 space-y-2.5 shadow-subtle"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl font-bold text-blush-dark">
                    {step.number}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-blush/40 flex items-center justify-center text-rose">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-serif text-base font-semibold text-ink">{step.title}</h3>
                <p className="text-xs text-ink-muted leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. WHY EVERLASTING BLOOMS? (Editorial Comparison Matrix) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 w-full">
        <div className="text-center space-y-1.5 max-w-xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-widest text-rose">
            Thoughtful Gifting
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-ink font-normal">
            Why Handmade Flowers?
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            The enduring emotional difference between commercial cut flowers and Bloomora handcrafted keepsakes.
          </p>
        </div>

        <div className="bg-surface rounded-3xl border border-border-subtle p-6 sm:p-8 shadow-subtle overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 divide-y md:divide-y-0 md:divide-x divide-border-subtle/80">
            {/* Bloomora Column */}
            <div className="space-y-5 md:pr-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blush flex items-center justify-center text-rose shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-ink">Bloomora Handmade Blooms</h3>
                  <p className="text-xs text-rose font-medium">Endless Memories & Emotion</p>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-ink-muted">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose font-bold text-base leading-none">✓</span>
                  <div>
                    <strong className="text-ink font-semibold">Forever Lifespan:</strong> Hand-crocheted from milk-cotton yarn that never fades, withers, or sheds.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose font-bold text-base leading-none">✓</span>
                  <div>
                    <strong className="text-ink font-semibold">Zero Maintenance:</strong> Requires no water changes, pruning, or sunlight. Sits pretty on any desk.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose font-bold text-base leading-none">✓</span>
                  <div>
                    <strong className="text-ink font-semibold">100% Hypoallergenic:</strong> Completely pollen-free and pet-safe for sensitive recipients.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose font-bold text-base leading-none">✓</span>
                  <div>
                    <strong className="text-ink font-semibold">Slow Craftsmanship:</strong> 4–6 hours of patient needlework and heartfelt human energy in each piece.
                  </div>
                </li>
              </ul>
            </div>

            {/* Standard Fresh Cut Flowers Column */}
            <div className="space-y-5 pt-6 md:pt-0 md:pl-6 opacity-75">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-canvas flex items-center justify-center text-ink-muted shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-ink-muted">Standard Cut Flowers</h3>
                  <p className="text-xs text-ink-muted font-medium">Temporary & Disposable</p>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-ink-muted">
                <li className="flex items-start gap-2.5">
                  <span className="text-ink-muted font-bold text-base leading-none">✕</span>
                  <div>
                    <strong className="text-ink font-semibold">Withers in 3–5 Days:</strong> Petals drop, turn brown, and end up in the trash bin quickly.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-ink-muted font-bold text-base leading-none">✕</span>
                  <div>
                    <strong className="text-ink font-semibold">Daily Care Hassle:</strong> Stagnant water trimming and mess on table surfaces.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-ink-muted font-bold text-base leading-none">✕</span>
                  <div>
                    <strong className="text-ink font-semibold">Pollen & Allergens:</strong> Can trigger sneezing or allergic reactions indoors.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-ink-muted font-bold text-base leading-none">✕</span>
                  <div>
                    <strong className="text-ink font-semibold">Fast Commercial Waste:</strong> Mass commercial farming with heavy transit emissions.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CUSTOM ORDERS & COMMISSIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl bg-blush/30 border border-border-subtle p-6 sm:p-10 overflow-hidden">
          <div className="max-w-2xl space-y-4 text-center sm:text-left">
            <span className="text-xs uppercase font-bold tracking-widest text-rose">
              Bespoke Gifting
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-ink font-normal leading-tight">
              Have something special in mind?
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Tell us your idea, and let&apos;s create something meaningful together. We customize colors, bouquet sizes, flower combinations, and personalized tags.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <Link href="/custom-orders" className="w-full sm:w-auto">
                <Button variant="primary" size="md" className="w-full sm:w-auto">
                  <span>Create Your Custom Gift</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>

              <Link
                href={customWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button variant="outline" size="md" className="w-full sm:w-auto">
                  <MessageCircle className="w-4 h-4 mr-1.5 text-whatsapp fill-whatsapp" />
                  <span>Discuss on WhatsApp</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10. HOW TO ORDER (4-Step Responsive Guide) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 w-full">
        <div className="text-center space-y-1.5 max-w-xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-widest text-rose">
            Simple & Transparent
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-ink font-normal">
            How to Order
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            Easy guest checkout with WhatsApp assisted coordination.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {ORDER_STEPS.map((item) => (
            <div
              key={item.step}
              className="p-5 sm:p-6 rounded-2xl bg-surface border border-border-subtle space-y-2.5"
            >
              <div className="w-7 h-7 rounded-full bg-rose text-white flex items-center justify-center text-xs font-bold font-serif">
                {item.step}
              </div>
              <h3 className="font-serif text-base font-semibold text-ink">{item.title}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 11. INSTAGRAM / SOCIAL GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-5 w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-rose">
              Studio Moments
            </span>
            <h2 className="font-serif text-xl sm:text-3xl text-ink font-normal">
              Follow Our Journey @bloomora.creation
            </h2>
          </div>

          <Link
            href="https://instagram.com/bloomora.creation"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
              <Instagram className="w-4 h-4 text-rose" />
              <span>Follow on Instagram</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {INSTAGRAM_POSTS.map((post) => (
            <Link
              key={post.id}
              href="https://instagram.com/bloomora.creation"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square rounded-2xl overflow-hidden bg-canvas border border-border-subtle shadow-subtle"
            >
              <Image
                src={post.imageUrl}
                alt={post.caption}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-3 text-center">
                <Instagram className="w-6 h-6 text-white" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 12. FAQ ACCORDION */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 space-y-4 sm:space-y-5 w-full">
        <div className="text-center space-y-1.5">
          <span className="text-xs uppercase font-bold tracking-widest text-rose">
            Got Questions?
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-ink font-normal">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            Everything you need to know about our handcrafted blooms and Vadodara deliveries.
          </p>
        </div>

        <FAQAccordion items={FAQ_ITEMS} />
      </section>
    </div>
  );
}
