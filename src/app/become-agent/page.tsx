import React from 'react';
import PublicLayout from '@/components/PublicLayout';

export default function BecomeAgent() {
  const benefits = [
    { icon: '💰', title: 'Higher Margins', desc: 'Get discounts of up to 5-10% on data bundles and 3-5% on airtime top-ups.' },
    { icon: '📊', title: 'Sales Dashboard', desc: 'Track your orders, revenue, and daily commissions in real time from a dedicated dashboard.' },
    { icon: '👥', title: 'Quick Contacts', desc: 'Save frequent customer numbers for one-click recharge cycles to speed up your sales.' },
  ];

  return (
    <PublicLayout>
      <section style={{ padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-blue" style={{ textTransform: 'uppercase', marginBottom: '1rem' }}>Grow with Us</span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Earn Commissions as a VTU Reseller</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
            Unlock discounted agent pricing rates and run your business from a premium digital dashboard.
          </p>
        </div>

        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
          {benefits.map((benefit, i) => (
            <div key={i} className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{benefit.icon}</div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{benefit.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{benefit.desc}</p>
            </div>
          ))}
        </div>

        <div className="container" style={{ maxWidth: '720px' }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', textAlign: 'center' }}>How It Works</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-brand-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>1</div>
              <div>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>Sign Up as an Agent</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Create your free reseller account using the agent signup form link below.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-brand-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>2</div>
              <div>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>Fund Your Wallet</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Deposit funds securely into your wallet using Mobile Money (MTN, Telecel, AT) or a card.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-brand-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>3</div>
              <div>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>Sell and Earn</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Process transactions for your customers. Your balance is debited at agent rates, and you keep the profit immediately!</p>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '2.5rem', textAlign: 'center', background: 'linear-gradient(135deg, var(--color-brand-subtle), rgba(29, 78, 216, 0.05))' }}>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.4rem' }}>Start Your Reseller Business Today</h3>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem', fontSize: '0.95rem' }}>
              No setup fees or application approvals required. Get activated instantly.
            </p>
            <a href="/register?role=agent" className="btn btn-primary btn-lg">Apply as Reseller Agent</a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
