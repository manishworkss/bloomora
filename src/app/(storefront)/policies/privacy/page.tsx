import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Bloomora Handcrafted Creations',
  description: 'How Bloomora handles customer contact and delivery information in Vadodara, Gujarat.',
};

export default function PrivacyPolicyPage() {
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
          Legal & Privacy
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
          Privacy Policy
        </h1>
        <p className="text-xs text-ink-muted">
          Last updated: November 2026 • Bloomora Studio, Vadodara, Gujarat
        </p>
      </div>

      <div className="prose prose-stone text-xs sm:text-sm text-ink-muted leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-ink">1. Information We Collect</h2>
          <p>
            When you place an order or make a custom enquiry with Bloomora, we collect only the details necessary to fulfill your handcrafted gift: recipient name, delivery address, 6-digit Vadodara PIN code, and WhatsApp contact phone number.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-ink">2. How We Use Your Data</h2>
          <p>
            Your information is strictly used for order fulfillment, local courier dispatch across Vadodara, and WhatsApp communication regarding payment confirmation and transit updates. We never sell, share, or market your personal information to third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-ink">3. WhatsApp Communications</h2>
          <p>
            By opting for WhatsApp-assisted checkout, you receive direct confirmation and payment coordination via our official number (+91 8271735190).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-ink">4. Contacting Us</h2>
          <p>
            For any privacy inquiries or data removal requests, contact our artisan creator directly at{' '}
            <a href="https://wa.me/918271735190" className="text-rose font-semibold underline">
              +91 8271735190
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

