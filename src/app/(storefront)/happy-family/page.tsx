import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, Sparkles, MessageCircle, ArrowRight, Instagram, Gift } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export const metadata = {
  title: 'Our Happy Family | Bloomora Handcrafted Creations',
  description:
    'Heartfelt gifting moments, customer smiles, and cherished creations from our happy community in Vadodara, Gujarat.',
};

const FAMILY_STORIES = [
  {
    id: 'story-1',
    name: 'Ananya & Sahil',
    occasion: '1st Wedding Anniversary Surprise',
    location: 'Alkapuri, Vadodara',
    quote:
      'I wanted a gift that wouldn’t die in three days. Sahil surprised me with the lavender and tulip bouquet. It now sits proudly on our bedroom console and brings back all the wedding memories!',
    item: 'Everlasting Lavender & Tulip Bouquet',
    rating: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'story-2',
    name: 'Pooja Dave',
    occasion: 'Promotion Desk Gift',
    location: 'Gotri Road, Vadodara',
    quote:
      'The mini smiling sunflower is the cutest thing on my entire work desk. Every colleague who walks past my cabin smiles at it. The craftsmanship is pure magic!',
    item: 'Mini Smiling Sunflower Desk Pot',
    rating: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'story-3',
    name: 'Meera & Her Bridesmaids',
    occasion: 'Bespoke Bridesmaid Keepsakes',
    location: 'Fatehgunj, Vadodara',
    quote:
      'We ordered 12 custom daisy keychains with personalized color tags for my bridesmaids. The creator at Bloomora hand-packaged each one with satin ribbon and little handwritten cards. Unbelievable attention to detail!',
    item: 'Handmade Daisy Charm Keychains',
    rating: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'story-4',
    name: 'Kavita Patel',
    occasion: 'Mom’s 60th Birthday Celebration',
    location: 'Akota, Vadodara',
    quote:
      'My mom loves handmade textiles and craft. When she opened the pastel rose bouquet, she couldn’t believe every petal was hand-crocheted. It was the centerpiece of her birthday party.',
    item: 'Custom Pastel Rose Keepsake Bouquet',
    rating: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'story-5',
    name: 'Riddhi Shah',
    occasion: 'Self-Care & Study Desk Decor',
    location: 'Manjalpur, Vadodara',
    quote:
      'The blooming pink rose pot brightens up late-night study sessions. It never needs watering and always looks as fresh as the day it arrived.',
    item: 'Blooming Pink Rose Desk Blossom',
    rating: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'story-6',
    name: 'Devanshi & Priya',
    occasion: 'Best Friend Farewell Gift',
    location: 'Karelibaug, Vadodara',
    quote:
      'Priya moved to Bengaluru for work, so I gifted her the strawberry amigurumi keychain to hang on her handbag. She loved that it came from our hometown in Vadodara!',
    item: 'Fluffy Strawberry Amigurumi Keychain',
    rating: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=800&auto=format&fit=crop',
  },
];

export default function HappyFamilyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 sm:space-y-24 w-full max-w-full overflow-hidden">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blush/40 border border-border-subtle text-xs font-semibold text-rose uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5 fill-rose" />
          <span>Real Smiles • Real Stories</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl text-ink font-normal leading-tight">
          Our Happy Family
        </h1>

        <p className="text-xs sm:text-base text-ink-muted leading-relaxed">
          Behind every stitch is a human emotion. From birthday surprises and wedding anniversaries to everyday gestures of love, explore how Bloomora creations bring everlasting smiles to homes across Vadodara.
        </p>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {FAMILY_STORIES.map((story) => (
          <div
            key={story.id}
            className="bg-surface rounded-3xl border border-border-subtle overflow-hidden shadow-subtle hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Visual Header */}
            <div className="relative aspect-[4/3] bg-canvas overflow-hidden">
              <Image
                src={story.imageUrl}
                alt={story.item}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-surface/90 backdrop-blur-sm text-[11px] font-semibold text-ink border border-border-subtle shadow-sm">
                {story.occasion}
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex gap-1 text-amber-500">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-ink leading-relaxed italic">
                  &ldquo;{story.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-border-subtle/50 space-y-1">
                <p className="font-serif text-base font-semibold text-ink">{story.name}</p>
                <p className="text-[11px] text-ink-muted">
                  {story.location} • <span className="text-rose font-medium">{story.item}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Community Invite Banner */}
      <div className="rounded-3xl bg-blush/30 border border-border-subtle p-8 sm:p-12 text-center space-y-6 max-w-3xl mx-auto">
        <div className="w-12 h-12 rounded-full bg-surface border border-border-subtle flex items-center justify-center mx-auto text-rose shadow-sm">
          <Sparkles className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
            Share Your Bloomora Moment
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted max-w-lg mx-auto leading-relaxed">
            Tag us in your unboxing videos and photos on Instagram <span className="font-semibold text-ink">@the_.handmadecraft</span> or send us your story on WhatsApp to be featured in Our Happy Family!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="https://instagram.com/the_.handmadecraft"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="md" className="gap-2 w-full sm:w-auto">
              <Instagram className="w-4 h-4 text-rose" />
              <span>Tag @the_.handmadecraft</span>
            </Button>
          </Link>

          <Link href="/shop">
            <Button variant="primary" size="md" className="gap-2 w-full sm:w-auto">
              <Gift className="w-4 h-4" />
              <span>Explore Creations</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

