import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/status';
import { getProductsAsync } from '@/lib/products-store';
import { getOrdersAsync } from '@/lib/orders-store';
import { getEnquiriesAsync } from '@/lib/enquiries-store';
import { getDeliveryZonesAsync } from '@/lib/delivery-zones-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const isCloud = isSupabaseConfigured();
  const products = await getProductsAsync(false);
  const orders = await getOrdersAsync();
  const enquiries = await getEnquiriesAsync();
  const zones = await getDeliveryZonesAsync();

  return NextResponse.json({
    success: true,
    status: {
      databaseType: isCloud ? 'SUPABASE_CLOUD' : 'LOCAL_PERSISTENT_JSON',
      isCloudConnected: isCloud,
      supabaseUrl: isCloud ? process.env.NEXT_PUBLIC_SUPABASE_URL : null,
      stats: {
        productsCount: products.length,
        ordersCount: orders.length,
        enquiriesCount: enquiries.length,
        zonesCount: zones.length,
      },
    },
  });
}

