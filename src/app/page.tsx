'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';
import { 
  BarChart2, PhoneCall, Receipt, GraduationCap, 
  Zap, ShieldCheck, Headphones, Contact, ArrowRight,
  Tv, Award
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
      desc: 'Affordable data plans for all networks.', 
      link: '/register', 
      linkLabel: 'Buy data',
      icon: BarChart2,
      color: '#0066FF',
      bgColor: 'rgba(0, 102, 255, 0.08)'
    },
    { 
      title: 'Airtime top-up', 
      desc: 'Top up airtime for yourself or others.', 
      link: '/register', 
      linkLabel: 'Top up now',
      icon: PhoneCall,
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.08)'
    },
    { 
      title: 'Bill payments', 
      desc: 'Pay DSTV, ECG, WAEC and more bills.', 
      link: '/register', 
      linkLabel: 'Pay bills',
      icon: Receipt,
      color: '#F59E0B',
      bgColor: 'rgba(245, 158, 11, 0.08)'
    },
    { 
      title: 'Result checkers', 
      desc: 'Check WAEC, BECE, NABTEB results instantly.', 
      link: '/register', 
      linkLabel: 'Check results',
      icon: GraduationCap,
      color: '#8B5CF6',
      bgColor: 'rgba(139, 92, 246, 0.08)'
    },
    { 
      title: 'TV Subscriptions', 
      desc: 'Renew DStv, GOtv, and StarTimes packages.', 
      link: '/register', 
      linkLabel: 'Renew TV',
      icon: Tv,
      color: '#EF4444',
      bgColor: 'rgba(239, 68, 68, 0.08)'
    },
    { 
      title: 'Reseller program', 
      desc: 'Earn daily profits on wholesale VTU sales.', 
      link: '/become-agent', 
      linkLabel: 'Become agent',
      icon: Award,
      color: '#D97706',
      bgColor: 'rgba(217, 119, 6, 0.08)'
    }
  ];

  const features = [
    { 
      icon: Zap, 
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.08)',
      title: 'Instant delivery', 
      desc: 'Your data and airtime are delivered in seconds, every time.' 
    },
    { 
      icon: ShieldCheck, 
      color: '#0066FF',
      bgColor: 'rgba(0, 102, 255, 0.08)',
      title: 'Bank-grade security', 
      desc: 'Your transactions and data are protected with enterprise security.' 
    },
    { 
      icon: Headphones, 
      color: '#8B5CF6',
      bgColor: 'rgba(139, 92, 246, 0.08)',
      title: 'Real support', 
      desc: '24/7 customer support across call, chat and email.' 
    }
  ];

  const liveTransactions = [
    { loc: 'Kumasi', phone: '055 ••• 4567', detail: '5GB', net: 'MTN' },
    { loc: 'Accra', phone: '024 ••• 6543', detail: '10GB', net: 'AirtelTigo' },
    { loc: 'Takoradi', phone: '054 ••• 8910', detail: '2GB', net: 'Glo' },
    { loc: 'Tamale', phone: '020 ••• 1122', detail: 'GH₵ 50.00 Airtime', net: 'Telecel' },
    { loc: 'Tema', phone: '059 ••• 3344', detail: '20GB', net: 'MTN' },
    { loc: 'Cape Coast', phone: '027 ••• 5566', detail: '5GB', net: 'AirtelTigo' }
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section style={{ padding: '5rem 0 4rem', background: 'radial-gradient(50% 50% at 50% 50%, rgba(0, 102, 255, 0.03) 0%, rgba(255, 255, 255, 0) 100%)' }}>
        <div className="container hero-grid">
          
          {/* Left Column: Hero Text */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div
              style={{
                marginBottom: '1.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 1rem',
                background: '#FFF9E6',
                color: '#D97706',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 700
              }}
            >
              <span>⭐</span> #1 Trusted way to top up & pay bills in Ghana
            </div>
            
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: '1.1', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
              Top up. Pay bills.<br />
              <span style={{ color: 'var(--color-brand-primary)' }}>Stay connected.</span>
            </h1>
            
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '520px', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
              Instant data bundles, airtime top-ups, bill payments and result checkers — all in one secure platform.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
              <Link href="/register" className="btn btn-primary btn-lg" style={{ padding: '0.8rem 1.8rem', borderRadius: '10px', backgroundColor: 'var(--color-brand-primary)', color: '#FFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Create free account <ArrowRight size={18} />
              </Link>
              <Link href="/services" className="btn btn-secondary btn-lg" style={{ padding: '0.8rem 1.8rem', borderRadius: '10px', backgroundColor: '#FFFFFF', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {/* Simple square grid icon representing browse services */}
                <span style={{ fontSize: '1.1rem' }}>🎛️</span> Browse services
              </Link>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'flex', gap: '2.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>💼</div>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>2.4M+</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Wallets funded</div>
              </div>
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>⚡</div>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>8.6s</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Avg. delivery time</div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>👥</div>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>18,500+</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Active agents</div>
              </div>
            </div>
          </div>

          {/* Right Column: High Fidelity Purchase Widget */}
          <div className="card" style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid var(--color-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
            
            {/* Widget Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', backgroundColor: '#FAFAFA' }}>
              <button
                type="button"
                onClick={() => setActiveTab('data')}
                style={{
                  flex: 1,
                  padding: '1rem',
                  border: 'none',
                  background: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: activeTab === 'data' ? 'var(--color-brand-primary)' : 'var(--color-text-muted)',
                  borderBottom: activeTab === 'data' ? '3px solid var(--color-brand-primary)' : '3px solid transparent',
                  transition: 'all var(--transition-fast)'
                }}
              >
                Buy data
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('airtime')}
                style={{
                  flex: 1,
                  padding: '1rem',
                  border: 'none',
                  background: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: activeTab === 'airtime' ? 'var(--color-brand-primary)' : 'var(--color-text-muted)',
                  borderBottom: activeTab === 'airtime' ? '3px solid var(--color-brand-primary)' : '3px solid transparent',
                  transition: 'all var(--transition-fast)'
                }}
              >
                Airtime
              </button>
            </div>

            {/* Widget Form Body */}
            <div style={{ padding: '2rem' }}>
              
              {/* Select Network Operator */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>Select network</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {[
                    { key: 'MTN', color: '#FFCC00', border: '#FFCC00', text: '#000' },
                    { key: 'AirtelTigo', color: '#FFF', border: '#FF3B30', text: '#FF3B30' },
                    { key: 'Glo', color: '#FFF', border: '#00D95A', text: '#00D95A' },
                    { key: '9mobile', color: '#FFF', border: '#E2E8F0', text: 'var(--color-text-muted)' }
                  ].map((net) => {
                    const isSel = selectedNetwork === net.key;
                    return (
                      <button
                        key={net.key}
                        type="button"
                        onClick={() => setSelectedNetwork(net.key as any)}
                        style={{
                          padding: '0.6rem 0',
                          borderRadius: '8px',
                          border: isSel ? `2px solid ${net.border}` : '1.5px solid var(--color-border)',
                          backgroundColor: isSel && net.key === 'MTN' ? '#FFCC00' : '#FFFFFF',
                          color: net.text,
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          textAlign: 'center',
                          boxShadow: isSel ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        {net.key === 'MTN' && (
                          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#000', marginRight: '0.35rem' }}></span>
                        )}
                        {net.key === 'AirtelTigo' ? 'AirtelTigo' : net.key}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Phone number */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>Phone number</label>
                <div style={{ display: 'flex', border: '1.5px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden', alignItems: 'center', background: '#FFF' }}>
                  {/* Country Prefix selection */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0 0.75rem', background: '#FAFAFA', borderRight: '1.5px solid var(--color-border)', height: '42px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span>🇬🇭</span>
                    <span>+233</span>
                    <span style={{ fontSize: '0.5rem', opacity: 0.6 }}>▼</span>
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
                      padding: '0.5rem 0.85rem',
                      fontSize: '0.95rem',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)'
                    }}
                  />
                  {/* Address Book Icon */}
                  <button type="button" style={{ background: 'none', border: 'none', padding: '0.5rem 0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-text-muted)' }}>
                    <Contact size={18} />
                  </button>
                </div>
              </div>

              {/* Select Bundle OR Airtime Amount */}
              {activeTab === 'data' ? (
                <div style={{ marginBottom: '1.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>Select bundle</label>
                  <select
                    value={selectedBundle}
                    onChange={(e) => setSelectedBundle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1.5px solid var(--color-border)',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    {dataBundles.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div style={{ marginBottom: '1.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>Enter Amount (GH₵)</label>
                  <input
                    type="number"
                    value={airtimeAmount}
                    onChange={(e) => setAirtimeAmount(e.target.value)}
                    placeholder="20.00"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1.5px solid var(--color-border)',
                      fontSize: '0.95rem',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}

              {/* Price Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Total</span>
                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text-primary)', fontFamily: 'monospace' }}>GH₵ {getPriceNum()}</span>
              </div>

              {/* Buy Now Button */}
              <Link
                href="/register"
                className="btn btn-full"
                style={{
                  padding: '0.875rem',
                  borderRadius: '10px',
                  backgroundColor: '#00A859',
                  color: '#FFFFFF',
                  fontSize: '1rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(0, 168, 89, 0.15)',
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
      <section style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', background: '#FFFFFF', padding: '0.85rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text-primary)', flexShrink: 0 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }}></span>
            Live transactions
          </div>
          
          <div style={{ height: '20px', width: '1px', backgroundColor: 'var(--color-border)' }}></div>

          {/* Scrolling Marquee */}
          <div className="marquee-container" style={{ flex: 1 }}>
            <div className="marquee-content" style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
              {liveTransactions.concat(liveTransactions).map((tx, idx) => (
                <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{tx.loc}</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>•</span>
                  <span>{tx.phone}</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>bought</span>
                  <span style={{ color: 'var(--color-brand-primary)', fontWeight: 700 }}>{tx.detail}</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>on</span>
                  <span style={{ 
                    color: tx.net === 'MTN' ? '#D97706' : tx.net === 'AirtelTigo' ? '#EF4444' : '#10B981', 
                    fontWeight: 700 
                  }}>{tx.net}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{ padding: '6rem 0', background: '#FFFFFF' }}>
        <div className="container">
          
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ color: 'var(--color-brand-primary)', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', display: 'block', marginBottom: '0.5rem' }}>Our Services</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>Everything you need, in one place</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginTop: '0.5rem' }}>Fast, secure and reliable services at your fingertips.</p>
          </div>

          {/* Grid of 4 services */}
          <div className="services-grid-3x2">
            {services.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="card" style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', transition: 'transform var(--transition-fast)' }}>
                  {/* Rounded circle icon background */}
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: s.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>{s.title}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>{s.desc}</p>
                  </div>
                  <Link href={s.link} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-brand-primary)', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', marginTop: 'auto' }}>
                    {s.linkLabel} <ArrowRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Centered button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link href="/services" className="btn" style={{ padding: '0.65rem 1.5rem', borderRadius: '10px', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', background: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <span>🎛️</span> View all services
            </Link>
          </div>

        </div>
      </section>

      {/* Built for speed, security & reliability Section */}
      <section style={{ padding: '6rem 0', background: 'var(--color-bg-base)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ color: 'var(--color-brand-primary)', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', display: 'block', marginBottom: '0.5rem' }}>Why Choose FA Digital</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>Built for speed, security & reliability</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: f.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, flexShrink: 0 }}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>{f.title}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Become an Agent CTA block */}
      <section style={{ padding: '4rem 0 6rem', background: 'var(--color-bg-base)' }}>
        <div className="container">
          <div 
            className="agent-banner-flex"
            style={{ 
              background: 'linear-gradient(135deg, #051026 0%, #0B1E40 100%)', 
              borderRadius: '24px', 
              color: '#FFFFFF',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(11,30,64,0.15)'
            }}
          >
            {/* Graphic Signal Lines in the background */}
            <div style={{ position: 'absolute', right: '5%', bottom: '0', display: 'flex', gap: '6px', alignItems: 'flex-end', height: '120px', opacity: 0.1 }}>
              <div style={{ width: '12px', height: '30px', backgroundColor: '#FFF', borderRadius: '4px 4px 0 0' }}></div>
              <div style={{ width: '12px', height: '60px', backgroundColor: '#FFF', borderRadius: '4px 4px 0 0' }}></div>
              <div style={{ width: '12px', height: '90px', backgroundColor: '#FFF', borderRadius: '4px 4px 0 0' }}></div>
              <div style={{ width: '12px', height: '120px', backgroundColor: '#FFF', borderRadius: '4px 4px 0 0' }}></div>
            </div>

            <div className="agent-banner-content">
              <span style={{ color: '#F59E0B', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', display: 'block', marginBottom: '0.5rem' }}>Earn More</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem', lineHeight: '1.2' }}>Join thousands of agents earning daily</h2>
              <p style={{ fontSize: '0.95rem', color: '#94A3B8', lineHeight: '1.5', marginBottom: '2.5rem' }}>
                Start your own data and airtime business with zero setup fees. Get better rates, higher commissions and grow with FA Digital.
              </p>

              {/* Three items in row */}
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34D399', fontSize: '0.8rem' }}>💰</div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#E2E8F0' }}>High commissions</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FBBF24', fontSize: '0.8rem' }}>⚡</div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#E2E8F0' }}>Instant payouts</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60A5FA', fontSize: '0.8rem' }}>📞</div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#E2E8F0' }}>Dedicated support</span>
                </div>
              </div>
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <Link href="/become-agent" className="btn btn-lg" style={{ padding: '0.875rem 2rem', borderRadius: '12px', backgroundColor: '#FBBF24', color: '#0B1E40', fontSize: '1rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer', transition: 'all var(--transition-fast)' }}>
                Become an agent <ArrowRight size={18} />
              </Link>
            </div>

          </div>
        </div>
      </section>

    </PublicLayout>
  );
}
