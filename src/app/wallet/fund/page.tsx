'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function WalletFundPage() {
  const router = useRouter();

  useEffect(() => {
    // Wallet funding is deprecated in favor of direct instant checkout
    const timer = setTimeout(() => {
      router.replace('/buy');
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#030712', color: '#F9FAFB', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '440px', background: '#0F172A', padding: '2.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: '#FACC15', margin: '0 auto 1.5rem' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem' }}>Direct Instant Checkout Active</h2>
        <p style={{ color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          Wallet pre-funding has been removed. You can now purchase data bundles and airtime instantly with direct Mobile Money or card payments.
        </p>
        <Link href="/buy" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.4rem', borderRadius: '10px', color: '#030712', background: '#FACC15', fontWeight: 700, textDecoration: 'none' }}>
          Proceed to Buy Data & Airtime <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
