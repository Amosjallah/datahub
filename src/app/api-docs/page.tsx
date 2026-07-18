'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';
import { Terminal, Shield, Copy, Check, ExternalLink, Cpu } from 'lucide-react';

export default function ApiDocs() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const codeBlocks = {
    auth: `curl -X GET https://api.fadigitalservices.com/v1/wallet/balance \\
  -H "Authorization: Bearer fa_sec_live_5x8a92..."`,
    balanceResponse: `{
  "status": "success",
  "data": {
    "balance": 1845.50,
    "currency": "GHS",
    "updated_at": "2026-07-08T12:00:00Z"
  }
}`,
    purchaseRequest: `curl -X POST https://api.fadigitalservices.com/v1/transaction/purchase \\
  -H "Authorization: Bearer fa_sec_live_5x8a92..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "service_id": 102,
    "recipient": "0241234567",
    "request_id": "tx_unique_req_99824"
  }'`
  };

  return (
    <PublicLayout>
      {/* Header */}
      <section style={{ padding: '6.5rem 0 3.5rem', background: 'radial-gradient(120% 120% at 50% -20%, rgba(0, 102, 255, 0.04) 0%, rgba(255, 255, 255, 0) 100%)', textAlign: 'center' }}>
        <div className="container animate-fade-up" style={{ maxWidth: '800px' }}>
          <span className="badge badge-blue" style={{ textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>Developer Portal</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Automate with <span className="text-gradient">REST APIs & SDKs</span>
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Build custom digital payment platforms. Connect directly to our carrier transaction rails with average latency under 150ms.
          </p>
        </div>
      </section>

      {/* Main Grid Docs */}
      <section style={{ padding: '2rem 0 5rem' }}>
        <div className="container hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem', alignItems: 'start' }}>
          
          {/* Left Column: API documentation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            
            {/* Authentications */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Shield size={20} style={{ color: 'var(--color-brand-primary)' }} />
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Authentication</h2>
              </div>
              <p style={{ fontSize: '0.92rem', lineHeight: '1.65', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
                Authenticate your API requests by including your Secret API Key as a Bearer token in the request HTTP header. Keep keys secure; do not share them in frontend repositories or client applications.
              </p>
              
              <div className="card" style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                {/* Header of code block */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', background: '#0B132B', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontFamily: 'monospace' }}>AUTHORIZATION HEADER EXAMPLE</span>
                  <button
                    onClick={() => handleCopy('Authorization: Bearer fa_sec_live_...', 'auth_header')}
                    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem' }}
                  >
                    {copiedKey === 'auth_header' ? <Check size={12} style={{ color: '#10B981' }} /> : <Copy size={12} />}
                    {copiedKey === 'auth_header' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div style={{ padding: '1rem', overflowX: 'auto' }}>
                  <code style={{ color: '#E2E8F0', fontSize: '0.85rem', fontFamily: 'monospace', whiteSpace: 'pre' }}>
                    Authorization: Bearer fa_sec_live_...
                  </code>
                </div>
              </div>
            </div>

            {/* Endpoint 1: Balance */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.3rem 0.6rem', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', fontFamily: 'monospace' }}>GET</span>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Retrieve Wallet Balance</h2>
              </div>
              <p style={{ fontSize: '0.92rem', lineHeight: '1.65', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
                Fetch current ledger cash balances of your reseller partner profile.
              </p>
              
              <div className="card" style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', background: '#0B132B', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontFamily: 'monospace' }}>API ENDPOINT REQUEST</span>
                  <button
                    onClick={() => handleCopy(codeBlocks.auth, 'auth_curl')}
                    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem' }}
                  >
                    {copiedKey === 'auth_curl' ? <Check size={12} style={{ color: '#10B981' }} /> : <Copy size={12} />}
                    {copiedKey === 'auth_curl' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div style={{ padding: '1.25rem 1rem', overflowX: 'auto' }}>
                  <pre style={{ margin: 0 }}><code style={{ color: '#E2E8F0', fontSize: '0.85rem', fontFamily: 'monospace' }}>{codeBlocks.auth}</code></pre>
                </div>
              </div>

              <div className="card" style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', background: '#0B132B', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontFamily: 'monospace' }}>HTTP 200 SUCCESS RESPONSE JSON</span>
                  <button
                    onClick={() => handleCopy(codeBlocks.balanceResponse, 'bal_resp')}
                    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem' }}
                  >
                    {copiedKey === 'bal_resp' ? <Check size={12} style={{ color: '#10B981' }} /> : <Copy size={12} />}
                    {copiedKey === 'bal_resp' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div style={{ padding: '1.25rem 1rem', overflowX: 'auto' }}>
                  <pre style={{ margin: 0 }}><code style={{ color: '#38BDF8', fontSize: '0.85rem', fontFamily: 'monospace' }}>{codeBlocks.balanceResponse}</code></pre>
                </div>
              </div>
            </div>

            {/* Endpoint 2: Purchase */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.3rem 0.6rem', borderRadius: '8px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', fontFamily: 'monospace' }}>POST</span>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Purchase Utilities</h2>
              </div>
              <p style={{ fontSize: '0.92rem', lineHeight: '1.65', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
                Initiate a data bundle purchase, voice top-up, or educational check pin generation transaction.
              </p>
              
              <div className="card" style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', background: '#0B132B', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontFamily: 'monospace' }}>API ENDPOINT REQUEST</span>
                  <button
                    onClick={() => handleCopy(codeBlocks.purchaseRequest, 'purch_req')}
                    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem' }}
                  >
                    {copiedKey === 'purch_req' ? <Check size={12} style={{ color: '#10B981' }} /> : <Copy size={12} />}
                    {copiedKey === 'purch_req' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div style={{ padding: '1.25rem 1rem', overflowX: 'auto' }}>
                  <pre style={{ margin: 0 }}><code style={{ color: '#E2E8F0', fontSize: '0.85rem', fontFamily: 'monospace' }}>{codeBlocks.purchaseRequest}</code></pre>
                </div>
              </div>

              {/* Endpoint Parameters Table */}
              <div className="card" style={{ padding: '1.5rem', border: '1px solid var(--color-border)' }}>
                <h4 style={{ fontWeight: 800, marginBottom: '1rem', fontSize: '0.95rem' }}>POST PAYLOAD PARAMETERS</h4>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                        <th style={{ padding: '0.5rem' }}>Key</th>
                        <th style={{ padding: '0.5rem' }}>Type</th>
                        <th style={{ padding: '0.5rem' }}>Status</th>
                        <th style={{ padding: '0.5rem' }}>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '0.65rem 0.5rem', fontFamily: 'monospace', fontWeight: 700 }}>service_id</td>
                        <td style={{ padding: '0.65rem 0.5rem', color: '#8B5CF6' }}>integer</td>
                        <td style={{ padding: '0.65rem 0.5rem', fontWeight: 700, color: '#EF4444' }}>REQUIRED</td>
                        <td style={{ padding: '0.65rem 0.5rem', color: 'var(--color-text-secondary)' }}>ID of the bundle or bill product. See services list.</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '0.65rem 0.5rem', fontFamily: 'monospace', fontWeight: 700 }}>recipient</td>
                        <td style={{ padding: '0.65rem 0.5rem', color: '#8B5CF6' }}>string</td>
                        <td style={{ padding: '0.65rem 0.5rem', fontWeight: 700, color: '#EF4444' }}>REQUIRED</td>
                        <td style={{ padding: '0.65rem 0.5rem', color: 'var(--color-text-secondary)' }}>Carrier phone number (+233 format) or utility meter account ID.</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '0.65rem 0.5rem', fontFamily: 'monospace', fontWeight: 700 }}>request_id</td>
                        <td style={{ padding: '0.65rem 0.5rem', color: '#8B5CF6' }}>string</td>
                        <td style={{ padding: '0.65rem 0.5rem', fontWeight: 700, color: '#EF4444' }}>REQUIRED</td>
                        <td style={{ padding: '0.65rem 0.5rem', color: 'var(--color-text-secondary)' }}>Unique reference string for idempotency audits to prevent duplicates.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: API context & details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Base Configuration details */}
            <div className="card glass-panel" style={{ padding: '2rem 1.5rem', border: '1px solid var(--color-border)', borderRadius: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Terminal size={18} style={{ color: 'var(--color-brand-primary)' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Gateway Details</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Base API URL</span>
                  <code style={{ fontSize: '0.82rem', color: 'var(--color-brand-primary)', fontFamily: 'monospace', fontWeight: 700 }}>https://api.fadigitalservices.com/v1</code>
                </div>
                
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                  <span style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Response Format</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>JSON (Content-Type: application/json)</span>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                  <span style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>API Rate Limiting</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>120 requests per minute</span>
                </div>
              </div>
            </div>

            {/* SDK CTA box */}
            <div className="card glass-panel" style={{ padding: '2rem 1.5rem', borderRadius: '20px', border: '1px solid rgba(0, 102, 255, 0.1)', background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.03) 0%, rgba(16, 185, 129, 0.03) 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Cpu size={18} style={{ color: 'var(--color-brand-primary)' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Need SDK access?</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                Download official wrapper scripts for Node.js, PHP, and Python to integrate inside your project with three lines of code.
              </p>
              
              <Link 
                href="/contact" 
                className="btn btn-primary btn-sm hover-scale" 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  color: '#FFFFFF', 
                  borderRadius: '10px',
                  fontWeight: 700
                }}
              >
                Request SDK Keys <ExternalLink size={14} />
              </Link>
            </div>

          </div>

        </div>
      </section>
    </PublicLayout>
  );
}
