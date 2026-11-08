import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | Bloomora Handcrafted Creations',
  description: 'Terms and conditions governing orders and custom commissions at Bloomora, Vadodara.',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Home</span>
      </Link>

      <div className="space-y-3">
        <span className="text-xs uppercase font-bold tracking-widest text-rose">
          Terms & Guidelines
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
          Terms of Service
        </h1>
        <p className="text-xs text-ink-muted">
          Last updated: November 2026 • Bloomora Studio, Vadodara, Gujarat
        </p>
      </div>

      <div className="prose prose-stone text-xs sm:text-sm text-ink-muted leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-ink">1. Handcrafted Nature of Creations</h2>
          <p>
            Every product listed on Bloomora is individually hand-knitted and assembled with care. Subtle variations in stitch density, floral shaping, and color shades are hallmarks of authentic artisanal slow craft and make every piece uniquely yours.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-ink">2. Pricing & Payments</h2>
          <p>
            All prices are quoted in Indian Rupees (INR ₹). Payment is completed via UPI (Google Pay, PhonePe, Paytm) upon receiving your formatted WhatsApp order receipt. Orders are confirmed for dispatch once payment is received.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-ink">3. Delivery & Fulfillment</h2>
          <p>
            Delivery is available across all 17 serviceable PIN codes in Vadodara city (390001–390025). Ready-to-ship items ship within 24–48 hours; custom made-to-order commissions require 3–5 working days for crafting.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-ink">4. Non-Refundable Policy</h2>
          <p>
            Because every item is handmade to order, all sales are strictly non-refundable. If any item arrives damaged during courier transit, report it with photos to our WhatsApp within 24 hours of delivery for an immediate free replacement.
          </p>
        </section>
      </div>
    </div>
  );
}

