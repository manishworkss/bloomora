import { NextResponse } from 'next/server';
import { getProductById, saveProduct, deleteProduct } from '@/lib/products-store';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = getProductById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve product' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = getProductById(id);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const updates = await request.json();
    const updatedProduct = {
      ...existing,
      ...updates,
      id: existing.id, // prevent mutating id
      updatedAt: new Date().toISOString(),
    };

    saveProduct(updatedProduct);

    return NextResponse.json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = deleteProduct(id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Product not found or already deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product archived successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

