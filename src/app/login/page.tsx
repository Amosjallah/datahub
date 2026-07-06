'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, ArrowLeft, Eye, EyeOff, Zap, ShieldCheck, Globe } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate login delay
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
    }, 800);
  };

  return (
    <div className="split-layout">
      {/* Left Column - Marketing & Feature info (Hidden on mobile) */}
      <aside className="split-aside">
        {/* Decorative elements */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1), transparent 50%)', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', top: '-5rem', right: '-5rem', width: '20rem', height: '20rem', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', filter: 'blur(40px)', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', bottom: '-8rem', left: '-4rem', width: '24rem', height: '24rem', borderRadius: '50%', background: 'rgba(59,130,246,0.08)', filter: 'blur(50px)', pointerEvents: 'none' }}></div>

        {/* Brand Header */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{ backgroundColor: '#FFF', padding: '0.25rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <Logo size={40} colorMode="light" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.5rem', color: '#FFFFFF', letterSpacing: '-0.02em' }}>FA Digital</span>
          </Link>
        </div>

        {/* Feature List */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '440px', margin: 'auto 0' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', lineHeight: '1.2', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Ghana's Fastest VTU & Reseller Platform
          </h1>
          <p style={{ color: 'rgba(219,234,254,0.9)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
            Buy and resell data bundles, top up airtime, and dispatch result checkers instantly using our secure system.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.1)', flexShrink: 0, color: '#FFF' }}>
                <Zap size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>Instant Dispatch</h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(219,234,254,0.85)', marginTop: '0.15rem' }}>Bundles and top-ups processed and delivered in 3 seconds.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.1)', flexShrink: 0, color: '#FFF' }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>Secure Payments</h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(219,234,254,0.85)', marginTop: '0.15rem' }}>Bank-grade encryption protecting all wallet funding transactions.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.1)', flexShrink: 0, color: '#FFF' }}>
                <Globe size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>All Networks covered</h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(219,234,254,0.85)', marginTop: '0.15rem' }}>Super-fast top-up dispatch across MTN, Telecel, AirtelTigo, and Glo.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info tag */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(219,234,254,0.8)' }}>
          <div style={{ display: 'flex', gap: '-4px', alignItems: 'center' }}>
            <span style={{ fontSize: '1.1rem' }}>👥</span>
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Trusted by thousands of resellers in Ghana</span>
        </div>
      </aside>

      {/* Right Column - Sign In Form Card */}
      <main className="split-main">
        {/* Header link & mobile logo */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to home
          </Link>
          <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Logo size={28} colorMode="light" />
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>FA Digital</span>
          </div>
        </div>

        {/* Form container */}
        <div className="split-form-container">
          <div style={{ width: '100%', maxWidth: '380px' }}>
            
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>Welcome back</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleLogin} className="card" style={{ padding: '1.25rem', border: '1px solid var(--color-border)', background: '#FFFFFF', borderRadius: '12px' }}>
              
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email or Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    id="email"
                    className="form-input"
                    placeholder="Enter email or phone number"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ paddingLeft: '2.5rem', fontSize: '0.875rem', height: '48px', borderRadius: '10px' }}
                    required
                  />
                  <Mail size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                  <label className="form-label" htmlFor="password" style={{ marginBottom: 0 }}>Password</label>
                  <a href="#" style={{ fontSize: '0.75rem', color: 'var(--color-brand-primary)', fontWeight: 600 }}>Forgot password?</a>
                </div>
                
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', fontSize: '0.875rem', height: '48px', borderRadius: '10px' }}
                    required
                  />
                  <Lock size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', padding: 0 }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ height: '48px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700, backgroundColor: 'var(--color-brand-primary)', color: '#FFF', border: 'none' }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    <Loader2 className="animate-spin" size={16} />
                    Signing In...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>

            </form>

            <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              Don't have an account?{' '}
              <Link href="/register" style={{ color: 'var(--color-brand-primary)', fontWeight: 700, textDecoration: 'none' }}>
                Create one →
              </Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
