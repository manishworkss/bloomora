'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Star,
  Heart,
  Video,
  Camera,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  Sparkles,
  Users,
  Play,
  X,
  Instagram,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CustomerReviewModal } from './CustomerReviewModal';
import { CustomerReview } from '@/types';

interface HappyFamilySectionProps {
  initialReviews: CustomerReview[];
}

type FilterTab = 'all' | 'photos' | 'videos' | '5stars';

export function HappyFamilySection({ initialReviews }: HappyFamilySectionProps) {
  const [reviews, setReviews] = useState<CustomerReview[]>(initialReviews);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMediaModal, setActiveMediaModal] = useState<{
    type: 'image' | 'video';
    url: string;
    caption?: string;
  } | null>(null);

  const reloadReviews = async () => {
    try {
      const res = await fetch('/api/store/reviews');
      const data = await res.json();
      if (data.success && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error('Failed to reload reviews:', err);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (activeFilter === 'photos') return r.images && r.images.length > 0;
    if (activeFilter === 'videos') return !!r.videoUrl && r.videoUrl.trim() !== '';
    if (activeFilter === '5stars') return r.rating === 5;
    return true;
  });

  const photoCount = reviews.filter((r) => r.images && r.images.length > 0).length;
  const videoCount = reviews.filter((r) => !!r.videoUrl && r.videoUrl.trim() !== '').length;
  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 w-full">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-subtle pb-5">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blush/40 border border-border-subtle text-[11px] font-semibold text-rose uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-rose" />
            <span>Customer Reviews • Photos & Video Unboxings</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl text-ink font-normal">
            Our Happy Family & Reviews
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted max-w-xl">
            Real client reviews, unboxing videos, and keepsake photos from homes across Vadodara.
          </p>
        </div>

        <div className="flex items-center gap-2.5 justify-center md:justify-end flex-wrap">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="gap-1.5 shadow-craft font-semibold text-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Your Review & Media</span>
          </Button>

          <Link href="/happy-family">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Users className="w-3.5 h-3.5 text-rose" />
              <span>View All Reviews ({reviews.length})</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </Button>
          </Link>
        </div>
      </div>

      {reviews.length === 0 ? (
        /* Empty State: Prompt real customers to submit */
        <div className="py-12 sm:py-16 text-center bg-surface rounded-3xl border border-border-subtle p-8 sm:p-12 space-y-5 max-w-2xl mx-auto shadow-subtle">
          <div className="w-14 h-14 rounded-full bg-blush/50 text-rose flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7 fill-rose" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
              Be the First to Share Your Bloomora Story!
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-lg mx-auto">
              Every handcrafted flower and keepsake bouquet is made with slow needlecraft and love in Vadodara. Have you received a Bloomora creation? Click below to share your authentic review, photos, or unboxing video!
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsModalOpen(true)}
              className="gap-2 shadow-craft w-full sm:w-auto font-semibold"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Share Your Review & Unboxing</span>
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
          </div>
        </div>
      ) : (
        <>
          {/* Filter Tabs */}
          <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
            <div className="flex items-center gap-1.5 bg-surface p-1.5 rounded-2xl border border-border-subtle shadow-subtle shrink-0">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
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
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
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
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
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
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeFilter === '5stars'
                    ? 'bg-rose text-white shadow-sm'
                    : 'text-ink-muted hover:text-ink hover:bg-canvas'
                }`}
              >
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>5 Stars ({fiveStarCount})</span>
              </button>
            </div>

            <div className="hidden sm:block text-[11px] text-ink-muted">
              Showing <strong>{filteredReviews.length}</strong> verified experiences
            </div>
          </div>

          {/* Stories Grid */}
          {filteredReviews.length === 0 ? (
            <div className="py-12 text-center bg-surface rounded-2xl border border-border-subtle p-6 space-y-3">
              <Heart className="w-8 h-8 text-rose/50 mx-auto" />
              <p className="text-xs text-ink-muted">No stories found under this filter.</p>
              <Button variant="outline" size="sm" onClick={() => setActiveFilter('all')}>
                Reset to All Stories
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
              {filteredReviews.slice(0, 6).map((story) => (
                <article
                  key={story.id}
                  className="bg-surface rounded-3xl border border-border-subtle overflow-hidden shadow-subtle hover:border-primary/40 hover:shadow-craft transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Media Block: Video or Photo */}
                  {story.videoUrl && story.videoUrl.trim() !== '' ? (
                    <div className="relative aspect-[4/3] bg-ink overflow-hidden">
                      <video
                        src={story.videoUrl}
                        controls
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-ink/75 backdrop-blur-sm text-white text-[10px] font-semibold flex items-center gap-1 shadow-sm pointer-events-none">
                        <Video className="w-3 h-3 text-rose" />
                        <span>Video Unboxing</span>
                      </div>
                    </div>
                  ) : story.images && story.images.length > 0 ? (
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

                      {story.images.length > 1 && (
                        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-ink/75 backdrop-blur-sm text-white text-[10px] font-semibold flex items-center gap-1 shadow-sm">
                          <Camera className="w-3 h-3" />
                          <span>+{story.images.length - 1} photos</span>
                        </div>
                      )}

                      {story.occasion && (
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-surface/90 backdrop-blur-md border border-border-subtle text-[10px] font-semibold text-rose shadow-sm">
                          {story.occasion}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="px-5 pt-5 pb-1">
                      {story.occasion && (
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-blush/40 border border-border-subtle text-[10px] font-semibold text-rose">
                          {story.occasion}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Review Card Content */}
                  <div className="p-5 sm:p-6 space-y-3.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      {/* Star Rating & Verified Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
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
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Verified Buyer</span>
                          </span>
                        )}
                      </div>

                      {story.title && (
                        <h3 className="font-serif text-sm font-bold text-ink leading-snug">
                          &ldquo;{story.title}&rdquo;
                        </h3>
                      )}

                      <p className="text-xs sm:text-sm text-ink leading-relaxed">
                        &ldquo;{story.reviewText}&rdquo;
                      </p>
                    </div>

                    {/* Footer: Customer Name & Creation Tag */}
                    <div className="pt-3 border-t border-border-subtle/50 space-y-1">
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
        </>
      )}

      {/* Review Submission Modal */}
      <CustomerReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitted={reloadReviews}
      />

      {/* Image Lightbox Modal */}
      {activeMediaModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setActiveMediaModal(null)}
        >
          <div
            className="relative max-w-2xl max-h-[85vh] bg-surface rounded-2xl overflow-hidden p-2 shadow-2xl space-y-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveMediaModal(null)}
              className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-ink/70 text-white flex items-center justify-center hover:bg-ink"
            >
              <X className="w-4 h-4" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeMediaModal.url}
              alt="Enlarged review photo"
              className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain mx-auto"
            />
            {activeMediaModal.caption && (
              <p className="text-center text-xs font-semibold text-ink pt-1 pb-1">
                {activeMediaModal.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

