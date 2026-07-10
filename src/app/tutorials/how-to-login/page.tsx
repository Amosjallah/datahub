'use client';

import React, { useState } from 'react';
import PublicLayout from '@/components/PublicLayout';

interface Step {
  title: string;
  desc: string;
  mockUI: React.ReactNode;
}

export default function HowToLoginTutorial() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: Step[] = [
    {
      title: '1. Navigate to Sign In',
      desc: 'Click on the "Sign In" button in the top right corner of the homepage navbar, or toggle to it directly from the registration panel.',
      mockUI: (
        <div style={{ padding: '1.5rem', backgroundColor: '#0B0F19', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', color: '#FFFFFF' }}>DataMartGH</span>
          <div style={{ padding: '0.4rem 1rem', backgroundColor: '#FACC15', color: '#030712', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>
            Sign In
          </div>
        </div>
      )
    },
    {
      title: '2. Input Credentials',
      desc: 'Fill in your registered email address and secure password. Click "Sign In" to proceed to verification routing.',
      mockUI: (
        <div style={{ padding: '1.5rem', backgroundColor: '#0B0F19', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '320px', margin: '0 auto' }}>
          <input disabled type="email" placeholder="name@domain.com" style={{ width: '100%', padding: '0.6rem', backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '0.8rem', color: '#FFFFFF' }} />
          <input disabled type="password" placeholder="••••••••" style={{ width: '100%', padding: '0.6rem', backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '0.8rem', color: '#FFFFFF' }} />
          <div style={{ padding: '0.6rem', backgroundColor: '#FACC15', color: '#030712', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold', textAlign: 'center' }}>
            Sign In
          </div>
        </div>
      )
    },
    {
      title: '3. Verification Passcode',
      desc: 'Input the 6-digit secure OTP passcode dispatched immediately to your email or SMS inbox. Press verify to unlock dashboard sessions.',
      mockUI: (
        <div style={{ padding: '1.5rem', backgroundColor: '#0B0F19', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '320px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>Enter code sent to email</span>
          <input disabled type="text" placeholder="1 2 3 4 5 6" style={{ width: '100%', padding: '0.6rem', backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '1.2rem', textAlign: 'center', color: '#FFFFFF', letterSpacing: '0.2em' }} />
          <div style={{ padding: '0.6rem', backgroundColor: '#FACC15', color: '#030712', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>
            Verify Passcode
          </div>
        </div>
      )
    },
    {
      title: '4. Explore Dashboard',
      desc: 'Welcome to your ledger account portal! You can now fund your wallet, buy data bundles at reseller prices, and check transaction logs.',
      mockUI: (
        <div style={{ padding: '1.5rem', backgroundColor: '#0B0F19', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Wallet balance</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#FACC15' }}>₵ 245.50</span>
          </div>
          <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem' }}>
            <span style={{ color: '#FFFFFF' }}>MTN 10GB Data</span>
            <span style={{ color: '#10B981' }}>Success</span>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <PublicLayout>
      <section style={{ padding: '5rem 0', backgroundColor: '#030712', minHeight: '85vh' }}>
        <div className="container animate-fade-up" style={{ maxWidth: '800px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: '#FACC15', textTransform: 'uppercase', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.12em', display: 'block', marginBottom: '0.5rem' }}>Tutorial Guides</span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '0.75rem' }}>
              How to Sign In &amp; Use DataMart
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: '1.05rem' }}>
              Follow our step-by-step slideshow guide to navigate the login flow and access your dashboard.
            </p>
          </div>

          {/* Slideshow Container */}
          <div className="card" style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', overflow: 'hidden' }}>
            
            {/* Slide Body */}
            <div style={{ padding: '3rem 2rem', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem', alignItems: 'center' }}>
              
              {/* Text Area */}
              <div>
                <span style={{ color: '#FACC15', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Step {currentStep + 1} of {steps.length}
                </span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.5rem', marginBottom: '1rem' }}>
                  {steps[currentStep].title}
                </h3>
                <p style={{ color: '#9CA3AF', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                  {steps[currentStep].desc}
                </p>
              </div>

              {/* Mock UI Showcase Area */}
              <div style={{ padding: '2rem', backgroundColor: '#030712', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {steps[currentStep].mockUI}
              </div>

            </div>

            {/* Slideshow Navigation Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: '#1E293B' }}>
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="btn btn-secondary"
                style={{
                  height: '2.75rem',
                  padding: '0 1.5rem',
                  fontSize: '0.85rem',
                  color: currentStep === 0 ? '#6B7280' : '#FFFFFF',
                  opacity: currentStep === 0 ? 0.5 : 1,
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(255,255,255,0.08)'
                }}
              >
                ← Previous Step
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {steps.map((_, idx) => (
                  <div
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: currentStep === idx ? '#FACC15' : 'rgba(255,255,255,0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  ></div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentStep === steps.length - 1}
                className="btn btn-primary"
                style={{
                  height: '2.75rem',
                  padding: '0 2rem',
                  fontSize: '0.85rem',
                  color: '#030712',
                  opacity: currentStep === steps.length - 1 ? 0.5 : 1
                }}
              >
                Next Step →
              </button>
            </div>

          </div>

        </div>
      </section>
    </PublicLayout>
  );
}
