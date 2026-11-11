'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Loader2, Sparkles, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '@/components/storefront/ProductCard';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types';

function matchesCategory(product: Product, category: { id: string; slug: string }): boolean {
  if (category.id === 'all') return true;
  return (
    product.categoryId === category.id ||
    product.category?.id === category.id ||
    product.category?.slug === category.slug ||
    product.category?.slug === category.id.replace('cat-', '')
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; slug: string; name: string }[]>([
    { id: 'all', slug: 'all', name: 'All Creations' },
  ]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    Promise.all([
      fetch('/api/store/products', { cache: 'no-store' }).then((r) => r.json()),
      fetch('/api/store/categories', { cache: 'no-store' }).then((r) => r.json()),
    ])
      .then(([prodsData, catsData]) => {
        if (prodsData.success && Array.isArray(prodsData.products)) {
          setProducts(prodsData.products);
        }
        if (catsData.success && Array.isArray(catsData.categories)) {
          setCategories([
            { id: 'all', slug: 'all', name: 'All Creations' },
            ...catsData.categories.map((c: any) => ({
              id: c.id,
              slug: c.slug,
              name: c.name,
            })),
          ]);
        }
      })
      .catch((err) => console.error('Failed to fetch live data:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (categoryParam && categories.length > 1) {
      const found = categories.find((c) => c.slug === categoryParam);
      if (found) setSelectedCategory(found.id);
    } else if (!categoryParam) {
      setSelectedCategory('all');
    }
  }, [categoryParam, categories]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    for (const cat of categories) {
      if (cat.id !== 'all') {
        counts[cat.id] = products.filter((p) => matchesCategory(p, cat)).length;
      }
    }
    return counts;
  }, [products, categories]);

  const activeCategoryObj = useMemo(
    () => categories.find((c) => c.id === selectedCategory) || { id: 'all', slug: 'all' },
    [categories, selectedCategory]
  );

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (selectedCategory !== 'all' && !matchesCategory(product, activeCategoryObj)) {
          return false;
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
  }, [products, selectedCategory, activeCategoryObj, filterType, searchQuery, sortBy]);

  const hasActiveFilters =
    selectedCategory !== 'all' || filterType !== 'all' || searchQuery.trim().length > 0;

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setFilterType('all');
  };

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
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-canvas border border-border-subtle text-xs sm:text-sm text-ink placeholder:text-ink-muted/70 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-ink-muted hover:text-ink hover:bg-surface transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Categories Bar & Sorters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2 border-t border-border-subtle/60">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const count = categoryCounts[cat.id] ?? 0;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all inline-flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-canvas text-ink-muted hover:text-ink hover:bg-blush/30 border border-border-subtle/80'
                  }`}
                >
                  <span>{cat.name}</span>
                  {!loading && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-surface text-ink-muted'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sorter & Availability Select */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-canvas border border-border-subtle text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label="Sort creations"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-canvas border border-border-subtle text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label="Filter availability"
            >
              <option value="all">All Types</option>
              <option value="READY_MADE">Ready to Ship</option>
              <option value="MADE_TO_ORDER">Made to Order</option>
            </select>
          </div>
        </div>

        {/* Live Result Summary Bar */}
        {!loading && (
          <div className="flex items-center justify-between text-[11px] text-ink-muted pt-1">
            <span>
              Showing <strong className="text-ink">{filteredProducts.length}</strong> of{' '}
              {products.length} handcrafted {products.length === 1 ? 'creation' : 'creations'}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="font-semibold text-rose hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Product Results Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-surface rounded-2xl border border-border-subtle p-4 space-y-4 animate-pulse">
              <div className="aspect-[4/5] bg-canvas rounded-t-xl" />
              <div className="h-4 bg-canvas rounded w-3/4" />
              <div className="h-3 bg-canvas rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 sm:py-20 bg-surface rounded-3xl border border-border-subtle p-8 space-y-4">
          <p className="font-serif text-2xl text-ink">No creations match your filters</p>
          <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto">
            Try resetting your keywords or commission a bespoke crochet design crafted specially for you in Vadodara.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button variant="primary" size="sm" onClick={resetFilters} className="w-full sm:w-auto">
              Reset all filters
            </Button>
            <Link href="/custom-orders" className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Sparkles className="w-3.5 h-3.5 text-rose" />
                <span>Request Custom Creation</span>
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Bespoke Custom Order Callout */}
      <div className="rounded-3xl bg-blush/30 border border-border-subtle p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="space-y-1">
          <p className="text-xs uppercase font-bold tracking-widest text-rose">
            Personalized Gifting
          </p>
          <h2 className="font-serif text-xl sm:text-2xl text-ink">
            Want a custom color palette or bouquet size?
          </h2>
          <p className="text-xs text-ink-muted max-w-lg">
            Choose flower types, yarn shades, wrapping paper, and personal charms made to order in our Vadodara studio.
          </p>
        </div>
        <Link href="/custom-orders" className="w-full sm:w-auto shrink-0">
          <Button variant="primary" size="md" className="w-full sm:w-auto whitespace-nowrap">
            <span>Customise a Gift</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 sm:space-y-10">
      {/* Page Title */}
      <div className="space-y-2 text-center sm:text-left">
        <span className="text-xs uppercase font-bold tracking-widest text-rose">
          Artisanal Catalog
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
          Handmade Creations
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted max-w-xl mx-auto sm:mx-0">
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
