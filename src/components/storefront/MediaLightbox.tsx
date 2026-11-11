'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface MediaLightboxProps {
  images: string[];
  initialIndex?: number;
  caption?: string;
  alt?: string;
  onClose: () => void;
}

/**
 * Accessible multi-image lightbox supporting keyboard navigation (Esc, ArrowLeft, ArrowRight)
 * and mobile/desktop controls for product galleries and customer review photos.
 */
export const MediaLightbox: React.FC<MediaLightboxProps> = ({
  images,
  initialIndex = 0,
  caption,
  alt = 'Enlarged creation preview',
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(
    Math.min(Math.max(initialIndex, 0), Math.max(images.length - 1, 0))
  );

  useEffect(() => {
    setCurrentIndex(
      Math.min(Math.max(initialIndex, 0), Math.max(images.length - 1, 0))
    );
  }, [initialIndex, images]);

  const hasMultiple = images.length > 1;
  const activeUrl = images[currentIndex] || images[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (hasMultiple && e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      } else if (hasMultiple && e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasMultiple, images.length, onClose]);

  if (!activeUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={caption || alt}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/85 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-auto max-h-[88vh] bg-surface rounded-2xl overflow-hidden p-2.5 shadow-2xl space-y-2 border border-border-subtle"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close image preview"
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-ink/75 text-white flex items-center justify-center hover:bg-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <X className="w-4 h-4" />
        </button>

        {hasMultiple && (
          <div className="absolute top-4 left-4 z-20 px-2.5 py-1 rounded-full bg-ink/75 text-white text-[11px] font-semibold">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        <div className="relative flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeUrl}
            alt={alt}
            className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain mx-auto select-none"
          />

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface/90 hover:bg-surface text-ink border border-border-subtle shadow-md flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface/90 hover:bg-surface text-ink border border-border-subtle shadow-md flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {caption && (
          <p className="text-center text-xs font-semibold text-ink px-3 pb-1">{caption}</p>
        )}
      </div>
    </div>
  );
};

