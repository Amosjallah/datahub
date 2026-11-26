'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Save, RefreshCw, Loader2, TrendingUp, Info } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface PricingRow {
  service_id: string;
  network: string;
  volume: string;
  name: string;
  base_price: number;
  custom_price: number;
  is_custom: boolean;
  edited?: number; // temp edited value
}

const NETWORK_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  MTN: { bg: 'rgba(250,204,21,0.1)', color: '#FACC15', border: 'rgba(250,204,21,0.3)' },
  Telecel: { bg: 'rgba(220,38,38,0.1)', color: '#F87171', border: 'rgba(220,38,38,0.3)' },
  AirtelTigo: { bg: 'rgba(239,68,68,0.08)', color: '#FC8181', border: 'rgba(239,68,68,0.25)' },
};

export default function AgentPricingPage() {
  const [rows, setRows] = useState<PricingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [filterNetwork, setFilterNetwork] = useState<string>('All');
  const [dirtyCount, setDirtyCount] = useState(0);

  useEffect(() => {
    initPage();
  }, []);

  const initPage = async () => {
    setLoading(true);
    let uid = 'demo-agent';

    if (isSupabaseConfigured() && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) uid = user.id;
    }
    setAgentId(uid);
    await loadPrices(uid);
    setLoading(false);
  };

  const loadPrices = async (aid: string) => {
    try {
      const res = await fetch(`/api/agent/pricing?agentId=${aid}`);
      const data = await res.json();
      setRows((data.prices || []).map((p: PricingRow) => ({ ...p, edited: p.custom_price })));
    } catch {}
  };

  const handlePriceChange = (serviceId: string, value: string) => {
    setRows(prev => prev.map(r => {
      if (r.service_id === serviceId) {
        const num = parseFloat(value) || r.base_price;
        const updated = { ...r, edited: num };
        return updated;
      }
      return r;
    }));
    // Count dirty
    setDirtyCount(prev => prev + 1);
  };

  const handleSave = async () => {
    if (!agentId) return;
    setSaving(true);
    setMsg(null);
    try {
      const payload = rows.map(r => ({
        service_id: r.service_id,
        network: r.network,
        volume: r.volume,
        custom_price: r.edited ?? r.custom_price,
      }));

      const res = await fetch('/api/agent/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agentId, prices: payload }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'success', text: `Saved ${data.saved || payload.length} price(s) successfully.` });
        setDirtyCount(0);
        await loadPrices(agentId);
      } else {
        setMsg({ type: 'error', text: data.message || 'Save failed.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error. Please try again.' });
    }
    setSaving(false);
  };

  const handleReset = (serviceId: string) => {
    setRows(prev => prev.map(r => r.service_id === serviceId ? { ...r, edited: r.base_price } : r));
  };

  const networks = ['All', ...Array.from(new Set(rows.map(r => r.network)))];
  const filtered = filterNetwork === 'All' ? rows : rows.filter(r => r.network === filterNetwork);

  return (
    <AppLayout userName="Agent" userRole="agent">
      <div className="animate-fade-up">
        {/* Header */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.3rem' }}>💰 My Custom Pricing</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Set your own selling prices for each data bundle. You cannot go below your agent cost price.</p>
          </div>
          <button onClick={handleSave} className="btn btn-primary" disabled={saving || loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {saving ? 'Saving...' : `Save${dirtyCount > 0 ? ' Changes' : ''}`}
          </button>
        </div>

        {/* Info Banner */}
        <div style={{ padding: '0.9rem 1.1rem', backgroundColor: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.84rem', color: '#93C5FD' }}>
          <Info size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
          <div>
            <strong>How it works:</strong> The <strong>Cost Price</strong> column is your agent purchase price (what you pay us). Set any <strong>Sell Price</strong> above your cost — that's your profit. Your customers will see your sell price when they open your referral link.
          </div>
        </div>

        {/* Status Message */}
        {msg && (
          <div style={{ padding: '0.85rem 1rem', backgroundColor: msg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: '8px', color: msg.type === 'success' ? '#4ADE80' : '#F87171', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            {msg.type === 'success' ? '✅' : '⚠️'} {msg.text}
          </div>
        )}

        {/* Network Filter */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {networks.map(n => (
            <button
              key={n}
              onClick={() => setFilterNetwork(n)}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: filterNetwork === n ? '1px solid var(--color-brand-primary)' : '1px solid var(--color-border)',
                backgroundColor: filterNetwork === n ? 'rgba(250,204,21,0.1)' : 'transparent',
                color: filterNetwork === n ? 'var(--color-brand-primary)' : 'var(--color-text-muted)',
              }}
            >
              {n}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
            <Loader2 className="animate-spin" size={24} style={{ marginRight: '0.75rem' }} /> Loading prices...
          </div>
        ) : (
          <div className="card" style={{ border: '1px solid var(--color-border)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-surface)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700 }}>Bundle</th>
                  <th style={{ padding: '0.9rem 0.75rem', fontWeight: 700 }}>Network</th>
                  <th style={{ padding: '0.9rem 0.75rem', fontWeight: 700 }}>Volume</th>
                  <th style={{ padding: '0.9rem 0.75rem', fontWeight: 700 }}>Cost Price</th>
                  <th style={{ padding: '0.9rem 0.75rem', fontWeight: 700 }}>Your Sell Price (GH₵)</th>
                  <th style={{ padding: '0.9rem 0.75rem', fontWeight: 700 }}>Your Profit</th>
                  <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => {
                  const sellPrice = r.edited ?? r.custom_price;
                  const profit = Math.max(0, sellPrice - r.base_price);
                  const profitPct = r.base_price > 0 ? ((profit / r.base_price) * 100).toFixed(1) : '0.0';
                  const nc = NETWORK_COLORS[r.network] || { bg: 'rgba(100,116,139,0.1)', color: '#94A3B8', border: 'rgba(100,116,139,0.3)' };
                  const belowCost = sellPrice < r.base_price;

                  return (
                    <tr key={r.service_id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600 }}>{r.name}</td>
                      <td style={{ padding: '0.85rem 0.75rem' }}>
                        <span style={{ display: 'inline-block', backgroundColor: nc.bg, color: nc.color, border: `1px solid ${nc.border}`, padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700 }}>
                          {r.network}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700 }}>{r.volume}</td>
                      <td style={{ padding: '0.85rem 0.75rem', fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>
                        GH₵ {r.base_price.toFixed(2)}
                      </td>
                      <td style={{ padding: '0.85rem 0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>GH₵</span>
                          <input
                            type="number"
                            step="0.01"
                            min={r.base_price}
                            value={sellPrice}
                            onChange={e => handlePriceChange(r.service_id, e.target.value)}
                            style={{
                              width: '90px',
                              padding: '0.4rem 0.6rem',
                              borderRadius: '8px',
                              border: `1px solid ${belowCost ? 'rgba(239,68,68,0.5)' : 'var(--color-border)'}`,
                              backgroundColor: belowCost ? 'rgba(239,68,68,0.08)' : 'var(--color-bg)',
                              color: belowCost ? '#EF4444' : 'var(--color-text-primary)',
                              fontFamily: 'monospace',
                              fontSize: '0.84rem',
                              fontWeight: 700,
                            }}
                          />
                        </div>
                        {belowCost && <div style={{ fontSize: '0.68rem', color: '#EF4444', marginTop: '0.2rem' }}>Below cost!</div>}
                      </td>
                      <td style={{ padding: '0.85rem 0.75rem' }}>
                        {profit > 0 ? (
                          <span style={{ color: '#10B981', fontWeight: 700, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <TrendingUp size={13} /> +GH₵{profit.toFixed(2)} <span style={{ fontSize: '0.72rem', color: '#6EE7B7' }}>({profitPct}%)</span>
                          </span>
                        ) : (
                          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                        {r.is_custom && (
                          <button onClick={() => handleReset(r.service_id)} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <RefreshCw size={11} /> Reset
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handleSave} className="btn btn-primary" disabled={saving || loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, padding: '0.75rem 2rem' }}>
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save All Prices'}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
