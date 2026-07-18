'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight } from 'lucide-react';

export default function AdminReports() {
  const summaries = [
    { label: 'Total Transaction Volume', val: 'GH₵45,689,120.00', change: '+12.4%', up: true },
    { label: 'Total System Revenue', val: 'GH₵4,568,912.00', change: '+15.2%', up: true },
    { label: 'Total Profit Margins', val: 'GH₵456,891.20', change: '+8.6%', up: true },
    { label: 'Gateway API Costs', val: 'GH₵4,112,020.80', change: '-2.1%', up: false },
  ];

  const graphData = [
    { month: 'Jan', revenue: '30px', amount: 'GH₵300K' },
    { month: 'Feb', revenue: '55px', amount: 'GH₵550K' },
    { month: 'Mar', revenue: '90px', amount: 'GH₵900K' },
    { month: 'Apr', revenue: '120px', amount: 'GH₵1.2M' },
    { month: 'May', revenue: '160px', amount: 'GH₵1.6M' },
    { month: 'Jun', revenue: '220px', amount: 'GH₵2.2M' },
  ];

  return (
    <AppLayout userName="Admin User" userRole="admin">
      <div className="animate-fade-up">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>📈 Reports & Analytics</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Track platform metrics, revenue curves, transaction growth, and API gateway margins.</p>
        </div>

        {/* Summaries Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          {summaries.map((s, idx) => (
            <div key={idx} className="card" style={{ padding: '1.25rem', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {s.label}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: '0.5rem 0', fontFamily: 'monospace' }}>
                {s.val}
              </div>
              <div style={{ fontSize: '0.72rem', color: s.up ? '#10B981' : '#EF4444', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                {s.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {s.change} vs last month
              </div>
            </div>
          ))}
        </div>
 
        {/* Sales Chart */}
        <div className="card" style={{ border: '1px solid var(--color-border)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.5rem' }}>Revenue Growth (H1 2026)</h3>
          
          <div style={{ display: 'flex', gap: '1.5rem', height: '260px', alignItems: 'flex-end', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border-subtle)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', height: '220px', alignItems: 'flex-end', zIndex: 2, paddingLeft: '2rem' }}>
              {graphData.map((d, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '60px' }}>
                  <div style={{ width: '36px', height: d.revenue, background: 'linear-gradient(to top, var(--color-brand-primary), #3B82F6)', borderRadius: '6px 6px 0 0', position: 'relative' }} className="chart-bar" title={d.amount}></div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>{d.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
