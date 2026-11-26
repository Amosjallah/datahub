'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, Globe, User, Mail, CreditCard, Upload, ChevronRight, Shield, Zap, Code, CheckCircle, Clock, XCircle, Key, Copy, Check, RefreshCw, Loader2 } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

type Step = 'intro' | 'form' | 'pending' | 'approved' | 'keys';

interface KycFormData {
  full_name: string;
  email: string;
  business_name: string;
  website_url: string;
  ghana_card_url: string;
  document_url: string;
}

interface ApiKey {
  id: string;
  key: string;
  label: string;
  status: string;
  created_at: string;
  last_used_at: string | null;
}

function ApiAccessInner() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('intro');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [generatingKey, setGeneratingKey] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [form, setForm] = useState<KycFormData>({
    full_name: '',
    email: '',
    business_name: '',
    website_url: '',
    ghana_card_url: '',
    document_url: '',
  });

  // Check current user session and KYC status on mount
  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    setLoading(true);
    try {
      if (!isSupabaseConfigured()) {
        setStep('intro');
        setLoading(false);
        return;
      }

      const sb = supabase!;
      const { data: { user } } = await sb.auth.getUser();
      if (!user) {
        setStep('intro');
        setLoading(false);
        return;
      }

      setCurrentUserId(user.id);

      // Check API access status
      const res = await fetch(`/api/api-access/status?userId=${user.id}`);
      const statusData = await res.json();

      if (statusData.status === 'approved') {
        setStep('approved');
        // Load existing keys
        loadApiKeys(user.id);
      } else if (statusData.status === 'pending') {
        setStep('pending');
      } else {
        setStep('intro');
        // Pre-fill form with user data
        if (user.email) setForm(f => ({ ...f, email: user.email || '', full_name: user.user_metadata?.full_name || '' }));
      }
    } catch {
      setStep('intro');
    }
    setLoading(false);
  };

  const loadApiKeys = async (userId: string) => {
    try {
      const res = await fetch(`/api/api-access/keys?userId=${userId}`);
      const data = await res.json();
      if (data.keys) setApiKeys(data.keys);
    } catch {}
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmitKyc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.business_name) {
      setErrorMsg('Please fill in all required fields (Name, Email, Business Name).');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/api-access/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, user_id: currentUserId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Submission failed. Please try again.');
      } else {
        setStep('pending');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    }
    setSubmitting(false);
  };

  const handleGenerateKey = async () => {
    if (!currentUserId) {
      setErrorMsg('Session expired. Please log in again.');
      return;
    }
    setGeneratingKey(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/api-access/generate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUserId, label: 'Default Key' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Failed to generate API key.');
      } else {
        setSuccessMsg('API key generated successfully!');
        await loadApiKeys(currentUserId);
        setStep('keys');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    }
    setGeneratingKey(false);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading) {
    return (
      <AppLayout userName="User" userRole="customer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <Loader2 className="animate-spin" size={32} style={{ color: 'var(--color-brand-primary)' }} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout userName="User" userRole="customer">
      <div className="animate-fade-up" style={{ maxWidth: '760px', margin: '0 auto' }}>

        {/* ── INTRO STEP ── */}
        {step === 'intro' && (
          <>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'rgba(var(--color-brand-primary-rgb, 250,204,21), 0.12)', marginBottom: '1rem' }}>
                <Code size={28} style={{ color: 'var(--color-brand-primary)' }} />
              </div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.5rem' }}>QuickNet Developer API</h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '540px', margin: '0 auto' }}>
                Integrate our data bundle purchasing API into your own app or platform. Apply for API access and get your key after a quick verification.
              </p>
            </div>

            {/* Benefits */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { icon: <Zap size={20} />, title: 'Instant Delivery', desc: 'API responses in under 3 seconds with DatamartGH backbone.' },
                { icon: <Shield size={20} />, title: 'Secure Keys', desc: 'Bearer token auth. Keys can be revoked anytime from your dashboard.' },
                { icon: <Code size={20} />, title: 'REST API', desc: 'Simple JSON endpoints. Buy data, check balance, query status.' },
              ].map((b, i) => (
                <div key={i} className="card" style={{ padding: '1.25rem', border: '1px solid var(--color-border)' }}>
                  <div style={{ color: 'var(--color-brand-primary)', marginBottom: '0.5rem' }}>{b.icon}</div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.25rem' }}>{b.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{b.desc}</p>
                </div>
              ))}
            </div>

            {/* API Pricing tier note */}
            <div className="card" style={{ padding: '1.25rem', border: '1px solid var(--color-border)', marginBottom: '2rem', backgroundColor: 'rgba(var(--color-brand-primary-rgb, 250,204,21), 0.04)' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>💰 API Pricing Tier</h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                API partners enjoy our <strong>API rate tier</strong> — only <strong>5% above wholesale</strong> supplier price. For example: MTN 5GB (supplier GH₵20) → your API price <strong>GH₵21.00</strong>. Prices are built-in; no manual calculations needed.
              </p>
            </div>

            {/* Steps overview */}
            <div className="card" style={{ padding: '1.5rem', border: '1px solid var(--color-border)', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.25rem' }}>How API Access Works</h3>
              {[
                { n: '1', t: 'Submit Your Details', d: 'Provide your business name, Ghana Card, website URL, and supporting document.' },
                { n: '2', t: 'Admin Review', d: 'Our team reviews your application within 24 hours.' },
                { n: '3', t: 'Generate API Key', d: 'Once approved, return here to generate your secure API key.' },
                { n: '4', t: 'Start Integrating', d: 'Use your Bearer token to call /api/v1/data, /api/v1/purchase, and more.' },
              ].map((s) => (
                <div key={s.n} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--color-brand-primary)', color: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.8rem', flexShrink: 0 }}>{s.n}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{s.t}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{s.d}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setStep('form')}
                className="btn btn-primary"
                style={{ flex: 1, height: '48px', fontSize: '0.95rem', fontWeight: 800 }}
              >
                Apply for API Access <ChevronRight size={18} />
              </button>
              <Link href="/api-docs" className="btn btn-secondary" style={{ height: '48px', padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                View API Docs
              </Link>
            </div>
          </>
        )}

        {/* ── KYC FORM STEP ── */}
        {step === 'form' && (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <button onClick={() => setStep('intro')} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.85rem', padding: 0 }}>← Back</button>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 900, marginTop: '0.5rem', marginBottom: '0.4rem' }}>API Access Application</h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>All fields marked <span style={{ color: '#EF4444' }}>*</span> are required. We use this information to verify your identity and business.</p>
            </div>

            {errorMsg && (
              <div style={{ padding: '0.85rem 1rem', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#F87171', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmitKyc} className="card" style={{ padding: '1.75rem', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Full Name */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name <span style={{ color: '#EF4444' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input type="text" name="full_name" required placeholder="e.g. Kwame Mensah" className="form-input" style={{ paddingLeft: '2.5rem' }} value={form.full_name} onChange={handleFormChange} />
                </div>
              </div>

              {/* Email */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Address <span style={{ color: '#EF4444' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input type="email" name="email" required placeholder="e.g. kwame@mybusiness.com" className="form-input" style={{ paddingLeft: '2.5rem' }} value={form.email} onChange={handleFormChange} />
                </div>
              </div>

              {/* Business Name */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Business / Company Name <span style={{ color: '#EF4444' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <FileText size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input type="text" name="business_name" required placeholder="e.g. Amos Tech Solutions" className="form-input" style={{ paddingLeft: '2.5rem' }} value={form.business_name} onChange={handleFormChange} />
                </div>
              </div>

              {/* Website URL */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Website / App URL <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>(optional but recommended)</span></label>
                <div style={{ position: 'relative' }}>
                  <Globe size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input type="url" name="website_url" placeholder="https://yourbusiness.com" className="form-input" style={{ paddingLeft: '2.5rem' }} value={form.website_url} onChange={handleFormChange} />
                </div>
              </div>

              {/* Ghana Card */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Ghana Card Number / ID <span style={{ color: '#EF4444' }}>*</span></label>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Enter your Ghana National ID number. We will verify it during review.</p>
                <div style={{ position: 'relative' }}>
                  <CreditCard size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input type="text" name="ghana_card_url" required placeholder="GHA-XXXXXXXXX-X" className="form-input" style={{ paddingLeft: '2.5rem' }} value={form.ghana_card_url} onChange={handleFormChange} />
                </div>
              </div>

              {/* Business Document */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Business Registration / Supporting Document Link <span style={{ color: '#EF4444' }}>*</span></label>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Upload your document to Google Drive or Dropbox and paste the shareable link below.</p>
                <div style={{ position: 'relative' }}>
                  <Upload size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input type="url" name="document_url" required placeholder="https://drive.google.com/..." className="form-input" style={{ paddingLeft: '2.5rem' }} value={form.document_url} onChange={handleFormChange} />
                </div>
              </div>

              <div style={{ padding: '0.85rem 1rem', backgroundColor: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px', fontSize: '0.8rem', color: '#93C5FD' }}>
                🔒 Your information is kept strictly confidential and used only for API access verification by the QuickNet team.
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ height: '48px', fontWeight: 800, fontSize: '0.95rem' }}>
                {submitting ? <Loader2 className="animate-spin" size={18} /> : <><FileText size={18} /> Submit Application</>}
              </button>
            </form>
          </>
        )}

        {/* ── PENDING STEP ── */}
        {step === 'pending' && (
          <div style={{ textAlign: 'center', paddingTop: '3rem' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: 'rgba(245,158,11,0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Clock size={32} style={{ color: '#F59E0B' }} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Application Under Review</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 2rem' }}>
              Your API access application has been submitted. Our team typically reviews applications within <strong>24 hours</strong>. You'll be notified by email once approved.
            </p>
            <div className="card" style={{ padding: '1.25rem', border: '1px solid rgba(245,158,11,0.3)', backgroundColor: 'rgba(245,158,11,0.05)', maxWidth: '400px', margin: '0 auto 1.5rem', textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  <Clock size={15} style={{ color: '#F59E0B' }} /> Verification Checklist
                </div>
                <div>✅ Application received</div>
                <div>⏳ Identity verification in progress</div>
                <div style={{ color: 'var(--color-border)' }}>⬜ Document review</div>
                <div style={{ color: 'var(--color-border)' }}>⬜ Approval & key generation</div>
              </div>
            </div>
            <button onClick={checkUserStatus} className="btn btn-secondary" style={{ gap: '0.5rem' }}>
              <RefreshCw size={16} /> Refresh Status
            </button>
          </div>
        )}

        {/* ── APPROVED / GENERATE KEY STEP ── */}
        {(step === 'approved' || step === 'keys') && (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '20px', padding: '0.3rem 0.85rem', marginBottom: '0.75rem' }}>
                <CheckCircle size={14} style={{ color: '#10B981' }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#10B981' }}>API ACCESS APPROVED</span>
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.4rem' }}>Your API Keys</h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Generate and manage your API keys below. Keep your keys secret — treat them like passwords.</p>
            </div>

            {errorMsg && (
              <div style={{ padding: '0.85rem 1rem', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#F87171', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                ⚠️ {errorMsg}
              </div>
            )}
            {successMsg && (
              <div style={{ padding: '0.85rem 1rem', backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', color: '#4ADE80', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                ✅ {successMsg}
              </div>
            )}

            {/* Generate Key Button */}
            {apiKeys.length === 0 && (
              <div className="card" style={{ padding: '2rem', border: '1px solid var(--color-border)', textAlign: 'center', marginBottom: '1.5rem' }}>
                <Key size={36} style={{ color: 'var(--color-brand-primary)', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.5rem' }}>Generate Your First API Key</h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Your account is approved. Click below to create your API key.</p>
                <button onClick={handleGenerateKey} className="btn btn-primary" disabled={generatingKey} style={{ height: '48px', fontWeight: 800, padding: '0 2rem' }}>
                  {generatingKey ? <Loader2 className="animate-spin" size={18} /> : <><Key size={16} /> Generate API Key</>}
                </button>
              </div>
            )}

            {/* Existing Keys */}
            {apiKeys.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {apiKeys.map((k) => (
                  <div key={k.id} className="card" style={{ padding: '1.25rem', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>{k.label}</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--color-text-primary)', wordBreak: 'break-all', backgroundColor: 'var(--color-bg-surface)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '0.5rem' }}>
                          {k.key}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                          Created: {new Date(k.created_at).toLocaleDateString('en-GB')} · Status: <span style={{ color: k.status === 'active' ? '#10B981' : '#EF4444', fontWeight: 700 }}>{k.status.toUpperCase()}</span>
                        </div>
                      </div>
                      <button onClick={() => handleCopy(k.key, k.id)} className="btn btn-secondary" style={{ padding: '0.5rem 0.9rem', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                        {copiedKey === k.id ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                      </button>
                    </div>
                  </div>
                ))}

                <button onClick={handleGenerateKey} className="btn btn-secondary" disabled={generatingKey} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {generatingKey ? <Loader2 className="animate-spin" size={16} /> : <><Key size={16} /> Generate New Key</>}
                </button>
              </div>
            )}

            {/* API Docs Link */}
            <div className="card" style={{ padding: '1.25rem', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>📄 Integration Guide</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>View our full API documentation with code examples and endpoint references.</div>
              </div>
              <Link href="/api-docs" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontWeight: 700, fontSize: '0.85rem' }}>
                View API Docs <ChevronRight size={16} />
              </Link>
            </div>
          </>
        )}

      </div>
    </AppLayout>
  );
}

export default function ApiAccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
      <ApiAccessInner />
    </Suspense>
  );
}
