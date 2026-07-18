'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import ProviderIcon from '@/components/ProviderIcon';
import { Search, RotateCcw } from 'lucide-react';

export default function AdminTransactions() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [transactions, setTransactions] = useState([
    { id: 'TRX-2024-0001', user: '0803 123 4567', type: 'Data (MTN 10GB)', provider: 'MTN', amount: 'GH₵4,500.00', status: 'success', date: 'May 20, 2024 10:45 AM', actioned: false },
    { id: 'TRX-2024-0002', user: '0701 234 5678', type: 'Airtime (Airtel ₦1,000)', provider: 'Airtel', amount: 'GH₵1,000.00', status: 'success', date: 'May 20, 2024 10:42 AM', actioned: false },
    { id: 'TRX-2024-0003', user: '0806 345 6789', type: 'Data (Glo 5GB)', provider: 'Glo', amount: 'GH₵2,200.00', status: 'success', date: 'May 20, 2024 10:15 AM', actioned: false },
    { id: 'TRX-2024-0004', user: '0908 765 4321', type: 'Airtime (MTN ₦500)', provider: 'MTN', amount: 'GH₵500.00', status: 'failed', date: 'May 20, 2024 09:58 AM', actioned: false },
    { id: 'TRX-2024-0005', user: '0812 345 6789', type: 'Data (Airtel 2GB)', provider: 'Airtel', amount: 'GH₵1,100.00', status: 'failed', date: 'May 20, 2024 09:47 AM', actioned: false },
    { id: 'TRX-2024-0006', user: '0709 876 5432', type: 'Data (9mobile 1GB)', provider: '9mobile', amount: 'GH₵600.00', status: 'processing', date: 'May 20, 2024 09:40 AM', actioned: false },
  ]);

  const handleRefund = (id: string) => {
    setTransactions(transactions.map(t => {
      if (t.id === id) {
        alert(`Transaction ${id} refunded successfully!`);
        return { ...t, status: 'refunded', actioned: true };
      }
      return t;
    }));
  };

  const filtered = transactions.filter(t => {
    const matchesSearch = t.id.toLowerCase().includes(search.toLowerCase()) || 
                          t.user.includes(search) || 
                          t.type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? t.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout userName="Admin User" userRole="admin">
      <div className="animate-fade-up">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>📊 Transactions Audit</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>View global transaction history, check system failures, and trigger manual wallet refunds.</p>
        </div>

        {/* Filter controls */}
        <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <input 
                type="text" 
                placeholder="Search transaction ID, phone, plan..." 
                className="form-input" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '2.5rem', fontSize: '0.875rem' }} 
              />
              <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            
            <select 
              className="form-select" 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 'auto', minWidth: '150px', fontSize: '0.875rem' }}
            >
              <option value="">All Statuses</option>
              <option value="success">Success</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="card" style={{ border: '1px solid var(--color-border)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg-surface)' }}>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Transaction ID</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>User / Phone</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Service Type</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Amount</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Date & Time</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>{t.id}</td>
                  <td style={{ padding: '1rem 0.5rem', fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>{t.user}</td>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ProviderIcon provider={t.provider} size={16} />
                      <span style={{ color: 'var(--color-text-primary)' }}>{t.type}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-text-primary)' }}>{t.amount}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span className={`badge ${
                      t.status === 'success' ? 'badge-success' : 
                      t.status === 'processing' ? 'badge-info' : 
                      t.status === 'refunded' ? 'badge-blue' : 'badge-danger'
                    }`} style={{ textTransform: 'capitalize', fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                      {t.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{t.date}</td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    {t.status === 'failed' && !t.actioned ? (
                      <button 
                        onClick={() => handleRefund(t.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ 
                          padding: '0.3rem 0.65rem', 
                          borderRadius: '6px', 
                          fontSize: '0.72rem', 
                          border: '1px solid #EF4444',
                          color: '#EF4444',
                          backgroundColor: 'transparent',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <RotateCcw size={12} /> Refund
                      </button>
                    ) : (
                      <span style={{ color: 'var(--color-text-muted)' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', opacity: 0.3 }}>📂</div>
                    <p style={{ color: 'var(--color-text-muted)' }}>No transactions found matching your filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
