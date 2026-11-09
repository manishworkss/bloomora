'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export const WhatsAppConcierge: React.FC = () => {
  const conciergeUrl = `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi Bloomora! 🌸 I'm looking for gift recommendations in Vadodara. Can you help me pick the perfect handmade creation?"
  )}`;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2.5 select-none">
      {/* Floating Action Button */}
      <Link
        href={conciergeUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Bloomora Artisan on WhatsApp (+91 8271735190)"
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:bg-[#20ba5a] active:scale-95 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
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

