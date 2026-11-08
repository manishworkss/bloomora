import { NextRequest, NextResponse } from 'next/server';

const VADODARA_PINS = [
  '390001', '390002', '390004', '390007', '390008', '390010',
  '390011', '390012', '390015', '390018', '390019', '390020',
  '390021', '390022', '390023', '390024', '390025',
];

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

  // Check Vadodara coverage
  const isServiceable = VADODARA_PINS.includes(pin) || pin.startsWith('390');

  if (!isServiceable) {
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
      deliveryFee: 50.0,
      estimatedDays: '1-2 Days',
    },
    message: 'PIN code verified for Vadodara local delivery.',
  });
}
