import React from 'react';
import Link from 'next/link';
import { MessageCircle, Sparkles } from 'lucide-react';
import { DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2 border-b border-border-subtle pb-6">
        <span className="text-xs uppercase font-bold tracking-widest text-secondary">
          Studio Guide
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
          Crafting &amp; Order Coordination Guide
        </h1>
        <p className="text-xs text-ink-muted">Handcrafted to Order • Coordinated Directly via WhatsApp</p>
      </div>

      <div className="prose prose-stone text-sm text-ink-muted leading-relaxed space-y-6">
        <div className="p-4 rounded-xl bg-surface border border-border-subtle text-ink text-xs flex gap-3 items-start">
          <Sparkles className="w-5 h-5 shrink-0 text-primary mt-0.5" />
          <div>
            <p className="font-bold text-ink">Personalised Care on Every Piece</p>
            <p className="mt-0.5 text-ink-muted">
              Each Bloomora creation is handmade stitch by stitch using soft milk-cotton yarn, finished with signature kraft wrapping, satin ribbon, and your handwritten gift note.
            </p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-ink">1. Crafting &amp; Preparation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose pt-1">
            <div className="p-4 rounded-lg bg-surface border border-border-subtle space-y-1.5">
              <span className="text-xs font-bold text-sage uppercase tracking-wider">Ready Stock Items</span>
              <p className="text-sm font-semibold text-ink">Carefully Packaged &amp; Gift Boxed</p>
              <p className="text-xs text-ink-muted">Items in stock are gift-wrapped and coordinated directly with you on WhatsApp.</p>
            </div>
            <div className="p-4 rounded-lg bg-surface border border-border-subtle space-y-1.5">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Made to Order Creations</span>
              <p className="text-sm font-semibold text-ink">Stitch-by-Stitch Craftsmanship</p>
              <p className="text-xs text-ink-muted">Customized bouquets or colour palettes are crocheted fresh with progress photos shared on WhatsApp.</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-ink">2. Direct WhatsApp Coordination</h2>
          <p>
            Before wrapping is sealed, we share clear studio photos of your finished gift on WhatsApp so you can verify colours, ribbon details, and your custom wish card.
          </p>
          <Link
            href={`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp (+91 8271735190)</span>
          </Link>
        </section>
      </div>
    </div>
  );
}

