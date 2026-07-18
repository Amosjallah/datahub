'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import ProviderIcon from '@/components/ProviderIcon';
import { Award, ArrowUpRight } from 'lucide-react';

export default function AgentCommissions() {
  const stats = [
    { label: 'Unpaid Commission Balance', val: 'GH₵15,480.00' },
    { label: 'Accumulated Earnings', val: 'GH₵124,568.00' },
    { label: 'Sub-agent Referral Royalties', val: 'GH₵8,920.00' },
  ];

  const commissions = [
    { date: 'May 20, 2024', orderId: '1234567890', customer: '0803 123 4567', service: 'MTN 10GB', type: 'Reseller Discount', commission: 'GH₵450.00' },
    { date: 'May 20, 2024', orderId: '1234567889', customer: '0701 234 5678', service: 'Airtime GH₵1,000', type: 'Reseller Discount', commission: 'GH₵50.00' },
    { date: 'May 19, 2024', orderId: '1234567888', customer: '0806 345 6789', service: 'Glo 5GB', type: 'Reseller Discount', commission: 'GH₵300.00' },
    { date: 'May 19, 2024', orderId: '1234567887', customer: '0908 765 4321', service: 'Dstv Compact', type: 'Reseller Discount', commission: 'GH₵700.00' },
    { date: 'May 18, 2024', orderId: '1234567886', customer: 'John Okafor (Sub)', service: 'MTN 5GB', type: 'Referral Royalty (5%)', commission: 'GH₵25.00' },
  ];

  return (
    <AppLayout userName="Kwame Mensah" userRole="agent">
      <div className="animate-fade-up">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>🏅 Reseller Commissions</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>View commission logs, referral bonuses, and trigger direct wallet payouts.</p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          {stats.map((s, idx) => (
            <div key={idx} className="card" style={{ padding: '1.25rem', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {s.label}
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: idx === 0 ? 'var(--color-brand-primary)' : 'var(--color-text-primary)', margin: '0.5rem 0', fontFamily: 'monospace' }}>
                {s.val}
              </div>
            </div>
          ))}
        </div>

        {/* Commissions Table */}
        <div className="card" style={{ border: '1px solid var(--color-border)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg-surface)' }}>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Date</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Order ID</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Source Customer</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Service</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Earnings Type</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 700, textAlign: 'right' }}>Commission</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((c, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{c.date}</td>
                  <td style={{ padding: '1rem 0.5rem', fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>{c.orderId}</td>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{c.customer}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ProviderIcon provider={c.service} size={16} />
                      <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>{c.service}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span className="badge" style={{ backgroundColor: c.type.includes('Referral') ? 'rgba(139,92,246,0.1)' : 'rgba(16,185,129,0.1)', color: c.type.includes('Referral') ? '#8B5CF6' : '#10B981', fontWeight: 600 }}>
                      {c.type}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right', fontWeight: 700, color: '#10B981', fontFamily: 'monospace' }}>{c.commission}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
