'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DEFAULT_WHATSAPP_NUMBER, buildWhatsAppLink } from '@/lib/whatsapp';

export default function CustomOrdersPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [occasion, setOccasion] = useState('');
  const [budget, setBudget] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const message = `Hi Bloomora! 🌸\nI'd like to commission a custom handcrafted gift!\n\nName: ${name}\nPhone: ${phone}\nOccasion: ${occasion || 'Special Gift'}\nBudget: ${budget || 'Flexible'}\nDetails: ${details}\n\nCould we discuss design ideas and pricing? 💖`;

    const whatsappUrl = buildWhatsAppLink({ message });
    setSubmitted(true);
    setIsSubmitting(false);

    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Personalized Artisanal Commissions</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink">
          Custom Bloomora Creations
        </h1>
        <p className="text-sm sm:text-base text-ink-muted max-w-xl mx-auto leading-relaxed">
          Whether you want a bouquet of favorite flowers, a personalized name keychain, or bulk favors for an anniversary, Bloomora handcrafts bespoke pieces with love in Vadodara.
        </p>
      </div>

      {/* Main Form & Guidance */}
      <div className="bg-surface rounded-2xl border border-border-subtle p-6 sm:p-10 shadow-craft space-y-8">
        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-ink">Opening WhatsApp...</h3>
            <p className="text-sm text-ink-muted max-w-md mx-auto">
              Your inquiry has been formulated. If WhatsApp didn&apos;t open automatically, click the button below to send your request directly to Bloomora.
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
                  Occasion / Purpose
                </label>
                <input
                  type="text"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  placeholder="e.g. Birthday, Anniversary, Home Decor"
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
                placeholder="Tell Bloomora what flowers, colors, or personalized charms you'd love!"
                className="w-full px-4 py-2.5 rounded-lg bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-ink-muted">
                🌸 We will immediately discuss your idea and send color swatches on WhatsApp.
              </p>

              <Button type="submit" variant="whatsapp" size="lg" className="w-full sm:w-auto font-semibold">
                <Send className="w-4 h-4 mr-2" />
                <span>Submit & Chat on WhatsApp</span>
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Direct WhatsApp Callout */}
      <div className="text-center space-y-2">
        <p className="text-xs text-ink-muted">
          Prefer discussing directly without a form?
        </p>
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
