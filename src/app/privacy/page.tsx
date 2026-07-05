import React from 'react';
import PublicLayout from '@/components/PublicLayout';

export default function Privacy() {
  return (
    <PublicLayout>
      <section style={{ padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="badge badge-blue" style={{ textTransform: 'uppercase', marginBottom: '0.75rem' }}>Data Protection</span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Privacy Policy</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Last Updated: July 2, 2026</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--color-text-secondary)' }}>
            <div>
              <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '0.5rem', fontSize: '1.15rem' }}>1. Information We Collect</h3>
              <p>We collect personal information necessary to deliver VTU recharges and process payments, including: your name, email address, phone number, payment details, and KYC documents (when required).</p>
            </div>

            <div>
              <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '0.5rem', fontSize: '1.15rem' }}>2. How We Use Your Data</h3>
              <p>We use your information to secure your account, process recharges, settle bill payments, detect and prevent fraud, and provide technical customer support.</p>
            </div>

            <div>
              <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '0.5rem', fontSize: '1.15rem' }}>3. Data Security</h3>
              <p>Every transaction, ledger transfer, and personal information request is encrypted using standard Secure Socket Layer (SSL) protocols. We restrict access to your private data to authorized internal staff only.</p>
            </div>

            <div>
              <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '0.5rem', fontSize: '1.15rem' }}>4. Cookies</h3>
              <p>We use cookies to keep you signed in, remember your dashboard view preferences, and analyze website traffic to optimize load times.</p>
            </div>

            <div>
              <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '0.5rem', fontSize: '1.15rem' }}>5. Contacting Us</h3>
              <p>If you have any questions about this Privacy Policy or wish to request data deletion, you can reach out via the email address on our contact page.</p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
