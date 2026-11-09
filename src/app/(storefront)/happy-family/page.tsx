'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Star,
  Sparkles,
  MessageCircle,
  ArrowRight,
  Instagram,
  Gift,
  Video,
  Camera,
  CheckCircle2,
  Filter,
  PlusCircle,
  Loader2,
  Play,
  Volume2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CustomerReviewModal } from '@/components/storefront/CustomerReviewModal';
import { CustomerReview } from '@/types';

type FilterTab = 'all' | 'photos' | 'videos' | '5stars';

export default function HappyFamilyPage() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMediaModal, setActiveMediaModal] = useState<{
    type: 'image' | 'video';
    url: string;
    caption?: string;
  } | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/store/reviews');
      const data = await res.json();
      if (data.success && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Filter logic
  const filteredReviews = reviews.filter((r) => {
    if (activeFilter === 'photos') return r.images && r.images.length > 0;
    if (activeFilter === 'videos') return !!r.videoUrl && r.videoUrl.trim() !== '';
    if (activeFilter === '5stars') return r.rating === 5;
    return true;
  });

  const photoCount = reviews.filter((r) => r.images && r.images.length > 0).length;
  const videoCount = reviews.filter((r) => !!r.videoUrl && r.videoUrl.trim() !== '').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 sm:space-y-16 w-full max-w-full overflow-hidden">
      {/* Header Banner with Add Review CTA */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blush/40 border border-border-subtle text-xs font-semibold text-rose uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5 fill-rose" />
          <span>Real Smiles • Real Stories • Real Moments</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl text-ink font-normal leading-tight">
          Our Happy Family
        </h1>

        <p className="text-xs sm:text-base text-ink-muted leading-relaxed">
          Behind every stitch is a human emotion. From anniversary surprises and birthday hugs to heartfelt desk companions, explore authentic unboxings, videos, and stories from our cherished community.
        </p>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setIsModalOpen(true)}
            className="shadow-craft gap-2 font-semibold"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Share Your Story & Review</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs & Stats Bar (Only when reviews exist) */}
      {reviews.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-surface rounded-2xl border border-border-subtle shadow-subtle">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                activeFilter === 'all'
                  ? 'bg-rose text-white shadow-sm'
                  : 'text-ink-muted hover:text-ink hover:bg-canvas'
              }`}
            >
              All Stories ({reviews.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('photos')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                activeFilter === 'photos'
                  ? 'bg-rose text-white shadow-sm'
                  : 'text-ink-muted hover:text-ink hover:bg-canvas'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>With Photos ({photoCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('videos')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                activeFilter === 'videos'
                  ? 'bg-rose text-white shadow-sm'
                  : 'text-ink-muted hover:text-ink hover:bg-canvas'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>With Videos ({videoCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('5stars')}
              className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                activeFilter === '5stars'
                  ? 'bg-rose text-white shadow-sm'
                  : 'text-ink-muted hover:text-ink hover:bg-canvas'
              }`}
            >
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>5 Stars</span>
            </button>
          </div>

          <div className="text-[11px] text-ink-muted shrink-0 hidden sm:block">
            Showing <strong>{filteredReviews.length}</strong> verified customer stories
          </div>
        </div>
      )}

      {/* Stories Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-rose mx-auto" />
          <p className="text-xs text-ink-muted">Arranging customer stories & unboxings...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-16 text-center bg-surface rounded-3xl border border-border-subtle p-8 sm:p-12 space-y-4 max-w-xl mx-auto shadow-subtle">
          <div className="w-14 h-14 rounded-full bg-blush/40 text-rose flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7 fill-rose" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-ink">
            No Stories Published Yet — Be the Very First!
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
            Have you received a Bloomora handmade bouquet, smiling sunflower desk pot, or flower keychain in Vadodara? Click below to share your unboxing video, photo, and review.
          </p>
          <div className="pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsModalOpen(true)}
              className="gap-2 shadow-craft font-semibold"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Share Your Story & Review</span>
            </Button>
          </div>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="py-16 text-center bg-surface rounded-3xl border border-border-subtle p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-blush/40 text-rose flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-ink">No stories found in this filter.</p>
          <Button variant="outline" size="sm" onClick={() => setActiveFilter('all')}>
            View All Stories
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {filteredReviews.map((story) => (
            <article
              key={story.id}
              className="bg-surface rounded-3xl border border-border-subtle overflow-hidden shadow-subtle hover:border-primary/40 hover:shadow-craft transition-all duration-300 flex flex-col justify-between group"
            >
              {/* VIDEO PLAYER (If story has video) */}
              {story.videoUrl && story.videoUrl.trim() !== '' ? (
                <div className="relative aspect-[9/12] sm:aspect-[4/5] bg-ink overflow-hidden">
                  <video
                    src={story.videoUrl}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-ink/70 backdrop-blur-md text-white text-[10px] font-semibold flex items-center gap-1.5 shadow-sm pointer-events-none">
                    <Video className="w-3 h-3 text-rose" />
                    <span>Customer Video Unboxing</span>
                  </div>
                </div>
              ) : story.images && story.images.length > 0 ? (
                /* PHOTO GALLERY (If story has images) */
                <div className="relative aspect-[4/3] bg-canvas overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={story.images[0]}
                    alt={story.productName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={() =>
                      setActiveMediaModal({
                        type: 'image',
                        url: story.images[0],
                        caption: `${story.customerName} • ${story.productName}`,
                      })
                    }
                  />

                  {/* Multi-image indicator badge */}
                  {story.images.length > 1 && (
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-ink/75 backdrop-blur-sm text-white text-[10px] font-semibold flex items-center gap-1 shadow-sm">
                      <Camera className="w-3 h-3" />
                      <span>+{story.images.length - 1} photos</span>
                    </div>
                  )}

                  {story.occasion && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur-md border border-border-subtle text-[10px] font-semibold text-rose shadow-sm">
                      {story.occasion}
                    </div>
                  )}
                </div>
              ) : (
                /* Text-only quote top banner */
                <div className="px-6 pt-6 pb-2">
                  {story.occasion && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-blush/40 border border-border-subtle text-[10px] font-semibold text-rose">
                      {story.occasion}
                    </span>
                  )}
                </div>
              )}

              {/* Story Content Card */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  {/* Star Rating & Verified Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-0.5" aria-label={`${story.rating} out of 5 stars`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < story.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-border-default'
                          }`}
                        />
                      ))}
                    </div>

                    {story.isVerifiedBuyer && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>

                  {/* Title (if present) */}
                  {story.title && (
                    <h3 className="font-serif text-base font-bold text-ink leading-snug">
                      &ldquo;{story.title}&rdquo;
                    </h3>
                  )}

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-ink leading-relaxed">
                    &ldquo;{story.reviewText}&rdquo;
                  </p>
                </div>

                {/* Footer: Customer Name & Creation Tag */}
                <div className="pt-4 border-t border-border-subtle/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="font-serif text-sm font-bold text-ink">{story.customerName}</p>
                    <span className="text-[11px] text-ink-muted">{story.customerLocation}</span>
                  </div>

                  <p className="text-[11px] text-rose font-medium truncate">
                    Tagged: <strong>{story.productName}</strong>
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Community Invite Banner */}
      <div className="rounded-3xl bg-blush/30 border border-border-subtle p-8 sm:p-12 text-center space-y-6 max-w-3xl mx-auto">
        <div className="w-12 h-12 rounded-full bg-surface border border-border-subtle flex items-center justify-center mx-auto text-rose shadow-sm">
          <Sparkles className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
            Have You Received a Bloomora Creation?
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted max-w-lg mx-auto leading-relaxed">
            We would love to feature your smile! Click below to add your review, unboxing video, or tag us on Instagram <span className="font-semibold text-ink">@bloomora.creation</span>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsModalOpen(true)}
            className="gap-2 w-full sm:w-auto shadow-craft"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Write a Review</span>
          </Button>

          <Link
            href="https://instagram.com/bloomora.creation"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button variant="outline" size="md" className="gap-2 w-full sm:w-auto">
              <Instagram className="w-4 h-4 text-rose" />
              <span>Tag @bloomora.creation</span>
            </Button>
          </Link>

          <Link href="/shop" className="w-full sm:w-auto">
            <Button variant="secondary" size="md" className="gap-2 w-full sm:w-auto">
              <Gift className="w-4 h-4" />
              <span>Shop Creations</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Customer Review Modal */}
      <CustomerReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitted={fetchReviews}
      />

      {/* Image Zoom Modal */}
      {activeMediaModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setActiveMediaModal(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] bg-surface rounded-2xl overflow-hidden p-2 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeMediaModal.url}
              alt="Customer review photo"
              className="max-h-[80vh] w-auto object-contain rounded-xl"
            />
            {activeMediaModal.caption && (
              <p className="text-center text-xs font-semibold text-ink pt-2">
                {activeMediaModal.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
