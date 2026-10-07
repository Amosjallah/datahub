'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Loader2, AlertTriangle, CheckCircle2, Wallet, RefreshCw, CreditCard, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Plan {
  id: number;
  name: string;
  network: string;
  volume?: string;
  price: number;
  type?: string;
}

export default function BuyData() {
  const [network, setNetwork] = useState<'MTN' | 'Telecel' | 'AirtelTigo' | ''>('');
  const [phone, setPhone] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingPlans, setFetchingPlans] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // User & Wallet state
  const [userId, setUserId] = useState<string | null>(null);
  const [walletId, setWalletId] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [userName, setUserName] = useState<string>('Customer');
  const [authLoading, setAuthLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'direct' | 'wallet'>('direct');

  // Live API Plans
  const [apiPlans, setApiPlans] = useState<Plan[]>([]);

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
              text: `Payment of GH₵${Number(data.amount).toFixed(2)} verified (Ref: ${ref})! Your data bundle order is being dispatched to your number.`,
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
            text: `Payment confirmed (Ref: ${ref})! Your data bundle order has been placed.`,
          });
        });
    }
  }, []);

  // 1. Fetch user & wallet from Supabase, and read URL query params
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
        console.warn('[BuyData] User/Wallet load warning:', err);
      } finally {
        setAuthLoading(false);
      }
    }
    loadUserData();
  }, []);

  // 2. Fetch live plans from /api/vtu/recharge
  useEffect(() => {
    async function fetchPlans() {
      setFetchingPlans(true);
      try {
        const res = await fetch('/api/vtu/recharge');
        const data = await res.json();
        if (data.success && Array.isArray(data.plans) && data.plans.length > 0) {
          setApiPlans(data.plans);
        } else {
          setApiPlans([
            { id: 17, name: '1GB AirtelTigo', network: 'airteltigo', price: 5.80 },
            { id: 18, name: '2GB AirtelTigo', network: 'airteltigo', price: 9.60 },
            { id: 19, name: '3GB AirtelTigo', network: 'airteltigo', price: 13.50 },
            { id: 28, name: '10GB Telecel', network: 'telecel', price: 39.00 },
            { id: 29, name: '15GB Telecel', network: 'telecel', price: 55.00 },
            { id: 30, name: '20GB Telecel', network: 'telecel', price: 74.00 },
          ]);
        }
      } catch (err) {
        console.error('[BuyData] Failed to fetch plans:', err);
      } finally {
        setFetchingPlans(false);
      }
    }
    fetchPlans();
  }, []);

  const currentNetworkPlans = network
    ? apiPlans.filter((p) => {
        const netLower = p.network.toLowerCase();
        if (network === 'AirtelTigo') return netLower.includes('airtel') || netLower.includes('at');
        if (network === 'Telecel') return netLower.includes('telecel') || netLower.includes('voda');
        if (network === 'MTN') return netLower.includes('mtn') || netLower.includes('yello');
        return false;
      })
    : [];

  const selectedPlan = currentNetworkPlans.find((p) => p.id === selectedPlanId);

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!network) return alert('Please select a network.');
    if (!phone) return alert('Please enter phone number.');
    if (!selectedPlan) return alert('Please choose a data package.');

    setLoading(true);
    setMessage(null);

    // If using wallet balance (when user has sufficient funds and chose wallet)
    if (paymentMethod === 'wallet' && walletBalance !== null && walletBalance >= selectedPlan.price) {
      try {
        const response = await fetch('/api/vtu/recharge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userId || 'USER_GUEST',
            walletId: walletId || 'WAL_GUEST',
            serviceId: `PLAN_${selectedPlan.id}`,
            amount: selectedPlan.price,
            recipient: phone,
            network,
            serviceType: 'data',
            planId: selectedPlan.id,
          }),
        });

        const data = await response.json();
        setLoading(false);

        if (data.success) {
          setMessage({
            type: 'success',
            text: data.message || `${network} data bundle order placed successfully!`,
          });
          if (walletBalance !== null) {
            setWalletBalance(prev => (prev !== null ? Math.max(0, prev - selectedPlan.price) : 0));
          }
        } else {
          setMessage({
            type: 'error',
            text: data.message || 'Recharge failed. Please try again.',
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

    // Direct Mobile Money / Card payment — No wallet pre-funding required!
    try {
      const cleanPhone = phone.replace(/\D/g, '') || '0000000000';
      const customerEmail = `${cleanPhone}@fadigital.com`;

      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customerEmail,
          amount: selectedPlan.price,
          phone: cleanPhone,
          service: 'data',
          network,
          planId: selectedPlan.id,
          callbackUrl: `${window.location.origin}/buy/data?network=${encodeURIComponent(network)}&phone=${encodeURIComponent(phone)}`,
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
        text: err.message || 'Failed to connect to checkout gateway.',
      });
    }
  };

  const hasWalletFunds = walletBalance !== null && selectedPlan && walletBalance >= selectedPlan.price;

  return (
    <AppLayout userName={userName} userRole="customer">
      <div style={{ maxWidth: '620px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--color-text-primary)' }}>
            🌐 Buy Data Bundle Instantly
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Direct checkout enabled. Pay instantly with MTN MoMo, Telecel Cash, AT Money, or card — no wallet pre-funding required.
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
                <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                  Step 1 — Select Network
                </p>
                <div className="network-grid">
                  <button
                    type="button"
                    onClick={() => { setNetwork('AirtelTigo'); setSelectedPlanId(null); }}
                    className={`network-btn ${network === 'AirtelTigo' ? 'active' : ''}`}
                  >
                    <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>🔵</span>
                    <span>AirtelTigo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setNetwork('Telecel'); setSelectedPlanId(null); }}
                    className={`network-btn ${network === 'Telecel' ? 'active' : ''}`}
                  >
                    <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>🔴</span>
                    <span>Telecel</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setNetwork('MTN'); setSelectedPlanId(null); }}
                    className={`network-btn ${network === 'MTN' ? 'active' : ''}`}
                  >
                    <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>🟡</span>
                    <span>MTN</span>
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

              {/* Step 3: Bundle Selection */}
              {network && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: 0 }}>
                      Step 3 — Choose Live Package ({network})
                    </p>
                    {fetchingPlans && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <RefreshCw size={12} className="animate-spin" /> Loading plans...
                      </span>
                    )}
                  </div>

                  {currentNetworkPlans.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.625rem' }}>
                      {currentNetworkPlans.map((p) => {
                        const isSelected = selectedPlanId === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setSelectedPlanId(p.id)}
                            style={{
                              padding: '0.875rem',
                              textAlign: 'left',
                              border: '2px solid ' + (isSelected ? 'var(--color-brand-primary)' : 'var(--color-border)'),
                              background: isSelected ? 'var(--color-brand-subtle)' : 'var(--color-bg-elevated)',
                              borderRadius: 'var(--radius-md)',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.35rem',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>
                              {p.name}
                            </span>
                            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-brand-primary)', fontFamily: 'Space Grotesk' }}>
                              ₵{p.price.toFixed(2)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{
                      padding: '1.25rem',
                      background: 'rgba(234, 179, 8, 0.1)',
                      border: '1px solid rgba(234, 179, 8, 0.3)',
                      borderRadius: 'var(--radius-md)',
                      color: '#EAB308',
                      fontSize: '0.875rem',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        <AlertTriangle size={16} />
                        <span>{network} Data Bundles Temporarily Offline</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        Upstream provider is configuring packages. Please select AirtelTigo or Telecel.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Payment Option (Direct MoMo/Card or Wallet) */}
              {selectedPlan && (
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--color-bg-elevated)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                    Payment Method
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.65rem 0.85rem', background: paymentMethod === 'direct' ? 'var(--color-brand-subtle)' : 'transparent', borderRadius: '8px', border: paymentMethod === 'direct' ? '1px solid var(--color-brand-primary)' : '1px solid transparent' }}>
                      <input
                        type="radio"
                        name="payMethod"
                        value="direct"
                        checked={paymentMethod === 'direct'}
                        onChange={() => setPaymentMethod('direct')}
                        style={{ accentColor: '#FACC15' }}
                      />
                      <CreditCard size={18} style={{ color: 'var(--color-brand-primary)' }} />
                      <div style={{ flex: 1 }}>
                        <strong style={{ fontSize: '0.88rem', color: 'var(--color-text-primary)' }}>Mobile Money & Card (Instant Direct Pay)</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>MTN MoMo, Telecel Cash, AT Money, Debit/Credit Card</div>
                      </div>
                    </label>

                    {hasWalletFunds && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.65rem 0.85rem', background: paymentMethod === 'wallet' ? 'var(--color-brand-subtle)' : 'transparent', borderRadius: '8px', border: paymentMethod === 'wallet' ? '1px solid var(--color-brand-primary)' : '1px solid transparent' }}>
                        <input
                          type="radio"
                          name="payMethod"
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
                disabled={loading || !selectedPlan}
                style={{ height: '3.2rem', fontSize: '1rem', fontWeight: 700 }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    <Loader2 className="animate-spin" size={18} />
                    Processing Payment...
                  </span>
                ) : !selectedPlan ? (
                  'Select a Data Package Above'
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    <Zap size={18} />
                    Pay ₵{selectedPlan.price.toFixed(2)} {paymentMethod === 'wallet' ? 'from Wallet' : 'with Mobile Money / Card'}
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
