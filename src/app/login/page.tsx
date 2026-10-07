'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import Logo from '@/components/Logo';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showDemoLogin, setShowDemoLogin] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setShowDemoLogin(false);

    const trimmedEmail = email.trim();

    if (!isSupabaseConfigured()) {
      setErrorMsg('Authentication is not configured in this environment. Continuing in demo mode.');
      setShowDemoLogin(true);
      setLoading(false);
      return;
    }

    try {
      let authSuccess = false;

      // Layer 1: Attempt direct client-side Supabase authentication
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: trimmedEmail,
            password,
          });

          if (!error && data?.session && data.user) {
            let role = (data.user.user_metadata?.role || '').toLowerCase();
            const emailLower = trimmedEmail.toLowerCase();
            if (!role) {
              const { data: profile } = await supabase
                .from('users')
                .select('role')
                .eq('id', data.user.id)
                .maybeSingle();
              if (profile?.role) role = profile.role.toLowerCase();
            }

            const isAuthorized = role === 'admin' || role === 'super_admin' || role === 'agent' ||
                                 emailLower.includes('admin') || emailLower.includes('agent');

            if (!isAuthorized) {
              await supabase.auth.signOut();
              setErrorMsg('Access restricted: Sign-in is strictly for Admins and Agents. Customers do not need to log in to purchase data.');
              setLoading(false);
              return;
            }

            authSuccess = true;
            fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: trimmedEmail, password }),
            }).catch(() => null);

            if (role === 'admin' || role === 'super_admin' || emailLower.includes('admin')) {
              router.push('/admin/dashboard');
            } else {
              router.push('/agent/dashboard');
            }
            return;
          } else if (error) {
            const msg = error.message || '';
            if (/invalid login credentials|invalid_credentials/i.test(msg)) {
              setErrorMsg('Email or password is incorrect. Please verify your agent or admin credentials.');
              setLoading(false);
              return;
            }
          }
        } catch (clientErr) {
          console.warn('Client-side sign in fallback to API route:', clientErr);
        }
      }

      // Layer 2: Fallback to server-side API route if client auth didn't complete
      if (!authSuccess) {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmedEmail, password }),
        });
        const result = await response.json().catch(() => null);

        if (!response.ok || !result?.success) {
          const message = result?.message || '';
          const isNetwork = /fetch|network|timeout|connect|unavailable|unreachable/i.test(message) || result?.networkError;

          if (isNetwork) {
            setErrorMsg('Unable to connect to authentication server. Please check your internet connection, or continue in Demo Mode.');
            setShowDemoLogin(true);
          } else {
            setErrorMsg(
              /invalid login credentials/i.test(message)
                ? 'Email or password is incorrect. Please verify your agent or admin credentials.'
                : message || 'Unable to sign in right now. Please try again.'
            );
            setShowDemoLogin(Boolean(result?.demo));
          }
          setLoading(false);
          return;
        }

        if (result.session && supabase) {
          await supabase.auth.setSession(result.session).catch(() => null);
        }

        const emailLower = trimmedEmail.toLowerCase();
        const role = (result.user?.role || '').toLowerCase();
        if (role === 'admin' || role === 'super_admin' || emailLower.includes('admin') || emailLower.startsWith('superadmin')) {
          router.push('/admin/dashboard');
        } else {
          router.push('/agent/dashboard');
        }
      }
    } catch (err: any) {
      const isNetwork = /fetch|network|timeout|connect/i.test(err?.message || '');
      if (isNetwork) {
        setErrorMsg('Could not connect to authentication service. Please check your internet connection or continue in Demo Mode.');
        setShowDemoLogin(true);
      } else {
        setErrorMsg(err.message || 'An unexpected error occurred during sign in.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const emailLower = email.toLowerCase().trim();
    if (!emailLower.includes('admin') && !emailLower.includes('agent')) {
      setErrorMsg('Access restricted: Sign-in is strictly for Admins and Agents. Customers can purchase data directly without an account.');
      return;
    }
    if (emailLower.includes('admin')) {
      router.push('/admin/dashboard');
    } else {
      router.push('/agent/dashboard');
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
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Logo size={40} />
          </Link>
        </div>

        <div style={{ zIndex: 2, maxWidth: '460px', margin: 'auto 0' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.8rem',
            backgroundColor: 'rgba(250, 204, 21, 0.1)',
            borderRadius: '9999px',
            color: '#FACC15',
            fontSize: '0.78rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '1rem',
            border: '1px solid rgba(250, 204, 21, 0.25)'
          }}>
            <ShieldCheck size={14} /> Agent & Admin Workspace
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: '1.2', marginBottom: '1rem', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Ghana's #1 Automated VTU Gateway
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
            Authorized portal for reseller agents and platform administrators to manage sales, wholesale bundles, wallet funding, and transaction rails.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.5rem' }}>🛡️</span>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>Safe & Encrypted Session</h3>
                <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginTop: '0.15rem' }}>Agent credentials and administrative privileges are protected with bank-grade encryption.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.5rem' }}>⚡</span>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>Wholesale Margins & Fast Rails</h3>
                <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginTop: '0.15rem' }}>Access discounted bulk data, check realtime profit margins, and manage your private store.</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9CA3AF', fontSize: '0.875rem' }}>
          <span>🔒</span>
          <span>Authorized agent & admin access active</span>
        </div>
      </aside>

      {/* Right Column - Sign In Form */}
      <section style={{ flex: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '440px' }} className="animate-fade-up">
          
          {/* Customer Notice Banner */}
          <div style={{
            padding: '0.85rem 1rem',
            backgroundColor: 'rgba(250, 204, 21, 0.08)',
            border: '1px solid rgba(250, 204, 21, 0.25)',
            borderRadius: '12px',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}>
            <div style={{ fontSize: '0.84rem', color: '#E5E7EB', lineHeight: 1.4 }}>
              🛍️ <strong>Buying data or airtime?</strong><br />
              <span style={{ color: '#9CA3AF' }}>Customers do not need to log in!</span>
            </div>
            <Link 
              href="/buy" 
              style={{ 
                color: '#030712', 
                background: '#FACC15', 
                padding: '0.45rem 0.85rem', 
                borderRadius: '8px', 
                fontWeight: 700, 
                textDecoration: 'none', 
                whiteSpace: 'nowrap', 
                fontSize: '0.78rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              Buy Now <ArrowRight size={12} />
            </Link>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>Agent & Admin Portal</h2>
            <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
              Sign in with your authorized agent or administrator credentials. Want to become an agent? <Link href="/become-agent" style={{ color: '#FACC15', fontWeight: 600 }}>Apply here</Link>
            </p>
          </div>

          {errorMsg && (
            <div style={{
              padding: '0.85rem 1rem',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#F87171',
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
            }}>
              <div style={{ marginBottom: showDemoLogin ? '0.75rem' : 0 }}>
                ⚠️ {errorMsg}
              </div>
              {showDemoLogin && (
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  🚀 Continue to Workspace (Demo Mode)
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ color: '#E5E7EB' }}>Agent / Admin Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
                <input
                  type="email"
                  required
                  placeholder="e.g. agent@fadigital.com or admin@domain.com"
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
                <input type="checkbox" defaultChecked style={{ accentColor: '#FACC15' }} />
                Keep me signed in
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
              style={{ marginTop: '0.5rem', height: '3rem', fontSize: '0.95rem', fontWeight: 700 }}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                'Sign In to Workspace'
              )}
            </button>

            {/* Direct Guest Link */}
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Link 
                href="/buy" 
                style={{ 
                  color: '#9CA3AF', 
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
                className="hover-light"
              >
                Go to Guest Purchase Portal <ArrowRight size={14} />
              </Link>
            </div>

          </form>
          
        </div>
      </section>

    </div>
  );
}
