'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';
import { 
  BarChart2, PhoneCall, Receipt, GraduationCap, 
  Zap, ShieldCheck, Headphones, Contact, ArrowRight,
  Tv, Award, ChevronRight
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'data' | 'airtime'>('data');
  const [selectedNetwork, setSelectedNetwork] = useState<'MTN' | 'AirtelTigo' | 'Glo' | '9mobile'>('MTN');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedBundle, setSelectedBundle] = useState('10GB - GH₵ 70.00');
  const [airtimeAmount, setAirtimeAmount] = useState('20.00');

  // Handle price calculations based on selections
  const getPriceValue = () => {
    if (activeTab === 'airtime') {
      return parseFloat(airtimeAmount || '0').toFixed(2);
    }
    const match = selectedBundle.match(/GH₵\s*([\d.]+)/);
    return match ? parseFloat(match[1]).toFixed(2) : '70.00';
  };

  const getPriceNum = () => {
    return getPriceValue();
  };

  const dataBundles = [
    '2GB - GH₵ 15.00',
    '5GB - GH₵ 35.00',
    '10GB - GH₵ 70.00',
    '20GB - GH₵ 130.00',
    '50GB - GH₵ 300.00'
  ];

  const services = [
    { 
      title: 'Data bundles', 
      desc: 'High-speed, cheap internet data plans for MTN, Telecel, and AirtelTigo lines.', 
      link: '/register', 
      linkLabel: 'Buy data',
      icon: BarChart2,
      color: '#0066FF',
      bgColor: 'rgba(0, 102, 255, 0.06)'
    },
    { 
      title: 'Airtime top-up', 
      desc: 'Direct mobile top-ups processed in seconds. Earn commissions on purchases.', 
      link: '/register', 
      linkLabel: 'Top up now',
      icon: PhoneCall,
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.06)'
    },
    { 
      title: 'Bill payments', 
      desc: 'Avoid late fee penalties. Pay DStv, GOtv, ECG pre-paid and postpaid utility bills instantly.', 
      link: '/register', 
      linkLabel: 'Pay bills',
      icon: Receipt,
      color: '#F59E0B',
      bgColor: 'rgba(245, 158, 11, 0.06)'
    },
    { 
      title: 'Result checkers', 
      desc: 'Direct educational PIN portals for WAEC, BECE, WASSCE, and university checkers.', 
      link: '/register', 
      linkLabel: 'Check results',
      icon: GraduationCap,
      color: '#8B5CF6',
      bgColor: 'rgba(139, 92, 246, 0.06)'
    },
    { 
      title: 'TV Subscriptions', 
      desc: 'Renew StarTimes, DStv, and GOtv subscriptions instantly without manual intervention.', 
      link: '/register', 
      linkLabel: 'Renew TV',
      icon: Tv,
      color: '#EF4444',
      bgColor: 'rgba(239, 68, 68, 0.06)'
    },
    { 
      title: 'Reseller program', 
      desc: 'Become a reseller. Access heavily discounted rates and boost your daily VTU business revenue.', 
      link: '/become-agent', 
      linkLabel: 'Become agent',
      icon: Award,
      color: '#D97706',
      bgColor: 'rgba(217, 119, 6, 0.06)'
    }
  ];

  const features = [
    { 
      icon: Zap, 
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.06)',
      title: 'Ledger-backed Delivery', 
      desc: 'Every recharge is backed by double-entry ledger security. If an order fails, get an instant automatic refund.' 
    },
    { 
      icon: ShieldCheck, 
      color: '#0066FF',
      bgColor: 'rgba(0, 102, 255, 0.06)',
      title: 'High-grade Encryption', 
      desc: 'Transactions are fully encrypted using TLS 1.3 standards. Rest assured your credit and data are 100% secure.' 
    },
    { 
      icon: Headphones, 
      color: '#8B5CF6',
      bgColor: 'rgba(139, 92, 246, 0.06)',
      title: 'Dedicated 24/7 Support', 
      desc: 'Reach out through call, live WhatsApp chat, or dashboard support tickets for rapid resolution.' 
    }
  ];

  const liveTransactions = [
    { loc: 'Kumasi', phone: '055 ••• 4567', detail: '5GB', net: 'MTN' },
    { loc: 'Accra', phone: '024 ••• 6543', detail: '10GB', net: 'AirtelTigo' },
    { loc: 'Takoradi', phone: '054 ••• 8910', detail: '2GB', net: 'Glo' },
    { loc: 'Tamale', phone: '020 ••• 1122', detail: '₵ 50.00 Airtime', net: 'Telecel' },
    { loc: 'Tema', phone: '059 ••• 3344', detail: '20GB', net: 'MTN' },
    { loc: 'Cape Coast', phone: '027 ••• 5566', detail: '5GB', net: 'AirtelTigo' }
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section style={{ padding: '6.5rem 0 5rem', background: 'radial-gradient(120% 120% at 50% -20%, rgba(0, 102, 255, 0.04) 0%, rgba(255, 255, 255, 0) 100%)', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle grid lines in background */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.8, pointerEvents: 'none' }}></div>
        
        <div className="container hero-grid" style={{ position: 'relative', zIndex: 2 }}>
          
          {/* Left Column: Hero Text */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} className="animate-fade-up">
            <div
              style={{
                marginBottom: '1.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 1.15rem',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.15)',
                color: '#D97706',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.02em'
              }}
            >
              <span>⭐</span> Ghana's #1 Automated VTU Gateway
            </div>
            
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.6rem)', fontWeight: 900, color: 'var(--color-text-primary)', lineHeight: '1.15', marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
              Instant Data Topups.<br />
              <span className="text-gradient">Fast & Secure.</span>
            </h1>
            
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '520px', fontSize: '1.05rem', lineHeight: '1.65', marginBottom: '2.5rem' }}>
              Recharge internet data bundles, purchase airtime VTU, renew television subscriptions, and pay utility bills in 3 seconds. Direct integrations with all networks.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem', width: '100%' }}>
              <Link href="/register" className="btn btn-primary btn-lg hover-scale" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FFF' }}>
                Create free account <ArrowRight size={18} />
              </Link>
              <Link href="/services" className="btn btn-secondary btn-lg hover-scale" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span>🎛️</span> Browse services
              </Link>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', width: '100%', maxWidth: '520px', borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-brand-primary)' }}>2.4M+</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Transactions</div>
              </div>
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#10B981' }}>99.9%</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Uptime rate</div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#8B5CF6' }}>18K+</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Agent network</div>
              </div>
            </div>
          </div>

          {/* Right Column: High Fidelity Purchase Widget */}
          <div className="card glass-panel" style={{ borderRadius: '24px', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', border: '1px solid rgba(0, 102, 255, 0.08)' }}>
            
            {/* Widget Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', backgroundColor: 'rgba(248, 250, 252, 0.5)', padding: '0.35rem' }}>
              <button
                type="button"
                onClick={() => setActiveTab('data')}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  border: 'none',
                  borderRadius: '16px',
                  background: activeTab === 'data' ? '#FFFFFF' : 'transparent',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: activeTab === 'data' ? 'var(--color-brand-primary)' : 'var(--color-text-muted)',
                  boxShadow: activeTab === 'data' ? 'var(--shadow-sm)' : 'none',
                  transition: 'all var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <span>📶</span> Buy data
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('airtime')}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  border: 'none',
                  borderRadius: '16px',
                  background: activeTab === 'airtime' ? '#FFFFFF' : 'transparent',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: activeTab === 'airtime' ? 'var(--color-brand-primary)' : 'var(--color-text-muted)',
                  boxShadow: activeTab === 'airtime' ? 'var(--shadow-sm)' : 'none',
                  transition: 'all var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <span>📱</span> Airtime VTU
              </button>
            </div>

            {/* Widget Form Body */}
            <div style={{ padding: '2rem' }}>
              
              {/* Select Network Operator */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.65rem' }}>Select network</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {[
                    { key: 'MTN', color: '#FFCC00', text: '#000', label: 'MTN' },
                    { key: 'AirtelTigo', color: '#E60000', text: '#FFF', label: 'AT' },
                    { key: 'Glo', color: '#00A859', text: '#FFF', label: 'Glo' },
                    { key: '9mobile', color: '#005743', text: '#FFF', label: '9mob' }
                  ].map((net) => {
                    const isSel = selectedNetwork === net.key;
                    return (
                      <button
                        key={net.key}
                        type="button"
                        onClick={() => setSelectedNetwork(net.key as any)}
                        style={{
                          padding: '0.75rem 0',
                          borderRadius: '12px',
                          border: isSel ? `2px solid ${net.color}` : '1.5px solid var(--color-border)',
                          backgroundColor: isSel ? net.color : '#FFFFFF',
                          color: isSel ? net.text : 'var(--color-text-secondary)',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          textAlign: 'center',
                          boxShadow: isSel ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
                          transition: 'all var(--transition-fast)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.15rem'
                        }}
                      >
                        <span style={{ fontSize: '0.9rem' }}>
                          {net.key === 'MTN' ? '🟡' : net.key === 'AirtelTigo' ? '🔴' : net.key === 'Glo' ? '🟢' : '🛜'}
                        </span>
                        {net.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Phone number */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.65rem' }}>Phone number</label>
                <div style={{ display: 'flex', border: '1.5px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden', alignItems: 'center', background: '#FFF', boxShadow: 'var(--shadow-sm)' }}>
                  {/* Country Prefix selection */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0 0.85rem', background: 'var(--color-bg-elevated)', borderRight: '1.5px solid var(--color-border)', height: '48px', fontSize: '0.875rem', fontWeight: 700 }}>
                    <span>🇬🇭</span>
                    <span>+233</span>
                  </div>
                  {/* Input field */}
                  <input
                    type="tel"
                    placeholder="55 123 4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      padding: '0.5rem 1rem',
                      fontSize: '1rem',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      letterSpacing: '0.05em'
                    }}
                  />
                  {/* Address Book Icon */}
                  <button type="button" style={{ background: 'none', border: 'none', padding: '0 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-brand-primary)' }}>
                    <Contact size={18} />
                  </button>
                </div>
              </div>

              {/* Select Bundle OR Airtime Amount */}
              {activeTab === 'data' ? (
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.65rem' }}>Select bundle plan</label>
                  <select
                    value={selectedBundle}
                    onChange={(e) => setSelectedBundle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.15rem',
                      borderRadius: '12px',
                      border: '1.5px solid var(--color-border)',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {dataBundles.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.65rem' }}>Amount (GH₵)</label>
                  <input
                    type="number"
                    value={airtimeAmount}
                    onChange={(e) => setAirtimeAmount(e.target.value)}
                    placeholder="20.00"
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.15rem',
                      borderRadius: '12px',
                      border: '1.5px solid var(--color-border)',
                      fontSize: '1rem',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      outline: 'none',
                      boxSizing: 'border-box',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  />
                </div>
              )}

              {/* Price Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>You pay</span>
                <span style={{ fontSize: '1.95rem', fontWeight: 900, color: 'var(--color-brand-primary)', fontFamily: 'monospace' }}>GH₵ {getPriceNum()}</span>
              </div>

              {/* Buy Now Button */}
              <Link
                href="/register"
                className="btn btn-full hover-scale"
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  backgroundColor: '#00C853',
                  color: '#FFFFFF',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 6px 20px rgba(0, 200, 83, 0.25)',
                  textDecoration: 'none'
                }}
              >
                <span>⚡</span> Buy now
              </Link>

            </div>

          </div>

        </div>
      </section>

      {/* Live transactions bar */}
      <section style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', background: '#FFFFFF', padding: '1rem 0', overflow: 'hidden' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '0.8rem', color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block', boxShadow: '0 0 8px #10B981' }}></span>
            Live operations
          </div>
          
          <div style={{ height: '20px', width: '1px', backgroundColor: 'var(--color-border)' }}></div>

          {/* Scrolling Marquee */}
          <div className="marquee-container" style={{ flex: 1 }}>
            <div className="marquee-content" style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
              {liveTransactions.concat(liveTransactions).map((tx, idx) => (
                <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>{tx.loc}</span>
                  <span style={{ color: 'var(--color-text-subtle)' }}>•</span>
                  <span style={{ fontFamily: 'monospace' }}>{tx.phone}</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>obtained</span>
                  <span style={{ color: 'var(--color-brand-primary)', fontWeight: 800 }}>{tx.detail}</span>
                  <span style={{ color: 'var(--color-text-subtle)' }}>via</span>
                  <span style={{ 
                    color: tx.net === 'MTN' ? '#D97706' : tx.net === 'AirtelTigo' ? '#EF4444' : '#10B981', 
                    fontWeight: 800 
                  }}>{tx.net}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{ padding: '7rem 0', background: '#FFFFFF' }}>
        <div className="container">
          
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <span style={{ color: 'var(--color-brand-primary)', textTransform: 'uppercase', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.12em', display: 'block', marginBottom: '0.75rem' }}>Our utilities</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>Instant transactions at wholesale rates</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', marginTop: '0.5rem', maxWidth: '600px', margin: '0.75rem auto 0' }}>Settle bills and acquire data bundles instantly using our fully automated network gateways.</p>
          </div>

          {/* Grid of 6 services */}
          <div className="services-grid-3x2" style={{ marginBottom: '4rem' }}>
            {services.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="card hover-scale" style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '20px', padding: '2.25rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', transition: 'all 0.3s' }}>
                  {/* Rounded circle icon background */}
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: s.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                    <Icon size={26} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>{s.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>{s.desc}</p>
                  </div>
                  <Link href={s.link} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-brand-primary)', fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none', marginTop: 'auto' }}>
                    {s.linkLabel} <ChevronRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Centered button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link href="/services" className="btn btn-secondary hover-scale" style={{ padding: '0.75rem 2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
              <span>🎛️</span> View all services
            </Link>
          </div>

        </div>
      </section>

      {/* Built for speed, security & reliability Section */}
      <section style={{ padding: '7rem 0', background: 'var(--color-bg-base)', borderTop: '1px solid var(--color-border)', position: 'relative' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <span style={{ color: 'var(--color-brand-primary)', textTransform: 'uppercase', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.12em', display: 'block', marginBottom: '0.75rem' }}>Why Choose FA Digital</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>Engineered for absolute reliability</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={idx} className="card" style={{ padding: '2.25rem 2rem', background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '20px', display: 'flex', gap: '1.25rem', flexDirection: 'column' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', backgroundColor: f.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, flexShrink: 0 }}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>{f.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Become an Agent CTA block */}
      <section style={{ padding: '4rem 0 7rem', background: 'var(--color-bg-base)' }}>
        <div className="container">
          <div 
            className="agent-banner-flex"
            style={{ 
              background: 'linear-gradient(135deg, #0A192F 0%, #172A45 100%)', 
              borderRadius: '28px', 
              color: '#FFFFFF',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(10, 25, 47, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            {/* Graphic Signal Lines in the background */}
            <div style={{ position: 'absolute', right: '5%', bottom: '0', display: 'flex', gap: '8px', alignItems: 'flex-end', height: '140px', opacity: 0.15 }}>
              <div style={{ width: '14px', height: '40px', backgroundColor: '#FFF', borderRadius: '4px 4px 0 0' }}></div>
              <div style={{ width: '14px', height: '70px', backgroundColor: '#FFF', borderRadius: '4px 4px 0 0' }}></div>
              <div style={{ width: '14px', height: '100px', backgroundColor: '#FFF', borderRadius: '4px 4px 0 0' }}></div>
              <div style={{ width: '14px', height: '140px', backgroundColor: '#FFF', borderRadius: '4px 4px 0 0' }}></div>
            </div>

            <div className="agent-banner-content">
              <span style={{ color: '#FBBF24', textTransform: 'uppercase', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.12em', display: 'block', marginBottom: '0.75rem' }}>Earning opportunity</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '1rem', lineHeight: '1.25', letterSpacing: '-0.02em' }}>Join thousands of reseller agents earning daily</h2>
              <p style={{ fontSize: '0.98rem', color: '#94A3B8', lineHeight: '1.65', marginBottom: '2.5rem', maxWidth: '560px' }}>
                Launch your virtual top-up business with zero setup fees. Purchase VTU products at heavily discounted rates and pocket instant margins.
              </p>

              {/* Three items in row */}
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34D399', fontSize: '0.9rem' }}>💰</div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#E2E8F0', letterSpacing: '0.02em' }}>Discount rates</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FBBF24', fontSize: '0.9rem' }}>⚡</div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#E2E8F0', letterSpacing: '0.02em' }}>Automatic delivery</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60A5FA', fontSize: '0.9rem' }}>📞</div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#E2E8F0', letterSpacing: '0.02em' }}>Dedicated channels</span>
                </div>
              </div>
            </div>

            <div style={{ position: 'relative', zIndex: 1 }} className="hover-scale">
              <Link href="/become-agent" className="btn btn-lg" style={{ padding: '1rem 2.25rem', borderRadius: '16px', backgroundColor: '#FBBF24', color: '#0A192F', fontSize: '1.05rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(251, 191, 36, 0.25)' }}>
                Become an agent <ChevronRight size={18} />
              </Link>
            </div>

          </div>
        </div>
      </section>

    </PublicLayout>
  );
}
