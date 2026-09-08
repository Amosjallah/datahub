'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Loader2, CheckCircle2, AlertTriangle, Wallet } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface ProviderMeta {
  name: string;
  icon: string;
  showAmount: boolean;
  showWaec: boolean;
}

export default function BuyBills() {
  const [providerId, setProviderId] = useState<string>('');
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [waecType, setWaecType] = useState('bece');
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
        console.warn('[BuyBills] User load warning:', err);
      } finally {
        setAuthLoading(false);
      }
    }
    loadUserData();
  }, []);

  const providers = [
    { id: 'ecg', name: 'ECG Electricity', sub: 'Prepaid & Postpaid', icon: '⚡', color: 'rgba(255,176,32,0.12)', accent: 'var(--color-warning)' },
    { id: 'gwcl', name: 'Ghana Water (GWCL)', sub: 'Water bills', icon: '💧', color: 'rgba(14,165,233,0.12)', accent: 'var(--color-info)' },
    { id: 'waec', name: 'WAEC Checker PIN', sub: 'BECE / WASSCE', icon: '🎓', color: 'rgba(139,92,246,0.12)', accent: '#8B5CF6' },
    { id: 'postpaid', name: 'Postpaid Bills', sub: 'MTN, Telecel, AT', icon: '📄', color: 'rgba(0,208,132,0.12)', accent: 'var(--color-success)' },
  ];

  const providerMetaMap: Record<string, ProviderMeta> = {
    ecg: { name: 'ECG Electricity', icon: '⚡', showAmount: true, showWaec: false },
    gwcl: { name: 'Ghana Water (GWCL)', icon: '💧', showAmount: true, showWaec: false },
    waec: { name: 'WAEC Checker PIN', icon: '🎓', showAmount: false, showWaec: true },
    postpaid: { name: 'Postpaid Bills', icon: '📄', showAmount: true, showWaec: false },
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return alert('Please enter account or meter number.');
    const payAmount = providerId === 'waec' ? 15.00 : Number(amount);
    if (!payAmount || payAmount < 1) return alert('Please enter a valid bill amount.');

    if (walletBalance !== null && walletBalance < payAmount) {
      setMessage({
        type: 'error',
        text: `Insufficient wallet balance (₵${walletBalance.toFixed(2)}). You need ₵${payAmount.toFixed(2)}. Please fund your wallet.`,
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
          provider: providerMetaMap[providerId]?.name || providerId,
          account,
          amount: payAmount,
          billType: providerId === 'waec' ? waecType : undefined,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        setMessage({
          type: 'success',
          text: data.message || `Payment of ₵${payAmount.toFixed(2)} completed successfully!`,
        });
        if (walletBalance !== null) {
          setWalletBalance(prev => (prev !== null ? Math.max(0, prev - payAmount) : 0));
        }
        setAccount('');
        setAmount('');
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Payment failed. Please try again.',
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

  const activeMeta = providerId ? providerMetaMap[providerId] : null;

  return (
    <AppLayout userName={userName} userRole="customer">
      <div className="animate-fade-up">
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.2rem' }}>⚡ Pay Bills</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Electricity, water, and exam checker voucher PINs.</p>
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

        {/* Provider Cards Selector */}
        {!providerId && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.875rem', marginBottom: '1.5rem' }}>
            {providers.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => { setProviderId(p.id); setMessage(null); }}
                style={{
                  padding: '1.25rem',
                  textAlign: 'left',
                  border: '2px solid var(--color-border)',
                  background: 'var(--color-bg-elevated)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                  {p.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>{p.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>{p.sub}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Dynamic Billing Form */}
        {providerId && activeMeta && (
          <div className="card animate-fade-up" style={{ maxWidth: '480px' }}>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '1.5rem' }}>{activeMeta.icon}</div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{activeMeta.name}</h3>
              </div>

              <form onSubmit={handlePay}>
                <div className="form-group">
                  <label className="form-label" htmlFor="bill-account">
                    {providerId === 'waec' ? 'Exam Candidate ID / Phone' : 'Account / Meter Number'}
                  </label>
                  <input
                    type="text"
                    id="bill-account"
                    className="form-input"
                    placeholder={providerId === 'waec' ? 'e.g. 0244123456 or Index Number' : 'Enter account or meter number'}
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    required
                  />
                </div>

                {activeMeta.showWaec && (
                  <div className="form-group">
                    <label className="form-label" htmlFor="waec-type">Exam Type</label>
                    <select
                      id="waec-type"
                      className="form-select"
                      value={waecType}
                      onChange={(e) => setWaecType(e.target.value)}
                    >
                      <option value="bece">BECE Checker (₵15.00)</option>
                      <option value="wassce">WASSCE Checker (₵15.00)</option>
                      <option value="novdec">Nov/Dec Checker (₵15.00)</option>
                    </select>
                  </div>
                )}

                {activeMeta.showAmount && (
                  <div className="form-group">
                    <label className="form-label" htmlFor="bill-amount">Amount (₵)</label>
                    <input
                      type="number"
                      id="bill-amount"
                      className="form-input"
                      placeholder="e.g. 50.00"
                      min="1"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                )}

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
                      `⚡ Pay Now ${providerId === 'waec' ? '₵15.00' : amount ? `₵${Number(amount).toFixed(2)}` : ''}`
                    )}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setProviderId('')}>Change</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
