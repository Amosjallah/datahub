'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

function WalletFundContent() {
  const searchParams = useSearchParams();
  const [activePM, setActivePM] = useState<'momo' | 'card'>('momo');
  const [amount, setAmount] = useState<number | ''>('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('user@fadigital.com');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const presets = [10, 20, 50, 100, 200, 500];

  // Auto-verify if returning from Paystack payment with a reference
  useEffect(() => {
    const ref = searchParams.get('ref') || searchParams.get('reference') || searchParams.get('trxref');
    if (ref) {
      setLoading(true);
      fetch(`/api/paystack/verify?reference=${encodeURIComponent(ref)}`)
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          if (data.success) {
            setStatusMessage({
              type: 'success',
              text: `Payment verified! ₵${data.amount?.toFixed(2) || ''} credited to your wallet ledger. (Ref: ${ref})`,
            });
          } else {
            setStatusMessage({
              type: 'error',
              text: data.message || 'Payment verification failed.',
            });
          }
        })
        .catch((err) => {
          setLoading(false);
          setStatusMessage({
            type: 'error',
            text: err.message || 'Failed to verify transaction status.',
          });
        });
    }
  }, [searchParams]);

  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!amount || amount < 1) {
      alert('Please enter a valid amount (minimum ₵1).');
      return;
    }
    if (activePM === 'momo' && !phone) {
      alert('Please enter your Mobile Money number.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          amount: Number(amount),
          walletId: 'WAL_USER_DEMO_01',
          userId: 'USER_DEMO_01',
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success && data.authorization_url) {
        // Redirect to Paystack Checkout URL
        window.location.href = data.authorization_url;
      } else {
        setStatusMessage({
          type: 'error',
          text: data.message || 'Failed to initialize Paystack gateway session.',
        });
      }
    } catch (err: any) {
      setLoading(false);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Network error initiating Paystack checkout.',
      });
    }
  };

  return (
    <AppLayout userName="Kwame Mensah" userRole="customer">
      <div style={{ maxWidth: '520px', margin: '0 auto' }} className="animate-fade-up">
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.2rem' }}>💰 Fund Your Wallet</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Add funds instantly via Paystack.</p>
        </div>

        {/* Current Balance Banner */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, var(--color-brand-subtle), rgba(29, 78, 216, 0.05))', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Current Balance</div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-brand-primary)', fontFamily: 'Space Grotesk' }}>
              ₵245.50
            </div>
          </div>
          <span className="badge badge-success">GHS Wallet</span>
        </div>

        {statusMessage && (
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: statusMessage.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: '1px solid ' + (statusMessage.type === 'success' ? '#22c55e' : '#ef4444'),
            color: statusMessage.type === 'success' ? '#15803d' : '#b91c1c',
            fontSize: '0.875rem',
          }}>
            {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <div>{statusMessage.text}</div>
          </div>
        )}

        <div className="card">
          <div className="card-body">
            {/* Payment Method Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>Payment Method</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setActivePM('momo')}
                  style={{
                    padding: '1rem',
                    textAlign: 'center',
                    border: '2px solid ' + (activePM === 'momo' ? 'var(--color-brand-primary)' : 'var(--color-border)'),
                    background: activePM === 'momo' ? 'var(--color-brand-subtle)' : 'transparent',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>📱</div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>Mobile Money</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>MTN · Telecel · AT</div>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePM('card')}
                  style={{
                    padding: '1rem',
                    textAlign: 'center',
                    border: '2px solid ' + (activePM === 'card' ? 'var(--color-brand-primary)' : 'var(--color-border)'),
                    background: activePM === 'card' ? 'var(--color-brand-subtle)' : 'transparent',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>💳</div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>Debit / Credit</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>Visa · Mastercard</div>
                </button>
              </div>
            </div>

            <form onSubmit={handleInitiate}>
              {/* Preset Amounts */}
              <div style={{ marginBottom: '1.25rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>Quick Amounts (GHS)</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  {presets.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setAmount(p)}
                      style={{
                        padding: '0.625rem',
                        border: '1px solid ' + (amount === p ? 'var(--color-brand-primary)' : 'var(--color-border)'),
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-bg-elevated)',
                        color: amount === p ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                      }}
                    >
                      ₵{p}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Or enter custom amount (min ₵1)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  min="1"
                  step="0.01"
                  required
                />
              </div>

              {/* Conditional MoMo field */}
              {activePM === 'momo' && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" htmlFor="momo-phone">Mobile Money Number</label>
                  <input
                    type="tel"
                    id="momo-phone"
                    className="form-input"
                    placeholder="e.g. 0244 123 456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Email Address */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" htmlFor="customer-email">Email Address (for Paystack Receipt)</label>
                <input
                  type="email"
                  id="customer-email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={18} /> : '🔒 Fund Wallet via Paystack'}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.875rem' }}>
              <Lock size={12} color="var(--color-text-muted)" />
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>256-bit SSL &middot; Powered by Paystack</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default function WalletFund() {
  return (
    <Suspense fallback={
      <AppLayout userName="Kwame Mensah" userRole="customer">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <Loader2 className="animate-spin" size={32} color="var(--color-brand-primary)" />
        </div>
      </AppLayout>
    }>
      <WalletFundContent />
    </Suspense>
  );
}
