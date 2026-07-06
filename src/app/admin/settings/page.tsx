'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { ToggleLeft, ToggleRight, Save, Database, Shield } from 'lucide-react';

export default function AdminSettings() {
  const [maintenance, setMaintenance] = useState(false);
  const [autoRefund, setAutoRefund] = useState(true);
  const [defaultMargin, setDefaultMargin] = useState(8.5);
  const [gateway, setGateway] = useState('flutterwave');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('System settings updated successfully!');
  };

  return (
    <AppLayout userName="Admin User" userRole="admin">
      <div className="animate-fade-up">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>⚙️ System Settings</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Configure global API keys, payout systems, and site maintenance flags.</p>
        </div>

        <div style={{ maxWidth: '650px' }}>
          <form onSubmit={handleSave} className="card" style={{ background: '#FFF', border: '1px solid var(--color-border)', padding: '2rem' }}>
            
            {/* Toggle 1: Maintenance Mode */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.25rem', borderBottom: '1px solid var(--color-border-subtle)', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>System Maintenance Mode</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>Block customer checkouts temporarily to execute core schema upgrades.</div>
              </div>
              <button 
                type="button" 
                onClick={() => setMaintenance(!maintenance)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: maintenance ? 'var(--color-brand-primary)' : 'var(--color-text-muted)', padding: 0 }}
              >
                {maintenance ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
              </button>
            </div>

            {/* Toggle 2: Auto refund */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.25rem', borderBottom: '1px solid var(--color-border-subtle)', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Instant Failure Refunds</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>Automatically credit user balances immediately when gateway api transactions fail.</div>
              </div>
              <button 
                type="button" 
                onClick={() => setAutoRefund(!autoRefund)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: autoRefund ? '#10B981' : 'var(--color-text-muted)', padding: 0 }}
              >
                {autoRefund ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
              </button>
            </div>

            {/* Default reseller discount margin */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ fontWeight: 700 }}>Default Reseller Discount Margin (%)</label>
              <input 
                type="number" 
                className="form-input" 
                value={defaultMargin}
                onChange={(e) => setDefaultMargin(parseFloat(e.target.value))}
                step="0.1" 
                required 
              />
            </div>

            {/* API gateway selection */}
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label" style={{ fontWeight: 700 }}>Primary Telecom API Gateway</label>
              <select 
                className="form-input"
                value={gateway}
                onChange={(e) => setGateway(e.target.value)}
                style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}
              >
                <option value="flutterwave">Flutterwave Telecom API</option>
                <option value="hubtel">Hubtel SMS & VTU Gateway</option>
                <option value="mtn-momo">MTN MoMo API Direct Connect</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-full" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Save size={16} /> Save Configuration
            </button>

          </form>
        </div>
      </div>
    </AppLayout>
  );
}
