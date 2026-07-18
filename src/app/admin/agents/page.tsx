'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Award, ChevronUp, ChevronDown, CheckCircle } from 'lucide-react';

export default function AdminAgents() {
  const [agents, setAgents] = useState([
    { id: '1', name: 'Kwame Mensah', email: 'kwame@fadigital.com', phone: '0244123456', tier: 'Super Agent', sales: 'GH₵1,245,680.00', commission: 'GH₵124,568.00', approved: true },
    { id: '2', name: 'Alice Johnson', email: 'alice@example.com', phone: '0701234568', tier: 'Gold Agent', sales: 'GH₵185,430.00', commission: 'GH₵18,543.00', approved: true },
    { id: '3', name: 'David Amadi', email: 'david@example.com', phone: '0806345678', tier: 'Bronze Agent', sales: 'GH₵45,150.00', commission: 'GH₵4,515.00', approved: true },
    { id: '4', name: 'Sarah Ibrahim', email: 'sarah@example.com', phone: '0908765432', tier: 'Bronze Agent', sales: 'GH₵0.00', commission: 'GH₵0.00', approved: false },
    { id: '5', name: 'Kojo Bonsu', email: 'kojo@example.com', phone: '0541122334', tier: 'Gold Agent', sales: 'GH₵290,000.00', commission: 'GH₵29,000.00', approved: true },
  ]);

  const changeTier = (id: string, dir: 'up' | 'down') => {
    const tiers = ['Bronze Agent', 'Gold Agent', 'Super Agent'];
    setAgents(agents.map(a => {
      if (a.id === id) {
        const idx = tiers.indexOf(a.tier);
        let nextIdx = idx;
        if (dir === 'up' && idx < tiers.length - 1) nextIdx = idx + 1;
        if (dir === 'down' && idx > 0) nextIdx = idx - 1;
        return { ...a, tier: tiers[nextIdx] };
      }
      return a;
    }));
  };

  const approveAgent = (id: string) => {
    setAgents(agents.map(a => {
      if (a.id === id) {
        return { ...a, approved: true };
      }
      return a;
    }));
  };

  return (
    <AppLayout userName="Admin User" userRole="admin">
      <div className="animate-fade-up">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>🚀 Reseller Agents</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Manage commission tiers, approve reseller requests, and view sales performance metrics.</p>
        </div>

        {/* Agents Table */}
        <div className="card" style={{ border: '1px solid var(--color-border)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg-surface)' }}>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Agent Name</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Phone</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Level Tier</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Total Sales Volume</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Commission Earned</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Approval Status</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map(a => (
                <tr key={a.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    <div>{a.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{a.email}</div>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>{a.phone}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span className="badge" style={{ 
                      backgroundColor: a.tier === 'Super Agent' ? 'rgba(16,185,129,0.1)' : a.tier === 'Gold Agent' ? 'rgba(245,158,11,0.1)' : 'rgba(100,116,139,0.1)', 
                      color: a.tier === 'Super Agent' ? '#10B981' : a.tier === 'Gold Agent' ? '#F59E0B' : '#64748B',
                      fontWeight: 700
                    }}>
                      🏆 {a.tier}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-text-primary)' }}>{a.sales}</td>
                  <td style={{ padding: '1rem 0.5rem', fontFamily: 'monospace', color: '#10B981', fontWeight: 700 }}>{a.commission}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span className={`badge ${a.approved ? 'badge-success' : 'badge-warning'}`}>
                      {a.approved ? 'Approved' : 'Pending Request'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    {!a.approved ? (
                      <button 
                        onClick={() => approveAgent(a.id)}
                        className="btn btn-primary btn-sm"
                        style={{ padding: '0.3rem 0.65rem', borderRadius: '6px', fontSize: '0.72rem', backgroundColor: 'var(--color-brand-primary)', color: '#FFF', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <CheckCircle size={12} /> Approve
                      </button>
                    ) : (
                      <div style={{ display: 'inline-flex', gap: '0.25rem' }}>
                        <button 
                          onClick={() => changeTier(a.id, 'up')}
                          disabled={a.tier === 'Super Agent'}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.25rem 0.45rem', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-primary)', cursor: a.tier === 'Super Agent' ? 'not-allowed' : 'pointer', opacity: a.tier === 'Super Agent' ? 0.4 : 1 }}
                          title="Upgrade Tier"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button 
                          onClick={() => changeTier(a.id, 'down')}
                          disabled={a.tier === 'Bronze Agent'}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.25rem 0.45rem', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-primary)', cursor: a.tier === 'Bronze Agent' ? 'not-allowed' : 'pointer', opacity: a.tier === 'Bronze Agent' ? 0.4 : 1 }}
                          title="Downgrade Tier"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
