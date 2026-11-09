import { CustomerReview } from '@/types';
import { readJsonFile, writeJsonFile } from './json-db';
import { createAdminClient } from './supabase/admin';
import { isSupabaseConfigured } from './supabase/status';

const REVIEWS_FILE = 'reviews.json';

export function getReviews(approvedOnly: boolean = true): CustomerReview[] {
  const reviews = readJsonFile<CustomerReview[]>(REVIEWS_FILE, []);
  if (approvedOnly) {
    return reviews.filter((r) => r.status === 'APPROVED');
  }
  return reviews;
}

export function saveReview(review: CustomerReview): CustomerReview {
  const reviews = getReviews(false);
  const index = reviews.findIndex((r) => r.id === review.id);

  if (index > -1) {
    reviews[index] = { ...review, updatedAt: new Date().toISOString() };
    writeJsonFile(REVIEWS_FILE, reviews);
    return reviews[index];
  }

  const newReview = {
    ...review,
    createdAt: review.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  reviews.unshift(newReview);
  writeJsonFile(REVIEWS_FILE, reviews);
  return newReview;
}

export function updateReviewStatus(
  id: string,
  status: CustomerReview['status'],
  isFeatured?: boolean
): CustomerReview | null {
  const reviews = getReviews(false);
  const index = reviews.findIndex((r) => r.id === id);
  if (index === -1) return null;

  reviews[index] = {
    ...reviews[index],
    status,
    isFeatured: isFeatured !== undefined ? isFeatured : reviews[index].isFeatured,
    updatedAt: new Date().toISOString(),
  };

  writeJsonFile(REVIEWS_FILE, reviews);
  return reviews[index];
}

export function deleteReview(id: string): boolean {
  const reviews = getReviews(false);
  const filtered = reviews.filter((r) => r.id !== id);
  if (filtered.length < reviews.length) {
    writeJsonFile(REVIEWS_FILE, filtered);
    return true;
  }
  return false;
}

function mapSupabaseReview(row: any): CustomerReview {
  return {
    id: row.id,
    customerName: row.customer_name,
    customerLocation: row.customer_location || 'Vadodara, Gujarat',
    customerPhone: row.customer_phone || undefined,
    rating: Number(row.rating || 5),
    title: row.title || undefined,
    reviewText: row.review_text,
    productName: row.product_name || 'Handmade Creation',
    occasion: row.occasion || undefined,
    images: Array.isArray(row.images) ? row.images : [],
    videoUrl: row.video_url || undefined,
    isVerifiedBuyer: Boolean(row.is_verified_buyer),
    isFeatured: Boolean(row.is_featured),
    status: row.status || 'APPROVED',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getReviewsAsync(approvedOnly: boolean = true): Promise<CustomerReview[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      let query = supabase.from('customer_reviews').select('*');
      if (approvedOnly) {
        query = query.eq('status', 'APPROVED');
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (!error && data) {
        return data.map(mapSupabaseReview);
      }
    } catch {
      // Fall back to JSON
    }
  }
  return getReviews(approvedOnly);
}

export async function saveReviewAsync(review: Omit<CustomerReview, 'id' | 'createdAt' | 'updatedAt'>): Promise<CustomerReview> {
  const newId = `rev-${Date.now()}`;
  const fullReview: CustomerReview = {
    ...review,
    id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveReview(fullReview);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      await supabase.from('customer_reviews').insert({
        id: fullReview.id,
        customer_name: fullReview.customerName,
        customer_location: fullReview.customerLocation,
        customer_phone: fullReview.customerPhone || null,
        rating: fullReview.rating,
        title: fullReview.title || null,
        review_text: fullReview.reviewText,
        product_name: fullReview.productName,
        occasion: fullReview.occasion || null,
        images: fullReview.images,
        video_url: fullReview.videoUrl || null,
        is_verified_buyer: fullReview.isVerifiedBuyer,
        is_featured: fullReview.isFeatured,
        status: fullReview.status,
      });
    } catch {
      // JSON already saved
    }
  }

  return fullReview;
}

export async function updateReviewStatusAsync(
  id: string,
  status: CustomerReview['status'],
  isFeatured?: boolean
): Promise<CustomerReview | null> {
  const updated = updateReviewStatus(id, status, isFeatured);
  if (isSupabaseConfigured() && updated) {
    try {
      const supabase = createAdminClient();
      const payload: Record<string, any> = {
        status,
        updated_at: new Date().toISOString(),
      };
      if (isFeatured !== undefined) {
        payload.is_featured = isFeatured;
      }
      await supabase.from('customer_reviews').update(payload).eq('id', id);
    } catch {
      // JSON already updated
    }
  }
  return updated;
}

export async function deleteReviewAsync(id: string): Promise<boolean> {
  const deleted = deleteReview(id);
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      await supabase.from('customer_reviews').delete().eq('id', id);
    } catch {
      // JSON already deleted
    }
  }
  return deleted;
}
