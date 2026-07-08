'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';
import { HelpCircle, Calculator, ChevronRight } from 'lucide-react';

export default function Pricing() {
  const [selectedNetwork, setSelectedNetwork] = useState<'All' | 'MTN' | 'Telecel' | 'AirtelTigo'>('All');
  const [monthlySpend, setMonthlySpend] = useState<number>(2000);

  const fallbackServices = [
    { network: 'MTN', name: 'MTN CG Data 5GB', retail: 20.00, agent: 18.50, api: 18.00 },
    { network: 'MTN', name: 'MTN CG Data 10GB', retail: 40.00, agent: 37.00, api: 36.00 },
    { network: 'Telecel', name: 'Telecel Data 5GB', retail: 18.00, agent: 17.00, api: 16.50 },
    { network: 'Telecel', name: 'Telecel Data 10GB', retail: 35.00, agent: 33.00, api: 32.00 },
    { network: 'AirtelTigo', name: 'AirtelTigo Data 5GB', retail: 15.00, agent: 14.00, api: 13.50 },
    { network: 'AirtelTigo', name: 'AirtelTigo Data 10GB', retail: 28.00, agent: 26.00, api: 25.00 },
  ];

  const filteredServices = selectedNetwork === 'All'
    ? fallbackServices
    : fallbackServices.filter(s => s.network === selectedNetwork);

  // Profit/Savings Calculations based on expected monthly spend
  const calculateAgentSavings = (spend: number) => {
    return (spend * 0.065).toFixed(2); // Avg 6.5% discount
  };

  const calculateApiSavings = (spend: number) => {
    return (spend * 0.10).toFixed(2); // Avg 10% discount
  };

  return (
    <PublicLayout>
      {/* Header */}
      <section style={{ padding: '6.5rem 0 3.5rem', background: 'radial-gradient(120% 120% at 50% -20%, rgba(0, 102, 255, 0.04) 0%, rgba(255, 255, 255, 0) 100%)', textAlign: 'center' }}>
        <div className="container animate-fade-up" style={{ maxWidth: '800px' }}>
          <span className="badge badge-blue" style={{ textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>Transparent Rates</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Affordable <span className="text-gradient">VTU Pricing Tiers</span>
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Unlock lower rates as your transaction volume grows. Switch accounts easily between Retail, Agent, and API tiers.
          </p>
        </div>
      </section>

      {/* Network Tabs */}
      <section style={{ padding: '1rem 0 2rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {['All', 'MTN', 'Telecel', 'AirtelTigo'].map((net) => (
            <button
              key={net}
              onClick={() => setSelectedNetwork(net as any)}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: selectedNetwork === net ? 'var(--color-brand-primary)' : '#FFFFFF',
                color: selectedNetwork === net ? '#FFFFFF' : 'var(--color-text-secondary)',
                border: selectedNetwork === net ? '1.5px solid var(--color-brand-primary)' : '1.5px solid var(--color-border)',
                transition: 'all 0.2s'
              }}
              className="hover-scale"
            >
              {net === 'All' ? '⚡ Show All' : net === 'MTN' ? '🟡 MTN' : net === 'Telecel' ? '🔴 Telecel' : '🔵 AirtelTigo'}
            </button>
          ))}
        </div>

        {/* Pricing Database Table */}
        <div className="container">
          <div className="card glass-panel" style={{ border: '1px solid var(--color-border)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', marginBottom: '4rem' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid var(--color-border)', background: 'rgba(241, 245, 249, 0.6)' }}>
                    <th style={{ padding: '1.25rem 1.75rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>Carrier</th>
                    <th style={{ padding: '1.25rem 1.75rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>Package</th>
                    <th style={{ padding: '1.25rem 1.75rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>Retail (₵)</th>
                    <th style={{ padding: '1.25rem 1.75rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>Reseller Agent (₵)</th>
                    <th style={{ padding: '1.25rem 1.75rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>API Partner (₵)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((svc, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)', transition: 'background var(--transition-fast)' }} className="hover-glow">
                      <td style={{ padding: '1.25rem 1.75rem' }}>
                        <span 
                          style={{ 
                            fontSize: '0.72rem', 
                            fontWeight: 800, 
                            padding: '0.3rem 0.65rem', 
                            borderRadius: '8px', 
                            backgroundColor: svc.network === 'MTN' ? '#FFCC00' : svc.network === 'Telecel' ? '#E4062C' : '#0057A0', 
                            color: svc.network === 'MTN' ? '#000' : '#FFF'
                          }}
                        >
                          {svc.network}
                        </span>
                      </td>
                      <td style={{ padding: '1.25rem 1.75rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{svc.name}</td>
                      <td style={{ padding: '1.25rem 1.75rem', color: 'var(--color-text-secondary)', fontFamily: 'monospace', fontWeight: 600 }}>₵{svc.retail.toFixed(2)}</td>
                      <td style={{ padding: '1.25rem 1.75rem', color: 'var(--color-brand-primary)', fontFamily: 'monospace', fontWeight: 700 }}>₵{svc.agent.toFixed(2)}</td>
                      <td style={{ padding: '1.25rem 1.75rem', color: '#10B981', fontFamily: 'monospace', fontWeight: 700 }}>₵{svc.api.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Savings Calculator */}
          <div className="card glass-panel" style={{ padding: '3rem 2rem', borderRadius: '24px', border: '1px solid rgba(0, 102, 255, 0.1)', background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.02) 0%, rgba(16, 185, 129, 0.02) 100%)', marginBottom: '4rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem', alignItems: 'center' }} className="hero-grid">
              
              {/* Slider Inputs */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Calculator size={20} style={{ color: 'var(--color-brand-primary)' }} />
                  <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--color-brand-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Profit margins</span>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.25rem' }}>Expected Monthly Reseller Calculator</h3>
                
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: '1.5', marginBottom: '2rem' }}>
                  Adjust the slider below to represent your projected carrier transactions volume. See how much money you save or earn back directly on the ledger.
                </p>

                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.9rem' }}>
                    <span>Monthly Sales volume</span>
                    <span style={{ fontFamily: 'monospace', color: 'var(--color-brand-primary)' }}>GH₵ {monthlySpend.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="15000"
                    step="200"
                    value={monthlySpend}
                    onChange={(e) => setMonthlySpend(parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      cursor: 'pointer',
                      height: '6px',
                      background: 'var(--color-border-strong)',
                      borderRadius: '4px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Calculations results */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
                
                {/* Agent Card */}
                <div className="card" style={{ padding: '1.5rem', background: '#FFFFFF', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-brand-primary)' }}>Reseller Agent</span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-text-primary)', margin: '0.5rem 0', fontFamily: 'monospace' }}>
                    ₵{calculateAgentSavings(monthlySpend)}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Estimated earnings/mo</span>
                </div>

                {/* API Partner Card */}
                <div className="card" style={{ padding: '1.5rem', background: '#FFFFFF', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#10B981' }}>API Integrator</span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10B981', margin: '0.5rem 0', fontFamily: 'monospace' }}>
                    ₵{calculateApiSavings(monthlySpend)}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Estimated earnings/mo</span>
                </div>

              </div>

            </div>
          </div>

          {/* Action grid links */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>Save More as an Agent</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                Join as a reseller/agent to instantly enjoy lower wholesale pricing on data, airtime and utility bills. Start with zero deposit!
              </p>
              <Link href="/register?role=agent" className="btn btn-primary hover-scale" style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', color: '#FFF' }}>
                Apply for Agent Tier <ChevronRight size={16} />
              </Link>
            </div>

            <div className="card" style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10B981' }}>Automate with our API</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                Connect your website or mobile application directly to our transaction gateway rails for high-volume automated processing.
              </p>
              <Link href="/api-docs" className="btn btn-secondary hover-scale" style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
                Read API Documentation <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
