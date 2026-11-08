import React from 'react';
import Link from 'next/link';
import { ShieldAlert, MessageCircle } from 'lucide-react';
import { DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export default function ReturnsPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2 border-b border-border-subtle pb-6">
        <span className="text-xs uppercase font-bold tracking-widest text-secondary">
          Official Policy
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
          Cancellation & Non-Refundable Policy
        </h1>
        <p className="text-xs text-ink-muted">Last updated: November 2026</p>
      </div>

      <div className="prose prose-stone text-sm text-ink-muted leading-relaxed space-y-6">
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex gap-3 items-start">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-700 mt-0.5" />
          <div>
            <p className="font-bold">Important Notice on Handmade Products</p>
            <p className="mt-0.5">
              Because every floral bouquet, crochet flower, and keychain is custom-crafted by hand specifically for your order, all sales are strictly <strong>non-refundable and non-returnable</strong> once crafting has begun.
            </p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-ink">1. Non-Refundable Nature</h2>
          <p>
            Each piece at <strong>The Handmade Craft</strong> requires individual hours of manual hand-knitting, personalized yarn selection, and careful packaging. Unlike mass-manufactured plastic goods, bespoke artisan items cannot be restocked or returned once prepared.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-ink">2. Cancellation Window</h2>
          <p>
            Orders can be cancelled free of charge within <strong>2 hours</strong> of placement, or before the status updates to <code>PROCESSING</code>. To request an immediate cancellation, message us on WhatsApp at{' '}
            <Link
              href={`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:underline"
            >
              +91 8271735190
            </Link>{' '}
            with your Order Reference Number.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-ink">3. Transit Damage & Replacement Guarantee</h2>
          <p>
            We take utmost care packaging your items safely. In the rare event that an item arrives visibly damaged during local Vadodara transit:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Contact us on WhatsApp within <strong>24 hours</strong> of delivery.</li>
            <li>Provide clear photos or an unboxing video showing the damaged portion and packaging.</li>
            <li>Upon verification, we will happily handcraft and dispatch a <strong>free replacement</strong> for you immediately.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-ink">4. Need Assistance?</h2>
          <p>
            We are always here to help ensure you have a wonderful gifting experience. Feel free to chat with us anytime:
          </p>
          <Link
            href={`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-whatsapp text-white text-xs font-semibold shadow-sm hover:brightness-105"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Chat on WhatsApp (+91 8271735190)</span>
          </Link>
        </section>
      </div>
    </div>
  );
}

