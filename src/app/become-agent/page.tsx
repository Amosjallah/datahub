'use client';

import React from 'react';
import PublicLayout from '@/components/PublicLayout';
import { Award, DollarSign, BarChart3, Users, Zap, CheckCircle, ChevronRight } from 'lucide-react';

export default function BecomeAgent() {
  const benefits = [
    { icon: DollarSign, color: '#10B981', bg: 'rgba(16, 185, 129, 0.06)', title: 'Higher Profit Margins', desc: 'Acquire products at agent rates: discounts up to 10% on data and 3-5% commission on airtime recharges.' },
    { icon: BarChart3, color: '#0066FF', bg: 'rgba(0, 102, 255, 0.06)', title: 'Sales Dashboard', desc: 'Track customers, view transaction metrics, and manage commissions from a live personal dashboard.' },
    { icon: Users, color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.06)', title: 'Address Contacts', desc: 'Store frequent customer numbers and recharge profiles for one-click purchases to speed up delivery cycles.' },
  ];

  return (
    <PublicLayout>
      {/* Header */}
      <section style={{ padding: '6.5rem 0 3.5rem', background: 'radial-gradient(120% 120% at 50% -20%, rgba(0, 102, 255, 0.04) 0%, rgba(255, 255, 255, 0) 100%)', textAlign: 'center' }}>
        <div className="container animate-fade-up" style={{ maxWidth: '800px' }}>
          <span className="badge badge-blue" style={{ textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>Grow with Us</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Earn Commissions as a <span className="text-gradient">VTU Reseller Agent</span>
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Access bulk digital products at wholesale rates and run your business from a state-of-the-art developer dashboard.
          </p>
        </div>
      </section>

      {/* Benefits grid */}
      <section style={{ padding: '2rem 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <div key={i} className="card hover-scale" style={{ padding: '2.5rem 2rem', border: '1px solid var(--color-border)', borderRadius: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: benefit.bg, color: benefit.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Icon size={22} />
                </div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem', fontWeight: 800 }}>{benefit.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>{benefit.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Commission Table widget */}
        <div className="container" style={{ maxWidth: '850px', marginBottom: '5rem' }}>
          <div className="card glass-panel" style={{ padding: '2.5rem 2rem', borderRadius: '24px', border: '1px solid rgba(0, 102, 255, 0.1)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span className="badge badge-blue" style={{ textTransform: 'uppercase', marginBottom: '0.5rem' }}>Rate Sheet</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Representative Discount Rates</h3>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid var(--color-border)', background: 'var(--color-bg-elevated)' }}>
                    <th style={{ padding: '0.75rem 1.25rem', color: 'var(--color-text-primary)' }}>Carrier & Service</th>
                    <th style={{ padding: '0.75rem 1.25rem', color: 'var(--color-text-primary)' }}>Standard Price</th>
                    <th style={{ padding: '0.75rem 1.25rem', color: 'var(--color-text-primary)' }}>Reseller Rate</th>
                    <th style={{ padding: '0.75rem 1.25rem', color: '#10B981' }}>Your Profit Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { service: 'MTN SME Data 10GB', standard: '₵40.00', reseller: '₵37.00', margin: '₵3.00 (7.5%)' },
                    { service: 'MTN CG Data 5GB', standard: '₵20.00', reseller: '₵18.50', margin: '₵1.50 (7.5%)' },
                    { service: 'Telecel Data 10GB', standard: '₵35.00', reseller: '₵33.00', margin: '₵2.00 (5.7%)' },
                    { service: 'Airtime VTU Top-Up (All Carriers)', standard: '₵100.00', reseller: '₵96.50', margin: '₵3.50 (3.5%)' },
                    { service: 'ECG Prepaid Utility Bill Token', standard: '₵100.00', reseller: '₵100.00', margin: '₵1.50 (Flat fee commission)' }
                  ].map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>{row.service}</td>
                      <td style={{ padding: '0.85rem 1.25rem', color: 'var(--color-text-muted)' }}>{row.standard}</td>
                      <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600 }}>{row.reseller}</td>
                      <td style={{ padding: '0.85rem 1.25rem', color: '#10B981', fontWeight: 700 }}>{row.margin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* How It Works horizontal timeline */}
        <div className="container" style={{ maxWidth: '800px', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2.5rem', textAlign: 'center', letterSpacing: '-0.02em' }}>How To Start Your VTU Business</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {[
              { num: '1', title: 'Register Reseller Profile', desc: 'Create your free account. Choose your profile as an Agent on the registration page.' },
              { num: '2', title: 'Deposit Funds to Ledger Wallet', desc: 'Instantly top up your wallet with Mobile Money (MTN, Telecel, AT) or Visa cards processed securely via Paystack.' },
              { num: '3', title: 'Begin Operations and Save', desc: 'Conduct transactions for clients. Balance is debited at reseller agent pricing, meaning you pocket standard profit immediately.' }
            ].map((step, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }} className="hover-scale">
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--color-brand-primary) 0%, #0052CC 100%)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0, boxShadow: '0 4px 10px rgba(0, 102, 255, 0.15)' }}>
                  {step.num}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>{step.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reseller Business CTA card */}
        <div className="container" style={{ maxWidth: '800px' }}>
          <div 
            className="card" 
            style={{ 
              padding: '3.5rem 2.5rem', 
              textAlign: 'center', 
              background: 'linear-gradient(135deg, #0A192F 0%, #172A45 100%)', 
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 20px 40px rgba(10, 25, 47, 0.25)',
              color: '#FFFFFF'
            }}
          >
            <span style={{ color: '#FBBF24', textTransform: 'uppercase', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.12em', display: 'block', marginBottom: '0.75rem' }}>Get active today</span>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.8rem', fontWeight: 900, color: '#FFFFFF' }}>Activate Your Reseller Profile Instantly</h3>
            <p style={{ color: '#94A3B8', maxWidth: '520px', margin: '0 auto 2.5rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
              No setup fees, application forms, or activation approvals required. Sign up and fund your wallet to begin sales.
            </p>
            <a href="/register?role=agent" className="btn hover-scale" style={{ padding: '0.95rem 2.25rem', borderRadius: '16px', backgroundColor: '#FBBF24', color: '#0A192F', fontWeight: 800, fontSize: '1.05rem', boxShadow: '0 6px 20px rgba(251, 191, 36, 0.2)' }}>
              Sign Up as Reseller <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
