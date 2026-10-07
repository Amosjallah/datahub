'use client';

import React, { useState } from 'react';
import PublicLayout from '@/components/PublicLayout';
import { Loader2, UserCheck, Users, CreditCard, ShieldCheck } from 'lucide-react';

interface UP2UPackage {
  id: string;
  capacity: string;
  price: number;
  displayName: string;
}

const up2uPackages: UP2UPackage[] = [
  { id: 'up2u-1', capacity: '1.2 GB', price: 4.10, displayName: 'MTN UP2U 1.2GB' },
  { id: 'up2u-2', capacity: '2.5 GB', price: 8.50, displayName: 'MTN UP2U 2.5GB' },
  { id: 'up2u-3', capacity: '3.8 GB', price: 12.80, displayName: 'MTN UP2U 3.8GB' },
  { id: 'up2u-5', capacity: '6.5 GB', price: 21.50, displayName: 'MTN UP2U 6.5GB' },
  { id: 'up2u-10', capacity: '13 GB', price: 41.00, displayName: 'MTN UP2U 13GB' },
  { id: 'up2u-20', capacity: '27 GB', price: 81.00, displayName: 'MTN UP2U 27GB' },
];

export default function MtnUp2u() {
  const [showModal, setShowModal] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<UP2UPackage | null>(null);
  
  // Buying for myself vs others
  const [buyFor, setBuyFor] = useState<'self' | 'others'>('self');
  const [payerPhone, setPayerPhone] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;
    setErrorMsg('');

    const payer = payerPhone.trim();
    const recipient = buyFor === 'self' ? payer : recipientPhone.trim();

    if (!payer) {
      setErrorMsg('Please enter your Mobile Money payment number to deduct payment from.');
      return;
    }
    if (buyFor === 'others' && !recipient) {
      setErrorMsg('Please enter the recipient MTN phone number.');
      return;
    }

    setLoading(true);

    try {
      const cleanPayer = payer.replace(/\D/g, '') || '0000000000';
      const cleanRecipient = recipient.replace(/\D/g, '') || cleanPayer;

      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `${cleanPayer}@quicknetdata.com`,
          amount: selectedPackage.price,
          phone: cleanPayer,
          payer_phone: cleanPayer,
          recipient_phone: cleanRecipient,
          buy_for: buyFor,
          service: 'data',
          network: 'MTN',
          planId: selectedPackage.id,
          callbackUrl: `${window.location.origin}/buy`,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success && data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        setErrorMsg(data.message || 'Payment initiation failed. Please try again.');
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg('Connection error: ' + (err.message || 'Please check your internet connection'));
    }
  };

  return (
    <PublicLayout>
      <section style={{ padding: '4rem 0 5rem', background: '#030712', minHeight: '80vh', position: 'relative' }}>
        
        {/* Price Update Modal Dialog */}
        {showModal && (
          <div 
            style={{ 
              position: 'fixed', 
              inset: 0, 
              backgroundColor: 'rgba(3, 7, 18, 0.85)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              zIndex: 9999,
              backdropFilter: 'blur(8px)',
              padding: '1.5rem'
            }}
          >
            <div 
              style={{ 
                backgroundColor: '#0F172A', 
                borderRadius: '24px', 
                padding: '2.5rem 2rem', 
                maxWidth: '520px', 
                width: '100%', 
                border: '1.5px solid rgba(250, 204, 21, 0.2)',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                textAlign: 'center',
                animation: 'fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both'
              }}
            >
              <span style={{ fontSize: '3rem' }}>📢</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginTop: '1rem', marginBottom: '0.75rem' }}>
                MTN UP2U Data Packages
              </h2>
              <p style={{ color: '#9CA3AF', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                Discounted MTN UP2U non-expiry data rates. You can buy for yourself or buy for other people. Payment is deducted directly from your MoMo number.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-primary"
                style={{ height: '3rem', width: '100%', color: '#030712', fontSize: '0.95rem' }}
              >
                I Understand, View Rates
              </button>
            </div>
          </div>
        )}

        <div className="container" style={{ maxWidth: '1000px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: '#FACC15', textTransform: 'uppercase', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.12em', display: 'block', marginBottom: '0.5rem' }}>Special Discounts</span>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
              MTN UP2U DATA MARKETPLACE
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
              Buy special MTN UP2U data bundles at highly reduced prices. Top up your own line or load bundles for friends and family.
            </p>
          </div>

          {/* Product Cards Grid */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
              gap: '1.25rem',
              marginBottom: '3rem'
            }}
          >
            {up2uPackages.map((pkg) => {
              const isSelected = selectedPackage?.id === pkg.id;
              return (
                <div key={pkg.id} style={{ display: 'contents' }}>
                  <div
                    onClick={() => { setSelectedPackage(isSelected ? null : pkg); setErrorMsg(''); }}
                    style={{
                      backgroundColor: '#0F172A',
                      borderRadius: '20px',
                      padding: '1.5rem',
                      border: isSelected ? '2px solid #FACC15' : '1px solid rgba(255,255,255,0.06)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                      transition: 'all 0.25s',
                      boxShadow: isSelected ? '0 10px 25px rgba(250, 204, 21, 0.1)' : 'none',
                      transform: isSelected ? 'scale(1.02)' : 'none'
                    }}
                    className="hover-scale"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>{pkg.capacity}</span>
                      <span 
                        style={{ 
                          fontSize: '0.72rem', 
                          fontWeight: 700, 
                          padding: '0.2rem 0.6rem', 
                          borderRadius: '8px', 
                          backgroundColor: 'rgba(250,204,21,0.1)',
                          color: '#FACC15'
                        }}
                      >
                        UP2U
                      </span>
                    </div>
                    
                    <span style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>{pkg.displayName}</span>
                    
                    <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '0.78rem', color: '#9CA3AF', fontWeight: 500 }}>UP2U Price</span>
                      <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FACC15' }}>GH₵ {pkg.price.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Accordion Form - Displays directly under card if selected */}
                  {isSelected && (
                    <div 
                      style={{ 
                        gridColumn: '1 / -1', 
                        backgroundColor: '#0B0F19', 
                        borderRadius: '24px', 
                        padding: '2rem', 
                        border: '1.5px solid rgba(250, 204, 21, 0.2)',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
                        marginTop: '0.5rem',
                        marginBottom: '1rem',
                        animation: 'fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both'
                      }}
                    >
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>⚡</span> Checkout Form - {pkg.displayName} ({pkg.capacity}) — <span style={{ color: '#FACC15' }}>GH₵ {pkg.price.toFixed(2)}</span>
                      </h3>

                      {/* Myself vs Others toggle */}
                      <div style={{ maxWidth: '480px', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#030712', padding: '0.3rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <button
                            type="button"
                            onClick={() => setBuyFor('self')}
                            style={{
                              flex: 1,
                              padding: '0.55rem',
                              borderRadius: '8px',
                              border: 'none',
                              backgroundColor: buyFor === 'self' ? '#FACC15' : 'transparent',
                              color: buyFor === 'self' ? '#030712' : '#9CA3AF',
                              fontWeight: 800,
                              fontSize: '0.82rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.4rem',
                            }}
                          >
                            <UserCheck size={15} /> Buying for Myself
                          </button>
                          <button
                            type="button"
                            onClick={() => setBuyFor('others')}
                            style={{
                              flex: 1,
                              padding: '0.55rem',
                              borderRadius: '8px',
                              border: 'none',
                              backgroundColor: buyFor === 'others' ? '#FACC15' : 'transparent',
                              color: buyFor === 'others' ? '#030712' : '#9CA3AF',
                              fontWeight: 800,
                              fontSize: '0.82rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.4rem',
                            }}
                          >
                            <Users size={15} /> Buying for Someone Else
                          </button>
                        </div>
                      </div>

                      {errorMsg && (
                        <div style={{ maxWidth: '480px', padding: '0.75rem 1rem', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', color: '#F87171', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                          ⚠️ {errorMsg}
                        </div>
                      )}

                      <form onSubmit={handleCheckoutSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem', maxWidth: '480px' }}>
                        
                        {buyFor === 'self' ? (
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ color: '#E5E7EB' }}>Your MTN Phone Number (MoMo Payment & Data)</label>
                            <input
                              type="tel"
                              required
                              placeholder="e.g. 0244123456"
                              className="form-input"
                              style={{ backgroundColor: '#0F172A', borderColor: 'rgba(250,204,21,0.3)' }}
                              value={payerPhone}
                              onChange={(e) => setPayerPhone(e.target.value)}
                            />
                            <span style={{ fontSize: '0.72rem', color: '#9CA3AF', marginTop: '0.35rem', display: 'block' }}>
                              Payment prompt will be sent here, and the data package loaded to this same line.
                            </span>
                          </div>
                        ) : (
                          <>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label" style={{ color: '#E5E7EB' }}>Recipient MTN Phone Number (Receives Data)</label>
                              <input
                                type="tel"
                                required
                                placeholder="e.g. 0244123456"
                                className="form-input"
                                style={{ backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.08)' }}
                                value={recipientPhone}
                                onChange={(e) => setRecipientPhone(e.target.value)}
                              />
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label" style={{ color: '#FACC15' }}>Your Mobile Money Number (To Deduct Payment)</label>
                              <input
                                type="tel"
                                required
                                placeholder="e.g. 0502515547"
                                className="form-input"
                                style={{ backgroundColor: '#0F172A', borderColor: 'rgba(250,204,21,0.4)' }}
                                value={payerPhone}
                                onChange={(e) => setPayerPhone(e.target.value)}
                              />
                              <span style={{ fontSize: '0.72rem', color: '#9CA3AF', marginTop: '0.35rem', display: 'block' }}>
                                You will receive the MoMo prompt on this number to approve payment.
                              </span>
                            </div>
                          </>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => setSelectedPackage(null)}
                            className="btn btn-secondary"
                            style={{ height: '3rem', padding: '0 1.5rem', fontSize: '0.9rem' }}
                          >
                            Cancel
                          </button>
                          
                          <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ flex: 1, height: '3rem', color: '#030712', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                          >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : (
                              <>
                                <CreditCard size={18} />
                                Deduct GH₵ {pkg.price.toFixed(2)} from MoMo
                              </>
                            )}
                          </button>
                        </div>
                      </form>

                      <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#9CA3AF', fontSize: '0.75rem' }}>
                        <ShieldCheck size={14} color="#10B981" />
                        <span>Prompt sent directly to your phone · 100% Secure</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>
    </PublicLayout>
  );
}
