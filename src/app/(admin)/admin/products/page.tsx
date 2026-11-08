'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Package, Edit2, Trash2, Check, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatINR } from '@/lib/formatters';
import { Product } from '@/types';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    categoryId: 'cat-bouquets',
    title: 'Everlasting Crochet Lavender & Tulip Bouquet',
    slug: 'everlasting-lavender-tulip-bouquet',
    fullDescription: 'Handcrafted bouquet with lavender and cream tulips.',
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
        id: 'img-1',
        productId: 'prod-001',
        cloudinaryPublicId: 'sample-1',
        imageUrl:
          'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=400&auto=format&fit=crop',
        altText: 'Bouquet',
        displayOrder: 0,
        isPrimary: true,
      },
    ],
    createdAt: '2026-11-09',
    updatedAt: '2026-11-09',
  },
  {
    id: 'prod-002',
    categoryId: 'cat-flowers',
    title: 'Mini Smiling Sunflower Crochet Desk Pot',
    slug: 'mini-smiling-sunflower-crochet-pot',
    fullDescription: 'Joyful handmade yellow sunflower.',
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
        id: 'img-2',
        productId: 'prod-002',
        cloudinaryPublicId: 'sample-2',
        imageUrl:
          'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=400&auto=format&fit=crop',
        altText: 'Sunflower',
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
    title: 'Handmade Daisy Flower Charm Keychain',
    slug: 'handmade-daisy-flower-charm-keychain',
    fullDescription: 'Delicate white daisy with yellow pistil.',
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
        id: 'img-3',
        productId: 'prod-003',
        cloudinaryPublicId: 'sample-3',
        imageUrl:
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&auto=format&fit=crop',
        altText: 'Keychain',
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
    title: 'Customizable Pastel Rose & Daisy Keepsake Bouquet',
    slug: 'customizable-pastel-rose-daisy-keepsake-bouquet',
    fullDescription: 'Bespoke bouquet customized with your favorite color palette.',
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
        id: 'img-4',
        productId: 'prod-004',
        cloudinaryPublicId: 'sample-4',
        imageUrl:
          'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=400&auto=format&fit=crop',
        altText: 'Custom Bouquet',
        displayOrder: 0,
        isPrimary: true,
      },
    ],
    createdAt: '2026-11-09',
    updatedAt: '2026-11-09',
  },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Product Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [productType, setProductType] = useState<'READY_MADE' | 'MADE_TO_ORDER'>('READY_MADE');
  const [stock, setStock] = useState('5');
  const [imageUrl, setImageUrl] = useState('');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      categoryId: 'cat-general',
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      fullDescription: 'Handmade with love in Vadodara.',
      basePrice: Number(price),
      productType,
      preparationDays: productType === 'MADE_TO_ORDER' ? 3 : 0,
      isPublished: true,
      isFeatured: false,
      hasVariants: false,
      stockQuantity: Number(stock),
      lowStockThreshold: 2,
      images: [
        {
          id: `img-${Date.now()}`,
          productId: `prod-${Date.now()}`,
          cloudinaryPublicId: 'custom',
          imageUrl:
            imageUrl.trim() ||
            'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=400&auto=format&fit=crop',
          altText: title,
          displayOrder: 0,
          isPrimary: true,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProducts([newProduct, ...products]);
    setShowAddModal(false);
    setTitle('');
    setPrice('');
    setImageUrl('');
  };

  const handleTogglePublish = (id: string) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, isPublished: !p.isPublished } : p))
    );
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to archive this product?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-secondary">
            Catalog Administration
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            Product & Inventory Manager
          </h1>
          <p className="text-xs text-ink-muted">
            Add creations, adjust physical stock, and set Cloudinary photography.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add New Creation</span>
        </Button>
      </div>

      {/* Products Table */}
      <div className="bg-surface rounded-2xl border border-border-subtle shadow-craft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border-subtle bg-canvas/40 text-ink-muted uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Creation</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Shelf Stock</th>
                <th className="py-3 px-4">Visibility</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50 text-ink">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-canvas/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-canvas border border-border-subtle shrink-0">
                        <Image
                          src={product.images[0]?.imageUrl || ''}
                          alt={product.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-ink">{product.title}</p>
                        <p className="text-[11px] text-ink-muted">Slug: /{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-ink">{formatINR(product.basePrice)}</td>
                  <td className="py-3.5 px-4">
                    {product.productType === 'READY_MADE' ? (
                      <Badge variant="sage">Ready to Ship</Badge>
                    ) : (
                      <Badge variant="terracotta">Made to Order</Badge>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`font-semibold ${product.stockQuantity <= 2 ? 'text-red-600' : 'text-ink'}`}>
                      {product.stockQuantity} units
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(product.id)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                        product.isPublished
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                      }`}
                    >
                      {product.isPublished ? 'Published' : 'Hidden'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-1.5 text-ink-muted hover:text-red-600 transition-colors"
                      aria-label="Archive product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-surface rounded-2xl border border-border-subtle p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3">
              <h3 className="font-serif text-lg font-bold text-ink">Add New Handmade Creation</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-ink-muted hover:text-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink uppercase">Product Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Crochet Yellow Daisy Charm"
                  className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink uppercase">Price (INR ₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="399"
                    className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink uppercase">Initial Stock</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink uppercase">Product Type</label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="READY_MADE">Ready to Ship (Shelf Stock)</option>
                  <option value="MADE_TO_ORDER">Made to Order (2-3 days)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink uppercase">Cloudinary Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://res.cloudinary.com/... or image link"
                  className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-[10px] text-ink-muted">
                  Leave blank to use a high-res artisan placeholder image.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Publish Creation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

