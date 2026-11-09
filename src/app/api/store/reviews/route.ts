import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getReviewsAsync, saveReviewAsync } from '@/lib/reviews-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const reviewSubmitSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerLocation: z.string().min(2, 'City / Locality is required'),
  customerPhone: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  reviewText: z.string().min(10, 'Review should be at least 10 characters'),
  productName: z.string().min(2, 'Please select or enter the handcrafted creation'),
  occasion: z.string().optional(),
  images: z.array(z.string()).optional().default([]),
  videoUrl: z.string().optional().default(''),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featuredOnly = searchParams.get('featured') === 'true';
    const filter = searchParams.get('filter'); // 'photos', 'videos', '5stars'

    let reviews = await getReviewsAsync(true);

    if (featuredOnly) {
      reviews = reviews.filter((r) => r.isFeatured);
    }

    if (filter === 'photos') {
      reviews = reviews.filter((r) => r.images && r.images.length > 0);
    } else if (filter === 'videos') {
      reviews = reviews.filter((r) => !!r.videoUrl && r.videoUrl.trim() !== '');
    } else if (filter === '5stars') {
      reviews = reviews.filter((r) => r.rating === 5);
    }

    return NextResponse.json({
      success: true,
      reviews,
      count: reviews.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = reviewSubmitSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Invalid review submission data.',
            details: validated.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const data = validated.data;

    const newReview = await saveReviewAsync({
      customerName: data.customerName,
      customerLocation: data.customerLocation,
      customerPhone: data.customerPhone,
      rating: data.rating,
      title: data.title,
      reviewText: data.reviewText,
      productName: data.productName,
      occasion: data.occasion,
      images: data.images || [],
      videoUrl: data.videoUrl?.trim() || undefined,
      isVerifiedBuyer: true,
      isFeatured: false,
      status: 'APPROVED', // Auto-approved for immediate delight
    });

    return NextResponse.json(
      {
        success: true,
        review: newReview,
        message: 'Thank you for sharing your love! 🌸 Your story is now part of Our Happy Family.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit review' },
      { status: 500 }
    );
  }
}
