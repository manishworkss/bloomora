import { NextResponse, type NextRequest } from 'next/server';
import { getCategoriesAsync, saveCategoryAsync } from '@/lib/categories-store';
import { Category } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await getCategoriesAsync(false);
    return NextResponse.json({ success: true, categories });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    const name = body.name.trim();
    const slug = (body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) || `cat-${Date.now()}`;

    const category: Category = {
      id: body.id || `cat-${Date.now()}`,
      name,
      slug,
      description: body.description?.trim() || '',
      imageUrl: body.imageUrl?.trim() || '',
      displayOrder: Number(body.displayOrder ?? 0),
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      createdAt: body.createdAt || new Date().toISOString(),
    };

    const saved = await saveCategoryAsync(category);
    return NextResponse.json({ success: true, category: saved });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to save category' },
      { status: 500 }
    );
  }
}
