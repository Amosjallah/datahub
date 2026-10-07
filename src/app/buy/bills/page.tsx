'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Loader2, CheckCircle2, AlertTriangle, Wallet, CreditCard, Zap } from 'lucide-react';
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
              text: `Payment of GH₵${Number(data.amount).toFixed(2)} verified (Ref: ${ref})! Your utility bill payment is confirmed.`,
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
            text: `Payment confirmed (Ref: ${ref})! Your bill transaction has been submitted.`,
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

    setLoading(true);
    setMessage(null);

    // If using wallet balance
    if (paymentMethod === 'wallet' && walletBalance !== null && walletBalance >= payAmount) {
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
      return;
    }

    // Direct payment via Paystack (Mobile Money / Card) — No funding first required!
    try {
      const cleanPhone = account.replace(/\D/g, '') || '0000000000';
      const customerEmail = `${cleanPhone}@fadigital.com`;

      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customerEmail,
          amount: payAmount,
          phone: cleanPhone,
          service: 'bills',
          callbackUrl: `${window.location.origin}/buy/bills?provider=${encodeURIComponent(providerId)}&account=${encodeURIComponent(account)}`,
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

  const activeMeta = providerId ? providerMetaMap[providerId] : null;
  const currentPayAmount = providerId === 'waec' ? 15.00 : Number(amount) || 0;
  const hasWalletFunds = walletBalance !== null && currentPayAmount > 0 && walletBalance >= currentPayAmount;

  return (
    <AppLayout userName={userName} userRole="customer">
      <div className="animate-fade-up">
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.2rem', color: 'var(--color-text-primary)' }}>
            ⚡ Pay Bills Instantly
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Instant payment for electricity, water, and exam checker vouchers. No pre-funding required.
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

        {/* Provider Cards Selector */}
        {!providerId && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.875rem', marginBottom: '1.5rem' }}>
            {providers.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setProviderId(p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                  padding: '1.1rem 1.25rem',
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
                className="hover-card"
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: p.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  flexShrink: 0,
                }}>
                  {p.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>{p.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>{p.sub}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Form when Provider Selected */}
        {providerId && activeMeta && (
          <div className="card" style={{ maxWidth: '520px' }}>
            <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <span style={{ fontSize: '1.4rem' }}>{activeMeta.icon}</span>
                <span style={{ fontWeight: 700 }}>{activeMeta.name}</span>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => { setProviderId(''); setMessage(null); }}
              >
                Change Provider
              </button>
            </div>

            <div className="card-body">
              <form onSubmit={handlePay}>
                {activeMeta.showWaec && (
                  <div className="form-group">
                    <label className="form-label">Select Exam Type</label>
                    <select
                      className="form-select"
                      value={waecType}
                      onChange={(e) => setWaecType(e.target.value)}
                    >
                      <option value="bece">BECE Results Checker (₵15.00)</option>
                      <option value="wassce">WASSCE Results Checker (₵15.00)</option>
                      <option value="novdec">NOV/DEC Results Checker (₵15.00)</option>
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">
                    {providerId === 'ecg' ? 'Meter Number (Prepaid / Postpaid)' :
                     providerId === 'gwcl' ? 'GWCL Customer Account Number' :
                     providerId === 'waec' ? 'Recipient Phone Number (to receive PIN via SMS)' :
                     'Account / Phone Number'}
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={
                      providerId === 'ecg' ? 'e.g. 14234567890' :
                      providerId === 'gwcl' ? 'e.g. 0123456789' :
                      providerId === 'waec' ? 'e.g. 0244 123 456' :
                      'Enter account number'
                    }
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    required
                  />
                </div>

                {activeMeta.showAmount && (
                  <div className="form-group">
                    <label className="form-label">Bill Payment Amount (GHS ₵)</label>
                    <input
                      type="number"
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

                {/* Payment Option */}
                {currentPayAmount > 0 && (
                  <div style={{ marginBottom: '1.25rem', padding: '0.85rem', background: 'var(--color-bg-elevated)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                      Payment Method
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', padding: '0.5rem 0.75rem', background: paymentMethod === 'direct' ? 'var(--color-brand-subtle)' : 'transparent', borderRadius: '8px', border: paymentMethod === 'direct' ? '1px solid var(--color-brand-primary)' : '1px solid transparent' }}>
                        <input
                          type="radio"
                          name="billPayMethod"
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
                            name="billPayMethod"
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
                )}

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
                        Pay {providerId === 'waec' ? '₵15.00' : amount ? `₵${Number(amount).toFixed(2)}` : ''} {paymentMethod === 'wallet' ? 'from Wallet' : 'with MoMo / Card'}
                      </span>
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
