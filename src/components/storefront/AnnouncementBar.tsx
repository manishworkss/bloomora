import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export const AnnouncementBar: React.FC = () => {
  return (
    <aside
      aria-label="Announcement"
      className="bg-blush/60 text-ink text-[11px] sm:text-xs py-2 px-4 text-center tracking-wider font-medium border-b border-border-subtle flex items-center justify-center gap-2"
    >
      <Sparkles className="w-3.5 h-3.5 text-rose shrink-0" />
      <span>
        Bloomora • Handcrafted with love in Vadodara • City-Wide Delivery across all PIN codes • WhatsApp:{' '}
        <Link
          href={`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold hover:text-rose transition-colors"
        >
          +91 8271735190
        </Link>
      </span>
    </aside>
  );
};
