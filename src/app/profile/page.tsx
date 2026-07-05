'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';

export default function Profile() {
  const [name, setName] = useState('Kwame Mensah');
  const [email, setEmail] = useState('kwame@demo.gh');
  const [phone, setPhone] = useState('0244123456');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const referralCode = 'FA-MENS-92';

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profile updated successfully.');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Password updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
  };

  const copyReferral = () => {
    navigator.clipboard.writeText(referralCode);
    alert('Referral link copied to clipboard!');
  };

  return (
    <AppLayout userName={name} userRole="customer">
      <div style={{ maxWidth: '640px', margin: '0 auto' }} className="animate-fade-up">
        {/* Profile Card Header */}
        <div className="card" style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.5rem', color: '#fff' }}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{name}</h2>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <span className="badge badge-blue">Customer</span>
              <span className="badge badge-success">✓ KYC Verified</span>
            </div>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-body">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Personal Details</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="form-label" htmlFor="prof-name">Full Name</label>
                <input type="text" id="prof-name" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="prof-email">Email Address</label>
                <input type="email" id="prof-email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="prof-phone">Phone Number</label>
                <input type="tel" id="prof-phone" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary btn-sm">Update Profile</button>
            </form>
          </div>
        </div>

        {/* Change Password */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-body">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Change Password</h3>
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label className="form-label" htmlFor="curr-pass">Current Password</label>
                <input type="password" id="curr-pass" className="form-input" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="new-pass">New Password</label>
                <input type="password" id="new-pass" className="form-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-secondary btn-sm">Change Password</button>
            </form>
          </div>
        </div>

        {/* Referrals */}
        <div className="card">
          <div className="card-body">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Refer and Earn</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Invite your friends to FA DIGITAL SERVICES LTD. and earn 2% commission on their wallet fund deposits.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input type="text" className="form-input" value={referralCode} style={{ fontFamily: 'monospace', fontSize: '1.05rem', background: 'var(--color-bg-base)', borderStyle: 'dashed' }} readOnly />
              <button type="button" className="btn btn-primary" onClick={copyReferral}>Copy</button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
