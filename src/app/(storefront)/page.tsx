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
import { getCategoriesAsync } from '@/lib/categories-store';
import { getSettingsAsync } from '@/lib/settings-store';
import { getReviewsAsync } from '@/lib/reviews-store';
import { HappyFamilySection } from '@/components/storefront/HappyFamilySection';
import { InteractiveGiftStudio } from '@/components/storefront/InteractiveGiftStudio';
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
      'Every petal, leaf, and stem is patiently crocheted stitch by stitch with delicate handwork.',
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

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How long do Bloomora handmade flowers last?',
    answer:
      'Forever! Unlike fresh-cut flowers that wither in days, our crochet blossoms are handcrafted from premium milk-cotton yarn that never fades, wilts, or requires water.',
  },
  {
    question: 'How are orders and custom gifts coordinated?',
    answer:
      'Once you submit your order or custom gift idea, our studio shares confirmation details and live progress updates with you directly on WhatsApp (+91 8271735190) before gift wrapping is sealed.',
  },
  {
    question: 'Can I request a custom color palette or flower type?',
    answer:
      'Absolutely! We love crafting bespoke commissions. Simply visit our Custom Orders page or message us directly on WhatsApp (+91 8271735190) with your ideas or reference photos.',
  },
  {
    question: 'What is your return and cancellation policy?',
    answer:
      'Because every piece is meticulously handmade, orders are strictly non-refundable once crafting begins. If any item arrives damaged, notify us on WhatsApp within 24 hours with photos for an immediate replacement.',
  },
  {
    question: 'What payment options do you support?',
    answer:
      'We support all UPI payment apps including Google Pay, PhonePe, Paytm, and BHIM. Once your order is created, you are redirected to WhatsApp with your itemized receipt to confirm payment.',
  },
];

const STUDIO_MOMENTS = [
  {
    id: 'sm-1',
    imageUrl: '/images/bloomora-hero-bouquet.jpg',
    caption: 'Lilac & pink handcrafted keepsake bouquet with wooden crochet hook.',
  },
  {
    id: 'sm-2',
    imageUrl: '/images/bloomora-hero-artisan-workbench.jpg',
    caption: 'Handmade crafting table stitch-by-stitch with soft milk-cotton yarn.',
  },
  {
    id: 'sm-3',
    imageUrl: '/images/bloomora-hero-handcrafted.jpg',
    caption: 'Handcrafted with Love — everlasting crochet floral creations.',
  },
  {
    id: 'sm-4',
    imageUrl: '/images/cat-customized-bouquet.jpg',
    caption: 'Customised blush bouquet prepared with satin ribbon and kraft wrapping.',
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
  const featured = allPublished.filter((p) => p.isFeatured);
  const featuredProducts = (featured.length > 0 ? featured : allPublished).slice(0, 8);

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
                      className={`object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
                        cat.slug === 'birthday-surprise-card' ? 'object-[50%_65%]' : 'object-center'
                      }`}
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

      {/* 4. FEATURED COLLECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border-subtle pb-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs uppercase font-bold tracking-widest text-rose">
              Signature Works
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-ink font-normal">
              Featured Creations
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted">
              Hand-crocheted favorites cherished by thoughtful gifting lovers everywhere.
            </p>
          </div>

          <Link href="/shop" className="w-full sm:w-auto sm:shrink-0">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <span>View All Creations</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div
            className={`flex overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-5 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:overflow-visible scrollbar-none ${
              featuredProducts.length <= 2
                ? 'sm:grid-cols-2 max-w-3xl mx-auto'
                : featuredProducts.length === 3
                  ? 'sm:grid-cols-2 lg:grid-cols-3'
                  : 'sm:grid-cols-2 lg:grid-cols-4'
            }`}
          >
            {featuredProducts.map((product) => (
              <div key={product.id} className="w-[250px] sm:w-auto shrink-0 sm:shrink snap-start flex">
                <div className="w-full">
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {[
              {
                title: 'Everlasting Pastel Bouquet',
                subtitle: 'Custom flowers, stems & ribbon palette',
                image: '/images/cat-customized-bouquet.jpg',
                imagePosition: 'object-center',
                href: '/custom-orders?category=customized-bouquet',
                cta: 'Customise Bouquet',
              },
              {
                title: 'Handmade Birthday Surprise Card',
                subtitle: 'Pop-up memory flaps & personal wishes',
                image: '/images/cat-birthday-surprise-card.jpg',
                imagePosition: 'object-[50%_65%]',
                href: '/custom-orders?category=birthday-surprise-card',
                cta: 'Design a Card',
              },
              {
                title: 'Your Idea → Handmade Reality',
                subtitle: 'Bring any concept and we craft it fresh',
                image: '/images/cat-personalized-gifts.jpg',
                imagePosition: 'object-center',
                href: '/custom-orders?category=customized-personalized-gifts',
                cta: 'Pitch Your Idea',
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group bg-surface rounded-2xl border border-border-subtle overflow-hidden shadow-subtle hover:shadow-craft hover:border-primary/40 transition-all flex sm:flex-col"
              >
                <div className="relative w-28 sm:w-full aspect-square sm:aspect-[4/3] shrink-0 overflow-hidden bg-canvas">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 112px, 33vw"
                    className={`object-cover group-hover:scale-105 transition-transform duration-500 ${item.imagePosition ?? 'object-center'}`}
                  />
                </div>
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose">
                      Made to Order
                    </span>
                    <h3 className="font-serif text-base sm:text-lg font-semibold text-ink leading-snug group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-ink-muted leading-relaxed">{item.subtitle}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary pt-1">
                    <span>{item.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 5. ATELIER PHILOSOPHY & INTERACTIVE GIFT IDEA FINDER */}
      <InteractiveGiftStudio />

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
                className="bg-surface rounded-2xl border border-border-subtle p-4 sm:p-6 space-y-2.5 shadow-subtle"
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 w-full">
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

        <div className="bg-surface rounded-3xl border border-border-subtle p-6 sm:p-8 lg:p-10 shadow-subtle overflow-hidden">
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
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
            <div className="max-w-2xl space-y-3 sm:space-y-4 text-center lg:text-left mx-auto lg:mx-0">
              <span className="text-xs uppercase font-bold tracking-widest text-rose">
                Bespoke Gifting
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-ink font-normal leading-tight">
                Have something special in mind?
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                Tell us your idea, and let&apos;s create something meaningful together. We customize colors, bouquet sizes, flower combinations, and personalized tags.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-3 shrink-0 w-full lg:w-auto">
              <Link href="/custom-orders" className="w-full sm:w-auto">
                <Button variant="primary" size="md" className="w-full sm:w-auto whitespace-nowrap">
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
                <Button variant="outline" size="md" className="w-full sm:w-auto whitespace-nowrap">
                  <MessageCircle className="w-4 h-4 mr-1.5 text-whatsapp fill-whatsapp" />
                  <span>Discuss on WhatsApp</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10. INTERACTIVE HOW TO ORDER STUDIO JOURNEY */}
      <InteractiveOrderJourney />

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
          {STUDIO_MOMENTS.map((post) => (
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
            Everything you need to know about our handcrafted blooms and custom orders.
          </p>
        </div>

        <FAQAccordion items={FAQ_ITEMS} />
      </section>
    </div>
  );
}
