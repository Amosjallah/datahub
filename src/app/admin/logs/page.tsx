'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Shield, ShieldAlert, Key, RefreshCw } from 'lucide-react';

export default function AdminLogs() {
  const [logs, setLogs] = useState([
    { id: 'LOG-001', action: 'REVERSE_TRANSACTION', desc: 'Reversed transaction TRX-2024-0004 for customer 0908765432', performer: 'admin@fadigital.com', ip: '197.251.12.87', date: 'May 20, 2024 09:59 AM' },
    { id: 'LOG-002', action: 'UPDATE_PRICING', desc: 'Updated MTN Data CG 10GB wholesale cost to GH₵33.00', performer: 'admin@fadigital.com', ip: '197.251.12.87', date: 'May 20, 2024 09:30 AM' },
    { id: 'LOG-003', action: 'SUSPEND_USER', desc: 'Suspended Sarah Ibrahim (sarah@example.com) for fraud reports', performer: 'admin@fadigital.com', ip: '197.251.12.87', date: 'May 19, 2024 04:22 PM' },
    { id: 'LOG-004', action: 'AGENT_SETTLEMENT', desc: 'Settled reseller commissions to Alice Johnson wallet', performer: 'billing@fadigital.com', ip: '197.251.8.12', date: 'May 19, 2024 11:15 AM' },
    { id: 'LOG-005', action: 'API_KEY_ROTATION', desc: 'Rotated Flutterwave gateway authorization keys', performer: 'system-bot', ip: '127.0.0.1', date: 'May 18, 2024 02:45 PM' },
  ]);

  const [search, setSearch] = useState('');

  const filtered = logs.filter(l => 
    l.action.toLowerCase().includes(search.toLowerCase()) || 
    l.desc.toLowerCase().includes(search.toLowerCase()) || 
    l.performer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout userName="Admin User" userRole="admin">
      <div className="animate-fade-up">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>🛡️ System Audit Logs</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Track administrator logins, configuration changes, API rotations, and system actions.</p>
        </div>

        {/* Filter controls */}
        <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', background: '#FFF', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="Search audit actions, descriptions, or performers..." 
              className="form-input" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ fontSize: '0.875rem' }} 
            />
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="card" style={{ background: '#FFF', border: '1px solid var(--color-border)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)', backgroundColor: '#FAFAFA' }}>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Action Event</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Log Description</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Performer</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>IP Address</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 700, textAlign: 'right' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, fontSize: '0.75rem', color: l.action.includes('SUSPEND') || l.action.includes('REVERSE') ? '#EF4444' : 'var(--color-brand-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {l.action.includes('API_KEY') ? <Key size={13} /> : <Shield size={13} />}
                      <span>{l.action}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', color: 'var(--color-text-secondary)', maxWidth: '300px', whiteSpace: 'normal', lineHeight: '1.4' }}>{l.desc}</td>
                  <td style={{ padding: '1rem 0.5rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>{l.performer}</td>
                  <td style={{ padding: '1rem 0.5rem', fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>{l.ip}</td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{l.date}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: 'var(--color-text-muted)' }}>No logs matched your criteria.</p>
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
