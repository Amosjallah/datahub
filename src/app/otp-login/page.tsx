'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function OtpLogin() {
  const router = useRouter();

  useEffect(() => {
    // Two-factor OTP login has been removed in favor of direct agent/admin credentials
    router.replace('/login');
  }, [router]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#030712', color: '#F9FAFB', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: '#FACC15', margin: '0 auto 1.5rem' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem' }}>Redirecting to Login...</h2>
        <p style={{ color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Two-factor OTP verification has been removed. Please sign in directly with your agent or admin credentials.
        </p>
        <Link href="/login" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={16} /> Go to Login
        </Link>
      </div>
    </div>
  );
}
