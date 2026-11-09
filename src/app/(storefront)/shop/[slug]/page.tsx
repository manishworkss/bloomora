'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, notFound } from 'next/navigation';
import {
  Heart,
  ShoppingBag,
  MessageCircle,
  Truck,
  ShieldCheck,
  Clock,
  ChevronRight,
  Plus,
  Minus,
  Check,
  Sparkles,
  Gift,
  Star,
  Camera,
  Video,
  CheckCircle2,
  X,
  Flower2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/formatters';
import { getProductInquiryLink } from '@/lib/whatsapp';
import { CustomerReviewModal } from '@/components/storefront/CustomerReviewModal';
import { ProductCard } from '@/components/storefront/ProductCard';
import { Product, CustomerReview } from '@/types';

interface AddOnOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

const AVAILABLE_ADDONS: AddOnOption[] = [
  {
    id: 'card',
    name: 'Handwritten Calligraphy Card',
    price: 0,
    description: 'Sealed kraft envelope with your personal message penned by hand',
  },
  {
    id: 'lights',
    name: 'Warm Fairy Lights Wrap',
    price: 69,
    description: 'Delicate warm-white micro-LEDs wrapped around the blooms',
  },
  {
    id: 'box',
    name: 'Signature Satin Ribbon & Gift Box',
    price: 49,
    description: 'Elevated presentation in our boutique kraft keepsake box',
  },
  {
    id: 'charm',
    name: 'Mini Crochet Heart Charm',
    price: 99,
    description: 'Matching handmade amigurumi heart charm tied with ribbon',
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/store/products/${slug}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.product) {
          setProduct(data.product);
        } else {
          setProduct(undefined);
        }
      })
      .catch((err) => {
        console.error('Failed to load product detail:', err);
        setProduct(undefined);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [giftMessage, setGiftMessage] = useState('');
  const [justAdded, setJustAdded] = useState(false);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [activeMediaModal, setActiveMediaModal] = useState<{
    type: 'image' | 'video';
    url: string;
    caption?: string;
  } | null>(null);
  const { addItem } = useCart();

  const loadReviews = () => {
    fetch('/api/store/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        }
      })
      .catch((err) => console.error('Failed to load reviews:', err));
  };

  useEffect(() => {
    loadReviews();
    fetch('/api/store/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products)) {
          setRelatedProducts(data.products.filter((p: Product) => p.slug !== slug).slice(0, 4));
        }
      })
      .catch(() => {});
  }, [slug]);

  if (!product && !loading) {
    notFound();
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-xs text-ink-muted">
        Loading creation details...
      </div>
    );
  }

  const images = (product.images || []).filter((img) => img.imageUrl && img.imageUrl.trim());
  const currentImage = images[selectedImageIndex] || images[0];

  const addOnsTotal = selectedAddOns.reduce(
    (sum, id) => sum + (AVAILABLE_ADDONS.find((a) => a.id === id)?.price || 0),
    0
  );
  const effectiveUnitPrice = product.basePrice + addOnsTotal;
  const totalPrice = effectiveUnitPrice * quantity;

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddToCart = () => {
    const chosenAddOns = AVAILABLE_ADDONS.filter((a) => selectedAddOns.includes(a.id)).map((a) => ({
      id: a.id,
      name: a.name,
      price: a.price,
    }));

    addItem({
      productId: product.id,
      title: product.title,
      unitPrice: effectiveUnitPrice,
      quantity,
      imageUrl: currentImage?.imageUrl || '',
      maxAvailableStock: product.stockQuantity,
      productType: product.productType,
      addOns: chosenAddOns.length > 0 ? chosenAddOns : undefined,
      giftMessage: selectedAddOns.includes('card') && giftMessage.trim() ? giftMessage.trim() : undefined,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const chosenAddonNames = AVAILABLE_ADDONS.filter((a) => selectedAddOns.includes(a.id))
    .map((a) => a.name)
    .join(', ');

  const whatsappInquiryUrl = getProductInquiryLink(
    `${product.title}${chosenAddonNames ? ` (+ ${chosenAddonNames})` : ''}`,
    undefined,
    typeof window !== 'undefined' ? window.location.href : undefined
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-ink-muted">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-ink-muted/50" />
        <Link href="/shop" className="hover:text-primary transition-colors">
          Shop
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-3 h-3 text-ink-muted/50" />
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="hover:text-primary transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3 h-3 text-ink-muted/50" />
        <span className="text-ink font-medium truncate max-w-[200px]">{product.title}</span>
      </nav>

      {/* Main Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Image Gallery with Framer Motion Crossfade */}
        <div className="space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-surface border border-border-subtle shadow-craft">
            {currentImage?.imageUrl ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage.imageUrl}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={currentImage.imageUrl}
                    alt={currentImage.altText || product.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blush/30 via-canvas to-surface text-rose p-8 text-center select-none">
                <Flower2 className="w-16 h-16 text-rose/60 mb-3 stroke-[1.5]" />
                <p className="font-serif text-lg text-ink font-semibold">{product.title}</p>
                <p className="text-xs text-ink-muted mt-1">Handcrafted with care in Vadodara</p>
              </div>
            )}

            <div className="absolute top-4 left-4 z-10">
              {product.productType === 'READY_MADE' ? (
                <Badge variant="sage">In Ready Stock</Badge>
              ) : (
                <Badge variant="terracotta">Handcrafted to Order</Badge>
              )}
            </div>
          </div>

          {/* Thumbnail Strip with Spring Hover */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <motion.button
                  key={img.id}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border-subtle hover:border-rose'
                  }`}
                >
                  <Image src={img.imageUrl} alt={img.altText} fill className="object-cover" sizes="80px" />
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="space-y-8">
          <div className="space-y-3">
            {product.category && (
              <span className="text-xs uppercase font-bold tracking-widest text-rose block">
                {product.category.name}
              </span>
            )}
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink leading-tight">
              {product.title}
            </h1>
            <div className="flex items-baseline gap-3 pt-1">
              <span className="font-serif text-3xl font-bold text-ink">
                {formatINR(effectiveUnitPrice)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
                <span className="text-base text-ink-muted line-through">
                  {formatINR(product.compareAtPrice + addOnsTotal)}
                </span>
              )}
              {addOnsTotal > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blush text-rose">
                  +{formatINR(addOnsTotal)} add-ons included
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 border-y border-border-subtle/80 py-5">
            <h3 className="font-serif text-sm font-semibold text-ink uppercase tracking-wider">
              Craftsmanship Details
            </h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              {product.fullDescription}
            </p>
          </div>

          {/* Interactive Boutique Gifting Add-ons */}
          <div className="space-y-3 bg-canvas/60 p-5 rounded-2xl border border-border-subtle">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-rose" />
              <h3 className="font-serif text-sm font-bold text-ink uppercase tracking-wider">
                Boutique Gifting Add-ons
              </h3>
            </div>
            <p className="text-xs text-ink-muted">
              Personalise your gift with optional handwritten notes, fairy lights, and presentation boxes:
            </p>

            <div className="space-y-2 pt-1">
              {AVAILABLE_ADDONS.map((addon) => {
                const isSelected = selectedAddOns.includes(addon.id);
                return (
                  <motion.div
                    key={addon.id}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => toggleAddOn(addon.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-surface border-rose shadow-sm ring-1 ring-rose/20'
                        : 'bg-surface/80 border-border-subtle hover:border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-rose text-white' : 'border border-border-subtle bg-canvas'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                        </div>
                        <span className="text-xs font-semibold text-ink">{addon.name}</span>
                      </div>
                      <span className="text-xs font-bold text-rose">
                        {addon.price === 0 ? 'Free' : `+${formatINR(addon.price)}`}
                      </span>
                    </div>

                    <p className="text-[11px] text-ink-muted pl-6">{addon.description}</p>

                    {/* Animated Expandable Note Area for Handwritten Card */}
                    {addon.id === 'card' && isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="pl-6 pt-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <label className="text-[10px] font-bold uppercase tracking-wider text-ink block mb-1">
                          Your Custom Handwritten Message:
                        </label>
                        <textarea
                          rows={2}
                          value={giftMessage}
                          onChange={(e) => setGiftMessage(e.target.value)}
                          placeholder="e.g. Happy Birthday Diya! May your days always be in full bloom 🌸 Love, Rohan"
                          className="w-full p-2.5 rounded-lg bg-canvas border border-border-subtle text-xs text-ink placeholder:text-ink-muted/60 focus:outline-none focus:ring-1 focus:ring-rose resize-none"
                        />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-ink uppercase tracking-wider">Quantity:</span>
              <div className="flex items-center border border-border-subtle rounded-lg bg-surface">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:text-primary transition-colors text-ink-muted"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </motion.button>
                <span className="w-10 text-center text-sm font-bold text-ink">{quantity}</span>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:text-primary transition-colors text-ink-muted"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* CTAs with Framer Motion Physics */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm shadow-subtle flex items-center justify-center gap-2 transition-colors ${
                  justAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-primary text-white hover:bg-primary/95'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 mr-1" />
                    <span>Add to Bag • {formatINR(totalPrice)}</span>
                  </>
                )}
              </motion.button>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Link
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto block"
                >
                  <Button variant="whatsapp" size="lg" className="w-full font-semibold">
                    <MessageCircle className="w-5 h-5 fill-current mr-1.5" />
                    <span>Ask on WhatsApp</span>
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Local Guarantees & Vadodara Delivery Banner */}
          <div className="space-y-3 bg-surface p-5 rounded-xl border border-border-subtle">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <p className="font-semibold text-ink">Delivering Across All of Vadodara</p>
                <p className="text-ink-muted">
                  Safe doorstep delivery across all Vadodara postal codes. Free delivery consultation on WhatsApp.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-border-subtle/50">
              <Clock className="w-5 h-5 text-sage shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <p className="font-semibold text-ink">
                  {product.productType === 'READY_MADE'
                    ? 'Handcrafted Ready Stock'
                    : 'Handcrafted to Order with Love'}
                </p>
                <p className="text-ink-muted">
                  Every creation is slow-knitted stitch-by-stitch with hypoallergenic milk-cotton yarn.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-border-subtle/50">
              <ShieldCheck className="w-5 h-5 text-rose shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <p className="font-semibold text-ink">Handmade & Non-Refundable</p>
                <p className="text-ink-muted">
                  Bespoke handmade goods are crafted exclusively for you. Transit damages replaced within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews & Unboxing Stories Section */}
      <section className="pt-12 sm:pt-16 border-t border-border-subtle space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs uppercase font-bold tracking-widest text-rose">
              Verified Client Stories
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink font-bold">
              Customer Reviews & Unboxings
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted">
              Real smiles and keepsake moments for this handcrafted bloom.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsReviewModalOpen(true)}
            className="gap-1.5 shadow-craft text-xs font-semibold"
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Write a Review</span>
          </Button>
        </div>

        {/* Reviews Grid */}
        {reviews.length === 0 ? (
          <div className="py-8 text-center bg-surface rounded-2xl border border-border-subtle p-6 space-y-2">
            <p className="text-xs text-ink-muted">Be the first to share your keepsake story for this creation!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(
              reviews.filter((r) => r.productName.toLowerCase().includes(product.title.toLowerCase()) || product.title.toLowerCase().includes(r.productName.toLowerCase())).length > 0
                ? reviews.filter((r) => r.productName.toLowerCase().includes(product.title.toLowerCase()) || product.title.toLowerCase().includes(r.productName.toLowerCase()))
                : reviews
            ).slice(0, 3).map((story) => (
              <div
                key={story.id}
                className="bg-surface rounded-2xl border border-border-subtle p-5 space-y-3 shadow-subtle flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  {/* Media if available */}
                  {story.videoUrl ? (
                    <div className="relative aspect-video rounded-xl bg-ink overflow-hidden">
                      <video src={story.videoUrl} controls playsInline className="w-full h-full object-cover" />
                    </div>
                  ) : story.images && story.images.length > 0 ? (
                    <div
                      className="relative aspect-video rounded-xl bg-canvas overflow-hidden cursor-pointer"
                      onClick={() =>
                        setActiveMediaModal({
                          type: 'image',
                          url: story.images[0],
                          caption: `${story.customerName} • ${story.productName}`,
                        })
                      }
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={story.images[0]} alt={story.productName} className="w-full h-full object-cover" />
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < story.rating ? 'fill-amber-400' : 'text-border-default'
                          }`}
                        />
                      ))}
                    </div>

                    {story.isVerifiedBuyer && (
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Verified Buyer
                      </span>
                    )}
                  </div>

                  {story.title && (
                    <h4 className="font-serif text-sm font-bold text-ink leading-snug">
                      &ldquo;{story.title}&rdquo;
                    </h4>
                  )}

                  <p className="text-xs text-ink leading-relaxed">
                    &ldquo;{story.reviewText}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-border-subtle/50">
                  <p className="font-serif text-xs font-bold text-ink">{story.customerName}</p>
                  <p className="text-[10px] text-ink-muted">{story.customerLocation} {story.occasion && `• ${story.occasion}`}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Review Modal */}
      <CustomerReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmitted={loadReviews}
        defaultProductName={product.title}
      />

      {/* Lightbox Modal */}
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

      {/* More Handcrafted Creations (Swipeable on mobile, 4-col desktop matching Image 1) */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 sm:pt-16 border-t border-border-subtle space-y-6 pb-20 lg:pb-0">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold tracking-widest text-rose">
                You May Also Love
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
                More Handcrafted Creations
              </h2>
            </div>
            <Link href="/shop" className="text-xs font-semibold text-rose hover:underline">
              View All ↗
            </Link>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-5 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-4 sm:overflow-visible scrollbar-none">
            {relatedProducts.map((p) => (
              <div key={p.id} className="w-[250px] sm:w-auto shrink-0 sm:shrink snap-start flex">
                <div className="w-full">
                  <ProductCard product={p} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mobile Sticky Add to Box Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-surface/95 backdrop-blur-md border-t border-border-subtle p-3 px-4 z-40 flex items-center justify-between gap-3 shadow-craft-elevated">
        <div className="min-w-0">
          <p className="font-bold text-xs text-ink truncate">{product.title}</p>
          <p className="text-xs text-primary font-bold">{formatINR(totalPrice)}</p>
        </div>
        <Button
          onClick={handleAddToCart}
          variant="primary"
          size="sm"
          className="shrink-0 gap-1.5 px-5"
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Added ✓</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Box</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

