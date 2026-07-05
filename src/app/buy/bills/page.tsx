'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';

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

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return alert('Please enter account or meter number.');
    alert(`Bill Payment processed.\nProvider: ${providerId}\nAccount: ${account}\nAmount: ${providerId === 'waec' ? 'Cost of PIN (₵15)' : '₵' + amount}`);
  };

  const activeMeta = providerId ? providerMetaMap[providerId] : null;

  return (
    <AppLayout userName="Kwame Mensah" userRole="customer">
      <div className="animate-fade-up">
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.2rem' }}>⚡ Pay Bills</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Electricity, water, and exam checker voucher PINs.</p>
        </div>

        {/* Provider Cards Selector */}
        {!providerId && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.875rem', marginBottom: '1.5rem' }}>
            {providers.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setProviderId(p.id)}
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
                    {providerId === 'waec' ? 'Exam Candidate ID' : 'Account / Meter Number'}
                  </label>
                  <input
                    type="text"
                    id="bill-account"
                    className="form-input"
                    placeholder={providerId === 'waec' ? 'Index number' : 'Enter account number'}
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
                      <option value="bece">BECE Checker</option>
                      <option value="wassce">WASSCE Checker</option>
                      <option value="novdec">Nov/Dec Checker</option>
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

                <div className="divider"></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Wallet Balance</span>
                  <strong style={{ color: 'var(--color-brand-primary)' }}>₵245.50</strong>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>⚡ Pay Now</button>
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
