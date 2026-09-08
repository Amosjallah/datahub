'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { supabase } from '@/lib/supabase';
import { RefreshCw, Inbox } from 'lucide-react';
import Link from 'next/link';

interface TransactionItem {
  id: string;
  service: string;
  recipient: string;
  amount: number;
  date: string;
  status: 'success' | 'failed' | 'processing' | 'reversed' | 'pending';
  type: 'data' | 'airtime' | 'bill';
  ref: string;
}

export default function TransactionsIndex() {
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    async function loadTransactions() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
          setUserName(name);

          const { data: records, error } = await supabase
            .from('transaction_records')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (!error && records && records.length > 0) {
            const mapped: TransactionItem[] = records.map((r) => {
              const sId = (r.service_id || '').toUpperCase();
              let sType: 'data' | 'airtime' | 'bill' = 'data';
              if (sId.includes('AIRTIME')) sType = 'airtime';
              else if (sId.includes('BILL') || sId.includes('ECG') || sId.includes('GWCL') || sId.includes('TV')) sType = 'bill';

              return {
                id: r.id,
                service: r.service_id || 'Recharge Order',
                recipient: r.recipient || '—',
                amount: Number(r.amount) || 0,
                date: new Date(r.created_at).toLocaleString('en-GH', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }),
                status: (r.status as any) || 'processing',
                type: sType,
                ref: r.provider_reference || r.id.slice(0, 8),
              };
            });
            setTransactions(mapped);
          } else {
            // If user has no transaction records yet, load wallet transactions as fallback
            const { data: wallet } = await supabase
              .from('wallets')
              .select('id')
              .eq('user_id', user.id)
              .maybeSingle();

            if (wallet) {
              const { data: txList } = await supabase
                .from('wallet_transactions')
                .select('*')
                .eq('wallet_id', wallet.id)
                .order('created_at', { ascending: false });

              if (txList && txList.length > 0) {
                const mapped: TransactionItem[] = txList.map((t) => ({
                  id: t.id,
                  service: t.description || 'Wallet Transaction',
                  recipient: 'Self',
                  amount: Math.abs(Number(t.amount)),
                  date: new Date(t.created_at).toLocaleString('en-GH', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }),
                  status: 'success',
                  type: t.type === 'debit' ? 'data' : 'bill',
                  ref: t.reference || t.id.slice(0, 8),
                }));
                setTransactions(mapped);
              }
            }
          }
        }
      } catch (err) {
        console.warn('[TransactionsIndex] Load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, []);

  const filtered = transactions.filter((t) => {
    if (filterStatus && t.status !== filterStatus) return false;
    if (filterType && t.type !== filterType) return false;
    return true;
  });

  return (
    <AppLayout userName={userName} userRole="customer">
      <div className="animate-fade-up">
        {/* Header filters */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.2rem' }}>📊 Transactions</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>All your purchase history in one place.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <select
              className="form-select"
              style={{ width: 'auto', fontSize: '0.85rem' }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="success">✅ Success</option>
              <option value="processing">⏳ Processing</option>
              <option value="failed">❌ Failed</option>
              <option value="reversed">↩️ Refunded</option>
            </select>
            <select
              className="form-select"
              style={{ width: 'auto', fontSize: '0.85rem' }}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="data">🌐 Data</option>
              <option value="airtime">📱 Airtime</option>
              <option value="bill">⚡ Bills & TV</option>
            </select>
          </div>
        </div>

        {/* Transactions List */}
        <div className="card">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
              <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 0.75rem' }} />
              <p>Loading transactions...</p>
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((tx) => (
              <div key={tx.id} className="tx-item" style={{ padding: '0.9rem 1.25rem', borderBottom: '1px solid var(--color-border)' }}>
                <div className="tx-icon debit" style={{ flexShrink: 0 }}>
                  {tx.type === 'data' && '🌐'}
                  {tx.type === 'airtime' && '📱'}
                  {tx.type === 'bill' && '⚡'}
                </div>
                <div className="tx-info">
                  <div className="tx-title">{tx.service}</div>
                  <div className="tx-date" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
                    <span>{tx.date}</span>
                    <span style={{ opacity: 0.4 }}>&middot;</span>
                    <span>{tx.recipient}</span>
                    <span style={{ opacity: 0.4 }}>&middot;</span>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', background: 'var(--color-bg-elevated)', padding: '1px 6px', borderRadius: '4px' }}>
                      {tx.ref}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div className="tx-amount debit">₵{tx.amount.toFixed(2)}</div>
                  <span className={`badge ${
                    tx.status === 'success' ? 'badge-success' : tx.status === 'processing' ? 'badge-blue' : 'badge-danger'
                  }`} style={{ fontSize: '0.68rem', marginTop: '4px' }}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <Inbox size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>No transactions found.</p>
              <Link href="/buy/data" className="btn btn-primary btn-sm">
                Make your first purchase
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
