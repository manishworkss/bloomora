'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ArrowRight,
  Heart,
  Cake,
  Flower2,
  KeyRound,
  Lightbulb,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface GiftMoodOption {
  id: string;
  chipLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  matchEyebrow: string;
  recommendationTitle: string;
  recommendationPitch: string;
  categorySlug: string;
  categoryName: string;
  previewImage: string;
  craftHighlight: string;
  prefillIdea: string;
}

const GIFT_MOODS: GiftMoodOption[] = [
  {
    id: 'birthday',
    chipLabel: 'Birthday Surprise',
    icon: Cake,
    matchEyebrow: 'Best Match • Birthday Keepsake',
    recommendationTitle: 'Multi-Layer Birthday Surprise Card + Mini Charm',
    recommendationPitch:
      'Hand-folded photo pockets, pop-up flaps written with your inside jokes, and a stitched keychain tucked inside the envelope.',
    categorySlug: 'birthday-surprise-card',
    categoryName: 'Birthday Surprise Card',
    previewImage: '/images/cat-birthday-surprise-card.jpg',
    craftHighlight: 'Photo flaps + handwritten wishes',
    prefillIdea:
      'I am planning a Birthday Surprise Card! Favorite colors, number of photo memories, and the vibe I want: ',
  },
  {
    id: 'anniversary',
    chipLabel: 'Anniversary / Love',
    icon: Heart,
    matchEyebrow: 'Best Match • Forever Romance',
    recommendationTitle: 'Customized Everlasting Tulip & Rose Bouquet',
    recommendationPitch:
      'Pick their signature color palette, stem count, Korean wrap, and satin ribbon — a bouquet that blooms on their bedside for years.',
    categorySlug: 'customized-bouquet',
    categoryName: 'Customized Bouquet',
    previewImage: '/images/cat-customized-bouquet.jpg',
    craftHighlight: 'Never withers • Custom palette',
    prefillIdea:
      'I want a Customized Bouquet for a special anniversary/romantic occasion! Preferred flowers, colors, and ribbon style: ',
  },
  {
    id: 'desk',
    chipLabel: 'Cheer Up / Desk',
    icon: Flower2,
    matchEyebrow: 'Best Match • Warm Daily Smile',
    recommendationTitle: 'Crochet Sunflower & Daisy Desk Flower Pot',
    recommendationPitch:
      'Sunlight on a study table or office desk — handmade golden petals in a woven yarn pot that need zero watering or upkeep.',
    categorySlug: 'handmade-flower',
    categoryName: 'Handmade Flower',
    previewImage: '/images/cat-handmade-flower.jpg',
    craftHighlight: 'Hypoallergenic • Desk-ready',
    prefillIdea:
      'I would love a handmade crochet flower/desk pot to brighten someone’s workspace! Preferred blooms and colors: ',
  },
  {
    id: 'keychain',
    chipLabel: 'Cute Everyday Gift',
    icon: KeyRound,
    matchEyebrow: 'Best Match • Pocket Keepsake',
    recommendationTitle: 'Handmade Strawberry, Daisy or Initial Keychain',
    recommendationPitch:
      'Tactile milk-cotton charms clipped to antique brass clasps — a thoughtful everyday reminder on tote bags, scooters, or keys.',
    categorySlug: 'handmade-keychain',
    categoryName: 'Handmade Keychain',
    previewImage: '/images/cat-handmade-keychain.jpg',
    craftHighlight: 'Matching sets & initials available',
    prefillIdea:
      'I want handmade crochet keychains! Favorite charm motifs (strawberry, daisy, heart, initials) and colors: ',
  },
  {
    id: 'custom-idea',
    chipLabel: 'I Have My Own Idea',
    icon: Lightbulb,
    matchEyebrow: 'Your Idea • Our Creativity',
    recommendationTitle: '100% Bespoke Creation Built From Your Thought',
    recommendationPitch:
      'Have a sketch, seasonal festival decor dream, or unique personalized gift concept? Share your rough idea and we bring the craft.',
    categorySlug: 'customized-personalized-gifts',
    categoryName: 'Personalized Gifts',
    previewImage: '/images/cat-personalized-gifts.jpg',
    craftHighlight: 'Sketch / theme to finished art',
    prefillIdea:
      'Here is my custom handmade gift idea! Tell us who it is for, your theme/inspiration, and any favorite shades: ',
  },
];

export function InteractiveGiftStudio() {
  const [selectedId, setSelectedId] = useState<string>(GIFT_MOODS[0].id);
  const activeMood = GIFT_MOODS.find((m) => m.id === selectedId) ?? GIFT_MOODS[0];

  return (
    <section
      aria-labelledby="atelier-philosophy-heading"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
    >
      <div className="bg-surface rounded-3xl border border-border-subtle p-5 sm:p-8 lg:p-10 shadow-subtle overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
          {/* Left Column: Sunlit Studio Visual + Live Atelier Detail Card */}
          <div className="lg:col-span-5 space-y-3">
            <div className="relative aspect-[4/3] lg:aspect-[5/4] rounded-2xl overflow-hidden bg-canvas border border-border-subtle w-full">
              <Image
                src="/images/bloomora-hero-artisan-workbench.jpg"
                alt="Bloomora handmade crafting table in Vadodara"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#1E1214]/75 via-[#1E1214]/25 to-transparent"
              />
              <div className="absolute inset-x-3 bottom-3 rounded-xl bg-white/95 backdrop-blur-md px-3.5 py-2.5 border border-white/70 shadow-subtle flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-rose">
                    Vadodara Studio Craft
                  </p>
                  <p className="text-xs font-semibold text-ink truncate">
                    {activeMood.craftHighlight}
                  </p>
                </div>
                <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blush/50 text-primary text-[11px] font-semibold">
                  <Sparkles className="w-3 h-3" />
                  Handmade
                </span>
              </div>
            </div>

            {/* Compact Studio Trust Pillars */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-canvas border border-border-subtle/80 py-2 px-1.5">
                <p className="text-xs font-bold text-ink">Milk-Cotton</p>
                <p className="text-[10px] text-ink-muted">Soft & Lasting</p>
              </div>
              <div className="rounded-xl bg-canvas border border-border-subtle/80 py-2 px-1.5">
                <p className="text-xs font-bold text-ink">Swatch Check</p>
                <p className="text-[10px] text-ink-muted">Preview Colors</p>
              </div>
              <div className="rounded-xl bg-canvas border border-border-subtle/80 py-2 px-1.5">
                <p className="text-xs font-bold text-ink">Note Included</p>
                <p className="text-[10px] text-ink-muted">Handwritten Card</p>
              </div>
            </div>
          </div>

          {/* Right Column: Story + Interactive Gift Idea Finder */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-2.5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blush/40 text-xs font-semibold text-rose uppercase tracking-wider">
                <Heart className="w-3 h-3 fill-rose" />
                <span>Our Philosophy • Gift Idea Studio</span>
              </div>

              <h2
                id="atelier-philosophy-heading"
                className="font-serif text-2xl sm:text-4xl text-ink font-normal leading-tight"
              >
                Slow stitches. <span className="italic text-rose">Built around your story.</span>
              </h2>

              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Mass-produced gifts fade fast — we take the slow path in Vadodara, turning milk-cotton yarn, textured craft paper, and your ideas into keepsakes kept for years. Tap what fits your moment:
              </p>
            </div>

            {/* Interactive Occasion / Mood Selector */}
            <div
              role="group"
              aria-label="Choose gifting occasion"
              className="flex flex-wrap items-center justify-center lg:justify-start gap-2"
            >
              {GIFT_MOODS.map((mood) => {
                const Icon = mood.icon;
                const isSelected = mood.id === activeMood.id;
                return (
                  <button
                    key={mood.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedId(mood.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-subtle'
                        : 'bg-canvas text-ink hover:border-primary/40 border-border-subtle'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-blush' : 'text-rose'}`} />
                    <span>{mood.chipLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Live Recommendation Card */}
            <div className="rounded-2xl bg-gradient-to-br from-[#FAF3F0] via-canvas to-white border border-primary/20 p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4 transition-all">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden border border-primary/15 bg-white shadow-subtle">
                <Image
                  src={activeMood.previewImage}
                  alt={activeMood.recommendationTitle}
                  fill
                  sizes="(max-width: 640px) 96px, 112px"
                  className={`object-cover ${
                    activeMood.categorySlug === 'birthday-surprise-card'
                      ? 'object-[50%_65%]'
                      : 'object-center'
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
                <p className="text-[11px] font-bold uppercase tracking-widest text-rose">
                  {activeMood.matchEyebrow}
                </p>
                <h3 className="font-serif text-lg sm:text-xl font-semibold text-ink leading-snug">
                  {activeMood.recommendationTitle}
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  {activeMood.recommendationPitch}
                </p>

                <div className="pt-1.5 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <Link
                    href={`/custom-orders?category=${activeMood.categorySlug}&idea=${encodeURIComponent(
                      activeMood.prefillIdea
                    )}`}
                  >
                    <Button variant="primary" size="sm">
                      <span>Personalise This Idea</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>

                  <Link
                    href={`/shop?category=${activeMood.categorySlug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline px-2 py-1.5"
                  >
                    <span>Browse {activeMood.categoryName}</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Secondary Story Link */}
            <div className="pt-1 border-t border-border-subtle/70 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted">
              <span>Want to know how Bloomora started in Vadodara?</span>
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 font-semibold text-ink hover:text-primary transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-rose" />
                <span>Read Our Full Story</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
