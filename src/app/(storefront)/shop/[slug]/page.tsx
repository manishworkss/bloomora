'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/formatters';
import { getProductInquiryLink } from '@/lib/whatsapp';
import { Product } from '@/types';

// Baseline Catalog Database
const ALL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    categoryId: 'cat-bouquets',
    category: {
      id: 'cat-bouquets',
      name: 'Floral Bouquets',
      slug: 'bouquets',
      displayOrder: 1,
      isActive: true,
      createdAt: '2026-11-09',
    },
    title: 'Everlasting Crochet Lavender & Tulip Bouquet',
    slug: 'everlasting-lavender-tulip-bouquet',
    shortDescription:
      'Handcrafted with soft milk-cotton yarn in pastel lilac and cream, tied with natural jute twine.',
    fullDescription:
      'A timeless arrangement of handcrafted lavender sprigs and pastel tulips. Hand-knitted with love in Vadodara, this bouquet never withers and stays vibrant forever. Perfect for birthdays, anniversaries, or self-love gifting. Wrapped in premium kraft paper with a matching bow.',
    basePrice: 899,
    compareAtPrice: 1049,
    productType: 'READY_MADE',
    preparationDays: 0,
    isPublished: true,
    isFeatured: true,
    hasVariants: false,
    stockQuantity: 6,
    lowStockThreshold: 2,
    images: [
      {
        id: 'img-001-a',
        productId: 'prod-001',
        cloudinaryPublicId: 'the-handmade-craft/sample-1',
        imageUrl:
          'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=1200&auto=format&fit=crop',
        altText: 'Handmade crochet bouquet with lavender and cream tulips',
        displayOrder: 0,
        isPrimary: true,
      },
      {
        id: 'img-001-b',
        productId: 'prod-001',
        cloudinaryPublicId: 'the-handmade-craft/sample-1-detail',
        imageUrl:
          'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1200&auto=format&fit=crop',
        altText: 'Close up stitches of crochet flowers',
        displayOrder: 1,
        isPrimary: false,
      },
    ],
    createdAt: '2026-11-09',
    updatedAt: '2026-11-09',
  },
  {
    id: 'prod-002',
    categoryId: 'cat-flowers',
    category: {
      id: 'cat-flowers',
      name: 'Flower Pots',
      slug: 'flowers',
      displayOrder: 2,
      isActive: true,
      createdAt: '2026-11-09',
    },
    title: 'Mini Smiling Sunflower Crochet Desk Pot',
    slug: 'mini-smiling-sunflower-crochet-pot',
    shortDescription:
      'Adorable handmade yellow sunflower with a joyful face sitting in a cozy terracotta yarn pot.',
    fullDescription:
      'Brighten any work desk, study table, or gifting occasion with this cheerful smiling sunflower. Hand-crocheted stitch-by-stitch with soft hypoallergenic yarn. Brings a smile to everyone who looks at it.',
    basePrice: 399,
    compareAtPrice: 450,
    productType: 'READY_MADE',
    preparationDays: 0,
    isPublished: true,
    isFeatured: true,
    hasVariants: false,
    stockQuantity: 10,
    lowStockThreshold: 3,
    images: [
      {
        id: 'img-002-a',
        productId: 'prod-002',
        cloudinaryPublicId: 'the-handmade-craft/sample-2',
        imageUrl:
          'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=1200&auto=format&fit=crop',
        altText: 'Cute crochet sunflower desk pot',
        displayOrder: 0,
        isPrimary: true,
      },
    ],
    createdAt: '2026-11-09',
    updatedAt: '2026-11-09',
  },
  {
    id: 'prod-003',
    categoryId: 'cat-keychains',
    category: {
      id: 'cat-keychains',
      name: 'Keychains',
      slug: 'keychains',
      displayOrder: 3,
      isActive: true,
      createdAt: '2026-11-09',
    },
    title: 'Handmade Daisy Flower Charm Keychain',
    slug: 'handmade-daisy-flower-charm-keychain',
    shortDescription:
      'Delicate white daisy with yellow pistil charm, durable alloy golden ring, and ribbon bow.',
    fullDescription:
      'A lightweight yet durable handmade keychain to keep keys organized or attach to your favorite handbag, school bag, or backpack. Stitched with high-grade anti-pilling yarn.',
    basePrice: 199,
    compareAtPrice: 249,
    productType: 'READY_MADE',
    preparationDays: 0,
    isPublished: true,
    isFeatured: true,
    hasVariants: false,
    stockQuantity: 15,
    lowStockThreshold: 5,
    images: [
      {
        id: 'img-003-a',
        productId: 'prod-003',
        cloudinaryPublicId: 'the-handmade-craft/sample-3',
        imageUrl:
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop',
        altText: 'Handmade daisy crochet keychain charm',
        displayOrder: 0,
        isPrimary: true,
      },
    ],
    createdAt: '2026-11-09',
    updatedAt: '2026-11-09',
  },
  {
    id: 'prod-004',
    categoryId: 'cat-bouquets',
    category: {
      id: 'cat-bouquets',
      name: 'Floral Bouquets',
      slug: 'bouquets',
      displayOrder: 1,
      isActive: true,
      createdAt: '2026-11-09',
    },
    title: 'Customizable Pastel Rose & Daisy Keepsake Bouquet',
    slug: 'customizable-pastel-rose-daisy-keepsake-bouquet',
    shortDescription:
      'Bespoke bouquet customized with your favorite color palette. Handcrafted to order.',
    fullDescription:
      'Select your personalized colors and let our artisan craft an exclusive floral bouquet just for your special person. Handcrafted to order in 3–4 days in Vadodara.',
    basePrice: 1199,
    productType: 'MADE_TO_ORDER',
    preparationDays: 3,
    isPublished: true,
    isFeatured: true,
    hasVariants: false,
    stockQuantity: 99,
    lowStockThreshold: 1,
    images: [
      {
        id: 'img-004-a',
        productId: 'prod-004',
        cloudinaryPublicId: 'the-handmade-craft/sample-4',
        imageUrl:
          'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1200&auto=format&fit=crop',
        altText: 'Customizable handmade rose bouquet in Vadodara',
        displayOrder: 0,
        isPrimary: true,
      },
    ],
    createdAt: '2026-11-09',
    updatedAt: '2026-11-09',
  },
  {
    id: 'prod-005',
    categoryId: 'cat-flowers',
    category: {
      id: 'cat-flowers',
      name: 'Flower Pots',
      slug: 'flowers',
      displayOrder: 2,
      isActive: true,
      createdAt: '2026-11-09',
    },
    title: 'Pastel Pink Crochet Tulip Desk Blossom',
    slug: 'pastel-pink-crochet-tulip-desk-blossom',
    shortDescription:
      'Elegant single tulip blossom in a handmade knitted white pot.',
    fullDescription:
      'An aesthetic minimalist piece for study tables, nightstands, and dressing corners. Needs zero watering or sunlight, staying in pristine bloom forever.',
    basePrice: 349,
    compareAtPrice: 399,
    productType: 'READY_MADE',
    preparationDays: 0,
    isPublished: true,
    isFeatured: false,
    hasVariants: false,
    stockQuantity: 8,
    lowStockThreshold: 2,
    images: [
      {
        id: 'img-005-a',
        productId: 'prod-005',
        cloudinaryPublicId: 'the-handmade-craft/sample-5',
        imageUrl:
          'https://images.unsplash.com/photo-1520763185298-1b434c919102?q=80&w=1200&auto=format&fit=crop',
        altText: 'Pink crochet tulip in potted base',
        displayOrder: 0,
        isPrimary: true,
      },
    ],
    createdAt: '2026-11-09',
    updatedAt: '2026-11-09',
  },
  {
    id: 'prod-006',
    categoryId: 'cat-keychains',
    category: {
      id: 'cat-keychains',
      name: 'Keychains',
      slug: 'keychains',
      displayOrder: 3,
      isActive: true,
      createdAt: '2026-11-09',
    },
    title: 'Fluffy Strawberry Amigurumi Keychain',
    slug: 'fluffy-strawberry-amigurumi-keychain',
    shortDescription:
      'Vibrant red handmade strawberry with tiny embroidered seeds and green calyx top.',
    fullDescription:
      'Plump and soft handmade strawberry amigurumi keychain. Handcrafted with dense stitches so it retains its shape forever.',
    basePrice: 229,
    productType: 'READY_MADE',
    preparationDays: 0,
    isPublished: true,
    isFeatured: false,
    hasVariants: false,
    stockQuantity: 12,
    lowStockThreshold: 3,
    images: [
      {
        id: 'img-006-a',
        productId: 'prod-006',
        cloudinaryPublicId: 'the-handmade-craft/sample-6',
        imageUrl:
          'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=1200&auto=format&fit=crop',
        altText: 'Handmade strawberry crochet keychain',
        displayOrder: 0,
        isPrimary: true,
      },
    ],
    createdAt: '2026-11-09',
    updatedAt: '2026-11-09',
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const product = ALL_PRODUCTS.find((p) => p.slug === slug);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  if (!product) {
    notFound();
  }

  const images = product.images.length > 0 ? product.images : [
    {
      id: 'fallback',
      productId: product.id,
      cloudinaryPublicId: 'fallback',
      imageUrl: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=1200&auto=format&fit=crop',
      altText: product.title,
      displayOrder: 0,
      isPrimary: true,
    }
  ];

  const currentImage = images[selectedImageIndex] || images[0];

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      title: product.title,
      unitPrice: product.basePrice,
      quantity,
      imageUrl: currentImage.imageUrl,
      maxAvailableStock: product.stockQuantity,
      productType: product.productType,
    });
  };

  const whatsappInquiryUrl = getProductInquiryLink(
    product.title,
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
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-surface border border-border-subtle shadow-craft">
            <Image
              src={currentImage.imageUrl}
              alt={currentImage.altText || product.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute top-4 left-4">
              {product.productType === 'READY_MADE' ? (
                <Badge variant="sage">In Ready Stock</Badge>
              ) : (
                <Badge variant="terracotta">Made to Order ({product.preparationDays} days)</Badge>
              )}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border-subtle hover:border-secondary'
                  }`}
                >
                  <Image src={img.imageUrl} alt={img.altText} fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="space-y-8">
          <div className="space-y-3">
            {product.category && (
              <span className="text-xs uppercase font-bold tracking-widest text-secondary block">
                {product.category.name}
              </span>
            )}
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink leading-tight">
              {product.title}
            </h1>
            <div className="flex items-baseline gap-3 pt-1">
              <span className="font-serif text-3xl font-bold text-ink">
                {formatINR(product.basePrice)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
                <span className="text-base text-ink-muted line-through">
                  {formatINR(product.compareAtPrice)}
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

          {/* Quantity and Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-ink uppercase tracking-wider">Quantity:</span>
              <div className="flex items-center border border-border-subtle rounded-lg bg-surface">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:text-primary transition-colors text-ink-muted"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-ink">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:text-primary transition-colors text-ink-muted"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                className="flex-1 font-semibold"
              >
                <ShoppingBag className="w-5 h-5 mr-1.5" />
                <span>Add to Bag • {formatINR(product.basePrice * quantity)}</span>
              </Button>

              <Link
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button variant="whatsapp" size="lg" className="w-full font-semibold">
                  <MessageCircle className="w-5 h-5 fill-current mr-1.5" />
                  <span>Ask on WhatsApp</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Local Guarantees & vadodara Delivery Banner */}
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
                    ? 'Ready for Quick Local Dispatch'
                    : `Handcrafted in ${product.preparationDays || 3} Days`}
                </p>
                <p className="text-ink-muted">
                  Knitted with premium anti-pilling milk cotton yarn that retains color forever.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-border-subtle/50">
              <ShieldCheck className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
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
    </div>
  );
}
