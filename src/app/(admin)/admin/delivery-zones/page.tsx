'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Check, Trash2, Truck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatINR } from '@/lib/formatters';

interface Zone {
  pin: string;
  area: string;
  fee: number;
  active: boolean;
}

export default function AdminDeliveryZonesPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPin, setNewPin] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newFee, setNewFee] = useState('50');
  const [submitting, setSubmitting] = useState(false);

  const loadZones = async () => {
    try {
      const res = await fetch('/api/admin/delivery-zones', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.zones)) {
        setZones(data.zones);
      }
    } catch (err) {
      console.error('Failed to load zones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadZones();
  }, []);

  const handleToggleActive = async (pin: string) => {
    // Optimistic update
    setZones((prev) =>
      prev.map((z) => (z.pin === pin ? { ...z, active: !z.active } : z))
    );
    try {
      await fetch('/api/admin/delivery-zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle', pin }),
      });
    } catch (err) {
      console.error('Failed to toggle zone:', err);
      loadZones();
    }
  };

  const handleAddZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin || !newArea) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/delivery-zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: newPin,
          area: newArea,
          fee: Number(newFee) || 50,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewPin('');
        setNewArea('');
        await loadZones();
      }
    } catch (err) {
      console.error('Failed to add zone:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteZone = async (pin: string) => {
    if (!confirm(`Are you sure you want to remove PIN ${pin}?`)) return;
    setZones((prev) => prev.filter((z) => z.pin !== pin));
    try {
      await fetch('/api/admin/delivery-zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', pin }),
      });
    } catch (err) {
      console.error('Failed to delete zone:', err);
      loadZones();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-rose">
            Logistics & Local Coverage
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            Vadodara Delivery Zones & PIN Codes
          </h1>
          <p className="text-xs text-ink-muted">
            Manage active postal codes for local fulfillment across Vadodara. Saved changes immediately update the storefront checkout PIN validator.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <Truck className="w-4 h-4 text-emerald-600" />
          <span>{zones.filter((z) => z.active).length} Active Vadodara PIN Codes</span>
        </div>
      </div>

      {/* Add Zone Form */}
      <div className="bg-surface p-6 rounded-2xl border border-border-subtle shadow-craft">
        <h3 className="font-serif text-base font-bold text-ink mb-4">Add or Update PIN Code</h3>
        <form onSubmit={handleAddZone} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-ink uppercase tracking-wider">6-Digit PIN Code *</label>
            <input
              type="text"
              required
              maxLength={6}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 390014"
              className="w-full px-3 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary font-mono"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-semibold text-ink uppercase tracking-wider">Area Name / Locality *</label>
            <input
              type="text"
              required
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
              placeholder="e.g. New VIP Road / Karelibaug"
              className="w-full px-3 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <Button type="submit" variant="primary" size="sm" isLoading={submitting} className="w-full shadow-craft">
              <Plus className="w-4 h-4 mr-1" />
              <span>Save PIN Code</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Zones Table */}
      <div className="bg-surface rounded-2xl border border-border-subtle shadow-craft overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-ink-muted flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-rose" />
            <span>Loading delivery coverage zones...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border-subtle bg-canvas/40 text-ink-muted uppercase tracking-wider font-semibold text-[10px]">
                  <th className="py-3 px-4">PIN Code</th>
                  <th className="py-3 px-4">Vadodara Locality</th>
                  <th className="py-3 px-4">Local Delivery Fee</th>
                  <th className="py-3 px-4">Service Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/50 text-ink">
                {zones.map((zone) => (
                  <tr key={zone.pin} className="hover:bg-canvas/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-primary">{zone.pin}</td>
                    <td className="py-3 px-4 font-medium text-ink">{zone.area}</td>
                    <td className="py-3 px-4 font-bold">{formatINR(zone.fee)}</td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(zone.pin)}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                          zone.active
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                        }`}
                        title="Click to toggle coverage"
                      >
                        {zone.active ? 'Active ✓' : 'Disabled'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(zone.pin)}
                          className="text-xs text-ink-muted hover:text-primary font-semibold underline"
                        >
                          {zone.active ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteZone(zone.pin)}
                          className="text-ink-muted hover:text-red-600 p-1 rounded"
                          title="Delete zone"
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
    </div>
  );
}
