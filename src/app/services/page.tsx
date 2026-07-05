import React from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';

export default function Services() {
  const serviceList = [
    { title: 'MTN Data Bundles', desc: 'High-speed MTN internet data bundles, including CG, SME, and Turbo bundles. Delivered in 3 seconds.', icon: '🟡', bg: 'rgba(255, 204, 0, 0.1)' },
    { title: 'Telecel Data Bundles', desc: 'Instant top-up for Telecel internet data packages (formerly Vodafone) for all phone lines and routers.', icon: '🔴', bg: 'rgba(228, 6, 44, 0.1)' },
    { title: 'AirtelTigo Data', desc: 'Fast and reliable AirtelTigo internet data bundles. Simple activation and real-time processing.', icon: '🔵', bg: 'rgba(0, 87, 160, 0.1)' },
    { title: 'Airtime Top-Up', desc: 'Load credit directly to any MTN, Telecel, or AirtelTigo line. Avoid manual voucher scratch cards.', icon: '📱', bg: 'rgba(59, 130, 246, 0.1)' },
    { title: 'ECG Electricity Bills', desc: 'Pay for your ECG postpaid bills or buy prepaid tokens instantly using your mobile money wallet.', icon: '⚡', bg: 'rgba(245, 158, 11, 0.1)' },
    { title: 'Ghana Water (GWCL)', desc: 'Settle your monthly water bills quickly. Real-time confirmation directly linked to GWCL systems.', icon: '💧', bg: 'rgba(14, 165, 233, 0.1)' },
    { title: 'TV Subscriptions', desc: 'Instantly renew your DStv, GOtv, or StarTimes satellite TV packages. Keep your family entertained.', icon: '📺', bg: 'rgba(239, 68, 68, 0.1)' },
    { title: 'WAEC & Edu PINs', desc: 'Buy result checker PINs for BECE, WASSCE, or Nov/Dec exams, as well as university application vouchers.', icon: '🎓', bg: 'rgba(139, 92, 246, 0.1)' },
  ];

  return (
    <PublicLayout>
      <section style={{ padding: '5rem 0' }}>
        <div className="container" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-blue" style={{ textTransform: 'uppercase', marginBottom: '0.5rem' }}>Our Range</span>
          <h1 style={{ fontSize: '2.5rem' }}>Services We Provide</h1>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '550px', margin: '0.5rem auto 0' }}>
            All major digital utility services in Ghana are covered. Recharge, subscribe, or pay instantly.
          </p>
        </div>

        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
          {serviceList.map((svc, i) => (
            <div key={i} className="card">
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    background: svc.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    marginBottom: '1rem',
                  }}
                >
                  {svc.icon}
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{svc.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', flexGrow: 1 }}>{svc.desc}</p>
                <Link href="/register" className="btn btn-secondary btn-sm btn-full" style={{ marginTop: 'auto' }}>
                  Get Started
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
