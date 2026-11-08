'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '@/components/storefront/ProductCard';
import { Product } from '@/types';

// Catalog data baseline (matches initial Vadodara catalog)
const CATALOG_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    categoryId: 'cat-bouquets',
    category: {
      id: 'cat-bouquets',
      name: 'Floral Bouquets',
      slug: 'bouquets',
      displayOrder: 1,
      isActive: true,
      createdAt: '2026-11-09',
    },
    title: 'Everlasting Crochet Lavender & Tulip Bouquet',
    slug: 'everlasting-lavender-tulip-bouquet',
    shortDescription:
      'Handcrafted with soft milk-cotton yarn in pastel lilac and cream, tied with natural jute twine.',
    fullDescription:
      'A timeless arrangement of handcrafted lavender sprigs and pastel tulips. Hand-knitted with love in Vadodara, this bouquet never withers and stays vibrant forever. Perfect for birthdays, anniversaries, or self-love gifting.',
    basePrice: 899,
    compareAtPrice: 1049,
    productType: 'READY_MADE',
    preparationDays: 0,
    isPublished: true,
    isFeatured: true,
    hasVariants: false,
    stockQuantity: 6,
    lowStockThreshold: 2,
    images: [
      {
        id: 'img-001',
        productId: 'prod-001',
        cloudinaryPublicId: 'the-handmade-craft/sample-1',
        imageUrl:
          'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800&auto=format&fit=crop',
        altText: 'Handmade crochet bouquet with lavender and cream tulips',
        displayOrder: 0,
        isPrimary: true,
      },
    ],
    createdAt: '2026-11-09',
    updatedAt: '2026-11-09',
  },
  {
    id: 'prod-002',
    categoryId: 'cat-flowers',
    category: {
      id: 'cat-flowers',
      name: 'Flower Pots',
      slug: 'flowers',
      displayOrder: 2,
      isActive: true,
      createdAt: '2026-11-09',
    },
    title: 'Mini Smiling Sunflower Crochet Desk Pot',
    slug: 'mini-smiling-sunflower-crochet-pot',
    shortDescription:
      'Adorable handmade yellow sunflower with a joyful face sitting in a cozy terracotta yarn pot.',
    fullDescription:
      'Brighten any work desk, study table, or gifting occasion with this cheerful smiling sunflower. Hand-crocheted stitch-by-stitch with soft hypoallergenic yarn.',
    basePrice: 399,
    compareAtPrice: 450,
    productType: 'READY_MADE',
    preparationDays: 0,
    isPublished: true,
    isFeatured: true,
    hasVariants: false,
    stockQuantity: 10,
    lowStockThreshold: 3,
    images: [
      {
        id: 'img-002',
        productId: 'prod-002',
        cloudinaryPublicId: 'the-handmade-craft/sample-2',
        imageUrl:
          'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=800&auto=format&fit=crop',
        altText: 'Cute crochet sunflower desk pot',
        displayOrder: 0,
        isPrimary: true,
      },
    ],
    createdAt: '2026-11-09',
    updatedAt: '2026-11-09',
  },
  {
    id: 'prod-003',
    categoryId: 'cat-keychains',
    category: {
      id: 'cat-keychains',
      name: 'Keychains',
      slug: 'keychains',
      displayOrder: 3,
      isActive: true,
      createdAt: '2026-11-09',
    },
    title: 'Handmade Daisy Flower Charm Keychain',
    slug: 'handmade-daisy-flower-charm-keychain',
    shortDescription:
      'Delicate white daisy with yellow pistil charm, durable alloy golden ring, and ribbon bow.',
    fullDescription:
      'A lightweight yet durable handmade keychain to keep keys organized or attach to your favorite handbag, school bag, or backpack.',
    basePrice: 199,
    compareAtPrice: 249,
    productType: 'READY_MADE',
    preparationDays: 0,
    isPublished: true,
    isFeatured: true,
    hasVariants: false,
    stockQuantity: 15,
    lowStockThreshold: 5,
    images: [
      {
        id: 'img-003',
        productId: 'prod-003',
        cloudinaryPublicId: 'the-handmade-craft/sample-3',
        imageUrl:
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
        altText: 'Handmade daisy crochet keychain charm',
        displayOrder: 0,
        isPrimary: true,
      },
    ],
    createdAt: '2026-11-09',
    updatedAt: '2026-11-09',
  },
  {
    id: 'prod-004',
    categoryId: 'cat-bouquets',
    category: {
      id: 'cat-bouquets',
      name: 'Floral Bouquets',
      slug: 'bouquets',
      displayOrder: 1,
      isActive: true,
      createdAt: '2026-11-09',
    },
    title: 'Customizable Pastel Rose & Daisy Keepsake Bouquet',
    slug: 'customizable-pastel-rose-daisy-keepsake-bouquet',
    shortDescription:
      'Bespoke bouquet customized with your favorite color palette. Handcrafted to order.',
    fullDescription:
      'Select your personalized colors and let our artisan craft an exclusive floral bouquet just for your special person. Packaged in luxury waterproof Korean wrapping paper with ribbon bow.',
    basePrice: 1199,
    productType: 'MADE_TO_ORDER',
    preparationDays: 3,
    isPublished: true,
    isFeatured: true,
    hasVariants: false,
    stockQuantity: 99,
    lowStockThreshold: 1,
    images: [
      {
        id: 'img-004',
        productId: 'prod-004',
        cloudinaryPublicId: 'the-handmade-craft/sample-4',
        imageUrl:
          'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop',
        altText: 'Customizable handmade rose bouquet in Vadodara',
        displayOrder: 0,
        isPrimary: true,
      },
    ],
    createdAt: '2026-11-09',
    updatedAt: '2026-11-09',
  },
  {
    id: 'prod-005',
    categoryId: 'cat-flowers',
    category: {
      id: 'cat-flowers',
      name: 'Flower Pots',
      slug: 'flowers',
      displayOrder: 2,
      isActive: true,
      createdAt: '2026-11-09',
    },
    title: 'Pastel Pink Crochet Tulip Desk Blossom',
    slug: 'pastel-pink-crochet-tulip-desk-blossom',
    shortDescription:
      'Elegant single tulip blossom in a handmade knitted white pot.',
    fullDescription:
      'An aesthetic minimalist piece for study tables, nightstands, and dressing corners. Needs zero watering or sunlight, staying in pristine bloom forever.',
    basePrice: 349,
    compareAtPrice: 399,
    productType: 'READY_MADE',
    preparationDays: 0,
    isPublished: true,
    isFeatured: false,
    hasVariants: false,
    stockQuantity: 8,
    lowStockThreshold: 2,
    images: [
      {
        id: 'img-005',
        productId: 'prod-005',
        cloudinaryPublicId: 'the-handmade-craft/sample-5',
        imageUrl:
          'https://images.unsplash.com/photo-1520763185298-1b434c919102?q=80&w=800&auto=format&fit=crop',
        altText: 'Pink crochet tulip in potted base',
        displayOrder: 0,
        isPrimary: true,
      },
    ],
    createdAt: '2026-11-09',
    updatedAt: '2026-11-09',
  },
  {
    id: 'prod-006',
    categoryId: 'cat-keychains',
    category: {
      id: 'cat-keychains',
      name: 'Keychains',
      slug: 'keychains',
      displayOrder: 3,
      isActive: true,
      createdAt: '2026-11-09',
    },
    title: 'Fluffy Strawberry Amigurumi Keychain',
    slug: 'fluffy-strawberry-amigurumi-keychain',
    shortDescription:
      'Vibrant red handmade strawberry with tiny embroidered seeds and green calyx top.',
    fullDescription:
      'Plump and soft handmade strawberry amigurumi keychain. Handcrafted with dense stitches so it retains its shape forever.',
    basePrice: 229,
    productType: 'READY_MADE',
    preparationDays: 0,
    isPublished: true,
    isFeatured: false,
    hasVariants: false,
    stockQuantity: 12,
    lowStockThreshold: 3,
    images: [
      {
        id: 'img-006',
        productId: 'prod-006',
        cloudinaryPublicId: 'the-handmade-craft/sample-6',
        imageUrl:
          'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=800&auto=format&fit=crop',
        altText: 'Handmade strawberry crochet keychain',
        displayOrder: 0,
        isPrimary: true,
      },
    ],
    createdAt: '2026-11-09',
    updatedAt: '2026-11-09',
  },
];

const CATEGORIES = [
  { id: 'all', slug: 'all', name: 'All Creations' },
  { id: 'cat-bouquets', slug: 'bouquets', name: 'Bouquets' },
  { id: 'cat-keychains', slug: 'keychains', name: 'Keychains' },
  { id: 'cat-flowers', slug: 'flowers', name: 'Flower Pots' },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const initialCat = useMemo(() => {
    if (!categoryParam) return 'all';
    const found = CATEGORIES.find((c) => c.slug === categoryParam);
    return found ? found.id : 'all';
  }, [categoryParam]);

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    if (categoryParam) {
      const found = CATEGORIES.find((c) => c.slug === categoryParam);
      if (found) setSelectedCategory(found.id);
    }
  }, [categoryParam]);

  const filteredProducts = useMemo(() => {
    return CATALOG_PRODUCTS.filter((product) => {
      if (selectedCategory !== 'all' && product.categoryId !== selectedCategory) {
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
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.basePrice - b.basePrice;
      if (sortBy === 'price-high') return b.basePrice - a.basePrice;
      return 0;
    });
  }, [selectedCategory, searchQuery, sortBy, filterType]);

  return (
    <div className="space-y-10">
      {/* Filter and Search Bar */}
      <div className="space-y-4 bg-surface p-5 rounded-xl border border-border-subtle shadow-craft">
        {/* Top Controls: Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keychains, bouquets, sunflowers..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-canvas border border-border-subtle text-sm text-ink placeholder:text-ink-muted/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Sort & Type */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SlidersHorizontal className="w-4 h-4 text-ink-muted shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto px-3 py-2.5 rounded-lg bg-canvas border border-border-subtle text-xs sm:text-sm font-medium text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Sort products by"
              >
                <option value="featured">Featured Creations</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full sm:w-auto px-3 py-2.5 rounded-lg bg-canvas border border-border-subtle text-xs sm:text-sm font-medium text-ink focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Filter products by availability"
            >
              <option value="all">All Types</option>
              <option value="READY_MADE">Ready to Ship</option>
              <option value="MADE_TO_ORDER">Made to Order</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-canvas text-ink-muted hover:text-ink hover:bg-surface border border-border-subtle'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Results */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 space-y-4 bg-surface rounded-xl border border-border-subtle">
          <p className="font-serif text-xl font-bold text-ink">No creations found</p>
          <p className="text-sm text-ink-muted">
            Try adjusting your search keywords or resetting filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setFilterType('all');
            }}
            className="text-xs font-semibold text-primary underline hover:text-primary-hover"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      {/* Header & Page Title */}
      <div className="space-y-3 text-center sm:text-left">
        <span className="text-xs uppercase font-bold tracking-widest text-secondary">
          Artisanal Catalog
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
          Handcrafted Gifts & Eternal Blooms
        </h1>
        <p className="text-sm text-ink-muted max-w-2xl">
          Every piece is carefully made in Vadodara with love. Available for quick dispatch or custom personalization.
        </p>
      </div>

      <Suspense fallback={<div className="text-center py-12 text-xs text-ink-muted">Loading creations...</div>}>
        <ShopContent />
      </Suspense>
    </div>
  );
}
