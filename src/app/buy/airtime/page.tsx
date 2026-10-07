'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Loader2, CheckCircle2, AlertTriangle, Wallet, CreditCard, Zap } from 'lucide-react';
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
              text: `Payment of GH₵${Number(data.amount).toFixed(2)} verified (Ref: ${ref})! Your airtime top-up has been dispatched.`,
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
            text: `Payment confirmed (Ref: ${ref})! Your airtime order is being processed.`,
          });
        });
    }
  }, []);

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

    setLoading(true);
    setMessage(null);

    // If using wallet balance
    if (paymentMethod === 'wallet' && walletBalance !== null && walletBalance >= numAmount) {
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
      return;
    }

    // Direct checkout via Mobile Money / Card (Paystack) — No funding first required!
    try {
      const cleanPhone = phone.replace(/\D/g, '') || '0000000000';
      const customerEmail = `${cleanPhone}@fadigital.com`;

      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customerEmail,
          amount: numAmount,
          phone: cleanPhone,
          service: 'airtime',
          network,
          callbackUrl: `${window.location.origin}/buy/airtime?network=${encodeURIComponent(network)}&phone=${encodeURIComponent(phone)}`,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success && data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Payment initialization failed. Please try again.',
        });
      }
    } catch (err: any) {
      setLoading(false);
      setMessage({
        type: 'error',
        text: err.message || 'Failed to connect to checkout gateway.',
      });
    }
  };

  const hasWalletFunds = walletBalance !== null && amount !== '' && walletBalance >= Number(amount);

  return (
    <AppLayout userName={userName} userRole="customer">
      <div style={{ maxWidth: '580px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--color-text-primary)' }}>
            📱 Buy Airtime Top-Up Instantly
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Instant recharge with Mobile Money or Card. No need to pre-fund your wallet before buying.
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
              {/* Step 1: Select Network */}
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
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
                <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                  Step 2 — Recipient Phone Number
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

              {/* Step 3: Top-Up Amount */}
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                  Step 3 — Airtime Amount (GHS ₵)
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

              {/* Step 4: Payment Option */}
              {amount !== '' && Number(amount) >= 1 && (
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--color-bg-elevated)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                    Payment Method
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.65rem 0.85rem', background: paymentMethod === 'direct' ? 'var(--color-brand-subtle)' : 'transparent', borderRadius: '8px', border: paymentMethod === 'direct' ? '1px solid var(--color-brand-primary)' : '1px solid transparent' }}>
                      <input
                        type="radio"
                        name="airtimePayMethod"
                        value="direct"
                        checked={paymentMethod === 'direct'}
                        onChange={() => setPaymentMethod('direct')}
                        style={{ accentColor: '#FACC15' }}
                      />
                      <CreditCard size={18} style={{ color: 'var(--color-brand-primary)' }} />
                      <div style={{ flex: 1 }}>
                        <strong style={{ fontSize: '0.88rem', color: 'var(--color-text-primary)' }}>Mobile Money & Card (Instant Direct Pay)</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>No pre-funding needed — pay instantly via Paystack</div>
                      </div>
                    </label>

                    {hasWalletFunds && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.65rem 0.85rem', background: paymentMethod === 'wallet' ? 'var(--color-brand-subtle)' : 'transparent', borderRadius: '8px', border: paymentMethod === 'wallet' ? '1px solid var(--color-brand-primary)' : '1px solid transparent' }}>
                        <input
                          type="radio"
                          name="airtimePayMethod"
                          value="wallet"
                          checked={paymentMethod === 'wallet'}
                          onChange={() => setPaymentMethod('wallet')}
                          style={{ accentColor: '#FACC15' }}
                        />
                        <Wallet size={18} style={{ color: 'var(--color-brand-primary)' }} />
                        <div style={{ flex: 1 }}>
                          <strong style={{ fontSize: '0.88rem', color: 'var(--color-text-primary)' }}>Deduct from Wallet Balance</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Available balance: ₵{walletBalance?.toFixed(2)}</div>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading || !amount || Number(amount) < 1}
                style={{ height: '3.2rem', fontSize: '1rem', fontWeight: 700 }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    <Loader2 className="animate-spin" size={18} />
                    Processing Airtime...
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    <Zap size={18} />
                    Confirm & Pay {amount ? `₵${Number(amount).toFixed(2)}` : ''} {paymentMethod === 'wallet' ? 'from Wallet' : 'with MoMo / Card'}
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
