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
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { buildWhatsAppLink } from '@/lib/whatsapp';

type StudioTabId = 'palette' | 'note' | 'wrap';

const STUDIO_TABS: Array<{
  id: StudioTabId;
  label: string;
  imageUrl: string;
  imageAlt: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    id: 'palette',
    label: 'Yarn Shades',
    imageUrl: '/images/bloomora-hero-artisan-workbench.jpg',
    imageAlt: 'Bloomora pastel yarn workbench and handmade crochet flowers',
    badge: 'Step 01 · Color Mood',
    icon: Palette,
  },
  {
    id: 'note',
    label: 'Gift Note',
    imageUrl: '/images/cat-birthday-surprise-card.jpg',
    imageAlt: 'Handmade cotton cardstock pop-up card and botanical wax-seal envelope',
    badge: 'Step 02 · Free Wax-Seal Card',
    icon: Feather,
  },
  {
    id: 'wrap',
    label: 'Wrapping',
    imageUrl: '/images/cat-personalized-gifts.jpg',
    imageAlt: 'Open handmade gift hamper tied with champagne satin bow',
    badge: 'Step 03 · Gift Finish',
    icon: Gift,
  },
];

const YARN_PALETTES = [
  { id: 'blush', name: 'Blush Rose', dot: '#D98A96', vibe: 'soft blush pink & cream' },
  { id: 'lavender', name: 'Lilac Mist', dot: '#9E82B8', vibe: 'pastel lavender & pearl ivory' },
  { id: 'sunflower', name: 'Sunbeam Gold', dot: '#E0A43B', vibe: 'golden sunflower & sage leaf' },
  { id: 'sage', name: 'Sage Meadow', dot: '#739175', vibe: 'earthy botanical sage & kraft' },
];

const NOTE_PRESETS = [
  'Forever in bloom — just for you.',
  'Happy Birthday! Keep blooming always.',
  'A handmade hug stitched with love.',
];

const WRAP_STYLES = [
  {
    id: 'kraft-satin',
    name: 'Kraft & Satin Bow',
    desc: 'Textured kraft paper wrapped with a champagne-blush satin bow.',
  },
  {
    id: 'pastel-tissue',
    name: 'Pastel Korean Wrap',
    desc: 'Layered translucent rose & ivory sheets for a boutique reveal.',
  },
  {
    id: 'memory-box',
    name: 'Keepsake Gift Box',
    desc: 'Cushioned kraft box with dried baby’s breath and wax-sealed card.',
  },
];

export function InteractiveOrderJourney() {
  const [activeTab, setActiveTab] = useState<StudioTabId>('palette');
  const [selectedPalette, setSelectedPalette] = useState(YARN_PALETTES[0]);
  const [giftNote, setGiftNote] = useState(NOTE_PRESETS[0]);
  const [selectedWrap, setSelectedWrap] = useState(WRAP_STYLES[0]);

  const currentTab = STUDIO_TABS.find((t) => t.id === activeTab) ?? STUDIO_TABS[0];

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
          {/* Visual Preview */}
          <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto lg:min-h-[260px] bg-canvas overflow-hidden">
            <Image
              src={currentTab.imageUrl}
              alt={currentTab.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent text-white flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wide">{currentTab.badge}</span>
              {activeTab === 'palette' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/95 text-ink text-[11px] font-semibold">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: selectedPalette.dot }}
                  />
                  {selectedPalette.name}
                </span>
              )}
            </div>
          </div>

          {/* Interactive Controls */}
          <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col justify-between gap-4">
            {activeTab === 'palette' && (
              <div className="space-y-3">
                <p className="font-serif text-lg sm:text-xl text-ink">
                  Pick your yarn palette
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {YARN_PALETTES.map((palette) => {
                    const active = palette.id === selectedPalette.id;
                    return (
                      <button
                        key={palette.id}
                        type="button"
                        onClick={() => setSelectedPalette(palette)}
                        className={`h-10 px-3 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
                          active
                            ? 'bg-blush/35 border-primary text-ink'
                            : 'bg-canvas border-border-subtle text-ink-muted hover:text-ink'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: palette.dot }}
                        />
                        <span className="truncate">{palette.name}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-ink-muted">
                  Mood: <strong className="text-ink">{selectedPalette.vibe}</strong>
                </p>
              </div>
            )}

            {activeTab === 'note' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="studio-gift-note-preview"
                    className="font-serif text-lg sm:text-xl text-ink"
                  >
                    Handwritten Gift Tag
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

                <input
                  id="studio-gift-note-preview"
                  type="text"
                  maxLength={100}
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  placeholder="Write your wish..."
                  className="w-full h-10 px-3.5 rounded-xl bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
                />

                <div className="rounded-xl bg-[#EDE0CF] border border-[#D4BEA3] px-4 py-3 flex items-center justify-between gap-3">
                  <p className="font-serif italic text-sm text-[#3D2920] truncate">
                    &ldquo;{giftNote.trim() || 'Forever in bloom — just for you.'}&rdquo;
                  </p>
                  <span
                    aria-hidden="true"
                    className="w-8 h-8 rounded-full bg-primary text-[#FAF3ED] flex items-center justify-center font-serif italic font-bold text-xs shrink-0"
                  >
                    B
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'wrap' && (
              <div className="space-y-3">
                <p className="font-serif text-lg sm:text-xl text-ink">
                  Choose wrapping finish
                </p>
                <div className="flex flex-wrap gap-2">
                  {WRAP_STYLES.map((wrap) => {
                    const active = wrap.id === selectedWrap.id;
                    return (
                      <button
                        key={wrap.id}
                        type="button"
                        onClick={() => setSelectedWrap(wrap)}
                        className={`h-9 px-3.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                          active
                            ? 'bg-primary text-white border-primary'
                            : 'bg-canvas border-border-subtle text-ink-muted hover:text-ink'
                        }`}
                      >
                        {wrap.name}
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
                    message: `Hi Bloomora! 🌸\nI'd love this handwritten gift note with my order:\n"${giftNote.trim() || 'Forever in bloom — just for you.'}"`,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="primary" size="sm">
                    <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                    <span>Save Note via WhatsApp</span>
                  </Button>
                </a>
              )}

              {activeTab === 'wrap' && (
                <a
                  href={buildWhatsAppLink({
                    message: `Hi Bloomora! 🌸\nPlease pack my order with "${selectedWrap.name}".`,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="primary" size="sm">
                    <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                    <span>Pick Wrap on WhatsApp</span>
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
