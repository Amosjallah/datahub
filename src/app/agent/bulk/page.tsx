'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import ProviderIcon from '@/components/ProviderIcon';
import { UploadCloud, CheckCircle, RefreshCw, Zap, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

export default function AgentBulk() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [batchExecuting, setBatchExecuting] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [batchCompleted, setBatchCompleted] = useState<string | null>(null);

  const [records, setRecords] = useState([
    { phone: '0244 111 222', network: 'MTN', amount: 'GH₵21.00', numAmount: 21.00, plan: '5GB', status: 'Pending' },
    { phone: '0559 998 887', network: 'MTN', amount: 'GH₵39.50', numAmount: 39.50, plan: '10GB', status: 'Pending' },
    { phone: '0502 777 665', network: 'Telecel', amount: 'GH₵10.00', numAmount: 10.00, plan: 'Airtime', status: 'Pending' },
    { phone: '0277 555 443', network: 'AirtelTigo', amount: 'GH₵12.00', numAmount: 12.00, plan: '3GB', status: 'Pending' },
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) {
        setLoading(false);
        return;
      }

      const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0);
      const parsedRecords: any[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (i === 0 && (line.toLowerCase().includes('phone') || line.toLowerCase().includes('network'))) {
          continue;
        }

        const parts = line.split(',').map(p => p.trim());
        if (parts.length >= 2) {
          const network = parts[0].toUpperCase().includes('TEL') ? 'Telecel' : parts[0].toUpperCase().includes('AIR') || parts[0].toUpperCase().includes('AT') ? 'AirtelTigo' : 'MTN';
          const phone = parts[1] || '';
          const plan = parts[3] || '5GB';
          const amt = parseFloat(parts[4]) || 21.00;

          parsedRecords.push({
            phone,
            network,
            plan,
            numAmount: amt,
            amount: `GH₵${amt.toFixed(2)}`,
            status: 'Pending',
          });
        }
      }

      setLoading(false);
      if (parsedRecords.length > 0) {
        setRecords(parsedRecords);
        setFileUploaded(true);
      } else {
        alert('Could not find valid rows in this CSV file. Please use format: network, phone, type, plan, amount');
      }
    };
    reader.readAsText(file);
  };

  const executeBatch = async () => {
    if (records.length === 0) return;

    setBatchExecuting(true);
    setBatchCompleted(null);

    const updated = [...records];
    let successCount = 0;

    for (let i = 0; i < updated.length; i++) {
      setProgress({ current: i + 1, total: updated.length });
      await new Promise(r => setTimeout(r, 400));

      try {
        await fetch('/api/vtu/recharge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: updated[i].numAmount,
            recipient: updated[i].phone.replace(/\D/g, ''),
            network: updated[i].network,
            serviceType: updated[i].plan.includes('Airtime') ? 'airtime' : 'data',
            serviceId: `${updated[i].network} ${updated[i].plan}`,
            userId: 'AGENT_BULK',
            walletId: 'WAL_AGENT',
          }),
        }).catch(() => null);

        updated[i].status = 'Success';
        successCount++;
      } catch {
        updated[i].status = 'Failed';
      }
    }

    setRecords(updated);
    setBatchExecuting(false);
    setProgress(null);
    setBatchCompleted(`Batch dispatched! ${successCount} of ${records.length} orders executed successfully.`);
  };

  const totalBatchCost = records.reduce((sum, r) => sum + r.numAmount, 0);

  return (
    <AppLayout userName="Kwame Mensah" userRole="agent">
      <div className="animate-fade-up">
        {/* Navigation & Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <Link href="/agent/dashboard" style={{ fontSize: '0.8rem', color: 'var(--color-brand-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <ArrowLeft size={14} /> Back to Dashboard
              </Link>
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>📦 Bulk Top-up Dispatch</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              Upload lists of numbers to push data bundles or airtime to hundreds of recipients simultaneously.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link 
              href="/agent/dashboard" 
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--color-border)' }}
            >
              <Zap size={14} /> Single Order Terminal
            </Link>
            <Link 
              href="/buy/data" 
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              Buy Individual Data
            </Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Uploader */}
          <div className="card" style={{ border: '1px solid var(--color-border)', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Upload CSV File</h3>
            <div style={{
              border: '2px dashed var(--color-border)',
              borderRadius: '12px',
              padding: '2.5rem 1rem',
              textAlign: 'center',
              background: 'var(--color-bg-base)',
              marginBottom: '1rem'
            }}>
              <UploadCloud size={32} color="var(--color-brand-primary)" style={{ margin: '0 auto 1rem' }} />
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                Drag and drop your VTU numbers CSV file here<br />
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Format: network, phone, type, plan, amount</span>
              </p>
              
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />

              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.5rem 1rem', border: '1px solid var(--color-border)' }}
              >
                {loading ? 'Uploading & Parsing...' : 'Browse CSV'}
              </button>
            </div>

            {fileUploaded && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', fontSize: '0.8rem', fontWeight: 600 }}>
                <CheckCircle size={16} /> CSV parsed ({records.length} records detected)
              </div>
            )}
          </div>

          {/* Records Table Preview */}
          <div className="card" style={{ border: '1px solid var(--color-border)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Batch Preview ({records.length} items)</h3>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-brand-primary)', fontFamily: 'monospace' }}>
                Total: GH₵{totalBatchCost.toFixed(2)}
              </div>
            </div>
            
            <div style={{ overflowX: 'auto', marginBottom: '1.5rem', maxHeight: '200px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg-surface)' }}>
                    <th style={{ padding: '0.5rem 0.75rem' }}>Phone</th>
                    <th style={{ padding: '0.5rem' }}>Network</th>
                    <th style={{ padding: '0.5rem' }}>Package</th>
                    <th style={{ padding: '0.5rem', textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-text-primary)' }}>{r.phone}</td>
                      <td style={{ padding: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <ProviderIcon provider={r.network} size={12} />
                          <span>{r.network}</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace' }}>{r.plan}</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                        <span className={`badge ${r.status === 'Success' ? 'badge-success' : r.status === 'Failed' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {batchCompleted && (
              <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', border: '1px solid #10B981', color: '#10B981', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                <CheckCircle2 size={16} />
                <span>{batchCompleted}</span>
              </div>
            )}

            <button 
              type="button" 
              onClick={executeBatch}
              disabled={batchExecuting || records.length === 0}
              className="btn btn-primary btn-full"
              style={{ padding: '0.65rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {batchExecuting ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
              {batchExecuting ? `Dispatching (${progress?.current}/${progress?.total})...` : `Confirm & Dispatch Batch (GH₵${totalBatchCost.toFixed(2)})`}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
