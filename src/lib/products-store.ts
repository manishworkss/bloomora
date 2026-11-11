import { Product, Category, ProductImage } from '@/types';
import { readJsonFile, writeJsonFile } from './json-db';
import { DEFAULT_CATEGORIES } from './categories-store';
import { createAdminClient } from './supabase/admin';
import { isSupabaseConfigured } from './supabase/status';

export const INITIAL_CATEGORIES: Category[] = DEFAULT_CATEGORIES;

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
  const images: ProductImage[] = Array.isArray(row.product_images) && row.product_images.length > 0
    ? row.product_images
        .sort((a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0))
        .map((img: any) => ({
          id: img.id,
          productId: img.product_id || row.id,
          cloudinaryPublicId: img.cloudinary_public_id || 'upload',
          imageUrl: img.image_url,
          altText: img.alt_text || row.title,
          displayOrder: img.display_order ?? 0,
          isPrimary: Boolean(img.is_primary),
        }))
    : fallbackImages;

  let category: Category | undefined = undefined;
  if (row.categories) {
    category = {
      id: row.categories.id,
      name: row.categories.name,
      slug: row.categories.slug,
      description: row.categories.description || '',
      imageUrl: row.categories.image_url || '',
      displayOrder: Number(row.categories.display_order ?? 0),
      isActive: Boolean(row.categories.is_active),
      createdAt: row.categories.created_at || row.created_at,
    };
  }

  return {
    id: row.id,
    categoryId: row.category_id || '',
    category,
    title: row.title,
    slug: row.slug,
    shortDescription: row.short_description || '',
    fullDescription: row.full_description || '',
    basePrice: Number(row.base_price),
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : undefined,
    productType: row.product_type || 'READY_MADE',
    preparationDays: Number(row.preparation_days || 0),
    isPublished: Boolean(row.is_published),
    isFeatured: Boolean(row.is_featured),
    hasVariants: Boolean(row.has_variants),
    stockQuantity: Number(row.stock_quantity ?? 0),
    lowStockThreshold: Number(row.low_stock_threshold ?? 3),
    images,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getProductsAsync(publishedOnly: boolean = false): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      let query = supabase
        .from('products')
        .select('*, product_images(*), categories(*)')
        .is('deleted_at', null);

      if (publishedOnly) {
        query = query.eq('is_published', true);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const local = getProducts(false);
        return data.map((row) => {
          const match = local.find((l) => l.slug === row.slug || l.id === row.id);
          return mapSupabaseProduct(row, match?.images || []);
        });
      }
    } catch (err) {
      console.error('Supabase getProductsAsync error:', err);
    }
  }
  return getProducts(publishedOnly);
}

export async function getProductByIdAsync(id: string): Promise<Product | undefined> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      let query = supabase
        .from('products')
        .select('*, product_images(*), categories(*)')
        .is('deleted_at', null);

      if (isUuid) {
        query = query.eq('id', id);
      } else {
        query = query.eq('slug', id);
      }

      const { data, error } = await query.maybeSingle();
      if (!error && data) {
        return mapSupabaseProduct(data);
      }
    } catch (err) {
      console.error('Supabase getProductByIdAsync error:', err);
    }
  }
  return getProductById(id) || getProductBySlug(id);
}

export async function getProductBySlugAsync(slug: string): Promise<Product | undefined> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(*), categories(*)')
        .eq('slug', slug)
        .is('deleted_at', null)
        .maybeSingle();

      if (!error && data) {
        return mapSupabaseProduct(data);
      }
    } catch (err) {
      console.error('Supabase getProductBySlugAsync error:', err);
    }
  }
  return getProductBySlug(slug);
}

export async function saveProductAsync(product: Product): Promise<Product> {
  const isUuid = product.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(product.id);
  const productId = isUuid ? product.id : crypto.randomUUID();

  const productToSave: Product = {
    ...product,
    id: productId,
    updatedAt: new Date().toISOString(),
  };

  // Always keep local JSON in sync
  saveProduct(productToSave);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();

      // Resolve category UUID if needed
      let categoryUuid: string | null = null;
      if (product.categoryId) {
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(product.categoryId)) {
          categoryUuid = product.categoryId;
        } else {
          const cleanSlug = product.categoryId.replace(/^cat-/, '');
          const { data: catData } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', cleanSlug)
            .maybeSingle();
          if (catData?.id) {
            categoryUuid = catData.id;
          }
        }
      }

      const row = {
        id: productId,
        category_id: categoryUuid,
        title: productToSave.title,
        slug: productToSave.slug,
        short_description: productToSave.shortDescription || null,
        full_description: productToSave.fullDescription || '',
        base_price: productToSave.basePrice,
        compare_at_price: productToSave.compareAtPrice || null,
        product_type: productToSave.productType,
        preparation_days: productToSave.preparationDays || 0,
        is_published: productToSave.isPublished,
        is_featured: productToSave.isFeatured,
        stock_quantity: productToSave.stockQuantity,
        low_stock_threshold: productToSave.lowStockThreshold || 3,
        updated_at: new Date().toISOString(),
      };

      const { error: upsertErr } = await supabase.from('products').upsert(row, { onConflict: 'id' });
      if (upsertErr) {
        console.error('Supabase product upsert error:', upsertErr);
      }

      // Persist product images in Supabase
      if (Array.isArray(productToSave.images) && productToSave.images.length > 0) {
        await supabase.from('product_images').delete().eq('product_id', productId);

        const imageRows = productToSave.images
          .filter((img) => img.imageUrl && img.imageUrl.trim())
          .map((img, idx) => ({
            id: crypto.randomUUID(),
            product_id: productId,
            cloudinary_public_id: img.cloudinaryPublicId || 'upload',
            image_url: img.imageUrl,
            alt_text: img.altText || productToSave.title,
            display_order: idx,
            is_primary: idx === 0,
          }));

        if (imageRows.length > 0) {
          const { error: imgErr } = await supabase.from('product_images').insert(imageRows);
          if (imgErr) {
            console.error('Supabase image insert error:', imgErr);
          }
        }
      }
    } catch (err) {
      console.error('Failed to save product in Supabase:', err);
    }
  }

  return productToSave;
}

export async function deleteProductAsync(id: string): Promise<boolean> {
  let deletedSupabase = false;
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

      let prodId = id;
      if (!isUuid) {
        const { data: found } = await supabase.from('products').select('id').eq('slug', id).maybeSingle();
        if (found?.id) prodId = found.id;
      }

      if (prodId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(prodId)) {
        await supabase.from('product_images').delete().eq('product_id', prodId);
        const { error: hardErr } = await supabase.from('products').delete().eq('id', prodId);
        if (!hardErr) {
          deletedSupabase = true;
        } else {
          const { error: softErr } = await supabase
            .from('products')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', prodId);
          if (!softErr) deletedSupabase = true;
        }
      }
    } catch (err) {
      console.error('Supabase deleteProductAsync error:', err);
    }
  }

  const deletedLocal = deleteProduct(id);
  return deletedSupabase || deletedLocal;
}
