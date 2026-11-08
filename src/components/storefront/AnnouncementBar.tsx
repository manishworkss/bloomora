import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <aside
      aria-label="Announcement"
      className="bg-primary text-white text-xs sm:text-sm py-2 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-2"
    >
      <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
      <span>
        Handcrafted with love in Vadodara • Delivering across all of Vadodara • WhatsApp:{' '}
        <Link
          href="https://wa.me/918271735190"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold hover:text-secondary transition-colors"
        >
          +91 8271735190
        </Link>
      </span>
    </aside>
  );
};
