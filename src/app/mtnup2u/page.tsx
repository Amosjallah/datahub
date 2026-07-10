'use client';

import React, { useState, useEffect } from 'react';
import PublicLayout from '@/components/PublicLayout';
import { Loader2 } from 'lucide-react';

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
  
  // Checkout Form fields (No Name field required for UP2U!)
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;
    setLoading(true);

    // Simulate purchase
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      alert(`MTN UP2U order processed for ${phone}! Prompt sent.`);
    }, 1500);
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
                MTN UP2U Price Updates
              </h2>
              <p style={{ color: '#9CA3AF', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                Due to recent telecom wholesale rate changes, MTN UP2U data bundles have been updated to represent the latest discounted pricing. Please review the new rates. All bundles remain non-expiry.
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
              Buy special MTN UP2U data bundles at highly reduced prices. Instantly top up your account or load bundles for friends.
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
                    onClick={() => { setSelectedPackage(isSelected ? null : pkg); setSuccess(false); }}
                    style={{
                      padding: '1.75rem 1.5rem',
                      backgroundColor: '#0F172A',
                      borderRadius: '20px',
                      border: isSelected ? '2.5px solid #FACC15' : '1px solid rgba(255, 255, 255, 0.05)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
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

                  {/* Accordion Form - Displays directly under card if selected (No Name field!) */}
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
                        <span>⚡</span> Checkout Form - {pkg.displayName} ({pkg.capacity})
                      </h3>
                      
                      {success ? (
                        <div style={{ padding: '1.5rem', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1.5px solid rgba(16, 185, 129, 0.2)', borderRadius: '16px', textAlign: 'center' }}>
                          <span style={{ fontSize: '2rem' }}>✅</span>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34D399', marginTop: '0.5rem' }}>UP2U Order Submitted!</h4>
                          <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginTop: '0.25rem', lineHeight: '1.5' }}>
                            We have initiated the MTN UP2U checkout request on **{phone}**. Please confirm the Mobile Money PIN prompt on your device.
                          </p>
                          <button 
                            type="button" 
                            onClick={() => { setSelectedPackage(null); setSuccess(false); }} 
                            className="btn btn-secondary" 
                            style={{ marginTop: '1.25rem', height: '2.5rem', padding: '0 1.5rem', fontSize: '0.85rem' }}
                          >
                            Close checkout
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleCheckoutSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                          
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ color: '#E5E7EB' }}>Recipient Phone Number</label>
                            <input
                              type="tel"
                              required
                              pattern="^[0][0-9]{9}$"
                              placeholder="e.g. 0244123456"
                              className="form-input"
                              style={{ maxWidth: '480px', backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.08)', letterSpacing: '0.05em' }}
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                            <span style={{ fontSize: '0.72rem', color: '#6B7280', marginTop: '0.35rem', display: 'block' }}>Ensure the number is a valid MTN line.</span>
                          </div>

                          <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                            <button
                              type="button"
                              onClick={() => setSelectedPackage(null)}
                              className="btn btn-secondary"
                              style={{ height: '3rem', padding: '0 2rem', fontSize: '0.9rem' }}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="btn btn-primary"
                              disabled={loading}
                              style={{ height: '3rem', padding: '0 2.5rem', fontSize: '0.9rem', color: '#030712' }}
                            >
                              {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <Loader2 className="animate-spin" size={18} />
                                  Initiating payment...
                                </span>
                              ) : (
                                `Buy for GH₵ ${pkg.price.toFixed(2)}`
                              )}
                            </button>
                          </div>

                        </form>
                      )}
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
