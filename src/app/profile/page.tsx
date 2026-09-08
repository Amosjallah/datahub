'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

export default function Profile() {
  const [name, setName] = useState('User');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const referralCode = 'FA-DATA-77';

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setEmail(user.email || '');
          const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
          setName(fullName);
          if (user.user_metadata?.phone) {
            setPhone(user.user_metadata.phone);
          }
        }
      } catch (err) {
        console.warn('[Profile] Load error:', err);
      }
    }
    loadProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: name.trim(),
          phone: phone.trim(),
        },
      });

      setLoading(false);
      if (error) {
        setMessage({ type: 'error', text: error.message || 'Failed to update profile.' });
      } else {
        setMessage({ type: 'success', text: 'Personal profile details updated successfully!' });
      }
    } catch (err: any) {
      setLoading(false);
      setMessage({ type: 'error', text: err.message || 'Unexpected error updating profile.' });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      alert('New password must be at least 6 characters.');
      return;
    }

    setPassLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      setPassLoading(false);
      if (error) {
        setMessage({ type: 'error', text: error.message || 'Failed to change password.' });
      } else {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err: any) {
      setPassLoading(false);
      setMessage({ type: 'error', text: err.message || 'Unexpected error updating password.' });
    }
  };

  const copyReferral = () => {
    navigator.clipboard.writeText(referralCode);
    setMessage({ type: 'success', text: 'Referral code copied to clipboard!' });
  };

  return (
    <AppLayout userName={name} userRole="customer">
      <div style={{ maxWidth: '640px', margin: '0 auto' }} className="animate-fade-up">
        
        {message && (
          <div
            className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}
            style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Profile Card Header */}
        <div className="card" style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.5rem', color: '#fff' }}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{name}</h2>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <span className="badge badge-blue">Customer</span>
              <span className="badge badge-success">✓ Active Member</span>
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
                <input type="email" id="prof-email" className="form-input" value={email} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="prof-phone">Phone Number</label>
                <input type="tel" id="prof-phone" className="form-input" placeholder="e.g. 0244123456" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Loader2 className="animate-spin" size={16} /> Saving...
                  </span>
                ) : (
                  'Save Details'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Security Settings */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-body">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Security & Password</h3>
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label className="form-label" htmlFor="prof-new-pass">New Password</label>
                <input
                  type="password"
                  id="prof-new-pass"
                  className="form-input"
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-secondary" disabled={passLoading}>
                {passLoading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Loader2 className="animate-spin" size={16} /> Updating...
                  </span>
                ) : (
                  'Update Password'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Referral Card */}
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,102,255,0.06), rgba(0,208,132,0.06))' }}>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.2rem' }}>Referral Code</h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', margin: 0 }}>Share with friends to earn wallet commission.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1.1rem', background: 'var(--color-bg-elevated)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--color-brand-primary)' }}>
                {referralCode}
              </span>
              <button type="button" className="btn btn-primary btn-sm" onClick={copyReferral}>Copy</button>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
