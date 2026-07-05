'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';

interface Beneficiary {
  id: string;
  name: string;
  phone: string;
  network: string;
}

export default function BeneficiariesIndex() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [network, setNetwork] = useState('MTN');

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    { id: '1', name: 'Mum', phone: '0244111222', network: 'MTN' },
    { id: '2', name: 'Dad', phone: '0205333444', network: 'Telecel' },
  ]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    const newBen = { id: Date.now().toString(), name, phone, network };
    setBeneficiaries([...beneficiaries, newBen]);
    setName('');
    setPhone('');
    setShowAddForm(false);
  };

  return (
    <AppLayout userName="Kwame Mensah" userRole="customer">
      <div className="animate-fade-up">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.2rem' }}>👥 Saved Beneficiaries</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Save frequently used numbers for fast recharges.</p>
          </div>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setShowAddForm(true)}>
            + Add Beneficiary
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="card animate-fade-up" style={{ maxWidth: '480px', marginBottom: '1.5rem' }}>
            <div className="card-body">
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '1.25rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Add New Beneficiary</h3>
              <form onSubmit={handleAdd}>
                <div className="form-group">
                  <label className="form-label" htmlFor="ben-name">Nickname</label>
                  <input type="text" id="ben-name" className="form-input" placeholder="e.g. Mum, Dad, Office" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="ben-phone">Phone Number</label>
                    <input type="tel" id="ben-phone" className="form-input" placeholder="0244123456" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="ben-network">Network</label>
                    <select id="ben-network" className="form-select" value={network} onChange={(e) => setNetwork(e.target.value)}>
                      <option value="MTN">MTN</option>
                      <option value="Telecel">Telecel</option>
                      <option value="AirtelTigo">AirtelTigo</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="submit" className="btn btn-primary btn-sm">Save</button>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Beneficiaries Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.875rem' }}>
          {beneficiaries.map((ben) => (
            <div key={ben.id} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '1rem' }}>
                  {ben.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{ben.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{ben.network}</div>
                </div>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>{ben.phone}</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link href={`/buy/data?phone=${ben.phone}&network=${ben.network}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>Data</Link>
                <Link href={`/buy/airtime?phone=${ben.phone}&network=${ben.network}`} className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>Airtime</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
