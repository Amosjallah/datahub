'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';

interface TVProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
  plans: string[];
}

export default function BuyTv() {
  const [provider, setProvider] = useState<TVProvider | null>(null);
  const [iuc, setIuc] = useState('');
  const [plan, setPlan] = useState('');

  const tvProviders: TVProvider[] = [
    { id: 'dstv', name: 'DStv', icon: '📺', color: 'rgba(59,130,246,0.12)', plans: ['Compact Plus - ₵120', 'Compact - ₵79', 'Access - ₵38'] },
    { id: 'gotv', name: 'GOtv', icon: '📡', color: 'rgba(16,185,129,0.12)', plans: ['Supa Plus - ₵55', 'Supa - ₵38', 'Max - ₵29', 'Jolli - ₵22', 'Jinja - ₵10'] },
    { id: 'startimes', name: 'StarTimes', icon: '🎬', color: 'rgba(245,158,11,0.12)', plans: ['Nova - ₵12', 'Basic - ₵25', 'Smart - ₵35', 'Classic - ₵50'] },
  ];

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!iuc) return alert('Please enter smart card / IUC number.');
    alert(`TV Subscription processed.\nProvider: ${provider?.name}\nIUC: ${iuc}\nPlan: ${plan}`);
  };

  return (
    <AppLayout userName="Kwame Mensah" userRole="customer">
      <div className="animate-fade-up">
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.2rem' }}>📺 TV Subscriptions</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Renew DStv, GOtv, and StarTimes instantly.</p>
        </div>

        {/* Provider selector cards */}
        {!provider && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.875rem', marginBottom: '1.5rem' }}>
            {tvProviders.map((tv) => (
              <button
                key={tv.id}
                type="button"
                onClick={() => { setProvider(tv); setPlan(tv.plans[0]); }}
                style={{
                  padding: '1.5rem 1rem',
                  textAlign: 'center',
                  border: '2px solid var(--color-border)',
                  background: 'var(--color-bg-elevated)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: tv.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem' }}>
                  {tv.icon}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>{tv.name}</div>
              </button>
            ))}
          </div>
        )}

        {/* Dynamic Form */}
        {provider && (
          <div className="card animate-fade-up" style={{ maxWidth: '480px' }}>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '1.5rem' }}>{provider.icon}</div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{provider.name} Subscription</h3>
              </div>

              <form onSubmit={handlePay}>
                <div className="form-group">
                  <label className="form-label" htmlFor="tv-iuc">Smart Card / IUC Number</label>
                  <input
                    type="text"
                    id="tv-iuc"
                    className="form-input"
                    placeholder="Enter smart card number"
                    value={iuc}
                    onChange={(e) => setIuc(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="tv-plan">Select Package</label>
                  <select
                    id="tv-plan"
                    className="form-select"
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                  >
                    {provider.plans.map((p, idx) => (
                      <option key={idx} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="divider"></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Wallet Balance</span>
                  <strong style={{ color: 'var(--color-brand-primary)' }}>₵245.50</strong>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>📺 Subscribe Now</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setProvider(null)}>Change</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
