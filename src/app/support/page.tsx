'use client';

import React from 'react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';

export default function SupportIndex() {
  const tickets = [
    { id: 'TKT-9941', subject: 'Wallet not credited via MTN MoMo', status: 'open', date: '1 hour ago', category: 'wallet' },
    { id: 'TKT-8280', subject: 'Refund confirmation request', status: 'resolved', date: '3 days ago', category: 'refund' },
  ];

  return (
    <AppLayout userName="Kwame Mensah" userRole="customer">
      <div className="animate-fade-up">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.2rem' }}>💬 Support Portal</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Open a ticket or contact us via instant channels.</p>
          </div>
          <Link href="/support/create" className="btn btn-primary btn-sm" id="btn-new-ticket">
            + New Ticket
          </Link>
        </div>

        {/* WhatsApp & Email Quick Help */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginBottom: '1.75rem' }}>
          <a
            href="https://wa.me/233241234567"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '1.1rem',
              background: 'rgba(16,185,129,0.06)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
            }}
          >
            <div style={{ fontSize: '1.75rem' }}>💬</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#34D399' }}>WhatsApp Support</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>Chat directly with support agents</div>
            </div>
          </a>
          <a
            href="mailto:info@fadigitalservices.com"
            style={{
              padding: '1.1rem',
              background: 'rgba(59,130,246,0.06)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
            }}
          >
            <div style={{ fontSize: '1.75rem' }}>✉️</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-brand-light)' }}>Email Us</div>
               <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>info@fadigitalservices.com</div>
            </div>
          </a>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)' }}>My Tickets</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{tickets.length} total</span>
        </div>

        {/* Tickets List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {tickets.map((t) => (
            <div key={t.id} className="card">
              <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: t.status === 'open' ? 'var(--color-warning-bg)' : 'var(--color-success-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                }}>
                  {t.status === 'open' ? '🔓' : '✅'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.subject}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                    #{t.id} &middot; Opened {t.date} &middot; Category: {t.category}
                  </div>
                </div>
                <span className={`badge ${t.status === 'open' ? 'badge-warning' : 'badge-success'}`}>
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
