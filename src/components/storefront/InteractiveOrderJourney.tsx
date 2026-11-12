'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Palette,
  Feather,
  Gift,
  ArrowRight,
  MessageCircle,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { buildWhatsAppLink } from '@/lib/whatsapp';

interface JourneyStep {
  step: string;
  tag: string;
  title: string;
  shortDesc: string;
  detailHeadline: string;
  detailBody: string;
  timingBadge: string;
  imageUrl: string;
  imageAlt: string;
  icon: React.ComponentType<{ className?: string }>;
}

const YARN_PALETTES = [
  { id: 'blush', name: 'Blush Rose', dot: '#D98A96', vibe: 'soft blush pink & cream tones' },
  { id: 'lavender', name: 'Lilac Mist', dot: '#9E82B8', vibe: 'pastel lavender & pearl ivory' },
  { id: 'sunflower', name: 'Sunbeam Gold', dot: '#E0A43B', vibe: 'warm golden sunflower & sage leaf' },
  { id: 'sage', name: 'Sage Meadow', dot: '#739175', vibe: 'earthy botanical sage & warm kraft' },
];

const NOTE_PRESETS = [
  'Made for someone special — forever in bloom.',
  'Happy Birthday! Keep smiling & blooming always.',
  'A little handmade hug woven just for you.',
];

const WRAP_STYLES = [
  {
    id: 'kraft-satin',
    name: 'Signature Kraft & Satin Bow',
    badge: 'Classic Look',
    desc: 'Crisp textured cream kraft wrap finished with a blush satin ribbon and braided jute twine.',
  },
  {
    id: 'pastel-tissue',
    name: 'Layered Pastel Korean Wrap',
    badge: 'Most Loved',
    desc: 'Delicate translucent floral sheets layered in rose and ivory for a full boutique reveal.',
  },
  {
    id: 'memory-box',
    name: 'Keepsake Studio Gift Box',
    badge: 'Gift Ready',
    desc: 'Cushioned presentation box with dried baby’s breath accents and your sealed wish card.',
  },
];

const JOURNEY_STEPS: JourneyStep[] = [
  {
    step: '01',
    tag: 'Browse or Dream',
    title: 'Explore the Collection',
    shortDesc: 'Pick from 60 handcrafted pieces across 6 categories or spark an original gift idea.',
    detailHeadline: 'Start with a studio favourite or a blank canvas.',
    detailBody:
      'Choose a ready-made keychain charm, forever bouquet, birthday surprise card, or seasonal craft from our curated catalog—or jump straight to custom commissions.',
    timingBadge: '60+ curated pieces ready',
    imageUrl: '/images/cat-handmade-keychain.jpg',
    imageAlt: 'Handcrafted strawberry, daisy, and heart crochet keychains arranged on natural linen',
    icon: Sparkles,
  },
  {
    step: '02',
    tag: 'Co-Create With Us',
    title: 'Your Idea, Our Creativity',
    shortDesc: 'Pick your yarn palette & flower style—our studio sketches and hand-crochets it.',
    detailHeadline: 'Choose the yarn tones that match their personality.',
    detailBody:
      'Tap a palette below to preview your custom mood board. We coordinate stitch proportions, wrapping style, and satin ribbons personally with you.',
    timingBadge: 'Crafted in 1–3 days',
    imageUrl: '/images/bloomora-hero-artisan-workbench.jpg',
    imageAlt: 'Bloomora crochet workbench with milk-cotton yarns, crochet tools, and custom bouquet',
    icon: Palette,
  },
  {
    step: '03',
    tag: 'Wax Seal & Note',
    title: 'Add Personal Touches',
    shortDesc: 'Write a keepsake message—we pen it by hand and seal it on thick cotton cardstock.',
    detailHeadline: 'Preview your handwritten calligraphy tag live.',
    detailBody:
      'Every Bloomora gift carries a complimentary handwritten kraft note sealed with wax and jute twine. Type your wish below to see how it looks on the card.',
    timingBadge: 'Complimentary wax seal note',
    imageUrl: '/images/cat-birthday-surprise-card.jpg',
    imageAlt: 'Handmade cotton cardstock birthday greeting note with crimson wax seal and gold border',
    icon: Feather,
  },
  {
    step: '04',
    tag: 'Wrap & Confirm',
    title: 'Wrapped With Love',
    shortDesc: 'Choose your gift finish, preview photos on WhatsApp, and confirm easily via UPI.',
    detailHeadline: 'Choose your finishing presentation & preview before it leaves.',
    detailBody:
      'Pick how you want your creation presented below. We share real progress photos directly on WhatsApp so every petal, ribbon, and wish card feels just right.',
    timingBadge: 'Photo preview on WhatsApp',
    imageUrl: '/images/cat-personalized-gifts.jpg',
    imageAlt: 'Bloomora handcrafted kraft-wrapped gift keepsake tied with ribbon and card',
    icon: Gift,
  },
];

export function InteractiveOrderJourney() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedPalette, setSelectedPalette] = useState(YARN_PALETTES[0]);
  const [giftNote, setGiftNote] = useState(NOTE_PRESETS[0]);
  const [selectedWrap, setSelectedWrap] = useState(WRAP_STYLES[0]);

  const activeStep = JOURNEY_STEPS[activeIndex];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 w-full">
      {/* Section Header */}
      <div className="text-center space-y-1.5 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-rose">
          <Heart className="w-3.5 h-3.5 fill-rose/20" />
          <span>From Yarn Sketch to Unboxing</span>
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl text-ink font-normal">
          How Your Gift Comes to Life
        </h2>
        <p className="text-xs sm:text-sm text-ink-muted">
          Tap each stage to pick yarn tones, preview your handwritten tag live, or choose gift wrapping.
        </p>
      </div>

      {/* Tactile 4-Step Connected Studio Ribbon */}
      <div className="relative">
        {/* Desktop stitched yarn thread connector */}
        <div
          aria-hidden="true"
          className="hidden lg:block absolute top-8 left-[12%] right-[12%] border-t-2 border-dashed border-rose/30 pointer-events-none"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative z-10">
          {JOURNEY_STEPS.map((item, idx) => {
            const Icon = item.icon;
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.step}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-pressed={isActive}
                className={`group text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-3 cursor-pointer ${
                  isActive
                    ? 'bg-surface border-primary shadow-craft -translate-y-0.5 ring-2 ring-primary/15'
                    : 'bg-surface/80 border-border-subtle hover:border-rose/40 hover:bg-surface'
                }`}
              >
                <div className="flex items-center justify-between gap-2 w-full">
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'bg-blush/50 text-rose group-hover:bg-blush'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{item.step}</span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted hidden sm:inline">
                    {item.tag}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3
                    className={`font-serif text-sm sm:text-base font-semibold leading-snug transition-colors ${
                      isActive ? 'text-primary' : 'text-ink'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-ink-muted leading-relaxed line-clamp-3">
                    {item.shortDesc}
                  </p>
                </div>

                <div
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold transition-colors ${
                    isActive ? 'text-rose' : 'text-ink-muted group-hover:text-rose'
                  }`}
                >
                  <span>{isActive ? 'Active Step' : 'Try Interactive Preview'}</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Interactive Studio Workbench Stage */}
      <div className="bg-surface rounded-3xl border border-border-subtle shadow-craft overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-12 items-stretch"
          >
            {/* Left Interactive Studio Panel (7 cols) */}
            <div className="lg:col-span-7 p-5 sm:p-8 flex flex-col justify-between gap-5">
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] uppercase font-bold tracking-widest text-rose">
                    Step {activeStep.step} · {activeStep.tag}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-canvas border border-border-subtle text-ink-muted">
                    {activeStep.timingBadge}
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-ink font-normal">
                  {activeStep.detailHeadline}
                </h3>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-xl">
                  {activeStep.detailBody}
                </p>
              </div>

              {/* Dynamic Per-Step Interactive Playground */}
              {activeIndex === 0 && (
                <div className="bg-canvas rounded-2xl border border-border-subtle p-4 space-y-3">
                  <p className="text-[11px] uppercase font-bold tracking-wider text-ink-muted">
                    Jump Straight Into a Category
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Handmade Keychains', href: '/shop?category=handmade-keychain' },
                      { label: 'Customized Bouquets', href: '/shop?category=customized-bouquet' },
                      { label: 'Handmade Flowers', href: '/shop?category=handmade-flower' },
                      { label: 'Birthday Surprise Cards', href: '/shop?category=birthday-surprise-card' },
                      { label: 'Seasonal Crafts', href: '/shop?category=seasonable-handmade-products' },
                    ].map((pill) => (
                      <Link
                        key={pill.href}
                        href={pill.href}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-surface border border-border-subtle hover:border-primary hover:text-primary transition-colors"
                      >
                        {pill.label} →
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {activeIndex === 1 && (
                <div className="bg-canvas rounded-2xl border border-border-subtle p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] uppercase font-bold tracking-wider text-ink-muted">
                      Select a Studio Yarn Palette
                    </p>
                    <span className="text-xs font-semibold text-primary">{selectedPalette.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {YARN_PALETTES.map((palette) => {
                      const active = palette.id === selectedPalette.id;
                      return (
                        <button
                          key={palette.id}
                          type="button"
                          onClick={() => setSelectedPalette(palette)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                            active
                              ? 'bg-surface border-primary text-ink shadow-xs'
                              : 'bg-surface/60 border-border-subtle text-ink-muted hover:text-ink'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: palette.dot }}
                          />
                          <span>{palette.name}</span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-ink-muted">
                    Preview direction: crafted in <strong className="text-ink">{selectedPalette.vibe}</strong>, wrapped with signature jute twine.
                  </p>
                </div>
              )}

              {activeIndex === 2 && (
                <div className="bg-canvas rounded-2xl border border-border-subtle p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label
                      htmlFor="studio-gift-note-preview"
                      className="text-[11px] uppercase font-bold tracking-wider text-ink-muted"
                    >
                      Live Kraft Card Preview
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {NOTE_PRESETS.map((preset, i) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setGiftNote(preset)}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-border-subtle text-ink-muted hover:text-primary transition-colors cursor-pointer"
                        >
                          Idea #{i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    id="studio-gift-note-preview"
                    type="text"
                    maxLength={110}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="Write a personal note for your recipient..."
                    className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  {/* Live Studio Kraft Tag Visual */}
                  <div className="relative rounded-xl bg-[#EDE0CF] border border-[#D4BEA3] p-4 flex items-center justify-between gap-4 shadow-inner">
                    <div className="space-y-1 min-w-0">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#7A5C4D] font-semibold">
                        Bloomora Handwritten Tag
                      </p>
                      <p className="font-serif italic text-sm sm:text-base text-[#3D2920] break-words">
                        &ldquo;{giftNote.trim() || 'With warmest wishes, handcrafted for you.'}&rdquo;
                      </p>
                    </div>
                    <div
                      aria-hidden="true"
                      className="w-10 h-10 rounded-full bg-primary text-[#FAF3ED] flex items-center justify-center font-serif italic font-bold text-sm shrink-0 shadow-sm ring-2 ring-white/40"
                    >
                      B
                    </div>
                  </div>
                </div>
              )}

              {activeIndex === 3 && (
                <div className="bg-canvas rounded-2xl border border-border-subtle p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[11px] uppercase font-bold tracking-wider text-ink-muted">
                      Choose Signature Gift Wrapping
                    </p>
                    <span className="text-xs font-semibold text-primary">{selectedWrap.badge}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {WRAP_STYLES.map((wrap) => {
                      const active = wrap.id === selectedWrap.id;
                      return (
                        <button
                          key={wrap.id}
                          type="button"
                          onClick={() => setSelectedWrap(wrap)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                            active
                              ? 'bg-primary text-white border-primary shadow-xs'
                              : 'bg-surface border-border-subtle text-ink-muted hover:text-ink'
                          }`}
                        >
                          {wrap.name}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    <strong className="text-ink">{selectedWrap.name}:</strong> {selectedWrap.desc}
                  </p>
                </div>
              )}

              {/* Bottom Step Controls & Primary CTA */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  {activeIndex === 1 ? (
                    <Link
                      href={`/custom-orders?idea=${encodeURIComponent(`I would love a custom gift crafted in ${selectedPalette.vibe}.`)}`}
                    >
                      <Button variant="primary" size="sm">
                        <span>Start With {selectedPalette.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </Link>
                  ) : activeIndex === 2 ? (
                    <a
                      href={buildWhatsAppLink({
                        message: `Hi Bloomora! 🌸\nI'd love this handwritten gift note sealed with my order:\n"${giftNote.trim() || 'Made with love, just for you!'}"`,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="primary" size="sm">
                        <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                        <span>Send Note to Studio</span>
                      </Button>
                    </a>
                  ) : activeIndex === 3 ? (
                    <a
                      href={buildWhatsAppLink({
                        message: `Hi Bloomora! 🌸\nI'd love to coordinate an order finished with "${selectedWrap.name}".`,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="primary" size="sm">
                        <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                        <span>Confirm Style on WhatsApp</span>
                      </Button>
                    </a>
                  ) : (
                    <Link href="/shop">
                      <Button variant="primary" size="sm">
                        <span>Explore All 60 Creations</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </Link>
                  )}

                  <Link href="/custom-orders" className="text-xs font-semibold text-rose hover:underline px-2">
                    Custom Commission →
                  </Link>
                </div>

                {/* Step Next / Prev Micro-Pager */}
                <div className="flex items-center gap-1.5">
                  {JOURNEY_STEPS.map((s, idx) => (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`Jump to step ${s.step}: ${s.title}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === activeIndex ? 'w-6 bg-primary' : 'w-2 bg-border-subtle hover:bg-rose/40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Framed Studio Photography Column (5 cols) */}
            <div className="lg:col-span-5 relative min-h-[240px] sm:min-h-[300px] lg:min-h-full bg-canvas border-t lg:border-t-0 lg:border-l border-border-subtle overflow-hidden">
              <Image
                src={activeStep.imageUrl}
                alt={activeStep.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-ink/75 via-ink/25 to-transparent text-white">
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#F4D9DD]">
                  Bloomora Studio · Step {activeStep.step}
                </p>
                <p className="font-serif text-sm sm:text-base">{activeStep.title}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
