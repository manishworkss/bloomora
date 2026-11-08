'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import { DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export const WhatsAppConcierge: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  const conciergeUrl = `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi Bloomora! 🌸 I'm looking for gift recommendations in Vadodara. Can you help me pick the perfect handmade creation?"
  )}`;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5 pointer-events-none select-none">
      {/* Artisan Prompt Bubble */}
      {!dismissed && (
        <div className="pointer-events-auto bg-surface border border-border-subtle rounded-2xl p-3.5 shadow-craft-elevated max-w-[260px] sm:max-w-xs animate-in fade-in slide-in-from-bottom-3 duration-300 relative group">
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-surface border border-border-subtle text-ink-muted hover:text-ink flex items-center justify-center transition-colors shadow-subtle"
            aria-label="Dismiss chat concierge prompt"
          >
            <X className="w-3 h-3" />
          </button>

          <Link
            href={conciergeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-left"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-rose" />
              <span>Vadodara Artisan Concierge</span>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              Need personalized gift advice or custom colors? Chat directly with our creator.
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-whatsapp pt-1.5 transition-colors">
              <span>Chat on WhatsApp</span>
              <span aria-hidden="true">&rarr;</span>
            </span>
          </Link>
        </div>
      )}

      {/* Floating Action Button */}
      <Link
        href={conciergeUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Bloomora Artisan on WhatsApp (+91 8271735190)"
        className="pointer-events-auto group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:bg-[#20ba5a] active:scale-95 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      >
        <MessageCircle className="w-5 h-5 fill-white text-white shrink-0" />
        <span className="text-xs font-bold tracking-wide hidden sm:inline-block">
          Need Gift Advice?
        </span>
        {/* Subtle Online Dot */}
        <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-white border-2 border-[#25D366]" />
      </Link>
    </div>
  );
};

