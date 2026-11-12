'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Heart } from 'lucide-react';

export const CraftHoopShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Natural physics: weighted wooden frame suspended in space
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Soft, weighted organic spring (mimics a hanging wooden object)
  const springConfig = { damping: 32, stiffness: 75, mass: 1.4 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[340px] sm:max-w-lg aspect-[4/3.4] sm:aspect-[4/3.4] flex items-center justify-center perspective-[1200px] select-none"
    >
      {/* Soft natural ambient studio glow */}
      <motion.div
        animate={{
          scale: isHovered ? 1.05 : [1, 1.03, 1],
          opacity: isHovered ? 0.65 : [0.4, 0.5, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-4 rounded-3xl bg-blush/60 blur-3xl pointer-events-none"
      />

      {/* Decorative Linen Frame Stitched Accent */}
      <div className="absolute -inset-2 rounded-[2rem] border border-dashed border-rose/30 pointer-events-none" />

      {/* Main Organic 3D Tilting Handcrafted Gallery Frame */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={
          !isHovered
            ? {
                y: [-3, 3, -3],
                rotateZ: [-0.3, 0.3, -0.3],
              }
            : undefined
        }
        transition={{
          y: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
          rotateZ: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="relative w-full h-full rounded-[1.75rem] overflow-hidden bg-surface border border-border-subtle shadow-2xl will-change-transform flex items-center justify-center group"
      >
        {/* Authentic Handcrafted Product Photography */}
        <Image
          src="/images/bloomora-hero-handcrafted.jpg"
          alt="Bloomora Handcrafted Crochet Floral Bouquet and Studio Artistry"
          fill
          priority
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(max-width: 640px) 340px, (max-width: 1024px) 480px, 560px"
        />

        {/* Subtle Vignette & Natural Tint Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-ink/10 pointer-events-none" />

        {/* Tactile Swing Tag 1: Top Hanging Yarn Tag with Soft Pendulum Sway */}
        <motion.div
          animate={{
            rotate: [-1.5, 2, -1.5],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-surface/95 backdrop-blur-md border border-border-subtle py-1.5 px-3 rounded-full shadow-subtle text-[10px] font-bold text-rose flex items-center gap-1.5 z-20 pointer-events-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose/80" />
          <span>Hand-Stitched Milk Cotton</span>
        </motion.div>

        {/* Tactile Swing Tag 2: Everlasting Keepsake Tag */}
        <motion.div
          animate={{
            y: [-2, 2, -2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute top-1/2 -right-1 sm:right-3 -translate-y-1/2 bg-surface/95 backdrop-blur-md border border-border-subtle py-1 px-2.5 rounded-full shadow-subtle text-[10px] font-semibold text-ink flex items-center gap-1.5 z-20 pointer-events-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          <span>Never Withers</span>
        </motion.div>

        {/* Tactile Swing Tag 3: Studio Craft Seal */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.25 }}
          className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-surface/95 backdrop-blur-md border border-border-subtle p-2 sm:p-2.5 rounded-xl shadow-craft flex items-center gap-2.5 max-w-[calc(100%-2rem)] z-20"
        >
          <div className="w-7 h-7 rounded-lg bg-blush flex items-center justify-center text-rose shrink-0 shadow-inner">
            <Heart className="w-3.5 h-3.5 fill-rose" />
          </div>
          <div className="min-w-0 pr-1 text-left">
            <div className="flex items-center gap-1">
              <p className="text-[11px] sm:text-xs font-bold text-ink truncate">100% Handcrafted</p>
              <span className="text-[10px] text-rose font-serif">✦</span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-ink-muted truncate">100% Slow Craft • Zero Machines</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
