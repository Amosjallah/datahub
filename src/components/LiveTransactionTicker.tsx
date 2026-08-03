'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Zap, CheckCircle2, Loader2, XCircle } from 'lucide-react';

interface Transaction {
  id: string;
  network: 'MTN' | 'Telecel' | 'AirtelTigo';
  bundle: string;
  phone: string;
  amount: string;
  status: 'success' | 'processing' | 'failed';
  timeAgo: string;
  timestamp: number;
}

const NETWORKS: Transaction['network'][] = ['MTN', 'Telecel', 'AirtelTigo'];

const BUNDLES: Record<Transaction['network'], { label: string; amount: string }[]> = {
  MTN: [
    { label: '1GB Daily', amount: '₵5.50' },
    { label: '3GB Weekly', amount: '₵12.00' },
    { label: '5GB Monthly', amount: '₵18.00' },
    { label: '10GB Monthly', amount: '₵30.00' },
    { label: '20GB Monthly', amount: '₵55.00' },
    { label: '500MB Daily', amount: '₵3.00' },
  ],
  Telecel: [
    { label: '1GB Weekly', amount: '₵13.00' },
    { label: '3GB Monthly', amount: '₵22.00' },
    { label: '5GB Monthly', amount: '₵35.00' },
    { label: '2GB Weekly', amount: '₵18.00' },
  ],
  AirtelTigo: [
    { label: '1GB Daily', amount: '₵8.00' },
    { label: '2GB Weekly', amount: '₵15.00' },
    { label: '5GB Monthly', amount: '₵28.00' },
  ],
};

const NETWORK_COLORS: Record<Transaction['network'], { bg: string; text: string; dot: string; border: string }> = {
  MTN:       { bg: 'rgba(250,204,21,0.12)',  text: '#D4A700', dot: '#FACC15', border: 'rgba(250,204,21,0.25)' },
  Telecel:   { bg: 'rgba(239,68,68,0.10)',   text: '#F87171', dot: '#EF4444', border: 'rgba(239,68,68,0.25)' },
  AirtelTigo:{ bg: 'rgba(6,182,212,0.10)',   text: '#22D3EE', dot: '#06B6D4', border: 'rgba(6,182,212,0.25)'  },
};

const STATUS_WEIGHT = ['success', 'success', 'success', 'success', 'success', 'processing', 'failed'] as const;

function randomPhone(): string {
  const prefixes = ['024', '054', '055', '059', '027', '057', '026'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const mid = String(Math.floor(Math.random() * 900) + 100);
  return `${prefix} ${mid} ****`;
}

function generateTransaction(): Transaction {
  const network = NETWORKS[Math.floor(Math.random() * NETWORKS.length)];
  const bundles = BUNDLES[network];
  const bundle = bundles[Math.floor(Math.random() * bundles.length)];
  const status = STATUS_WEIGHT[Math.floor(Math.random() * STATUS_WEIGHT.length)];
  const now = Date.now();

  return {
    id: `TRX-${now}`,
    network,
    bundle: bundle.label,
    phone: randomPhone(),
    amount: bundle.amount,
    status,
    timeAgo: 'just now',
    timestamp: now,
  };
}

function updateTimeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 5)  return 'just now';
  if (diff < 60) return `${diff}s ago`;
  const m = Math.floor(diff / 60);
  return `${m}m ago`;
}

const SEED_TRANSACTIONS: Transaction[] = Array.from({ length: 6 }, (_, i) => ({
  ...generateTransaction(),
  timestamp: Date.now() - (i + 1) * 18000,
  timeAgo: `${(i + 1) * 18}s ago`,
}));

export default function LiveTransactionTicker() {
  const [transactions, setTransactions] = useState<Transaction[]>(SEED_TRANSACTIONS);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const listRef = useRef<HTMLDivElement>(null);

  // Stream in a new transaction every 3–5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const tx = generateTransaction();
      setNewIds(prev => new Set(prev).add(tx.id));
      setTransactions(prev => [tx, ...prev.slice(0, 11)]);
      setTimeout(() => {
        setNewIds(prev => {
          const next = new Set(prev);
          next.delete(tx.id);
          return next;
        });
      }, 800);
    }, Math.floor(Math.random() * 2000) + 3000);

    return () => clearInterval(interval);
  }, []);

  // Update time-ago labels every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTransactions(prev =>
        prev.map(t => ({ ...t, timeAgo: updateTimeAgo(t.timestamp) }))
      );
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const statusIcon = (status: Transaction['status']) => {
    if (status === 'success')    return <CheckCircle2 size={13} style={{ color: '#10B981', flexShrink: 0 }} />;
    if (status === 'processing') return <Loader2 size={13}     style={{ color: '#FACC15', flexShrink: 0, animation: 'spin 1s linear infinite' }} />;
    return                              <XCircle size={13}     style={{ color: '#EF4444', flexShrink: 0 }} />;
  };

  const statusLabel = (status: Transaction['status']) => {
    if (status === 'success')    return { label: 'Delivered', color: '#10B981' };
    if (status === 'processing') return { label: 'Processing', color: '#FACC15' };
    return                              { label: 'Failed', color: '#EF4444' };
  };

  return (
    <section style={{
      padding: '5rem 0',
      backgroundColor: '#040B18',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px', height: '300px',
        background: 'radial-gradient(ellipse, rgba(250,204,21,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>

        {/* Section header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{
                display: 'inline-block', width: '7px', height: '7px',
                borderRadius: '50%', backgroundColor: '#10B981',
                boxShadow: '0 0 10px #10B981',
                animation: 'livePulse 1.8s ease-in-out infinite',
              }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Live Activity
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
              Transactions happening <span style={{ color: '#FACC15' }}>right now</span>
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#6B7280', maxWidth: '420px' }}>
              Every bundle purchase and delivery is tracked in real time across all networks.
            </p>
          </div>

          {/* Live counter badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.65rem 1.25rem',
            background: 'rgba(16,185,129,0.06)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: '12px',
          }}>
            <Zap size={16} style={{ color: '#10B981' }} />
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1 }}>
                {transactions.filter(t => t.status === 'success').length}
              </div>
              <div style={{ fontSize: '0.62rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '1px' }}>
                Delivered
              </div>
            </div>
          </div>
        </div>

        {/* Transaction list */}
        <div ref={listRef} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {transactions.map((tx) => {
            const nc = NETWORK_COLORS[tx.network];
            const sl = statusLabel(tx.status);
            const isNew = newIds.has(tx.id);

            return (
              <div
                key={tx.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.85rem 1.25rem',
                  background: isNew
                    ? 'rgba(250,204,21,0.04)'
                    : 'rgba(15, 23, 42, 0.5)',
                  border: `1px solid ${isNew ? 'rgba(250,204,21,0.2)' : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: '14px',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.4s ease',
                  animation: isNew ? 'slideInTx 0.4s ease' : 'none',
                  overflow: 'hidden',
                }}
              >
                {/* Network badge */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.2rem 0.7rem',
                  borderRadius: '8px',
                  background: nc.bg,
                  border: `1px solid ${nc.border}`,
                  flexShrink: 0,
                  minWidth: '90px',
                  justifyContent: 'center',
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: nc.dot, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: nc.text, whiteSpace: 'nowrap' }}>{tx.network}</span>
                </div>

                {/* Bundle info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap' }}>
                      {tx.bundle}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280', whiteSpace: 'nowrap' }}>→</span>
                    <span style={{ fontSize: '0.8rem', color: '#9CA3AF', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                      {tx.phone}
                    </span>
                  </div>
                </div>

                {/* Amount */}
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFFFFF', flexShrink: 0, textAlign: 'right' }}>
                  {tx.amount}
                </div>

                {/* Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0, minWidth: '90px', justifyContent: 'flex-end' }}>
                  {statusIcon(tx.status)}
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: sl.color }}>{sl.label}</span>
                </div>

                {/* Time ago */}
                <div style={{ fontSize: '0.68rem', color: '#4B5563', flexShrink: 0, minWidth: '55px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  {tx.timeAgo}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 10px #10B981; }
          50% { opacity: 0.6; transform: scale(1.35); box-shadow: 0 0 20px #10B981; }
        }
        @keyframes slideInTx {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
