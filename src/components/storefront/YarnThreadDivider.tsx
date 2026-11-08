'use client';

import React from 'react';
import { motion } from 'motion/react';

export const YarnThreadDivider: React.FC<{ label?: string }> = ({ label }) => {
  return (
    <div className="relative w-full py-6 overflow-hidden flex flex-col items-center justify-center select-none pointer-events-none">
      <div className="w-full max-w-4xl px-6 flex items-center justify-center relative">
        {/* Natural continuous artisan yarn curve */}
        <motion.svg
          viewBox="0 0 1000 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 text-rose/25"
          preserveAspectRatio="none"
          animate={{
            y: [-1.5, 1.5, -1.5],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <path
            d="M0 20 C 150 8, 300 32, 500 20 C 700 8, 850 32, 1000 20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </motion.svg>

        {/* Central Artisan Knot Label */}
        {label && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-canvas px-4 py-1 border border-border-subtle rounded-full text-[10px] font-medium tracking-widest text-ink-muted uppercase shadow-subtle flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose/60" />
              <span>{label}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
