'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { CheckCircle, XCircle, Clock, ExternalLink, RefreshCw, Loader2, ChevronDown } from 'lucide-react';

interface ApiRequest {
  id: string;
  full_name: string;
  email: string;
  business_name: string;
  website_url: string;
  ghana_card_url: string;
  document_url: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_note: string | null;
  created_at: string;
}

export default function AdminApiUsers() {
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [requests, setRequests] = useState<ApiRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => { loadRequests(); }, [tab]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const param = tab === 'all' ? '' : `?status=${tab}`;
      const res = await fetch(`/api/admin/api-requests${param}`);
      const data = await res.json();
      setRequests(data.requests || []);
    } catch {}
    setLoading(false);
  };

  const handleAction = async (requestId: string, action: 'approve' | 'reject') => {
    setActionLoading(requestId);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/api-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: requestId, action, admin_note: adminNote }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'success', text: `Application ${action === 'approve' ? 'approved' : 'rejected'} successfully.` });
        setExpandedId(null);
        setAdminNote('');
        loadRequests();
      } else {
        setMsg({ type: 'error', text: data.message || 'Action failed.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error.' });
    }
    setActionLoading(null);
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; color: string; icon: React.ReactNode; label: string }> = {
      pending: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', icon: <Clock size={12} />, label: 'Pending' },
      approved: { bg: 'rgba(16,185,129,0.1)', color: '#10B981', icon: <CheckCircle size={12} />, label: 'Approved' },
      rejected: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444', icon: <XCircle size={12} />, label: 'Rejected' },
    };
    const s = map[status] || map.pending;
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', backgroundColor: s.bg, color: s.color, padding: '0.25rem 0.65rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>
        {s.icon} {s.label}
      </span>
    );
  };

  return (
    <AppLayout userName="Admin User" userRole="admin">
      <div className="animate-fade-up">
        {/* Header */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>🔑 API Access Requests</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Review and approve developer API access applications. Approved users can then generate their API keys.</p>
          </div>
          <button onClick={loadRequests} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        {/* Status Message */}
        {msg && (
          <div style={{ padding: '0.85rem 1rem', backgroundColor: msg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: '8px', color: msg.type === 'success' ? '#4ADE80' : '#F87171', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            {msg.type === 'success' ? '✅' : '⚠️'} {msg.text}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0' }}>
          {(['pending', 'approved', 'rejected', 'all'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '0.6rem 1rem',
                fontSize: '0.84rem',
                fontWeight: 700,
                background: 'none',
                border: 'none',
                borderBottom: tab === t ? '2px solid var(--color-brand-primary)' : '2px solid transparent',
                color: tab === t ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
            <Loader2 className="animate-spin" size={24} style={{ marginRight: '0.75rem' }} /> Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
            <div style={{ fontWeight: 700 }}>No {tab === 'all' ? '' : tab} requests</div>
            <div style={{ fontSize: '0.84rem', marginTop: '0.25rem' }}>API access applications will appear here.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {requests.map(r => (
              <div key={r.id} className="card" style={{ border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                {/* Row header */}
                <div
                  style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', cursor: 'pointer' }}
                  onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                >
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{r.business_name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{r.full_name} · {r.email}</div>
                  </div>
                  {r.website_url && (
                    <a href={r.website_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: '0.78rem', color: 'var(--color-brand-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <ExternalLink size={12} /> Website
                    </a>
                  )}
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{new Date(r.created_at).toLocaleDateString('en-GB')}</div>
                  {statusBadge(r.status)}
                  <ChevronDown size={16} style={{ color: 'var(--color-text-muted)', transform: expandedId === r.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>

                {/* Expanded details */}
                {expandedId === r.id && (
                  <div style={{ borderTop: '1px solid var(--color-border)', padding: '1.25rem', backgroundColor: 'var(--color-bg-surface)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>Ghana Card / ID</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{r.ghana_card_url}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>Business Document</div>
                        <a href={r.document_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.84rem', color: 'var(--color-brand-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <ExternalLink size={13} /> View Document
                        </a>
                      </div>
                    </div>

                    {r.status === 'pending' && (
                      <>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                          <label className="form-label" style={{ fontSize: '0.8rem' }}>Admin Note (optional)</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. Documents verified, business confirmed."
                            value={adminNote}
                            onChange={e => setAdminNote(e.target.value)}
                            style={{ fontSize: '0.84rem' }}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <button
                            onClick={() => handleAction(r.id, 'approve')}
                            className="btn btn-primary"
                            disabled={actionLoading === r.id}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.55rem 1.25rem', backgroundColor: '#10B981', boxShadow: 'none' }}
                          >
                            {actionLoading === r.id ? <Loader2 className="animate-spin" size={15} /> : <CheckCircle size={15} />}
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(r.id, 'reject')}
                            className="btn btn-secondary"
                            disabled={actionLoading === r.id}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.55rem 1.25rem', color: '#EF4444', borderColor: 'rgba(239,68,68,0.3)' }}
                          >
                            <XCircle size={15} /> Reject
                          </button>
                        </div>
                      </>
                    )}
                    {r.admin_note && (
                      <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        📝 Admin note: <em>{r.admin_note}</em>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
