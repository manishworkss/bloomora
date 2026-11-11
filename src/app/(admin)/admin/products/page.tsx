'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
  Star,
  Upload,
  RotateCcw,
  Eraser,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatINR } from '@/lib/formatters';
import { isSeededCatalogProduct } from '@/lib/catalog-seed';
import { Product, Category } from '@/types';

function AdminProductsContent() {
  const searchParams = useSearchParams();
  const categoryIdParam = searchParams?.get('categoryId');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'seed' | 'custom'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkNotice, setBulkNotice] = useState<string | null>(null);

  // Add / Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const productFileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [comparePrice, setComparePrice] = useState('');
  const [productType, setProductType] = useState<'READY_MADE' | 'MADE_TO_ORDER'>('READY_MADE');
  const [preparationDays, setPreparationDays] = useState('0');
  const [stock, setStock] = useState('5');
  const [imageUrl, setImageUrl] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  const fetchProducts = async () => {
    try {
      const [prodsRes, catsRes] = await Promise.all([
        fetch('/api/admin/products', { cache: 'no-store' }),
        fetch('/api/admin/categories', { cache: 'no-store' }),
      ]);
      const prodsData = await prodsRes.json();
      const catsData = await catsRes.json();

      if (prodsData.success && Array.isArray(prodsData.products)) {
        setProducts(prodsData.products);
      }
      if (catsData.success && Array.isArray(catsData.categories)) {
        setCategories(catsData.categories);
        if (catsData.categories.length > 0 && !categoryId) {
          setCategoryId(catsData.categories[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load products or categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (categoryIdParam) {
      setSelectedCategoryFilter(categoryIdParam);
      setCategoryId(categoryIdParam);
      setShowModal(true);
    }
  }, [categoryIdParam]);

  const handleProductFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setImageUrl(data.url);
      } else {
        alert(data.error || 'Failed to upload photo');
      }
    } catch (err) {
      console.error('Product image upload error:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle('');
    setCategoryId(categories.length > 0 ? categories[0].id : '');
    setPrice('');
    setComparePrice('');
    setProductType('READY_MADE');
    setPreparationDays('0');
    setStock('5');
    setImageUrl('');
    setShortDescription('');
    setFullDescription('');
    setIsFeatured(false);
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
    setFullDescription(product.fullDescription || '');
    setIsFeatured(!!product.isFeatured);
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
            fullDescription,
            isFeatured,
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
            fullDescription,
            imageUrl: imageUrl?.trim() || '',
            isFeatured,
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

  const handleUpdateStock = async (id: string, newStock: number) => {
    try {
      setProducts(products.map((p) => (p.id === id ? { ...p, stockQuantity: newStock } : p)));
      await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockQuantity: newStock }),
      });
    } catch (err) {
      console.error('Failed to update stock:', err);
      fetchProducts();
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const nextStatus = !currentStatus;
      setProducts(products.map((p) => (p.id === id ? { ...p, isPublished: nextStatus } : p)));
      await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: nextStatus }),
      });
    } catch (err) {
      console.error('Failed to toggle publish:', err);
      fetchProducts();
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const nextFeatured = !currentFeatured;
      setProducts(products.map((p) => (p.id === id ? { ...p, isFeatured: nextFeatured } : p)));
      await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: nextFeatured }),
      });
    } catch (err) {
      console.error('Failed to toggle featured highlight:', err);
      fetchProducts();
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this creation from the catalog?')) return;
    try {
      setProducts(products.filter((p) => p.id !== id));
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) {
        alert(data.error || 'Failed to delete creation');
        fetchProducts();
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
      fetchProducts();
    }
  };

  const seedCount = products.filter((p) => isSeededCatalogProduct(p)).length;
  const customCount = products.length - seedCount;

  const filteredProducts = products.filter((p) => {
    const isSeed = isSeededCatalogProduct(p);
    if (sourceFilter === 'seed' && !isSeed) return false;
    if (sourceFilter === 'custom' && isSeed) return false;

    const matchCategory =
      selectedCategoryFilter === 'all' ||
      p.categoryId === selectedCategoryFilter ||
      p.category?.id === selectedCategoryFilter ||
      p.category?.slug === selectedCategoryFilter ||
      p.category?.slug === selectedCategoryFilter.replace('cat-', '');

    const matchSearch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  const allVisibleSelected =
    filteredProducts.length > 0 && filteredProducts.every((p) => selectedIds.includes(p.id));

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      const visibleSet = new Set(filteredProducts.map((p) => p.id));
      setSelectedIds((prev) => prev.filter((id) => !visibleSet.has(id)));
    } else {
      const merged = new Set([...selectedIds, ...filteredProducts.map((p) => p.id)]);
      setSelectedIds(Array.from(merged));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((existing) => existing !== id) : [...prev, id]
    );
  };

  const runBulkAction = async (
    payload:
      | { action: 'delete_selected' | 'publish_selected' | 'unpublish_selected'; ids: string[] }
      | { action: 'clean_demo_all' | 'restore_demo_catalog' }
      | { action: 'clean_demo_category'; categoryId: string },
    confirmText?: string
  ) => {
    if (confirmText && !confirm(confirmText)) return;
    setBulkRunning(true);
    setBulkNotice(null);
    try {
      const res = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setBulkNotice(data.message || 'Catalog updated successfully.');
        if (payload.action === 'delete_selected' || payload.action.startsWith('clean_demo')) {
          setSelectedIds([]);
        }
        await fetchProducts();
      } else {
        alert(data.error || 'Bulk operation failed.');
      }
    } catch (err) {
      console.error('Bulk catalog action error:', err);
      alert('Network error running bulk action.');
    } finally {
      setBulkRunning(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-rose">
            Live Catalog & Pricing
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            Handmade Creations & Inventory
          </h1>
          <p className="text-xs text-ink-muted">
            Changes made here instantly update titles, prices, descriptions, images, and homepage highlights on the live website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {seedCount < 60 && (
            <Button
              variant="outline"
              size="sm"
              disabled={bulkRunning}
              onClick={() =>
                runBulkAction(
                  { action: 'restore_demo_catalog' },
                  'Restore all 60 starter creations (10 per category)? Existing custom creations are preserved.'
                )
              }
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              <span>Load Starter 60</span>
            </Button>
          )}
          {seedCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              disabled={bulkRunning}
              onClick={() =>
                runBulkAction(
                  selectedCategoryFilter !== 'all'
                    ? { action: 'clean_demo_category', categoryId: selectedCategoryFilter }
                    : { action: 'clean_demo_all' },
                  selectedCategoryFilter !== 'all'
                    ? 'Clean starter demo items in this category? Your own custom creations will remain untouched.'
                    : `Clean all ${seedCount} starter demo items? Any custom creations you added will stay safe.`
                )
              }
              className="border-rose/30 text-rose hover:bg-blush/30"
            >
              <Eraser className="w-3.5 h-3.5 mr-1.5" />
              <span>
                {selectedCategoryFilter !== 'all' ? 'Clean Category Demo' : `Clean Starter (${seedCount})`}
              </span>
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={openAddModal} className="shadow-craft">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Add New Creation</span>
          </Button>
        </div>
      </div>

      {bulkNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl px-4 py-2.5 text-xs font-medium flex items-center justify-between gap-2">
          <span>{bulkNotice}</span>
          <button
            type="button"
            onClick={() => setBulkNotice(null)}
            className="text-emerald-700 hover:text-emerald-950 p-0.5"
            aria-label="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Search & Category Filters Bar */}
      <div className="bg-surface p-4 rounded-2xl border border-border-subtle shadow-subtle space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by creation name, keyword, or slug..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-canvas border border-border-subtle text-xs text-ink placeholder:text-ink-muted/70 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Cleanable Source Filter Tabs */}
          <div className="inline-flex items-center gap-1 bg-canvas p-1 rounded-xl border border-border-subtle self-start sm:self-auto">
            {(
              [
                { id: 'all', label: `All (${products.length})` },
                { id: 'seed', label: `Starter Seed (${seedCount})` },
                { id: 'custom', label: `Custom (${customCount})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSourceFilter(tab.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  sourceFilter === tab.id
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategoryFilter === 'all'
                ? 'bg-primary text-white'
                : 'bg-canvas text-ink-muted hover:text-ink border border-border-subtle'
            }`}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategoryFilter === cat.id
                  ? 'bg-primary text-white'
                  : 'bg-canvas text-ink-muted hover:text-ink border border-border-subtle'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Rows Bulk Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-surface border border-primary/25 rounded-xl px-4 py-2.5 shadow-subtle flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-ink">
            {selectedIds.length} creation{selectedIds.length === 1 ? '' : 's'} selected
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={bulkRunning}
              onClick={() => runBulkAction({ action: 'publish_selected', ids: selectedIds })}
            >
              Publish Live
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={bulkRunning}
              onClick={() => runBulkAction({ action: 'unpublish_selected', ids: selectedIds })}
            >
              Hide
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={bulkRunning}
              onClick={() =>
                runBulkAction(
                  { action: 'delete_selected', ids: selectedIds },
                  `Permanently remove ${selectedIds.length} selected item(s)?`
                )
              }
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Delete Selected
            </Button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-ink-muted hover:text-ink px-2 py-1 font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* 3. Products Table */}
      <div className="bg-surface rounded-2xl border border-border-subtle shadow-craft overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-ink-muted text-xs flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-rose" />
            <span>Loading studio inventory...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Package className="w-8 h-8 text-ink-muted mx-auto opacity-50" />
            <p className="text-sm font-semibold text-ink">No creations match your search.</p>
            <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setSelectedCategoryFilter('all'); }}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-canvas/80 border-b border-border-subtle text-ink-muted uppercase font-bold tracking-wider text-[10px]">
                  <th className="py-3 pl-4 pr-2 w-8">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAllVisible}
                      aria-label="Select all visible products"
                      className="rounded border-border-subtle text-primary focus:ring-primary"
                    />
                  </th>
                  <th className="py-3 px-4">Creation & Photo</th>
                  <th className="py-3 px-4">Price (INR)</th>
                  <th className="py-3 px-4">Fulfillment</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Homepage Highlight</th>
                  <th className="py-3 px-4">Visibility</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/50 text-ink">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-canvas/50 transition-colors">
                    <td className="py-3.5 pl-4 pr-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(product.id)}
                        onChange={() => toggleSelectOne(product.id)}
                        aria-label={`Select ${product.title}`}
                        className="rounded border-border-subtle text-primary focus:ring-primary"
                      />
                    </td>
                    {/* Creation & Photo */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-canvas border border-border-subtle shrink-0 flex items-center justify-center">
                          {product.images?.[0]?.imageUrl ? (
                            <Image
                              src={product.images[0].imageUrl}
                              alt={product.title}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-blush/40 text-rose">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold text-ink truncate max-w-[180px]">{product.title}</p>
                            {isSeededCatalogProduct(product) && (
                              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blush/50 text-rose border border-primary/15 shrink-0">
                                Starter
                              </span>
                            )}
                          </div>
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

                    {/* Homepage Highlight Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(product.id, !!product.isFeatured)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                          product.isFeatured
                            ? 'bg-amber-50 text-amber-900 border border-amber-200'
                            : 'bg-canvas text-ink-muted hover:text-ink border border-border-subtle'
                        }`}
                        title="Click to toggle featured spotlight on homepage"
                      >
                        <Star className={`w-3.5 h-3.5 ${product.isFeatured ? 'fill-amber-400 text-amber-500' : 'text-ink-muted/50'}`} />
                        <span>{product.isFeatured ? 'Featured 🌟' : 'Standard'}</span>
                      </button>
                    </td>

                    {/* Storefront Visibility Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(product.id, product.isPublished)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                          product.isPublished
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                        }`}
                        title="Click to toggle visibility on live storefront"
                      >
                        {product.isPublished ? (
                          <>
                            <Eye className="w-3 h-3 text-emerald-600" />
                            <span>Live</span>
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
                          title="Edit creation details, description & price"
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
                    ? 'Changes immediately update on the live website and product showroom.'
                    : 'List a new handcrafted piece on the Bloomora live storefront.'}
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
                    {categories.length === 0 && <option value="">No categories created yet</option>}
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
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
                    className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>
              </div>

              {/* Compare Price & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                    Compare At MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={comparePrice}
                    onChange={(e) => setComparePrice(e.target.value)}
                    placeholder="e.g. 499 (optional strikethrough)"
                    className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink uppercase tracking-wider">Stock Units</label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="5"
                    className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>
              </div>

              {/* Fulfillment Type */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink uppercase tracking-wider">Fulfillment Type</label>
                <select
                  value={productType}
                  onChange={(e) =>
                    setProductType(e.target.value as 'READY_MADE' | 'MADE_TO_ORDER')
                  }
                  className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="READY_MADE">In Ready Stock (Immediate Dispatch)</option>
                  <option value="MADE_TO_ORDER">Handcrafted to Order (Custom Commission)</option>
                </select>
              </div>

              {/* Homepage Highlight Checkbox */}
              <div className="p-3 bg-canvas rounded-xl border border-border-subtle flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isFeaturedToggle"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-border-subtle cursor-pointer"
                />
                <label htmlFor="isFeaturedToggle" className="cursor-pointer text-xs font-semibold text-ink flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span>Highlight on Homepage Showroom (Featured Spotlight)</span>
                </label>
              </div>

              {/* Product Photo Field with Upload and Preview */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                    Creation Photo *
                  </label>
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="text-[10px] text-red-600 hover:underline"
                    >
                      Clear photo
                    </button>
                  )}
                </div>

                {/* Live Preview */}
                {imageUrl && (
                  <div className="relative aspect-[4/3] max-w-[200px] rounded-xl overflow-hidden border border-border-subtle bg-canvas">
                    <Image
                      src={imageUrl}
                      alt="Product preview"
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={productFileInputRef}
                    accept="image/*"
                    onChange={handleProductFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploadingImage}
                    onClick={() => productFileInputRef.current?.click()}
                    className="shrink-0 flex items-center gap-1.5 text-xs bg-canvas hover:bg-surface border-border-subtle"
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-rose" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-rose" />
                        <span>Upload Photo</span>
                      </>
                    )}
                  </Button>

                  <input
                    type="text"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Or enter image URL (https://...)"
                    className="flex-1 px-3.5 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink uppercase tracking-wider">Short Tagline (Card Preview)</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Soft milk-cotton yarn stitched with love in Vadodara."
                  className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Full Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink uppercase tracking-wider">Full Story & Description</label>
                <textarea
                  rows={3}
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  placeholder="Detailed description of yarn texture, dimensions, care, and packaging..."
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
                <Button type="submit" variant="primary" size="sm" disabled={submitting} className="shadow-craft">
                  {submitting
                    ? isEditing
                      ? 'Saving...'
                      : 'Creating...'
                    : isEditing
                    ? 'Save & Update Live Store'
                    : 'Publish to Storefront'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-ink-muted">Loading product catalog...</div>}>
      <AdminProductsContent />
    </Suspense>
  );
}
