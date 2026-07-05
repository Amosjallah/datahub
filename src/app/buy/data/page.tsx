'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Loader2 } from 'lucide-react';

interface Bundle {
  id: string;
  name: string;
  price: number;
}

export default function BuyData() {
  const [network, setNetwork] = useState<'MTN' | 'Telecel' | 'AirtelTigo' | ''>('');
  const [phone, setPhone] = useState('');
  const [selectedBundleId, setSelectedBundleId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const bundles: Record<'MTN' | 'Telecel' | 'AirtelTigo', Bundle[]> = {
    MTN: [
      { id: 'mtn-5', name: 'MTN CG 5GB (30 Days)', price: 20.00 },
      { id: 'mtn-10', name: 'MTN CG 10GB (30 Days)', price: 40.00 },
      { id: 'mtn-20', name: 'MTN CG 20GB (30 Days)', price: 75.00 },
    ],
    Telecel: [
      { id: 'tel-5', name: 'Telecel Special 5GB', price: 18.00 },
      { id: 'tel-10', name: 'Telecel Special 10GB', price: 35.00 },
    ],
    AirtelTigo: [
      { id: 'at-5', name: 'AirtelTigo Big Time 5GB', price: 15.00 },
      { id: 'at-10', name: 'AirtelTigo Big Time 10GB', price: 28.00 },
    ],
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!network) return alert('Please select a network.');
    if (!phone) return alert('Please enter phone number.');
    if (!selectedBundleId) return alert('Please choose a package.');

    setLoading(true);
    setMessage(null);

    // Simulate VTU API process
    setTimeout(() => {
      setLoading(false);
      if (phone.startsWith('0244000')) {
        setMessage({ type: 'error', text: 'VTU API Timeout. Wallet automatically refunded.' });
      } else {
        setMessage({ type: 'success', text: 'Transaction processed successfully! Data delivered.' });
      }
    }, 1200);
  };

  const currentBundles = network ? bundles[network] : [];

  return (
    <AppLayout userName="Kwame Mensah" userRole="customer">
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            🌐 Buy Data Bundle
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Select network, enter the phone number, and choose your bundle.
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
                    onClick={() => { setNetwork('MTN'); setSelectedBundleId(''); }}
                    className={`network-btn ${network === 'MTN' ? 'active' : ''}`}
                  >
                    <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>🟡</span>
                    <span>MTN</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setNetwork('Telecel'); setSelectedBundleId(''); }}
                    className={`network-btn ${network === 'Telecel' ? 'active' : ''}`}
                  >
                    <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>🔴</span>
                    <span>Telecel</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setNetwork('AirtelTigo'); setSelectedBundleId(''); }}
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

              {/* Step 3: Bundle Selection */}
              {network && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                    Step 3 — Choose Bundle
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
                    {currentBundles.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBundleId(b.id)}
                        style={{
                          padding: '0.875rem',
                          textAlign: 'left',
                          border: '2px solid ' + (selectedBundleId === b.id ? 'var(--color-brand-primary)' : 'var(--color-border)'),
                          background: selectedBundleId === b.id ? 'var(--color-brand-subtle)' : 'var(--color-bg-elevated)',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.25rem',
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>{b.name}</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-brand-primary)', fontFamily: 'Space Grotesk' }}>
                          ₵{b.price.toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
