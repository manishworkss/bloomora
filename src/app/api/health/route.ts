import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    brand: 'The Handmade Craft',
    city: 'Vadodara, Gujarat',
    whatsapp: '+91 8271735190',
    timestamp: new Date().toISOString(),
  });
}
