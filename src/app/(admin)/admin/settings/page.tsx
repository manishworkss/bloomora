'use client';

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, MessageCircle, Instagram, Loader2, Store } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminSettingsPage() {
  const [whatsappNumber, setWhatsappNumber] = useState('918271735190');
  const [instagramHandle, setInstagramHandle] = useState('bloomora.creation');
  const [heroBadgeText, setHeroBadgeText] = useState("Vadodara's Artisan Studio • Slow Handcrafted Blooms");
  const [deliveryFee, setDeliveryFee] = useState('50');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          const s = data.settings;
          if (s.whatsappNumber) setWhatsappNumber(s.whatsappNumber);
          if (s.instagramHandle) setInstagramHandle(s.instagramHandle);
          if (s.heroBadgeText) setHeroBadgeText(s.heroBadgeText);
          if (s.deliveryFee !== undefined) setDeliveryFee(String(s.deliveryFee));
        }
      })
      .catch((err) => console.error('Failed to load settings:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whatsappNumber,
          instagramHandle,
          heroBadgeText,
          deliveryFee: Number(deliveryFee) || 50,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to save settings.');
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 4000);
      }
    } catch (err) {
      setError('Connection error while saving settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-ink-muted text-xs gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-rose" />
        <span>Loading studio configuration...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs uppercase font-bold tracking-widest text-rose">
          Configuration & Live Controls
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
          Storefront & Communication Settings
        </h1>
        <p className="text-xs text-ink-muted">
          All changes saved here instantly update the live Bloomora website without requiring any code changes.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in-50">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Settings saved successfully! Live storefront and WhatsApp routes have been synchronized.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-surface p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-craft space-y-6">
        {/* WhatsApp Settings */}
        <div className="space-y-4">
          <h3 className="font-serif text-base font-bold text-ink border-b border-border-subtle/80 pb-3 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-whatsapp fill-current" />
            <span>Official WhatsApp Business Contact</span>
          </h3>

          <div className="space-y-1.5 max-w-md">
            <label className="text-xs font-semibold text-ink uppercase tracking-wider">
              WhatsApp Mobile Number (India country code 91 + 10 digits)
            </label>
            <input
              type="text"
              required
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="918271735190"
              className="w-full px-4 py-2.5 rounded-lg bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary font-mono"
            />
            <p className="text-[11px] text-ink-muted">
              Active: <strong>+{whatsappNumber}</strong>. Customer checkout summaries, concierge inquiries, and custom requests route here.
            </p>
          </div>
        </div>

        {/* Instagram Settings */}
        <div className="space-y-4 pt-4 border-t border-border-subtle/80">
          <h3 className="font-serif text-base font-bold text-ink border-b border-border-subtle/80 pb-3 flex items-center gap-2">
            <Instagram className="w-4 h-4 text-primary" />
            <span>Instagram Presence</span>
          </h3>

          <div className="space-y-1.5 max-w-md">
            <label className="text-xs font-semibold text-ink uppercase tracking-wider">
              Instagram Handle
            </label>
            <div className="flex rounded-lg overflow-hidden border border-border-subtle">
              <span className="bg-canvas px-3 py-2.5 text-xs text-ink-muted border-r border-border-subtle select-none font-mono">
                instagram.com/
              </span>
              <input
                type="text"
                required
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                className="w-full px-3 py-2.5 bg-canvas text-sm text-ink focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Hero Badge Tagline */}
        <div className="space-y-4 pt-4 border-t border-border-subtle/80">
          <h3 className="font-serif text-base font-bold text-ink border-b border-border-subtle/80 pb-3 flex items-center gap-2">
            <Store className="w-4 h-4 text-primary" />
            <span>Hero Pill Tagline</span>
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink uppercase tracking-wider">
              Studio Pill Badge (Above Hero Headline)
            </label>
            <input
              type="text"
              required
              value={heroBadgeText}
              onChange={(e) => setHeroBadgeText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Local Delivery Flat Fee */}
        <div className="space-y-4 pt-4 border-t border-border-subtle/80">
          <h3 className="font-serif text-base font-bold text-ink border-b border-border-subtle/80 pb-3">
            Local Vadodara Delivery Fee
          </h3>

          <div className="space-y-1.5 max-w-xs">
            <label className="text-xs font-semibold text-ink uppercase tracking-wider">
              Flat Courier Fee (₹ INR)
            </label>
            <input
              type="number"
              required
              min={0}
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary font-mono"
            />
            <p className="text-[11px] text-ink-muted">Standard rate applied to all 17 Vadodara PIN codes at checkout.</p>
          </div>
        </div>

        <div className="pt-4 border-t border-border-subtle flex justify-end">
          <Button type="submit" variant="primary" isLoading={isSaving} className="shadow-craft">
            <Save className="w-4 h-4 mr-2" />
            <span>Save & Apply to Live Website</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
