'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';

export default function SupportCreate() {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('general');
  const [priority, setPriority] = useState('medium');
  const [message, setMessage] = useState('');

  const commonIssues = [
    'Data not delivered',
    'Airtime not received',
    'Wallet not funded',
    'Need a refund',
    'Account access issue',
    'Other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return alert('Please fill in subject and message.');
    alert(`Support ticket created successfully!\nSubject: ${subject}\nCategory: ${category}\nPriority: ${priority}`);
    setSubject('');
    setMessage('');
  };

  return (
    <AppLayout userName="Kwame Mensah" userRole="customer">
      <div style={{ maxWidth: '560px', margin: '0 auto' }} className="animate-fade-up">
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.2rem' }}>📩 Open a Support Ticket</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>We typically reply within 2 business hours.</p>
        </div>

        {/* Quick Issue selection chips */}
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>Common Issues</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {commonIssues.map((issue) => (
              <button
                key={issue}
                type="button"
                onClick={() => setSubject(issue)}
                style={{
                  padding: '0.375rem 0.875rem',
                  border: '1px solid ' + (subject === issue ? 'var(--color-brand-primary)' : 'var(--color-border)'),
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-bg-elevated)',
                  color: subject === issue ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                {issue}
              </button>
            ))}
          </div>
        </div>

        {/* Ticket Form */}
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="tkt-subject">Subject</label>
                <input
                  type="text"
                  id="tkt-subject"
                  className="form-input"
                  placeholder="Describe your issue briefly"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="tkt-cat">Category</label>
                  <select
                    id="tkt-cat"
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="purchase">Failed Purchase</option>
                    <option value="wallet">Wallet / Funding</option>
                    <option value="refund">Refund Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="tkt-pri">Priority</label>
                  <select
                    id="tkt-pri"
                    className="form-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High (Urgent)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="tkt-msg">Message</label>
                <textarea
                  id="tkt-msg"
                  className="form-textarea"
                  rows={5}
                  placeholder="Provide all relevant details (transaction reference, target phone number, errors, etc.)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>

              <div style={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 'var(--radius-md)', padding: '0.875rem 1rem', marginBottom: '1.25rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                ℹ️ For funding or recharge failure issues, please make sure to copy and paste the exact Transaction Reference number to help us resolve it faster.
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn btn-primary">📩 Submit Ticket</button>
                <Link href="/support" className="btn btn-secondary">Cancel</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
