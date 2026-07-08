'use client';

import React from 'react';
import PublicLayout from '@/components/PublicLayout';
import { Target, Eye, ShieldCheck, RefreshCw, Cpu, CheckCircle } from 'lucide-react';

export default function About() {
  return (
    <PublicLayout>
      {/* Page Header */}
      <section style={{ padding: '6.5rem 0 4rem', background: 'radial-gradient(120% 120% at 50% -20%, rgba(0, 102, 255, 0.04) 0%, rgba(255, 255, 255, 0) 100%)', textAlign: 'center' }}>
        <div className="container animate-fade-up" style={{ maxWidth: '800px' }}>
          <span className="badge badge-blue" style={{ textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>Our Story</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
            Connecting Ghanaians to <span className="text-gradient">Instant Digital Rails</span>
          </h1>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--color-text-secondary)' }}>
            FA DIGITAL SERVICES LTD. is Ghana's leading virtual top-up (VTU) e-commerce and bills gateway, delivering instant and reliable utility transactions for consumers and reseller agents nationwide.
          </p>
        </div>
      </section>

      {/* Mission & Vision cards */}
      <section style={{ padding: '3rem 0', background: '#FFFFFF' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          
          {/* Mission Card */}
          <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid var(--color-border)' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', backgroundColor: 'rgba(0, 102, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-brand-primary)' }}>
              <Target size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>Our Mission</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: '1.65' }}>
                To provide the fastest, safest, and most convenient digital recharge and payment platform for everyday consumers and reseller agents in Ghana, lowering costs and increasing reliability.
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid var(--color-border)' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', backgroundColor: 'rgba(16, 185, 129, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success)' }}>
              <Eye size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>Our Vision</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: '1.65' }}>
                To become the undisputed premier gateway for digital utility transaction rails in West Africa, powering both individual and business payments with absolute transparency.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Difference/Ledger Section */}
      <section style={{ padding: '5rem 0', background: 'var(--color-bg-base)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge badge-blue" style={{ textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>How We Operate</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>Ledger-Centric Security Model</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
              We do not believe in missing funds. Our platform runs on automated ledger audits.
            </p>
          </div>

          <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--color-text-secondary)', marginBottom: '3rem', textAlign: 'center' }}>
            Unlike other top-up systems, we operate a fully ledger-centric balance system. That means every single GHS ₵1 you deposit is backed by automated double-entry ledger audits. If an automated upstream provider fails to fulfill your data bundle, our system triggers an instant automated refund back to your wallet ledger. No delays, no manual disputes, and no lost funds.
          </p>

          {/* Process Flow visualization */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: Cpu, step: '1. Transaction Triggered', desc: 'Your API request or form purchase starts. Ledger records a pending debit.' },
              { icon: ShieldCheck, step: '2. Gateway Routing', desc: 'We route to carrier networks using fallback routes for 99.9% delivery.' },
              { icon: RefreshCw, step: '3. Smart Audits', desc: 'Failed provider calls trigger instant, automated ledger refunds back to your balance.' }
            ].map((node, i) => (
              <div key={i} className="card" style={{ padding: '1.75rem', background: '#FFFFFF', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '1rem', right: '1.25rem', fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-brand-subtle)' }}>0{i+1}</span>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--color-brand-subtle)', color: 'var(--color-brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <node.icon size={20} />
                </div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, marginBottom: '0.5rem' }}>{node.step}</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>{node.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA section */}
      <section style={{ padding: '5rem 0', background: '#FFFFFF' }}>
        <div className="container">
          <div className="card glass-panel" style={{ background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.03) 0%, rgba(16, 185, 129, 0.03) 100%)', borderColor: 'rgba(0, 102, 255, 0.1)', padding: '3.5rem 2.5rem', borderRadius: '24px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.015em' }}>Join 50,000+ Happy Customers</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', marginBottom: '2rem', maxWidth: '520px', margin: '0.5rem auto 2rem' }}>
              Experience instant digital recharges, detailed transactions reporting, and double-entry ledger security. Create your account in under a minute.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <a href="/register" className="btn btn-primary hover-scale" style={{ color: '#FFFFFF', padding: '0.8rem 1.8rem', borderRadius: '12px' }}>Create Free Account</a>
              <a href="/become-agent" className="btn btn-secondary hover-scale" style={{ padding: '0.8rem 1.8rem', borderRadius: '12px' }}>Become a Reseller</a>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
