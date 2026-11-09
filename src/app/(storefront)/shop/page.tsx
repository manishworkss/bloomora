'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ProductCard } from '@/components/storefront/ProductCard';
import { Product } from '@/types';

const CATEGORIES = [
  { id: 'all', slug: 'all', name: 'All Creations' },
  { id: 'cat-flowers', slug: 'flowers', name: 'Handmade Flowers' },
  { id: 'cat-bouquets', slug: 'bouquets', name: 'Bouquets' },
  { id: 'cat-keychains', slug: 'keychains', name: 'Keychains' },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    fetch('/api/store/products', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error('Failed to fetch live products:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (categoryParam) {
      const found = CATEGORIES.find((c) => c.slug === categoryParam);
      if (found) setSelectedCategory(found.id);
    } else {
      setSelectedCategory('all');
    }
  }, [categoryParam]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (selectedCategory !== 'all') {
          const matchId = product.categoryId === selectedCategory;
          const matchSlug = product.category?.slug === selectedCategory.replace('cat-', '');
          if (!matchId && !matchSlug) return false;
        }
        if (filterType !== 'all' && product.productType !== filterType) {
          return false;
        }
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesTitle = product.title.toLowerCase().includes(query);
          const matchesDesc = (product.shortDescription || '').toLowerCase().includes(query);
          if (!matchesTitle && !matchesDesc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.basePrice - b.basePrice;
        if (sortBy === 'price-high') return b.basePrice - a.basePrice;
        if (sortBy === 'featured') return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        return 0;
      });
  }, [products, selectedCategory, filterType, searchQuery, sortBy]);

  return (
    <div className="space-y-8">
      {/* Search and Filters Bar */}
      <div className="bg-surface rounded-2xl border border-border-subtle p-4 sm:p-5 shadow-subtle space-y-4">
        {/* Top: Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flowers, bouquets, keychains, desk pots..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-canvas border border-border-subtle text-xs sm:text-sm text-ink placeholder:text-ink-muted/70 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Categories Bar & Sorters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-border-subtle/60">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-canvas text-ink-muted hover:text-ink hover:bg-blush/30 border border-border-subtle/80'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sorter & Availability Select */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 rounded-xl bg-canvas border border-border-subtle text-xs font-medium text-ink focus:outline-none"
              aria-label="Sort creations"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 rounded-xl bg-canvas border border-border-subtle text-xs font-medium text-ink focus:outline-none"
              aria-label="Filter availability"
            >
              <option value="all">All Types</option>
              <option value="READY_MADE">Ready to Ship</option>
              <option value="MADE_TO_ORDER">Made to Order</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Results Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-surface rounded-2xl border border-border-subtle p-4 space-y-4 animate-pulse">
              <div className="aspect-[4/5] bg-canvas rounded-t-xl" />
              <div className="h-4 bg-canvas rounded w-3/4" />
              <div className="h-3 bg-canvas rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-3xl border border-border-subtle p-8 space-y-4">
          <p className="font-serif text-xl text-ink">No creations found</p>
          <p className="text-xs text-ink-muted max-w-sm mx-auto">
            Try adjusting your search keywords or explore another category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setFilterType('all');
            }}
            className="text-xs font-semibold text-rose hover:underline"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Title */}
      <div className="space-y-2 text-center sm:text-left">
        <span className="text-xs uppercase font-bold tracking-widest text-rose">
          Artisanal Catalog
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
          Handmade Creations
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted max-w-xl">
          Everlasting crochet flowers, hand-knitted bouquets, and keepsake charms made with love in Vadodara.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="p-20 text-center text-xs text-ink-muted flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-rose" />
            <span>Loading creations...</span>
          </div>
        }
      >
        <ShopContent />
      </Suspense>
    </div>
  );
}
