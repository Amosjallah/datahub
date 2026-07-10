'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';
import { Calculator, ChevronRight } from 'lucide-react';

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

  const calculateAgentSavings = (spend: number) => {
    return (spend * 0.065).toFixed(2); // Avg 6.5% discount
  };

  const calculateApiSavings = (spend: number) => {
    return (spend * 0.10).toFixed(2); // Avg 10% discount
  };

  return (
    <PublicLayout>
      {/* Header */}
      <section style={{ padding: '5rem 0 3rem', background: '#030712', textAlign: 'center' }}>
        <div className="container animate-fade-up" style={{ maxWidth: '800px' }}>
          <span style={{ color: '#FACC15', textTransform: 'uppercase', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.12em', display: 'block', marginBottom: '0.75rem' }}>Transparent Rates</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '1rem', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Affordable <span className="text-gradient">VTU Pricing Tiers</span>
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Unlock lower rates as your transaction volume grows. Switch accounts easily between Retail, Agent, and API tiers.
          </p>
        </div>
      </section>

      {/* Network Tabs */}
      <section style={{ padding: '1rem 0 4rem', backgroundColor: '#030712' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {['All', 'MTN', 'Telecel', 'AirtelTigo'].map((net) => (
            <button
              key={net}
              onClick={() => setSelectedNetwork(net as any)}
              style={{
                padding: '0.6rem 1.5rem',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: selectedNetwork === net ? '#FACC15' : '#0F172A',
                color: selectedNetwork === net ? '#030712' : '#9CA3AF',
                border: selectedNetwork === net ? '1.5px solid #FACC15' : '1.5px solid rgba(255,255,255,0.05)',
                transition: 'all 0.2s'
              }}
              className="hover-scale"
            >
              {net === 'All' ? '⚡ Show All' : net === 'MTN' ? 'MTN' : net === 'Telecel' ? 'Telecel' : 'AirtelTigo'}
            </button>
          ))}
        </div>

        {/* Pricing Database Table */}
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="card" style={{ border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', marginBottom: '4rem', backgroundColor: '#0F172A' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid rgba(255,255,255,0.08)', background: '#1E293B' }}>
                    <th style={{ padding: '1.25rem 1.75rem', fontWeight: 800, color: '#FFFFFF' }}>Carrier</th>
                    <th style={{ padding: '1.25rem 1.75rem', fontWeight: 800, color: '#FFFFFF' }}>Package</th>
                    <th style={{ padding: '1.25rem 1.75rem', fontWeight: 800, color: '#FFFFFF' }}>Retail (₵)</th>
                    <th style={{ padding: '1.25rem 1.75rem', fontWeight: 800, color: '#FFFFFF' }}>Reseller Agent (₵)</th>
                    <th style={{ padding: '1.25rem 1.75rem', fontWeight: 800, color: '#FACC15' }}>API Partner (₵)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((svc, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background var(--transition-fast)' }} className="hover-glow">
                      <td style={{ padding: '1.25rem 1.75rem' }}>
                        <span 
                          style={{ 
                            fontSize: '0.72rem', 
                            fontWeight: 800, 
                            padding: '0.3rem 0.65rem', 
                            borderRadius: '8px', 
                            backgroundColor: svc.network === 'MTN' ? 'rgba(250,204,21,0.1)' : svc.network === 'Telecel' ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)', 
                            color: svc.network === 'MTN' ? '#FACC15' : svc.network === 'Telecel' ? '#EF4444' : '#3B82F6'
                          }}
                        >
                          {svc.network}
                        </span>
                      </td>
                      <td style={{ padding: '1.25rem 1.75rem', fontWeight: 700, color: '#FFFFFF' }}>{svc.name}</td>
                      <td style={{ padding: '1.25rem 1.75rem', color: '#9CA3AF', fontFamily: 'monospace', fontWeight: 600 }}>₵{svc.retail.toFixed(2)}</td>
                      <td style={{ padding: '1.25rem 1.75rem', color: '#FFFFFF', fontFamily: 'monospace', fontWeight: 700 }}>₵{svc.agent.toFixed(2)}</td>
                      <td style={{ padding: '1.25rem 1.75rem', color: '#FACC15', fontFamily: 'monospace', fontWeight: 700 }}>₵{svc.api.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Savings Calculator */}
          <div className="card" style={{ padding: '3rem 2rem', borderRadius: '24px', border: '1px solid rgba(250, 204, 21, 0.1)', background: 'linear-gradient(135deg, #0F172A 0%, #030712 100%)', marginBottom: '4rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'center' }}>
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Calculator size={20} style={{ color: '#FACC15' }} />
                  <span style={{ fontWeight: 800, fontSize: '0.8rem', color: '#FACC15', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Profit margins</span>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.25rem', color: '#FFFFFF' }}>Expected Monthly Reseller Calculator</h3>
                
                <p style={{ fontSize: '0.88rem', color: '#9CA3AF', lineHeight: '1.5', marginBottom: '2rem' }}>
                  Adjust the slider below to represent your projected carrier transactions volume. See how much money you save or earn back directly on the ledger.
                </p>

                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.9rem', color: '#FFFFFF' }}>
                    <span>Monthly Sales Volume</span>
                    <span style={{ fontFamily: 'monospace', color: '#FACC15' }}>GH₵ {monthlySpend.toLocaleString()}</span>
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
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                      outline: 'none',
                      accentColor: '#FACC15'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Agent Card */}
                <div className="card" style={{ padding: '1.5rem', backgroundColor: '#0B0F19', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#FFFFFF' }}>Reseller Agent</span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FACC15', margin: '0.5rem 0', fontFamily: 'monospace' }}>
                    ₵{calculateAgentSavings(monthlySpend)}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>Estimated earnings/mo</span>
                </div>

                {/* API Partner Card */}
                <div className="card" style={{ padding: '1.5rem', backgroundColor: '#0B0F19', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#10B981' }}>API Integrator</span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10B981', margin: '0.5rem 0', fontFamily: 'monospace' }}>
                    ₵{calculateApiSavings(monthlySpend)}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>Estimated earnings/mo</span>
                </div>

              </div>

            </div>
          </div>

          {/* Action grid links */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FACC15' }}>Save More as an Agent</h3>
              <p style={{ fontSize: '0.9rem', color: '#9CA3AF', lineHeight: '1.6' }}>
                Join as a reseller/agent to instantly enjoy lower wholesale pricing on data, airtime and utility bills. Start with zero deposit!
              </p>
              <Link href="/register" className="btn btn-primary hover-scale" style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', color: '#030712' }}>
                Apply for Agent Tier <ChevronRight size={16} />
              </Link>
            </div>

            <div className="card" style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10B981' }}>Automate with our API</h3>
              <p style={{ fontSize: '0.9rem', color: '#9CA3AF', lineHeight: '1.6' }}>
                Connect your website or mobile application directly to our transaction gateway rails for high-volume automated processing.
              </p>
              <Link href="/api-docs" className="btn btn-secondary hover-scale" style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', color: '#FFFFFF', backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.08)' }}>
                Read API Documentation <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
