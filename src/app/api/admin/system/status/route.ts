import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/status';
import { getProducts } from '@/lib/products-store';
import { getOrders } from '@/lib/orders-store';
import { getEnquiries } from '@/lib/enquiries-store';
import { getDeliveryZones } from '@/lib/delivery-zones-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const isCloud = isSupabaseConfigured();
  const products = getProducts(false);
  const orders = getOrders();
  const enquiries = getEnquiries();
  const zones = getDeliveryZones();

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

