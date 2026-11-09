'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Star,
  Heart,
  Camera,
  Video,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  Play,
  X,
  Upload,
  AlertCircle,
  Loader2,
  Check,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CustomerReview } from '@/types';

type FilterTab = 'ALL' | 'PENDING' | 'APPROVED' | 'MEDIA' | 'FEATURED';

const PRESET_OCCASIONS = [
  'Wedding Anniversary Surprise',
  'Birthday Gift',
  'Promotion / Desk Gift',
  'Bridesmaid Keepsakes',
  'Friendship / Farewell',
  'Self-Love & Home Decor',
  'Romantic Surprise',
  'Festival Celebration',
  'WhatsApp Feedback',
  'Other Special Moment',
];

const PRESET_PRODUCTS = [
  'Everlasting Crochet Lavender & Tulip Bouquet',
  'Mini Smiling Sunflower Crochet Desk Pot',
  'Handmade Daisy Flower Charm Keychain',
  'Customizable Pastel Rose & Daisy Keepsake Bouquet',
  'Blooming Pink Rose Desk Blossom',
  'Fluffy Strawberry Amigurumi Keychain',
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Manual Review Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('Vadodara, Gujarat');
  const [formPhone, setFormPhone] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState('');
  const [formText, setFormText] = useState('');
  const [formProduct, setFormProduct] = useState(PRESET_PRODUCTS[0]);
  const [formOccasion, setFormOccasion] = useState(PRESET_OCCASIONS[0]);
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formImageUrlInput, setFormImageUrlInput] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formIsFeatured, setFormIsFeatured] = useState(true);
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Media Zoom Lightbox
  const [activeMediaModal, setActiveMediaModal] = useState<{
    type: 'image' | 'video';
    url: string;
    caption?: string;
  } | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/reviews');
      const data = await res.json();
      if (data.success && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error('Failed to load admin reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Update Status / Featured
  const handleUpdate = async (id: string, updates: { status?: CustomerReview['status']; isFeatured?: boolean }) => {
    try {
      setActionLoadingId(id);
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success && data.review) {
        setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, ...data.review } : r)));
      }
    } catch (err) {
      console.error('Failed to update review:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete Review
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the story from "${name}"?`)) return;
    try {
      setActionLoadingId(id);
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete review:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle image upload via base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle video upload via base64
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('video/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormVideoUrl(event.target!.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit manual review
  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formName.trim() || !formText.trim()) {
      setFormError('Customer name and review quote are required.');
      return;
    }

    try {
      setFormIsSubmitting(true);
      const res = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formName.trim(),
          customerLocation: formLocation.trim() || 'Vadodara, Gujarat',
          customerPhone: formPhone.trim() || undefined,
          rating: formRating,
          title: formTitle.trim() || undefined,
          reviewText: formText.trim(),
          productName: formProduct,
          occasion: formOccasion,
          images: formImages,
          videoUrl: formVideoUrl.trim() || undefined,
          isFeatured: formIsFeatured,
          status: 'APPROVED',
        }),
      });

      const data = await res.json();
      if (data.success && data.review) {
        setReviews((prev) => [data.review, ...prev]);
        setIsAddModalOpen(false);
        // Reset form
        setFormName('');
        setFormTitle('');
        setFormText('');
        setFormImages([]);
        setFormVideoUrl('');
      } else {
        setFormError(data.error || 'Failed to save review.');
      }
    } catch (err: any) {
      setFormError(err.message || 'Error occurred while saving review.');
    } finally {
      setFormIsSubmitting(false);
    }
  };

  // Filtering
  const filteredReviews = reviews.filter((r) => {
    // Tab filter
    if (activeTab === 'PENDING' && r.status !== 'PENDING') return false;
    if (activeTab === 'APPROVED' && r.status !== 'APPROVED') return false;
    if (activeTab === 'FEATURED' && !r.isFeatured) return false;
    if (activeTab === 'MEDIA' && (!r.images?.length && !r.videoUrl)) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.customerName?.toLowerCase().includes(q);
      const matchLoc = r.customerLocation?.toLowerCase().includes(q);
      const matchText = r.reviewText?.toLowerCase().includes(q);
      const matchProd = r.productName?.toLowerCase().includes(q);
      const matchOcc = r.occasion?.toLowerCase().includes(q);
      return matchName || matchLoc || matchText || matchProd || matchOcc;
    }

    return true;
  });

  const countPending = reviews.filter((r) => r.status === 'PENDING').length;
  const countApproved = reviews.filter((r) => r.status === 'APPROVED').length;
  const countFeatured = reviews.filter((r) => r.isFeatured).length;
  const countMedia = reviews.filter((r) => (r.images && r.images.length > 0) || !!r.videoUrl).length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose animate-pulse" />
            <span className="text-xs uppercase font-bold tracking-widest text-rose">
              Social Proof & Client Stories
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-ink font-bold mt-1">
            Happy Client Reviews & Media
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Curate authentic unboxings, customer photos, and heartwarming feedback from the Bloomora family.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/happy-family" target="_blank">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Eye className="w-4 h-4 text-rose" />
              <span>Preview Live Page</span>
              <ExternalLink className="w-3.5 h-3.5 text-ink-muted" />
            </Button>
          </Link>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="gap-2 shadow-craft font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer Story</span>
          </Button>
        </div>
      </div>

      {/* Stats Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface rounded-2xl border border-border-subtle p-4 space-y-1 shadow-subtle">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
            Total Stories
          </span>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-ink">{reviews.length}</p>
          <span className="text-[10px] text-ink-muted">Across Vadodara & Gujarat</span>
        </div>

        <div className="bg-surface rounded-2xl border border-border-subtle p-4 space-y-1 shadow-subtle">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-rose">
            With Photos & Videos
          </span>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-rose">{countMedia}</p>
          <span className="text-[10px] text-ink-muted">Real unboxings & keepsakes</span>
        </div>

        <div className="bg-surface rounded-2xl border border-border-subtle p-4 space-y-1 shadow-subtle">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600">
            🌟 Featured on Homepage
          </span>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-amber-600">{countFeatured}</p>
          <span className="text-[10px] text-ink-muted">High-converting social proof</span>
        </div>

        <div className="bg-surface rounded-2xl border border-border-subtle p-4 space-y-1 shadow-subtle">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
            Pending Moderation
          </span>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-blue-600">{countPending}</p>
          <span className="text-[10px] text-ink-muted">Awaiting artisan approval</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-surface p-3 rounded-2xl border border-border-subtle shadow-subtle">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'ALL'
                ? 'bg-rose text-white shadow-sm'
                : 'text-ink-muted hover:text-ink hover:bg-canvas'
            }`}
          >
            All Stories ({reviews.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('FEATURED')}
            className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'FEATURED'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-ink-muted hover:text-ink hover:bg-canvas'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured ({countFeatured})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('MEDIA')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'MEDIA'
                ? 'bg-rose text-white shadow-sm'
                : 'text-ink-muted hover:text-ink hover:bg-canvas'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Photos & Videos ({countMedia})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PENDING')}
            className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'PENDING'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-ink-muted hover:text-ink hover:bg-canvas'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending ({countPending})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('APPROVED')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'APPROVED'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-ink-muted hover:text-ink hover:bg-canvas'
            }`}
          >
            Approved ({countApproved})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-canvas rounded-xl border border-border-subtle text-xs text-ink placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Review List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-rose mx-auto" />
          <p className="text-xs text-ink-muted">Loading customer stories...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-16 text-center bg-surface rounded-2xl border border-border-subtle p-8 sm:p-12 space-y-4 max-w-lg mx-auto shadow-subtle">
          <div className="w-14 h-14 rounded-full bg-blush/40 text-rose flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7 fill-rose" />
          </div>
          <h3 className="font-serif text-xl font-bold text-ink">No Customer Stories Yet</h3>
          <p className="text-xs text-ink-muted leading-relaxed">
            Real reviews will appear here as soon as customers submit their stories, unboxing videos, and photos on the storefront. You can also transcribe feedback received via WhatsApp or Instagram DMs!
          </p>
          <div className="pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="gap-2 shadow-craft font-semibold mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer Story from WhatsApp</span>
            </Button>
          </div>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="py-16 text-center bg-surface rounded-2xl border border-border-subtle p-8 space-y-3">
          <Heart className="w-10 h-10 text-rose/50 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-ink">No Stories Match Your Filter</h3>
          <p className="text-xs text-ink-muted max-w-sm mx-auto">
            Try resetting your search query or switch back to the &quot;All Stories&quot; tab.
          </p>
          <Button variant="outline" size="sm" onClick={() => { setActiveTab('ALL'); setSearchQuery(''); }}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {filteredReviews.map((review) => {
            const isLoading = actionLoadingId === review.id;
            return (
              <div
                key={review.id}
                className={`bg-surface rounded-3xl border transition-all duration-200 overflow-hidden shadow-subtle ${
                  review.isFeatured
                    ? 'border-amber-400/80 ring-1 ring-amber-400/30'
                    : 'border-border-subtle'
                }`}
              >
                {/* Card Top: Customer Identity & Badges */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blush flex items-center justify-center font-serif text-rose font-bold text-base shrink-0">
                        {review.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif text-base font-bold text-ink">
                            {review.customerName}
                          </h3>
                          {review.isVerifiedBuyer && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span>Verified</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-ink-muted">
                          {review.customerLocation}
                          {review.customerPhone && (
                            <span className="ml-1 text-[11px] text-ink font-mono">• 📞 {review.customerPhone}</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          review.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : review.status === 'PENDING'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}
                      >
                        {review.status}
                      </span>
                      {review.isFeatured && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>Featured</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rating, Occasion & Tagged Product */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border-subtle/50">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < review.rating ? 'fill-current' : 'text-border-default'
                          }`}
                        />
                      ))}
                    </div>

                    {review.occasion && (
                      <span className="text-[10px] font-semibold text-rose bg-blush/40 px-2 py-0.5 rounded-full border border-border-subtle">
                        {review.occasion}
                      </span>
                    )}

                    <span className="text-[11px] text-ink-muted truncate max-w-[220px]">
                      Creation: <strong className="text-ink">{review.productName}</strong>
                    </span>
                  </div>

                  {/* Review Text */}
                  <div className="space-y-1">
                    {review.title && (
                      <h4 className="font-serif text-sm font-semibold text-ink leading-snug">
                        &ldquo;{review.title}&rdquo;
                      </h4>
                    )}
                    <p className="text-xs sm:text-sm text-ink leading-relaxed">
                      &ldquo;{review.reviewText}&rdquo;
                    </p>
                  </div>

                  {/* Attached Media Previews */}
                  {((review.images && review.images.length > 0) || review.videoUrl) && (
                    <div className="pt-2 space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-ink-muted block">
                        Customer Attached Media:
                      </span>
                      <div className="flex flex-wrap items-center gap-2.5">
                        {/* Video Thumbnail / Player */}
                        {review.videoUrl && (
                          <div
                            onClick={() =>
                              setActiveMediaModal({
                                type: 'video',
                                url: review.videoUrl!,
                                caption: `${review.customerName}'s Video Unboxing`,
                              })
                            }
                            className="relative w-24 h-24 rounded-xl bg-ink overflow-hidden border border-border-subtle group cursor-pointer shrink-0 shadow-sm"
                          >
                            <video
                              src={review.videoUrl}
                              className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity"
                              preload="metadata"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-ink/40 group-hover:bg-ink/20 transition-colors">
                              <div className="w-8 h-8 rounded-full bg-rose/90 text-white flex items-center justify-center shadow-md">
                                <Play className="w-4 h-4 fill-white ml-0.5" />
                              </div>
                            </div>
                            <span className="absolute bottom-1 right-1 text-[9px] font-bold text-white bg-ink/70 px-1 rounded">
                              Video
                            </span>
                          </div>
                        )}

                        {/* Image Thumbnails */}
                        {review.images?.map((imgUrl, idx) => (
                          <div
                            key={idx}
                            onClick={() =>
                              setActiveMediaModal({
                                type: 'image',
                                url: imgUrl,
                                caption: `${review.customerName} • Photo ${idx + 1}`,
                              })
                            }
                            className="relative w-24 h-24 rounded-xl bg-canvas overflow-hidden border border-border-subtle group cursor-pointer shrink-0 shadow-sm"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imgUrl}
                              alt={`Customer photo ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors flex items-center justify-center">
                              <Camera className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="bg-canvas/60 border-t border-border-subtle p-3.5 sm:px-6 flex flex-wrap items-center justify-between gap-3">
                  {/* Left: Quick Moderate Actions */}
                  <div className="flex items-center gap-2">
                    {review.status !== 'APPROVED' ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={isLoading}
                        onClick={() => handleUpdate(review.id, { status: 'APPROVED' })}
                        className="text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Story</span>
                      </Button>
                    ) : (
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleUpdate(review.id, { status: 'PENDING' })}
                        className="text-[11px] font-semibold text-ink-muted hover:text-ink underline"
                      >
                        Mark Pending
                      </button>
                    )}

                    {review.status !== 'REJECTED' && (
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleUpdate(review.id, { status: 'REJECTED' })}
                        className="text-[11px] font-semibold text-red-600 hover:text-red-700 hover:underline px-2"
                      >
                        Reject
                      </button>
                    )}
                  </div>

                  {/* Right: Feature Toggle & Delete */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant={review.isFeatured ? 'primary' : 'outline'}
                      size="sm"
                      disabled={isLoading}
                      onClick={() => handleUpdate(review.id, { isFeatured: !review.isFeatured })}
                      className={`text-xs gap-1.5 ${
                        review.isFeatured
                          ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'border-border-subtle hover:bg-amber-50 hover:text-amber-700'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{review.isFeatured ? 'Featured on Home' : 'Feature on Home'}</span>
                    </Button>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleDelete(review.id, review.customerName)}
                      className="p-1.5 text-ink-muted hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Story"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Manual Entry Modal (Add Review) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-xl bg-surface rounded-3xl border border-border-subtle p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-ink-muted hover:text-ink hover:bg-canvas transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 pb-4 border-b border-border-subtle">
              <span className="text-xs uppercase font-bold tracking-widest text-rose">
                Artisan Console
              </span>
              <h2 className="font-serif text-2xl font-bold text-ink">
                Add Customer Review / Story
              </h2>
              <p className="text-xs text-ink-muted">
                Add feedback received via WhatsApp, Instagram DM, or customer pickup.
              </p>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateReview} className="space-y-4 pt-4">
              {/* Customer Name & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Diya Sharma"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border-subtle text-xs bg-canvas text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink">Locality / City</label>
                  <input
                    type="text"
                    placeholder="e.g. Alkapuri, Vadodara"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border-subtle text-xs bg-canvas text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Phone & Star Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink">Customer Phone (Optional)</label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border-subtle text-xs bg-canvas text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink">Star Rating</label>
                  <div className="flex items-center gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormRating(s)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            s <= formRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-border-default'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-ink ml-1">{formRating}/5</span>
                  </div>
                </div>
              </div>

              {/* Handcrafted Creation & Occasion */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink">Creation / Product</label>
                  <select
                    value={formProduct}
                    onChange={(e) => setFormProduct(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border-subtle text-xs bg-canvas text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {PRESET_PRODUCTS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink">Gifting Occasion</label>
                  <select
                    value={formOccasion}
                    onChange={(e) => setFormOccasion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border-subtle text-xs bg-canvas text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {PRESET_OCCASIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title & Review Quote */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">Headline / Title (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Beautiful anniversary keepsake!"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border-subtle text-xs bg-canvas text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">Review Quote / Story *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Paste what the customer said about their handmade blooms..."
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border-subtle text-xs bg-canvas text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Photo Upload & Gallery */}
              <div className="space-y-2 pt-2 border-t border-border-subtle/60">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-rose" />
                    <span>Customer Photos</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="text-xs font-semibold text-rose hover:underline"
                  >
                    + Upload Images
                  </button>
                  <input
                    ref={imageInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Image URL fallback */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Or paste image URL (Unsplash, Cloudinary, etc.)"
                    value={formImageUrlInput}
                    onChange={(e) => setFormImageUrlInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-border-subtle text-xs bg-canvas text-ink focus:outline-none"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (formImageUrlInput.trim()) {
                        setFormImages((prev) => [...prev, formImageUrlInput.trim()]);
                        setFormImageUrlInput('');
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>

                {/* Previews */}
                {formImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {formImages.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border-subtle">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt="preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormImages((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 w-4 h-4 rounded-full bg-ink/80 text-white flex items-center justify-center text-[10px]"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video URL or Upload */}
              <div className="space-y-2 pt-2 border-t border-border-subtle/60">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-rose" />
                    <span>Customer Video Unboxing</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="text-xs font-semibold text-rose hover:underline"
                  >
                    + Upload Video File
                  </button>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                </div>

                <input
                  type="url"
                  placeholder="Or paste video MP4 URL or Instagram Reel URL"
                  value={formVideoUrl}
                  onChange={(e) => setFormVideoUrl(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-border-subtle text-xs bg-canvas text-ink focus:outline-none"
                />

                {formVideoUrl && (
                  <div className="relative w-full max-w-[200px] aspect-[4/3] rounded-xl bg-ink overflow-hidden border border-border-subtle">
                    <video src={formVideoUrl} className="w-full h-full object-cover" controls playsInline />
                    <button
                      type="button"
                      onClick={() => setFormVideoUrl('')}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-ink/80 text-white flex items-center justify-center text-xs"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Feature checkbox */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featureToggle"
                  checked={formIsFeatured}
                  onChange={(e) => setFormIsFeatured(e.target.checked)}
                  className="rounded text-rose focus:ring-primary w-4 h-4"
                />
                <label htmlFor="featureToggle" className="text-xs font-semibold text-ink cursor-pointer">
                  🌟 Feature this story on the Bloomora Homepage immediately
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-border-subtle flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={formIsSubmitting}
                  className="gap-2 shadow-craft font-semibold"
                >
                  {formIsSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Story...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Publish Customer Story</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Full Media Zoom */}
      {activeMediaModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/85 backdrop-blur-sm animate-in fade-in"
          onClick={() => setActiveMediaModal(null)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] bg-surface rounded-2xl overflow-hidden p-3 shadow-2xl space-y-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveMediaModal(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-ink/70 text-white flex items-center justify-center hover:bg-ink"
            >
              <X className="w-4 h-4" />
            </button>

            {activeMediaModal.type === 'video' ? (
              <video
                src={activeMediaModal.url}
                controls
                autoPlay
                playsInline
                className="max-h-[75vh] w-auto max-w-full rounded-xl bg-ink mx-auto"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeMediaModal.url}
                alt="Enlarged media"
                className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain mx-auto"
              />
            )}

            {activeMediaModal.caption && (
              <p className="text-center text-xs font-semibold text-ink pt-1">
                {activeMediaModal.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

