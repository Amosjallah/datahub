import React from 'react';
import PublicLayout from '@/components/PublicLayout';

export default function About() {
  return (
    <PublicLayout>
      <section style={{ padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="badge badge-blue" style={{ textTransform: 'uppercase', marginBottom: '0.75rem' }}>Our Story</span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Connecting Ghanaians to Instant Utility Services</h1>
          
          <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '1.5rem', color: 'var(--color-text-secondary)' }}>
            FA DIGITAL SERVICES LTD. is Ghana's leading virtual top-up (VTU) and bills payment reselling platform. Headquartered in Accra, we specialize in delivering instant and secure digital utility services across all major carriers in Ghana including MTN, Telecel, and AirtelTigo.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', margin: '2.5rem 0' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🎯</div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Our Mission</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                To provide the fastest, safest, and most convenient digital recharge and payment platform for everyday consumers and reseller agents in Ghana.
              </p>
            </div>
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>👁️</div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Our Vision</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                To become the undisputed premier gateway for digital utility transaction rails in West Africa, powering both individual and business payments.
              </p>
            </div>
          </div>

          <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Why We Are Different</h2>
          <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-secondary)' }}>
            Unlike other top-up systems, we operate a fully ledger-centric balance system. That means every single GHS ₵1 you deposit is backed by automated double-entry ledger audits. If an automated upstream provider fails to fulfill your data bundle, our system triggers an instant automated refund back to your wallet ledger. No delays, no manual disputes, and no lost funds.
          </p>

          <div className="card" style={{ background: 'var(--color-brand-subtle)', borderColor: 'var(--color-brand-muted)', padding: '1.75rem', marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-brand-primary)' }}>Join 50,000+ Happy Customers</h3>
            <p style={{ fontSize: '0.95rem', marginBottom: '1.25rem', color: 'var(--color-text-secondary)' }}>
              Ready to experience instant recharges? Create an account in less than 30 seconds.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="/register" className="btn btn-primary btn-sm">Create Free Account</a>
              <a href="/become-agent" className="btn btn-secondary btn-sm">Become a Reseller</a>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
