'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Mail, Lock, Phone, Loader2, ArrowRight, Star, Copy, Check, Share2, MessageCircle } from 'lucide-react';
import Logo from '@/components/Logo';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showDemoRegister, setShowDemoRegister] = useState(false);
  const [isAgentMode, setIsAgentMode] = useState(false);
  
  // Post-registration Agent Data modal/card
  const [agentRegisteredData, setAgentRegisteredData] = useState<{
    referralCode: string;
    referralLink: string;
    phone: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const role = searchParams.get('role');
    const ref = searchParams.get('ref');
    if (role === 'agent') {
      setIsAgentMode(true);
    }
    if (ref) {
      sessionStorage.setItem('referral_ref', ref);
    }
  }, [searchParams]);

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setShowDemoRegister(false);

    // Agent must provide phone number
    if (isAgentMode && !phone.trim()) {
      setErrorMsg('Phone number is required for agent registration. Your customer store referral link will be sent to this number.');
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured()) {
      // Demo mode
      const demoRefCode = `AGENT_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const demoLink = `${window.location.origin}/buy?ref=${demoRefCode}`;
      if (isAgentMode) {
        setAgentRegisteredData({
          referralCode: demoRefCode,
          referralLink: demoLink,
          phone: phone.trim(),
        });
      } else {
        setSuccessMsg('Demo registration active. Redirecting to dashboard...');
        setTimeout(() => router.push('/dashboard'), 2000);
      }
      setLoading(false);
      return;
    }

    try {
      const referredBy = sessionStorage.getItem('referral_ref') || searchParams.get('ref') || undefined;

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone.trim(),
          role: isAgentMode ? 'agent' : 'customer',
          referred_by: referredBy,
        }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        setErrorMsg(result?.message || 'Unable to create your account right now. Please try again.');
        setShowDemoRegister(Boolean(result?.demo));
        setLoading(false);
        return;
      }

      if (result.session && supabase) {
        await supabase.auth.setSession(result.session);
      }

      // If registered as an agent, show the agent referral link card immediately
      if (isAgentMode && result.referralCode) {
        sessionStorage.removeItem('referral_ref');
        const refLink = result.referralLink || `${window.location.origin}/buy?ref=${result.referralCode}`;
        setAgentRegisteredData({
          referralCode: result.referralCode,
          referralLink: refLink,
          phone: phone.trim(),
        });
      } else {
        sessionStorage.removeItem('referral_ref');
        setSuccessMsg('Account created! Redirecting to dashboard...');
        setTimeout(() => router.push('/dashboard'), 2000);
      }
    } catch (err: any) {
      if (err.message?.includes('Failed to fetch') || err.message?.includes('network')) {
        setErrorMsg('Could not connect to Supabase auth service. Click below to continue in Demo Mode.');
        setShowDemoRegister(true);
      } else {
        setErrorMsg(err.message || 'Failed to create account.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoRegister = () => {
    router.push('/dashboard');
  };

  const handleGoogleLogin = async () => {
    if (!supabase) {
      setErrorMsg('Google sign-in is unavailable because authentication is not configured.');
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        if (/unsupported provider|provider is not enabled/i.test(error.message)) {
          setErrorMsg('Google sign-in is not enabled yet. Enable Google under Supabase Authentication > Providers, then try again.');
          return;
        }
        throw error;
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to initialize Google login.');
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
          background: isAgentMode
            ? 'linear-gradient(135deg, #0A1628 0%, #030712 100%)'
            : 'linear-gradient(135deg, #0F172A 0%, #030712 100%)', 
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'relative'
        }}
        className="hide-mobile"
      >
        <div style={{ zIndex: 2 }}>
          <Link href="/buy" style={{ textDecoration: 'none' }}>
            <Logo />
          </Link>
        </div>

        {isAgentMode ? (
          <div style={{ zIndex: 2, maxWidth: '460px', margin: 'auto 0' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.25)', borderRadius: '20px', padding: '0.35rem 0.85rem', marginBottom: '1.25rem' }}>
              <Star size={14} style={{ color: '#FACC15' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FACC15', letterSpacing: '0.05em' }}>OFFICIAL AGENT PROGRAM</span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: '1.2', marginBottom: '1rem', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              Earn Daily With Your Own Data Store 🇬🇭
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
              Register with your phone number. You'll receive your personalized referral store link via SMS to share with your customers. Earn automatic commission on every bundle they buy!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.5rem' }}>🔗</span>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>Instant Referral Link</h3>
                  <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginTop: '0.15rem' }}>Your unique customer link is generated and texted to your phone immediately upon signup.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.5rem' }}>💵</span>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>Instant Commission Wallets</h3>
                  <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginTop: '0.15rem' }}>Every time a customer uses your link, your commission wallet is automatically credited.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.5rem' }}>📱</span>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>Zero Inventory Needed</h3>
                  <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginTop: '0.15rem' }}>We handle carrier fulfillment and MoMo payments. You focus on sharing your link.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
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
            </div>
          </div>
        )}

        <div style={{ zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9CA3AF', fontSize: '0.875rem' }}>
          <span>💬</span>
          <span>Join 30,000+ active customers & agents daily!</span>
        </div>
      </aside>

      {/* Right Column - Sign Up Form OR Agent Success Card */}
      <section style={{ flex: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '480px' }} className="animate-fade-up">

          {/* AGENT POST-REGISTRATION SUCCESS MODAL / CARD */}
          {agentRegisteredData ? (
            <div style={{
              backgroundColor: '#0F172A',
              border: '1.5px solid rgba(250, 204, 21, 0.3)',
              borderRadius: '24px',
              padding: '2.5rem 2rem',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              textAlign: 'center',
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(250, 204, 21, 0.15)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                marginBottom: '1rem',
              }}>
                🎉
              </div>

              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Agent Store Activated!
              </h2>

              <p style={{ color: '#9CA3AF', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>
                Welcome to QuickNet Data! Your agent referral link has been created and an SMS confirmation was dispatched to <strong style={{ color: '#FACC15' }}>{agentRegisteredData.phone}</strong>.
              </p>

              {/* Referral Code Box */}
              <div style={{
                backgroundColor: '#030712',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '14px',
                padding: '0.85rem 1rem',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div style={{ textAlign: 'left' }}>
                  <span style={{ fontSize: '0.72rem', color: '#9CA3AF', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Your Referral Code
                  </span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FACC15', fontFamily: 'monospace' }}>
                    {agentRegisteredData.referralCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(agentRegisteredData.referralCode)}
                  style={{
                    backgroundColor: 'rgba(250,204,21,0.15)',
                    color: '#FACC15',
                    border: '1px solid rgba(250,204,21,0.3)',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                  {copiedCode ? 'Copied' : 'Copy'}
                </button>
              </div>

              {/* Customer Referral Store Link */}
              <div style={{
                backgroundColor: '#030712',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '14px',
                padding: '0.85rem 1rem',
                marginBottom: '1.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.75rem',
              }}>
                <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                  <span style={{ fontSize: '0.72rem', color: '#9CA3AF', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Customer Store Link
                  </span>
                  <span style={{ fontSize: '0.82rem', color: '#FFFFFF', fontFamily: 'monospace', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {agentRegisteredData.referralLink}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyLink(agentRegisteredData.referralLink)}
                  style={{
                    backgroundColor: '#FACC15',
                    color: '#030712',
                    border: 'none',
                    padding: '0.5rem 0.9rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    flexShrink: 0,
                  }}
                >
                  {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                  {copiedLink ? 'Copied!' : 'Copy Link'}
                </button>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`🇬🇭 Buy cheap MTN, Telecel & AirtelTigo data bundles directly from my store!\n\nNon-expiry packages at the best wholesale rates.\n\nOrder now:\n${agentRegisteredData.referralLink}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    height: '48px',
                    color: '#030712',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    textDecoration: 'none',
                  }}
                >
                  <Share2 size={16} /> Share Link to Customers on WhatsApp
                </a>

                <button
                  type="button"
                  onClick={() => router.push('/agent/dashboard')}
                  className="btn btn-secondary"
                  style={{
                    width: '100%',
                    height: '48px',
                    borderColor: 'rgba(255,255,255,0.15)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  Go to Agent Dashboard <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                {isAgentMode && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(250,204,21,0.08)', border: '1px solid rgba(250,204,21,0.2)', borderRadius: '20px', padding: '0.35rem 0.85rem', marginBottom: '1rem' }}>
                    <Star size={12} style={{ color: '#FACC15' }} />
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#FACC15' }}>AGENT SIGNUP</span>
                  </div>
                )}
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                  {isAgentMode ? 'Create your agent account' : 'Create your account'}
                </h2>
                <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
                  Already have an account? <Link href="/login" style={{ color: '#FACC15', fontWeight: 600 }}>Sign In</Link>
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
                  <div style={{ marginBottom: showDemoRegister ? '0.75rem' : 0 }}>
                    ⚠️ {errorMsg}
                  </div>
                  {showDemoRegister && (
                    <button
                      type="button"
                      onClick={handleDemoRegister}
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      🚀 Continue to Dashboard (Demo Mode)
                    </button>
                  )}
                </div>
              )}

              {successMsg && (
                <div style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '8px',
                  color: '#4ADE80',
                  fontSize: '0.875rem',
                  marginBottom: '1.25rem',
                }}>
                  ✅ {successMsg}
                </div>
              )}

              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ color: '#E5E7EB' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kwame Mensah"
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
                      placeholder="e.g. kwame@gmail.com"
                      className="form-input"
                      style={{ paddingLeft: '2.75rem', backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.08)' }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Phone number — mandatory for agents with custom notice */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ color: '#E5E7EB' }}>
                    Phone Number {isAgentMode ? <span style={{ color: '#EF4444' }}>*</span> : <span style={{ color: '#6B7280', fontSize: '0.78rem' }}>(optional)</span>}
                  </label>
                  {isAgentMode && (
                    <p style={{ fontSize: '0.75rem', color: '#FACC15', marginBottom: '0.4rem' }}>
                      📱 Your customer referral store link will be sent to this phone via SMS
                    </p>
                  )}
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
                    <input
                      type="tel"
                      required={isAgentMode}
                      placeholder="e.g. 0244123456 or 0502515547"
                      className="form-input"
                      style={{ paddingLeft: '2.75rem', backgroundColor: '#0F172A', borderColor: isAgentMode ? 'rgba(250,204,21,0.4)' : 'rgba(255,255,255,0.08)' }}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
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

                {/* Toggle between agent and customer */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsAgentMode(false)}
                    style={{
                      flex: 1,
                      padding: '0.6rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      backgroundColor: !isAgentMode ? 'rgba(255,255,255,0.08)' : 'transparent',
                      color: !isAgentMode ? '#FFFFFF' : '#6B7280',
                      border: !isAgentMode ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.05)',
                      transition: 'all 0.2s',
                    }}
                  >
                    👤 Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAgentMode(true)}
                    style={{
                      flex: 1,
                      padding: '0.6rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      backgroundColor: isAgentMode ? 'rgba(250,204,21,0.1)' : 'transparent',
                      color: isAgentMode ? '#FACC15' : '#6B7280',
                      border: isAgentMode ? '1px solid rgba(250,204,21,0.3)' : '1px solid rgba(255,255,255,0.05)',
                      transition: 'all 0.2s',
                    }}
                  >
                    ⭐ Agent / Reseller
                  </button>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={loading}
                  style={{ marginTop: '0.5rem', height: '3rem', fontSize: '0.95rem', fontWeight: 800, color: '#030712' }}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    isAgentMode ? 'Create Agent Account & Get Link' : 'Create free account'
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
                  Skip signup &amp; purchase directly <ArrowRight size={16} />
                </Link>

              </form>
            </div>
          )}
          
        </div>
      </section>

    </div>
  );
}
