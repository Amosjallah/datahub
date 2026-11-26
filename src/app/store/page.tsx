'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import Logo from '@/components/Logo';

interface AgentInfo {
  business_name: string;
  full_name: string;
  referral_code: string;
}

function AgentStoreInner() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');
  const [agentInfo, setAgentInfo] = useState<AgentInfo | null>(null);
  const [loading, setLoading] = useState(!!ref);

  useEffect(() => {
    if (ref) {
      sessionStorage.setItem('referral_ref', ref);
      fetchAgentInfo(ref);
    }
  }, [ref]);

  const fetchAgentInfo = async (refCode: string) => {
    try {
      const res = await fetch(`/api/agent/store-info?ref=${refCode}`);
      const data = await res.json();
      if (data.agent) setAgentInfo(data.agent);
    } catch {}
    setLoading(false);
  };

  const storeName = agentInfo?.business_name || agentInfo?.full_name || 'QuickNet Data Store';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#030712', color: '#F9FAFB', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '500px', textAlign: 'center' }} className="animate-fade-up">
        <Logo />

        {loading ? (
          <div style={{ marginTop: '3rem' }}>
            <Loader2 className="animate-spin" size={28} style={{ color: '#FACC15', marginBottom: '1rem' }} />
            <p style={{ color: '#9CA3AF' }}>Loading store...</p>
          </div>
        ) : (
          <>
            <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.25)', borderRadius: '20px', padding: '0.4rem 0.9rem', marginBottom: '1rem' }}>
                <ShoppingBag size={14} style={{ color: '#FACC15' }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FACC15' }}>AUTHORIZED DATA RESELLER</span>
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1.2, marginBottom: '0.75rem', color: '#FFFFFF' }}>
                Welcome to <br /><span style={{ color: '#FACC15' }}>{storeName}</span>
              </h1>
              <p style={{ color: '#9CA3AF', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Buy cheap MTN, Telecel & AirtelTigo data bundles here. Fast delivery, best prices.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link
                href={`/buy${ref ? `?ref=${ref}` : ''}`}
                className="btn btn-primary"
                style={{ width: '100%', height: '52px', fontSize: '1rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#030712', borderRadius: '14px' }}
              >
                <ShoppingBag size={20} /> Buy Data Now <ArrowRight size={18} />
              </Link>
              <Link href="/register" style={{ color: '#9CA3AF', fontSize: '0.84rem', textDecoration: 'none' }}>
                Want to sell data too? <span style={{ color: '#FACC15', fontWeight: 700 }}>Register as an agent →</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function AgentStorePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#030712' }} />}>
      <AgentStoreInner />
    </Suspense>
  );
}
