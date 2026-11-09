import { NextRequest, NextResponse } from 'next/server';
import { isPinServiceable } from '@/lib/delivery-zones-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pin = searchParams.get('pin')?.trim();

  if (!pin || pin.length !== 6 || !/^\d+$/.test(pin)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INVALID_FORMAT',
          message: 'Please provide a valid 6-digit Indian PIN code.',
        },
      },
      { status: 400 }
    );
  }

  // Check Vadodara coverage against persistent database
  const result = isPinServiceable(pin);

  if (!result.serviceable) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UNSERVICEABLE_PIN_CODE',
          message:
            'We currently only deliver within Vadodara city. If you need special delivery outside Vadodara, please connect with us on WhatsApp!',
          details: {
            postalCode: pin,
            assistanceAction: 'whatsapp_enquiry',
          },
        },
      },
      { status: 422 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      isServiceable: true,
      postalCode: pin,
      city: 'Vadodara',
      area: result.zone?.area || 'Vadodara',
      deliveryFee: result.zone?.fee || 50.0,
    },
    message: 'PIN code verified for Vadodara local delivery.',
  });
}
