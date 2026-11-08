'use client';

import React, { useState } from 'react';
import { MapPin, Plus, Check, Trash2, Truck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatINR } from '@/lib/formatters';

const INITIAL_ZONES = [
  { pin: '390001', area: 'Alkapuri / Central Vadodara', fee: 50, active: true },
  { pin: '390002', area: 'Mandvi / Old City', fee: 50, active: true },
  { pin: '390004', area: 'Fatehgunj / MS University Area', fee: 50, active: true },
  { pin: '390007', area: 'Race Course / Inox Area', fee: 50, active: true },
  { pin: '390008', area: 'Waghodia Road', fee: 50, active: true },
  { pin: '390010', area: 'Karelibaug', fee: 50, active: true },
  { pin: '390011', area: 'Sayajigunj / Station Area', fee: 50, active: true },
  { pin: '390012', area: 'Gorwa / BIDC', fee: 50, active: true },
  { pin: '390015', area: 'Sama / New Sama Road', fee: 50, active: true },
  { pin: '390018', area: 'Gotri', fee: 50, active: true },
  { pin: '390019', area: 'Harni / Airport Area', fee: 50, active: true },
  { pin: '390020', area: 'Manjalpur / Makarpura', fee: 50, active: true },
  { pin: '390021', area: 'Gotri Road / Sevasi', fee: 50, active: true },
  { pin: '390022', area: 'Vasna / Bhayli Road', fee: 50, active: true },
  { pin: '390023', area: 'Subhanpura', fee: 50, active: true },
  { pin: '390024', area: 'Akota', fee: 50, active: true },
  { pin: '390025', area: 'Tarsali', fee: 50, active: true },
];

export default function AdminDeliveryZonesPage() {
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [newPin, setNewPin] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newFee, setNewFee] = useState('50');

  const handleToggleActive = (pin: string) => {
    setZones(
      zones.map((z) => (z.pin === pin ? { ...z, active: !z.active } : z))
    );
  };

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin || !newArea) return;
    setZones([...zones, { pin: newPin, area: newArea, fee: Number(newFee), active: true }]);
    setNewPin('');
    setNewArea('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-secondary">
            Logistics & Coverage
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            Vadodara Delivery Zones & PIN Codes
          </h1>
          <p className="text-xs text-ink-muted">
            Managing local delivery coverage across Vadodara. All major postal codes are active by default.
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
            <label className="text-[11px] font-semibold text-ink uppercase">6-Digit PIN Code</label>
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
            <label className="text-[11px] font-semibold text-ink uppercase">Area Name / Locality</label>
            <input
              type="text"
              required
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
              placeholder="e.g. New VIP Road"
              className="w-full px-3 py-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <Button type="submit" variant="primary" size="sm" className="w-full">
              <Plus className="w-4 h-4 mr-1" />
              <span>Add Zone</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Zones Table */}
      <div className="bg-surface rounded-2xl border border-border-subtle shadow-craft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border-subtle bg-canvas/40 text-ink-muted uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">PIN Code</th>
                <th className="py-3 px-4">Vadodara Locality</th>
                <th className="py-3 px-4">Delivery Fee</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50 text-ink">
              {zones.map((zone) => (
                <tr key={zone.pin} className="hover:bg-canvas/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-primary">{zone.pin}</td>
                  <td className="py-3 px-4 font-medium text-ink">{zone.area}</td>
                  <td className="py-3 px-4 font-bold">{formatINR(zone.fee)}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        zone.active
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                      }`}
                    >
                      {zone.active ? 'Serviceable' : 'Disabled'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(zone.pin)}
                      className="text-xs text-ink-muted hover:text-primary font-semibold underline"
                    >
                      {zone.active ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

