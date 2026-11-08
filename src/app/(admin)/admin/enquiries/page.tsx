'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, MessageCircle, Clock, Heart, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDateIST } from '@/lib/formatters';
import { CustomEnquiry } from '@/lib/enquiries-store';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<CustomEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [feedback, setFeedback] = useState('');

  const loadEnquiries = async () => {
    try {
      const res = await fetch('/api/admin/enquiries');
      const data = await res.json();
      if (data.success && data.data) {
        setEnquiries(data.data);
      }
    } catch (e) {
      console.error('Failed to load enquiries', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleStatusChange = async (
    enquiryId: string,
    newStatus: CustomEnquiry['status'],
    notes?: string
  ) => {
    setFeedback('');
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, adminNotes: notes }),
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === enquiryId ? data.data : e))
        );
        setFeedback(`Enquiry updated to ${newStatus}`);
        setTimeout(() => setFeedback(''), 3000);
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    if (statusFilter === 'all') return true;
    return e.status === statusFilter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-secondary">
            Bespoke Requests
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            Custom Commissions & Enquiries
          </h1>
          <p className="text-xs text-ink-muted">
            Incoming bespoke gifting leads, wedding favors, and personalized flower inquiries.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {['all', 'NEW', 'CONTACTED', 'QUOTED', 'ACCEPTED', 'CLOSED'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === f
                  ? 'bg-primary text-white'
                  : 'bg-surface text-ink-muted hover:text-ink border border-border-subtle'
              }`}
            >
              {f === 'all' ? 'All Enquiries' : f}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Enquiries Stream */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-xs text-ink-muted">Loading enquiries...</div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="text-center py-12 text-xs text-ink-muted bg-surface rounded-xl border border-border-subtle">
            No inquiries under this status filter.
          </div>
        ) : (
          filteredEnquiries.map((enquiry) => (
            <div
              key={enquiry.id}
              className="bg-surface rounded-2xl border border-border-subtle p-6 shadow-craft space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border-subtle/80 pb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-serif text-base font-bold text-ink">{enquiry.customerName}</h3>
                  <span className="font-mono text-xs text-ink-muted">({enquiry.customerPhone})</span>
                  <span className="text-[11px] text-ink-muted">• {formatDateIST(enquiry.createdAt)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-ink-muted">Pipeline:</span>
                  <select
                    value={enquiry.status}
                    onChange={(e) =>
                      handleStatusChange(enquiry.id, e.target.value as CustomEnquiry['status'])
                    }
                    className="px-2.5 py-1 rounded-lg bg-canvas border border-border-subtle text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="NEW">NEW (Unopened)</option>
                    <option value="CONTACTED">CONTACTED (Chatted on WhatsApp)</option>
                    <option value="QUOTED">QUOTED (Pricing Shared)</option>
                    <option value="ACCEPTED">ACCEPTED (Advance Received)</option>
                    <option value="DECLINED">DECLINED</option>
                    <option value="CLOSED">CLOSED (Completed)</option>
                  </select>
                </div>
              </div>

              {/* Body Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                {/* Request details */}
                <div className="md:col-span-2 space-y-2">
                  <p className="font-semibold text-secondary uppercase tracking-wider">
                    Idea & Description
                  </p>
                  <p className="text-ink text-sm bg-canvas p-3.5 rounded-xl border border-border-subtle/80 leading-relaxed">
                    &ldquo;{enquiry.message}&rdquo;
                  </p>

                  <div className="flex flex-wrap gap-4 pt-1 text-[11px] text-ink-muted">
                    {enquiry.occasion && (
                      <span>
                        Occasion: <strong className="text-ink">{enquiry.occasion}</strong>
                      </span>
                    )}
                    {enquiry.neededByDate && (
                      <span>
                        Needed by: <strong className="text-primary">{enquiry.neededByDate}</strong>
                      </span>
                    )}
                    {enquiry.budgetEstimate && (
                      <span>
                        Budget: <strong className="text-sage">{enquiry.budgetEstimate}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* WhatsApp Action & Internal Notes */}
                <div className="space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <label className="font-semibold text-secondary uppercase tracking-wider block">
                      Artisan Internal Notes
                    </label>
                    <textarea
                      rows={2}
                      defaultValue={enquiry.adminNotes || ''}
                      onBlur={(e) =>
                        handleStatusChange(enquiry.id, enquiry.status, e.target.value)
                      }
                      placeholder="e.g. Sent lilac yarn photos on WhatsApp..."
                      className="w-full p-2 rounded-lg bg-canvas border border-border-subtle text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <Link
                      href={`https://wa.me/91${enquiry.customerPhone}?text=${encodeURIComponent(
                        `Hi ${enquiry.customerName}! 🌸 This is The Handmade Craft regarding your custom gift request. We'd love to help you bring this to life!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="whatsapp" size="sm" className="w-full">
                        <MessageCircle className="w-4 h-4 fill-current mr-1.5" />
                        <span>Chat & Quote on WhatsApp</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

