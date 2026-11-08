'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Instagram, MapPin, Send, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DEFAULT_WHATSAPP_NUMBER, buildWhatsAppLink } from '@/lib/whatsapp';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = `Hi The Handmade Craft! 👋\n\nName: ${name}\nPhone: ${phone}\nTopic: ${subject || 'General Inquiry'}\nMessage: ${message}`;
    const url = buildWhatsAppLink({ message: formatted });
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-xs uppercase font-bold tracking-widest text-secondary">
          We&apos;d Love to Hear From You
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink">
          Contact & Studio Support
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed">
          Have questions about a custom bouquet, order delivery in Vadodara, or want to discuss a personalized idea? Reach out to us directly!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-surface border border-border-subtle shadow-craft space-y-2">
            <div className="w-10 h-10 rounded-full bg-whatsapp/15 text-whatsapp flex items-center justify-center">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <h3 className="font-serif text-base font-bold text-ink">WhatsApp Direct</h3>
            <p className="text-xs text-ink-muted">Quickest response for questions & orders.</p>
            <Link
              href={`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-whatsapp hover:underline block pt-1"
            >
              +91 8271735190
            </Link>
          </div>

          <div className="p-6 rounded-xl bg-surface border border-border-subtle shadow-craft space-y-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Instagram className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-ink">Instagram DMs</h3>
            <p className="text-xs text-ink-muted">Follow our daily stories and knotting reels.</p>
            <Link
              href="https://instagram.com/the_.handmadecraft"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-primary hover:underline block pt-1"
            >
              @the_.handmadecraft
            </Link>
          </div>

          <div className="p-6 rounded-xl bg-surface border border-border-subtle shadow-craft space-y-2">
            <div className="w-10 h-10 rounded-full bg-sage/20 text-sage flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-ink">Studio Location</h3>
            <p className="text-xs text-ink-muted">
              Handcrafted in <strong>Vadodara, Gujarat</strong>. Serving all local PIN codes (390001–390025).
            </p>
          </div>
        </div>

        {/* Quick Contact Form */}
        <div className="lg:col-span-2 bg-surface p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-craft">
          <h3 className="font-serif text-xl font-bold text-ink mb-6">Send Us a Quick Message</h3>

          <form onSubmit={handleSendMessage} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                  Your Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-4 py-2.5 rounded-lg bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                  Phone / WhatsApp <span className="text-primary">*</span>
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

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                Topic / Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Question about bouquet customization"
                className="w-full px-4 py-2.5 rounded-lg bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                Your Message <span className="text-primary">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help make your gift special?"
                className="w-full px-4 py-2.5 rounded-lg bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-ink-muted">
                📲 Submitting connects you directly to our WhatsApp chat.
              </p>
              <Button type="submit" variant="whatsapp" size="lg" className="w-full sm:w-auto font-semibold">
                <Send className="w-4 h-4 mr-2" />
                <span>Send to WhatsApp</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

