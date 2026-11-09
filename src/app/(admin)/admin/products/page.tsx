'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus,
  Package,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  Minus,
  Loader2,
  Search,
  ExternalLink,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatINR } from '@/lib/formatters';
import { Product } from '@/types';

const SAMPLE_PHOTO_PRESETS = [
  {
    label: 'Studio Bouquet',
    url: '/images/bloomora-hero-handcrafted.jpg',
  },
  {
    label: 'Sunflower Pot',
    url: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=800&auto=format&fit=crop',
  },
  {
    label: 'Lavender Bouquet',
    url: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800&auto=format&fit=crop',
  },
  {
    label: 'Daisy Keychain',
    url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
  },
  {
    label: 'Strawberry Charm',
    url: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=800&auto=format&fit=crop',
  },
  {
    label: 'Rose Desk Pot',
    url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop',
  },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Add / Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('cat-bouquets');
  const [price, setPrice] = useState('');
  const [comparePrice, setComparePrice] = useState('');
  const [productType, setProductType] = useState<'READY_MADE' | 'MADE_TO_ORDER'>('READY_MADE');
  const [preparationDays, setPreparationDays] = useState('0');
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

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle('');
    setCategoryId('cat-bouquets');
    setPrice('');
    setComparePrice('');
    setProductType('READY_MADE');
    setPreparationDays('0');
    setStock('5');
    setImageUrl(SAMPLE_PHOTO_PRESETS[0].url);
    setShortDescription('');
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setIsEditing(true);
    setEditingId(product.id);
    setTitle(product.title);
    setCategoryId(product.categoryId);
    setPrice(String(product.basePrice));
    setComparePrice(product.compareAtPrice ? String(product.compareAtPrice) : '');
    setProductType(product.productType);
    setPreparationDays(String(product.preparationDays || 0));
    setStock(String(product.stockQuantity));
    setImageUrl(product.images?.[0]?.imageUrl || '');
    setShortDescription(product.shortDescription || '');
    setShowModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditing && editingId) {
        // PATCH existing
        const res = await fetch(`/api/admin/products/${editingId}`, {
          method: 'PATCH',
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
            ...(imageUrl ? { images: [{ id: `img-${Date.now()}`, productId: editingId, imageUrl, isPrimary: true }] } : {}),
          }),
        });
        const data = await res.json();
        if (data.success) {
          await fetchProducts();
          setShowModal(false);
        } else {
          alert(data.error || 'Failed to update product');
        }
      } else {
        // POST new
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
            imageUrl: imageUrl || SAMPLE_PHOTO_PRESETS[0].url,
          }),
        });

        const data = await res.json();
        if (data.success) {
          await fetchProducts();
          setShowModal(false);
        } else {
          alert(data.error || 'Failed to create product');
        }
      }
    } catch (err) {
      console.error(err);
      alert('Error saving product');
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

  const filteredProducts = products.filter((p) => {
    if (selectedCategoryFilter !== 'all') {
      if (p.categoryId !== selectedCategoryFilter && p.category?.slug !== selectedCategoryFilter) {
        return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.shortDescription?.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-6 rounded-2xl border border-border-subtle shadow-subtle">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blush text-rose text-[10px] font-bold uppercase tracking-wider">
            <Package className="w-3 h-3" />
            <span>Product & Inventory Management</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            Handcrafted Creations Catalog
          </h1>
          <p className="text-xs text-ink-muted">
            Add new creations, adjust stock levels in real time, and toggle catalog visibility.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={openAddModal} className="gap-1.5">
          <Plus className="w-4 h-4" />
          <span>Add New Creation</span>
        </Button>
      </div>

      {/* 2. Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-surface rounded-2xl border border-border-subtle shadow-subtle">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'cat-bouquets', label: 'Floral Bouquets' },
            { id: 'cat-flowers', label: 'Desk Pots' },
            { id: 'cat-keychains', label: 'Keychains' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategoryFilter === cat.id
                  ? 'bg-rose text-white shadow-subtle'
                  : 'bg-canvas text-ink-muted hover:text-ink border border-border-subtle'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog items..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-canvas border border-border-subtle text-xs text-ink placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* 3. Products Table */}
      <div className="bg-surface rounded-2xl border border-border-subtle shadow-subtle overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-ink-muted flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-rose" />
            <span>Loading creations...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-ink-muted space-y-3">
            <Package className="w-10 h-10 mx-auto text-ink-muted/50" />
            <p className="font-semibold text-ink">No creations match your filter</p>
            <p className="text-xs">Adjust your search or click &quot;Add New Creation&quot; to list a new item.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-canvas border-b border-border-subtle text-ink-muted uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-4">Creation & Photo</th>
                  <th className="py-3 px-4">Price (INR)</th>
                  <th className="py-3 px-4">Fulfillment Mode</th>
                  <th className="py-3 px-4">Stock In Studio</th>
                  <th className="py-3 px-4">Storefront Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/50 text-ink">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-canvas/50 transition-colors">
                    {/* Creation & Photo */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-canvas border border-border-subtle shrink-0">
                          <Image
                            src={product.images?.[0]?.imageUrl || SAMPLE_PHOTO_PRESETS[0].url}
                            alt={product.title}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-ink truncate max-w-[200px]">{product.title}</p>
                          <Link
                            href={`/shop/${product.slug}`}
                            target="_blank"
                            className="text-[11px] text-rose hover:underline inline-flex items-center gap-0.5 mt-0.5"
                          >
                            <span>/{product.slug}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-bold text-ink">
                      <div>
                        <span>{formatINR(product.basePrice)}</span>
                        {product.compareAtPrice && (
                          <span className="block text-[10px] text-ink-muted line-through font-normal">
                            {formatINR(product.compareAtPrice)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Fulfillment Mode */}
                    <td className="py-3.5 px-4">
                      {product.productType === 'READY_MADE' ? (
                        <Badge variant="sage">In Ready Stock</Badge>
                      ) : (
                        <Badge variant="terracotta">
                          Made to Order
                        </Badge>
                      )}
                    </td>

                    {/* Stock Units (Live Adjuster) */}
                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1.5 border border-border-subtle rounded-lg px-2 py-1 bg-canvas">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateStock(product.id, Math.max(0, product.stockQuantity - 1))
                          }
                          className="w-5 h-5 flex items-center justify-center text-ink-muted hover:text-rose transition-colors font-bold"
                          title="Decrease stock by 1"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span
                          className={`font-semibold min-w-[24px] text-center ${
                            product.stockQuantity <= 2 ? 'text-red-600 font-bold' : 'text-ink'
                          }`}
                        >
                          {product.stockQuantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateStock(product.id, product.stockQuantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-ink-muted hover:text-rose transition-colors font-bold"
                          title="Increase stock by 1"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Storefront Status Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(product.id, product.isPublished)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                          product.isPublished
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                        }`}
                        title="Click to toggle visibility on storefront"
                      >
                        {product.isPublished ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(product)}
                          className="p-1.5 text-ink-muted hover:text-rose hover:bg-canvas rounded-lg transition-colors"
                          title="Edit creation details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1.5 text-ink-muted hover:text-red-600 hover:bg-canvas rounded-lg transition-colors"
                          title="Archive from catalog"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-surface rounded-2xl border border-border-subtle p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-ink">
                  {isEditing ? 'Edit Creation' : 'Add New Handmade Creation'}
                </h3>
                <p className="text-[11px] text-ink-muted">
                  {isEditing
                    ? 'Update details, prices, and inventory for this creation.'
                    : 'List a new handcrafted item on the Bloomora storefront.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 text-ink-muted hover:text-ink rounded-lg hover:bg-canvas"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink uppercase tracking-wider">Creation Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Pastel Daisy Crochet Keepsake Charm"
                  className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink uppercase tracking-wider">Category</label>
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
                  <label className="text-xs font-semibold text-ink uppercase tracking-wider">Price (₹ INR) *</label>
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

              {/* Stock Type & Stock Count */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink uppercase tracking-wider">Fulfillment Type</label>
                  <select
                    value={productType}
                    onChange={(e) =>
                      setProductType(e.target.value as 'READY_MADE' | 'MADE_TO_ORDER')
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="READY_MADE">In Ready Stock (Immediate)</option>
                    <option value="MADE_TO_ORDER">Handcrafted to Order</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink uppercase tracking-wider">Stock Units Available</label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="5"
                    className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Preset Sample Photos for Fast Listing */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold text-ink uppercase tracking-wider flex items-center justify-between">
                  <span>Photo URL</span>
                  <span className="text-[10px] text-rose font-normal">Choose preset or enter custom</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_PHOTO_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                        imageUrl === preset.url
                          ? 'bg-rose text-white'
                          : 'bg-canvas text-ink-muted hover:text-ink border border-border-subtle'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... or select a preset above"
                  className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Short Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink uppercase tracking-wider">Short Description</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Soft milk-cotton yarn stitched with love in Vadodara."
                  className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={submitting}>
                  {submitting
                    ? isEditing
                      ? 'Saving...'
                      : 'Creating...'
                    : isEditing
                    ? 'Save Changes'
                    : 'Publish Creation'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
