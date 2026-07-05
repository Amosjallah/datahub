'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Lock } from 'lucide-react';

export default function WalletFund() {
  const [activePM, setActivePM] = useState<'momo' | 'card'>('momo');
  const [amount, setAmount] = useState<number | ''>('');
  const [phone, setPhone] = useState('');

  const presets = [10, 20, 50, 100, 200, 500];

  const handleInitiate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount < 1) {
      alert('Please enter a valid amount (minimum ₵1).');
      return;
    }
    if (activePM === 'momo' && !phone) {
      alert('Please enter your Mobile Money number.');
      return;
    }
    alert(`Paystack gateway integration triggered.\nAmount: ₵${Number(amount).toFixed(2)}\nMethod: ${activePM}`);
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

              <button type="submit" className="btn btn-primary btn-full">
                🔒 Fund Wallet Securely
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
