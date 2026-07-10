'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate login and redirect based on role matching email
    setTimeout(() => {
      setLoading(false);
      const emailLower = email.toLowerCase();
      if (emailLower.includes('admin')) {
        router.push('/admin/dashboard');
      } else if (emailLower.includes('agent')) {
        router.push('/agent/dashboard');
      } else {
        router.push('/dashboard');
      }
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
            Ghana's #1 Automated VTU Gateway
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
            Log in to manage your agent account, view sales analytics, request API keys, and access cheap internet data bundles.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.5rem' }}>🛡️</span>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>Safe & Encrypted</h3>
                <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginTop: '0.15rem' }}>Your wallet funds and details are protected with bank-grade encryption.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.5rem' }}>🔌</span>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>Developer Friendly</h3>
                <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginTop: '0.15rem' }}>Integrate our VTU gateway rails directly into your systems via simple API keys.</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9CA3AF', fontSize: '0.875rem' }}>
          <span>🔒</span>
          <span>Ledger audits running constantly</span>
        </div>
      </aside>

      {/* Right Column - Sign In Form */}
      <section style={{ flex: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '440px' }} className="animate-fade-up">
          
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>Welcome back</h2>
            <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
              Don't have an account? <Link href="/register" style={{ color: '#FACC15', fontWeight: 600 }}>Create account</Link>
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ color: '#E5E7EB', marginBottom: 0 }}>Password</label>
                <Link href="/reset" style={{ color: '#FACC15', fontSize: '0.8rem', fontWeight: 600 }}>Forgot password?</Link>
              </div>
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

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: '#9CA3AF' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: '#FACC15' }} />
                Remember me
              </label>
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
                'Sign in'
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

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.5rem 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }}></div>
              <span style={{ padding: '0 1rem', fontSize: '0.8rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Or quick options</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }}></div>
            </div>

            {/* Sign in with OTP */}
            <Link 
              href="/otp-login" 
              className="btn btn-secondary btn-full"
              style={{ 
                height: '3rem', 
                backgroundColor: 'rgba(250, 204, 21, 0.08)', 
                color: '#FACC15', 
                border: '1px solid rgba(250, 204, 21, 0.15)',
                fontWeight: 600
              }}
            >
              🔐 Sign in with OTP (No Password)
            </Link>

            {/* Skip Signup Button */}
            <Link 
              href="/buy" 
              className="btn btn-primary btn-full"
              style={{ 
                height: '3rem', 
                background: 'transparent',
                color: '#9CA3AF', 
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: 'none'
              }}
            >
              Skip login & purchase directly <ArrowRight size={16} />
            </Link>

          </form>
          
        </div>
      </section>

    </div>
  );
}
