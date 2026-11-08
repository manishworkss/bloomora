import React from 'react';
import Link from 'next/link';
import { Truck, MapPin } from 'lucide-react';
import { DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2 border-b border-border-subtle pb-6">
        <span className="text-xs uppercase font-bold tracking-widest text-secondary">
          Delivery Guide
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
          Shipping & Local Delivery Policy
        </h1>
        <p className="text-xs text-ink-muted">Vadodara, Gujarat City-Wide Coverage</p>
      </div>

      <div className="prose prose-stone text-sm text-ink-muted leading-relaxed space-y-6">
        <div className="p-4 rounded-xl bg-surface border border-border-subtle text-ink text-xs flex gap-3 items-start">
          <MapPin className="w-5 h-5 shrink-0 text-primary mt-0.5" />
          <div>
            <p className="font-bold text-ink">City-Wide Vadodara Coverage</p>
            <p className="mt-0.5 text-ink-muted">
              We proudly deliver handcrafted creations across all areas and PIN codes of Vadodara (including Alkapuri, Race Course, Gotri, Akota, Fatehgunj, Manjalpur, Karelibaug, Sayajigunj, Waghodia Road, and surrounding localities).
            </p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-ink">1. Fulfillment & Delivery Timelines</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose pt-1">
            <div className="p-4 rounded-lg bg-surface border border-border-subtle space-y-1.5">
              <span className="text-xs font-bold text-sage uppercase tracking-wider">Ready to Ship Items</span>
              <p className="text-sm font-semibold text-ink">Dispatched in 24–48 Hours</p>
              <p className="text-xs text-ink-muted">Items currently in shelf stock are packaged and dispatched swiftly.</p>
            </div>
            <div className="p-4 rounded-lg bg-surface border border-border-subtle space-y-1.5">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Made to Order Creations</span>
              <p className="text-sm font-semibold text-ink">Handmade in 2–4 Days</p>
              <p className="text-xs text-ink-muted">Customized bouquets or colors are crocheted fresh upon order confirmation.</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-ink">2. Delivery Charges</h2>
          <p>
            A flat local delivery charge (standard ₹50 across Vadodara) is applied at checkout to cover local rider transit and safe packaging.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-ink">3. Delivery Coordination</h2>
          <p>
            Because we use trusted local couriers and riders in Vadodara, the delivery partner will call your registered 10-digit mobile number upon reaching your address or landmark.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-ink">4. Have Questions About Your Area?</h2>
          <p>
            If you need urgent same-day delivery or have specific timing requirements, reach out to us on WhatsApp:
          </p>
          <Link
            href={`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            <Truck className="w-4 h-4" />
            <span>Chat on WhatsApp (+91 8271735190)</span>
          </Link>
        </section>
      </div>
    </div>
  );
}
