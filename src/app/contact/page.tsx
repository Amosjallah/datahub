'use client';

import React, { useState } from 'react';
import PublicLayout from '@/components/PublicLayout';
import { Send, CheckCircle2, MessageCircle, Mail, Clock, Loader2 } from 'lucide-react';

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
      <section style={{ padding: '5rem 0 3rem', background: '#030712', textAlign: 'center' }}>
        <div className="container animate-fade-up" style={{ maxWidth: '800px' }}>
          <span style={{ color: '#FACC15', textTransform: 'uppercase', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.12em', display: 'block', marginBottom: '0.75rem' }}>Support Channels</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '1rem', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Get in <span className="text-gradient">Touch with Us</span>
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Have questions about integrations, reseller rates, or need technical help? Send us a message below.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section style={{ padding: '2rem 0 6rem', backgroundColor: '#030712' }}>
        <div className="container hero-grid" style={{ maxWidth: '1000px', alignItems: 'start' }}>
          
          {/* Contact form card */}
          <div className="card" style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-md)', backgroundColor: '#0F172A' }}>
            <div className="card-body" style={{ padding: '2.5rem 2rem' }}>
              
              {!isSuccess ? (
                <>
                  <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: 900, color: '#FFFFFF' }}>Send an inquiry</h3>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                      <label className="form-label" style={{ color: '#E5E7EB' }}>Your Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. Samuel Adjei" 
                        required 
                        style={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.08)' }}
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      />
                    </div>
                    
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                      <label className="form-label">Email Address</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        placeholder="e.g. name@domain.com" 
                        required 
                        style={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.08)' }}
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      />
                    </div>
                    
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                      <label className="form-label">Message</label>
                      <textarea 
                        className="form-textarea" 
                        rows={4} 
                        placeholder="Detail your question or carrier issue..." 
                        required
                        style={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.08)' }}
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
                        color: '#030712',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(16,185,129,0.1)', color: '#10B981', marginBottom: '1.5rem' }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', color: '#FFFFFF' }}>Message Dispatched</h3>
                  <p style={{ color: '#9CA3AF', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '380px', margin: '0 auto 2rem' }}>
                    Thank you! Your ticket query has been routed. We will reach back to your email inbox within 2 hours.
                  </p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="btn btn-secondary"
                    style={{ padding: '0.75rem 2rem', borderRadius: '12px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    Send another message
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Channels List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Channel Card: WhatsApp */}
            <div className="card" style={{ padding: '2rem 1.75rem', display: 'flex', gap: '1.25rem', alignItems: 'start', backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(16, 185, 129, 0.08)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MessageCircle size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.25rem' }}>Official WhatsApp Bot</h4>
                <p style={{ fontSize: '0.85rem', color: '#9CA3AF', lineHeight: '1.5', marginBottom: '1rem' }}>
                  Text our 24/7 automated support bot on WhatsApp for instant assistance and order updates.
                </p>
                <a 
                  href="https://whatsapp.com/channel/0029Vb6zDvaGzzKTwCWszC1Z" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FACC15', textDecoration: 'none' }}
                >
                  Join WhatsApp Channel →
                </a>
              </div>
            </div>

            {/* Channel Card: Email */}
            <div className="card" style={{ padding: '2rem 1.75rem', display: 'flex', gap: '1.25rem', alignItems: 'start', backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(250, 204, 21, 0.08)', color: '#FACC15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.25rem' }}>Email Support</h4>
                <p style={{ fontSize: '0.85rem', color: '#9CA3AF', lineHeight: '1.5', marginBottom: '0.5rem' }}>
                  Send an email to our support helpdesk. We process tickets constantly.
                </p>
                <a href="mailto:support@fadigitalservices.com" style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FACC15', fontFamily: 'monospace' }}>
                  support@fadigitalservices.com
                </a>
              </div>
            </div>

            {/* Channel Card: Hours */}
            <div className="card" style={{ padding: '2rem 1.75rem', display: 'flex', gap: '1.25rem', alignItems: 'start', backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(59, 130, 246, 0.08)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Clock size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.25rem' }}>Operating Hours</h4>
                <p style={{ fontSize: '0.85rem', color: '#9CA3AF', lineHeight: '1.5' }}>
                  Online purchasing is automated 24/7/365. Support staff are active for queries daily from **8:00 AM to 10:00 PM GMT**.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>
    </PublicLayout>
  );
}
