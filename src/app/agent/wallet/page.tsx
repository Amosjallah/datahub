'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { CreditCard, ArrowDownLeft, ArrowUpRight, DollarSign, Wallet } from 'lucide-react';

export default function AgentWallet() {
  const [balance, setBalance] = useState(125680.50);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [history, setHistory] = useState([
    { id: 'TX-901', type: 'MoMo Deposit', amount: '+GH₵10,000.00', status: 'success', date: 'May 20, 2024 10:15 AM' },
    { id: 'TX-902', type: 'Commission Payout', amount: '+GH₵15,480.00', status: 'success', date: 'May 19, 2024 09:30 AM' },
    { id: 'TX-903', type: 'VTU Batch Order', amount: '-GH₵7,700.00', status: 'success', date: 'May 18, 2024 04:10 PM' },
    { id: 'TX-904', type: 'Bank Payout Withdrawal', amount: '-GH₵25,000.00', status: 'success', date: 'May 15, 2024 11:22 AM' },
  ]);

  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(payoutAmount);
    if (isNaN(parsed) || parsed <= 0 || parsed > balance) {
      alert('Invalid withdrawal amount requested.');
      return;
    }

    setBalance(balance - parsed);
    const newTx = {
      id: `TX-${900 + history.length + 1}`,
      type: 'Bank Payout Withdrawal',
      amount: `-GH₵${parsed.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      status: 'processing',
      date: new Date().toLocaleString()
    };
    setHistory([newTx, ...history]);
    setPayoutAmount('');
    alert('Withdrawal request initiated successfully!');
  };

  return (
    <AppLayout userName="Kwame Mensah" userRole="agent">
      <div className="animate-fade-up">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>💳 Reseller Wallet</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Fund your VTU purchasing balance, request bank payouts, and audit your statement ledger.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Balance card & Payout form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Balance Card */}
            <div className="card" style={{ background: 'linear-gradient(135deg, var(--color-brand-primary) 0%, #004DDF 100%)', color: '#FFF', padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.8, fontWeight: 600 }}>VTU Reseller Balance</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.25rem 0', fontFamily: 'monospace' }}>
                    GH₵{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <Wallet size={28} style={{ opacity: 0.8 }} />
              </div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                Reseller ID: **KWAME_RES_241**
              </div>
            </div>

            {/* Payout form */}
            <div className="card" style={{ background: '#FFF', border: '1px solid var(--color-border)', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem' }}>Withdraw Commission to Bank</h3>
              <form onSubmit={handleWithdrawal}>
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">Withdrawal Amount (GH₵)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="0.00" 
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    required 
                    max={balance} 
                    step="0.01" 
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-full" style={{ border: 'none' }}>
                  Request Bank Payout
                </button>
              </form>
            </div>
          </div>

          {/* Statement logs */}
          <div className="card" style={{ background: '#FFF', border: '1px solid var(--color-border)', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem' }}>Wallet Ledger Statement</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '330px', overflowY: 'auto' }}>
              {history.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', border: '1px solid var(--color-border-subtle)', borderRadius: '8px', background: '#FAFAFA' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.type}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{item.date} &middot; {item.id}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge ${
                      item.amount.startsWith('+') ? 'badge-success' : 'badge-danger'
                    }`} style={{ fontSize: '0.65rem', fontWeight: 700 }}>
                      {item.amount}
                    </span>
                    <div style={{ fontSize: '0.65rem', color: '#10B981', marginTop: '0.25rem', textTransform: 'capitalize', fontWeight: 600 }}>
                      {item.status}
                    </div>
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
