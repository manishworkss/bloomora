'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Palette,
  Feather,
  Gift,
  ArrowRight,
  MessageCircle,
  Heart,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { buildWhatsAppLink } from '@/lib/whatsapp';

type StudioTabId = 'palette' | 'note' | 'wrap';

const STUDIO_TABS: Array<{
  id: StudioTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'palette', label: 'Yarn Shades', icon: Palette },
  { id: 'note', label: 'Gift Note', icon: Feather },
  { id: 'wrap', label: 'Wrapping', icon: Gift },
];

const YARN_PALETTES = [
  {
    id: 'blush',
    name: 'Blush Rose',
    shortNote: 'Pink & Cream',
    dot: '#D98A96',
    vibe: 'soft blush pink & cream',
    imageUrl: '/images/cat-customized-bouquet.jpg',
    imageAlt: 'Blush rose and cream crochet tulip bouquet wrapped in pastel sheets',
  },
  {
    id: 'lavender',
    name: 'Lilac Mist',
    shortNote: 'Pastel Purple',
    dot: '#9E82B8',
    vibe: 'pastel lavender & pearl ivory',
    imageUrl: '/images/bloomora-hero-bouquet.jpg',
    imageAlt: 'Lilac and peach handmade crochet bouquet with wooden hook',
  },
  {
    id: 'sunflower',
    name: 'Sunbeam Gold',
    shortNote: 'Golden Glow',
    dot: '#E0A43B',
    vibe: 'golden sunflower & sage leaf',
    imageUrl: '/images/products/fl-01.jpg',
    imageAlt: 'Golden handmade crochet sunflower in a terracotta pot',
  },
  {
    id: 'sage',
    name: 'Sage Meadow',
    shortNote: 'Eucalyptus & Kraft',
    dot: '#739175',
    vibe: 'earthy botanical sage & kraft',
    imageUrl: '/images/bloomora-hero-artisan-workbench.jpg',
    imageAlt: 'Sage green milk-cotton yarn with handmade eucalyptus and lavender bouquet',
  },
];

const NOTE_CARD_STYLES = [
  {
    id: 'cotton-popup',
    name: 'Pop-Up Card',
    desc: 'Deckle cotton card with 3D crochet blooms',
    imageUrl: '/images/cat-birthday-surprise-card.jpg',
    imageAlt: 'Handmade cotton deckle pop-up card with crochet daisies and wax seal',
  },
  {
    id: 'wax-letter',
    name: 'Wax-Seal Envelope',
    desc: 'Botanical wax seal & frayed chiffon ribbon',
    imageUrl: '/images/products/bc-02.jpg',
    imageAlt: 'Botanical wax seal and blush chiffon ribbon on cotton envelope',
  },
  {
    id: 'kraft-roses',
    name: 'Kraft Tag & Roses',
    desc: 'Hand-tied kraft card nested with dried buds',
    imageUrl: '/images/products/bc-07.jpg',
    imageAlt: 'Blank textured kraft gift tag tied beside dried pink rosebuds',
  },
];

const NOTE_PRESETS = [
  'Forever in bloom — just for you.',
  'Happy Birthday! Keep blooming always.',
  'A handmade hug stitched with love.',
];

const WRAP_STYLES = [
  {
    id: 'kraft-satin',
    name: 'Rustic Kraft Wrap',
    desc: 'Textured brown kraft sheets tied with natural jute twine.',
    imageUrl: '/images/bloomora-hero-handcrafted.jpg',
    imageAlt: 'Rustic kraft paper floral bouquet tied with jute twine',
  },
  {
    id: 'pastel-korean',
    name: 'Korean Pleated Wrap',
    desc: 'Gold-edged lilac Korean wrap finished with a satin tulle bow.',
    imageUrl: '/images/products/bq-02.jpg',
    imageAlt: 'Lilac Korean pleated wrap bouquet tied with satin tulle ribbon',
  },
  {
    id: 'memory-box',
    name: 'Keepsake Gift Box',
    desc: 'Cushioned kraft hamper box tied with a champagne-blush bow.',
    imageUrl: '/images/cat-personalized-gifts.jpg',
    imageAlt: 'Open kraft hamper box with tissue paper, crochet heart, and satin bow',
  },
];

export function InteractiveOrderJourney() {
  const [activeTab, setActiveTab] = useState<StudioTabId>('palette');
  const [selectedPalette, setSelectedPalette] = useState(YARN_PALETTES[0]);
  const [selectedCardStyle, setSelectedCardStyle] = useState(NOTE_CARD_STYLES[0]);
  const [giftNote, setGiftNote] = useState(NOTE_PRESETS[0]);
  const [selectedWrap, setSelectedWrap] = useState(WRAP_STYLES[0]);

  const activePreview =
    activeTab === 'palette'
      ? {
          src: selectedPalette.imageUrl,
          alt: selectedPalette.imageAlt,
          stepLabel: 'Step 01 · Color Mood',
          pillLabel: selectedPalette.name,
          dot: selectedPalette.dot,
        }
      : activeTab === 'note'
        ? {
            src: selectedCardStyle.imageUrl,
            alt: selectedCardStyle.imageAlt,
            stepLabel: 'Step 02 · Gift Note',
            pillLabel: selectedCardStyle.name,
            dot: null,
          }
        : {
            src: selectedWrap.imageUrl,
            alt: selectedWrap.imageAlt,
            stepLabel: 'Step 03 · Gift Finish',
            pillLabel: selectedWrap.name,
            dot: null,
          };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 w-full">
      {/* Compact Header */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase font-bold tracking-widest text-rose">
            <Heart className="w-3 h-3 fill-rose/20" />
            <span>Custom Studio</span>
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal leading-tight">
            Personalise Your Gift
          </h2>
        </div>

        <Link
          href="/custom-orders"
          className="text-xs sm:text-sm font-semibold text-primary hover:underline shrink-0"
        >
          Full Studio →
        </Link>
      </div>

      {/* Single App-Native Card with Straight Segmented Tabs */}
      <div className="bg-surface rounded-2xl border border-border-subtle shadow-subtle overflow-hidden">
        {/* Straight 3-Column Equal Tab Rail */}
        <div
          role="tablist"
          aria-label="Customise gift options"
          className="grid grid-cols-3 border-b border-border-subtle bg-canvas/60"
        >
          {STUDIO_TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveTab(tab.id)}
                className={`h-11 sm:h-12 px-2 sm:px-4 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'border-primary text-primary bg-surface'
                    : 'border-transparent text-ink-muted hover:text-ink'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Flush 2-Column Visual + Interactive Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Dynamic Left Live Visualizer */}
          <div className="lg:col-span-5 relative aspect-[4/3] lg:aspect-auto lg:min-h-[310px] bg-canvas overflow-hidden">
            <Image
              key={activePreview.src}
              src={activePreview.src}
              alt={activePreview.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover object-center transition-opacity duration-300"
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent" />

            {/* Live Handwritten Card Overlay on Photo when Gift Note tab is active */}
            {activeTab === 'note' && (
              <div className="pointer-events-none absolute inset-x-3.5 bottom-12 sm:inset-x-4 sm:bottom-12 rounded-xl bg-[#F9F1E6]/95 backdrop-blur-xs border border-[#D4BEA3] px-3.5 py-2.5 shadow-md flex items-center justify-between gap-3">
                <p className="font-serif italic text-xs sm:text-sm text-[#3D2920] line-clamp-2">
                  &ldquo;{giftNote.trim() || 'Forever in bloom — just for you.'}&rdquo;
                </p>
                <span
                  aria-hidden="true"
                  className="w-7 h-7 rounded-full bg-primary text-[#FAF3ED] flex items-center justify-center font-serif italic font-bold text-[11px] shrink-0"
                >
                  B
                </span>
              </div>
            )}

            <div className="absolute inset-x-3.5 bottom-3 flex items-center justify-between gap-2 text-white">
              <span className="text-[11px] font-semibold tracking-wide drop-shadow-xs">
                {activePreview.stepLabel}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/95 text-ink text-[11px] font-semibold shadow-xs">
                {activePreview.dot && (
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: activePreview.dot }}
                  />
                )}
                <span>{activePreview.pillLabel}</span>
              </span>
            </div>
          </div>

          {/* Right Visual Option Cards */}
          <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col justify-between gap-4">
            {activeTab === 'palette' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-serif text-lg sm:text-xl text-ink">
                    Pick your yarn palette
                  </p>
                  <span className="text-[11px] font-medium text-ink-muted hidden sm:inline">
                    {selectedPalette.vibe}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {YARN_PALETTES.map((palette) => {
                    const active = palette.id === selectedPalette.id;
                    return (
                      <button
                        key={palette.id}
                        type="button"
                        onClick={() => setSelectedPalette(palette)}
                        className={`group p-2 rounded-xl border flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                          active
                            ? 'bg-blush/25 border-primary ring-1 ring-primary/25 shadow-xs'
                            : 'bg-canvas border-border-subtle hover:border-primary/40'
                        }`}
                      >
                        <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-lg overflow-hidden shrink-0 bg-white border border-black/5">
                          <Image
                            src={palette.imageUrl}
                            alt={palette.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                              style={{ backgroundColor: palette.dot }}
                            />
                            <span className="text-xs sm:text-sm font-semibold text-ink truncate">
                              {palette.name}
                            </span>
                          </div>
                          <p className="text-[10px] sm:text-[11px] text-ink-muted truncate mt-0.5">
                            {palette.shortNote}
                          </p>
                        </div>
                        {active && (
                          <Check className="w-3.5 h-3.5 text-primary shrink-0 mr-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'note' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="studio-gift-note-preview"
                    className="font-serif text-lg sm:text-xl text-ink"
                  >
                    Card style &amp; message
                  </label>
                  <div className="flex items-center gap-1">
                    {NOTE_PRESETS.map((preset, i) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setGiftNote(preset)}
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-canvas border border-border-subtle text-ink-muted hover:text-primary cursor-pointer"
                      >
                        #{i + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3 Visual Stationery Option Cards */}
                <div className="grid grid-cols-3 gap-2">
                  {NOTE_CARD_STYLES.map((card) => {
                    const active = card.id === selectedCardStyle.id;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => setSelectedCardStyle(card)}
                        className={`p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                          active
                            ? 'bg-blush/25 border-primary ring-1 ring-primary/25 shadow-xs'
                            : 'bg-canvas border-border-subtle hover:border-primary/40'
                        }`}
                      >
                        <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-white">
                          <Image
                            src={card.imageUrl}
                            alt={card.name}
                            fill
                            sizes="(max-width: 640px) 30vw, 140px"
                            className="object-cover"
                          />
                        </div>
                        <p className="text-[11px] font-semibold text-ink truncate mt-1.5 px-0.5">
                          {card.name}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <input
                  id="studio-gift-note-preview"
                  type="text"
                  maxLength={100}
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  placeholder="Write your personal note..."
                  className="w-full h-10 px-3.5 rounded-xl bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            )}

            {activeTab === 'wrap' && (
              <div className="space-y-3">
                <p className="font-serif text-lg sm:text-xl text-ink">
                  Choose wrapping finish
                </p>

                <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                  {WRAP_STYLES.map((wrap) => {
                    const active = wrap.id === selectedWrap.id;
                    return (
                      <button
                        key={wrap.id}
                        type="button"
                        onClick={() => setSelectedWrap(wrap)}
                        className={`p-1.5 sm:p-2 rounded-xl border text-left transition-all cursor-pointer ${
                          active
                            ? 'bg-blush/25 border-primary ring-1 ring-primary/25 shadow-xs'
                            : 'bg-canvas border-border-subtle hover:border-primary/40'
                        }`}
                      >
                        <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-white">
                          <Image
                            src={wrap.imageUrl}
                            alt={wrap.name}
                            fill
                            sizes="(max-width: 640px) 30vw, 150px"
                            className="object-cover"
                          />
                        </div>
                        <p className="text-[11px] sm:text-xs font-semibold text-ink truncate mt-1.5 px-0.5">
                          {wrap.name}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs text-ink-muted">{selectedWrap.desc}</p>
              </div>
            )}

            {/* Aligned Action Bar */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-border-subtle/70">
              {activeTab === 'palette' && (
                <Link
                  href={`/custom-orders?idea=${encodeURIComponent(
                    `I would love a custom gift crafted in ${selectedPalette.vibe}.`
                  )}`}
                >
                  <Button variant="primary" size="sm">
                    <span>Use {selectedPalette.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              )}

              {activeTab === 'note' && (
                <a
                  href={buildWhatsAppLink({
                    message: `Hi Bloomora! 🌸\nI'd love a "${selectedCardStyle.name}" with this handwritten note:\n"${giftNote.trim() || 'Forever in bloom — just for you.'}"`,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="primary" size="sm">
                    <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                    <span>Save {selectedCardStyle.name} on WhatsApp</span>
                  </Button>
                </a>
              )}

              {activeTab === 'wrap' && (
                <a
                  href={buildWhatsAppLink({
                    message: `Hi Bloomora! 🌸\nPlease finish my gift with "${selectedWrap.name}".`,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="primary" size="sm">
                    <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                    <span>Pick {selectedWrap.name} on WhatsApp</span>
                  </Button>
                </a>
              )}

              <Link
                href="/shop"
                className="text-xs font-semibold text-ink-muted hover:text-primary px-2 py-1.5"
              >
                Browse Ready Gifts →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
