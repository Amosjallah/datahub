import React from 'react';
import PublicLayout from '@/components/PublicLayout';

export default function Careers() {
  const jobs = [
    { title: 'Senior Software Engineer (Backend)', location: 'Accra, Ghana (Hybrid)', type: 'Full-time' },
    { title: 'Customer Support Specialist', location: 'Accra, Ghana (On-site)', type: 'Full-time' },
  ];

  return (
    <PublicLayout>
      <section style={{ padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-blue" style={{ textTransform: 'uppercase', marginBottom: '1rem' }}>Join Our Team</span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Build the Future of Payments</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
            We are looking for passionate, driven, and talented individuals to help scale the premier VTU network in West Africa.
          </p>
        </div>

        <div className="container" style={{ maxWidth: '760px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.25rem', color: 'var(--color-text-primary)' }}>Open Positions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
            {jobs.map((job, i) => (
              <div key={i} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{job.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{job.location} &middot; {job.type}</p>
                  </div>
                  <a href="mailto:info@fadigitalservices.com" className="btn btn-secondary btn-sm">Apply Now</a>
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: '2rem', background: 'var(--color-brand-subtle)', borderColor: 'var(--color-brand-muted)', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-brand-primary)' }}>Don't see your role?</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              Send us your CV and a brief cover letter explaining how you can add value to our mission.
            </p>
            <a href="mailto:info@fadigitalservices.com" className="btn btn-primary btn-sm">Send Spontaneous Application</a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
