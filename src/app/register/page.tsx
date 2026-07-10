'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';
import { supabase } from '@/lib/supabase';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate signup
    setTimeout(() => {
      setLoading(false);
      router.push('/buy');
    }, 1000);
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      alert(err.message || 'Failed to initialize Google login');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#030712', color: '#F9FAFB' }}>
      
      {/* Left Column - Branding (Hidden on mobile) */}
      <aside 
        style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          padding: '3rem', 
          background: 'linear-gradient(135deg, #0F172A 0%, #030712 100%)', 
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'relative'
        }}
        className="hide-mobile"
      >
        <div style={{ zIndex: 2 }}>
          <Link href="/buy" style={{ textDecoration: 'none' }}>
            <Logo size={40} />
          </Link>
        </div>

        <div style={{ zIndex: 2, maxWidth: '460px', margin: 'auto 0' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: '1.2', marginBottom: '1rem', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Join Ghana's #1 Cheapest Data Platform 🇬🇭
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
            Create a free account to unlock cheaper agent rates, track orders in real-time, and run your reseller business with zero setup fees.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.5rem' }}>⚡</span>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>Instant Data Delivery</h3>
                <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginTop: '0.15rem' }}>Orders are processed instantly with automatic delivery updates.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.5rem' }}>💰</span>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>Wholesale Reseller Rates</h3>
                <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginTop: '0.15rem' }}>Save up to 10% on MTN, Telecel, and AirtelTigo bundles.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.5rem' }}>🛡️</span>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>Ledger Refund Security</h3>
                <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginTop: '0.15rem' }}>Failed transactions are automatically refunded to your wallet immediately.</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9CA3AF', fontSize: '0.875rem' }}>
          <span>💬</span>
          <span>Join 30,000+ active customers daily!</span>
        </div>
      </aside>

      {/* Right Column - Sign Up Form */}
      <section style={{ flex: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '440px' }} className="animate-fade-up">
          
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>Create your account</h2>
            <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
              Already have an account? <Link href="/login" style={{ color: '#FACC15', fontWeight: 600 }}>Sign In</Link>
            </p>
          </div>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ color: '#E5E7EB' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem', backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.08)' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ color: '#E5E7EB' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
                <input
                  type="email"
                  required
                  placeholder="e.g. name@domain.com"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem', backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.08)' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ color: '#E5E7EB' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem', backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.08)' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
              style={{ marginTop: '0.5rem', height: '3rem', fontSize: '0.95rem' }}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                'Create free account'
              )}
            </button>

            {/* Google Authentication */}
            <button
              type="button"
              className="btn btn-secondary btn-full"
              style={{ height: '3rem', backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.08)', color: '#FFFFFF', gap: '0.75rem' }}
              onClick={handleGoogleLogin}
            >
              <span>🌐</span> Continue with Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '1rem 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }}></div>
              <span style={{ padding: '0 1rem', fontSize: '0.8rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Or purchase directly</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }}></div>
            </div>

            {/* Skip Signup Button */}
            <Link 
              href="/buy" 
              className="btn btn-primary btn-full"
              style={{ 
                height: '3rem', 
                background: 'rgba(250, 204, 21, 0.08)', 
                color: '#FACC15', 
                border: '1px dashed #FACC15',
                boxShadow: 'none'
              }}
            >
              Skip signup & purchase directly <ArrowRight size={16} />
            </Link>

          </form>
          
        </div>
      </section>

    </div>
  );
}
