'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="divide-y divide-border-subtle border-y border-border-subtle">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="py-4 sm:py-5">
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between text-left gap-4 group focus-visible:outline-none"
              aria-expanded={isOpen}
            >
              <span className="font-serif text-base sm:text-lg font-semibold text-ink group-hover:text-primary transition-colors">
                {item.question}
              </span>
              <span
                className={`w-7 h-7 rounded-full border border-border-subtle flex items-center justify-center shrink-0 transition-transform duration-300 ${
                  isOpen ? 'rotate-180 bg-blush/30 border-rose' : 'group-hover:border-ink-muted'
                }`}
              >
                <ChevronDown className="w-4 h-4 text-ink-muted group-hover:text-ink" />
              </span>
            </button>

            {isOpen && (
              <div className="pt-3 pr-8 text-xs sm:text-sm text-ink-muted leading-relaxed animate-in fade-in-50 duration-200">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
