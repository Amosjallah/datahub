'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';

export default function TransactionsIndex() {
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  const transactions = [
    { id: '1', service: 'MTN Data CG 5GB', recipient: '0244123456', amount: 20.00, date: '04 Jul 2026, 9:30pm', status: 'success', type: 'data', ref: 'TX_MTN_1241' },
    { id: '2', service: 'Telecel Airtime', recipient: '0205123456', amount: 10.00, date: '04 Jul 2026, 2:15pm', status: 'success', type: 'airtime', ref: 'TX_TEL_9941' },
    { id: '3', service: 'ECG Prepaid Utility', recipient: '10203040506', amount: 50.00, date: '03 Jul 2026, 11:10am', status: 'failed', type: 'bill', ref: 'TX_ECG_8820' },
  ];

  const filtered = transactions.filter(t => {
    if (filterStatus && t.status !== filterStatus) return false;
    if (filterType && t.type !== filterType) return false;
    return true;
  });

  return (
    <AppLayout userName="Kwame Mensah" userRole="customer">
      <div className="animate-fade-up">
        {/* Header filters */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.2rem' }}>📊 Transactions</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>All your purchase history in one place.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <select
              className="form-select"
              style={{ width: 'auto', fontSize: '0.85rem' }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="success">✅ Success</option>
              <option value="failed">❌ Failed</option>
            </select>
            <select
              className="form-select"
              style={{ width: 'auto', fontSize: '0.85rem' }}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="data">🌐 Data</option>
              <option value="airtime">📱 Airtime</option>
              <option value="bill">⚡ Bills</option>
            </select>
          </div>
        </div>

        {/* Transactions List */}
        <div className="card">
          {filtered.map((tx) => (
            <div key={tx.id} className="tx-item" style={{ padding: '0.9rem 1.25rem', borderBottom: '1px solid var(--color-border)' }}>
              <div className="tx-icon debit" style={{ flexShrink: 0 }}>
                {tx.type === 'data' && '🌐'}
                {tx.type === 'airtime' && '📱'}
                {tx.type === 'bill' && '⚡'}
              </div>
              <div className="tx-info">
                <div className="tx-title">{tx.service}</div>
                <div className="tx-date" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
                  <span>{tx.date}</span>
                  <span style={{ opacity: 0.4 }}>&middot;</span>
                  <span>{tx.recipient}</span>
                  <span style={{ opacity: 0.4 }}>&middot;</span>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', background: 'var(--color-bg-elevated)', padding: '1px 6px', borderRadius: '4px' }}>
                    {tx.ref}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div className="tx-amount debit">₵{tx.amount.toFixed(2)}</div>
                <span className={`badge ${tx.status === 'success' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.68rem', marginTop: '4px' }}>
                  {tx.status}
                </span>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem', opacity: 0.3 }}>📭</div>
              <p style={{ color: 'var(--color-text-muted)' }}>No transactions found matching filters.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
