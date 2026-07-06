'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Copy, Users, Link2, DollarSign } from 'lucide-react';

export default function AgentReferrals() {
  const referrals = [
    { name: 'John Okafor', phone: '0803 123 4567', type: 'Sub-agent', orders: 56, status: 'active', joined: 'May 10, 2024' },
    { name: 'Alice Johnson', phone: '0701 234 5678', type: 'Customer', orders: 23, status: 'active', joined: 'May 12, 2024' },
    { name: 'David Amadi', phone: '0806 345 6789', type: 'Sub-agent', orders: 41, status: 'active', joined: 'May 15, 2024' },
    { name: 'Sarah Ibrahim', phone: '0908 765 4321', type: 'Customer', orders: 12, status: 'new', joined: 'May 19, 2024' },
    { name: 'Mike Okechukwu', phone: '0812 345 6789', type: 'Customer', orders: 8, status: 'new', joined: 'May 20, 2024' },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://fadigital.com/register?ref=KWAME_RES_241');
    alert('Referral link copied to clipboard!');
  };

  return (
    <AppLayout userName="Kwame Mensah" userRole="agent">
      <div className="animate-fade-up">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>👥 Referrals & Sub-agents</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Earn passive income royalties when you invite other agents or customers to register under you.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Copy invite link */}
          <div className="card" style={{ background: '#FFF', border: '1px solid var(--color-border)', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link2 size={18} color="var(--color-brand-primary)" /> Invite New Agents
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', marginBottom: '1.25rem' }}>
              Earn 5% royalty on all VTU transactions completed by sub-agents registering via this code:
            </p>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                readOnly 
                className="form-input" 
                value="https://fadigital.com/register?ref=KWAME_RES_241"
                style={{ fontSize: '0.8rem', background: '#FAFAFA', border: '1px solid var(--color-border)', fontFamily: 'monospace' }} 
              />
              <button 
                onClick={handleCopyLink}
                className="btn btn-primary"
                style={{ padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', border: 'none' }}
              >
                <Copy size={14} /> Copy
              </button>
            </div>
          </div>

          {/* Stats summary */}
          <div className="card" style={{ background: '#FFF', border: '1px solid var(--color-border)', padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0,102,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-brand-primary)', flexShrink: 0 }}>
              <Users size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Total Sub-agents
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: '0.15rem 0' }}>
                32 members
              </div>
              <div style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 600 }}>
                +10 joined this calendar month
              </div>
            </div>
          </div>
        </div>

        {/* Referrals table */}
        <div className="card" style={{ background: '#FFF', border: '1px solid var(--color-border)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)', backgroundColor: '#FAFAFA' }}>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Invite Name</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Phone</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Account Type</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700, textAlign: 'center' }}>Orders Completed</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 700, textAlign: 'right' }}>Date Joined</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((r, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{r.name}</td>
                  <td style={{ padding: '1rem 0.5rem', fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>{r.phone}</td>
                  <td style={{ padding: '1rem 0.5rem', color: 'var(--color-text-secondary)' }}>{r.type}</td>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: 700, textAlign: 'center', color: 'var(--color-text-primary)' }}>{r.orders}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span className={`badge ${
                      r.status === 'active' ? 'badge-success' : 'badge-info'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{r.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
