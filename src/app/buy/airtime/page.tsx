'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Loader2 } from 'lucide-react';

export default function BuyAirtime() {
  const [network, setNetwork] = useState<'MTN' | 'Telecel' | 'AirtelTigo' | ''>('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!network) return alert('Please select a network.');
    if (!phone) return alert('Please enter phone number.');
    if (!amount || amount < 1) return alert('Please enter a valid amount (minimum ₵1).');

    setLoading(true);
    setMessage(null);

    // Simulate VTU API process
    setTimeout(() => {
      setLoading(false);
      if (phone.startsWith('0244000')) {
        setMessage({ type: 'error', text: 'Airtime VTU Gateway error. Wallet automatically refunded.' });
      } else {
        setMessage({ type: 'success', text: `₵${Number(amount).toFixed(2)} airtime sent successfully!` });
      }
    }, 1200);
  };

  return (
    <AppLayout userName="Kwame Mensah" userRole="customer">
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
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
            {message.type === 'success' ? '✅' : '❌'} {message.text}
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

              <div className="divider"></div>

              {/* Wallet info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Wallet Balance</span>
                <strong style={{ color: 'var(--color-brand-primary)' }}>₵245.50</strong>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Loader2 className="animate-spin" size={16} />
                    Processing...
                  </span>
                ) : (
                  '⚡ Confirm & Pay'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
