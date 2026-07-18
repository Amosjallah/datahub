'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { CreditCard, PlusCircle, MinusCircle, CheckCircle } from 'lucide-react';

export default function AdminWallets() {
  const [users, setUsers] = useState([
    { id: '1', name: 'Kwame Mensah', email: 'kwame@fadigital.com', phone: '0244123456', balance: 125680.50 },
    { id: '2', name: 'John Oliver', email: 'john@example.com', phone: '0551234567', balance: 25680.50 },
    { id: '3', name: 'Alice Johnson', email: 'alice@example.com', phone: '0701234568', balance: 5430.00 },
  ]);

  const [selectedUser, setSelectedUser] = useState('1');
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState<'credit' | 'debit'>('credit');
  const [logs, setLogs] = useState([
    { id: 'FL-001', user: 'Kwame Mensah', amount: 'GH₵15,000.00', type: 'Credit', note: 'Admin approval deposit', date: 'May 20, 2024 09:12 AM' },
    { id: 'FL-002', user: 'John Oliver', amount: 'GH₵2,500.00', type: 'Credit', note: 'MoMo deposit verification', date: 'May 19, 2024 04:30 PM' },
    { id: 'FL-003', user: 'Alice Johnson', amount: 'GH₵300.00', type: 'Debit', note: 'Chargeback correction', date: 'May 18, 2024 11:20 AM' },
  ]);

  const handleWalletUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    setUsers(users.map(u => {
      if (u.id === selectedUser) {
        const nextBalance = action === 'credit' ? u.balance + parsedAmount : u.balance - parsedAmount;
        
        // Add log
        const newLog = {
          id: `FL-00${logs.length + 1}`,
          user: u.name,
          amount: `GH₵${parsedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
          type: action === 'credit' ? 'Credit' : 'Debit',
          note: `Manual wallet adjust by admin`,
          date: new Date().toLocaleString()
        };
        setLogs([newLog, ...logs]);

        return { ...u, balance: nextBalance };
      }
      return u;
    }));

    setAmount('');
    alert(`Wallet successfully ${action}ed!`);
  };

  return (
    <AppLayout userName="Admin User" userRole="admin">
      <div className="animate-fade-up">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>💳 Wallet Adjustments</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Manually credit or debit user and reseller agent wallets instantly.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Credit/Debit Form */}
          <div className="card" style={{ border: '1px solid var(--color-border)', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Trigger Balance Adjustment</h3>
            <form onSubmit={handleWalletUpdate}>
              
              <div className="form-group">
                <label className="form-label">Select Target User</label>
                <select 
                  className="form-input" 
                  value={selectedUser} 
                  onChange={(e) => setSelectedUser(e.target.value)}
                  style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} (GH₵{u.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Action Type</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    type="button" 
                    onClick={() => setAction('credit')}
                    className={`btn btn-sm ${action === 'credit' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, border: action === 'credit' ? 'none' : '1px solid var(--color-border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                  >
                    <PlusCircle size={14} /> Credit
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setAction('debit')}
                    className={`btn btn-sm ${action === 'debit' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, border: action === 'debit' ? 'none' : '1px solid var(--color-border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                  >
                    <MinusCircle size={14} /> Debit
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Amount (GH₵)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="0.00" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required 
                  step="0.01" 
                  min="0.01" 
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full" style={{ backgroundColor: action === 'credit' ? '#10B981' : '#EF4444', border: 'none' }}>
                Execute {action === 'credit' ? 'Credit' : 'Debit'}
              </button>
            </form>
          </div>

          {/* Funding Logs */}
          <div className="card" style={{ border: '1px solid var(--color-border)', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Recent Wallet Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '310px', overflowY: 'auto' }}>
              {logs.map(log => (
                <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', border: '1px solid var(--color-border-subtle)', borderRadius: '8px', background: 'var(--color-bg-surface)' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{log.user}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>{log.note}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{log.date}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge ${log.type === 'Credit' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.65rem' }}>
                      {log.type === 'Credit' ? '+' : '-'} {log.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
