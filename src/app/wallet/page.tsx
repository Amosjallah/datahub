'use client';

import React from 'react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function WalletIndex() {
  const transactions = [
    { type: 'credit', title: 'Wallet Funded via Mobile Money', date: '04 Jul 2026 &middot; 9:45pm', amount: 100.00 },
    { type: 'debit', title: 'VTU Purchase: MTN Data 10GB', date: '04 Jul 2026 &middot; 9:30pm', amount: -40.00 },
    { type: 'debit', title: 'VTU Purchase: Telecel Airtime', date: '03 Jul 2026 &middot; 2:15pm', amount: -10.00 },
  ];

  return (
    <AppLayout userName="Kwame Mensah" userRole="customer">
      <div className="animate-fade-up">
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.2rem' }}>💳 My Wallet</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Manage your balance and transaction history.</p>
          </div>
          <Link href="/wallet/fund" className="btn btn-primary btn-sm">
            + Add Funds
          </Link>
        </div>

        {/* Wallet Balance Card */}
        <div className="wallet-card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="wallet-label">Available Balance</div>
              <div className="wallet-balance">
                <span className="wallet-currency">₵</span>245.50
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.4rem' }}>ACCOUNT NUMBER</div>
              <div style={{ fontSize: '0.875rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.12em' }}>
                00000042
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link href="/wallet/fund" className="btn btn-primary btn-sm">Fund Wallet</Link>
            <Link href="/transactions" className="btn btn-secondary btn-sm">Full History</Link>
          </div>
        </div>

        {/* Total stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total In</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-success)', fontFamily: 'Space Grotesk' }}>
              +₵350.00
            </div>
          </div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Out</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-danger)', fontFamily: 'Space Grotesk' }}>
              -₵104.50
            </div>
          </div>
        </div>

        {/* Recent ledger entries */}
        <div className="card">
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Wallet Activity</h3>
            </div>

            {transactions.map((tx, idx) => (
              <div key={idx} className="tx-item">
                <div className={`tx-icon ${tx.type === 'credit' ? 'credit' : 'debit'}`}>
                  {tx.type === 'credit' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                </div>
                <div className="tx-info">
                  <div className="tx-title">{tx.title}</div>
                  <div className="tx-date" dangerouslySetInnerHTML={{ __html: tx.date }}></div>
                </div>
                <div className={`tx-amount ${tx.type === 'credit' ? 'credit' : 'debit'}`}>
                  {tx.type === 'credit' ? '+' : ''}₵{tx.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
