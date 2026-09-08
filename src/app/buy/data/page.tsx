'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Loader2, AlertTriangle, CheckCircle2, Wallet, RefreshCw } from 'lucide-react';
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
  const [userName, setUserName] = useState<string>('User');
  const [authLoading, setAuthLoading] = useState(true);

  // Live API Plans
  const [apiPlans, setApiPlans] = useState<Plan[]>([]);

  // 1. Fetch user & wallet from Supabase
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
          // Fallback default plans if API returned empty
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

  // Filter plans according to selected network
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

    if (walletBalance !== null && walletBalance < selectedPlan.price) {
      setMessage({
        type: 'error',
        text: `Insufficient wallet balance (₵${walletBalance.toFixed(2)}). This package requires ₵${selectedPlan.price.toFixed(2)}. Please fund your wallet.`,
      });
      return;
    }

    setLoading(true);
    setMessage(null);

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
        // Deduct from local wallet balance display
        if (walletBalance !== null) {
          setWalletBalance(prev => (prev !== null ? Math.max(0, prev - selectedPlan.price) : 0));
        }
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Recharge failed. Any debited funds have been auto-refunded to your wallet.',
        });
      }
    } catch (err: any) {
      setLoading(false);
      setMessage({
        type: 'error',
        text: err.message || 'Connection failure. Wallet auto-refunded.',
      });
    }
  };

  return (
    <AppLayout userName={userName} userRole="customer">
      <div style={{ maxWidth: '580px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            🌐 Buy Data Bundle
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Select network, enter recipient phone number, and choose your live data package.
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
                <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
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
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: 0 }}>
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
                        The upstream provider has not enabled {network} packages for automated dispatch at this moment. Please select AirtelTigo or Telecel.
                      </p>
                    </div>
                  )}
                </div>
              )}

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
                disabled={loading || !selectedPlan || (walletBalance !== null && walletBalance < (selectedPlan?.price || 0))}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    <Loader2 className="animate-spin" size={16} />
                    Processing via ResellerXpress...
                  </span>
                ) : !selectedPlan ? (
                  'Select a Data Package'
                ) : (
                  `⚡ Confirm & Pay ₵${selectedPlan.price.toFixed(2)}`
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
