'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export const AnnouncementBar: React.FC = () => {
  const [announcementText, setAnnouncementText] = useState(
    'Bloomora • Handcrafted with love in Vadodara • City-Wide Delivery across all PIN codes • WhatsApp:'
  );
  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_WHATSAPP_NUMBER);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    fetch('/api/store/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          const s = data.settings;
          if (s.announcementText) setAnnouncementText(s.announcementText);
          if (s.whatsappNumber) setWhatsappNumber(s.whatsappNumber);
          if (s.announcementVisible !== undefined) setVisible(s.announcementVisible);
        }
      })
      .catch((err) => console.error('Failed to load live announcement:', err));
  }, []);

  if (!visible) return null;

  return (
    <aside
      aria-label="Announcement"
      className="bg-blush/60 text-ink text-[10px] sm:text-xs py-2 px-3 sm:px-4 text-center tracking-wider font-medium border-b border-border-subtle flex items-center justify-center gap-1.5 flex-wrap w-full max-w-full overflow-hidden"
    >
      <Sparkles className="w-3.5 h-3.5 text-rose shrink-0" />
      <span>
        {announcementText.includes('+91') || announcementText.includes('WhatsApp') ? (
          announcementText
        ) : (
          <>
            {announcementText}{' '}
            <Link
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold hover:text-rose transition-colors"
            >
              +{whatsappNumber}
            </Link>
          </>
        )}
      </span>
    </aside>
  );
};
