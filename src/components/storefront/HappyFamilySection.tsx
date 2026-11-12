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
  Users,
  Instagram,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CustomerReviewModal } from './CustomerReviewModal';
import { MediaLightbox } from './MediaLightbox';
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
    images: string[];
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-5 w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-border-subtle pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose uppercase tracking-widest">
            <Heart className="w-3.5 h-3.5 fill-rose" />
            <span>Community Stories</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
            Our Happy Family
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="gap-1.5 font-semibold text-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Review</span>
          </Button>

          <Link href="/happy-family">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Users className="w-3.5 h-3.5 text-rose" />
              <span>Gallery ({reviews.length})</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </div>

      {reviews.length === 0 ? (
        /* Compact Mobile-Friendly Review Strip */
        <div className="bg-surface rounded-2xl border border-border-subtle p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-blush/50 text-rose flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 fill-rose" />
            </div>
            <div>
              <p className="font-serif text-base sm:text-lg font-semibold text-ink">
                Received a Bloomora gift?
              </p>
              <p className="text-xs text-ink-muted">
                Share an unboxing photo or video with our community.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="gap-1.5 font-semibold flex-1 sm:flex-initial"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Share Unboxing</span>
            </Button>

            <Link
              href="https://instagram.com/bloomora.creation"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial"
            >
              <Button variant="outline" size="sm" className="gap-1.5 w-full">
                <Instagram className="w-3.5 h-3.5 text-rose" />
                <span>Instagram</span>
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Filter Tabs */}
          <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-none">
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
                            images: story.images,
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

      {/* Shared Multi-Photo Lightbox Modal */}
      {activeMediaModal && (
        <MediaLightbox
          images={activeMediaModal.images}
          caption={activeMediaModal.caption}
          alt="Customer review photo"
          onClose={() => setActiveMediaModal(null)}
        />
      )}
    </section>
  );
}

