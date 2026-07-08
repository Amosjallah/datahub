'use client';

import React, { useState } from 'react';
import PublicLayout from '@/components/PublicLayout';
import { Send, CheckCircle2, MessageCircle, Mail, MapPin, Clock } from 'lucide-react';

export default function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormState({ name: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <PublicLayout>
      {/* Header */}
      <section style={{ padding: '6.5rem 0 3.5rem', background: 'radial-gradient(120% 120% at 50% -20%, rgba(0, 102, 255, 0.04) 0%, rgba(255, 255, 255, 0) 100%)', textAlign: 'center' }}>
        <div className="container animate-fade-up" style={{ maxWidth: '800px' }}>
          <span className="badge badge-blue" style={{ textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>Support Channels</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Get in <span className="text-gradient">Touch with Us</span>
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Have questions about integrations, reseller rates, or need technical help? Send us a message below.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section style={{ padding: '2rem 0 6rem' }}>
        <div className="container hero-grid" style={{ maxWidth: '1000px', alignItems: 'start' }}>
          
          {/* Contact form card */}
          <div className="card glass-panel" style={{ border: '1px solid var(--color-border)', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
            <div className="card-body" style={{ padding: '2.5rem 2rem' }}>
              
              {!isSuccess ? (
                <>
                  <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: 900 }}>Send an inquiry</h3>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-name">Your Name</label>
                      <input 
                        type="text" 
                        id="contact-name" 
                        className="form-input" 
                        placeholder="Kwame Mensah" 
                        required 
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-email">Email Address</label>
                      <input 
                        type="email" 
                        id="contact-email" 
                        className="form-input" 
                        placeholder="kwame@example.com" 
                        required 
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-msg">Message</label>
                      <textarea 
                        id="contact-msg" 
                        className="form-textarea" 
                        rows={4} 
                        placeholder="Detail your question or carrier issue..." 
                        required
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      ></textarea>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-full hover-scale" 
                      style={{ 
                        padding: '0.9rem', 
                        borderRadius: '12px', 
                        fontWeight: 700, 
                        color: '#FFFFFF',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          {/* Spinner */}
                          <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'pulse 1s linear infinite' }}></span>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send size={16} /> Send inquiry
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Message Sent Successfully!</h3>
                    <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem', lineHeight: '1.6' }}>
                      Thank you for contacting us. A support representative will review your message and reply via email within 15 minutes.
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="btn btn-secondary btn-sm hover-scale"
                    style={{ borderRadius: '10px', padding: '0.65rem 1.5rem', fontWeight: 700, marginTop: '1rem' }}
                  >
                    Send another message
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Channels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Live Chat Support Channels */}
            <div className="card glass-panel" style={{ padding: '2rem 1.5rem', border: '1px solid var(--color-border)', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>Support Channels</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* WhatsApp */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MessageCircle size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--color-text-primary)' }}>WhatsApp Live Help Desk</div>
                    <a 
                      href="https://wa.me/233241234567" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem' }}
                      className="hover-scale"
                    >
                      Chat Now (+233 24 123 4567)
                    </a>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>Typical response: under 2 minutes.</span>
                  </div>
                </div>

                {/* Email */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(0, 102, 255, 0.1)', color: 'var(--color-brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--color-text-primary)' }}>Email Help Desk</div>
                    <a 
                      href="mailto:info@fadigitalservices.com" 
                      style={{ fontSize: '0.85rem', color: 'var(--color-brand-primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem' }}
                    >
                      info@fadigitalservices.com
                    </a>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>Typical response: within 15 minutes.</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Address & Hours */}
            <div className="card glass-panel" style={{ padding: '2rem 1.5rem', border: '1px solid var(--color-border)', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: '0.92rem', marginBottom: '0.35rem' }}>Headquarters</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.5', margin: 0 }}>
                    FA DIGITAL SERVICES LTD.<br />
                    Spintex Road, Block B4<br />
                    Accra, Ghana
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={18} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: '0.92rem', marginBottom: '0.35rem' }}>Working Hours</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.5', margin: 0 }}>
                    Monday - Friday: 8:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 4:00 PM (Chat Only)<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
    </PublicLayout>
  );
}
