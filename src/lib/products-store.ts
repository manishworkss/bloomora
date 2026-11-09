import { Product, Category } from '@/types';
import { readJsonFile, writeJsonFile } from './json-db';
import { createAdminClient } from './supabase/admin';
import { isSupabaseConfigured } from './supabase/status';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-bouquets',
    name: 'Floral Bouquets',
    slug: 'bouquets',
    description: 'Everlasting handmade bouquets wrapped in luxury paper.',
    displayOrder: 1,
    isActive: true,
    createdAt: '2026-11-09T00:00:00Z',
  },
  {
    id: 'cat-flowers',
    name: 'Desk Flower Pots',
    slug: 'flowers',
    description: 'Smiling sunflowers and potted crochet blossoms.',
    displayOrder: 2,
    isActive: true,
    createdAt: '2026-11-09T00:00:00Z',
  },
  {
    id: 'cat-keychains',
    name: 'Handmade Keychains',
    slug: 'keychains',
    description: 'Delicate daisies, strawberries, and customized bag charms.',
    displayOrder: 3,
    isActive: true,
    createdAt: '2026-11-09T00:00:00Z',
  },
];

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    categoryId: 'cat-bouquets',
    category: INITIAL_CATEGORIES[0],
    title: 'Everlasting Crochet Lavender & Tulip Bouquet',
    slug: 'everlasting-lavender-tulip-bouquet',
    shortDescription:
      'Handcrafted with soft milk-cotton yarn in pastel lilac and cream, tied with natural jute twine.',
    fullDescription:
      'A timeless arrangement of handcrafted lavender sprigs and pastel tulips. Hand-knitted with love in Vadodara, this bouquet never withers and stays vibrant forever. Perfect for birthdays, anniversaries, or self-love gifting. Wrapped in premium kraft paper with a matching bow.',
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
        id: 'img-001-a',
        productId: 'prod-001',
        cloudinaryPublicId: 'the-handmade-craft/sample-1',
        imageUrl:
          'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=1200&auto=format&fit=crop',
        altText: 'Handmade crochet bouquet with lavender and cream tulips',
        displayOrder: 0,
        isPrimary: true,
      },
    ],
    createdAt: '2026-11-09T00:00:00Z',
    updatedAt: '2026-11-09T00:00:00Z',
  },
  {
    id: 'prod-002',
    categoryId: 'cat-flowers',
    category: INITIAL_CATEGORIES[1],
    title: 'Mini Smiling Sunflower Crochet Desk Pot',
    slug: 'mini-smiling-sunflower-crochet-pot',
    shortDescription:
      'Adorable handmade yellow sunflower with a joyful face sitting in a cozy terracotta yarn pot.',
    fullDescription:
      'Brighten any work desk, study table, or gifting occasion with this cheerful smiling sunflower. Hand-crocheted stitch-by-stitch with soft hypoallergenic yarn. Brings a smile to everyone who looks at it.',
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
        id: 'img-002-a',
        productId: 'prod-002',
        cloudinaryPublicId: 'the-handmade-craft/sample-2',
        imageUrl:
          'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=1200&auto=format&fit=crop',
        altText: 'Cute crochet sunflower desk pot',
        displayOrder: 0,
        isPrimary: true,
      },
    ],
    createdAt: '2026-11-09T00:00:00Z',
    updatedAt: '2026-11-09T00:00:00Z',
  },
  {
    id: 'prod-003',
    categoryId: 'cat-keychains',
    category: INITIAL_CATEGORIES[2],
    title: 'Handmade Daisy Flower Charm Keychain',
    slug: 'handmade-daisy-flower-charm-keychain',
    shortDescription:
      'Delicate white daisy with yellow pistil charm, durable alloy golden ring, and ribbon bow.',
    fullDescription:
      'A lightweight yet durable handmade keychain to keep keys organized or attach to your favorite handbag, school bag, or backpack. Stitched with high-grade anti-pilling yarn.',
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
        id: 'img-003-a',
        productId: 'prod-003',
        cloudinaryPublicId: 'the-handmade-craft/sample-3',
        imageUrl:
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop',
        altText: 'Handmade daisy crochet keychain charm',
        displayOrder: 0,
        isPrimary: true,
      },
    ],
    createdAt: '2026-11-09T00:00:00Z',
    updatedAt: '2026-11-09T00:00:00Z',
  },
  {
    id: 'prod-004',
    categoryId: 'cat-bouquets',
    category: INITIAL_CATEGORIES[0],
    title: 'Customizable Pastel Rose & Daisy Keepsake Bouquet',
    slug: 'customizable-pastel-rose-daisy-keepsake-bouquet',
    shortDescription:
      'Bespoke bouquet customized with your favorite color palette. Handcrafted to order.',
    fullDescription:
      'Select your personalized colors and let our artisan craft an exclusive floral bouquet just for your special person. Handcrafted to order with care in Vadodara.',
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
        id: 'img-004-a',
        productId: 'prod-004',
        cloudinaryPublicId: 'the-handmade-craft/sample-4',
        imageUrl:
          'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1200&auto=format&fit=crop',
        altText: 'Customizable handmade rose bouquet in Vadodara',
        displayOrder: 0,
        isPrimary: true,
      },
    ],
    createdAt: '2026-11-09T00:00:00Z',
    updatedAt: '2026-11-09T00:00:00Z',
  },
  {
    id: 'prod-005',
    categoryId: 'cat-flowers',
    category: INITIAL_CATEGORIES[1],
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
        id: 'img-005-a',
        productId: 'prod-005',
        cloudinaryPublicId: 'the-handmade-craft/sample-5',
        imageUrl:
          'https://images.unsplash.com/photo-1520763185298-1b434c919102?q=80&w=1200&auto=format&fit=crop',
        altText: 'Pink crochet tulip in potted base',
        displayOrder: 0,
        isPrimary: true,
      },
    ],
    createdAt: '2026-11-09T00:00:00Z',
    updatedAt: '2026-11-09T00:00:00Z',
  },
  {
    id: 'prod-006',
    categoryId: 'cat-keychains',
    category: INITIAL_CATEGORIES[2],
    title: 'Fluffy Strawberry Amigurumi Keychain',
    slug: 'fluffy-strawberry-amigurumi-keychain',
    shortDescription:
      'Vibrant red handmade strawberry with tiny embroidered seeds and green calyx top.',
    fullDescription:
      'Plump and soft handmade strawberry amigurumi keychain. Handcrafted with dense stitches so it retains its shape forever.',
    basePrice: 229,
    compareAtPrice: 269,
    productType: 'READY_MADE',
    preparationDays: 0,
    isPublished: true,
    isFeatured: false,
    hasVariants: false,
    stockQuantity: 12,
    lowStockThreshold: 3,
    images: [
      {
        id: 'img-006-a',
        productId: 'prod-006',
        cloudinaryPublicId: 'the-handmade-craft/sample-6',
        imageUrl:
          'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=1200&auto=format&fit=crop',
        altText: 'Handmade strawberry crochet keychain',
        displayOrder: 0,
        isPrimary: true,
      },
    ],
    createdAt: '2026-11-09T00:00:00Z',
    updatedAt: '2026-11-09T00:00:00Z',
  },
];

const PRODUCTS_FILE = 'products.json';

export function getProducts(publishedOnly: boolean = false): Product[] {
  const products = readJsonFile<Product[]>(PRODUCTS_FILE, SEED_PRODUCTS);
  if (publishedOnly) {
    return products.filter((p) => p.isPublished);
  }
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  const products = getProducts(false);
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  const products = getProducts(false);
  return products.find((p) => p.id === id);
}

export function saveProduct(product: Product): Product {
  const products = getProducts(false);
  const index = products.findIndex((p) => p.id === product.id);

  if (index > -1) {
    products[index] = { ...product, updatedAt: new Date().toISOString() };
    writeJsonFile(PRODUCTS_FILE, products);
    return products[index];
  }

  const newProduct = {
    ...product,
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  products.unshift(newProduct);
  writeJsonFile(PRODUCTS_FILE, products);
  return newProduct;
}

export function deleteProduct(id: string): boolean {
  const products = getProducts(false);
  const initialLength = products.length;
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length < initialLength) {
    writeJsonFile(PRODUCTS_FILE, filtered);
    return true;
  }
  return false;
}

function mapSupabaseProduct(row: any, fallbackImages: any[] = []): Product {
  const defaultImage =
    fallbackImages.length > 0
      ? fallbackImages[0].imageUrl
      : row.slug === 'everlasting-lavender-tulip-bouquet'
      ? '/images/bloomora-hero-handcrafted.jpg'
      : row.slug === 'mini-smiling-sunflower-crochet-pot'
      ? 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=1200&auto=format&fit=crop'
      : row.slug === 'handmade-daisy-flower-charm-keychain'
      ? 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop'
      : 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=1200&auto=format&fit=crop';

  return {
    id: row.id,
    categoryId: row.category_id || 'cat-bouquets',
    title: row.title,
    slug: row.slug,
    shortDescription: row.short_description || '',
    fullDescription: row.full_description || '',
    basePrice: Number(row.base_price),
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : undefined,
    productType: row.product_type || 'READY_MADE',
    preparationDays: row.preparation_days || 0,
    isPublished: Boolean(row.is_published),
    isFeatured: Boolean(row.is_featured),
    hasVariants: Boolean(row.has_variants),
    stockQuantity: Number(row.stock_quantity || 0),
    lowStockThreshold: Number(row.low_stock_threshold || 3),
    images:
      fallbackImages.length > 0
        ? fallbackImages
        : [
            {
              id: `img-${row.id}`,
              productId: row.id,
              cloudinaryPublicId: row.slug,
              imageUrl: defaultImage,
              altText: row.title,
              displayOrder: 0,
              isPrimary: true,
            },
          ],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getProductsAsync(publishedOnly: boolean = false): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      let query = supabase.from('products').select('*').is('deleted_at', null);
      if (publishedOnly) {
        query = query.eq('is_published', true);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const local = getProducts(false);
        return data.map((row) => {
          const match = local.find((l) => l.slug === row.slug || l.id === row.id);
          return mapSupabaseProduct(row, match?.images || []);
        });
      }
    } catch {
      // Fall back to JSON
    }
  }
  return getProducts(publishedOnly);
}

export async function getProductBySlugAsync(slug: string): Promise<Product | undefined> {
  const products = await getProductsAsync(false);
  return products.find((p) => p.slug === slug);
}

export async function saveProductAsync(product: Product): Promise<Product> {
  const saved = saveProduct(product);
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const row = {
        title: product.title,
        slug: product.slug,
        short_description: product.shortDescription,
        full_description: product.fullDescription,
        base_price: product.basePrice,
        compare_at_price: product.compareAtPrice || null,
        product_type: product.productType,
        preparation_days: product.preparationDays || 0,
        is_published: product.isPublished,
        is_featured: product.isFeatured,
        stock_quantity: product.stockQuantity,
        low_stock_threshold: product.lowStockThreshold || 3,
        updated_at: new Date().toISOString(),
      };
      await supabase.from('products').upsert(row, { onConflict: 'slug' });
    } catch {
      // Local JSON already persisted
    }
  }
  return saved;
}

export async function deleteProductAsync(id: string): Promise<boolean> {
  const success = deleteProduct(id);
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      await supabase
        .from('products')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);
    } catch {
      // Local JSON already deleted
    }
  }
  return success;
}
