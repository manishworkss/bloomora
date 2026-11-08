import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Instagram, Sparkles, MessageCircle, MapPin } from 'lucide-react';
import { DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Intro Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs uppercase font-bold tracking-widest text-rose">
          Our Story & Philosophy
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink leading-tight">
          Crafting Warmth at Bloomora
        </h1>
        <p className="text-base text-ink-muted leading-relaxed">
          Welcome to <strong className="text-ink">Bloomora — Handcrafted Creations</strong>. We are an artisan studio based in Vadodara, Gujarat, devoted to creating emotional, handcrafted keepsakes.
        </p>
      </div>

      {/* Visual Showcase */}
      <div className="relative rounded-3xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-surface border border-border-subtle shadow-subtle flex items-center justify-center p-8">
        <div className="relative w-64 h-24 sm:w-80 sm:h-28 max-w-full">
          <Image
            src="/images/bloomora-logo.png"
            alt="Bloomora Handcrafted Creations Logo"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Narrative Story */}
      <div className="prose prose-stone text-base text-ink-muted leading-relaxed space-y-6">
        <h2 className="font-serif text-2xl font-bold text-ink">The Bloomora Journey</h2>
        <p>
          In a world increasingly driven by mass manufacturing, fast-fashion trends, and disposable plastic novelties, thoughtful human connection often gets lost. We created <strong>Bloomora</strong> to bring back the magic of slow, intentional craftsmanship.
        </p>
        <p>
          Whether it is a smiling sunflower desk pot to cheer up a loved one, a customized pastel bouquet for an anniversary, or a personalized keychain carried every day, each creation has a soul of its own. Unlike natural fresh flowers that wither away after three days, our everlasting crochet blooms remain vibrant forever.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-surface border border-border-subtle space-y-2 text-center">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Heart className="w-5 h-5 fill-primary" />
          </div>
          <h3 className="font-serif text-lg font-bold text-ink">100% Handcrafted</h3>
          <p className="text-xs text-ink-muted">
            Zero automated knitting machines. Every petal and stitch is made by human hands.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-surface border border-border-subtle space-y-2 text-center">
          <div className="w-10 h-10 rounded-full bg-blush text-rose flex items-center justify-center mx-auto">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-ink">Premium Yarns</h3>
          <p className="text-xs text-ink-muted">
            We use hypoallergenic, anti-pilling milk cotton yarn for soft texture and vivid colors.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-surface border border-border-subtle space-y-2 text-center">
          <div className="w-10 h-10 rounded-full bg-sage/20 text-sage flex items-center justify-center mx-auto">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-ink">Rooted in Vadodara</h3>
          <p className="text-xs text-ink-muted">
            Proudly based in Vadodara, Gujarat, with personalized doorstep delivery across the city.
          </p>
        </div>
      </div>

      {/* Connect Banner */}
      <div className="rounded-2xl bg-surface border border-border-subtle p-8 text-center space-y-4 shadow-craft">
        <h3 className="font-serif text-2xl font-bold text-ink">Follow Bloomora on Instagram</h3>
        <p className="text-sm text-ink-muted max-w-md mx-auto">
          See behind-the-scenes knotting videos, new collection previews, and customer appreciation on our Instagram.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="https://instagram.com/the_.handmadecraft"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="primary">
              <Instagram className="w-4 h-4 mr-2" />
              <span>@the_.handmadecraft</span>
            </Button>
          </Link>
          <Link
            href={`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="whatsapp">
              <MessageCircle className="w-4 h-4 fill-current mr-2" />
              <span>Chat on WhatsApp (+91 8271735190)</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
