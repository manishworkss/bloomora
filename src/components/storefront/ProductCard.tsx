'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Check, Flower2 } from 'lucide-react';
import { Product } from '@/types';
import { formatINR } from '@/lib/formatters';
import { useCart } from '@/context/CartContext';

export interface ProductCardProps {
  product: Product;
}

// Generate deterministic rating & review count for consistent storefront display
function getProductRating(id: string): { rating: string; count: number } {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);
  const rating = positiveHash % 2 === 0 ? '4.9' : '4.8';
  const countList = [440, 384, 758, 403, 512, 296, 620, 345];
  const count = countList[positiveHash % countList.length];
  return { rating, count };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const validImages = (product.images || []).filter((img) => img.imageUrl && img.imageUrl.trim());
  const primaryImage = validImages.find((img) => img.isPrimary) || validImages[0];
  const secondaryImage = validImages.find((img) => img.imageUrl !== primaryImage?.imageUrl);
  const imageUrl = primaryImage?.imageUrl;

  const { rating, count } = getProductRating(product.id || product.title);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      title: product.title,
      unitPrice: product.basePrice,
      quantity: 1,
      imageUrl: imageUrl || '',
      maxAvailableStock: product.stockQuantity,
      productType: product.productType,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const badgeLabel = product.isFeatured
    ? 'Bestseller'
    : product.productType === 'READY_MADE'
      ? 'Ready to Ship'
      : null;

  return (
    <div className="group relative bg-white rounded-2xl border border-border-subtle overflow-hidden shadow-xs hover:shadow-md hover:border-primary/35 transition-all duration-300 flex flex-col justify-between h-full">
      {/* Top Image Section (Taller Portrait aspect-[4/5] with subtle desktop secondary photo swap on hover) */}
      <Link
        href={`/shop/${product.slug}`}
        className="block relative aspect-[4/5] bg-canvas overflow-hidden border-b border-border-subtle/50 select-none rounded-t-2xl"
      >
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={primaryImage?.altText || product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover w-full h-full transition-all duration-500 ease-out ${
                secondaryImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'
              }`}
            />
            {secondaryImage && (
              <Image
                src={secondaryImage.imageUrl}
                alt={secondaryImage.altText || product.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover w-full h-full opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blush/30 via-canvas to-surface text-rose p-4 select-none">
            <Flower2 className="w-10 h-10 text-rose/60 mb-2 stroke-[1.5]" />
            <span className="text-[11px] font-medium text-ink-muted text-center tracking-wide">
              Handcrafted Bloom
            </span>
          </div>
        )}

        {/* Top-Left Pill Badge */}
        {badgeLabel && (
          <div className="absolute top-2.5 left-2.5 bg-[#EFE4D8] text-[#4A3B32] font-semibold text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full tracking-wide shadow-xs z-10">
            {badgeLabel}
          </div>
        )}

        {/* Bottom-Left Rating Badge */}
        <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-xs border border-border-subtle/80 text-ink text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs z-10">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span>
            {rating} <span className="font-normal text-ink-muted">({count})</span>
          </span>
        </div>
      </Link>

      {/* Bottom Content Section */}
      <div className="p-3 sm:p-4 flex flex-col justify-between flex-1 gap-2.5 sm:gap-3 bg-white">
        <div className="space-y-1">
          <Link href={`/shop/${product.slug}`} className="block">
            <h3
              className="font-bold text-xs sm:text-sm text-ink truncate uppercase tracking-tight leading-snug group-hover:text-primary transition-colors"
              title={product.title}
            >
              {product.title}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className="font-serif font-bold text-sm sm:text-base text-ink">
              {formatINR(product.basePrice)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
              <span className="text-[11px] sm:text-xs text-ink-muted line-through font-normal">
                {formatINR(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Full-Width Add to Box Button */}
        <button
          type="button"
          onClick={handleQuickAdd}
          className={`w-full py-2.5 sm:py-3 px-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-[0.98] select-none ${
            justAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-ink hover:bg-primary text-white'
          }`}
          aria-label={`Add ${product.title} to Box`}
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Added to Box ✓</span>
            </>
          ) : (
            <span>Add to Box</span>
          )}
        </button>
      </div>
    </div>
  );
};
