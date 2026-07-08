'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';
import { Network, Receipt, GraduationCap, Radio, Tv, ShieldCheck, ChevronRight } from 'lucide-react';

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'telecom' | 'utilities' | 'education'>('all');

  const servicesData = [
    { 
      category: 'telecom',
      title: 'MTN Data Bundles', 
      desc: 'High-speed MTN corporate gifting, SME, and Turbo bundles. Activated on recipients\' lines in 3 seconds.', 
      icon: '🟡', 
      netName: 'MTN Ghana',
      badgeColor: '#FFCC00', 
      badgeText: '#000',
      bg: 'rgba(255, 204, 0, 0.06)' 
    },
    { 
      category: 'telecom',
      title: 'Telecel Data Bundles', 
      desc: 'Instant internet packages for Telecel mobile numbers, prepaid SIMs, and router devices.', 
      icon: '🔴', 
      netName: 'Telecel GH',
      badgeColor: '#E4062C', 
      badgeText: '#FFF',
      bg: 'rgba(228, 6, 44, 0.06)' 
    },
    { 
      category: 'telecom',
      title: 'AirtelTigo Data bundles', 
      desc: 'Fast, discounted AT data packages. Real-time ledger confirmations with instant delivery feedback.', 
      icon: '🔵', 
      netName: 'AirtelTigo',
      badgeColor: '#0057A0', 
      badgeText: '#FFF',
      bg: 'rgba(0, 87, 160, 0.06)' 
    },
    { 
      category: 'telecom',
      title: 'Airtime Top-Up', 
      desc: 'Top up phone credits instantly for MTN, Telecel, and AirtelTigo lines. Bulk top-up available for agents.', 
      icon: '📱', 
      netName: 'All Networks',
      badgeColor: 'var(--color-brand-primary)', 
      badgeText: '#FFF',
      bg: 'rgba(59, 130, 246, 0.06)' 
    },
    { 
      category: 'utilities',
      title: 'ECG Electricity Bills', 
      desc: 'Purchase prepaid smart meter tokens or settle ECG postpaid electricity bills securely from your wallet.', 
      icon: '⚡', 
      netName: 'Power Utility',
      badgeColor: '#F59E0B', 
      badgeText: '#FFF',
      bg: 'rgba(245, 158, 11, 0.06)' 
    },
    { 
      category: 'utilities',
      title: 'Ghana Water (GWCL)', 
      desc: 'Settle monthly domestic and commercial Ghana Water Company bills. Instant confirmation updates.', 
      icon: '💧', 
      netName: 'Water Utility',
      badgeColor: '#0EA5E9', 
      badgeText: '#FFF',
      bg: 'rgba(14, 165, 233, 0.06)' 
    },
    { 
      category: 'utilities',
      title: 'TV Subscriptions', 
      desc: 'Renew DStv, GOtv, and StarTimes TV packages in real-time. Keep screen viewing active without delay.', 
      icon: '📺', 
      netName: 'Satellite TV',
      badgeColor: '#EF4444', 
      badgeText: '#FFF',
      bg: 'rgba(239, 68, 68, 0.06)' 
    },
    { 
      category: 'education',
      title: 'WAEC Result Checkers', 
      desc: 'Acquire BECE, WASSCE, NABTEB, and university application voucher checkers PINs instantly via email/SMS.', 
      icon: '🎓', 
      netName: 'WAEC / Education',
      badgeColor: '#8B5CF6', 
      badgeText: '#FFF',
      bg: 'rgba(139, 92, 246, 0.06)' 
    },
  ];

  const filteredServices = selectedCategory === 'all' 
    ? servicesData 
    : servicesData.filter(s => s.category === selectedCategory);

  return (
    <PublicLayout>
      {/* Header */}
      <section style={{ padding: '6.5rem 0 3.5rem', background: 'radial-gradient(120% 120% at 50% -20%, rgba(0, 102, 255, 0.04) 0%, rgba(255, 255, 255, 0) 100%)', textAlign: 'center' }}>
        <div className="container animate-fade-up" style={{ maxWidth: '800px' }}>
          <span className="badge badge-blue" style={{ textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>What We Offer</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Fully Automated <span className="text-gradient">Utility Gateway</span>
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Acquire cheap internet plans, voice minutes, education result cards, and pay bills in seconds using our integrated payment APIs.
          </p>
        </div>
      </section>

      {/* Gateway status panel */}
      <section style={{ padding: '0 0 2rem' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div className="card glass-panel animate-fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 2rem', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.15)', background: 'rgba(16, 185, 129, 0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              {/* Green pulsing dot */}
              <span style={{ display: 'relative', width: '12px', height: '12px' }}>
                <span style={{ position: 'absolute', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981', opacity: 0.75, animation: 'pulse 1.8s infinite' }}></span>
                <span style={{ display: 'block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981' }}></span>
              </span>
              <div>
                <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>All APIs Operational</span>
                <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>Average transaction delivery: 3.2 seconds.</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: '#10B981' }}>
              <ShieldCheck size={18} /> Verified Secure
            </div>
          </div>
        </div>
      </section>

      {/* Category selector tabs */}
      <section style={{ padding: '1rem 0 3rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Services', icon: '⚡' },
            { id: 'telecom', label: 'Data & Airtime', icon: '📶' },
            { id: 'utilities', label: 'Bills & TV', icon: '🔌' },
            { id: 'education', label: 'Edu Pin Cards', icon: '🎓' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              style={{
                padding: '0.65rem 1.35rem',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: selectedCategory === cat.id ? 'var(--color-brand-primary)' : 'var(--color-bg-surface)',
                color: selectedCategory === cat.id ? '#FFFFFF' : 'var(--color-text-secondary)',
                border: selectedCategory === cat.id ? '1.5px solid var(--color-brand-primary)' : '1.5px solid var(--color-border)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: selectedCategory === cat.id ? 'var(--shadow-sm)' : 'none'
              }}
              className="hover-scale"
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', minHeight: '300px' }}>
          {filteredServices.map((svc, i) => (
            <div key={i} className="card hover-scale" style={{ border: '1px solid var(--color-border)', borderRadius: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.25rem' }}>
                
                {/* Header row: Icon & Carrier tag */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: svc.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                    }}
                  >
                    {svc.icon}
                  </div>
                  <span 
                    style={{ 
                      fontSize: '0.72rem', 
                      fontWeight: 800, 
                      padding: '0.3rem 0.65rem', 
                      borderRadius: '8px', 
                      backgroundColor: svc.badgeColor, 
                      color: svc.badgeText,
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em'
                    }}
                  >
                    {svc.netName}
                  </span>
                </div>
                
                {/* Information */}
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>{svc.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0 }}>{svc.desc}</p>
                </div>
                
                {/* Get started link button */}
                <Link 
                  href="/register" 
                  className="btn btn-secondary btn-sm hover-scale" 
                  style={{ 
                    marginTop: 'auto', 
                    borderRadius: '10px', 
                    fontWeight: 700, 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '0.35rem',
                    width: '100%'
                  }}
                >
                  Acquire Instantly <ChevronRight size={14} />
                </Link>

              </div>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
