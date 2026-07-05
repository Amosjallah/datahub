import React from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';

export default function Pricing() {
  const fallbackServices = [
    { network: 'MTN', name: 'MTN CG Data 5GB', retail: 20.00, agent: 18.50, api: 18.00 },
    { network: 'MTN', name: 'MTN CG Data 10GB', retail: 40.00, agent: 37.00, api: 36.00 },
    { network: 'Telecel', name: 'Telecel Data 5GB', retail: 18.00, agent: 17.00, api: 16.50 },
    { network: 'Telecel', name: 'Telecel Data 10GB', retail: 35.00, agent: 33.00, api: 32.00 },
    { network: 'AirtelTigo', name: 'AirtelTigo Data 5GB', retail: 15.00, agent: 14.00, api: 13.50 },
    { network: 'AirtelTigo', name: 'AirtelTigo Data 10GB', retail: 28.00, agent: 26.00, api: 25.00 },
  ];

  return (
    <PublicLayout>
      <section style={{ padding: '5rem 0' }}>
        <div className="container" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-blue" style={{ textTransform: 'uppercase', marginBottom: '0.5rem' }}>Transparent Rates</span>
          <h1 style={{ fontSize: '2.5rem' }}>Affordable Data &amp; Airtime Pricing</h1>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '550px', margin: '0.5rem auto 0' }}>
            Compare rates across networks. Become an Agent or API partner to unlock discounted pricing tiers.
          </p>
        </div>

        <div className="container">
          <div className="card" style={{ marginBottom: '2.5rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--color-border)', background: 'var(--color-bg-elevated)' }}>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-primary)' }}>Network</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-primary)' }}>Service / Package</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-primary)' }}>Retail Price (GHS)</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-primary)' }}>Agent Price (GHS)</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-primary)' }}>API Partner Price (GHS)</th>
                </tr>
              </thead>
              <tbody>
                {fallbackServices.map((svc, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)', transition: 'background var(--transition-fast)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span className={`badge ${svc.network === 'MTN' ? 'badge-warning' : svc.network === 'Telecel' ? 'badge-danger' : 'badge-blue'}`} style={{ fontSize: '0.75rem' }}>
                        {svc.network}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>{svc.name}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)' }}>₵{svc.retail.toFixed(2)}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-brand-primary)', fontWeight: 600 }}>₵{svc.agent.toFixed(2)}</td>
                    <td style={{ padding: '1rem 1.5rem', color: '#10B981', fontWeight: 600 }}>₵{svc.api.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem', color: 'var(--color-brand-primary)' }}>Save More as an Agent</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                Sign up as a reseller/agent to instantly enjoy lower wholesale pricing on airtime, data and utilities.
              </p>
              <Link href="/register?role=agent" className="btn btn-primary btn-sm">
                Apply for Agent Tier
              </Link>
            </div>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem', color: '#10B981' }}>Automate with our API</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                Integrate your app or web platform directly to our automated gateway for maximum discount and scalability.
              </p>
              <Link href="/api-docs" className="btn btn-secondary btn-sm">
                Read API Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
