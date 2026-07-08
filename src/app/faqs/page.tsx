'use client';

import React, { useState } from 'react';
import PublicLayout from '@/components/PublicLayout';
import { HelpCircle, Search, MessageSquare, ChevronDown } from 'lucide-react';

export default function Faqs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'General' | 'Payments' | 'Refunds'>('All');

  const faqItems = [
    { 
      q: 'What is FA DIGITAL SERVICES LTD.?', 
      a: 'FA DIGITAL SERVICES LTD. is a Ghanaian Virtual Top-Up (VTU) e-commerce platform that allows customers to buy high-speed internet data bundles, airtime, and pay electricity, water, or TV bills instantly. We also provide discount tiers for reseller agents and automated API partners.',
      category: 'General'
    },
    { 
      q: 'How long does it take for data/airtime to deliver?', 
      a: 'Delivery is automated and near-instant. Most transactions are fulfilled and credited to the recipient\'s phone number within 2 to 5 seconds.',
      category: 'General'
    },
    { 
      q: 'What payment methods do you accept?', 
      a: 'We accept MTN Mobile Money, Telecel Cash, AirtelTigo Money, and Visa/Mastercard credit or debit cards securely via Paystack.',
      category: 'Payments'
    },
    { 
      q: 'What if my transaction fails or is not delivered?', 
      a: 'In the rare event that an upstream telecommunication provider fails to process your order, our ledger engine automatically triggers an immediate refund back to your wallet. You can check your transaction list to verify this.',
      category: 'Refunds'
    },
    { 
      q: 'How do I get support?', 
      a: 'If you are logged in, you can create a support ticket directly from the app dashboard. Alternatively, you can reach out via WhatsApp or email on our contact page.',
      category: 'General'
    },
  ];

  // Filtering FAQs based on search input and selected category tabs
  const filteredFaqs = faqItems.filter(item => {
    const matchesSearch = item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.a.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <PublicLayout>
      {/* Header with search inputs */}
      <section style={{ padding: '6.5rem 0 3.5rem', background: 'radial-gradient(120% 120% at 50% -20%, rgba(0, 102, 255, 0.04) 0%, rgba(255, 255, 255, 0) 100%)', textAlign: 'center' }}>
        <div className="container animate-fade-up" style={{ maxWidth: '800px' }}>
          <span className="badge badge-blue" style={{ textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>Answers Hub</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
            Frequently Asked <span className="text-gradient">Questions</span>
          </h1>
          
          {/* Search bar widget */}
          <div style={{ position: 'relative', maxWidth: '500px', margin: '1.5rem auto 0', display: 'flex', alignItems: 'center', border: '1.5px solid var(--color-border)', borderRadius: '14px', background: '#FFFFFF', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ padding: '0 0.75rem 0 1.15rem', display: 'flex', alignItems: 'center', color: 'var(--color-text-muted)' }}>
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search answers (e.g. data delivery, refunds, payment)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                padding: '0.85rem 1rem 0.85rem 0',
                fontSize: '0.92rem',
                color: 'var(--color-text-primary)'
              }}
            />
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section style={{ padding: '1rem 0 3rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {['All', 'General', 'Payments', 'Refunds'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: activeCategory === cat ? 'var(--color-brand-primary)' : '#FFFFFF',
                color: activeCategory === cat ? '#FFFFFF' : 'var(--color-text-secondary)',
                border: activeCategory === cat ? '1.5px solid var(--color-brand-primary)' : '1.5px solid var(--color-border)',
                transition: 'all 0.2s'
              }}
              className="hover-scale"
            >
              {cat === 'All' ? '📂 Show All' : cat === 'General' ? '💡 General' : cat === 'Payments' ? '💳 Payments' : '🔄 Refunds'}
            </button>
          ))}
        </div>

        {/* FAQs Accordions list */}
        <div className="container" style={{ maxWidth: '760px', minHeight: '220px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((item, i) => (
                <details 
                  key={i} 
                  className="card glass-panel hover-glow" 
                  style={{ 
                    padding: 0, 
                    border: '1px solid var(--color-border)', 
                    borderRadius: '16px',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <summary 
                    style={{ 
                      padding: '1.35rem 1.75rem', 
                      cursor: 'pointer', 
                      fontWeight: 700, 
                      fontSize: '0.98rem',
                      listStyle: 'none', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <HelpCircle size={18} style={{ color: 'var(--color-brand-primary)' }} />
                      {item.q}
                    </span>
                    <ChevronDown size={16} style={{ color: 'var(--color-text-muted)', transition: 'transform 0.2s' }} />
                  </summary>
                  <div style={{ padding: '0 1.75rem 1.35rem', color: 'var(--color-text-secondary)', fontSize: '0.92rem', lineHeight: '1.65', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1rem' }}>
                    {item.a}
                  </div>
                </details>
              ))
            ) : (
              <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '2rem' }}>🔍</span>
                <p style={{ marginTop: '0.5rem', fontWeight: 600 }}>No answers match your search term.</p>
                <button onClick={() => { setSearchQuery(''); setActiveCategory('All'); }} style={{ marginTop: '1rem', color: 'var(--color-brand-primary)', border: 'none', background: 'none', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Reset search filters</button>
              </div>
            )}
          </div>
        </div>

        {/* Contact help CTA */}
        <div className="container" style={{ textAlign: 'center', marginTop: '4.5rem' }}>
          <div className="card glass-panel" style={{ padding: '2.5rem', borderRadius: '20px', border: '1px solid var(--color-border)', maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--color-brand-subtle)', color: 'var(--color-brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={20} />
            </div>
            <div>
              <h4 style={{ fontWeight: 800, fontSize: '1.1rem' }}>Still have unanswered questions?</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Contact support desk. We are active 24/7 to resolve issues.</p>
            </div>
            <a href="/contact" className="btn btn-primary hover-scale" style={{ color: '#FFFFFF', padding: '0.65rem 1.75rem', borderRadius: '10px', width: '100%', display: 'flex', justifyContent: 'center' }}>Get in Touch</a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
