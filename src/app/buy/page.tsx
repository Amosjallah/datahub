'use client';

import React, { useState } from 'react';
import PublicLayout from '@/components/PublicLayout';
import { Loader2, Database, PhoneCall, Receipt, Tv, CheckCircle2 } from 'lucide-react';

interface Package {
  id: string;
  network: 'YELLO' | 'TELECEL' | 'AT_PREMIUM';
  capacity: string;
  price: number;
  displayName: string;
  inStock: boolean;
}

const initialPackages: Package[] = [
  // MTN (Yello)
  { id: 'yello-1', network: 'YELLO', capacity: '1 GB', price: 4.20, displayName: 'MTN 1GB (Non-Expiry)', inStock: true },
  { id: 'yello-2', network: 'YELLO', capacity: '2 GB', price: 9.00, displayName: 'MTN 2GB (Non-Expiry)', inStock: true },
  { id: 'yello-3', network: 'YELLO', capacity: '3 GB', price: 13.50, displayName: 'MTN 3GB (Non-Expiry)', inStock: true },
  { id: 'yello-4', network: 'YELLO', capacity: '4 GB', price: 19.00, displayName: 'MTN 4GB (Non-Expiry)', inStock: true },
  { id: 'yello-5', network: 'YELLO', capacity: '5 GB', price: 23.00, displayName: 'MTN 5GB (Non-Expiry)', inStock: true },
  { id: 'yello-6', network: 'YELLO', capacity: '6 GB', price: 27.00, displayName: 'MTN 6GB (Non-Expiry)', inStock: true },
  { id: 'yello-8', network: 'YELLO', capacity: '8 GB', price: 36.00, displayName: 'MTN 8GB (Non-Expiry)', inStock: true },
  { id: 'yello-10', network: 'YELLO', capacity: '10 GB', price: 43.00, displayName: 'MTN 10GB (Non-Expiry)', inStock: true },
  { id: 'yello-15', network: 'YELLO', capacity: '15 GB', price: 62.00, displayName: 'MTN 15GB (Non-Expiry)', inStock: true },
  { id: 'yello-20', network: 'YELLO', capacity: '20 GB', price: 82.00, displayName: 'MTN 20GB (Non-Expiry)', inStock: true },
  
  // Telecel
  { id: 'tel-10', network: 'TELECEL', capacity: '10 GB', price: 38.50, displayName: 'Telecel 10GB (Non-Expiry)', inStock: true },
  
  // AirtelTigo (AT_PREMIUM)
  { id: 'at-1', network: 'AT_PREMIUM', capacity: '1 GB', price: 4.00, displayName: 'AT 1GB (Non-Expiry)', inStock: true },
  { id: 'at-2', network: 'AT_PREMIUM', capacity: '2 GB', price: 9.00, displayName: 'AT 2GB (Non-Expiry)', inStock: true },
];

export default function Buy() {
  const [activeService, setActiveService] = useState<'data' | 'airtime' | 'bills' | 'tv'>('data');
  const [activeNetwork, setActiveNetwork] = useState<'YELLO' | 'TELECEL' | 'AT_PREMIUM'>('YELLO');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  // Forms state
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [billProvider, setBillProvider] = useState('ECG Prepaid');
  const [tvProvider, setTvProvider] = useState('DSTV');
  const [tvPlan, setTvPlan] = useState('DSTV Compact (GH₵ 220)');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const resetStatus = () => {
    setSuccess(false);
    setMessage('');
    setLoading(false);
  };

  const handleDataSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setMessage(`Payment request of GH₵ ${selectedPackage.price.toFixed(2)} sent to ${phone}. Please authorize from your wallet prompts.`);
    }, 1500);
  };

  const handleAirtimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setMessage(`Airtime order of GH₵ ${parseFloat(amount).toFixed(2)} sent to ${phone} successfully! Check your phone for payment verification.`);
    }, 1500);
  };

  const handleBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setMessage(`Utility transaction initiated! GH₵ ${parseFloat(amount).toFixed(2)} for ${billProvider} meter ${accountNumber} has been queued.`);
    }, 1500);
  };

  const handleTvSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setMessage(`TV Subscription request submitted! ${tvProvider} Smartcard ${accountNumber} renewed under tier ${tvPlan}.`);
    }, 1500);
  };

  const filteredPackages = initialPackages.filter(p => p.network === activeNetwork);

  return (
    <PublicLayout>
      <section style={{ padding: '4rem 0 5rem', background: '#030712', minHeight: '85vh' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
              GUEST TRANSACTION PORTAL
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
              Select a service below to purchase data, reload airtime, subscribe to TV plans, or pay utilities instantly.
            </p>
          </div>

          {/* Service Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', backgroundColor: '#0F172A', padding: '0.35rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '3rem' }}>
            {[
              { id: 'data', label: 'Buy Data', icon: Database },
              { id: 'airtime', label: 'Buy Airtime', icon: PhoneCall },
              { id: 'bills', label: 'Pay Bills', icon: Receipt },
              { id: 'tv', label: 'TV Setup', icon: Tv }
            ].map((srv) => {
              const isActive = activeService === srv.id;
              const Icon = srv.icon;
              return (
                <button
                  key={srv.id}
                  onClick={() => { setActiveService(srv.id as any); resetStatus(); setSelectedPackage(null); }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.75rem 0.5rem',
                    border: 'none',
                    borderRadius: '12px',
                    backgroundColor: isActive ? '#3B82F6' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#9CA3AF',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <Icon size={18} />
                  <span>{srv.label}</span>
                </button>
              );
            })}
          </div>

          {/* Success screen shared by all forms */}
          {success ? (
            <div style={{ padding: '3rem 2rem', backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1.5px solid rgba(16, 185, 129, 0.15)', borderRadius: '24px', textAlign: 'center', maxWidth: '600px', margin: '0 auto', animation: 'fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', marginBottom: '1.5rem' }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem' }}>Transaction Submitted!</h3>
              <p style={{ color: '#9CA3AF', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                {message}
              </p>
              <button
                onClick={resetStatus}
                className="btn btn-primary"
                style={{ padding: '0.75rem 2.5rem', color: '#030712' }}
              >
                Perform another purchase
              </button>
            </div>
          ) : (
            <>
              {/* SERVICE 1: DATA BUNDLES */}
              {activeService === 'data' && (
                <div>
                  {/* Network selection tabs */}
                  <div style={{ display: 'flex', padding: '0.25rem', backgroundColor: '#0F172A', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '2rem', maxWidth: '480px', margin: '0 auto 2.5rem' }}>
                    {[
                      { key: 'YELLO', label: 'MTN (Yello)', color: '#FACC15' },
                      { key: 'TELECEL', label: 'Telecel', color: '#EF4444' },
                      { key: 'AT_PREMIUM', label: 'AirtelTigo', color: '#3B82F6' }
                    ].map((net) => {
                      const isActive = activeNetwork === net.key;
                      return (
                        <button
                          key={net.key}
                          onClick={() => { setActiveNetwork(net.key as any); setSelectedPackage(null); }}
                          style={{
                            flex: 1,
                            padding: '0.65rem',
                            border: 'none',
                            borderRadius: '8px',
                            backgroundColor: isActive ? net.color : 'transparent',
                            color: isActive ? '#030712' : '#9CA3AF',
                            fontWeight: 800,
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            transition: 'all 0.2s'
                          }}
                        >
                          {net.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Bundles cards grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
                    {filteredPackages.map((pkg) => {
                      const isSelected = selectedPackage?.id === pkg.id;
                      return (
                        <div key={pkg.id} style={{ display: 'contents' }}>
                          <div
                            onClick={() => setSelectedPackage(isSelected ? null : pkg)}
                            style={{
                              padding: '1.75rem 1.5rem',
                              backgroundColor: '#0F172A',
                              borderRadius: '20px',
                              border: isSelected ? '2.5px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.05)',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.5rem',
                              transition: 'all 0.25s',
                              transform: isSelected ? 'scale(1.02)' : 'none'
                            }}
                            className="hover-scale"
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>{pkg.capacity}</span>
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#FFFFFF' }}>{pkg.network === 'YELLO' ? 'MTN' : pkg.network === 'TELECEL' ? 'TELECEL' : 'AT'}</span>
                            </div>
                            <span style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>{pkg.displayName}</span>
                            <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                              <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>Price</span>
                              <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#3B82F6' }}>GH₵ {pkg.price.toFixed(2)}</span>
                            </div>
                          </div>

                          {/* Accordion form for checkout */}
                          {isSelected && (
                            <div style={{ gridColumn: '1 / -1', backgroundColor: '#0B0F19', borderRadius: '24px', padding: '2rem', border: '1.5px solid rgba(59, 130, 246, 0.2)', marginTop: '0.5rem', marginBottom: '1.25rem', animation: 'fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
                              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#FFFFFF' }}>Checkout - {pkg.displayName} ({pkg.capacity})</h3>
                              <form onSubmit={handleDataSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div style={{ flex: 1 }}>
                                  <label className="form-label">Full Name</label>
                                  <input type="text" required placeholder="Kwame Mensah" className="form-input" style={{ backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.08)' }} value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <label className="form-label">Recipient Phone Number</label>
                                  <input type="tel" required pattern="^[0][0-9]{9}$" placeholder="e.g. 0244123456" className="form-input" style={{ backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.08)' }} value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                  <button type="button" onClick={() => setSelectedPackage(null)} className="btn btn-secondary" style={{ height: '3rem', padding: '0 2rem' }}>Cancel</button>
                                  <button type="submit" className="btn btn-primary" style={{ height: '3rem', padding: '0 2.5rem', color: '#FFFFFF' }} disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : `Buy for GH₵ ${pkg.price.toFixed(2)}`}
                                  </button>
                                </div>
                              </form>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SERVICE 2: AIRTIME REFILL */}
              {activeService === 'airtime' && (
                <div className="card" style={{ maxWidth: '520px', margin: '0 auto', padding: '2.5rem 2rem', backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem', color: '#FFFFFF' }}>Purchase Airtime</h3>
                  <form onSubmit={handleAirtimeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Carrier Network</label>
                      <select required className="form-input" style={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.08)', color: '#FFFFFF' }}>
                        <option value="MTN">MTN Ghana</option>
                        <option value="Telecel">Telecel Ghana</option>
                        <option value="AirtelTigo">AirtelTigo</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Recipient Phone Number</label>
                      <input type="tel" required pattern="^[0][0-9]{9}$" placeholder="e.g. 0541234567" className="form-input" style={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.08)' }} value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Amount (GH₵)</label>
                      <input type="number" required min="1" max="500" placeholder="e.g. 20" className="form-input" style={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.08)' }} value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ height: '3.25rem', marginTop: '0.5rem', color: '#FFFFFF' }} disabled={loading}>
                      {loading ? <Loader2 className="animate-spin" size={18} /> : 'Process Airtime Topup'}
                    </button>
                  </form>
                </div>
              )}

              {/* SERVICE 3: UTILITY BILLS */}
              {activeService === 'bills' && (
                <div className="card" style={{ maxWidth: '520px', margin: '0 auto', padding: '2.5rem 2rem', backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem', color: '#FFFFFF' }}>Pay Utility Bills</h3>
                  <form onSubmit={handleBillSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Utility Provider</label>
                      <select required className="form-input" style={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.08)', color: '#FFFFFF' }} value={billProvider} onChange={(e) => setBillProvider(e.target.value)}>
                        <option value="ECG Prepaid">ECG Electricity (Prepaid)</option>
                        <option value="ECG Postpaid">ECG Electricity (Postpaid)</option>
                        <option value="GWCL Water">Ghana Water (GWCL)</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Meter or Account Number</label>
                      <input type="text" required placeholder="e.g. 102948571" className="form-input" style={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.08)' }} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Amount (GH₵)</label>
                      <input type="number" required min="5" max="2000" placeholder="e.g. 50" className="form-input" style={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.08)' }} value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Billing Phone Number</label>
                      <input type="tel" required pattern="^[0][0-9]{9}$" placeholder="e.g. 0244123456" className="form-input" style={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.08)' }} value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ height: '3.25rem', marginTop: '0.5rem', color: '#FFFFFF' }} disabled={loading}>
                      {loading ? <Loader2 className="animate-spin" size={18} /> : 'Pay utility bill'}
                    </button>
                  </form>
                </div>
              )}

              {/* SERVICE 4: TV SUBSCRIPTIONS */}
              {activeService === 'tv' && (
                <div className="card" style={{ maxWidth: '520px', margin: '0 auto', padding: '2.5rem 2rem', backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem', color: '#FFFFFF' }}>TV Subscription Renewal</h3>
                  <form onSubmit={handleTvSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">TV Operator</label>
                      <select required className="form-input" style={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.08)', color: '#FFFFFF' }} value={tvProvider} onChange={(e) => { setTvProvider(e.target.value); setTvPlan(e.target.value === 'DSTV' ? 'DSTV Compact (GH₵ 220)' : e.target.value === 'GOTV' ? 'GoTV Max (GH₵ 60)' : 'StarTimes Super (GH₵ 80)'); }}>
                        <option value="DSTV">DSTV Ghana</option>
                        <option value="GOTV">GOTV Ghana</option>
                        <option value="StarTimes">StarTimes</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Select Package Tier</label>
                      <select required className="form-input" style={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.08)', color: '#FFFFFF' }} value={tvPlan} onChange={(e) => setTvPlan(e.target.value)}>
                        {tvProvider === 'DSTV' ? (
                          <>
                            <option value="DSTV Compact (GH₵ 220)">DSTV Compact (GH₵ 220)</option>
                            <option value="DSTV Premium (GH₵ 400)">DSTV Premium (GH₵ 400)</option>
                            <option value="DSTV Family (GH₵ 110)">DSTV Family (GH₵ 110)</option>
                          </>
                        ) : tvProvider === 'GOTV' ? (
                          <>
                            <option value="GoTV Max (GH₵ 60)">GoTV Max (GH₵ 60)</option>
                            <option value="GoTV Jolli (GH₵ 40)">GoTV Jolli (GH₵ 40)</option>
                            <option value="GoTV Jinja (GH₵ 25)">GoTV Jinja (GH₵ 25)</option>
                          </>
                        ) : (
                          <>
                            <option value="StarTimes Super (GH₵ 80)">StarTimes Super (GH₵ 80)</option>
                            <option value="StarTimes Smart (GH₵ 50)">StarTimes Smart (GH₵ 50)</option>
                            <option value="StarTimes Nova (GH₵ 25)">StarTimes Nova (GH₵ 25)</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Smartcard / IUC Number</label>
                      <input type="text" required placeholder="e.g. 1048576921" className="form-input" style={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.08)' }} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Billing Phone Number</label>
                      <input type="tel" required pattern="^[0][0-9]{9}$" placeholder="e.g. 0244123456" className="form-input" style={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.08)' }} value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ height: '3.25rem', marginTop: '0.5rem', color: '#FFFFFF' }} disabled={loading}>
                      {loading ? <Loader2 className="animate-spin" size={18} /> : 'Process TV Subscription'}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}

        </div>
      </section>
    </PublicLayout>
  );
}
