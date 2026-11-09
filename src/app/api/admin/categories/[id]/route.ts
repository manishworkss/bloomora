import { NextResponse, type NextRequest } from 'next/server';
import { deleteCategoryAsync } from '@/lib/categories-store';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteCategoryAsync(id);
    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to delete category' },
      { status: 500 }
    );
  }
}
