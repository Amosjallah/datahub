'use client';

import React from 'react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import ProviderIcon from '@/components/ProviderIcon';
import { 
  Users, UserCheck, Wallet, AlertTriangle, TrendingUp, TrendingDown, 
  ChevronDown 
} from 'lucide-react';

export default function AdminDashboard() {
  const recentTransactions = [
    { id: 'TRX-2024-0001', user: '0803 123 4567', type: 'Data (MTN 10GB)', provider: 'MTN', amount: 'GH₵4,500.00', status: 'success', date: 'May 20, 2024 10:45 AM', action: 'none' },
    { id: 'TRX-2024-0002', user: '0701 234 5678', type: 'Airtime (Airtel ₦1,000)', provider: 'Airtel', amount: 'GH₵1,000.00', status: 'success', date: 'May 20, 2024 10:42 AM', action: 'none' },
    { id: 'TRX-2024-0003', user: '0806 345 6789', type: 'Data (Glo 5GB)', provider: 'Glo', amount: 'GH₵2,200.00', status: 'success', date: 'May 20, 2024 10:15 AM', action: 'none' },
    { id: 'TRX-2024-0004', user: '0908 765 4321', type: 'Airtime (MTN ₦500)', provider: 'MTN', amount: 'GH₵500.00', status: 'failed', date: 'May 20, 2024 09:58 AM', action: 'reverse' },
    { id: 'TRX-2024-0005', user: '0812 345 6789', type: 'Data (Airtel 2GB)', provider: 'Airtel', amount: 'GH₵1,100.00', status: 'failed', date: 'May 20, 2024 09:47 AM', action: 'reverse' },
    { id: 'TRX-2024-0006', user: '0709 876 5432', type: 'Data (9mobile 1GB)', provider: '9mobile', amount: 'GH₵600.00', status: 'processing', date: 'May 20, 2024 09:40 AM', action: 'none' },
  ];

  const providerHealth = [
    { name: 'MTN', status: 'Operational', color: '#10B981', success: '99.58%', latency: '320ms' },
    { name: 'Airtel', status: 'Operational', color: '#10B981', success: '98.91%', latency: '410ms' },
    { name: 'Glo', status: 'Degraded', color: '#F59E0B', success: '95.32%', latency: '1.2s' },
    { name: '9mobile', status: 'Operational', color: '#10B981', success: '97.88%', latency: '520ms' },
    { name: 'MoMo (MTN)', status: 'Down', color: '#EF4444', success: '78.12%', latency: '3.6s' },
    { name: 'Flutterwave', status: 'Operational', color: '#10B981', success: '99.74%', latency: '210ms' },
  ];

  const supportTickets = [
    { id: 'TKT-2024-0001', subject: 'Data purchase failed', priority: 'High', priorityColor: '#EF4444', status: 'Open', statusColor: 'badge-info' },
    { id: 'TKT-2024-0002', subject: 'Wallet funding issue', priority: 'Medium', priorityColor: '#F59E0B', status: 'In progress', statusColor: 'badge-info' },
    { id: 'TKT-2024-0003', subject: 'Airtime not received', priority: 'High', priorityColor: '#EF4444', status: 'Open', statusColor: 'badge-info' },
    { id: 'TKT-2024-0004', subject: 'Agent settlement delay', priority: 'Medium', priorityColor: '#F59E0B', status: 'In progress', statusColor: 'badge-info' },
    { id: 'TKT-2024-0005', subject: 'Account verification', priority: 'Low', priorityColor: '#10B981', status: 'Resolved', statusColor: 'badge-success' },
  ];

  const joinedUsers = [
    { name: 'John Okafor', phone: '0803 123 4567', role: 'Customer', roleColor: '#0066FF', joined: 'May 20, 2024', status: 'Active' },
    { name: 'Alice Johnson', phone: '0701 234 5678', role: 'Agent', roleColor: '#8B5CF6', joined: 'May 20, 2024', status: 'Active' },
    { name: 'David Amadi', phone: '0806 345 6789', role: 'Customer', roleColor: '#0066FF', joined: 'May 19, 2024', status: 'Active' },
    { name: 'Sarah Ibrahim', phone: '0908 765 4321', role: 'Agent', roleColor: '#8B5CF6', joined: 'May 19, 2024', status: 'Active' },
    { name: 'Admin User', phone: '0812 345 6789', role: 'Admin', roleColor: '#64748B', joined: 'May 18, 2024', status: 'Active' },
  ];

  const auditLogs = [
    { action: 'REVERSE_TRANSACTION', desc: 'Reversed transaction TRX-2024-0004', performer: 'admin@fadigital.com', date: 'May 20, 2024 09:59 AM' },
    { action: 'UPDATE_PRICING', desc: 'Updated MTN 10GB data price', performer: 'admin@fadigital.com', date: 'May 20, 2024 09:30 AM' },
    { action: 'SUSPEND_USER', desc: 'Suspended user 0809 876 5432', performer: 'admin@fadigital.com', date: 'May 19, 2024 04:22 PM' },
    { action: 'AGENT_SETTLEMENT', desc: 'Settled agent 0908 765 4321', performer: 'admin@fadigital.com', date: 'May 19, 2024 11:15 AM' },
    { action: 'CREATE_SERVICE', desc: 'Added new service: DStv Compact', performer: 'admin@fadigital.com', date: 'May 18, 2024 02:45 PM' },
  ];

  const chartData = [
    { label: 'May 14', value: '140px', amount: 'GH₵1.3M' },
    { label: 'May 15', value: '170px', amount: 'GH₵1.5M' },
    { label: 'May 16', value: '220px', amount: 'GH₵1.9M' },
    { label: 'May 17', value: '130px', amount: 'GH₵1.25M' },
    { label: 'May 18', value: '180px', amount: 'GH₵1.7M' },
    { label: 'May 19', value: '190px', amount: 'GH₵1.8M' },
    { label: 'May 20', value: '150px', amount: 'GH₵1.55M' },
  ];

  return (
    <AppLayout userName="Admin User" userRole="admin">
      <div className="animate-fade-up">
        {/* Top 4 Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          
          {/* Card 1: Total users */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', gap: '1rem', background: 'var(--color-bg-card)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(0,102,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-brand-primary)', flexShrink: 0 }}>
              <Users size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Total users
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: '0.15rem 0', fontFamily: 'monospace' }}>
                24,568
              </div>
              <div style={{ fontSize: '0.72rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                <TrendingUp size={12} /> 12.5% vs yesterday
              </div>
            </div>
          </div>

          {/* Card 2: Active agents */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', gap: '1rem', background: 'var(--color-bg-card)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6', flexShrink: 0 }}>
              <UserCheck size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Active agents
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: '0.15rem 0', fontFamily: 'monospace' }}>
                1,245
              </div>
              <div style={{ fontSize: '0.72rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                <TrendingUp size={12} /> 8.3% vs yesterday
              </div>
            </div>
          </div>

          {/* Card 3: Revenue today */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', gap: '1rem', background: 'var(--color-bg-card)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', flexShrink: 0 }}>
              <Wallet size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Revenue today
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: '0.15rem 0', fontFamily: 'monospace' }}>
                GH₵1,568,900.00
              </div>
              <div style={{ fontSize: '0.72rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                <TrendingUp size={12} /> 15.7% vs yesterday
              </div>
            </div>
          </div>

          {/* Card 4: Failed transactions */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', gap: '1rem', background: 'var(--color-bg-card)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', flexShrink: 0 }}>
              <AlertTriangle size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Failed transactions
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: '0.15rem 0', fontFamily: 'monospace' }}>
                102
              </div>
              <div style={{ fontSize: '0.72rem', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                <TrendingDown size={12} /> 23.4% vs yesterday
              </div>
            </div>
          </div>

        </div>

        {/* Main Grid Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.62fr) minmax(0, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* Left Column (Revenue Overview, Recent Transactions, Recently Joined Users) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Revenue Overview (7 days) */}
            <div className="card" style={{ background: 'var(--color-bg-card)' }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Revenue overview (7 days)</h3>
                  <div style={{ position: 'relative' }}>
                    <select className="form-input" style={{ appearance: 'none', padding: '0.45rem 2rem 0.45rem 0.875rem', borderRadius: '6px', fontSize: '0.75rem', width: 'auto', border: '1px solid var(--color-border)', background: 'var(--color-bg-elevated)' }}>
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                    </select>
                    <ChevronDown size={12} style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-muted)' }} />
                  </div>
                </div>

                {/* Bar Chart container */}
                <div style={{ display: 'flex', gap: '1.5rem', height: '280px', alignItems: 'flex-end', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border-subtle)', position: 'relative' }}>
                  {/* Grid Y-Axis references */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '240px', position: 'absolute', left: 0, right: 0, pointerEvents: 'none', zIndex: 1 }}>
                    <div style={{ borderBottom: '1.5px dashed rgba(255,255,255,0.03)', height: 0, position: 'relative' }}><span style={{ position: 'absolute', top: '-8px', left: 0, fontSize: '0.65rem', color: 'var(--color-text-muted)', background: 'var(--color-bg-card)', paddingRight: '4px' }}>GH₵2.0M</span></div>
                    <div style={{ borderBottom: '1.5px dashed rgba(255,255,255,0.03)', height: 0, position: 'relative' }}><span style={{ position: 'absolute', top: '-8px', left: 0, fontSize: '0.65rem', color: 'var(--color-text-muted)', background: 'var(--color-bg-card)', paddingRight: '4px' }}>GH₵1.5M</span></div>
                    <div style={{ borderBottom: '1.5px dashed rgba(255,255,255,0.03)', height: 0, position: 'relative' }}><span style={{ position: 'absolute', top: '-8px', left: 0, fontSize: '0.65rem', color: 'var(--color-text-muted)', background: 'var(--color-bg-card)', paddingRight: '4px' }}>GH₵1.0M</span></div>
                    <div style={{ borderBottom: '1.5px dashed rgba(255,255,255,0.03)', height: 0, position: 'relative' }}><span style={{ position: 'absolute', top: '-8px', left: 0, fontSize: '0.65rem', color: 'var(--color-text-muted)', background: 'var(--color-bg-card)', paddingRight: '4px' }}>GH₵500K</span></div>
                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', height: 0, position: 'relative' }}><span style={{ position: 'absolute', top: '-8px', left: 0, fontSize: '0.65rem', color: 'var(--color-text-muted)', background: 'var(--color-bg-card)', paddingRight: '4px' }}>N0</span></div>
                  </div>

                  {/* Chart columns loop */}
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

            {/* Recent Transactions */}
            <div className="card" style={{ background: 'var(--color-bg-card)' }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Recent transactions</h3>
                  <Link href="/admin/transactions" style={{ fontSize: '0.78rem', color: 'var(--color-brand-primary)', textDecoration: 'none', fontWeight: 600 }}>
                    View all
                  </Link>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                        <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>Transaction ID</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>User</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Type</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Amount</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Status</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Date</th>
                        <th style={{ padding: '0.75rem 0', fontWeight: 600, textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((tx) => (
                        <tr key={tx.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                          <td style={{ padding: '0.875rem 0', fontWeight: 600, color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>{tx.id}</td>
                          <td style={{ padding: '0.875rem 0.5rem', fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>{tx.user}</td>
                          <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <ProviderIcon provider={tx.provider} size={16} />
                              <span>{tx.type}</span>
                            </div>
                          </td>
                          <td style={{ padding: '0.875rem 0.5rem', fontWeight: 700, fontFamily: 'monospace', color: '#fff' }}>{tx.amount}</td>
                          <td style={{ padding: '0.875rem 0.5rem' }}>
                            <span className={`badge ${
                              tx.status === 'success' ? 'badge-success' : 
                              tx.status === 'processing' ? 'badge-info' : 'badge-danger'
                            }`} style={{ textTransform: 'capitalize', fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                              {tx.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.875rem 0.5rem', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{tx.date}</td>
                          <td style={{ padding: '0.875rem 0', textAlign: 'right' }}>
                            {tx.action === 'reverse' ? (
                              <button className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.625rem', borderRadius: '6px', fontSize: '0.68rem', border: '1px solid #EF4444', color: '#EF4444', background: 'transparent' }} onClick={() => alert(`Reversed TRX: ${tx.id}`)}>
                                Reverse
                              </button>
                            ) : (
                              <span style={{ color: 'var(--color-text-muted)' }}>—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>

            {/* Recently Joined Users */}
            <div className="card" style={{ background: 'var(--color-bg-card)' }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Recently joined users</h3>
                  <Link href="/admin/users" style={{ fontSize: '0.78rem', color: 'var(--color-brand-primary)', textDecoration: 'none', fontWeight: 600 }}>
                    View all
                  </Link>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                        <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>User</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Phone number</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Role</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Joined on</th>
                        <th style={{ padding: '0.75rem 0', fontWeight: 600, textAlign: 'right' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {joinedUsers.map((user, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                          <td style={{ padding: '0.875rem 0', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{user.name}</td>
                          <td style={{ padding: '0.875rem 0.5rem', fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>{user.phone}</td>
                          <td style={{ padding: '0.875rem 0.5rem' }}>
                            <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: user.roleColor, border: `1.5px solid ${user.roleColor}` }}>
                              {user.role}
                            </span>
                          </td>
                          <td style={{ padding: '0.875rem 0.5rem', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{user.joined}</td>
                          <td style={{ padding: '0.875rem 0', textAlign: 'right' }}>
                            <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                              {user.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column (Provider health, Support tickets, Audit log) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Provider health */}
            <div className="card" style={{ background: 'var(--color-bg-card)' }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Provider health</h3>
                  <Link href="/admin/pricing" style={{ fontSize: '0.78rem', color: 'var(--color-brand-primary)', textDecoration: 'none', fontWeight: 600 }}>
                    View all
                  </Link>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                        <th style={{ padding: '0.5rem 0', fontWeight: 600 }}>Provider</th>
                        <th style={{ padding: '0.5rem 0.35rem', fontWeight: 600 }}>Status</th>
                        <th style={{ padding: '0.5rem 0.35rem', fontWeight: 600 }}>Success rate</th>
                        <th style={{ padding: '0.5rem 0', fontWeight: 600, textAlign: 'right' }}>Avg. latency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {providerHealth.map((p, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                          <td style={{ padding: '0.625rem 0', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <ProviderIcon provider={p.name} size={16} />
                              <span>{p.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '0.625rem 0.35rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: p.color, display: 'inline-block' }}></span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>{p.status}</span>
                            </div>
                          </td>
                          <td style={{ padding: '0.625rem 0.35rem', fontFamily: 'monospace', fontWeight: 600, color: '#fff' }}>{p.success}</td>
                          <td style={{ padding: '0.625rem 0', fontWeight: 600, color: 'var(--color-text-muted)', textAlign: 'right', fontFamily: 'monospace' }}>{p.latency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>

            {/* Support tickets */}
            <div className="card" style={{ background: 'var(--color-bg-card)' }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Support tickets</h3>
                  <Link href="/admin/tickets" style={{ fontSize: '0.78rem', color: 'var(--color-brand-primary)', textDecoration: 'none', fontWeight: 600 }}>
                    View all
                  </Link>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                        <th style={{ padding: '0.5rem 0', fontWeight: 600 }}>Ticket ID</th>
                        <th style={{ padding: '0.5rem 0.35rem', fontWeight: 600 }}>Subject</th>
                        <th style={{ padding: '0.5rem 0.35rem', fontWeight: 600 }}>Priority</th>
                        <th style={{ padding: '0.5rem 0', fontWeight: 600, textAlign: 'right' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supportTickets.map((t, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                          <td style={{ padding: '0.625rem 0', fontWeight: 600, color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>{t.id}</td>
                          <td style={{ padding: '0.625rem 0.35rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{t.subject}</td>
                          <td style={{ padding: '0.625rem 0.35rem' }}>
                            <span style={{ color: t.priorityColor, fontWeight: 700, fontSize: '0.72rem' }}>{t.priority}</span>
                          </td>
                          <td style={{ padding: '0.625rem 0', textAlign: 'right' }}>
                            <span className={`badge ${t.statusColor}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.45rem' }}>
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>

            {/* Audit log */}
            <div className="card" style={{ background: 'var(--color-bg-card)' }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Audit log</h3>
                  <Link href="/admin/logs" style={{ fontSize: '0.78rem', color: 'var(--color-brand-primary)', textDecoration: 'none', fontWeight: 600 }}>
                    View all
                  </Link>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                        <th style={{ padding: '0.5rem 0', fontWeight: 600 }}>Action</th>
                        <th style={{ padding: '0.5rem 0.35rem', fontWeight: 600 }}>Description</th>
                        <th style={{ padding: '0.5rem 0.35rem', fontWeight: 600 }}>Performer</th>
                        <th style={{ padding: '0.5rem 0', fontWeight: 600, textAlign: 'right' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map((log, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                          <td style={{ padding: '0.625rem 0', fontWeight: 700, color: 'var(--color-brand-primary)', fontSize: '0.72rem' }}>{log.action}</td>
                          <td style={{ padding: '0.625rem 0.35rem', color: 'var(--color-text-secondary)' }}>{log.desc}</td>
                          <td style={{ padding: '0.625rem 0.35rem', color: 'var(--color-text-muted)', fontSize: '0.72rem', fontFamily: 'monospace' }}>{log.performer.split('@')[0]}</td>
                          <td style={{ padding: '0.625rem 0', color: 'var(--color-text-muted)', fontSize: '0.72rem', textAlign: 'right' }}>{log.date.split(' ')[1]} {log.date.split(' ')[2]}</td>
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
