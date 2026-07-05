import React from 'react';
import PublicLayout from '@/components/PublicLayout';

export default function ApiDocs() {
  return (
    <PublicLayout>
      <section style={{ padding: '5rem 0' }}>
        <div className="container" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-blue" style={{ textTransform: 'uppercase', marginBottom: '0.5rem' }}>Developer Portal</span>
          <h1 style={{ fontSize: '2.5rem' }}>Automate with our REST API</h1>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '550px', margin: '0.5rem auto 0' }}>
            Connect your website or mobile application to our high-performance VTU rails.
          </p>
        </div>

        <div className="container" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Authentication</h2>
            <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem', color: 'var(--color-text-secondary)' }}>
              Authenticate your API requests by including your Secret Key as a bearer token in the headers of your HTTP requests. You can generate your Secret API Key in the settings section of your developer dashboard.
            </p>
            <div className="card" style={{ padding: '1rem', background: '#070D1A', fontFamily: 'monospace', fontSize: '0.85rem', borderColor: 'rgba(59, 130, 246, 0.2)', marginBottom: '2rem' }}>
              <span style={{ color: '#64748B' }}>Authorization: Bearer fa_sec_live_...</span>
            </div>

            <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>1. Check Wallet Balance</h2>
            <p style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>
              Retrieve the available cash balance of your reseller account.
            </p>
            <div className="card" style={{ padding: '1rem', background: '#070D1A', fontFamily: 'monospace', fontSize: '0.85rem', borderColor: 'rgba(59, 130, 246, 0.2)', marginBottom: '2rem' }}>
              <span style={{ color: '#10B981' }}>GET</span> /api/v1/wallet/balance
            </div>

            <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>2. Purchase Data Bundle / Airtime</h2>
            <p style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>
              Initiate a VTU top-up transaction.
            </p>
            <div className="card" style={{ padding: '1rem', background: '#070D1A', fontFamily: 'monospace', fontSize: '0.85rem', borderColor: 'rgba(59, 130, 246, 0.2)', marginBottom: '1rem' }}>
              <span style={{ color: '#3B82F6' }}>POST</span> /api/v1/transaction/purchase
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              Required parameters: `service_id` (integer), `recipient` (string), and `request_id` (unique string for idempotency checks).
            </p>

            <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>3. Query Transaction Status</h2>
            <p style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>
              Retrieve status of a transaction using your local request identifier.
            </p>
            <div className="card" style={{ padding: '1rem', background: '#070D1A', fontFamily: 'monospace', fontSize: '0.85rem', borderColor: 'rgba(59, 130, 246, 0.2)', marginBottom: '2rem' }}>
              <span style={{ color: '#10B981' }}>GET</span> /api/v1/transaction/status/{"{request_id}"}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>API Details</h3>
              <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Format:</span>
                  <span style={{ fontWeight: 600 }}>JSON</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Base URL:</span>
                  <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>https://api.fadigitalservices.com</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Rate Limit:</span>
                  <span style={{ fontWeight: 600 }}>60 req / min</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', background: 'var(--color-brand-subtle)', borderColor: 'var(--color-brand-muted)' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--color-brand-primary)' }}>Looking for SDKs?</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                We support PHP, Node.js, and Python integration wrappers out of the box.
              </p>
              <a href="/contact" className="btn btn-primary btn-sm btn-full">Request SDK Access</a>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
