import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/admin-auth';
import { isSupabaseConfigured } from '@/lib/supabase/status';
import { getProductsAsync } from '@/lib/products-store';
import { getOrdersAsync } from '@/lib/orders-store';
import { getEnquiriesAsync } from '@/lib/enquiries-store';
import { getDeliveryZonesAsync } from '@/lib/delivery-zones-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const isCloud = isSupabaseConfigured();
  const [products, orders, enquiries, zones] = await Promise.all([
    getProductsAsync(false),
    getOrdersAsync(),
    getEnquiriesAsync(),
    getDeliveryZonesAsync(),
  ]);

  let supabaseHost: string | null = null;
  if (isCloud && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      supabaseHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;
    } catch {
      supabaseHost = 'configured';
    }
  }

  return NextResponse.json({
    success: true,
    status: {
      databaseType: isCloud ? 'SUPABASE_CLOUD' : 'LOCAL_PERSISTENT_JSON',
      isCloudConnected: isCloud,
      supabaseHost,
      stats: {
        productsCount: products.length,
        ordersCount: orders.length,
        enquiriesCount: enquiries.length,
        zonesCount: zones.length,
      },
    },
  });
}
