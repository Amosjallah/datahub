'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, Loader2, ArrowLeft, Eye, EyeOff, Zap, ShieldCheck, Globe } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'agent'>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate signup delay
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
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
            Start Your Digital VTU Business Today
          </h1>
          <p style={{ color: 'rgba(219,234,254,0.9)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
            Create a free account to access developer-friendly APIs, wholesale pricing tiers, and direct commissions.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.1)', flexShrink: 0, color: '#FFF' }}>
                <Zap size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>Instant API Access</h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(219,234,254,0.85)', marginTop: '0.15rem' }}>Connect your platforms with our fully documented developers API.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.1)', flexShrink: 0, color: '#FFF' }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>Automatic Deposits</h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(219,234,254,0.85)', marginTop: '0.15rem' }}>Fund your wallet instantly using MTN MoMo, Telecel Cash, or cards.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.1)', flexShrink: 0, color: '#FFF' }}>
                <Globe size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>Earn Daily Margins</h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(219,234,254,0.85)', marginTop: '0.15rem' }}>Profit on every GB sold, utility bill payment, and airtime top-up.</p>
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

      {/* Right Column - Sign Up Form Card */}
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
        <div className="split-form-container" style={{ padding: '1rem 1.5rem 2rem' }}>
          <div style={{ width: '100%', maxWidth: '380px' }}>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>Create your account</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Get started with instant VTU payments in Ghana</p>
            </div>

            <form onSubmit={handleRegister} className="card" style={{ padding: '1.25rem', border: '1px solid var(--color-border)', background: '#FFFFFF', borderRadius: '12px' }}>
              
              {/* Account Role Selector */}
              <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--color-bg-elevated)', padding: '0.35rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: role === 'customer' ? 'var(--color-brand-primary)' : 'transparent',
                    color: role === 'customer' ? '#fff' : 'var(--color-text-muted)',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  🧑 Customer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('agent')}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: role === 'agent' ? 'var(--color-brand-primary)' : 'transparent',
                    color: role === 'agent' ? '#fff' : 'var(--color-text-muted)',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  🚀 Reseller Agent
                </button>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-name">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    id="reg-name"
                    className="form-input"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ paddingLeft: '2.5rem', fontSize: '0.875rem', height: '44px', borderRadius: '10px' }}
                    required
                  />
                  <User size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    id="reg-email"
                    className="form-input"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ paddingLeft: '2.5rem', fontSize: '0.875rem', height: '44px', borderRadius: '10px' }}
                    required
                  />
                  <Mail size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-phone">Phone Number (MoMo)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="tel"
                    id="reg-phone"
                    className="form-input"
                    placeholder="Enter MoMo phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ paddingLeft: '2.5rem', fontSize: '0.875rem', height: '44px', borderRadius: '10px' }}
                    required
                  />
                  <Phone size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" htmlFor="reg-password">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="reg-password"
                    className="form-input"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', fontSize: '0.875rem', height: '44px', borderRadius: '10px' }}
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

              <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ height: '44px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700, backgroundColor: 'var(--color-brand-primary)', color: '#FFF', border: 'none' }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    <Loader2 className="animate-spin" size={16} />
                    Registering...
                  </span>
                ) : (
                  'Register Account'
                )}
              </button>

            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: 'var(--color-brand-primary)', fontWeight: 700, textDecoration: 'none' }}>
                Sign in
              </Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
