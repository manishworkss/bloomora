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

export const SEED_PRODUCTS: Product[] = [];

const PRODUCTS_FILE = 'products.json';

export function getProducts(publishedOnly: boolean = false): Product[] {
  const products = readJsonFile<Product[]>(PRODUCTS_FILE, []);
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
