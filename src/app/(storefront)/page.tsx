import React from 'react';
import Link from 'next/link';
import Image, { getImageProps } from 'next/image';
import {
  Sparkles,
  Heart,
  ArrowRight,
  MessageCircle,
  Truck,
  Flower2,
  Instagram,
  Package,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FAQAccordion, FAQItem } from '@/components/storefront/FAQAccordion';
import { DEFAULT_WHATSAPP_NUMBER, getCustomOrderInquiryLink } from '@/lib/whatsapp';
import { getProductsAsync } from '@/lib/products-store';
import { getCategoriesAsync } from '@/lib/categories-store';
import { getSettingsAsync } from '@/lib/settings-store';
import { getReviewsAsync } from '@/lib/reviews-store';
import { HappyFamilySection } from '@/components/storefront/HappyFamilySection';
import { ShoppableCatalogShelf } from '@/components/storefront/ShoppableCatalogShelf';
import { InteractiveOrderJourney } from '@/components/storefront/InteractiveOrderJourney';

export const dynamic = 'force-dynamic';

const BRAND_VALUES_MARQUEE = [
  'Made with Love',
  'Thoughtfully Handmade',
  'Unique Creations',
  'Personalised Gifting',
  'Crafted with Care',
  '100% Slow Crochet',
  'Handcrafted Keepsakes',
  'Everlasting Memories',
];


const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How long do handmade crochet flowers last?',
    answer:
      'Forever—crafted from soft milk-cotton yarn that never wilts, fades, or needs water.',
  },
  {
    question: 'How are orders & custom ideas coordinated?',
    answer:
      'We share photos and updates directly with you on WhatsApp (+91 8271735190) before gift wrapping.',
  },
  {
    question: 'Can I request custom colors, flowers, or ideas?',
    answer:
      'Yes! Share any reference photo or idea on Custom Orders or WhatsApp and we crochet it fresh.',
  },
  {
    question: 'What is your return & replacement policy?',
    answer:
      'Custom pieces are non-refundable once crafting starts, with free replacement if damaged in transit.',
  },
  {
    question: 'Which UPI payment apps are supported?',
    answer:
      'Google Pay, PhonePe, Paytm, and BHIM are supported via WhatsApp order confirmation.',
  },
];

const STUDIO_MOMENTS = [
  {
    id: 'sm-1',
    imageUrl: '/images/cat-personalized-gifts.jpg',
    label: 'Keepsake Hampers',
    caption: 'Bespoke gift hamper box tied with blush satin ribbon and crochet heart.',
  },
  {
    id: 'sm-2',
    imageUrl: '/images/cat-handmade-flower.jpg',
    label: 'Potted Blooms',
    caption: 'Handcrafted sunflower in terracotta pot and blush tulip basket.',
  },
  {
    id: 'sm-3',
    imageUrl: '/images/cat-birthday-surprise-card.jpg',
    label: 'Pop-Up Cards',
    caption: 'Deckle-edge cotton birthday card with 3D crochet daisies and wax-seal envelope.',
  },
  {
    id: 'sm-4',
    imageUrl: '/images/cat-handmade-keychain.jpg',
    label: 'Bag Charms',
    caption: 'Strawberry, daisy, and lilac heart crochet keychains on natural linen.',
  },
];

export default async function HomePage() {
  const customWhatsAppUrl = getCustomOrderInquiryLink();
  const [settings, allPublished, reviews, categories] = await Promise.all([
    getSettingsAsync(),
    getProductsAsync(true),
    getReviewsAsync(true),
    getCategoriesAsync(true),
  ]);

  // Art-directed responsive hero banner: 16:9 full-width landscape on desktop/Windows, 9:16 tall portrait on mobile
  const heroCommonProps = {
    alt: 'Bloomora Handcrafted Crochet Bouquets & Memory Keepsake Scrapbooks',
    sizes: '100vw',
    priority: true,
  };
  const {
    props: { src: desktopHeroSrc, srcSet: desktopHeroSrcSet },
  } = getImageProps({
    ...heroCommonProps,
    src: '/images/bloomora-hero-desktop.jpg',
    width: 1024,
    height: 576,
  });
  const {
    props: { srcSet: mobileHeroSrcSet, ...mobileHeroRest },
  } = getImageProps({
    ...heroCommonProps,
    src: '/images/bloomora-hero-mobile.jpg',
    width: 576,
    height: 1024,
  });

  return (
    <div className="space-y-5 sm:space-y-7 lg:space-y-8 pb-8 w-full max-w-full overflow-x-clip">
      {/* 1. EDITORIAL HERO SECTION (Full-Width 16:9 Desktop Landscape / Tall 9:16 Mobile Portrait) */}
      <section className="relative w-full overflow-hidden bg-[#1B1013]">
        {/* Full-bleed Art-Directed Banner Container (Starts behind transparent homepage header) */}
        <div className="relative w-full aspect-[9/16] md:aspect-auto md:h-[min(56.25vw,100vh)] md:min-h-[520px] md:max-h-[860px] overflow-hidden">
          <picture className="absolute inset-0 block w-full h-full">
            <source
              media="(min-width: 768px)"
              srcSet={desktopHeroSrcSet ?? desktopHeroSrc}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              {...mobileHeroRest}
              srcSet={mobileHeroSrcSet ?? mobileHeroRest.src}
              alt={heroCommonProps.alt}
              className="absolute inset-0 w-full h-full object-cover object-center block select-none"
            />
          </picture>

          {/* Subtle top vignette protecting white transparent header navigation & logo */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 md:h-36 bg-gradient-to-b from-[#180E10]/65 via-[#180E10]/28 to-transparent" />

          {/* Mobile bottom scrim (keeps bottom-anchored portrait text legible) */}
          <div className="pointer-events-none md:hidden absolute inset-x-0 bottom-0 h-[56%] bg-gradient-to-t from-[#180E10]/95 via-[#180E10]/65 via-45% to-transparent" />

          {/* Desktop subtle atmospheric wall halo (balanced in sunlit cavity between marigold & tulip wrap) */}
          <div className="pointer-events-none hidden md:block absolute top-[8%] left-[46.5%] -translate-x-1/2 w-[520px] h-[270px] bg-[radial-gradient(ellipse_at_center,rgba(24,14,16,0.46)_0%,rgba(24,14,16,0.18)_54%,transparent_78%)]" />
          <div className="pointer-events-none hidden md:block absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#180E10]/30 to-transparent" />

          {/* Overlay Editorial Narrative & CTAs — Centered Bottom on Mobile 9:16, Sunlit Upper-Center Cavity on Desktop 16:9 */}
          <div className="absolute inset-x-0 bottom-0 md:bottom-auto md:top-[17%] lg:top-[14%] xl:top-[13.5%] md:inset-x-auto md:left-[46.5%] md:-translate-x-1/2 z-10 pb-5 md:pb-0 pt-16 md:pt-0 w-full md:w-[88%] md:max-w-[390px] lg:max-w-[430px] px-4 sm:px-6 md:px-0">
            <div className="space-y-2.5 text-center">
              <div className="w-9 sm:w-10 h-[1.5px] bg-[#E8B4BE]/90 rounded-full mx-auto" />

              <h1 className="font-serif text-[2rem] sm:text-4xl md:text-[2.1rem] lg:text-[2.6rem] xl:text-[2.95rem] text-white font-normal tracking-tight leading-[1.06] drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
                Little details. <br />
                <span className="italic font-light text-[#FCE3E8]">
                  Beautiful emotions.
                </span>
              </h1>
              {/* Side-by-Side CTAs */}
              <div className="grid grid-cols-2 sm:flex sm:flex-row items-center justify-center gap-2.5 pt-1 w-full md:w-auto">
                <Link href="/shop" className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full sm:w-auto h-10 md:h-11 px-3 md:px-4 lg:px-5 text-xs sm:text-[13px] whitespace-nowrap shadow-craft-elevated border border-white/20"
                  >
                    <span className="md:hidden">Explore Shop</span>
                    <span className="hidden md:inline">Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 shrink-0" />
                  </Button>
                </Link>

                <Link href="/custom-orders" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full sm:w-auto h-10 md:h-11 px-3 md:px-4 lg:px-5 text-xs sm:text-[13px] whitespace-nowrap bg-[#180E10]/35 hover:bg-[#180E10]/55 backdrop-blur-md text-white border-white/45 hover:border-white/80 transition-all"
                  >
                    <span className="md:hidden">Custom Gift</span>
                    <span className="hidden md:inline">Customise Gift</span>
                  </Button>
                </Link>
              </div>

              {/* Compact Inline Social Proof */}
              <div className="flex items-center justify-center gap-2 pt-0.5 text-[11px] text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.45)]">
                <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 fill-current" />
                  ))}
                </div>
                <span>
                  <strong className="text-white font-semibold">500+ handcrafted gifts</strong> loved forever
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Seamless Boutique Promise Strip Bridging Hero to Marquee */}
        <div className="bg-surface border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 divide-x divide-border-subtle/70 py-3 sm:py-4 text-center">
              <div className="px-2">
                <p className="font-serif text-base sm:text-xl font-bold text-ink">100%</p>
                <p className="text-[9px] sm:text-[11px] uppercase tracking-wider text-ink-muted mt-0.5">
                  Slow Crochet
                </p>
              </div>
              <div className="px-2">
                <p className="font-serif text-base sm:text-xl font-bold text-rose">Forever</p>
                <p className="text-[9px] sm:text-[11px] uppercase tracking-wider text-ink-muted mt-0.5">
                  Never Withers
                </p>
              </div>
              <div className="px-2">
                <p className="font-serif text-base sm:text-xl font-bold text-ink">Bespoke</p>
                <p className="text-[9px] sm:text-[11px] uppercase tracking-wider text-ink-muted mt-0.5">
                  Made to Order
                </p>
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

      {/* 3. SHOP BY CATEGORY (Style 2 – Modern Card Grid) */}
      <section className="relative w-full !mt-0 py-6 sm:py-8 bg-gradient-to-b from-blush/25 via-[#FAF4F1] to-canvas border-b border-primary/10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(232,193,197,0.22),_transparent_65%)]"
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
          {/* Header with delicate heart divider */}
          <div className="text-center space-y-2.5 max-w-xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] text-ink font-semibold tracking-tight leading-tight">
              Shop by Category
            </h2>
            <div className="flex items-center justify-center gap-3 py-0.5" aria-hidden="true">
              <span className="h-px w-16 sm:w-24 bg-primary/25" />
              <Heart className="w-3.5 h-3.5 text-primary/75" />
              <span className="h-px w-16 sm:w-24 bg-primary/25" />
            </div>
            <p className="text-xs sm:text-sm text-ink-muted">
              Find what you&apos;re looking for
            </p>
          </div>

          {/* 3x2 Modern Horizontal Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group relative flex items-center gap-4 sm:gap-5 p-3 sm:p-3.5 rounded-2xl bg-white/95 border border-[#EADCD9]/90 shadow-[0_8px_24px_-8px_rgba(74,40,46,0.08)] hover:shadow-[0_16px_36px_-10px_rgba(168,82,97,0.18)] hover:border-primary/35 hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Left Studio Product Image */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-[#FAF0F1] to-[#F6EFE9] ring-1 ring-black/[0.04]">
                  {cat.imageUrl ? (
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 96px, 112px"
                      className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-rose/70">
                      <Flower2 className="w-7 h-7" />
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5" />
                </div>

                {/* Right Category Title & Arrow */}
                <div className="flex-1 min-w-0 pr-1.5 flex flex-col justify-center space-y-1.5">
                  <h3 className="font-sans text-[15px] sm:text-base font-semibold text-ink leading-snug group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  {cat.slug === 'customized-personalized-gifts' && (
                    <p className="text-[11px] font-medium text-rose/90 leading-snug">
                      Your idea, our creativity
                    </p>
                  )}
                  <div className="pt-0.5 inline-flex items-center gap-1.5 text-primary/75 group-hover:text-primary transition-colors">
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SHOPPABLE CATEGORY SHELF (Mobile App 2-Column Filterable Grid) */}
      <ShoppableCatalogShelf products={allPublished} categories={categories} />

      {/* 5. APP PROMO BANNERS (Flush Equal-Height Split Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
          <Link
            href="/shop?category=handmade-keychain"
            className="group relative h-44 sm:h-56 rounded-2xl overflow-hidden border border-border-subtle shadow-subtle block"
          >
            <Image
              src="/images/cat-handmade-keychain.jpg"
              alt="Handmade crochet bag charms and keychains"
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#2A181B]/80 via-[#2A181B]/45 to-transparent" />
            <div className="relative h-full p-5 sm:p-6 flex flex-col justify-between text-white max-w-[75%]">
              <span className="inline-block w-fit px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[10px] font-bold uppercase tracking-widest">
                Starting ₹149
              </span>
              <div className="space-y-2">
                <h3 className="font-serif text-xl sm:text-2xl font-normal leading-tight">
                  Cute Pocket Charms
                </h3>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FAD7DC]">
                  <span>Shop Keychains</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>

          <Link
            href="/custom-orders"
            className="group relative h-44 sm:h-56 rounded-2xl overflow-hidden border border-border-subtle shadow-subtle block"
          >
            <Image
              src="/images/cat-personalized-gifts.jpg"
              alt="Custom handmade keepsake gift box"
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#2A181B]/80 via-[#2A181B]/45 to-transparent" />
            <div className="relative h-full p-5 sm:p-6 flex flex-col justify-between text-white max-w-[75%]">
              <span className="inline-block w-fit px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[10px] font-bold uppercase tracking-widest">
                Your Idea • Our Craft
              </span>
              <div className="space-y-2">
                <h3 className="font-serif text-xl sm:text-2xl font-normal leading-tight">
                  Customise Any Gift
                </h3>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FAD7DC]">
                  <span>Start Custom Order</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 6. SHOP BY OCCASION (Straight 2x2 Mobile / 4x1 Desktop Visual Strip) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 w-full">
        <div className="flex items-end justify-between gap-3">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-widest text-rose">
              Curated Edits
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal leading-tight">
              Shop by Occasion
            </h2>
          </div>
          <Link
            href="/custom-orders"
            className="text-xs sm:text-sm font-semibold text-primary hover:underline shrink-0"
          >
            Custom Ideas →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {[
            {
              title: 'Birthday Cards',
              tag: 'Pop-Up Memories',
              image: '/images/cat-birthday-surprise-card.jpg',
              href: '/shop?category=birthday-surprise-card',
            },
            {
              title: 'Love & Anniversaries',
              tag: 'Forever Bouquets',
              image: '/images/cat-customized-bouquet.jpg',
              href: '/shop?category=customized-bouquet',
            },
            {
              title: 'Desk & Cheer Up',
              tag: 'Potted Blooms',
              image: '/images/cat-handmade-flower.jpg',
              href: '/shop?category=handmade-flower',
            },
            {
              title: 'Festive & Seasonal',
              tag: 'Decor & Hampers',
              image: '/images/cat-seasonable-handmade.jpg',
              href: '/shop?category=seasonable-handmade-products',
            },
          ].map((occ) => (
            <Link
              key={occ.title}
              href={occ.href}
              className="group relative block aspect-[3/4] rounded-2xl overflow-hidden border border-border-subtle shadow-subtle bg-canvas"
            >
              <Image
                src={occ.image}
                alt={occ.title}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#1E1214]/85 via-[#1E1214]/35 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#FAD7DC]">
                  {occ.tag}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-serif text-sm sm:text-base font-medium leading-tight">
                    {occ.title}
                  </h3>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. COMPACT 3-TAB CUSTOM STUDIO */}
      <InteractiveOrderJourney />

      {/* 8. WHY HANDMADE BLOOMS (Straight Aligned Split Strip — Zero Stagger) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-surface rounded-2xl border border-border-subtle p-4 sm:p-7 shadow-subtle">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
            {/* Straight Flush 2-Photo Pair */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-2.5 sm:gap-3">
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-canvas border border-border-subtle">
                <Image
                  src="/images/cat-handmade-flower.jpg"
                  alt="Everlasting crochet sunflower and blush tulip pots"
                  fill
                  sizes="(max-width: 1024px) 45vw, 20vw"
                  className="object-cover object-center"
                />
              </div>
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-canvas border border-border-subtle">
                <Image
                  src="/images/cat-customized-bouquet.jpg"
                  alt="Handmade pastel rose and tulip bouquet"
                  fill
                  sizes="(max-width: 1024px) 45vw, 20vw"
                  className="object-cover object-center"
                />
              </div>
            </div>

            {/* Aligned Highlights & Direct Action */}
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] uppercase font-bold tracking-widest text-rose">
                  Why Crochet Blooms
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal leading-tight">
                  Beauty that stays, <span className="italic text-rose">never fades.</span>
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { title: 'Lasts Forever', hint: 'Never wilts or fades' },
                  { title: 'Zero Watering', hint: 'No daily care needed' },
                  { title: 'Allergy & Pet Safe', hint: '100% milk-cotton yarn' },
                  { title: 'Made to Order', hint: 'Any palette or wish' },
                ].map((perk) => (
                  <div
                    key={perk.title}
                    className="rounded-xl bg-canvas border border-border-subtle/80 p-3 space-y-0.5"
                  >
                    <p className="font-serif text-sm font-semibold text-ink">
                      <span className="text-rose mr-1">✓</span>
                      {perk.title}
                    </p>
                    <p className="text-[11px] text-ink-muted">{perk.hint}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <Link href="/custom-orders">
                  <Button variant="primary" size="sm">
                    <span>Create Custom Gift</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
                <Link
                  href={customWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-3.5 h-3.5 mr-1.5 text-whatsapp fill-whatsapp" />
                    <span>WhatsApp Studio</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. OUR HAPPY FAMILY (Compact Review Strip or Cards) */}
      <HappyFamilySection initialReviews={reviews} />

      {/* 10. STUDIO GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 w-full">
        <div className="flex items-end justify-between gap-3">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-widest text-rose">
              Visual Lookbook
            </span>
            <h2 className="font-serif text-xl sm:text-3xl text-ink font-normal leading-tight">
              @bloomora.creation
            </h2>
          </div>

          <Link
            href="https://instagram.com/bloomora.creation"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button variant="outline" size="sm" className="gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-rose" />
              <span>Follow</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          {STUDIO_MOMENTS.map((post) => (
            <Link
              key={post.id}
              href="https://instagram.com/bloomora.creation"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-[4/5] rounded-2xl overflow-hidden bg-canvas border border-border-subtle shadow-subtle"
            >
              <Image
                src={post.imageUrl}
                alt={post.caption}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                <span className="text-xs font-semibold tracking-wide">{post.label}</span>
                <Instagram className="w-4 h-4 opacity-85 group-hover:scale-110 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 11. FAQ ACCORDION */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 space-y-4 sm:space-y-5 w-full">
        <div className="text-center space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-rose">
            Quick Answers
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-ink font-normal">
            Frequently Asked Questions
          </h2>
        </div>

        <FAQAccordion items={FAQ_ITEMS} />
      </section>
    </div>
  );
}
