'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Search, UserMinus, UserCheck, ShieldAlert } from 'lucide-react';

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [users, setUsers] = useState([
    { id: '1', name: 'Kwame Mensah', email: 'kwame@fadigital.com', phone: '0244123456', role: 'Agent', status: 'Active', balance: 'GH₵125,680.50' },
    { id: '2', name: 'John Oliver', email: 'john@example.com', phone: '0551234567', role: 'Customer', status: 'Active', balance: 'GH₵25,680.50' },
    { id: '3', name: 'Alice Johnson', email: 'alice@example.com', phone: '0701234568', role: 'Agent', status: 'Active', balance: 'GH₵5,430.00' },
    { id: '4', name: 'David Amadi', email: 'david@example.com', phone: '0806345678', role: 'Customer', status: 'Active', balance: 'GH₵150.00' },
    { id: '5', name: 'Sarah Ibrahim', email: 'sarah@example.com', phone: '0908765432', role: 'Agent', status: 'Suspended', balance: 'GH₵0.00' },
    { id: '6', name: 'Ama Osei', email: 'ama@example.com', phone: '0209876543', role: 'Customer', status: 'Active', balance: 'GH₵1,200.50' },
  ]);

  const toggleStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' };
      }
      return u;
    }));
  };

  const filtered = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase()) ||
                          u.phone.includes(search);
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  return (
    <AppLayout userName="Admin User" userRole="admin">
      <div className="animate-fade-up">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>👥 Users Management</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>View, filter, suspend or manage account balances of all platform users.</p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <input 
                type="text" 
                placeholder="Search by name, email or phone..." 
                className="form-input" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '2.5rem', fontSize: '0.875rem' }} 
              />
              <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            
            <select 
              className="form-select" 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ width: 'auto', minWidth: '150px', fontSize: '0.875rem' }}
            >
              <option value="">All Roles</option>
              <option value="Customer">Customers</option>
              <option value="Agent">Agents</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="card" style={{ border: '1px solid var(--color-border)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg-surface)' }}>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Name</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Email</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Phone</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Role</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Wallet Balance</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{u.name}</td>
                  <td style={{ padding: '1rem 0.5rem', color: 'var(--color-text-secondary)' }}>{u.email}</td>
                  <td style={{ padding: '1rem 0.5rem', fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>{u.phone}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span className="badge" style={{ backgroundColor: u.role === 'Agent' ? 'rgba(139,92,246,0.1)' : 'rgba(0,102,255,0.1)', color: u.role === 'Agent' ? '#8B5CF6' : '#0066FF' }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-text-primary)' }}>{u.balance}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span className={`badge ${u.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <button 
                      onClick={() => toggleStatus(u.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ 
                        padding: '0.3rem 0.65rem', 
                        borderRadius: '6px', 
                        fontSize: '0.72rem', 
                        border: u.status === 'Active' ? '1px solid #EF4444' : '1px solid #10B981',
                        color: u.status === 'Active' ? '#EF4444' : '#10B981',
                        backgroundColor: 'transparent',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      {u.status === 'Active' ? <UserMinus size={12} /> : <UserCheck size={12} />}
                      {u.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', opacity: 0.3 }}>🔍</div>
                    <p style={{ color: 'var(--color-text-muted)' }}>No users found matching your filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
