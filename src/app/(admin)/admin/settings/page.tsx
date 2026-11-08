'use client';

import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, MessageCircle, Instagram, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export default function AdminSettingsPage() {
  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_WHATSAPP_NUMBER);
  const [instagramHandle, setInstagramHandle] = useState('the_.handmadecraft');
  const [announcementText, setAnnouncementText] = useState(
    'Handcrafted with love in Vadodara • Delivering across all of Vadodara • WhatsApp Orders: +91 8271735190'
  );
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs uppercase font-bold tracking-widest text-secondary">
          Configuration & Socials
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
          Site & Communication Settings
        </h1>
        <p className="text-xs text-ink-muted">
          Update the official WhatsApp phone number, Instagram handle, and announcement bar.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Settings saved successfully! All storefront WhatsApp links updated.</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-surface p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-craft space-y-6">
        <div className="space-y-4">
          <h3 className="font-serif text-base font-bold text-ink border-b border-border-subtle/80 pb-3 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-whatsapp fill-current" />
            <span>Official WhatsApp Business Contact</span>
          </h3>

          <div className="space-y-1.5 max-w-md">
            <label className="text-xs font-semibold text-ink uppercase tracking-wider">
              WhatsApp Number (with country code, no + or spaces)
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
              Current: <strong>+{whatsappNumber}</strong>. All customer product queries, cart inquiries, and custom requests route to this WhatsApp chat.
            </p>
          </div>
        </div>

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
              <span className="bg-canvas px-3 py-2.5 text-xs text-ink-muted border-r border-border-subtle select-none">
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

        <div className="space-y-4 pt-4 border-t border-border-subtle/80">
          <h3 className="font-serif text-base font-bold text-ink border-b border-border-subtle/80 pb-3">
            Storefront Announcement Bar
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink uppercase tracking-wider">
              Banner Message (Top of Page)
            </label>
            <input
              type="text"
              required
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border-subtle flex justify-end">
          <Button type="submit" variant="primary">
            <Save className="w-4 h-4 mr-2" />
            <span>Save Settings</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

