'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('owner@bloomora.in');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      router.push('/admin/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-surface to-canvas">
      <div className="w-full max-w-md bg-surface p-8 sm:p-10 rounded-2xl border border-border-subtle shadow-craft-elevated space-y-8">
        <div className="text-center space-y-3">
          <div className="relative w-56 h-20 mx-auto">
            <Image
              src="/images/bloomora-logo.png"
              alt="Bloomora Logo"
              fill
              priority
              className="object-contain"
              sizes="224px"
            />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            Bloomora Admin Sign In
          </h1>
          <p className="text-xs text-ink-muted">
            Handcrafted Creations • Studio Management
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink uppercase tracking-wider">
              Artisan Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 rounded-lg bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full font-semibold">
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>

        <div className="pt-4 border-t border-border-subtle/80 flex items-center justify-between text-xs text-ink-muted">
          <Link href="/" className="hover:text-primary transition-colors">
            ← Return to Storefront
          </Link>
          <span className="flex items-center gap-1 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-sage" />
            <span>Encrypted Session</span>
          </span>
        </div>
      </div>
    </div>
  );
}
