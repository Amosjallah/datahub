'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';
import { 
  ShieldCheck, 
  Sparkles, 
  Store, 
  Link2, 
  ArrowRight, 
  Search, 
  MousePointerClick, 
  Wallet, 
  Zap, 
  Radio, 
  Timer, 
  Headphones, 
  MessageCircle, 
  ChevronDown, 
  Lock,
  ChevronRight
} from 'lucide-react';

export default function Home() {
  const [storeLink, setStoreLink] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleStoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (storeLink.trim()) {
      // Direct user to their agent's page or simulation
      const cleanLink = storeLink.replace(/^(https?:\/\/)?(www\.)?fadigital\.com\/vendor\//, '');
      window.location.href = `/register?store=${encodeURIComponent(cleanLink)}`;
    }
  };

  const faqItems = [
    {
      q: "How fast is delivery?",
      a: "Most MTN, Telecel, and AirtelTigo bundles are delivered to your line in under 2 minutes. You can track the status of your order live from payment approval to network confirmation.",
      icon: Zap
    },
    {
      q: "What if data doesn't arrive?",
      a: "We use a ledger-centric security model. If the network provider fails to complete your transaction, our systems trigger an instant, automated refund to your wallet balance. Tap 'Get Help' on any order to chat with support instantly.",
      icon: ShieldCheck
    },
    {
      q: "Which payments work?",
      a: "We accept MTN Mobile Money, Telecel Cash, AT Money, and all local credit/debit bank cards through our secure Paystack gateway integration. Order receipts and updates are sent immediately via SMS.",
      icon: Wallet
    },
    {
      q: "Can I sell on FA Digital?",
      a: "Yes! Anyone can launch their own branded reseller store in minutes. You get access to wholesale prices, set your own markup prices, and let your customers buy via your own private URL.",
      icon: Store
    },
    {
      q: "How do vendor prices work?",
      a: "As an agent, you purchase bundles at discounted wholesale prices and define your own retail profit margins. The difference between your retail price and the wholesale rate is your profit.",
      icon: TagIcon
    },
    {
      q: "Is my phone number safe?",
      a: "Your details are only used for bundle delivery and transactional alerts. We encrypt all data in transit and strictly enforce a zero-sharing policy with third parties.",
      icon: Lock
    }
  ];

  return (
    <PublicLayout>
      {/* 1. Alert / Operational Status Banner */}
      <div style={{ 
        backgroundColor: '#070D19', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '0.6rem 0'
      }}>
        <div className="container" style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: '1rem',
          fontSize: '0.78rem',
          fontWeight: 600,
          color: 'var(--color-text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10B981' }}>
              <span className="pulse-dot" style={{ 
                width: '6px', 
                height: '6px', 
                backgroundColor: '#10B981', 
                borderRadius: '50%', 
                display: 'inline-block',
                boxShadow: '0 0 8px #10B981'
              }}></span>
              <span style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>All systems operational</span>
            </span>
            <span style={{ width: '1px', height: '12px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }}></span>
            <span>Avg Fulfilment <strong style={{ color: '#FFFFFF' }}>&lt; 2 min</strong></span>
            <span style={{ width: '1px', height: '12px', backgroundColor: 'rgba(255, 255, 255, 0.15)', display: 'none' }} className="sm-show"></span>
            <span style={{ display: 'none' }} className="sm-show">Networks: <strong style={{ color: '#FFFFFF' }}>MTN · Telecel · AT</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Currency: <strong style={{ color: '#FFFFFF' }}>GHS ₵</strong></span>
            <span style={{ width: '1px', height: '12px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }}></span>
            <a href="mailto:support@fadigital.com" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }} className="hover-light">support@fadigital.com</a>
          </div>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="new-hero-section">
        {/* Abstract Glow Effects */}
        <div style={{ 
          position: 'absolute', 
          top: '10%', 
          left: '5%', 
          width: '350px', 
          height: '350px', 
          background: 'radial-gradient(circle, rgba(250, 204, 21, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1
        }}></div>
        <div style={{ 
          position: 'absolute', 
          bottom: '10%', 
          right: '5%', 
          width: '400px', 
          height: '400px', 
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1
        }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-grid" style={{ display: 'grid', gap: '3rem', alignItems: 'center' }}>
            
            {/* Hero Left: Text & Badges */}
            <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              
              {/* Active Badge */}
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                backgroundColor: 'rgba(250, 204, 21, 0.04)', 
                border: '1px solid rgba(250, 204, 21, 0.25)', 
                padding: '0.35rem 0.85rem', 
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#FACC15',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1.5rem',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
              }}>
                <span style={{ 
                  width: '6px', 
                  height: '6px', 
                  backgroundColor: '#10B981', 
                  borderRadius: '50%', 
                  display: 'inline-block',
                  boxShadow: '0 0 8px #10B981',
                  marginRight: '2px'
                }}></span>
                LIVE · YOUR AGENT'S STORE, POWERED BY DCS
              </div>

              {/* H1 Heading */}
              <h1 style={{ 
                fontSize: 'clamp(2.5rem, 6vw, 4.2rem)', 
                fontWeight: 900, 
                lineHeight: '1.1', 
                letterSpacing: '-0.025em', 
                color: '#FFFFFF',
                marginBottom: '1.5rem'
              }}>
                Buy data faster,<br />
                <span style={{ color: '#FACC15' }}>smarter.</span>
              </h1>

              {/* Subheading */}
              <p style={{ 
                fontSize: '1.05rem', 
                lineHeight: '1.65', 
                color: 'var(--color-text-secondary)', 
                maxWidth: '550px',
                marginBottom: '2rem'
              }}>
                Open your agent's private store. Pay with MoMo. Receive in seconds across MTN, Telecel & AirtelTigo.
              </p>

              {/* Key Values Checklist */}
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#D1D5DB', fontWeight: 600 }}>
                  <ShieldCheck size={16} style={{ color: '#FACC15' }} />
                  <span>BoG-licensed rails</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#D1D5DB', fontWeight: 600 }}>
                  <Sparkles size={16} style={{ color: '#FACC15' }} />
                  <span>100% success rate</span>
                </div>
              </div>

              {/* Store Finder Search Form */}
              <div style={{ width: '100%', maxWidth: '460px' }}>
                <form 
                  onSubmit={handleStoreSubmit}
                  style={{ 
                    background: 'rgba(15, 23, 42, 0.45)', 
                    border: '1px solid rgba(255, 255, 255, 0.15)', 
                    borderRadius: '20px', 
                    padding: '1.5rem',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                    <Store size={18} style={{ color: '#FACC15' }} />
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#FFFFFF' }}>Open your agent's store</span>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    background: '#030712', 
                    borderRadius: '9999px', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '0.35rem 0.35rem 0.35rem 1.1rem',
                    gap: '0.6rem',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
                  }}>
                    <Link2 size={18} style={{ color: '#FACC15', flexShrink: 0 }} />
                    <input 
                      type="text" 
                      placeholder="e.g. mystore or dcselite.com/vendor/mystore"
                      value={storeLink}
                      onChange={(e) => setStoreLink(e.target.value)}
                      style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        outline: 'none', 
                        color: '#FFFFFF', 
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        width: '100%',
                        height: '36px'
                      }}
                    />
                    <button 
                      type="submit" 
                      style={{ 
                        padding: '0 1.5rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        height: '36px',
                        background: '#FACC15',
                        color: '#030712',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        transition: 'transform 0.1s, background-color 0.2s',
                        flexShrink: 0
                      }}
                      className="hover-scale"
                    >
                      Go <ArrowRight size={14} style={{ strokeWidth: 3 }} />
                    </button>
                  </div>
                  
                  <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.85rem', lineHeight: '1.4' }}>
                    Use the store link your agent shared on WhatsApp or social media.
                  </p>
                </form>
                
                <p style={{ fontSize: '0.85rem', color: '#FFFFFF', marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Selling data?</span>
                  <Link href="/become-agent" style={{ color: '#FACC15', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }} className="hover-link">
                    Create your own store <ArrowRight size={14} />
                  </Link>
                </p>
              </div>

            </div>

            {/* Hero Right: Spacer for background image on desktop */}
            <div className="hero-spacer" />

          </div>

          {/* Stats Bar */}
          <div style={{ 
            marginTop: '4rem', 
            paddingTop: '2rem', 
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '2rem',
            textAlign: 'center'
          }}>
            {[
              { num: '50K+', label: 'Bundles Delivered' },
              { num: '3 Networks', label: 'MTN · Telecel · AT' },
              { num: '100%', label: 'SLA Success Rate' },
              { num: '< 2 min', label: 'Avg Delivery Speed' }
            ].map((stat, idx) => (
              <div key={idx}>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>{stat.num}</div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)' }}>{stat.label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. How it Works Section */}
      <section style={{ padding: '6rem 0', backgroundColor: '#FFFFFF', color: '#1E293B' }}>
        <div className="container">
          
          <div style={{ maxWidth: '600px', marginBottom: '4rem' }}>
            <span style={{ color: '#0066FF', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: '0.5rem' }}>How it works</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.025em', lineHeight: '1.2' }}>
              From payment to data delivery in under 60 seconds.
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '0.75rem' }}>
              No complicated reseller portals, no clunky USSD menus. Experience clean, direct transaction paths.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {[
              { step: '01', title: 'Open Store Link', desc: 'Paste the custom web link shared by your local agent. Each storefront is private.', icon: Search },
              { step: '02', title: 'Pick a Bundle', desc: 'Browse the listed plans and rates on your agent\'s store and select the best fit.', icon: MousePointerClick },
              { step: '03', title: 'Pay with MoMo', desc: 'Enter your Mobile Money wallet number or local card. Payments run via Paystack.', icon: Wallet },
              { step: '04', title: 'Receive Instantly', desc: 'Track your transaction live on the web panel as data gets credited to your line.', icon: Zap }
            ].map((node, idx) => (
              <div 
                key={idx}
                style={{ 
                  background: '#F8FAFC', 
                  border: '1px solid #E2E8F0', 
                  borderRadius: '16px', 
                  padding: '2rem 1.5rem',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
                className="hover-scale"
              >
                {/* Visual Accent Hover */}
                <div style={{ 
                  position: 'absolute', 
                  top: '0', 
                  left: '0', 
                  height: '3px', 
                  width: '100%', 
                  backgroundColor: '#0066FF',
                  opacity: 0,
                  transition: 'opacity 0.2s'
                }} className="hover-line"></div>

                <span style={{ 
                  position: 'absolute', 
                  right: '1rem', 
                  top: '1rem', 
                  fontSize: '2rem', 
                  fontWeight: 900, 
                  color: '#E2E8F0',
                  letterSpacing: '-0.05em'
                }}>
                  {node.step}
                </span>

                <div style={{ 
                  width: '38px', 
                  height: '38px', 
                  borderRadius: '10px', 
                  backgroundColor: 'rgba(0, 102, 255, 0.06)', 
                  color: '#0066FF', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '1.25rem' 
                }}>
                  <node.icon size={18} />
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>{node.title}</h3>
                <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: '1.6' }}>{node.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Network Coverage Section */}
      <section style={{ padding: '6rem 0', backgroundColor: '#F8FAFC', color: '#1E293B', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          
          <div style={{ maxWidth: '600px', marginBottom: '4rem' }}>
            <span style={{ color: '#0066FF', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: '0.5rem' }}>Network coverage</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.025em', lineHeight: '1.2' }}>
              Every major Ghanaian network. <span style={{ color: '#0066FF' }}>One gateway.</span>
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '0.75rem' }}>
              Reseller agents sell bundles across all networks instantly. Customers buy securely from their specific storefront.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {/* MTN Card */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ height: '4px', backgroundColor: '#EAB308' }}></div>
              <div style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span style={{ backgroundColor: '#FEF08A', color: '#854D0E', fontSize: '0.68rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>MTN Ghana</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                    <Radio size={12} style={{ color: '#EAB308' }} /> 98% Stability
                  </span>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>175 Bundles</div>
                <div style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '1.5rem' }}>4G / 5G Broadband Ready</div>
                
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', color: '#94A3B8', tracking: '0.05em' }}>From</span>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>₵5.50</div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', fontWeight: 700, color: '#10B981' }}>
                    <Zap size={12} /> Instant Delivery
                  </span>
                </div>
              </div>
            </div>

            {/* Telecel Card */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ height: '4px', backgroundColor: '#EF4444' }}></div>
              <div style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span style={{ backgroundColor: '#FEE2E2', color: '#991B1B', fontSize: '0.68rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Telecel Cash</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                    <Radio size={12} style={{ color: '#EF4444' }} /> 92% Stability
                  </span>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>109 Bundles</div>
                <div style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '1.5rem' }}>4G Nationwide Network</div>
                
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', color: '#94A3B8', tracking: '0.05em' }}>From</span>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>₵13.00</div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', fontWeight: 700, color: '#10B981' }}>
                    <Zap size={12} /> Instant Delivery
                  </span>
                </div>
              </div>
            </div>

            {/* AirtelTigo Card */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ height: '4px', backgroundColor: '#06B6D4' }}></div>
              <div style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span style={{ backgroundColor: '#CFFAFE', color: '#155E75', fontSize: '0.68rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AirtelTigo / AT</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                    <Radio size={12} style={{ color: '#06B6D4' }} /> 88% Stability
                  </span>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>35 Bundles</div>
                <div style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '1.5rem' }}>4G Nationwide Coverage</div>
                
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', color: '#94A3B8', tracking: '0.05em' }}>From</span>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>₵8.00</div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', fontWeight: 700, color: '#10B981' }}>
                    <Zap size={12} /> Instant Delivery
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4.5. Our Services Section */}
      <section style={{ padding: '6rem 0', backgroundColor: '#090F1C', color: '#FFFFFF', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div className="container">
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem', marginBottom: '4rem' }}>
            <div style={{ maxWidth: '600px' }}>
              <span style={{ color: '#FACC15', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: '0.5rem' }}>Our services</span>
              <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.025em', lineHeight: '1.2' }}>
                One platform, <span style={{ color: '#FACC15' }}>unlimited utilities.</span>
              </h2>
              <p style={{ color: '#9CA3AF', fontSize: '0.95rem', marginTop: '0.75rem' }}>
                Cheap internet plans, voice top-ups, WAEC pins, and utility payments. Fully automated delivery across all major networks.
              </p>
            </div>
            
            <Link href="/services" className="btn btn-secondary hover-scale" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', borderRadius: '10px', flexShrink: 0 }}>
              View all services <ChevronRight size={14} />
            </Link>
          </div>

          {/* Category labels */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {[
              { label: 'Data & Airtime', icon: '📶', color: '#3B82F6' },
              { label: 'Bills & TV', icon: '🔌', color: '#F59E0B' },
              { label: 'Education', icon: '🎓', color: '#8B5CF6' },
            ].map((cat, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.35rem 0.85rem', borderRadius: '9999px',
                border: `1px solid ${cat.color}33`,
                background: `${cat.color}0D`,
                fontSize: '0.75rem', fontWeight: 700, color: cat.color,
                letterSpacing: '0.04em'
              }}>
                <span>{cat.icon}</span>{cat.label}
              </span>
            ))}
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', 
            gap: '1.25rem' 
          }}>
            {[
              { 
                title: 'MTN Data Bundles', 
                desc: 'High-speed MTN corporate gifting, SME, and Turbo bundles. Activated on recipients\' lines in 3 seconds.', 
                icon: '🟡', label: 'MTN Ghana',
                accentColor: '#FFCC00', labelBg: 'rgba(255,204,0,0.12)', labelText: '#D4A700',
                borderAccent: 'rgba(255,204,0,0.2)'
              },
              { 
                title: 'Telecel Data Bundles', 
                desc: 'Instant internet packages for Telecel mobile numbers, prepaid SIMs, and router devices.', 
                icon: '🔴', label: 'Telecel GH',
                accentColor: '#E4062C', labelBg: 'rgba(228,6,44,0.12)', labelText: '#F05070',
                borderAccent: 'rgba(228,6,44,0.2)'
              },
              { 
                title: 'AirtelTigo Data Bundles', 
                desc: 'Fast, discounted AT data packages. Real-time ledger confirmations with instant delivery feedback.', 
                icon: '🔵', label: 'AirtelTigo',
                accentColor: '#0057A0', labelBg: 'rgba(0,87,160,0.12)', labelText: '#60A8E0',
                borderAccent: 'rgba(0,87,160,0.25)'
              },
              { 
                title: 'Airtime Top-Up', 
                desc: 'Top up phone credits instantly for MTN, Telecel, and AirtelTigo lines. Bulk top-up available for agents.', 
                icon: '📱', label: 'All Networks',
                accentColor: '#6366F1', labelBg: 'rgba(99,102,241,0.12)', labelText: '#A5B4FC',
                borderAccent: 'rgba(99,102,241,0.2)'
              },
              { 
                title: 'ECG Electricity Bills', 
                desc: 'Purchase prepaid smart meter tokens or settle ECG postpaid electricity bills securely from your wallet.', 
                icon: '⚡', label: 'Power Utility',
                accentColor: '#F59E0B', labelBg: 'rgba(245,158,11,0.12)', labelText: '#FCD34D',
                borderAccent: 'rgba(245,158,11,0.2)'
              },
              { 
                title: 'Ghana Water (GWCL)', 
                desc: 'Settle monthly domestic and commercial Ghana Water Company bills. Instant confirmation updates.', 
                icon: '💧', label: 'Water Utility',
                accentColor: '#0EA5E9', labelBg: 'rgba(14,165,233,0.12)', labelText: '#67E8F9',
                borderAccent: 'rgba(14,165,233,0.2)'
              },
              { 
                title: 'TV Subscriptions', 
                desc: 'Renew DStv, GOtv, and StarTimes TV packages in real-time. Keep screen viewing active without delay.', 
                icon: '📺', label: 'Satellite TV',
                accentColor: '#EF4444', labelBg: 'rgba(239,68,68,0.12)', labelText: '#FCA5A5',
                borderAccent: 'rgba(239,68,68,0.2)'
              },
              { 
                title: 'WAEC Result Checkers', 
                desc: 'Acquire BECE, WASSCE, NABTEB, and university application voucher checker PINs instantly via SMS/email.', 
                icon: '🎓', label: 'WAEC / Education',
                accentColor: '#8B5CF6', labelBg: 'rgba(139,92,246,0.12)', labelText: '#C4B5FD',
                borderAccent: 'rgba(139,92,246,0.2)'
              },
            ].map((svc, idx) => (
              <div 
                key={idx}
                style={{ 
                  background: 'rgba(15, 23, 42, 0.5)', 
                  border: `1px solid ${svc.borderAccent}`,
                  borderRadius: '20px', 
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                className="hover-scale"
              >
                {/* Subtle top accent glow */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                  background: `linear-gradient(90deg, transparent, ${svc.accentColor}80, transparent)`
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    width: '46px', height: '46px', borderRadius: '14px',
                    background: svc.labelBg, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1.5rem'
                  }}>{svc.icon}</div>
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 800,
                    padding: '0.25rem 0.65rem', borderRadius: '8px',
                    background: svc.labelBg, color: svc.labelText,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    border: `1px solid ${svc.borderAccent}`
                  }}>
                    {svc.label}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.45rem' }}>{svc.title}</h3>
                  <p style={{ fontSize: '0.82rem', color: '#9CA3AF', lineHeight: '1.65', margin: 0 }}>{svc.desc}</p>
                </div>

                <Link
                  href="/services"
                  style={{
                    marginTop: 'auto',
                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                    fontSize: '0.78rem', fontWeight: 700, color: svc.labelText,
                    textDecoration: 'none', transition: 'gap 0.2s'
                  }}
                >
                  Get started <ChevronRight size={13} />
                </Link>
              </div>
            ))}
          </div>

          {/* Bottom CTA strip */}
          <div style={{
            marginTop: '3rem', padding: '1.5rem 2rem',
            background: 'rgba(250, 204, 21, 0.04)',
            border: '1px solid rgba(250, 204, 21, 0.15)',
            borderRadius: '16px',
            display: 'flex', flexWrap: 'wrap',
            justifyContent: 'space-between', alignItems: 'center',
            gap: '1rem'
          }}>
            <div>
              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF' }}>Ready to buy or resell?</span>
              <span style={{ fontSize: '0.82rem', color: '#9CA3AF', display: 'block', marginTop: '0.15rem' }}>Open a store in minutes. Automated wholesale pricing. Zero setup fees.</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link href="/services" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.4rem', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s' }} className="hover-scale">
                Browse all services <ChevronRight size={14} />
              </Link>
              <Link href="/become-agent" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.4rem', borderRadius: '10px', background: '#FACC15', color: '#030712', fontSize: '0.85rem', fontWeight: 800, textDecoration: 'none', transition: 'all 0.2s' }} className="hover-scale">
                Become an agent <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Built on Trust Section */}
      <section style={{ padding: '6rem 0', backgroundColor: '#030712', color: '#FFFFFF', position: 'relative' }}>
        <div className="container">
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem', marginBottom: '4rem' }}>
            <div style={{ maxWidth: '520px' }}>
              <span style={{ color: '#FACC15', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: '0.5rem' }}>Built on trust</span>
              <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.025em', lineHeight: '1.2' }}>
                Engineered like a bank.<br />Moves like fintech.
              </h2>
              <p style={{ color: '#9CA3AF', fontSize: '0.95rem', marginTop: '0.75rem' }}>
                We combine private agent storefront architectures with regulated payment gateways and automated auditing.
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '0.75rem 1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 850, color: '#FFFFFF' }}>0 Failed</div>
                <div style={{ fontSize: '0.65rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unresolved Cases</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '0.75rem 1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 850, color: '#FFFFFF' }}>100%</div>
                <div style={{ fontSize: '0.65rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Audited Webhooks</div>
              </div>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {[
              { title: 'Licensed Payments Gateway', desc: 'Secure payments powered by Paystack. Full card security and direct carrier APIs.', highlight: 'Paystack Rails', icon: Lock },
              { title: 'Instant Automated Refund SLA', desc: 'Failed operator calls trigger instant automated balance refunds back to your wallet. Zero manual intervention.', highlight: 'Double-entry Audit', icon: ShieldCheck },
              { title: 'Human Support in Minutes', desc: 'Talk to real engineers and client managers on WhatsApp and email. Response target is under 5 mins.', highlight: '< 5m SLA Target', icon: Headphones },
            ].map((card, idx) => (
              <div 
                key={idx}
                style={{ 
                  background: 'rgba(15, 23, 42, 0.45)', 
                  border: '1px solid rgba(255,255,255,0.06)', 
                  borderRadius: '20px', 
                  padding: '2rem 1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: '42px', 
                    height: '42px', 
                    borderRadius: '12px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                    color: '#FACC15', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <card.icon size={20} />
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#9CA3AF', border: '1px solid rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 600 }}>
                    {card.highlight}
                  </span>
                </div>
                
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>{card.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#9CA3AF', lineHeight: '1.6' }}>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. FAQ Accordion Section */}
      <section style={{ padding: '6rem 0', backgroundColor: '#FFFFFF', color: '#1E293B' }}>
        <div className="container">
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }} className="lg-grid-2cols">
            
            {/* FAQ Left Column */}
            <div>
              <span style={{ color: '#0066FF', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: '0.5rem' }}>FAQ</span>
              <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.025em', lineHeight: '1.2', marginBottom: '1.5rem' }}>
                Questions, answered.
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: '2rem', maxWidth: '400px' }}>
                Have questions about billing, agent storefront activation, or delivery stability? We got you.
              </p>

              {/* WhatsApp Callout Card */}
              <a 
                href="https://wa.me/233200000000" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(20, 184, 166, 0.02) 100%)', 
                  border: '1px solid rgba(16, 185, 129, 0.25)', 
                  borderRadius: '20px', 
                  padding: '1.25rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
                className="hover-scale"
              >
                <div style={{ 
                  width: '46px', 
                  height: '46px', 
                  borderRadius: '12px', 
                  backgroundColor: '#10B981', 
                  color: '#FFFFFF', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 8px 16px rgba(16, 185, 129, 0.25)'
                }}>
                  <MessageCircle size={22} />
                </div>
                <div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A' }}>Chat on WhatsApp</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block', marginTop: '1px' }}>Support replies in under 5 minutes</span>
                </div>
              </a>
              
              <Link href="/support" style={{ display: 'inline-block', fontSize: '0.85rem', fontWeight: 700, color: '#0066FF', marginTop: '1.25rem', textDecoration: 'none' }} className="hover-light">
                Visit Help Center &rarr;
              </Link>
            </div>

            {/* FAQ Right Column (Accordion) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {faqItems.map((item, idx) => {
                const ItemIcon = item.icon;
                const isOpen = activeFaq === idx;
                return (
                  <div 
                    key={idx}
                    style={{ 
                      border: '1px solid #E2E8F0', 
                      borderRadius: '16px', 
                      overflow: 'hidden',
                      backgroundColor: isOpen ? 'rgba(6, 182, 212, 0.03)' : '#FFFFFF',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1.25rem 1.5rem',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        gap: '1rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '8px', 
                          backgroundColor: isOpen ? '#0066FF' : '#F1F5F9', 
                          color: isOpen ? '#FFFFFF' : '#64748B', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}>
                          <ItemIcon size={15} />
                        </div>
                        <span style={{ fontSize: '0.92rem', fontWeight: 750, color: '#0F172A' }}>{item.q}</span>
                      </div>
                      <ChevronDown 
                        size={16} 
                        style={{ 
                          color: isOpen ? '#0066FF' : '#94A3B8',
                          transform: isOpen ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.2s'
                        }} 
                      />
                    </button>
                    
                    <div 
                      style={{ 
                        height: isOpen ? 'auto' : 0,
                        opacity: isOpen ? 1 : 0,
                        overflow: 'hidden',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ padding: '0 1.5rem 1.5rem 4rem', fontSize: '0.82rem', color: '#64748B', lineHeight: '1.6' }}>
                        {item.a}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* 7. Footer CTA Section */}
      <section style={{ padding: '5rem 0', backgroundColor: '#090F1C', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div 
            className="card" 
            style={{ 
              background: 'linear-gradient(135deg, rgba(250,204,21,0.02) 0%, rgba(59,130,246,0.02) 100%)', 
              borderColor: 'rgba(255,255,255,0.08)', 
              padding: '4rem 2.5rem', 
              borderRadius: '24px', 
              textAlign: 'center', 
              maxWidth: '850px', 
              margin: '0 auto', 
              backgroundColor: '#0F172A',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}
          >
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)', fontWeight: 900, color: '#FFFFFF', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
              Ready when you are.
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '0.95rem', marginBottom: '2rem', maxWidth: '520px', margin: '0 auto 2.25rem' }}>
              Buy data in seconds. Or launch a branded storefront business selling it to others using our high-stability transaction layer.
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <Link href="/become-agent" className="btn btn-primary" style={{ padding: '0.85rem 2rem', color: '#030712' }}>
                Create your store
              </Link>
              <Link href="/support" className="btn btn-secondary" style={{ padding: '0.85rem 2rem' }}>
                Get support
              </Link>
            </div>
            
            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '1.5rem' }}>
              Customers purchase via private store links · 5-minute easy retail setup
            </p>
          </div>
        </div>
      </section>

      {/* Tailwind & CSS Override class injections for responsive splits */}
      <style jsx global>{`
        .new-hero-section {
          position: relative;
          padding: 6rem 0 5.5rem;
          overflow: hidden;
          background: linear-gradient(180deg, #030712 0%, rgba(3, 7, 18, 0.92) 100%), url("/images/hero_bg.png") no-repeat center center;
          background-size: cover;
        }
        .hero-spacer {
          display: none;
        }
        .hover-scale {
          transition: transform 0.2s ease;
        }
        .hover-scale:hover {
          transform: scale(1.03);
        }
        .hover-link {
          transition: color 0.2s ease;
        }
        .hover-link:hover {
          color: #FFF !important;
        }
        @media (min-width: 1024px) {
          .new-hero-section {
            padding: 8rem 0 7.5rem;
            background: linear-gradient(to right, #030712 0%, rgba(3, 7, 18, 0.96) 35%, rgba(3, 7, 18, 0.8) 55%, rgba(3, 7, 18, 0.2) 80%, rgba(3, 7, 18, 0) 100%), url("/images/hero_bg.png") no-repeat center right;
            background-size: cover;
          }
          .hero-grid {
            grid-template-columns: 1.2fr 1fr !important;
            gap: 4rem !important;
          }
          .hero-spacer {
            display: block;
            height: 400px;
          }
          .lg-grid-2cols {
            grid-template-columns: 1fr 1.3fr !important;
            align-items: start !important;
          }
        }
        @media (min-width: 640px) {
          .sm-show {
            display: inline-block !important;
          }
        }
      `}</style>
    </PublicLayout>
  );
}

// Simple placeholder fallback for lucide icon
function TagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
      <path d="M7 7h.01" />
    </svg>
  );
}
