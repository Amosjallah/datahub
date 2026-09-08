'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Loader2, CheckCircle2, AlertTriangle, Wallet } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface TVProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
  plans: { name: string; price: number }[];
}

export default function BuyTv() {
  const [provider, setProvider] = useState<TVProvider | null>(null);
  const [iuc, setIuc] = useState('');
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // User & Wallet state
  const [userId, setUserId] = useState<string | null>(null);
  const [walletId, setWalletId] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [userName, setUserName] = useState<string>('User');
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      setAuthLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
          setUserName(fullName);

          const { data: wallet } = await supabase
            .from('wallets')
            .select('id, cached_balance')
            .eq('user_id', user.id)
            .maybeSingle();

          if (wallet) {
            setWalletId(wallet.id);
            setWalletBalance(Number(wallet.cached_balance));
          }
        }
      } catch (err) {
        console.warn('[BuyTv] User load warning:', err);
      } finally {
        setAuthLoading(false);
      }
    }
    loadUserData();
  }, []);

  const tvProviders: TVProvider[] = [
    { 
      id: 'dstv', 
      name: 'DStv', 
      icon: '📺', 
      color: 'rgba(59,130,246,0.12)', 
      plans: [
        { name: 'Compact Plus', price: 120.00 },
        { name: 'Compact', price: 79.00 },
        { name: 'Access', price: 38.00 },
      ]
    },
    { 
      id: 'gotv', 
      name: 'GOtv', 
      icon: '📡', 
      color: 'rgba(16,185,129,0.12)', 
      plans: [
        { name: 'Supa Plus', price: 55.00 },
        { name: 'Supa', price: 38.00 },
        { name: 'Max', price: 29.00 },
        { name: 'Jolli', price: 22.00 },
        { name: 'Jinja', price: 10.00 },
      ]
    },
    { 
      id: 'startimes', 
      name: 'StarTimes', 
      icon: '🎬', 
      color: 'rgba(245,158,11,0.12)', 
      plans: [
        { name: 'Classic', price: 50.00 },
        { name: 'Smart', price: 35.00 },
        { name: 'Basic', price: 25.00 },
        { name: 'Nova', price: 12.00 },
      ]
    },
  ];

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!iuc) return alert('Please enter smart card / IUC number.');
    if (!provider) return;

    const currentPlan = provider.plans[selectedPlanIndex];
    if (!currentPlan) return;

    if (walletBalance !== null && walletBalance < currentPlan.price) {
      setMessage({
        type: 'error',
        text: `Insufficient wallet balance (₵${walletBalance.toFixed(2)}). Package requires ₵${currentPlan.price.toFixed(2)}. Please fund your wallet.`,
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          walletId,
          provider: `${provider.name} TV`,
          account: iuc,
          amount: currentPlan.price,
          billType: currentPlan.name,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        setMessage({
          type: 'success',
          text: data.message || `${provider.name} (${currentPlan.name}) subscription renewed successfully for IUC: ${iuc}!`,
        });
        if (walletBalance !== null) {
          setWalletBalance(prev => (prev !== null ? Math.max(0, prev - currentPlan.price) : 0));
        }
        setIuc('');
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Subscription payment failed. Please try again.',
        });
      }
    } catch (err: any) {
      setLoading(false);
      setMessage({
        type: 'error',
        text: err.message || 'Connection failure. Please try again.',
      });
    }
  };

  return (
    <AppLayout userName={userName} userRole="customer">
      <div className="animate-fade-up">
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.2rem' }}>📺 TV Subscriptions</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Renew DStv, GOtv, and StarTimes instantly.</p>
        </div>

        {message && (
          <div
            className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}
            style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', maxWidth: '480px' }}
          >
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Provider selector cards */}
        {!provider && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.875rem', marginBottom: '1.5rem' }}>
            {tvProviders.map((tv) => (
              <button
                key={tv.id}
                type="button"
                onClick={() => { setProvider(tv); setSelectedPlanIndex(0); setMessage(null); }}
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
                    value={selectedPlanIndex}
                    onChange={(e) => setSelectedPlanIndex(Number(e.target.value))}
                  >
                    {provider.plans.map((p, idx) => (
                      <option key={idx} value={idx}>{p.name} — ₵{p.price.toFixed(2)}</option>
                    ))}
                  </select>
                </div>

                <div className="divider" style={{ margin: '1.25rem 0' }}></div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.25rem',
                  padding: '0.75rem 1rem',
                  background: 'var(--color-bg-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Wallet size={16} color="var(--color-brand-primary)" />
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Wallet Balance:</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <strong style={{ color: 'var(--color-brand-primary)', fontSize: '1rem', fontFamily: 'Space Grotesk' }}>
                      {authLoading ? '...' : walletBalance !== null ? `₵${walletBalance.toFixed(2)}` : '₵0.00'}
                    </strong>
                    <Link
                      href="/wallet/fund"
                      style={{ fontSize: '0.75rem', color: 'var(--color-brand-primary)', textDecoration: 'underline' }}
                    >
                      + Top Up
                    </Link>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                    {loading ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                        <Loader2 className="animate-spin" size={16} />
                        Processing...
                      </span>
                    ) : (
                      `📺 Subscribe Now (₵${provider.plans[selectedPlanIndex]?.price.toFixed(2)})`
                    )}
                  </button>
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
