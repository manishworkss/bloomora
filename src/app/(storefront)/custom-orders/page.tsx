'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  MessageCircle,
  Sparkles,
  Send,
  CheckCircle2,
  Lightbulb,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DEFAULT_WHATSAPP_NUMBER, buildWhatsAppLink } from '@/lib/whatsapp';

interface CategoryPreset {
  slug: string;
  label: string;
  occasionValue: string;
  starterPrompt: string;
}

const CATEGORY_PRESETS: CategoryPreset[] = [
  {
    slug: 'handmade-keychain',
    label: 'Handmade Keychain',
    occasionValue: 'Handmade Keychain',
    starterPrompt:
      'I would love custom crochet keychains (specify charm style like daisy, strawberry, heart, initials, or bag charm colors): ',
  },
  {
    slug: 'customized-bouquet',
    label: 'Customized Bouquet',
    occasionValue: 'Customized Bouquet',
    starterPrompt:
      'I want a customized everlasting bouquet (preferred flowers, number of stems, color theme, and ribbon wrap): ',
  },
  {
    slug: 'handmade-flower',
    label: 'Handmade Flower',
    occasionValue: 'Handmade Flower',
    starterPrompt:
      'I would love individual or potted handmade crochet flowers (sunflower, tulip, rose, daisy, stem count, and color shades): ',
  },
  {
    slug: 'seasonable-handmade-products',
    label: 'Seasonable Handmade Products',
    occasionValue: 'Seasonable Handmade Products',
    starterPrompt:
      'I am looking for seasonal handmade creations (festival theme, home decor accent, or seasonal gift set): ',
  },
  {
    slug: 'birthday-surprise-card',
    label: 'Birthday Surprise Card',
    occasionValue: 'Birthday Surprise Card',
    starterPrompt:
      'I want a handmade birthday surprise card (theme, number of photo flaps/pop-ups, favorite colors, and personal message): ',
  },
  {
    slug: 'customized-personalized-gifts',
    label: 'Customized / Personalized Gifts',
    occasionValue: 'Customized / Personalized Gift Idea',
    starterPrompt:
      'I have a gift idea! Here is who it is for, the memory/theme I want captured, and any colors or details I imagine: ',
  },
];

function CustomOrdersContent() {
  const searchParams = useSearchParams();
  const categorySlugParam = searchParams.get('category') || '';
  const ideaParam = searchParams.get('idea') || '';

  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [occasion, setOccasion] = useState('');
  const [budget, setBudget] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const applyPreset = (preset: CategoryPreset, fillPrompt: boolean) => {
    setSelectedPreset(preset.slug);
    setOccasion(preset.occasionValue);
    if (fillPrompt && !details.trim()) {
      setDetails(preset.starterPrompt);
    }
  };

  useEffect(() => {
    if (categorySlugParam) {
      const match = CATEGORY_PRESETS.find((p) => p.slug === categorySlugParam);
      if (match) {
        setSelectedPreset(match.slug);
        setOccasion((prev) => prev || match.occasionValue);
      }
    }
    if (ideaParam) {
      setDetails((prev) => prev || ideaParam);
    }
  }, [categorySlugParam, ideaParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('/api/store/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name.trim(),
          customerPhone: phone.trim().replace(/\D/g, ''),
          occasion: occasion || 'Custom Commission',
          budgetEstimate: budget || 'Flexible',
          message: details,
        }),
      });
    } catch (err) {
      console.error('Failed to record inquiry:', err);
    }

    const message = `Hi Bloomora! 🌸\nI'd like to commission a custom handcrafted gift!\n\nName: ${name}\nPhone: ${phone}\nCategory / Occasion: ${occasion || 'Special Gift'}\nBudget: ${budget || 'Flexible'}\nIdea & Details: ${details}\n\nCould we brainstorm the design and pricing together? 💖`;

    const whatsappUrl = buildWhatsAppLink({ message });
    setSubmitted(true);
    setIsSubmitting(false);

    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
    }
  };

  const activePresetObj = CATEGORY_PRESETS.find((p) => p.slug === selectedPreset);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Your Idea • Our Creativity</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink">
          Turn Your Idea Into Handmade Magic
        </h1>
        <p className="text-sm sm:text-base text-ink-muted max-w-2xl mx-auto leading-relaxed">
          Have a heartfelt gift idea in mind? Whether it&apos;s a handmade keychain, a customized bouquet, a handmade flower, a seasonal creation, a birthday surprise card, or a completely custom personalized gift — you share the idea, and we bring the creativity to craft it from scratch.
        </p>
      </div>

      {/* Idea -> Creativity Creative Highlight */}
      <div className="rounded-2xl bg-blush/35 border border-primary/20 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-rose">
            Bespoke Concept Studio
          </p>
          <p className="text-sm text-ink leading-relaxed">
            <strong>You have an idea — we have the creativity</strong> to turn sketches, memories, inside jokes, or favorite shades into tangible handmade art you won&apos;t find in any store.
          </p>
        </div>
      </div>

      {/* Main Form & Category Preset Selector */}
      <div className="bg-surface rounded-2xl border border-border-subtle p-6 sm:p-10 shadow-craft space-y-8">
        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-ink">Opening WhatsApp...</h3>
            <p className="text-sm text-ink-muted max-w-md mx-auto">
              Your custom idea has been saved. If WhatsApp didn&apos;t open automatically, click below to chat directly with our Vadodara studio.
            </p>
            <div className="pt-2">
              <Link
                href={`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="whatsapp" size="lg">
                  <MessageCircle className="w-4 h-4 fill-current mr-2" />
                  <span>Open WhatsApp (+91 8271735190)</span>
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quick Craft Category Presets */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                  Pick a Craft Category (Optional)
                </label>
                {activePresetObj && (
                  <button
                    type="button"
                    onClick={() => setDetails(activePresetObj.starterPrompt)}
                    className="text-[11px] font-semibold text-primary hover:underline"
                  >
                    Fill idea template
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_PRESETS.map((preset) => {
                  const isActive = selectedPreset === preset.slug;
                  return (
                    <button
                      key={preset.slug}
                      type="button"
                      onClick={() => applyPreset(preset, true)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                        isActive
                          ? 'bg-primary text-white border-primary shadow-subtle'
                          : 'bg-canvas text-ink-muted hover:text-ink hover:border-primary/40 border-border-subtle'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                  Your Full Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Diya Sharma"
                  className="w-full px-4 py-2.5 rounded-lg bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                  WhatsApp Mobile Number <span className="text-primary">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-2.5 rounded-lg bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                  Category / Occasion
                </label>
                <input
                  type="text"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  placeholder="e.g. Birthday Surprise Card, Custom Bouquet, Keychain"
                  className="w-full px-4 py-2.5 rounded-lg bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                  Estimated Budget (Optional)
                </label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. ₹500 - ₹1,500 / Flexible"
                  className="w-full px-4 py-2.5 rounded-lg bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                Describe Your Idea / Colors / Request <span className="text-primary">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Tell Bloomora your idea — whether it is a custom keychain, color palette, birthday pop-up card, or a completely personalized concept!"
                className="w-full px-4 py-2.5 rounded-lg bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-ink-muted">
                🌸 We will brainstorm your idea, share color swatches, and craft it fresh on WhatsApp.
              </p>

              <Button
                type="submit"
                variant="whatsapp"
                size="lg"
                disabled={isSubmitting}
                className="w-full sm:w-auto font-semibold"
              >
                <Send className="w-4 h-4 mr-2" />
                <span>{isSubmitting ? 'Saving Idea...' : 'Submit & Chat on WhatsApp'}</span>
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Direct WhatsApp Callout */}
      <div className="text-center space-y-2">
        <p className="text-xs text-ink-muted">Prefer brainstorming directly without a form?</p>
        <Link
          href={`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-whatsapp hover:underline"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>Message Bloomora on WhatsApp (+91 8271735190)</span>
        </Link>
      </div>
    </div>
  );
}

export default function CustomOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-ink-muted flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-rose" />
          <span>Loading custom studio...</span>
        </div>
      }
    >
      <CustomOrdersContent />
    </Suspense>
  );
}
