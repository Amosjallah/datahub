'use client';

import React from 'react';
import PublicLayout from '@/components/PublicLayout';

export default function Blog() {
  const posts = [
    { 
      category: 'Support Guide', 
      title: 'Why does my data bundle delay?', 
      date: 'July 10, 2026', 
      readTime: '3 min read', 
      desc: 'Understand the common causes behind mobile operator network delays in Ghana and how our automated ledger monitors queues to ensure delivery or instant refund.', 
      badgeType: 'badge-warning' 
    },
    { 
      category: 'Backend Architecture', 
      title: 'How FA Digital delivers data fast', 
      date: 'July 2, 2026', 
      readTime: '5 min read', 
      desc: 'An in-depth look at our low-latency VTU gateway integrations with MTN, Telecel, and AirtelTigo API nodes that allow 3-second delivery.', 
      badgeType: 'badge-blue' 
    },
    { 
      category: 'Market Pricing', 
      title: 'MTN, Telecel, AirtelTigo data prices in Ghana', 
      date: 'June 25, 2026', 
      readTime: '4 min read', 
      desc: 'A comprehensive comparison of standard official data bundle rates in Ghana versus the bulk reseller rates available on FA Digital.', 
      badgeType: 'badge-success' 
    },
  ];

  return (
    <PublicLayout>
      <section style={{ padding: '5rem 0', backgroundColor: '#030712', minHeight: '80vh' }}>
        <div className="container animate-fade-up" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ color: '#FACC15', textTransform: 'uppercase', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.12em', display: 'block', marginBottom: '0.75rem' }}>Company Updates</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '0.75rem' }}>Blog &amp; News</h1>
          <p style={{ color: '#9CA3AF', maxWidth: '550px', margin: '0.5rem auto 0' }}>
            Latest announcements, developer guides, and mobile pricing comparisons in Ghana.
          </p>
        </div>

        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {posts.map((post, i) => (
            <article key={i} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="card-body">
                <span className={`badge ${post.badgeType}`} style={{ marginBottom: '0.75rem' }}>{post.category}</span>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: '#FFFFFF' }}>{post.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#9CA3AF', marginBottom: '0.75rem' }}>{post.date} &middot; {post.readTime}</p>
                <p style={{ fontSize: '0.9rem', color: '#9CA3AF', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {post.desc}
                </p>
              </div>
              <div style={{ padding: '0 2rem 2rem' }}>
                <a href="#" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FACC15' }}>Read More &rarr;</a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
