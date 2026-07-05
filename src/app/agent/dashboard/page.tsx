'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import ProviderIcon from '@/components/ProviderIcon';
import { 
  ShoppingCart, Award, TrendingUp, TrendingDown, Users, Trash2, 
  UploadCloud, ChevronDown 
} from 'lucide-react';

interface ManualRow {
  network: string;
  phone: string;
  type: string;
  plan: string;
  amount: string;
}

export default function AgentDashboard() {
  const [manualRows, setManualRows] = useState<ManualRow[]>([
    { network: 'MTN', phone: '0803 123 4567', type: 'Data', plan: '10GB', amount: 'GH₵4,500' },
    { network: 'Airtel', phone: '0701 234 5678', type: 'Airtime', plan: 'GH₵1,000', amount: 'GH₵1,000' },
    { network: 'Glo', phone: '0806 345 6789', type: 'Data', plan: '5GB', amount: 'GH₵2,200' },
  ]);

  const removeRow = (index: number) => {
    setManualRows(manualRows.filter((_, i) => i !== index));
  };

  const addRow = () => {
    setManualRows([...manualRows, { network: 'MTN', phone: '', type: 'Data', plan: '5GB', amount: 'GH₵2,200' }]);
  };

  const handleNetworkChange = (index: number, val: string) => {
    const updated = [...manualRows];
    updated[index].network = val;
    setManualRows(updated);
  };

  const recentSales = [
    { id: '1234567890', customer: '0803 123 4567', service: 'MTN 10GB', amount: 'GH₵4,500.00', status: 'success', date: 'May 20, 2024 10:45 AM' },
    { id: '1234567889', customer: '0701 234 5678', service: 'Airtime GH₵1,000', amount: 'GH₵1,000.00', status: 'success', date: 'May 20, 2024 10:42 AM' },
    { id: '1234567888', customer: '0806 345 6789', service: 'Glo 5GB', amount: 'GH₵2,200.00', status: 'processing', date: 'May 19, 2024 09:15 PM' },
    { id: '1234567887', customer: '0908 765 4321', service: 'Dstv Compact', amount: 'GH₵7,200.00', status: 'success', date: 'May 19, 2024 08:11 PM' },
    { id: '1234567886', customer: '0812 345 6789', service: 'Airtime GH₵500', amount: 'GH₵500.00', status: 'reversed', date: 'May 18, 2024 07:30 PM' },
  ];

  const pricingTiers = [
    { service: 'MTN 10GB', retail: 'GH₵4,500', agent: 'GH₵4,050', margin: 'GH₵450' },
    { service: 'Airtime GH₵1,000', retail: 'GH₵1,000', agent: 'GH₵950', margin: 'GH₵50' },
    { service: 'Glo 5GB', retail: 'GH₵2,500', agent: 'GH₵2,200', margin: 'GH₵300' },
    { service: 'Dstv Compact', retail: 'GH₵7,900', agent: 'GH₵7,200', margin: 'GH₵700' },
  ];

  const commissionHistory = [
    { date: 'May 20, 2024', orderId: '1234567890', customer: '0803 123 4567', service: 'MTN 10GB', commission: 'GH₵450.00' },
    { date: 'May 20, 2024', orderId: '1234567889', customer: '0701 234 5678', service: 'Airtime GH₵1,000', commission: 'GH₵50.00' },
    { date: 'May 19, 2024', orderId: '1234567888', customer: '0806 345 6789', service: 'Glo 5GB', commission: 'GH₵300.00' },
    { date: 'May 19, 2024', orderId: '1234567887', customer: '0908 765 4321', service: 'Dstv Compact', commission: 'GH₵700.00' },
    { date: 'May 18, 2024', orderId: '1234567886', customer: '0812 345 6789', service: 'Airtime GH₵500', commission: 'GH₵25.00' },
  ];

  const referrals = [
    { name: 'John Okafor', phone: '0803 123 4567', type: 'Sub-agent', orders: 56, status: 'active', joined: 'May 10, 2024' },
    { name: 'Alice Johnson', phone: '0701 234 5678', type: 'Customer', orders: 23, status: 'active', joined: 'May 12, 2024' },
    { name: 'David Amadi', phone: '0806 345 6789', type: 'Sub-agent', orders: 41, status: 'active', joined: 'May 15, 2024' },
    { name: 'Sarah Ibrahim', phone: '0908 765 4321', type: 'Customer', orders: 12, status: 'new', joined: 'May 19, 2024' },
    { name: 'Mike Okechukwu', phone: '0812 345 6789', type: 'Customer', orders: 8, status: 'new', joined: 'May 20, 2024' },
  ];

  const chartData = [
    { label: 'May 14', value: '150px', amount: 'GH₵150K' },
    { label: 'May 15', value: '190px', amount: 'GH₵200K' },
    { label: 'May 16', value: '240px', amount: 'GH₵270K' },
    { label: 'May 17', value: '140px', amount: 'GH₵135K' },
    { label: 'May 18', value: '180px', amount: 'GH₵180K' },
    { label: 'May 19', value: '175px', amount: 'GH₵175K' },
    { label: 'May 20', value: '130px', amount: 'GH₵120K' },
  ];

  return (
    <AppLayout userName="Kwame Mensah" userRole="agent">
      <div className="animate-fade-up">
        {/* Top 4 Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          
          {/* Card 1: Sales this month */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', gap: '1rem', background: 'var(--color-bg-card)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(0,102,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-brand-primary)', flexShrink: 0 }}>
              <ShoppingCart size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Sales this month
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: '0.15rem 0', fontFamily: 'monospace' }}>
                GH₵1,245,680.00
              </div>
              <div style={{ fontSize: '0.72rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                <TrendingUp size={12} /> 18.6% vs last month
              </div>
            </div>
          </div>

          {/* Card 2: Commission earned */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', gap: '1rem', background: 'var(--color-bg-card)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6', flexShrink: 0 }}>
              <Award size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Commission earned
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: '0.15rem 0', fontFamily: 'monospace' }}>
                GH₵124,568.00
              </div>
              <div style={{ fontSize: '0.72rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                <TrendingUp size={12} /> 16.3% vs last month
              </div>
            </div>
          </div>

          {/* Card 3: Orders processed */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', gap: '1rem', background: 'var(--color-bg-card)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(20,184,166,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#14B8A6', flexShrink: 0 }}>
              <TrendingUp size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Orders processed
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: '0.15rem 0', fontFamily: 'monospace' }}>
                482
              </div>
              <div style={{ fontSize: '0.72rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                <TrendingUp size={12} /> 24.7% vs last month
              </div>
            </div>
          </div>

          {/* Card 4: Active referrals */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', gap: '1rem', background: 'var(--color-bg-card)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366F1', flexShrink: 0 }}>
              <Users size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Active referrals
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: '0.15rem 0', fontFamily: 'monospace' }}>
                32
              </div>
              <div style={{ fontSize: '0.72rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                <TrendingUp size={12} /> 10 this month
              </div>
            </div>
          </div>

        </div>

        {/* Main Columns Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* Left Column (Sales overview, Bulk purchase, Recent sales) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Sales overview (7 days) */}
            <div className="card" style={{ background: 'var(--color-bg-card)' }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Sales overview (7 days)</h3>
                  <div style={{ position: 'relative' }}>
                    <select className="form-input" style={{ appearance: 'none', padding: '0.45rem 2rem 0.45rem 0.875rem', borderRadius: '6px', fontSize: '0.75rem', width: 'auto', border: '1px solid var(--color-border)', background: 'var(--color-bg-elevated)' }}>
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                    </select>
                    <ChevronDown size={12} style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-muted)' }} />
                  </div>
                </div>

                {/* CSS Bar Chart */}
                <div style={{ display: 'flex', gap: '1.5rem', height: '280px', alignItems: 'flex-end', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border-subtle)', position: 'relative' }}>
                  {/* Grid Y-axis indicators */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '240px', position: 'absolute', left: 0, right: 0, pointerEvents: 'none', zIndex: 1 }}>
                    <div style={{ borderBottom: '1.5px dashed rgba(255,255,255,0.03)', height: 0, position: 'relative' }}><span style={{ position: 'absolute', top: '-8px', left: 0, fontSize: '0.65rem', color: 'var(--color-text-muted)', background: 'var(--color-bg-card)', paddingRight: '4px' }}>GH₵300K</span></div>
                    <div style={{ borderBottom: '1.5px dashed rgba(255,255,255,0.03)', height: 0, position: 'relative' }}><span style={{ position: 'absolute', top: '-8px', left: 0, fontSize: '0.65rem', color: 'var(--color-text-muted)', background: 'var(--color-bg-card)', paddingRight: '4px' }}>GH₵200K</span></div>
                    <div style={{ borderBottom: '1.5px dashed rgba(255,255,255,0.03)', height: 0, position: 'relative' }}><span style={{ position: 'absolute', top: '-8px', left: 0, fontSize: '0.65rem', color: 'var(--color-text-muted)', background: 'var(--color-bg-card)', paddingRight: '4px' }}>GH₵100K</span></div>
                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', height: 0, position: 'relative' }}><span style={{ position: 'absolute', top: '-8px', left: 0, fontSize: '0.65rem', color: 'var(--color-text-muted)', background: 'var(--color-bg-card)', paddingRight: '4px' }}>N0</span></div>
                  </div>

                  {/* Chart Columns */}
                  <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', height: '240px', alignItems: 'flex-end', zIndex: 2, paddingLeft: '4.5rem' }}>
                    {chartData.map((d, idx) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '40px' }}>
                        <div style={{ width: '28px', height: d.value, background: 'linear-gradient(to top, var(--color-brand-primary), #3B82F6)', borderRadius: '4px 4px 0 0', position: 'relative' }} className="chart-bar" title={d.amount}></div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{d.label.split(' ')[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Bulk purchase */}
            <div className="card" style={{ background: 'var(--color-bg-card)' }}>
              <div className="card-body">
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem' }}>Bulk purchase</h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '1.5rem', alignItems: 'stretch' }}>
                  
                  {/* Left: CSV Upload Card */}
                  <div style={{ borderRight: '1px solid var(--color-border)', paddingRight: '1.5rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>Upload CSV (bulk)</div>
                    <div style={{
                      border: '1.5px dashed var(--color-border-strong)',
                      borderRadius: 'var(--radius-lg)',
                      background: 'rgba(0,102,255,0.02)',
                      padding: '1.75rem 1rem',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      textAlign: 'center', gap: '0.75rem', height: '180px'
                    }}>
                      <UploadCloud size={28} style={{ color: 'var(--color-brand-primary)' }} />
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                        Drag and drop your CSV file here<br/>or
                      </div>
                      <button className="btn btn-secondary btn-sm" style={{ border: '1px solid var(--color-border-strong)', padding: '0.4rem 0.875rem' }}>
                        Choose file
                      </button>
                    </div>
                    <div style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', lineHeight: '1.3' }}>
                      CSV format: network, phone, type, plan, amount
                    </div>
                  </div>

                  {/* Right: Manual order builder */}
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>Manual order builder</div>
                    
                    <div style={{ maxHeight: '180px', overflowY: 'auto', marginBottom: '0.75rem' }}>
                      <table style={{ width: '100%', fontSize: '0.78rem', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                            <th style={{ paddingBottom: '0.45rem', fontWeight: 600 }}>Network</th>
                            <th style={{ paddingBottom: '0.45rem', paddingLeft: '0.35rem', fontWeight: 600 }}>Phone number</th>
                            <th style={{ paddingBottom: '0.45rem', paddingLeft: '0.35rem', fontWeight: 600 }}>Type</th>
                            <th style={{ paddingBottom: '0.45rem', paddingLeft: '0.35rem', fontWeight: 600 }}>Plan / Amount</th>
                            <th style={{ paddingBottom: '0.45rem', paddingLeft: '0.35rem', fontWeight: 600 }}>Amount</th>
                            <th style={{ paddingBottom: '0.45rem', fontWeight: 600 }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {manualRows.map((row, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                              <td style={{ padding: '0.45rem 0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <ProviderIcon provider={row.network} size={14} />
                                  <select 
                                    className="form-input" 
                                    defaultValue={row.network} 
                                    onChange={(e) => handleNetworkChange(idx, e.target.value)}
                                    style={{ padding: '0.25rem 1.5rem 0.25rem 0.5rem', fontSize: '0.72rem', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', width: 'auto' }}
                                  >
                                    <option value="MTN">MTN</option>
                                    <option value="Airtel">Airtel</option>
                                    <option value="Glo">Glo</option>
                                  </select>
                                </div>
                              </td>
                              <td style={{ padding: '0.45rem 0.35rem' }}>
                                <input type="tel" className="form-input" defaultValue={row.phone} style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', fontFamily: 'monospace' }} />
                              </td>
                              <td style={{ padding: '0.45rem 0.35rem' }}>
                                <select className="form-input" defaultValue={row.type} style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
                                  <option>Data</option>
                                  <option>Airtime</option>
                                </select>
                              </td>
                              <td style={{ padding: '0.45rem 0.35rem' }}>
                                <select className="form-input" defaultValue={row.plan} style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
                                  <option>10GB</option>
                                  <option>5GB</option>
                                  <option>GH₵1,000</option>
                                  <option>GH₵2,200</option>
                                </select>
                              </td>
                              <td style={{ padding: '0.45rem 0.35rem', fontWeight: 700, fontFamily: 'monospace' }}>{row.amount}</td>
                              <td style={{ padding: '0.45rem 0', textAlign: 'right' }}>
                                <button onClick={() => removeRow(idx)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', padding: '0.2rem' }}>
                                  <Trash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                      <button onClick={addRow} style={{ background: 'none', border: 'none', color: 'var(--color-brand-primary)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: 0 }}>
                        + Add another row
                      </button>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Total items: <strong style={{ color: '#fff' }}>{manualRows.length}</strong></span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Total amount: <strong style={{ color: '#fff', fontFamily: 'monospace' }}>GH₵7,700.00</strong></span>
                        <button className="btn btn-primary btn-sm" style={{ padding: '0.45rem 1rem', borderRadius: '6px', fontSize: '0.75rem' }}>
                          Review & purchase
                        </button>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            </div>

            {/* Recent sales */}
            <div className="card" style={{ background: 'var(--color-bg-card)' }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Recent sales</h3>
                  <Link href="/agent/sales" style={{ fontSize: '0.78rem', color: 'var(--color-brand-primary)', textDecoration: 'none', fontWeight: 600 }}>
                    View all
                  </Link>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                        <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>Order ID</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Customer</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Service</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Amount</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Status</th>
                        <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSales.map((sale, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                          <td style={{ padding: '0.875rem 0', fontWeight: 600, color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>{sale.id}</td>
                          <td style={{ padding: '0.875rem 0.5rem', fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>{sale.customer}</td>
                          <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <ProviderIcon provider={sale.service} size={16} />
                              <span>{sale.service}</span>
                            </div>
                          </td>
                          <td style={{ padding: '0.875rem 0.5rem', fontWeight: 700, fontFamily: 'monospace', color: '#fff' }}>{sale.amount}</td>
                          <td style={{ padding: '0.875rem 0.5rem' }}>
                            <span className={`badge ${
                              sale.status === 'success' ? 'badge-success' : 
                              sale.status === 'processing' ? 'badge-info' : 'badge-secondary'
                            }`} style={{ textTransform: 'capitalize', fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                              {sale.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.875rem 0', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{sale.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column (Pricing tier, Commission history, My referrals) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Pricing tier */}
            <div className="card" style={{ background: 'var(--color-bg-card)' }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Pricing tier</h3>
                  <span className="badge badge-blue" style={{ fontSize: '0.7rem', padding: '0.15rem 0.55rem' }}>Agent</span>
                </div>

                <div style={{ overflowX: 'auto', marginBottom: '1.25rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                        <th style={{ padding: '0.5rem 0', fontWeight: 600 }}>Service</th>
                        <th style={{ padding: '0.5rem 0.35rem', fontWeight: 600 }}>Retail Price</th>
                        <th style={{ padding: '0.5rem 0.35rem', fontWeight: 600 }}>Agent Price</th>
                        <th style={{ padding: '0.5rem 0', fontWeight: 600, textAlign: 'right' }}>Your Margin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pricingTiers.map((p, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                          <td style={{ padding: '0.625rem 0', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <ProviderIcon provider={p.service} size={16} />
                              <span>{p.service}</span>
                            </div>
                          </td>
                          <td style={{ padding: '0.625rem 0.35rem', fontFamily: 'monospace' }}>{p.retail}</td>
                          <td style={{ padding: '0.625rem 0.35rem', fontFamily: 'monospace', fontWeight: 600, color: '#fff' }}>{p.agent}</td>
                          <td style={{ padding: '0.625rem 0', fontWeight: 700, color: '#34D399', textAlign: 'right', fontFamily: 'monospace' }}>{p.margin}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Progress to Super Agent */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.45rem' }}>
                    <span>Progress to Super Agent</span>
                    <span style={{ color: 'var(--color-brand-primary)' }}>60%</span>
                  </div>
                  {/* Progress Bar background */}
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden', marginBottom: '0.625rem' }}>
                    <div style={{ width: '60%', height: '100%', background: 'linear-gradient(90deg, var(--color-brand-primary) 0%, #3B82F6 100%)', borderRadius: '99px' }}></div>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', lineHeight: '1.3' }}>
                    <strong style={{ color: '#fff' }}>GH₵374,320.00</strong> more in sales to unlock Super Agent benefits
                  </div>
                </div>

              </div>
            </div>

            {/* Commission history */}
            <div className="card" style={{ background: 'var(--color-bg-card)' }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Commission history</h3>
                  <Link href="/agent/commissions" style={{ fontSize: '0.78rem', color: 'var(--color-brand-primary)', textDecoration: 'none', fontWeight: 600 }}>
                    View all
                  </Link>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                        <th style={{ padding: '0.5rem 0', fontWeight: 600 }}>Date</th>
                        <th style={{ padding: '0.5rem 0.35rem', fontWeight: 600 }}>Order ID</th>
                        <th style={{ padding: '0.5rem 0.35rem', fontWeight: 600 }}>Customer</th>
                        <th style={{ padding: '0.5rem 0.35rem', fontWeight: 600 }}>Service</th>
                        <th style={{ padding: '0.5rem 0', fontWeight: 600, textAlign: 'right' }}>Commission</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commissionHistory.map((c, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                          <td style={{ padding: '0.625rem 0', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{c.date.split(',')[0]}</td>
                          <td style={{ padding: '0.625rem 0.35rem', fontFamily: 'monospace' }}>{c.orderId}</td>
                          <td style={{ padding: '0.625rem 0.35rem', fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>{c.customer.split(' ')[0]}</td>
                          <td style={{ padding: '0.625rem 0.35rem', fontWeight: 600 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <ProviderIcon provider={c.service} size={16} />
                              <span>{c.service}</span>
                            </div>
                          </td>
                          <td style={{ padding: '0.625rem 0', fontWeight: 700, color: '#34D399', textAlign: 'right', fontFamily: 'monospace' }}>{c.commission}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>

            {/* My referrals */}
            <div className="card" style={{ background: 'var(--color-bg-card)' }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>My referrals</h3>
                  <Link href="/agent/referrals" style={{ fontSize: '0.78rem', color: 'var(--color-brand-primary)', textDecoration: 'none', fontWeight: 600 }}>
                    View all
                  </Link>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                        <th style={{ padding: '0.5rem 0', fontWeight: 600 }}>Name</th>
                        <th style={{ padding: '0.5rem 0.35rem', fontWeight: 600 }}>Phone</th>
                        <th style={{ padding: '0.5rem 0.35rem', fontWeight: 600 }}>Type</th>
                        <th style={{ padding: '0.5rem 0.35rem', fontWeight: 600 }}>Orders</th>
                        <th style={{ padding: '0.5rem 0.35rem', fontWeight: 600 }}>Status</th>
                        <th style={{ padding: '0.5rem 0', fontWeight: 600, textAlign: 'right' }}>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referrals.map((r, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                          <td style={{ padding: '0.625rem 0', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{r.name}</td>
                          <td style={{ padding: '0.625rem 0.35rem', fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>{r.phone}</td>
                          <td style={{ padding: '0.625rem 0.35rem', color: 'var(--color-text-secondary)' }}>{r.type}</td>
                          <td style={{ padding: '0.625rem 0.35rem', fontWeight: 600, textAlign: 'center' }}>{r.orders}</td>
                          <td style={{ padding: '0.625rem 0.35rem' }}>
                            <span className={`badge ${
                              r.status === 'active' ? 'badge-success' : 'badge-info'
                            }`} style={{ textTransform: 'capitalize', fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                              {r.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.625rem 0', color: 'var(--color-text-muted)', fontSize: '0.72rem', textAlign: 'right' }}>{r.joined.split(',')[0]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>

          </div>
          
        </div>
      </div>
    </AppLayout>
  );
}
