import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { saveEnquiryAsync } from '@/lib/enquiries-store';

const enquirySchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerPhone: z.string().min(10, 'Valid 10-digit mobile number required'),
  occasion: z.string().optional(),
  neededByDate: z.string().optional(),
  budgetEstimate: z.string().optional(),
  message: z.string().min(5, 'Please provide details of your request'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = enquirySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Invalid inquiry data.',
            details: validated.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const created = await saveEnquiryAsync(validated.data);

    return NextResponse.json(
      {
        success: true,
        data: created,
        message: 'Your custom request has been recorded. We will connect on WhatsApp shortly!',
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

