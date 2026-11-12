'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin/dashboard';

  const [email, setEmail] = useState('krmanishh18@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid credentials. Please check your email and password.');
        setIsLoading(false);
        return;
      }

      // Success: navigate to target dashboard with full session sync
      window.location.href = redirectTo;
    } catch (err) {
      setError('Connection error. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-surface via-canvas to-blush/20">
      <div className="w-full max-w-md bg-surface p-8 sm:p-10 rounded-2xl border border-border-subtle shadow-craft-elevated space-y-7">
        <div className="text-center space-y-3">
          <div className="relative w-48 h-16 mx-auto">
            <Image
              src="/images/bloomora-logo.png"
              alt="Bloomora Logo"
              fill
              priority
              className="object-contain"
              sizes="192px"
            />
          </div>
          <div className="space-y-1">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
              Bloomora Studio Sign In
            </h1>
            <p className="text-xs text-ink-muted">
              Bloomora Handcrafted Creations • Administrative Portal
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2.5 animate-in fade-in-50">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-rose" />
              <span>Artisan Email ID</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="krmanishh18@gmail.com"
              className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose" />
              <span>Studio Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your studio password"
                className="w-full px-4 py-2.5 pr-11 rounded-xl bg-canvas border border-border-subtle text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full font-semibold shadow-craft"
            >
              <span>Authenticate & Enter Studio</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </form>

        <div className="pt-4 border-t border-border-subtle/80 flex items-center justify-between text-xs text-ink-muted">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <span>← Return to Storefront</span>
          </Link>
          <span className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authorized Studio</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-canvas flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-rose border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  );
}
