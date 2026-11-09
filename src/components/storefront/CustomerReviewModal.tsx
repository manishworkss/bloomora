'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Star,
  Camera,
  Video,
  Upload,
  CheckCircle2,
  Sparkles,
  Heart,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CustomerReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
  defaultProductName?: string;
}

const PRESET_OCCASIONS = [
  'Wedding Anniversary Surprise',
  'Birthday Gift',
  'Promotion / Desk Gift',
  'Bridesmaid Keepsakes',
  'Friendship / Farewell',
  'Self-Love & Home Decor',
  'Romantic Surprise',
  'Festival Celebration',
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

export function CustomerReviewModal({
  isOpen,
  onClose,
  onSubmitted,
  defaultProductName,
}: CustomerReviewModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerLocation, setCustomerLocation] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [productName, setProductName] = useState(
    defaultProductName || 'Everlasting Crochet Lavender & Tulip Bouquet'
  );
  const [occasion, setOccasion] = useState(PRESET_OCCASIONS[0]);

  // Media attachments
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoInputMode, setVideoInputMode] = useState<'url' | 'upload'>('upload');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local image file uploads (convert to base64 data URL)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle local video file upload (convert to base64 data URL or blob URL)
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file (MP4, WebM, MOV)');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError('Video file must be under 20MB. You can also paste an Instagram Reel or video link.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setVideoUrl(event.target!.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImages((prev) => [...prev, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/store/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerLocation: customerLocation || 'Vadodara, Gujarat',
          customerPhone,
          rating,
          title,
          reviewText,
          productName,
          occasion,
          images,
          videoUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error?.message || data.error || 'Failed to submit review');
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
      setIsSubmitting(false);
      onSubmitted();

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Connection error. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-surface rounded-3xl border border-border-subtle shadow-craft-elevated overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-border-subtle bg-gradient-to-r from-surface via-canvas to-blush/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-rose/10 flex items-center justify-center text-rose">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-ink">
                Share Your Bloomora Story
              </h2>
              <p className="text-[11px] text-ink-muted">
                Add your heartfelt review, photos & unboxing videos
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-canvas hover:bg-blush/50 text-ink-muted hover:text-ink flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
          {isSuccess ? (
            <div className="py-12 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-bold text-ink">Thank You for Your Love! 🌸</h3>
                <p className="text-sm text-ink-muted max-w-md mx-auto">
                  Your story and media have been received and arranged in Our Happy Family gallery.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Interactive Star Rating */}
              <div className="text-center p-4 rounded-2xl bg-canvas border border-border-subtle space-y-2">
                <label className="text-xs font-bold text-ink uppercase tracking-wider block">
                  How would you rate your handcrafted creation?
                </label>
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110 focus:outline-none"
                      aria-label={`Rate ${star} star`}
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                          (hoverRating || rating) >= star
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-border-default'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-[11px] font-semibold text-rose">
                  {rating === 5 && '⭐⭐⭐⭐⭐ Pure Magic & Perfection!'}
                  {rating === 4 && '⭐⭐⭐⭐ Loved it very much!'}
                  {rating === 3 && '⭐⭐⭐ Good handcrafted quality'}
                  {rating === 2 && '⭐⭐ Okay'}
                  {rating === 1 && '⭐ Needs improvement'}
                </p>
              </div>

              {/* Name & Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ananya Patel"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                    Locality / City *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerLocation}
                    onChange={(e) => setCustomerLocation(e.target.value)}
                    placeholder="e.g. Alkapuri, Vadodara"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Product & Occasion */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                    Creation Received *
                  </label>
                  <select
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {PRESET_PRODUCTS.map((prod) => (
                      <option key={prod} value={prod}>
                        {prod}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                    Special Occasion
                  </label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {PRESET_OCCASIONS.map((occ) => (
                      <option key={occ} value={occ}>
                        {occ}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Story Title & Review Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                  Headline / Catchphrase
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Best gift ever! Beautiful unboxing and forever flowers."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                  Your Full Story & Experience *
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell us about the unboxing, recipient's smiles, the handmade stitches, or how it sits on your desk..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* MEDIA SECTION 1: PHOTOS */}
              <div className="space-y-3 p-4 rounded-2xl bg-canvas border border-border-subtle">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-rose" />
                    <span className="text-xs font-bold text-ink uppercase tracking-wider">
                      Add Photos ({images.length})
                    </span>
                  </div>
                  <span className="text-[11px] text-ink-muted">JPG, PNG, WebP up to 5MB</span>
                </div>

                {/* Upload & URL Controls */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="file"
                    ref={imageFileInputRef}
                    onChange={handleImageFileChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => imageFileInputRef.current?.click()}
                    className="gap-1.5 shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5 text-rose" />
                    <span>Upload from Device</span>
                  </Button>

                  <div className="flex items-center gap-1.5 flex-1">
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="Or paste an image URL..."
                      className="flex-1 px-3 py-1.5 rounded-lg bg-surface border border-border-subtle text-xs text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddImageUrl}
                      disabled={!imageUrlInput.trim()}
                      className="px-2.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Image Previews */}
                {images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-2">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-square rounded-xl overflow-hidden border border-border-subtle bg-surface"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={`Review preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-ink/70 text-white hover:bg-red-600 transition-colors"
                          aria-label="Remove image"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* MEDIA SECTION 2: VIDEOS */}
              <div className="space-y-3 p-4 rounded-2xl bg-canvas border border-border-subtle">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-rose" />
                    <span className="text-xs font-bold text-ink uppercase tracking-wider">
                      Add Unboxing Video / Reel
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setVideoInputMode('upload')}
                      className={`px-2 py-0.5 rounded-md ${
                        videoInputMode === 'upload'
                          ? 'bg-rose text-white font-semibold'
                          : 'text-ink-muted'
                      }`}
                    >
                      Upload Video
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoInputMode('url')}
                      className={`px-2 py-0.5 rounded-md ${
                        videoInputMode === 'url'
                          ? 'bg-rose text-white font-semibold'
                          : 'text-ink-muted'
                      }`}
                    >
                      Video Link
                    </button>
                  </div>
                </div>

                {videoInputMode === 'upload' ? (
                  <div>
                    <input
                      type="file"
                      ref={videoFileInputRef}
                      onChange={handleVideoFileChange}
                      accept="video/mp4,video/webm,video/quicktime"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => videoFileInputRef.current?.click()}
                      className="gap-1.5 w-full justify-center"
                    >
                      <Upload className="w-3.5 h-3.5 text-rose" />
                      <span>{videoUrl ? 'Replace Video File' : 'Select Video from Phone/Computer'}</span>
                    </Button>
                    <p className="text-[10px] text-ink-muted text-center mt-1">
                      MP4 or WebM up to 20MB. Shows a full playable video card in the gallery.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="Paste MP4 link, Instagram Reel link, or YouTube Shorts link..."
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-border-subtle text-xs text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <p className="text-[10px] text-ink-muted">
                      Direct MP4 video URLs or Instagram unboxing links are supported.
                    </p>
                  </div>
                )}

                {/* Video Preview */}
                {videoUrl && (
                  <div className="relative rounded-xl overflow-hidden border border-border-subtle bg-ink mt-2">
                    <video
                      src={videoUrl}
                      controls
                      playsInline
                      className="w-full max-h-48 object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setVideoUrl('')}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-ink/80 text-white hover:bg-red-600 transition-colors"
                      aria-label="Remove video"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-border-subtle">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                  className="w-full sm:w-auto shadow-craft font-semibold"
                >
                  <Heart className="w-4 h-4 mr-1.5 fill-current" />
                  <span>Submit My Story</span>
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
