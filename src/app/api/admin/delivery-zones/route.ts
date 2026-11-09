import { NextResponse } from 'next/server';
import {
  getDeliveryZonesAsync,
  saveDeliveryZoneAsync,
  toggleDeliveryZoneAsync,
  deleteDeliveryZoneAsync,
} from '@/lib/delivery-zones-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const zones = await getDeliveryZonesAsync();
    return NextResponse.json({ success: true, zones });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve delivery zones' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, pin, area, fee } = body;

    if (!pin) {
      return NextResponse.json(
        { success: false, error: 'PIN code is required' },
        { status: 400 }
      );
    }

    if (action === 'toggle') {
      const updated = await toggleDeliveryZoneAsync(pin);
      return NextResponse.json({ success: true, zone: updated });
    }

    if (action === 'delete') {
      const deleted = await deleteDeliveryZoneAsync(pin);
      return NextResponse.json({ success: true, deleted });
    }

    // Default: Add or update zone
    const saved = await saveDeliveryZoneAsync({
      pin,
      area: area || 'Vadodara Locality',
      fee: Number(fee) || 50,
      active: true,
    });

    return NextResponse.json({ success: true, zone: saved });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update delivery zone' },
      { status: 500 }
    );
  }
}

