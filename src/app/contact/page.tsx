import React from 'react';
import PublicLayout from '@/components/PublicLayout';

export default function Contact() {
  return (
    <PublicLayout>
      <section style={{ padding: '5rem 0' }}>
        <div className="container" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-blue" style={{ textTransform: 'uppercase', marginBottom: '0.5rem' }}>Support Channels</span>
          <h1 style={{ fontSize: '2.5rem' }}>Get in Touch with Us</h1>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '550px', margin: '0.5rem auto 0' }}>
            Have questions or need support? Drop us a message or contact us directly.
          </p>
        </div>

        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', maxWidth: '900px', alignItems: 'start' }}>
          {/* Contact form */}
          <div className="card">
            <div className="card-body">
              <h3 style={{ marginBottom: '1.25rem', fontSize: '1.1rem' }}>Send a Message</h3>
              <form action="#" method="POST">
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">Your Name</label>
                  <input type="text" id="contact-name" className="form-input" placeholder="Kwame Mensah" required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">Email Address</label>
                  <input type="email" id="contact-email" className="form-input" placeholder="kwame@example.com" required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-msg">Message</label>
                  <textarea id="contact-msg" className="form-textarea" rows={4} placeholder="How can we help you?" required></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-full">⚡ Send Inquiry</button>
              </form>
            </div>
          </div>

          {/* Contact details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Support Channels</h3>
              <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '1.25rem' }}>📱</div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>WhatsApp Chat</div>
                    <a href="https://wa.me/233241234567" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: '#10B981' }}>Chat Now (+233 24 123 4567)</a>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '1.25rem' }}>✉️</div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Email Support</div>
                    <a href="mailto:info@fadigitalservices.com" style={{ fontSize: '0.85rem', color: 'var(--color-brand-primary)' }}>info@fadigitalservices.com</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Office Address</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                FA DIGITAL SERVICES LTD.<br />
                Spintex Road, Block B4<br />
                Accra, Ghana
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
