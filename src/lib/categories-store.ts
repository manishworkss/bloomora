import { Category } from '@/types';
import { readJsonFile, writeJsonFile } from './json-db';
import { createAdminClient } from './supabase/admin';
import { isSupabaseConfigured } from './supabase/status';

const CATEGORIES_FILE = 'categories.json';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    name: 'Handmade Keychain',
    slug: 'handmade-keychain',
    description: 'Hand-crocheted daisies, strawberries, hearts, and miniature keepsakes crafted for everyday charm.',
    imageUrl: '/images/cat-handmade-keychain.jpg',
    displayOrder: 1,
    isActive: true,
    createdAt: '2026-11-09T00:00:00Z',
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    name: 'Customized Bouquet',
    slug: 'customized-bouquet',
    description: 'Bespoke everlasting crochet bouquets wrapped with ribbons, roses, tulips, and your personal colour palette.',
    imageUrl: '/images/cat-customized-bouquet.jpg',
    displayOrder: 2,
    isActive: true,
    createdAt: '2026-11-09T00:00:00Z',
  },
  {
    id: 'c1000000-0000-0000-0000-000000000006',
    name: 'Handmade Flower',
    slug: 'handmade-flower',
    description: 'Everlasting single crochet sunflowers, roses, tulips, and desk flower pots that never fade.',
    imageUrl: '/images/cat-handmade-flower.jpg',
    displayOrder: 3,
    isActive: true,
    createdAt: '2026-11-11T00:00:00Z',
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    name: 'Seasonable Handmade Products',
    slug: 'seasonable-handmade-products',
    description: 'Limited-edition festive marigolds, cozy winter knits, and seasonal handcrafted creations made fresh in small batches.',
    imageUrl: '/images/cat-seasonable-handmade.jpg',
    displayOrder: 4,
    isActive: true,
    createdAt: '2026-11-09T00:00:00Z',
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    name: 'Birthday Surprise Card',
    slug: 'birthday-surprise-card',
    description: 'Handmade pop-up explosion cards, layered memory flaps, handwritten notes, and birthday keepsake envelopes.',
    imageUrl: '/images/cat-birthday-surprise-card.jpg',
    displayOrder: 5,
    isActive: true,
    createdAt: '2026-11-09T00:00:00Z',
  },
  {
    id: 'c1000000-0000-0000-0000-000000000005',
    name: 'Customized / Personalized Gifts',
    slug: 'customized-personalized-gifts',
    description: 'You have an idea — we have the creativity to craft it into a one-of-a-kind handmade keepsake made from scratch.',
    imageUrl: '/images/cat-personalized-gifts.jpg',
    displayOrder: 6,
    isActive: true,
    createdAt: '2026-11-09T00:00:00Z',
  },
];

export function getCategories(activeOnly: boolean = false): Category[] {
  const categories = readJsonFile<Category[]>(CATEGORIES_FILE, DEFAULT_CATEGORIES);
  if (activeOnly) {
    return categories.filter((c) => c.isActive);
  }
  return categories.sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getCategoryById(id: string): Category | undefined {
  const categories = getCategories(false);
  return categories.find((c) => c.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  const categories = getCategories(false);
  return categories.find((c) => c.slug === slug);
}

export function saveCategory(category: Category): Category {
  const categories = getCategories(false);
  const index = categories.findIndex((c) => c.id === category.id || c.slug === category.slug);

  if (index > -1) {
    categories[index] = { ...categories[index], ...category };
    writeJsonFile(CATEGORIES_FILE, categories);
    return categories[index];
  }

  const newCategory: Category = {
    ...category,
    id: category.id || `cat-${Date.now()}`,
    createdAt: category.createdAt || new Date().toISOString(),
  };
  categories.push(newCategory);
  writeJsonFile(CATEGORIES_FILE, categories);
  return newCategory;
}

export function deleteCategory(id: string): boolean {
  const categories = getCategories(false);
  const filtered = categories.filter((c) => c.id !== id);
  if (filtered.length !== categories.length) {
    writeJsonFile(CATEGORIES_FILE, filtered);
    return true;
  }
  return false;
}

export async function getCategoriesAsync(activeOnly: boolean = false): Promise<Category[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      let query = supabase.from('categories').select('*');
      if (activeOnly) {
        query = query.eq('is_active', true);
      }
      const { data, error } = await query.order('display_order', { ascending: true });
      if (!error && Array.isArray(data)) {
        return data.map((row: any) => ({
          id: row.id,
          name: row.name,
          slug: row.slug,
          description: row.description || '',
          imageUrl: row.image_url || '',
          displayOrder: Number(row.display_order ?? 0),
          isActive: Boolean(row.is_active),
          createdAt: row.created_at || new Date().toISOString(),
        }));
      }
    } catch (err) {
      console.error('Supabase getCategoriesAsync error:', err);
    }
  }
  return getCategories(activeOnly);
}

export async function saveCategoryAsync(category: Category): Promise<Category> {
  const isUuid = category.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(category.id);
  const catId = isUuid ? category.id : crypto.randomUUID();

  const toSave: Category = {
    ...category,
    id: catId,
  };

  saveCategory(toSave);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const row = {
        id: catId,
        name: toSave.name,
        slug: toSave.slug,
        description: toSave.description || null,
        image_url: toSave.imageUrl || null,
        display_order: toSave.displayOrder || 0,
        is_active: toSave.isActive !== undefined ? toSave.isActive : true,
        updated_at: new Date().toISOString(),
      };
      await supabase.from('categories').upsert(row, { onConflict: 'slug' });
    } catch (err) {
      console.error('Supabase saveCategoryAsync error:', err);
    }
  }
  return toSave;
}

export async function deleteCategoryAsync(id: string): Promise<boolean> {
  let deletedSupabase = false;
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      let query = supabase.from('categories').delete();
      if (isUuid) {
        query = query.eq('id', id);
      } else {
        query = query.eq('slug', id);
      }
      const { error } = await query;
      if (!error) deletedSupabase = true;
    } catch (err) {
      console.error('Supabase deleteCategoryAsync error:', err);
    }
  }
  const deletedLocal = deleteCategory(id);
  return deletedSupabase || deletedLocal;
}

