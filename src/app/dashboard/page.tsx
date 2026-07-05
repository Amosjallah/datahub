'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import ProviderIcon from '@/components/ProviderIcon';
import { 
  Wallet, TrendingDown, TrendingUp, FileText, Copy, MoreVertical, 
  Contact, Eye, EyeOff, ChevronDown, History, Users 
} from 'lucide-react';

export default function Dashboard() {
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState<'data' | 'airtime'>('data');
  const [selectedNetwork, setSelectedNetwork] = useState('MTN');
  const [copied, setCopied] = useState(false);

  const referralCode = 'DATASURE9X';

  const copyReferral = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const recentTransactions = [
    { id: 'TRX-2024-0001', type: 'data', provider: 'MTN', detail: 'MTN 10GB', phone: '0803 123 4567', amount: '-GH₵4,500.00', status: 'success', date: 'May 20, 2024 10:45 AM' },
    { id: 'TRX-2024-0002', type: 'airtime', provider: 'MTN', detail: 'Airtime top-up', phone: '0803 123 4567', amount: '-GH₵1,000.00', status: 'processing', date: 'May 20, 2024 10:42 AM' },
    { id: 'TRX-2024-0003', type: 'electricity', provider: 'electricity', detail: 'Ikeja Electric', phone: 'Customer: 0123456789', amount: '-GH₵2,500.00', status: 'success', date: 'May 19, 2024 09:15 PM' },
    { id: 'TRX-2024-0004', type: 'data', provider: 'Airtel', detail: 'Airtel 5GB', phone: '0701 234 5678', amount: '-GH₵2,200.00', status: 'reversed', date: 'May 19, 2024 08:11 PM' },
    { id: 'TRX-2024-0005', type: 'tv', provider: 'GOtv', detail: 'GoTV Max', phone: 'Smartcard: 1234567890', amount: '-GH₵3,600.00', status: 'success', date: 'May 18, 2024 07:30 PM' },
  ];

  const beneficiaries = [
    { name: 'John Oliver', phone: '0803 123 4567', initial: 'JO', color: '#0066FF' },
    { name: 'Alice Johnson', phone: '0701 234 5678', initial: 'AM', color: '#3B82F6' },
    { name: 'David Amadi', phone: '0806 345 6789', initial: 'DA', color: '#1D4ED8' },
  ];

  const notifications = [
    { text: 'Your data purchase was successful.', sub: 'MTN 10GB for 0803 123 4567', time: '10:45 AM', type: 'MTN' },
    { text: 'Airtime purchase is processing.', sub: 'GH₵1,000 airtime for 0803 123 4567', time: '10:42 AM', type: 'MTN' },
    { text: 'You earned a referral bonus!', sub: 'GH₵500 added to your wallet', time: 'Yesterday', type: 'gift' },
    { text: 'Bill payment successful.', sub: 'Ikeja Electric - GH₵2,500', time: 'May 19', type: 'electricity' },
  ];

  return (
    <AppLayout userName="Kwame Kwame" userRole="customer">
      <div className="animate-fade-up">
        {/* Top 4 Stats Cards Grid */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '1.25rem', 
            marginBottom: '2rem' 
          }}
        >
          {/* Card 1: Wallet Balance */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', gap: '1rem', background: 'var(--color-bg-card)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(0,102,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-brand-primary)', fontSize: '1.25rem', flexShrink: 0 }}>
              <Wallet size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                Wallet balance
                <button 
                  onClick={() => setShowBalance(!showBalance)} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', padding: 0 }}
                >
                  {showBalance ? <Eye size={12} /> : <EyeOff size={12} />}
                </button>
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: '0.15rem 0', fontFamily: 'monospace' }}>
                {showBalance ? 'GH₵25,680.50' : '••••••'}
              </div>
              <Link href="/wallet/fund" style={{ fontSize: '0.75rem', color: 'var(--color-brand-primary)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                Fund your wallet &rarr;
              </Link>
            </div>
          </div>

          {/* Card 2: Monthly Spend */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', gap: '1rem', background: 'var(--color-bg-card)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6', fontSize: '1.25rem', flexShrink: 0 }}>
              <FileText size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Monthly spend
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: '0.15rem 0', fontFamily: 'monospace' }}>
                GH₵18,850.00
              </div>
              <div style={{ fontSize: '0.72rem', color: '#F87171', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                <TrendingDown size={12} /> 8.5% vs last month
              </div>
            </div>
          </div>

          {/* Card 3: Transactions */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', gap: '1rem', background: 'var(--color-bg-card)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', fontSize: '1.25rem', flexShrink: 0 }}>
              <History size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Transactions
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: '0.15rem 0', fontFamily: 'monospace' }}>
                32
              </div>
              <div style={{ fontSize: '0.72rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                <TrendingUp size={12} /> 12% vs last month
              </div>
            </div>
          </div>

          {/* Card 4: Referral Earnings */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', gap: '1rem', background: 'var(--color-bg-card)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-brand-primary)', fontSize: '1.25rem', flexShrink: 0 }}>
              <Users size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Referral earnings
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: '0.15rem 0', fontFamily: 'monospace' }}>
                GH₵5,430.00
              </div>
              <div style={{ fontSize: '0.72rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                <TrendingUp size={12} /> 15% vs last month
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Main Content Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* Left Column: Quick Buy & Recent Transactions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Quick Buy Card */}
            <div className="card" style={{ background: 'var(--color-bg-card)' }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Quick buy</h3>
                  {/* Tabs: Data & Airtime */}
                  <div style={{ display: 'flex', gap: '1.25rem' }}>
                    <button 
                      onClick={() => setActiveTab('data')}
                      style={{ 
                        background: 'none', border: 'none', color: activeTab === 'data' ? 'var(--color-brand-primary)' : 'var(--color-text-muted)',
                        fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', paddingBottom: '0.5rem',
                        borderBottom: activeTab === 'data' ? '2.5px solid var(--color-brand-primary)' : 'none',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      Data
                    </button>
                    <button 
                      onClick={() => setActiveTab('airtime')}
                      style={{ 
                        background: 'none', border: 'none', color: activeTab === 'airtime' ? 'var(--color-brand-primary)' : 'var(--color-text-muted)',
                        fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', paddingBottom: '0.5rem',
                        borderBottom: activeTab === 'airtime' ? '2.5px solid var(--color-brand-primary)' : 'none',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      Airtime
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gap: '0.875rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  {/* Network Buttons Selector */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Network</label>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      {['MTN', 'Telecel', 'AirtelTigo'].map((net) => {
                        const isSel = selectedNetwork === net;
                        return (
                          <button 
                            key={net}
                            type="button"
                            onClick={() => setSelectedNetwork(net)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '0.3rem',
                              padding: '0.55rem 0.65rem', borderRadius: '8px',
                              background: isSel ? 'rgba(0,102,255,0.1)' : 'var(--color-bg-elevated)',
                              border: isSel ? '1.5px solid var(--color-brand-primary)' : '1.5px solid var(--color-border)',
                              color: isSel ? 'var(--color-brand-primary)' : 'var(--color-text-muted)',
                              fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                              transition: 'all var(--transition-fast)', flex: 1, justifyContent: 'center'
                            }}
                          >
                            <ProviderIcon provider={net} size={14} />
                            <span style={{ fontSize: '0.7rem' }}>{net === 'AirtelTigo' ? 'AT' : net}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Phone number */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Phone number</label>
                    <div style={{ position: 'relative' }}>
                      <input type="tel" className="form-input" defaultValue="0803 123 4567" style={{ paddingRight: '2.25rem', fontSize: '0.875rem', fontFamily: 'monospace' }} />
                      <Contact size={16} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', cursor: 'pointer' }} />
                    </div>
                  </div>

                  {/* Bundle */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Bundle</label>
                    <div style={{ position: 'relative' }}>
                      <select className="form-input" style={{ appearance: 'none', paddingRight: '2rem', fontSize: '0.875rem' }}>
                        <option>10GB – GH₵4,500</option>
                        <option>20GB – GH₵8,000</option>
                        <option>5GB – GH₵2,500</option>
                      </select>
                      <ChevronDown size={14} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-muted)' }} />
                    </div>
                  </div>
                </div>
                
                <button className="btn btn-primary btn-full" style={{ marginTop: '1.25rem', padding: '0.75rem', borderRadius: '8px' }}>
                  Buy now
                </button>
              </div>
            </div>

            {/* Recent Transactions Card */}
            <div className="card" style={{ background: 'var(--color-bg-card)' }}>
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Recent transactions</h3>
                  <Link href="/transactions" style={{ fontSize: '0.78rem', color: 'var(--color-brand-primary)', textDecoration: 'none', fontWeight: 600 }}>
                    View all
                  </Link>
                </div>

                {/* Desktop view table */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                        <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>Transaction ID</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Type</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Detail</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Amount</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Status</th>
                        <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((tx) => (
                        <tr key={tx.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                          <td style={{ padding: '0.875rem 0', fontWeight: 600, color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>{tx.id}</td>
                          <td style={{ padding: '0.875rem 0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)' }}>
                              <ProviderIcon provider={tx.provider} size={16} />
                              <span style={{ textTransform: 'capitalize' }}>{tx.type}</span>
                            </div>
                          </td>
                          <td style={{ padding: '0.875rem 0.5rem' }}>
                            <div style={{ fontWeight: 600 }}>{tx.detail}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontFamily: 'monospace', marginTop: '0.1rem' }}>{tx.phone}</div>
                          </td>
                          <td style={{ padding: '0.875rem 0.5rem', fontWeight: 700, fontFamily: 'monospace', color: '#fff' }}>{tx.amount}</td>
                          <td style={{ padding: '0.875rem 0.5rem' }}>
                            <span className={`badge ${
                              tx.status === 'success' ? 'badge-success' : 
                              tx.status === 'processing' ? 'badge-info' : 'badge-secondary'
                            }`} style={{ textTransform: 'capitalize', fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                              {tx.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.875rem 0', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{tx.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.25rem' }}>
                  <Link href="/transactions" style={{ fontSize: '0.8rem', color: 'var(--color-brand-primary)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    View all transactions &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Referral, Saved Beneficiaries, Notifications */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Referral Card */}
            <div className="card" style={{ background: 'var(--color-bg-card)' }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Referral</h3>
                  <Link href="/profile" style={{ fontSize: '0.78rem', color: 'var(--color-brand-primary)', textDecoration: 'none', fontWeight: 600 }}>
                    View all
                  </Link>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>Your referral code</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <input 
                    type="text" 
                    value={referralCode} 
                    readOnly 
                    style={{ 
                      flex: 1, background: '#020813', border: '1.5px solid var(--color-border)', 
                      borderRadius: '8px', padding: '0.625rem 0.875rem', color: '#fff', 
                      fontFamily: 'monospace', fontSize: '0.95rem', fontWeight: 600 
                    }} 
                  />
                  <button 
                    onClick={copyReferral} 
                    className="btn btn-secondary" 
                    style={{ padding: '0.625rem 1rem', borderRadius: '8px', fontSize: '0.8rem' }}
                  >
                    {copied ? 'Copied' : <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Copy size={14} /> Copy</span>}
                  </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Friends joined</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: '0.15rem 0' }}>24</div>
                    <div style={{ fontSize: '0.68rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                      <TrendingUp size={10} /> 18 this month
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Earnings</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: '0.15rem 0', fontFamily: 'monospace' }}>GH₵5,430.00</div>
                    <div style={{ fontSize: '0.68rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                      <TrendingUp size={10} /> 15% this month
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Saved Beneficiaries Card */}
            <div className="card" style={{ background: 'var(--color-bg-card)' }}>
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Saved beneficiaries</h3>
                  <Link href="/beneficiaries" style={{ fontSize: '0.78rem', color: 'var(--color-brand-primary)', textDecoration: 'none', fontWeight: 600 }}>
                    View all
                  </Link>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.25rem' }}>
                  {beneficiaries.map((b, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: b.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.78rem', color: '#fff', flexShrink: 0 }}>
                        {b.initial}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontFamily: 'monospace', marginTop: '0.1rem' }}>{b.phone}</div>
                      </div>
                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                        <Link href={`/buy/data?phone=${b.phone}`} className="btn btn-secondary" style={{ padding: '0.3rem 0.65rem', borderRadius: '6px', fontSize: '0.7rem', border: '1px solid #1e293b' }}>
                          📶 Buy
                        </Link>
                        <Link href={`/buy/bills?phone=${b.phone}`} className="btn btn-secondary" style={{ padding: '0.3rem 0.65rem', borderRadius: '6px', fontSize: '0.7rem', border: '1px solid #1e293b' }}>
                          💵 Pay
                        </Link>
                        <button style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '0.2rem' }}>
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                  <Link href="/beneficiaries" style={{ fontSize: '0.8rem', color: 'var(--color-brand-primary)', textDecoration: 'none', fontWeight: 600 }}>
                    Manage beneficiaries &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Notifications Card */}
            <div className="card" style={{ background: 'var(--color-bg-card)' }}>
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Notifications</h3>
                  <Link href="/support" style={{ fontSize: '0.78rem', color: 'var(--color-brand-primary)', textDecoration: 'none', fontWeight: 600 }}>
                    View all
                  </Link>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.25rem' }}>
                  {notifications.map((n, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <div style={{ flexShrink: 0, marginTop: '2px' }}>
                        <ProviderIcon provider={n.type} size={16} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff', lineHeight: '1.3' }}>{n.text}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>{n.sub}</div>
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{n.time}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                  <Link href="/support" style={{ fontSize: '0.8rem', color: 'var(--color-brand-primary)', textDecoration: 'none', fontWeight: 600 }}>
                    View all notifications &rarr;
                  </Link>
                </div>
              </div>
            </div>

          </div>
          
        </div>
      </div>
    </AppLayout>
  );
}
