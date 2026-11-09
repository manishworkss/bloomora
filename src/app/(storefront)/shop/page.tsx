'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ProductCard } from '@/components/storefront/ProductCard';
import { Product } from '@/types';

const INITIAL_CATALOG: Product[] = [
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
      'A timeless arrangement of handcrafted lavender sprigs and pastel tulips. Hand-knitted with love in Vadodara, this bouquet never withers and stays vibrant forever.',
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
        cloudinaryPublicId: 'sample-1',
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
      name: 'Desk Flower Pots',
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
      'Brighten any work desk, study table, or gifting occasion with this cheerful smiling sunflower.',
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
        cloudinaryPublicId: 'sample-2',
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
      'Delicate white daisy with yellow pistil, sturdy golden key ring, and pastel leaf charm.',
    fullDescription:
      'Charming floral accessory for bags, car keys, or gifting. Handcrafted with fine cotton thread.',
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
        cloudinaryPublicId: 'sample-3',
        imageUrl:
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
        altText: 'Handmade daisy crochet keychain',
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
      'Bespoke bouquet customized with your choice of pastel roses, daisies, and baby breath sprigs.',
    fullDescription:
      'A customizable luxury bouquet tailored to your specific color preferences.',
    basePrice: 1199,
    compareAtPrice: 1399,
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
        cloudinaryPublicId: 'sample-4',
        imageUrl:
          'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop',
        altText: 'Custom handmade pastel rose and daisy bouquet',
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
      name: 'Desk Flower Pots',
      slug: 'flowers',
      displayOrder: 2,
      isActive: true,
      createdAt: '2026-11-09',
    },
    title: 'Blooming Pink Rose Crochet Desk Blossom',
    slug: 'blooming-pink-rose-crochet-blossom',
    shortDescription:
      'Elegant single dusty-rose bloom planted in a miniature hand-crocheted ceramic-style cup.',
    fullDescription:
      'A delicate single pink rose blossom that remains in perpetual bloom.',
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
        cloudinaryPublicId: 'sample-5',
        imageUrl:
          'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop',
        altText: 'Handmade pink rose crochet desk flower',
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
      'Plump and soft handmade strawberry amigurumi keychain.',
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
        cloudinaryPublicId: 'sample-6',
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
  { id: 'cat-flowers', slug: 'flowers', name: 'Handmade Flowers' },
  { id: 'cat-bouquets', slug: 'bouquets', name: 'Bouquets' },
  { id: 'cat-keychains', slug: 'keychains', name: 'Keychains' },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>(INITIAL_CATALOG);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    fetch('/api/store/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products?.length > 0) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error('Failed to fetch live products:', err));
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
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy, filterType]);

  return (
    <div className="space-y-10">
      {/* Category Pills & Controls */}
      <div className="space-y-6">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-rose text-white shadow-subtle'
                  : 'bg-surface border border-border-subtle text-ink hover:border-rose/50'
              }`}
            >
              {cat.name}
            </motion.button>
          ))}
          <motion.div whileTap={{ scale: 0.95 }}>
            <Link
              href="/custom-orders"
              className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap bg-blush/40 border border-border-subtle text-rose hover:bg-blush/70 transition-colors inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalised Commissions</span>
            </Link>
          </motion.div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-4 bg-surface rounded-2xl border border-border-subtle shadow-subtle">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creations..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-canvas border border-border-subtle text-xs text-ink placeholder:text-ink-muted/70 focus:outline-none focus:ring-1 focus:ring-rose"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 rounded-xl bg-canvas border border-border-subtle text-xs font-medium text-ink focus:outline-none"
              aria-label="Sort creations"
            >
              <option value="featured">Featured</option>
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
      {filteredProducts.length === 0 ? (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
