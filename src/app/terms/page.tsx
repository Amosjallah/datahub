import React from 'react';
import PublicLayout from '@/components/PublicLayout';

export default function Terms() {
  return (
    <PublicLayout>
      <section style={{ padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="badge badge-blue" style={{ textTransform: 'uppercase', marginBottom: '0.75rem' }}>Legal Agreement</span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Terms &amp; Conditions</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Last Updated: July 2, 2026</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--color-text-secondary)' }}>
            <div>
              <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '0.5rem', fontSize: '1.15rem' }}>1. Acceptance of Terms</h3>
              <p>By creating an account, depositing funds, or purchasing services on FA DIGITAL SERVICES LTD., you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.</p>
            </div>

            <div>
              <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '0.5rem', fontSize: '1.15rem' }}>2. Account Wallet &amp; Ledger</h3>
              <p>All user accounts contain a digital GHS wallet. The definitive balance of your wallet is determined by the chronological summation of transaction records inside our digital ledger database. Users are responsible for keeping login credentials and passwords secure.</p>
            </div>

            <div>
              <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '0.5rem', fontSize: '1.15rem' }}>3. Top-Up &amp; Payment Services</h3>
              <p>Recharge transactions are automatically sent to mobile networks (MTN, Telecel, AirtelTigo). Recharges are final and non-reversible. Please double-check recipient phone numbers before completing purchases. If a transaction fails to deliver from our side, your wallet will automatically be refunded.</p>
            </div>

            <div>
              <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '0.5rem', fontSize: '1.15rem' }}>4. KYC Verification</h3>
              <p>We may require users to complete standard Know Your Customer (KYC) processes to comply with local financial regulations. We reserve the right to limit transactions or block accounts that fail verification checks or demonstrate fraudulent activity.</p>
            </div>

            <div>
              <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '0.5rem', fontSize: '1.15rem' }}>5. Limitation of Liability</h3>
              <p>FA DIGITAL SERVICES LTD. is not responsible for any losses arising from incorrect input parameters (e.g. sending airtime to the wrong phone number) or temporary upstream network downtime from telecom providers.</p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
