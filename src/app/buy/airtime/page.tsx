'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Loader2, CheckCircle2, AlertTriangle, Wallet } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function BuyAirtime() {
  const [network, setNetwork] = useState<'MTN' | 'Telecel' | 'AirtelTigo' | ''>('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // User & Wallet state
  const [userId, setUserId] = useState<string | null>(null);
  const [walletId, setWalletId] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [userName, setUserName] = useState<string>('User');
  const [authLoading, setAuthLoading] = useState(true);

  // Load user data and pre-fill query params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const qPhone = params.get('phone');
      const qNet = params.get('network');
      if (qPhone) setPhone(qPhone);
      if (qNet === 'MTN' || qNet === 'Telecel' || qNet === 'AirtelTigo') {
        setNetwork(qNet);
      }
    }

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
        console.warn('[BuyAirtime] User load warning:', err);
      } finally {
        setAuthLoading(false);
      }
    }
    loadUserData();
  }, []);

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!network) return alert('Please select a network.');
    if (!phone) return alert('Please enter phone number.');
    const numAmount = Number(amount);
    if (!numAmount || numAmount < 1) return alert('Please enter a valid amount (minimum ₵1).');

    if (walletBalance !== null && walletBalance < numAmount) {
      setMessage({
        type: 'error',
        text: `Insufficient wallet balance (₵${walletBalance.toFixed(2)}). You need ₵${numAmount.toFixed(2)}. Please fund your wallet.`,
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/airtime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          walletId,
          amount: numAmount,
          recipient: phone,
          network,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        setMessage({
          type: 'success',
          text: data.message || `₵${numAmount.toFixed(2)} ${network} airtime sent successfully!`,
        });
        if (walletBalance !== null) {
          setWalletBalance(prev => (prev !== null ? Math.max(0, prev - numAmount) : 0));
        }
        setAmount('');
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Airtime recharge failed. Please try again.',
        });
      }
    } catch (err: any) {
      setLoading(false);
      setMessage({
        type: 'error',
        text: err.message || 'Connection failure. Please check your network and try again.',
      });
    }
  };

  return (
    <AppLayout userName={userName} userRole="customer">
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            📱 Buy Airtime Top-Up
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Select network, enter the recipient phone number, and specify the top-up amount.
          </p>
        </div>

        {message && (
          <div
            className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}
            style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="card animate-fade-up">
          <div className="card-body">
            <form onSubmit={handlePurchase}>
              {/* Step 1: Network Selection */}
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                  Step 1 — Select Network
                </p>
                <div className="network-grid">
                  <button
                    type="button"
                    onClick={() => setNetwork('MTN')}
                    className={`network-btn ${network === 'MTN' ? 'active' : ''}`}
                  >
                    <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>🟡</span>
                    <span>MTN</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNetwork('Telecel')}
                    className={`network-btn ${network === 'Telecel' ? 'active' : ''}`}
                  >
                    <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>🔴</span>
                    <span>Telecel</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNetwork('AirtelTigo')}
                    className={`network-btn ${network === 'AirtelTigo' ? 'active' : ''}`}
                  >
                    <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>🔵</span>
                    <span>AirtelTigo</span>
                  </button>
                </div>
              </div>

              {/* Step 2: Recipient Number */}
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                  Step 2 — Recipient Number
                </p>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="e.g. 0244 123 456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ fontSize: '1.1rem', letterSpacing: '0.05em' }}
                  required
                />
              </div>

              {/* Step 3: Top-up Amount */}
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                  Step 3 — Amount (₵)
                </p>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter airtime amount (min ₵1)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  min="1"
                  step="0.01"
                  required
                />
              </div>

              <div className="divider" style={{ margin: '1.25rem 0' }}></div>

              {/* Wallet info */}
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
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Your Wallet Balance:</span>
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

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading || !amount || (walletBalance !== null && walletBalance < Number(amount))}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    <Loader2 className="animate-spin" size={16} />
                    Processing Airtime...
                  </span>
                ) : (
                  `⚡ Confirm & Pay ${amount ? `₵${Number(amount).toFixed(2)}` : ''}`
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
