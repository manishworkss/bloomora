'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus,
  Layers,
  Edit2,
  Trash2,
  Upload,
  X,
  Package,
  Loader2,
  Check,
  ImageIcon,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Category, Product } from '@/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState('1');
  const [isActive, setIsActive] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      const [catsRes, prodsRes] = await Promise.all([
        fetch('/api/admin/categories', { cache: 'no-store' }),
        fetch('/api/admin/products', { cache: 'no-store' }),
      ]);
      const catsData = await catsRes.json();
      const prodsData = await prodsRes.json();

      if (catsData.success && Array.isArray(catsData.categories)) {
        setCategories(catsData.categories);
      }
      if (prodsData.success && Array.isArray(prodsData.products)) {
        setProducts(prodsData.products);
      }
    } catch (err) {
      console.error('Failed to load categories or products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setImageUrl('');
    setDisplayOrder(String(categories.length + 1));
    setIsActive(true);
    setShowModal(true);
  };

  const openEditModal = (cat: Category) => {
    setIsEditing(true);
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImageUrl(cat.imageUrl || '');
    setDisplayOrder(String(cat.displayOrder || 1));
    setIsActive(cat.isActive);
    setShowModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        alert(data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      const payload: Partial<Category> = {
        id: editingId || undefined,
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        displayOrder: parseInt(displayOrder) || 1,
        isActive,
      };

      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setShowModal(false);
        fetchData();
      } else {
        alert(data.error || 'Failed to save category');
      }
    } catch (err) {
      console.error('Save category error:', err);
      alert('An error occurred while saving the category.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string, catName: string) => {
    const prodsInCat = products.filter((p) => p.categoryId === id);
    if (prodsInCat.length > 0) {
      alert(`Cannot delete "${catName}" because it currently has ${prodsInCat.length} products. Reassign or delete those products first.`);
      return;
    }

    if (!confirm(`Are you sure you want to delete the category "${catName}"?`)) return;

    try {
      setCategories(categories.filter((c) => c.id !== id));
      await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Delete error:', err);
      fetchData();
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink flex items-center gap-2">
            <Layers className="w-7 h-7 text-rose" />
            <span>Categories & Profile Covers</span>
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Manage your store collections, upload cover profile pics for each category, and organize creations.
          </p>
        </div>

        <Button
          onClick={openAddModal}
          variant="primary"
          size="sm"
          className="shadow-craft flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </Button>
      </div>

      {/* 2. Category Cards Grid */}
      {loading ? (
        <div className="p-16 text-center text-xs text-ink-muted flex items-center justify-center gap-2 bg-surface rounded-2xl border border-border-subtle">
          <Loader2 className="w-5 h-5 animate-spin text-rose" />
          <span>Loading categories...</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-2xl border border-border-subtle p-8 space-y-3">
          <Layers className="w-10 h-10 text-rose/50 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-ink">No Categories Created Yet</h3>
          <p className="text-xs text-ink-muted max-w-sm mx-auto">
            Create your first category (e.g. Floral Bouquets, Desk Flower Pots) and upload its cover picture.
          </p>
          <Button onClick={openAddModal} variant="primary" size="sm">
            Add Category
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const productCount = products.filter(
              (p) => p.categoryId === cat.id || p.category?.slug === cat.slug
            ).length;

            return (
              <div
                key={cat.id}
                className="bg-surface rounded-2xl border border-border-subtle overflow-hidden shadow-subtle hover:shadow-craft transition-all flex flex-col justify-between"
              >
                {/* Profile Pic / Cover Image Container */}
                <div>
                  <div className="relative aspect-[16/10] w-full bg-canvas/80 border-b border-border-subtle overflow-hidden group">
                    {cat.imageUrl ? (
                      <Image
                        src={cat.imageUrl}
                        alt={cat.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-ink-muted/60 p-4 text-center">
                        <ImageIcon className="w-10 h-10 mb-2 stroke-[1.25]" />
                        <span className="text-xs font-medium">No cover picture uploaded</span>
                        <span className="text-[10px] text-ink-muted/50 mt-0.5">
                          Click Edit to add a profile pic
                        </span>
                      </div>
                    )}

                    {/* Status Pill Badge */}
                    <div className="absolute top-3 left-3">
                      {cat.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-surface/90 backdrop-blur-md text-emerald-700 border border-emerald-200 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Active on Store</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-surface/90 backdrop-blur-md text-ink-muted border border-border-subtle shadow-sm">
                          <span>Hidden</span>
                        </span>
                      )}
                    </div>

                    {/* Products Count Badge */}
                    <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-md border border-border-subtle px-2.5 py-1 rounded-full text-[11px] font-bold text-ink shadow-sm flex items-center gap-1">
                      <Package className="w-3.5 h-3.5 text-rose" />
                      <span>{productCount} products</span>
                    </div>
                  </div>

                  {/* Category Details */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-lg font-bold text-ink leading-snug">
                        {cat.name}
                      </h3>
                      <span className="text-[11px] text-ink-muted font-mono bg-canvas px-2 py-0.5 rounded border border-border-subtle shrink-0">
                        /{cat.slug}
                      </span>
                    </div>

                    <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
                      {cat.description || 'No description provided for this collection.'}
                    </p>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="p-4 pt-2 border-t border-border-subtle/70 bg-canvas/30 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      href={`/admin/products?categoryId=${cat.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose hover:text-rose-dark transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Product Here</span>
                    </Link>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface border border-transparent hover:border-border-subtle transition-all"
                        title="Edit Category & Cover Image"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="p-1.5 rounded-lg text-ink-muted hover:text-red-600 hover:bg-surface border border-transparent hover:border-border-subtle transition-all"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Add / Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-surface rounded-2xl border border-border-subtle p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-ink">
                  {isEditing ? 'Edit Category & Cover Picture' : 'Add New Category'}
                </h3>
                <p className="text-[11px] text-ink-muted">
                  Categories organize products on your website and show on the homepage.
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

            <form onSubmit={handleSaveCategory} className="space-y-4">
              {/* Category Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!isEditing) {
                      setSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)/g, '')
                      );
                    }
                  }}
                  placeholder="e.g. Floral Bouquets"
                  className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Slug URL */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                  Category URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. bouquets"
                  className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                />
              </div>

              {/* Profile Pic / Cover Image Upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                    Category Profile Picture / Cover
                  </label>
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="text-[10px] text-red-600 hover:underline"
                    >
                      Remove picture
                    </button>
                  )}
                </div>

                {/* Live Preview */}
                {imageUrl ? (
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-border-subtle bg-canvas">
                    <Image
                      src={imageUrl}
                      alt="Category preview"
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border-subtle rounded-xl p-4 text-center bg-canvas/40 space-y-2">
                    <ImageIcon className="w-8 h-8 text-ink-muted/50 mx-auto" />
                    <p className="text-xs text-ink-muted">
                      Upload an image from your device or paste an image URL below
                    </p>
                  </div>
                )}

                {/* Upload or URL Inputs */}
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="shrink-0 flex items-center gap-1.5 text-xs bg-canvas hover:bg-surface border-border-subtle"
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-rose" />
                        <span>Upload File</span>
                      </>
                    )}
                  </Button>

                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Or paste image URL (e.g. /images/... or https://...)"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short tagline shown under category card..."
                  className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Display Order & Active */}
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="catIsActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-rose focus:ring-rose accent-rose"
                  />
                  <label htmlFor="catIsActive" className="text-xs font-medium text-ink cursor-pointer">
                    Visible on website
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-border-subtle">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={submitting || uploadingImage}
                >
                  {submitting ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

