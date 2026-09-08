'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import { ArrowUpRight, ArrowDownLeft, Wallet, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface TxItem {
  id: string;
  type: 'credit' | 'debit' | 'refund';
  amount: number;
  description: string;
  reference: string;
  created_at: string;
}

export default function WalletIndex() {
  const [userName, setUserName] = useState('User');
  const [walletId, setWalletId] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<TxItem[]>([]);
  const [totalIn, setTotalIn] = useState<number>(0);
  const [totalOut, setTotalOut] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWalletData() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
          setUserName(name);

          // Get wallet
          const { data: wallet } = await supabase
            .from('wallets')
            .select('id, cached_balance')
            .eq('user_id', user.id)
            .maybeSingle();

          if (wallet) {
            setWalletId(wallet.id);
            setBalance(Number(wallet.cached_balance));

            // Load real ledger transactions
            const { data: txList } = await supabase
              .from('wallet_transactions')
              .select('*')
              .eq('wallet_id', wallet.id)
              .order('created_at', { ascending: false })
              .limit(20);

            if (txList && txList.length > 0) {
              setTransactions(txList);
              let tin = 0;
              let tout = 0;
              txList.forEach((t) => {
                const amt = Number(t.amount);
                if (t.type === 'credit' || t.type === 'refund') {
                  tin += Math.abs(amt);
                } else {
                  tout += Math.abs(amt);
                }
              });
              setTotalIn(tin);
              setTotalOut(tout);
            }
          }
        }
      } catch (err) {
        console.warn('[WalletIndex] Load notice:', err);
      } finally {
        setLoading(false);
      }
    }
    loadWalletData();
  }, []);

  return (
    <AppLayout userName={userName} userRole="customer">
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
                <span className="wallet-currency">₵</span>
                {loading ? '...' : balance !== null ? balance.toFixed(2) : '0.00'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.4rem' }}>WALLET ID</div>
              <div style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em' }}>
                {walletId ? walletId.slice(0, 16) + '...' : 'Not Linked'}
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
              +₵{totalIn.toFixed(2)}
            </div>
          </div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Out</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-danger)', fontFamily: 'Space Grotesk' }}>
              -₵{totalOut.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Recent ledger entries */}
        <div className="card">
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Wallet Activity</h3>
              <Link href="/transactions" style={{ fontSize: '0.8rem', color: 'var(--color-brand-primary)' }}>View all</Link>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                <RefreshCw size={20} className="animate-spin" style={{ margin: '0 auto 0.5rem' }} />
                <span>Loading activity...</span>
              </div>
            ) : transactions.length > 0 ? (
              transactions.map((tx) => {
                const isCredit = tx.type === 'credit' || tx.type === 'refund';
                const dateStr = new Date(tx.created_at).toLocaleString('en-GH', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                });
                return (
                  <div key={tx.id} className="tx-item">
                    <div className={`tx-icon ${isCredit ? 'credit' : 'debit'}`}>
                      {isCredit ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                    </div>
                    <div className="tx-info">
                      <div className="tx-title">{tx.description || (isCredit ? 'Wallet Top-Up' : 'Wallet Debit')}</div>
                      <div className="tx-date">{dateStr} &middot; <span style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>{tx.reference}</span></div>
                    </div>
                    <div className={`tx-amount ${isCredit ? 'credit' : 'debit'}`}>
                      {isCredit ? '+' : '-'}₵{Math.abs(Number(tx.amount)).toFixed(2)}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
                <Wallet size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
                <p style={{ margin: 0, fontSize: '0.875rem' }}>No wallet transactions yet.</p>
                <Link href="/wallet/fund" className="btn btn-primary btn-sm" style={{ marginTop: '1rem', display: 'inline-block' }}>
                  Fund Your Wallet
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
