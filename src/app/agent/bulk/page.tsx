'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import ProviderIcon from '@/components/ProviderIcon';
import { UploadCloud, CheckCircle, RefreshCw } from 'lucide-react';

export default function AgentBulk() {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([
    { phone: '0244111222', network: 'MTN', amount: 'GH₵20.00', plan: '5GB', status: 'Pending' },
    { phone: '0559998887', network: 'MTN', amount: 'GH₵40.00', plan: '10GB', status: 'Pending' },
    { phone: '0207776665', network: 'Telecel', amount: 'GH₵10.00', plan: 'Airtime', status: 'Pending' },
    { phone: '0265554443', network: 'Airtel', amount: 'GH₵15.00', plan: '3GB', status: 'Pending' },
  ]);

  const handleUpload = () => {
    setLoading(true);
    setTimeout(() => {
      setFileUploaded(true);
      setLoading(false);
    }, 1500);
  };

  const executeBatch = () => {
    setRecords(records.map(r => ({ ...r, status: 'Success' })));
    alert('Bulk VTU batch successfully executed!');
  };

  return (
    <AppLayout userName="Kwame Mensah" userRole="agent">
      <div className="animate-fade-up">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>📦 Bulk Top-up Dispatch</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Upload lists of numbers to push data bundles or airtime to hundreds of recipients simultaneously.</p>
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
                Drag and drop your VTU numbers CSV file here
              </p>
              <button 
                type="button" 
                onClick={handleUpload}
                disabled={loading}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.5rem 1rem', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-primary)' }}
              >
                {loading ? 'Uploading & Parsing...' : 'Browse CSV'}
              </button>
            </div>

            {fileUploaded && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', fontSize: '0.8rem', fontWeight: 600 }}>
                <CheckCircle size={16} /> parsed_numbers_list.csv (4 records detected)
              </div>
            )}
          </div>

          {/* Records Table Preview */}
          <div className="card" style={{ border: '1px solid var(--color-border)', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Batch Preview & Dispatch</h3>
            
            <div style={{ overflowX: 'auto', marginBottom: '1.5rem', maxHeight: '180px' }}>
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
                        <span className={`badge ${r.status === 'Success' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button 
              type="button" 
              onClick={executeBatch}
              className="btn btn-primary btn-full"
              style={{ padding: '0.65rem 1rem', borderRadius: '8px' }}
            >
              Confirm & Dispatch Batch
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
