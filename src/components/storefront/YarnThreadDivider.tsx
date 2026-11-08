'use client';

import React from 'react';
import { motion } from 'motion/react';

export const YarnThreadDivider: React.FC<{ label?: string }> = ({ label }) => {
  return (
    <div className="relative w-full py-8 overflow-hidden flex flex-col items-center justify-center select-none">
      {/* Decorative Continuous Crochet Thread */}
      <div className="w-full max-w-4xl px-4 flex items-center justify-center relative">
        <svg
          viewBox="0 0 1000 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-10 text-rose/30"
          preserveAspectRatio="none"
        >
          {/* Continuous looping yarn wave */}
          <motion.path
            d="M0 30 Q 125 5 250 30 T 500 30 T 750 30 T 1000 30"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="6 6"
            animate={{
              strokeDashoffset: [-24, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </svg>

        {/* Central Yarn Loop Motif with Label */}
        {label && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="bg-canvas px-4 py-1 border border-border-subtle rounded-full text-[10px] font-bold uppercase tracking-widest text-rose shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose animate-ping" />
              <span>{label}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
