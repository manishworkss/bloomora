'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { formatINR } from '@/lib/formatters';
import { Product } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/store/products`);
        const data = await res.json();
        if (data.success) {
          const q = query.toLowerCase().trim();
          const filtered = data.products.filter(
            (p: Product) =>
              p.title.toLowerCase().includes(q) ||
              p.shortDescription?.toLowerCase().includes(q) ||
              p.category?.name?.toLowerCase().includes(q)
          );
          setResults(filtered.slice(0, 6));
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-ink/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-surface rounded-2xl border border-border-subtle shadow-craft-elevated overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-border-subtle gap-3">
          <Search className="w-5 h-5 text-ink-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search handmade bouquets, keychains, flowers, desk pots..."
            className="w-full bg-transparent text-sm sm:text-base text-ink placeholder:text-ink-muted/70 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-ink-muted hover:text-ink"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold px-2.5 py-1 rounded-md text-ink-muted hover:text-ink hover:bg-canvas"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestion Pills when query is empty */}
        {!query && (
          <div className="p-5 space-y-3 bg-canvas/40">
            <p className="text-[11px] uppercase tracking-wider font-bold text-ink-muted">
              Popular Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {['Lavender Bouquet', 'Smiling Sunflower', 'Daisy Keychain', 'Pastel Roses', 'Desk Pots'].map(
                (term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="text-xs px-3 py-1.5 rounded-full bg-surface border border-border-subtle text-ink hover:border-primary hover:text-primary transition-colors"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Results Container */}
        {query && (
          <div className="p-5 max-h-[60vh] overflow-y-auto divide-y divide-border-subtle/50">
            {loading ? (
              <div className="py-10 text-center text-xs text-ink-muted flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>Searching Bloomora creations...</span>
              </div>
            ) : results.length === 0 ? (
              <div className="py-10 text-center text-xs text-ink-muted space-y-2">
                <p>No creations found matching &quot;{query}&quot;.</p>
                <Link
                  href="/custom-orders"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Request a custom commission instead</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[11px] uppercase tracking-wider font-bold text-ink-muted">
                  Found {results.length} handmade {results.length === 1 ? 'creation' : 'creations'}
                </p>
                <div className="grid grid-cols-1 gap-2.5">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/shop/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-canvas transition-colors group"
                    >
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-canvas border border-border-subtle shrink-0">
                        <Image
                          src={product.images[0]?.imageUrl || ''}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="56px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs text-ink group-hover:text-primary truncate transition-colors">
                          {product.title}
                        </p>
                        <p className="text-[11px] text-ink-muted truncate">
                          {product.shortDescription}
                        </p>
                        <p className="font-bold text-xs text-ink mt-0.5">
                          {formatINR(product.basePrice)}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-ink-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

