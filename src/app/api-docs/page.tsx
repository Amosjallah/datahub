'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';
import { Terminal, Shield, Copy, Check, ExternalLink, Cpu, Zap, Database, PhoneCall, Receipt, ArrowRight } from 'lucide-react';

export default function ApiDocs() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const codeBlocks = {
    authHeader: `Authorization: Bearer fa_sec_live_your_api_key_here`,
    servicesCurl: `curl -X GET https://quicknetdata.com/api/v1/services \\
  -H "Authorization: Bearer fa_sec_live_your_api_key_here"`,
    servicesResponse: `{
  "status": "success",
  "count": 22,
  "data": [
    {
      "id": "MTN_5GB",
      "name": "MTN Data 5GB",
      "type": "data",
      "network": "MTN",
      "volume": "5GB",
      "retail_price": 23.00,
      "agent_price": 21.00,
      "api_price": 20.20,
      "validity": "Non-Expiry",
      "status": "available"
    },
    {
      "id": "AIRTIME_MTN",
      "name": "MTN Airtime Top-Up",
      "type": "airtime",
      "network": "MTN",
      "retail_price": 1.00,
      "agent_price": 0.97,
      "api_price": 0.96,
      "status": "available"
    }
  ]
}`,
    balanceCurl: `curl -X GET https://quicknetdata.com/api/v1/wallet/balance \\
  -H "Authorization: Bearer fa_sec_live_your_api_key_here"`,
    balanceResponse: `{
  "status": "success",
  "data": {
    "account_name": "QuickNet Partner",
    "role": "api_partner",
    "wallet_id": "wal_892b1",
    "balance": "1450.00",
    "currency": "GHS",
    "timestamp": "2026-10-07T17:30:00Z"
  }
}`,
    purchaseDataCurl: `curl -X POST https://quicknetdata.com/api/v1/data \\
  -H "Authorization: Bearer fa_sec_live_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "service_id": "MTN_10GB",
    "recipient": "0241234567",
    "network": "MTN",
    "request_id": "TXN_CLIENT_99218"
  }'`,
    purchaseAirtimeCurl: `curl -X POST https://quicknetdata.com/api/v1/airtime \\
  -H "Authorization: Bearer fa_sec_live_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "recipient": "0559876543",
    "amount": 20.00,
    "network": "MTN",
    "request_id": "TXN_AIR_55412"
  }'`,
    purchaseBillCurl: `curl -X POST https://quicknetdata.com/api/v1/bills \\
  -H "Authorization: Bearer fa_sec_live_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "account_number": "14120938491",
    "amount": 50.00,
    "network": "ECG",
    "request_id": "TXN_ECG_88201"
  }'`,
    purchaseResponse: `{
  "status": "success",
  "data": {
    "reference": "TXN_CLIENT_99218",
    "provider_reference": "DMG_ORD_449102",
    "service": "MTN Data 10GB",
    "network": "MTN",
    "recipient": "0241234567",
    "amount_debited": 38.00,
    "currency": "GHS",
    "transaction_status": "delivered",
    "message": "Data bundle dispatched successfully",
    "created_at": "2026-10-07T17:30:05Z"
  }
}`,
    statusCurl: `curl -X GET https://quicknetdata.com/api/v1/transaction/status/TXN_CLIENT_99218 \\
  -H "Authorization: Bearer fa_sec_live_your_api_key_here"`,
    statusResponse: `{
  "status": "success",
  "data": {
    "reference": "TXN_CLIENT_99218",
    "status": "delivered",
    "provider_reference": "DMG_ORD_449102",
    "success": true
  }
}`
  };

  return (
    <PublicLayout>
      {/* Header */}
      <section style={{ padding: '6.5rem 0 3.5rem', background: '#030712', textAlign: 'center' }}>
        <div className="container animate-fade-up" style={{ maxWidth: '850px' }}>
          <span style={{ color: '#FACC15', textTransform: 'uppercase', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.12em', display: 'block', marginBottom: '0.75rem' }}>
            ⚡ Developer Documentation
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, marginBottom: '1rem', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Integrate all services with our <span className="text-gradient">REST API</span>
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Direct access to data bundles, airtime, ECG electricity, Ghana Water, and DStv/GOtv subscriptions. Dual carrier routing with 99.9% uptime.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ padding: '0.4rem 1rem', background: 'rgba(250, 204, 21, 0.1)', color: '#FACC15', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700 }}>
              MTN · Telecel · AirtelTigo
            </span>
            <span style={{ padding: '0.4rem 1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700 }}>
              ECG & GWCL Utilities
            </span>
            <span style={{ padding: '0.4rem 1rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700 }}>
              Cable TV (DStv, GOtv, StarTimes)
            </span>
          </div>
        </div>
      </section>

      {/* Main Grid Docs */}
      <section style={{ padding: '2rem 0 5rem', backgroundColor: '#030712' }}>
        <div className="container" style={{ maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
          
          {/* Section 1: Authentication */}
          <div className="card" style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <Shield size={24} style={{ color: '#FACC15' }} />
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>API Key Authentication</h2>
            </div>
            <p style={{ fontSize: '0.92rem', lineHeight: '1.65', color: '#9CA3AF', marginBottom: '1.25rem' }}>
              Authenticate your requests by including your secret API key in the <code style={{ color: '#FACC15' }}>Authorization: Bearer &lt;API_KEY&gt;</code> or <code style={{ color: '#FACC15' }}>x-api-key: &lt;API_KEY&gt;</code> HTTP header.
            </p>
            
            <div style={{ background: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 1rem', background: '#1E293B', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'monospace' }}>AUTHORIZATION HEADER</span>
                <button
                  onClick={() => handleCopy(codeBlocks.authHeader, 'auth_header')}
                  style={{ background: 'none', border: 'none', color: '#FACC15', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 700 }}
                >
                  {copiedKey === 'auth_header' ? <Check size={14} style={{ color: '#10B981' }} /> : <Copy size={14} />}
                  {copiedKey === 'auth_header' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div style={{ padding: '1rem', overflowX: 'auto' }}>
                <code style={{ color: '#FACC15', fontSize: '0.88rem', fontFamily: 'monospace' }}>{codeBlocks.authHeader}</code>
              </div>
            </div>
          </div>

          {/* Section 2: Services Catalog */}
          <div className="card" style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.6rem', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10B981', fontFamily: 'monospace' }}>GET</span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>List Available Services & Wholesale Pricing</h2>
            </div>
            <p style={{ fontSize: '0.92rem', color: '#9CA3AF', marginBottom: '1.25rem' }}>
              Endpoint: <code style={{ color: '#FACC15' }}>/api/v1/services</code>. Query all packages with retail, agent, and API partner rates. Filters: <code style={{ color: '#9CA3AF' }}>?type=data</code>, <code style={{ color: '#9CA3AF' }}>?network=MTN</code>.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              <div style={{ background: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', background: '#1E293B', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'monospace' }}>CURL REQUEST</span>
                  <button
                    onClick={() => handleCopy(codeBlocks.servicesCurl, 'svc_curl')}
                    style={{ background: 'none', border: 'none', color: '#FACC15', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 700 }}
                  >
                    {copiedKey === 'svc_curl' ? <Check size={14} style={{ color: '#10B981' }} /> : <Copy size={14} />}
                    {copiedKey === 'svc_curl' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div style={{ padding: '1rem', overflowX: 'auto' }}>
                  <pre style={{ margin: 0 }}><code style={{ color: '#E2E8F0', fontSize: '0.85rem', fontFamily: 'monospace' }}>{codeBlocks.servicesCurl}</code></pre>
                </div>
              </div>

              <div style={{ background: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '0.5rem 1rem', background: '#1E293B', fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'monospace' }}>SAMPLE JSON RESPONSE</div>
                <div style={{ padding: '1rem', overflowX: 'auto' }}>
                  <pre style={{ margin: 0 }}><code style={{ color: '#38BDF8', fontSize: '0.82rem', fontFamily: 'monospace' }}>{codeBlocks.servicesResponse}</code></pre>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Wallet Balance */}
          <div className="card" style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.6rem', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10B981', fontFamily: 'monospace' }}>GET</span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>Check Partner Wallet Balance</h2>
            </div>
            <p style={{ fontSize: '0.92rem', color: '#9CA3AF', marginBottom: '1.25rem' }}>
              Endpoint: <code style={{ color: '#FACC15' }}>/api/v1/wallet/balance</code>. Returns your developer wallet balance in Ghanaian Cedis (GHS).
            </p>

            <div style={{ background: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', background: '#1E293B', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'monospace' }}>CURL REQUEST</span>
                <button
                  onClick={() => handleCopy(codeBlocks.balanceCurl, 'bal_curl')}
                  style={{ background: 'none', border: 'none', color: '#FACC15', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 700 }}
                >
                  {copiedKey === 'bal_curl' ? <Check size={14} style={{ color: '#10B981' }} /> : <Copy size={14} />}
                  {copiedKey === 'bal_curl' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div style={{ padding: '1rem', overflowX: 'auto' }}>
                <pre style={{ margin: 0 }}><code style={{ color: '#E2E8F0', fontSize: '0.85rem', fontFamily: 'monospace' }}>{codeBlocks.balanceCurl}</code></pre>
              </div>
            </div>
          </div>

          {/* Section 4: Purchase Services */}
          <div className="card" style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.6rem', borderRadius: '6px', backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6', fontFamily: 'monospace' }}>POST</span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>Unified Purchase Endpoints</h2>
            </div>
            <p style={{ fontSize: '0.92rem', color: '#9CA3AF', marginBottom: '1.5rem' }}>
              Purchase any telecom package or utility service. Debits your developer wallet at API wholesale partner pricing.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Purchase Data */}
              <div>
                <h4 style={{ color: '#FACC15', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>1. Data Bundle Recharge (<code style={{ color: '#FFFFFF' }}>/api/v1/data</code> or <code style={{ color: '#FFFFFF' }}>/api/v1/transaction/purchase</code>)</h4>
                <div style={{ background: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', background: '#1E293B', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'monospace' }}>BUY DATA BUNDLE</span>
                    <button
                      onClick={() => handleCopy(codeBlocks.purchaseDataCurl, 'data_curl')}
                      style={{ background: 'none', border: 'none', color: '#FACC15', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 700 }}
                    >
                      {copiedKey === 'data_curl' ? <Check size={14} style={{ color: '#10B981' }} /> : <Copy size={14} />}
                      {copiedKey === 'data_curl' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div style={{ padding: '1rem', overflowX: 'auto' }}>
                    <pre style={{ margin: 0 }}><code style={{ color: '#E2E8F0', fontSize: '0.85rem', fontFamily: 'monospace' }}>{codeBlocks.purchaseDataCurl}</code></pre>
                  </div>
                </div>
              </div>

              {/* Purchase Airtime */}
              <div>
                <h4 style={{ color: '#FACC15', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>2. Airtime Top-Up (<code style={{ color: '#FFFFFF' }}>/api/v1/airtime</code>)</h4>
                <div style={{ background: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', background: '#1E293B', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'monospace' }}>BUY AIRTIME</span>
                    <button
                      onClick={() => handleCopy(codeBlocks.purchaseAirtimeCurl, 'air_curl')}
                      style={{ background: 'none', border: 'none', color: '#FACC15', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 700 }}
                    >
                      {copiedKey === 'air_curl' ? <Check size={14} style={{ color: '#10B981' }} /> : <Copy size={14} />}
                      {copiedKey === 'air_curl' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div style={{ padding: '1rem', overflowX: 'auto' }}>
                    <pre style={{ margin: 0 }}><code style={{ color: '#E2E8F0', fontSize: '0.85rem', fontFamily: 'monospace' }}>{codeBlocks.purchaseAirtimeCurl}</code></pre>
                  </div>
                </div>
              </div>

              {/* Purchase Bills */}
              <div>
                <h4 style={{ color: '#FACC15', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>3. Electricity, Water & Cable TV (<code style={{ color: '#FFFFFF' }}>/api/v1/bills</code>)</h4>
                <div style={{ background: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', background: '#1E293B', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'monospace' }}>PAY BILL</span>
                    <button
                      onClick={() => handleCopy(codeBlocks.purchaseBillCurl, 'bill_curl')}
                      style={{ background: 'none', border: 'none', color: '#FACC15', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 700 }}
                    >
                      {copiedKey === 'bill_curl' ? <Check size={14} style={{ color: '#10B981' }} /> : <Copy size={14} />}
                      {copiedKey === 'bill_curl' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div style={{ padding: '1rem', overflowX: 'auto' }}>
                    <pre style={{ margin: 0 }}><code style={{ color: '#E2E8F0', fontSize: '0.85rem', fontFamily: 'monospace' }}>{codeBlocks.purchaseBillCurl}</code></pre>
                  </div>
                </div>
              </div>

              {/* Response */}
              <div style={{ background: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '0.5rem 1rem', background: '#1E293B', fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'monospace' }}>PURCHASE SUCCESS RESPONSE</div>
                <div style={{ padding: '1rem', overflowX: 'auto' }}>
                  <pre style={{ margin: 0 }}><code style={{ color: '#38BDF8', fontSize: '0.82rem', fontFamily: 'monospace' }}>{codeBlocks.purchaseResponse}</code></pre>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Transaction Status */}
          <div className="card" style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.6rem', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10B981', fontFamily: 'monospace' }}>GET</span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>Check Transaction Status</h2>
            </div>
            <p style={{ fontSize: '0.92rem', color: '#9CA3AF', marginBottom: '1.25rem' }}>
              Endpoint: <code style={{ color: '#FACC15' }}>/api/v1/transaction/status/[reference]</code>. Query the live fulfillment status across carrier gateways.
            </p>

            <div style={{ background: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', background: '#1E293B', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'monospace' }}>QUERY STATUS</span>
                <button
                  onClick={() => handleCopy(codeBlocks.statusCurl, 'stat_curl')}
                  style={{ background: 'none', border: 'none', color: '#FACC15', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 700 }}
                >
                  {copiedKey === 'stat_curl' ? <Check size={14} style={{ color: '#10B981' }} /> : <Copy size={14} />}
                  {copiedKey === 'stat_curl' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div style={{ padding: '1rem', overflowX: 'auto' }}>
                <pre style={{ margin: 0 }}><code style={{ color: '#E2E8F0', fontSize: '0.85rem', fontFamily: 'monospace' }}>{codeBlocks.statusCurl}</code></pre>
              </div>
            </div>
          </div>

        </div>
      </section>
    </PublicLayout>
  );
}
