import React from 'react';
import PublicLayout from '@/components/PublicLayout';

export default function Blog() {
  const posts = [
    { category: 'Company News', title: 'Introducing our brand new UI redesign', date: 'July 4, 2026', readTime: '3 min read', desc: 'We have launched a fully modernized layout, updated to a premium blue, black, and white design system with responsive mobile layouts.', badgeType: 'badge-blue' },
    { category: 'Reseller Tips', title: 'How to maximize your airtime margins', date: 'June 28, 2026', readTime: '5 min read', desc: 'Learn top tips to expand your customer base, save frequent numbers to your contact list, and leverage API automation to build downlines.', badgeType: 'badge-success' },
    { category: 'Security', title: 'Keeping your digital wallet safe', date: 'June 15, 2026', readTime: '4 min read', desc: 'Follow our security checklist, enable two-factor authentication, and understand how our automated ledger logging protects your balance.', badgeType: 'badge-warning' },
  ];

  return (
    <PublicLayout>
      <section style={{ padding: '5rem 0' }}>
        <div className="container" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-blue" style={{ textTransform: 'uppercase', marginBottom: '0.5rem' }}>Company Updates</span>
          <h1 style={{ fontSize: '2.5rem' }}>Blog &amp; News</h1>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '550px', margin: '0.5rem auto 0' }}>
            Latest announcements, security tips, and reselling growth strategies.
          </p>
        </div>

        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {posts.map((post, i) => (
            <article key={i} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div className="card-body">
                <span className={`badge ${post.badgeType}`} style={{ marginBottom: '0.75rem' }}>{post.category}</span>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>{post.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>{post.date} &middot; {post.readTime}</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {post.desc}
                </p>
              </div>
              <div style={{ padding: '0 1.5rem 1.5rem' }}>
                <a href="#" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Read More &rarr;</a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
