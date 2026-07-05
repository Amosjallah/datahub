import React from 'react';
import PublicLayout from '@/components/PublicLayout';

export default function Faqs() {
  const faqItems = [
    { q: 'What is FA DIGITAL SERVICES LTD.?', a: 'FA DIGITAL SERVICES LTD. is a Ghanaian Virtual Top-Up (VTU) e-commerce platform that allows customers to buy high-speed internet data bundles, airtime, and pay electricity, water, or TV bills instantly. We also provide discount tiers for reseller agents and automated API partners.' },
    { q: 'How long does it take for data/airtime to deliver?', a: 'Delivery is automated and near-instant. Most transactions are fulfilled and credited to the recipient\'s phone number within 2 to 5 seconds.' },
    { q: 'What payment methods do you accept?', a: 'We accept MTN Mobile Money, Telecel Cash, AirtelTigo Money, and Visa/Mastercard credit or debit cards securely via Paystack.' },
    { q: 'What if my transaction fails or is not delivered?', a: 'In the rare event that an upstream telecommunication provider fails to process your order, our ledger engine automatically triggers an immediate refund back to your wallet. You can check your transaction list to verify this.' },
    { q: 'How do I get support?', a: 'If you are logged in, you can create a support ticket directly from the app dashboard. Alternatively, you can reach out via WhatsApp or email on our contact page.' },
  ];

  return (
    <PublicLayout>
      <section style={{ padding: '5rem 0' }}>
        <div className="container" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-blue" style={{ textTransform: 'uppercase', marginBottom: '0.5rem' }}>Answers Hub</span>
          <h1 style={{ fontSize: '2.5rem' }}>Frequently Asked Questions</h1>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '550px', margin: '0.5rem auto 0' }}>
            Find quick answers to common support requests. If you still need help, feel free to contact us.
          </p>
        </div>

        <div className="container" style={{ maxWidth: '760px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqItems.map((item, i) => (
              <details key={i} className="card" style={{ padding: 0 }}>
                <summary style={{ padding: '1.25rem 1.5rem', cursor: 'pointer', fontWeight: 600, listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {item.q}
                </summary>
                <div style={{ padding: '0 1.5rem 1.25rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>

        <div className="container" style={{ textAlign: 'center', marginTop: '3.5rem' }}>
          <p style={{ marginBottom: '1.25rem', color: 'var(--color-text-secondary)' }}>Still have unanswered questions?</p>
          <a href="/contact" className="btn btn-primary">Get in Touch</a>
        </div>
      </section>
    </PublicLayout>
  );
}
