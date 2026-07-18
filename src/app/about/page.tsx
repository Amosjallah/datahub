'use client';

import React from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';
import { Target, Eye, ShieldCheck, RefreshCw, Cpu } from 'lucide-react';

export default function About() {
  return (
    <PublicLayout>
      {/* Page Header */}
      <section style={{ padding: '5rem 0 3rem', background: '#030712', textAlign: 'center' }}>
        <div className="container animate-fade-up" style={{ maxWidth: '800px' }}>
          <span style={{ color: '#FACC15', textTransform: 'uppercase', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.12em', display: 'block', marginBottom: '0.75rem' }}>Our Story</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '1.25rem', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Connecting Ghanaians to <span className="text-gradient">Instant Digital Rails</span>
          </h1>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#9CA3AF' }}>
            FA DIGITAL SERVICES LTD. is Ghana's leading virtual top-up (VTU) e-commerce and bills gateway, delivering instant and reliable utility transactions for consumers and reseller agents nationwide.
          </p>
        </div>
      </section>

      {/* Mission & Vision cards */}
      <section style={{ padding: '3rem 0', backgroundColor: '#030712' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          
          {/* Mission Card */}
          <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: '#0F172A' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', backgroundColor: 'rgba(250, 204, 21, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FACC15' }}>
              <Target size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem', color: '#FFFFFF' }}>Our Mission</h3>
              <p style={{ fontSize: '0.92rem', color: '#9CA3AF', lineHeight: '1.65' }}>
                To provide the fastest, safest, and most convenient digital recharge and payment platform for everyday consumers and reseller agents in Ghana, lowering costs and increasing reliability.
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: '#0F172A' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', backgroundColor: 'rgba(16, 185, 129, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
              <Eye size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem', color: '#FFFFFF' }}>Our Vision</h3>
              <p style={{ fontSize: '0.92rem', color: '#9CA3AF', lineHeight: '1.65' }}>
                To become the premier gateway for digital utility transaction rails in West Africa, powering both individual and business payments with absolute transparency.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Difference/Ledger Section */}
      <section style={{ padding: '5rem 0', backgroundColor: '#030712', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: '#FACC15', textTransform: 'uppercase', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.12em', display: 'block', marginBottom: '0.5rem' }}>How We Operate</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>Ledger-Centric Security Model</h2>
            <p style={{ color: '#9CA3AF', fontSize: '0.95rem', marginTop: '0.5rem' }}>
              We do not believe in missing funds. Our platform runs on automated ledger audits.
            </p>
          </div>

          <p style={{ fontSize: '1rem', lineHeight: '1.7', color: '#9CA3AF', marginBottom: '3rem', textAlign: 'center' }}>
            Unlike other top-up systems, we operate a fully ledger-centric balance system. That means every single GHS ₵1 you deposit is backed by automated double-entry ledger audits. If an automated upstream provider fails to fulfill your data bundle, our system triggers an instant automated refund back to your wallet ledger. No delays, no manual disputes, and no lost funds.
          </p>

          {/* Process Flow visualization */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: Cpu, step: '1. Transaction Triggered', desc: 'Your API request or form purchase starts. Ledger records a pending debit.' },
              { icon: ShieldCheck, step: '2. Gateway Routing', desc: 'We route to carrier networks using fallback routes for 99.9% delivery.' },
              { icon: RefreshCw, step: '3. Smart Audits', desc: 'Failed provider calls trigger instant, automated ledger refunds back to your balance.' }
            ].map((node, i) => (
              <div key={i} className="card" style={{ padding: '1.75rem', backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '1rem', right: '1.25rem', fontSize: '1.5rem', fontWeight: 900, color: 'rgba(250,204,21,0.05)' }}>0{i+1}</span>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(250,204,21,0.08)', color: '#FACC15', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', padding: '0.65rem' }}>
                  <node.icon size={20} />
                </div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, marginBottom: '0.5rem', color: '#FFFFFF' }}>{node.step}</h4>
                <p style={{ fontSize: '0.82rem', color: '#9CA3AF', lineHeight: '1.5' }}>{node.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA section */}
      <section style={{ padding: '5rem 0', backgroundColor: '#030712' }}>
        <div className="container">
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.02) 0%, rgba(16, 185, 129, 0.02) 100%)', borderColor: 'rgba(250, 204, 21, 0.1)', padding: '3.5rem 2.5rem', borderRadius: '24px', textAlign: 'center', maxWidth: '800px', margin: '0 auto', backgroundColor: '#0F172A' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.75rem', color: '#FFFFFF', letterSpacing: '-0.015em' }}>Join 50,000+ Happy Customers</h3>
            <p style={{ fontSize: '0.95rem', color: '#9CA3AF', marginBottom: '2rem', maxWidth: '520px', margin: '0.5rem auto 2rem' }}>
              Experience instant digital recharges, detailed transactions reporting, and double-entry ledger security. Create your account in under a minute.
            </p>
            <Link href="/register" className="btn btn-primary hover-scale" style={{ padding: '0.85rem 2rem', color: '#030712' }}>
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
