import { NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/products-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = getProductBySlug(slug);

    if (!product || !product.isPublished) {
      return NextResponse.json(
        { success: false, error: 'Product not found or not published' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve product details' },
      { status: 500 }
    );
  }
}

