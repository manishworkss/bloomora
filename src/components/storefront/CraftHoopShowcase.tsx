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
      className="relative w-full max-w-[300px] sm:max-w-md aspect-square flex items-center justify-center perspective-[1200px] select-none"
    >
      {/* Soft natural ambient glow */}
      <motion.div
        animate={{
          scale: isHovered ? 1.05 : [1, 1.03, 1],
          opacity: isHovered ? 0.55 : [0.35, 0.45, 0.35],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-6 rounded-full bg-blush/50 blur-3xl pointer-events-none"
      />

      {/* Main Organic 3D Tilting Wooden Hoop */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={
          !isHovered
            ? {
                y: [-4, 4, -4],
                rotateZ: [-0.5, 0.5, -0.5],
              }
            : undefined
        }
        transition={{
          y: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
          rotateZ: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="relative w-full h-full p-2 sm:p-4 will-change-transform flex items-center justify-center"
      >
        <Image
          src="/images/bloomora-hoop.png"
          alt="Bloomora Handcrafted Creations Embroidery Showcase"
          fill
          priority
          className="object-contain drop-shadow-xl pointer-events-none"
          sizes="(max-width: 640px) 280px, (max-width: 1024px) 400px, 480px"
        />

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
          className="absolute -top-1 sm:top-2 right-4 sm:right-8 bg-surface/95 backdrop-blur-md border border-border-subtle py-1.5 px-3 rounded-full shadow-subtle text-[10px] font-bold text-rose flex items-center gap-1.5 z-20 pointer-events-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose/80" />
          <span>Hand-Stitched Milk Cotton</span>
        </motion.div>

        {/* Tactile Swing Tag 2: Artisan Seal */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.25 }}
          className="absolute -bottom-2 sm:bottom-4 left-2 sm:left-6 bg-surface/95 backdrop-blur-md border border-border-subtle p-2.5 sm:p-3 rounded-2xl shadow-craft flex items-center gap-2.5 max-w-[calc(100%-1.5rem)] z-20"
        >
          <div className="w-8 h-8 rounded-xl bg-blush flex items-center justify-center text-rose shrink-0">
            <Heart className="w-4 h-4 fill-rose" />
          </div>
          <div className="min-w-0 pr-1 text-left">
            <p className="text-xs font-bold text-ink truncate">Handmade in Vadodara</p>
            <p className="text-[10px] text-ink-muted truncate">Zero Machines • Pure Craft</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
