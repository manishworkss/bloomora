'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Package, Edit2, Trash2, Check, X, Sparkles, Minus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatINR } from '@/lib/formatters';
import { Product } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New Product Form State
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('cat-bouquets');
  const [price, setPrice] = useState('');
  const [comparePrice, setComparePrice] = useState('');
  const [productType, setProductType] = useState<'READY_MADE' | 'MADE_TO_ORDER'>('READY_MADE');
  const [preparationDays, setPreparationDays] = useState('3');
  const [stock, setStock] = useState('5');
  const [imageUrl, setImageUrl] = useState('');
  const [shortDescription, setShortDescription] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          categoryId,
          basePrice: Number(price),
          compareAtPrice: comparePrice ? Number(comparePrice) : undefined,
          productType,
          preparationDays: productType === 'MADE_TO_ORDER' ? Number(preparationDays) : 0,
          stockQuantity: Number(stock),
          shortDescription,
          imageUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        await fetchProducts();
        setShowAddModal(false);
        setTitle('');
        setPrice('');
        setComparePrice('');
        setImageUrl('');
        setShortDescription('');
      } else {
        alert(data.error || 'Failed to create product');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (id: string, currentPublished: boolean) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !currentPublished }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isPublished: !currentPublished } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStock = async (id: string, newStock: number) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockQuantity: newStock }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, stockQuantity: newStock } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to archive this creation from the catalog?')) {
      try {
        const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setProducts((prev) => prev.filter((p) => p.id !== id));
        }
      } catch (err) {
        console.error(err);
      }
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
            Add creations, adjust physical stock in real-time, and manage catalog status.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add New Creation</span>
        </Button>
      </div>

      {/* Products Table */}
      <div className="bg-surface rounded-2xl border border-border-subtle shadow-craft overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-ink-muted flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span>Loading Bloomora creations...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-ink-muted">
            <Package className="w-10 h-10 mx-auto text-ink-muted/50 mb-3" />
            <p className="font-semibold text-ink">No creations found in catalog</p>
            <p className="text-xs mt-1">Tap &quot;Add New Creation&quot; to list your first handmade item.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-canvas border-b border-border-subtle text-ink-muted uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-4">Creation & Details</th>
                  <th className="py-3 px-4">Price (INR)</th>
                  <th className="py-3 px-4">Fulfillment Mode</th>
                  <th className="py-3 px-4">Stock Units</th>
                  <th className="py-3 px-4">Catalog Status</th>
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
                    <td className="py-3.5 px-4 font-bold text-ink">
                      <div>
                        <span>{formatINR(product.basePrice)}</span>
                        {product.compareAtPrice && (
                          <span className="block text-[10px] text-ink-muted line-through">
                            {formatINR(product.compareAtPrice)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {product.productType === 'READY_MADE' ? (
                        <Badge variant="sage">Ready to Ship</Badge>
                      ) : (
                        <Badge variant="terracotta">
                          Made to Order ({product.preparationDays || 3}d)
                        </Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-2 border border-border-subtle rounded-lg px-2 py-1 bg-canvas">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateStock(product.id, Math.max(0, product.stockQuantity - 1))
                          }
                          className="w-5 h-5 flex items-center justify-center text-ink-muted hover:text-primary transition-colors font-bold"
                          title="Decrease stock"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span
                          className={`font-semibold min-w-[24px] text-center ${
                            product.stockQuantity <= 2 ? 'text-red-600' : 'text-ink'
                          }`}
                        >
                          {product.stockQuantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateStock(product.id, product.stockQuantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-ink-muted hover:text-primary transition-colors font-bold"
                          title="Increase stock"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(product.id, product.isPublished)}
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
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm animate-in fade-in duration-200">
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
                <label className="text-xs font-semibold text-ink uppercase">Product Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Crochet Yellow Daisy Charm"
                  className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink uppercase">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="cat-bouquets">Floral Bouquets</option>
                    <option value="cat-flowers">Desk Flower Pots</option>
                    <option value="cat-keychains">Handmade Keychains</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink uppercase">Price (INR) *</label>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink uppercase">Type</label>
                  <select
                    value={productType}
                    onChange={(e) =>
                      setProductType(e.target.value as 'READY_MADE' | 'MADE_TO_ORDER')
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="READY_MADE">Ready to Ship</option>
                    <option value="MADE_TO_ORDER">Made to Order</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink uppercase">
                    {productType === 'MADE_TO_ORDER' ? 'Prep Time (Days)' : 'Stock Quantity'}
                  </label>
                  {productType === 'MADE_TO_ORDER' ? (
                    <input
                      type="number"
                      min="1"
                      max="14"
                      value={preparationDays}
                      onChange={(e) => setPreparationDays(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <input
                      type="number"
                      min="0"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink uppercase">Photo URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or Cloudinary URL"
                  className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink uppercase">Short Description</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Soft milk-cotton yarn stitched with love in Vadodara."
                  className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Publish Creation'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
