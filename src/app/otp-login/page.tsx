'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Phone, Loader2, ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';

export default function OtpLogin() {
  const [channel, setChannel] = useState<'phone' | 'email'>('phone');
  const [inputValue, setInputValue] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'send' | 'verify'>('send');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending OTP code
    setTimeout(() => {
      setLoading(false);
      setStep('verify');
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate verification
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 1000);
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
            Zero Passwords. Ultimate Security.
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
            Access your account quickly without memorizing passwords. Verify using a one-time passcode sent directly to your phone or email.
          </p>
        </div>

        <div style={{ zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9CA3AF', fontSize: '0.875rem' }}>
          <span>🔒</span>
          <span>Fast, secure, passwordless authentication</span>
        </div>
      </aside>

      {/* Right Column - OTP Login Form */}
      <section style={{ flex: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '440px' }} className="animate-fade-up">
          
          <div style={{ marginBottom: '2rem' }}>
            <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#9CA3AF', fontSize: '0.85rem', textDecoration: 'none', marginBottom: '1rem' }} className="hover-scale">
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>Sign In with OTP</h2>
            <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
              We will send a 6-digit verification code to your {channel}.
            </p>
          </div>

          {step === 'send' ? (
            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Channel Selector Toggle */}
              <div style={{ display: 'flex', padding: '0.25rem', backgroundColor: '#0F172A', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <button
                  type="button"
                  onClick={() => { setChannel('phone'); setInputValue(''); }}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: channel === 'phone' ? '#FACC15' : 'transparent',
                    color: channel === 'phone' ? '#030712' : '#9CA3AF',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s'
                  }}
                >
                  📞 Phone Number
                </button>
                <button
                  type="button"
                  onClick={() => { setChannel('email'); setInputValue(''); }}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: channel === 'email' ? '#FACC15' : 'transparent',
                    color: channel === 'email' ? '#030712' : '#9CA3AF',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s'
                  }}
                >
                  ✉️ Email Address
                </button>
              </div>

              {channel === 'phone' ? (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ color: '#E5E7EB' }}>Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0541234567"
                      className="form-input"
                      style={{ paddingLeft: '2.75rem', backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.08)' }}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
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
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
                style={{ height: '3rem', fontSize: '0.95rem' }}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  'Send Verification Code'
                )}
              </button>

            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ color: '#E5E7EB' }}>6-Digit Passcode</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. 123456"
                  className="form-input"
                  style={{ textAlign: 'center', letterSpacing: '0.2em', fontSize: '1.2rem', backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.08)' }}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
                style={{ height: '3rem', fontSize: '0.95rem' }}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  'Verify & Log In'
                )}
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-full"
                style={{ height: '3rem', backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.08)' }}
                onClick={() => setStep('send')}
              >
                Change {channel}
              </button>

            </form>
          )}

        </div>
      </section>

    </div>
  );
}
