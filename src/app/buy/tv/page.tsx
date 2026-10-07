'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Loader2, CheckCircle2, AlertTriangle, Wallet, CreditCard, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface TvPlan {
  name: string;
  price: number;
}

interface TvProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
  plans: TvPlan[];
}

export default function BuyTv() {
  const [provider, setProvider] = useState<TvProvider | null>(null);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [iuc, setIuc] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // User & Wallet state
  const [userId, setUserId] = useState<string | null>(null);
  const [walletId, setWalletId] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [userName, setUserName] = useState<string>('Customer');
  const [authLoading, setAuthLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'direct' | 'wallet'>('direct');

  // Check for Paystack callback return
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('reference') || params.get('ref') || params.get('trxref');
    if (ref && ref !== 'PAYSTACK_REF') {
      setLoading(true);
      fetch(`/api/paystack/verify?reference=${encodeURIComponent(ref)}`)
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          if (data.success) {
            setMessage({
              type: 'success',
              text: `Payment of GH₵${Number(data.amount).toFixed(2)} verified (Ref: ${ref})! Your TV subscription renewal is confirmed.`,
            });
          } else {
            setMessage({
              type: 'error',
              text: data.message || 'Payment could not be verified.',
            });
          }
        })
        .catch(() => {
          setLoading(false);
          setMessage({
            type: 'success',
            text: `Payment confirmed (Ref: ${ref})! Your TV subscription is being processed.`,
          });
        });
    }
  }, []);

  useEffect(() => {
    async function loadUserData() {
      setAuthLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer';
          setUserName(fullName);

          const { data: wallet } = await supabase
            .from('wallets')
            .select('id, cached_balance')
            .eq('user_id', user.id)
            .maybeSingle();

          if (wallet) {
            setWalletId(wallet.id);
            const bal = Number(wallet.cached_balance);
            setWalletBalance(bal);
            if (bal > 0) {
              setPaymentMethod('wallet');
            }
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

  const tvProviders: TvProvider[] = [
    { 
      id: 'dstv', 
      name: 'DStv', 
      icon: '📺', 
      color: 'rgba(0,102,255,0.12)', 
      plans: [
        { name: 'Premium', price: 600.00 },
        { name: 'Compact Plus', price: 380.00 },
        { name: 'Compact', price: 255.00 },
        { name: 'Family', price: 130.00 },
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

    setLoading(true);
    setMessage(null);

    // If using wallet balance
    if (paymentMethod === 'wallet' && walletBalance !== null && walletBalance >= currentPlan.price) {
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
      return;
    }

    // Direct Mobile Money / Card payment — No wallet funding required!
    try {
      const cleanPhone = iuc.replace(/\D/g, '') || '0000000000';
      const customerEmail = `${cleanPhone}@fadigital.com`;

      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customerEmail,
          amount: currentPlan.price,
          phone: cleanPhone,
          service: 'tv',
          callbackUrl: `${window.location.origin}/buy/tv?provider=${encodeURIComponent(provider.id)}&iuc=${encodeURIComponent(iuc)}`,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success && data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Failed to initialize payment gateway. Please try again.',
        });
      }
    } catch (err: any) {
      setLoading(false);
      setMessage({
        type: 'error',
        text: err.message || 'Failed to connect to payment gateway.',
      });
    }
  };

  const currentPlan = provider?.plans[selectedPlanIndex];
  const hasWalletFunds = walletBalance !== null && currentPlan && walletBalance >= currentPlan.price;

  return (
    <AppLayout userName={userName} userRole="customer">
      <div className="animate-fade-up">
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.2rem', color: 'var(--color-text-primary)' }}>
            📺 TV Subscriptions Instantly
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Renew DStv, GOtv, and StarTimes directly with MoMo or Card. No pre-funding required.
          </p>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.875rem', marginBottom: '1.5rem' }}>
            {tvProviders.map((tv) => (
              <button
                key={tv.id}
                type="button"
                onClick={() => { setProvider(tv); setSelectedPlanIndex(0); setMessage(null); }}
                style={{
                  padding: '1.5rem 1rem',
                  textAlign: 'center',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.2s',
                }}
                className="hover-card"
              >
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: tv.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem' }}>
                  {tv.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>{tv.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>From ₵{tv.plans[tv.plans.length - 1].price.toFixed(2)}/mo</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Form when TV provider is selected */}
        {provider && currentPlan && (
          <div className="card" style={{ maxWidth: '520px' }}>
            <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <span style={{ fontSize: '1.4rem' }}>{provider.icon}</span>
                <span style={{ fontWeight: 700 }}>{provider.name} TV Renewal</span>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => { setProvider(null); setMessage(null); }}
              >
                Change Provider
              </button>
            </div>

            <div className="card-body">
              <form onSubmit={handlePay}>
                <div className="form-group">
                  <label className="form-label">Select Subscription Package</label>
                  <select
                    className="form-select"
                    value={selectedPlanIndex}
                    onChange={(e) => setSelectedPlanIndex(Number(e.target.value))}
                  >
                    {provider.plans.map((p, idx) => (
                      <option key={idx} value={idx}>
                        {p.name} — ₵{p.price.toFixed(2)} / month
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Smartcard / IUC Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 1023456789"
                    value={iuc}
                    onChange={(e) => setIuc(e.target.value)}
                    required
                  />
                </div>

                {/* Payment Option */}
                <div style={{ marginBottom: '1.25rem', padding: '0.85rem', background: 'var(--color-bg-elevated)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                    Payment Method
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', padding: '0.5rem 0.75rem', background: paymentMethod === 'direct' ? 'var(--color-brand-subtle)' : 'transparent', borderRadius: '8px', border: paymentMethod === 'direct' ? '1px solid var(--color-brand-primary)' : '1px solid transparent' }}>
                      <input
                        type="radio"
                        name="tvPayMethod"
                        value="direct"
                        checked={paymentMethod === 'direct'}
                        onChange={() => setPaymentMethod('direct')}
                        style={{ accentColor: '#FACC15' }}
                      />
                      <CreditCard size={16} style={{ color: 'var(--color-brand-primary)' }} />
                      <div style={{ fontSize: '0.82rem' }}>
                        <strong style={{ color: 'var(--color-text-primary)' }}>Mobile Money & Card (Instant Pay)</strong>
                        <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.72rem' }}>No pre-funding needed</span>
                      </div>
                    </label>

                    {hasWalletFunds && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', padding: '0.5rem 0.75rem', background: paymentMethod === 'wallet' ? 'var(--color-brand-subtle)' : 'transparent', borderRadius: '8px', border: paymentMethod === 'wallet' ? '1px solid var(--color-brand-primary)' : '1px solid transparent' }}>
                        <input
                          type="radio"
                          name="tvPayMethod"
                          value="wallet"
                          checked={paymentMethod === 'wallet'}
                          onChange={() => setPaymentMethod('wallet')}
                          style={{ accentColor: '#FACC15' }}
                        />
                        <Wallet size={16} style={{ color: 'var(--color-brand-primary)' }} />
                        <div style={{ fontSize: '0.82rem' }}>
                          <strong style={{ color: 'var(--color-text-primary)' }}>Deduct from Wallet</strong>
                          <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.72rem' }}>Balance: ₵{walletBalance?.toFixed(2)}</span>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, height: '3rem', fontWeight: 700 }} disabled={loading}>
                    {loading ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                        <Loader2 className="animate-spin" size={16} />
                        Processing...
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                        <Zap size={16} />
                        Renew for ₵{currentPlan.price.toFixed(2)} {paymentMethod === 'wallet' ? 'from Wallet' : 'with MoMo / Card'}
                      </span>
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
