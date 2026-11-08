'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, MessageCircle, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '@/types';
import { formatINR } from '@/lib/formatters';
import { Badge } from '@/components/ui/Badge';
import { useCart } from '@/context/CartContext';
import { getProductInquiryLink } from '@/lib/whatsapp';

export interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const primaryImage =
    product.images?.find((img) => img.isPrimary) ||
    product.images?.[0] || {
      imageUrl:
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop',
      altText: product.title,
    };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      title: product.title,
      unitPrice: product.basePrice,
      quantity: 1,
      imageUrl: primaryImage.imageUrl,
      maxAvailableStock: product.stockQuantity,
      productType: product.productType,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const whatsappInquiryUrl = getProductInquiryLink(product.title);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-surface rounded-xl border border-border-subtle overflow-hidden shadow-subtle hover:border-primary/40 hover:shadow-craft-elevated transition-colors duration-300 flex flex-col"
    >
      {/* Image Container with Editorial Ratio */}
      <Link href={`/shop/${product.slug}`} className="block relative aspect-[4/5] bg-canvas overflow-hidden">
        <Image
          src={primaryImage.imageUrl}
          alt={primaryImage.altText || product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Product Type / Stock Pill */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.productType === 'READY_MADE' ? (
            <Badge variant="sage">In Ready Stock</Badge>
          ) : (
            <Badge variant="terracotta">Handcrafted to Order</Badge>
          )}
        </div>

        {/* Floating Quick Add Overlay on Desktop */}
        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleQuickAdd}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold shadow-subtle backdrop-blur-sm transition-colors flex items-center justify-center gap-1.5 ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-surface/95 text-ink hover:bg-primary hover:text-white'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </motion.button>

          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
            <Link
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 shadow-subtle transition-all flex items-center justify-center h-full"
              title="Inquire on WhatsApp"
              aria-label="Inquire on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-whatsapp fill-whatsapp" />
            </Link>
          </motion.div>
        </div>
      </Link>

      {/* Content Meta */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-2">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-rose">
            {product.category?.name || 'Handmade Creation'}
          </span>
          <Link href={`/shop/${product.slug}`} className="block group-hover:text-primary transition-colors">
            <h3 className="font-serif text-base font-semibold text-ink line-clamp-1 leading-snug">
              {product.title}
            </h3>
          </Link>
          <p className="text-xs text-ink-muted line-clamp-1">
            {product.shortDescription}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border-subtle/40">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-base font-bold text-ink">
              {formatINR(product.basePrice)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-ink-muted/70 line-through">
                {formatINR(product.compareAtPrice)}
              </span>
            )}
          </div>

          <Link
            href={`/shop/${product.slug}`}
            className="text-xs text-primary font-semibold flex items-center gap-1 group/btn hover:translate-x-0.5 transition-transform"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

