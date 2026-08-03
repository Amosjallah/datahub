'use client';

import React, { useState, useEffect } from 'react';
import { Zap, X, CheckCircle2, ShoppingBag } from 'lucide-react';
import { TransactionEvent, subscribeToTransactions, generateSimulatedTransaction } from '@/lib/liveTransactions';

const NETWORK_BADGES: Record<string, { bg: string; text: string; border: string }> = {
  MTN: { bg: 'rgba(250,204,21,0.15)', text: '#FACC15', border: 'rgba(250,204,21,0.3)' },
  Telecel: { bg: 'rgba(239,68,68,0.15)', text: '#F87171', border: 'rgba(239,68,68,0.3)' },
  AirtelTigo: { bg: 'rgba(6,182,212,0.15)', text: '#22D3EE', border: 'rgba(6,182,212,0.3)' },
};

export default function LiveTransactionToast() {
  const [toast, setToast] = useState<TransactionEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show a sample transaction 3 seconds after page loads
    const initialTimer = setTimeout(() => {
      if (!dismissed) {
        showToast(generateSimulatedTransaction());
      }
    }, 3500);

    // Periodic simulation every 12 to 18 seconds if user hasn't closed manually
    const simulationInterval = setInterval(() => {
      if (!dismissed && !visible) {
        showToast(generateSimulatedTransaction());
      }
    }, Math.floor(Math.random() * 6000) + 12000);

    // Subscribe to real live transactions
    const unsubscribe = subscribeToTransactions((newTx) => {
      showToast(newTx);
    });

    return () => {
      clearTimeout(initialTimer);
      clearInterval(simulationInterval);
      unsubscribe();
    };
  }, [dismissed, visible]);

  const showToast = (tx: TransactionEvent) => {
    setToast(tx);
    setVisible(true);

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      setVisible(false);
    }, 6000);
  };

  if (!toast || !visible) return null;

  const badge = NETWORK_BADGES[toast.network] || NETWORK_BADGES.MTN;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.75rem',
        left: '1.75rem',
        zIndex: 9998,
        maxWidth: '380px',
        width: 'calc(100vw - 3.5rem)',
        animation: 'toastSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #0B1120 100%)',
          border: '1px solid rgba(250, 204, 21, 0.25)',
          borderRadius: '16px',
          padding: '0.85rem 1rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(250, 204, 21, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          backdropFilter: 'blur(12px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top subtle highlight line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, #FACC15, #10B981)',
          }}
        />

        {/* Icon Avatar */}
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(250,204,21,0.2), rgba(16,185,129,0.15))',
            border: '1px solid rgba(250,204,21,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: '#FACC15',
          }}
        >
          <ShoppingBag size={20} />
        </div>

        {/* Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF', whiteSpace: 'nowrap' }}>
              {toast.name}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>just bought</span>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                padding: '0.1rem 0.4rem',
                borderRadius: '6px',
                background: badge.bg,
                color: badge.text,
                border: `1px solid ${badge.border}`,
              }}
            >
              {toast.network}
            </span>
          </div>

          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FACC15', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {toast.bundle}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '3px' }}>
            <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
              <CheckCircle2 size={11} /> Delivered
            </span>
            <span style={{ fontSize: '0.68rem', color: '#6B7280' }}>• {toast.amount}</span>
            <span style={{ fontSize: '0.68rem', color: '#4B5563', marginLeft: 'auto' }}>just now</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            setVisible(false);
            setDismissed(true);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#6B7280',
            cursor: 'pointer',
            padding: '0.2rem',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s',
          }}
          title="Dismiss"
        >
          <X size={15} />
        </button>
      </div>

      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
