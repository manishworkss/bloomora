import { NextRequest, NextResponse } from 'next/server';
import { getReviewsAsync, saveReviewAsync } from '@/lib/reviews-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const reviews = await getReviewsAsync(false); // Admin gets all (pending, approved, rejected)
    return NextResponse.json({
      success: true,
      reviews,
      count: reviews.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve admin reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerLocation,
      customerPhone,
      rating,
      title,
      reviewText,
      productName,
      occasion,
      images,
      videoUrl,
      isFeatured,
      status,
    } = body;

    if (!customerName || !reviewText) {
      return NextResponse.json(
        { success: false, error: 'Customer name and review text are required.' },
        { status: 400 }
      );
    }

    const review = await saveReviewAsync({
      customerName,
      customerLocation: customerLocation || 'Vadodara, Gujarat',
      customerPhone,
      rating: Number(rating) || 5,
      title,
      reviewText,
      productName: productName || 'Handmade Creation',
      occasion,
      images: Array.isArray(images) ? images : [],
      videoUrl: videoUrl?.trim() || undefined,
      isVerifiedBuyer: true,
      isFeatured: !!isFeatured,
      status: status || 'APPROVED',
    });

    return NextResponse.json({
      success: true,
      review,
      message: 'Review created successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save review' },
      { status: 500 }
    );
  }
}

