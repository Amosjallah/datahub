'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Copy, Users, Link2, Check, Share2, MessageCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function AgentReferrals() {
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [userName, setUserName] = useState('Agent');
  const [phone, setPhone] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAgentData = async () => {
      if (!isSupabaseConfigured() || !supabase) {
        // Demo mode
        const code = 'DEMO_AGENT_001';
        setReferralCode(code);
        setReferralLink(`${window.location.origin}/buy?ref=${code}`);
        setUserName('Demo Agent');
        setReferrals([
          { name: 'John Okafor', phone: '0244 123 456', type: 'Customer', orders: 12, status: 'active', joined: 'Oct 1, 2026' },
          { name: 'Alice Johnson', phone: '0501 234 567', type: 'Customer', orders: 5, status: 'active', joined: 'Oct 3, 2026' },
        ]);
        setLoading(false);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        // Fetch agent profile from users table
        const { data: profile } = await supabase
          .from('users')
          .select('full_name, phone, referral_code')
          .eq('id', user.id)
          .maybeSingle();

        if (profile) {
          const code = profile.referral_code || user.user_metadata?.referral_code || '';
          const link = `${window.location.origin}/buy?ref=${code}`;
          setReferralCode(code);
          setReferralLink(link);
          setUserName(profile.full_name || user.email || 'Agent');
          setPhone(profile.phone || '');
        }

        // Fetch referrals (users who registered using this agent's referral code)
        const myCode = profile?.referral_code;
        if (myCode) {
          const { data: refs } = await supabase
            .from('users')
            .select('full_name, phone, created_at, role')
            .eq('referred_by', myCode)
            .order('created_at', { ascending: false });

          if (refs) {
            setReferrals(refs.map(r => ({
              name: r.full_name || 'Unknown',
              phone: r.phone || 'N/A',
              type: r.role === 'agent' ? 'Sub-agent' : 'Customer',
              status: 'active',
              joined: new Date(r.created_at).toLocaleDateString('en-GH', { day: '2-digit', month: 'short', year: 'numeric' }),
            })));
          }
        }
      } catch (err) {
        console.error('[Referrals] Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAgentData();
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      `🇬🇭 Get the cheapest data bundles in Ghana!\n\nMTN, Telecel & AirtelTigo data at the best prices.\n\nBuy now via my link:\n${referralLink}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleResendToPhone = async () => {
    if (!phone) {
      alert('No phone number on file. Update your profile first.');
      return;
    }
    try {
      const res = await fetch('/api/agent/resend-referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, referralCode, referralLink, name: userName }),
      });
      if (res.ok) {
        alert('✅ Referral link resent to your phone number!');
      } else {
        alert('Could not resend. Please copy the link manually.');
      }
    } catch {
      alert('Could not resend. Please copy the link manually.');
    }
  };

  return (
    <AppLayout userName={userName} userRole="agent">
      <div className="animate-fade-up">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>👥 My Referral Link & Sub-agents</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Share your unique link with customers and earn commission on every purchase they make.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* Referral link card */}
          <div className="card" style={{ border: '1px solid rgba(250,204,21,0.2)', padding: '1.5rem', gridColumn: 'span 2' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link2 size={18} color="#FACC15" /> Your Referral Link
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', marginBottom: '1.25rem' }}>
              When customers purchase through your link, commissions are credited to your wallet automatically.
            </p>
            
            {/* Referral Link */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                Share Link
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  readOnly 
                  className="form-input" 
                  value={referralLink || 'Loading...'}
                  style={{ fontSize: '0.8rem', background: 'var(--color-bg-base)', border: '1px solid var(--color-border)', fontFamily: 'monospace' }} 
                />
                <button 
                  onClick={handleCopyLink}
                  id="copy-referral-link-btn"
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', border: 'none', whiteSpace: 'nowrap' }}
                >
                  {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                  {copiedLink ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Referral Code */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                Referral Code
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <code style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FACC15', backgroundColor: 'rgba(250,204,21,0.08)', padding: '0.4rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(250,204,21,0.2)', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                  {referralCode || '...'}
                </code>
                <button
                  onClick={handleCopyCode}
                  id="copy-referral-code-btn"
                  style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '0.4rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  {copiedCode ? <Check size={12} /> : <Copy size={12} />}
                  {copiedCode ? 'Copied!' : 'Copy code'}
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleShareWhatsApp}
                id="share-whatsapp-btn"
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#25D366', border: 'none' }}
              >
                <MessageCircle size={14} /> Share on WhatsApp
              </button>
              <button
                onClick={handleResendToPhone}
                id="resend-to-phone-btn"
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Share2 size={14} /> Resend to My Phone
              </button>
            </div>
          </div>

          {/* Stats summary */}
          <div className="card" style={{ border: '1px solid var(--color-border)', padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0,102,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-brand-primary)', flexShrink: 0 }}>
              <Users size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Total Referrals
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: '0.15rem 0' }}>
                {loading ? '...' : `${referrals.length} members`}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 600 }}>
                Earn 5% on all their purchases
              </div>
            </div>
          </div>
        </div>

        {/* Referrals table */}
        <div className="card" style={{ border: '1px solid var(--color-border)', overflowX: 'auto' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>People Who Registered Via Your Link</h3>
          </div>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading referrals...</div>
          ) : referrals.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>No referrals yet. Share your link to start earning! 🚀</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg-surface)' }}>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Name</th>
                  <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Phone</th>
                  <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Account Type</th>
                  <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 700, textAlign: 'right' }}>Date Joined</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((r, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{r.name}</td>
                    <td style={{ padding: '1rem 0.5rem', fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>{r.phone}</td>
                    <td style={{ padding: '1rem 0.5rem', color: 'var(--color-text-secondary)' }}>{r.type}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <span className={`badge ${r.status === 'active' ? 'badge-success' : 'badge-info'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{r.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
