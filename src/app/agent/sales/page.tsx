'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import ProviderIcon from '@/components/ProviderIcon';
import { Search } from 'lucide-react';

export default function AgentSales() {
  const [search, setSearch] = useState('');
  const sales = [
    { id: '1234567890', customer: '0803 123 4567', service: 'MTN 10GB', retail: 'GH₵4,500', agent: 'GH₵4,050', margin: 'GH₵450.00', status: 'success', date: 'May 20, 2024 10:45 AM' },
    { id: '1234567889', customer: '0701 234 5678', service: 'Airtime GH₵1,000', retail: 'GH₵1,000', agent: 'GH₵950', margin: 'GH₵50.00', status: 'success', date: 'May 20, 2024 10:42 AM' },
    { id: '1234567888', customer: '0806 345 6789', service: 'Glo 5GB', retail: 'GH₵2,500', agent: 'GH₵2,200', margin: 'GH₵300.00', status: 'processing', date: 'May 19, 2024 09:15 PM' },
    { id: '1234567887', customer: '0908 765 4321', service: 'Dstv Compact', retail: 'GH₵7,900', agent: 'GH₵7,200', margin: 'GH₵700.00', status: 'success', date: 'May 19, 2024 08:11 PM' },
  ];

  const filtered = sales.filter(s => 
    s.id.includes(search) || 
    s.customer.includes(search) || 
    s.service.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout userName="Kwame Mensah" userRole="agent">
      <div className="animate-fade-up">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>📊 Sales Performance</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Track all orders processed, your custom pricing rates, and commission margins.</p>
        </div>

        {/* Filters */}
        <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', border: '1px solid var(--color-border)' }}>
          <input 
            type="text" 
            placeholder="Search by customer phone, transaction ID or service..." 
            className="form-input" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ fontSize: '0.875rem' }} 
          />
        </div>

        {/* Sales Table */}
        <div className="card" style={{ border: '1px solid var(--color-border)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg-surface)' }}>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Order ID</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Customer</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Service</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Retail Cost</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Agent Price</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Your Margin</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 700, textAlign: 'right' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>{s.id}</td>
                  <td style={{ padding: '1rem 0.5rem', fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>{s.customer}</td>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ProviderIcon provider={s.service} size={16} />
                      <span style={{ color: 'var(--color-text-primary)' }}>{s.service}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>{s.retail}</td>
                  <td style={{ padding: '1rem 0.5rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-text-primary)' }}>{s.agent}</td>
                  <td style={{ padding: '1rem 0.5rem', fontFamily: 'monospace', color: '#10B981', fontWeight: 700 }}>{s.margin}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span className={`badge ${s.status === 'success' ? 'badge-success' : 'badge-info'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{s.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
