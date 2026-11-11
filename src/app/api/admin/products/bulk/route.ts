import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminSessionFromRequest } from '@/lib/admin-auth';
import { SEED_PRODUCTS_60, isSeededCatalogProduct } from '@/lib/catalog-seed';
import {
  bulkDeleteProductsAsync,
  bulkSetPublishedAsync,
  bulkUpsertProductsAsync,
  getProductsAsync,
} from '@/lib/products-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const bulkActionSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('delete_selected'),
    ids: z.array(z.string().min(1)).min(1),
  }),
  z.object({
    action: z.literal('publish_selected'),
    ids: z.array(z.string().min(1)).min(1),
  }),
  z.object({
    action: z.literal('unpublish_selected'),
    ids: z.array(z.string().min(1)).min(1),
  }),
  z.object({
    action: z.literal('clean_demo_all'),
  }),
  z.object({
    action: z.literal('clean_demo_category'),
    categoryId: z.string().min(1),
  }),
  z.object({
    action: z.literal('restore_demo_catalog'),
  }),
]);

export async function POST(request: NextRequest) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = bulkActionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid bulk operation request.',
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const payload = parsed.data;

    switch (payload.action) {
      case 'delete_selected': {
        const result = await bulkDeleteProductsAsync(payload.ids);
        return NextResponse.json({
          success: true,
          action: payload.action,
          affected: result.deletedCount,
          message: `Removed ${result.deletedCount} creation(s) cleanly.`,
        });
      }

      case 'publish_selected': {
        const result = await bulkSetPublishedAsync(payload.ids, true);
        return NextResponse.json({
          success: true,
          action: payload.action,
          affected: result.updatedCount,
          message: `Published ${result.updatedCount} creation(s) to the live storefront.`,
        });
      }

      case 'unpublish_selected': {
        const result = await bulkSetPublishedAsync(payload.ids, false);
        return NextResponse.json({
          success: true,
          action: payload.action,
          affected: result.updatedCount,
          message: `Hidden ${result.updatedCount} creation(s) from the live storefront.`,
        });
      }

      case 'clean_demo_all': {
        const allProducts = await getProductsAsync(false);
        const demoIds = allProducts.filter((p) => isSeededCatalogProduct(p)).map((p) => p.id);
        if (demoIds.length === 0) {
          return NextResponse.json({
            success: true,
            action: payload.action,
            affected: 0,
            message: 'Starter demo catalog is already clean.',
          });
        }
        const result = await bulkDeleteProductsAsync(demoIds);
        return NextResponse.json({
          success: true,
          action: payload.action,
          affected: result.deletedCount,
          message: `Cleaned ${result.deletedCount} starter demo item(s). Your custom creations remain untouched.`,
        });
      }

      case 'clean_demo_category': {
        const allProducts = await getProductsAsync(false);
        const demoCategoryIds = allProducts
          .filter(
            (p) =>
              isSeededCatalogProduct(p) &&
              (p.categoryId === payload.categoryId || p.category?.id === payload.categoryId)
          )
          .map((p) => p.id);

        if (demoCategoryIds.length === 0) {
          return NextResponse.json({
            success: true,
            action: payload.action,
            affected: 0,
            message: 'No starter demo items remain in this category.',
          });
        }

        const result = await bulkDeleteProductsAsync(demoCategoryIds);
        return NextResponse.json({
          success: true,
          action: payload.action,
          affected: result.deletedCount,
          message: `Cleaned ${result.deletedCount} starter item(s) from the selected category.`,
        });
      }

      case 'restore_demo_catalog': {
        const result = await bulkUpsertProductsAsync(SEED_PRODUCTS_60);
        return NextResponse.json({
          success: true,
          action: payload.action,
          affected: result.count,
          message: `Synced ${result.count} curated starter items (10 per category across 6 categories).`,
        });
      }
    }
  } catch (error) {
    console.error('Admin bulk product action failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process bulk operation.' },
      { status: 500 }
    );
  }
}

