'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Category, Product } from '@/types';
import { ProductCard } from '@/components/storefront/ProductCard';
import { Button } from '@/components/ui/Button';

interface ShoppableCatalogShelfProps {
  products: Product[];
  categories: Category[];
}

export function ShoppableCatalogShelf({
  products,
  categories,
}: ShoppableCatalogShelfProps) {
  const [activeSlug, setActiveSlug] = useState<string>('all');

  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === activeSlug) ?? null,
    [categories, activeSlug]
  );

  const visibleProducts = useMemo(() => {
    const featuredFirst = [...products].sort(
      (a, b) => Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured))
    );

    if (activeSlug === 'all') {
      return featuredFirst.slice(0, 8);
    }

    return featuredFirst
      .filter((p) => {
        const slugMatch = p.category?.slug === activeSlug;
        const idMatch = activeCategory ? p.categoryId === activeCategory.id : false;
        return slugMatch || idMatch;
      })
      .slice(0, 4);
  }, [products, activeSlug, activeCategory]);

  const ctaHref = activeCategory ? `/shop?category=${activeCategory.slug}` : '/shop';
  const ctaLabel = activeCategory
    ? `View All ${activeCategory.name}`
    : `Explore All ${products.length || 60} Creations`;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-5 w-full">
      {/* Aligned Section Header Row */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-widest text-rose">
            Handcrafted Picks
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal leading-tight">
            Trending Creations
          </h2>
        </div>

        <Link
          href={ctaHref}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary hover:underline shrink-0"
        >
          <span>See All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Straight Single-Line Horizontal Category Pills */}
      <div
        role="tablist"
        aria-label="Filter trending creations by category"
        className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeSlug === 'all'}
          onClick={() => setActiveSlug('all')}
          className={`h-9 px-4 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
            activeSlug === 'all'
              ? 'bg-ink text-white border-ink shadow-xs'
              : 'bg-surface text-ink-muted border-border-subtle hover:text-ink hover:border-primary/40'
          }`}
        >
          All Bestsellers
        </button>

        {categories.map((cat) => {
          const isActive = activeSlug === cat.slug;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveSlug(cat.slug)}
              className={`h-9 px-4 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
                isActive
                  ? 'bg-ink text-white border-ink shadow-xs'
                  : 'bg-surface text-ink-muted border-border-subtle hover:text-ink hover:border-primary/40'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Crisp 2-Column Mobile / 4-Column Desktop Product Grid */}
      {visibleProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-5 items-stretch">
          {visibleProducts.map((product) => (
            <div key={product.id} className="flex">
              <div className="w-full">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Direct Category / Catalog Action */}
      <div className="pt-1 flex justify-center">
        <Link href={ctaHref} className="w-full sm:w-auto">
          <Button variant="outline" size="md" className="w-full sm:w-auto px-7">
            <span>{ctaLabel}</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

