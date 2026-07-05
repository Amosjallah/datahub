import React from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';

export default function Home() {
  const stats = [
    { value: '50K+', label: 'Happy Customers' },
    { value: '₵2M+', label: 'Processed Balance' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '3 sec', label: 'Avg. Delivery' },
  ];

  const services = [
    { title: 'DATA BUNDLES', icon: '📶' },
    { title: 'AIRTIME TOP-UP', icon: '📱' },
    { title: 'BILL PAYMENTS', icon: '💵' },
    { title: 'TV SUBSCRIPTIONS', icon: '📺' },
    { title: 'E-COMMERCE', icon: '🛒' },
    { title: 'GIFT CARDS', icon: '🎁' },
    { title: 'DIGITAL WALLET', icon: '💼' },
    { title: 'AGENCY SERVICES', icon: '👥' },
  ];

  const features = [
    { icon: '⚡', title: 'FAST', desc: 'We make everyday transactions simple, fast, and secure with 3-second delivery.' },
    { icon: '🔒', title: 'SECURE', desc: 'Your deposits and recharges are protected by banking-grade ledger databases.' },
    { icon: '🤝', title: 'RELIABLE', desc: 'A trusted partner for digital services and innovation, backed by 99.9% uptime SLA.' },
    { icon: '🎧', title: '24/7 SUPPORT', desc: 'Our dedicated customer success team is available round-the-clock to support you.' },
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section style={{ padding: '6rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div
            className="badge badge-blue"
            style={{ marginBottom: '1.5rem', display: 'inline-flex', gap: '0.5rem', padding: '0.35rem 1rem' }}
          >
            <span>🇬🇭</span> Connecting You to Digital Solutions
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 800, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
            FA DIGITAL <span style={{ color: 'var(--color-brand-primary)' }}>SERVICES LTD.</span>
          </h1>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '650px', margin: '0 auto 2rem', fontSize: '1.15rem', lineHeight: '1.6' }}>
            We provide reliable digital solutions that make everyday transactions simple, fast and secure. 
            Your trusted partner for digital services and innovation.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}>
            <Link href="/register" className="btn btn-primary btn-lg">
              ⚡ Start Now
            </Link>
            <Link href="/services" className="btn btn-secondary btn-lg">
              Our Services
            </Link>
          </div>

          {/* Stats Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {stats.map((stat, i) => (
              <div key={i} className="card" style={{ padding: '1.25rem' }}>
                <div
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    color: 'var(--color-brand-primary)',
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{ padding: '5rem 0', borderTop: '1px solid var(--color-border)', backgroundColor: '#FFFFFF', color: '#0D1B2A' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge" style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: '#0066FF', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Our Offerings</span>
            <h2 style={{ color: '#0D1B2A' }}>OUR SERVICES</h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
            }}
          >
            {services.map((svc, i) => (
              <Link href="/register" key={i} className="card" style={{ textDecoration: 'none', color: '#0D1B2A', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div className="card-body" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontSize: '2rem' }}>{svc.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.05em' }}>{svc.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section style={{ padding: '5rem 0', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-blue" style={{ textTransform: 'uppercase', marginBottom: '0.5rem' }}>Key Features</span>
            <h2>Why Choose FA Digital</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {features.map((feat, i) => (
              <div key={i} className="card" style={{ padding: '1.75rem' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-brand-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    marginBottom: '1rem',
                  }}
                >
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>{feat.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
