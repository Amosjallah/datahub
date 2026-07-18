'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import ProviderIcon from '@/components/ProviderIcon';
import { Settings, Pencil, Check, X } from 'lucide-react';

export default function AdminPricing() {
  const [plans, setPlans] = useState([
    { id: '1', provider: 'MTN', name: 'MTN Data CG 5GB', wholesale: 16.50, agent: 18.00, retail: 20.00, status: 'Active' },
    { id: '2', provider: 'MTN', name: 'MTN Data CG 10GB', wholesale: 33.00, agent: 36.50, retail: 40.00, status: 'Active' },
    { id: '3', provider: 'Telecel', name: 'Telecel Airtime', wholesale: 9.20, agent: 9.50, retail: 10.00, status: 'Active' },
    { id: '4', provider: 'Airtel', name: 'Airtel Data CG 2GB', wholesale: 8.50, agent: 9.50, retail: 11.00, status: 'Active' },
    { id: '5', provider: 'Glo', name: 'Glo Data 5GB', wholesale: 18.00, agent: 20.00, retail: 22.00, status: 'Degraded' },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [wholesaleVal, setWholesaleVal] = useState(0);
  const [agentVal, setAgentVal] = useState(0);
  const [retailVal, setRetailVal] = useState(0);

  const startEdit = (id: string, wholesale: number, agent: number, retail: number) => {
    setEditingId(id);
    setWholesaleVal(wholesale);
    setAgentVal(agent);
    setRetailVal(retail);
  };

  const saveEdit = (id: string) => {
    setPlans(plans.map(p => {
      if (p.id === id) {
        return { ...p, wholesale: wholesaleVal, agent: agentVal, retail: retailVal };
      }
      return p;
    }));
    setEditingId(null);
  };

  return (
    <AppLayout userName="Admin User" userRole="admin">
      <div className="animate-fade-up">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>⚙️ Pricing & Services</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Configure wholesale costs, agent discounts, customer retail pricing, and service availability.</p>
        </div>

        {/* Pricing List Table */}
        <div className="card" style={{ border: '1px solid var(--color-border)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg-surface)' }}>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Provider</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Service Name</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Wholesale Cost (GH₵)</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Agent Price (GH₵)</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Retail Price (GH₵)</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ProviderIcon provider={p.provider} size={16} />
                      <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{p.provider}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{p.name}</td>
                  
                  <td style={{ padding: '1rem 0.5rem', fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>
                    {editingId === p.id ? (
                      <input 
                        type="number" 
                        value={wholesaleVal} 
                        onChange={(e) => setWholesaleVal(parseFloat(e.target.value))} 
                        style={{ width: '70px', padding: '0.2rem', fontSize: '0.8rem', border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)', color: 'var(--color-text-primary)' }} 
                      />
                    ) : (
                      `GH₵${p.wholesale.toFixed(2)}`
                    )}
                  </td>
                  
                  <td style={{ padding: '1rem 0.5rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {editingId === p.id ? (
                      <input 
                        type="number" 
                        value={agentVal} 
                        onChange={(e) => setAgentVal(parseFloat(e.target.value))} 
                        style={{ width: '70px', padding: '0.2rem', fontSize: '0.8rem', border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)', color: 'var(--color-text-primary)' }} 
                      />
                    ) : (
                      `GH₵${p.agent.toFixed(2)}`
                    )}
                  </td>
 
                  <td style={{ padding: '1rem 0.5rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {editingId === p.id ? (
                      <input 
                        type="number" 
                        value={retailVal} 
                        onChange={(e) => setRetailVal(parseFloat(e.target.value))} 
                        style={{ width: '70px', padding: '0.2rem', fontSize: '0.8rem', border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)', color: 'var(--color-text-primary)' }} 
                      />
                    ) : (
                      `GH₵${p.retail.toFixed(2)}`
                    )}
                  </td>
 
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span className={`badge ${p.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                      {p.status}
                    </span>
                  </td>
 
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    {editingId === p.id ? (
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button 
                          onClick={() => saveEdit(p.id)}
                          className="btn btn-sm"
                          style={{ padding: '0.25rem 0.5rem', backgroundColor: '#10B981', color: '#FFF', border: 'none', display: 'flex', alignItems: 'center' }}
                        >
                          <Check size={14} />
                        </button>
                        <button 
                          onClick={() => setEditingId(null)}
                          className="btn btn-sm"
                          style={{ padding: '0.25rem 0.5rem', backgroundColor: '#EF4444', color: '#FFF', border: 'none', display: 'flex', alignItems: 'center' }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => startEdit(p.id, p.wholesale, p.agent, p.retail)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.3rem 0.65rem', borderRadius: '6px', fontSize: '0.72rem', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <Pencil size={12} /> Edit Price
                      </button>
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
