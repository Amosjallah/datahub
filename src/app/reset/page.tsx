'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Phone, Loader2, ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';

export default function ResetPassword() {
  const [channel, setChannel] = useState<'phone' | 'email'>('email');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'request' | 'sent'>('request');
  const router = useRouter();

  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate reset request
    setTimeout(() => {
      setLoading(false);
      setStep('sent');
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
            Recover Your Password
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
            Enter your registered email address or phone number and we will send you instructions to reset your password.
          </p>
        </div>

        <div style={{ zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9CA3AF', fontSize: '0.875rem' }}>
          <span>🔧</span>
          <span>Automatic self-service recovery gateway</span>
        </div>
      </aside>

      {/* Right Column - Recovery Form */}
      <section style={{ flex: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '440px' }} className="animate-fade-up">
          
          <div style={{ marginBottom: '2rem' }}>
            <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#9CA3AF', fontSize: '0.85rem', textDecoration: 'none', marginBottom: '1rem' }} className="hover-scale">
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>Reset Password</h2>
            <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
              Select option and enter details to dispatch your reset passcode.
            </p>
          </div>

          {step === 'request' ? (
            <form onSubmit={handleResetRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Channel Selector Toggle */}
              <div style={{ display: 'flex', padding: '0.25rem', backgroundColor: '#0F172A', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
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
                  ✉️ Email Recovery
                </button>
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
                  📞 Phone Recovery
                </button>
              </div>

              {channel === 'email' ? (
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
              ) : (
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
                  'Send Reset Code'
                )}
              </button>

            </form>
          ) : (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ fontSize: '3rem' }}>✉️</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF' }}>Reset Code Dispatched</h3>
              <p style={{ color: '#9CA3AF', fontSize: '0.9rem', lineHeight: '1.5' }}>
                We have sent a 6-digit recovery code to **{inputValue}**. Please verify your inbox or messages.
              </p>
              
              <button
                onClick={() => setStep('request')}
                className="btn btn-primary btn-full"
                style={{ height: '3rem', fontSize: '0.95rem', marginTop: '1rem' }}
              >
                Resend Code
              </button>

              <p style={{ color: '#6B7280', fontSize: '0.8rem', marginTop: '1rem' }}>
                Having issues? Email us directly at <a href="mailto:support@fadigitalservices.com" style={{ color: '#FACC15' }}>support@fadigitalservices.com</a> for manuals.
              </p>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
