import { NextResponse } from 'next/server';
import { getProducts, saveProduct } from '@/lib/products-store';
import { Product } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search')?.toLowerCase();

    let products = getProducts(false); // Admin gets all products

    if (category) {
      products = products.filter(
        (p) => p.category?.slug === category || p.categoryId === `cat-${category}`
      );
    }

    if (search) {
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.shortDescription?.toLowerCase().includes(search) ||
          p.slug.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      products,
      count: products.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve admin products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      categoryId,
      basePrice,
      compareAtPrice,
      productType,
      preparationDays,
      stockQuantity,
      lowStockThreshold,
      shortDescription,
      fullDescription,
      imageUrl,
      isFeatured,
    } = body;

    if (!title || !basePrice) {
      return NextResponse.json(
        { success: false, error: 'Title and basePrice are required' },
        { status: 400 }
      );
    }

    const id = `prod-${Date.now()}`;
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const newProduct: Product = {
      id,
      categoryId: categoryId || 'cat-bouquets',
      title,
      slug,
      shortDescription: shortDescription || `${title} crafted with care in Vadodara.`,
      fullDescription:
        fullDescription ||
        `${title} is handmade with soft milk-cotton yarn and assembled with care in Vadodara, Gujarat.`,
      basePrice: Number(basePrice),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      productType: productType === 'MADE_TO_ORDER' ? 'MADE_TO_ORDER' : 'READY_MADE',
      preparationDays: productType === 'MADE_TO_ORDER' ? Number(preparationDays || 3) : 0,
      isPublished: true,
      isFeatured: !!isFeatured,
      hasVariants: false,
      stockQuantity: Number(stockQuantity || 5),
      lowStockThreshold: Number(lowStockThreshold || 2),
      images: [
        {
          id: `img-${Date.now()}`,
          productId: id,
          cloudinaryPublicId: 'custom',
          imageUrl:
            imageUrl?.trim() ||
            'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=600&auto=format&fit=crop',
          altText: title,
          displayOrder: 0,
          isPrimary: true,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveProduct(newProduct);

    return NextResponse.json({
      success: true,
      product: newProduct,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

