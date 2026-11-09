import { NextResponse } from 'next/server';
import { getProductsAsync } from '@/lib/products-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';

    let products = await getProductsAsync(true);

    if (category) {
      products = products.filter(
        (p) =>
          p.category?.slug === category ||
          p.category?.id === category ||
          p.categoryId === category ||
          p.categoryId === `cat-${category}`
      );
    }

    if (featured) {
      products = products.filter((p) => p.isFeatured);
    }

    return NextResponse.json({
      success: true,
      products,
      count: products.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve products' },
      { status: 500 }
    );
  }
}

