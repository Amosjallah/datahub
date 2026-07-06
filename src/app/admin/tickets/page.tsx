'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Mail, CheckCircle, Clock } from 'lucide-react';

export default function AdminTickets() {
  const [tickets, setTickets] = useState([
    { id: 'TKT-2024-0001', user: 'Kwame Mensah', phone: '0244123456', subject: 'Data purchase failed but debited', priority: 'High', status: 'Open', date: 'May 20, 2024' },
    { id: 'TKT-2024-0002', user: 'John Oliver', phone: '0551234567', subject: 'Wallet MoMo funding delay', priority: 'Medium', status: 'In progress', date: 'May 20, 2024' },
    { id: 'TKT-2024-0003', user: 'David Amadi', phone: '0806345678', subject: 'Airtime not received for 080634', priority: 'High', status: 'Open', date: 'May 19, 2024' },
    { id: 'TKT-2024-0004', user: 'Alice Johnson', phone: '0701234568', subject: 'Agent discount structure query', priority: 'Low', status: 'Resolved', date: 'May 18, 2024' },
  ]);

  const toggleStatus = (id: string, nextStatus: string) => {
    setTickets(tickets.map(t => {
      if (t.id === id) {
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  return (
    <AppLayout userName="Admin User" userRole="admin">
      <div className="animate-fade-up">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>📬 Support Tickets</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Review customer issues, change ticket status, and resolve issues.</p>
        </div>

        {/* Tickets Table */}
        <div className="card" style={{ background: '#FFF', border: '1px solid var(--color-border)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)', backgroundColor: '#FAFAFA' }}>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Ticket ID</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>User / Contact</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Subject / Issue</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Priority</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>Date Created</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>{t.id}</td>
                  <td style={{ padding: '1rem 0.5rem', color: 'var(--color-text-primary)' }}>
                    <div style={{ fontWeight: 600 }}>{t.user}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{t.phone}</div>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', color: 'var(--color-text-secondary)', maxWidth: '280px', whiteSpace: 'normal', lineHeight: '1.4' }}>{t.subject}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span style={{ 
                      fontWeight: 700, 
                      fontSize: '0.72rem', 
                      color: t.priority === 'High' ? '#EF4444' : t.priority === 'Medium' ? '#F59E0B' : '#10B981' 
                    }}>
                      ⚠️ {t.priority}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span className={`badge ${
                      t.status === 'Open' ? 'badge-danger' : 
                      t.status === 'In progress' ? 'badge-info' : 'badge-success'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', color: 'var(--color-text-muted)' }}>{t.date}</td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    {t.status !== 'Resolved' ? (
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        {t.status === 'Open' && (
                          <button 
                            onClick={() => toggleStatus(t.id, 'In progress')}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.3rem 0.65rem', borderRadius: '6px', fontSize: '0.72rem', border: '1px solid var(--color-border)', backgroundColor: '#FFF', color: 'var(--color-text-primary)' }}
                          >
                            Investigate
                          </button>
                        )}
                        <button 
                          onClick={() => toggleStatus(t.id, 'Resolved')}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '0.3rem 0.65rem', borderRadius: '6px', fontSize: '0.72rem', backgroundColor: '#10B981', border: 'none', color: '#FFF', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <CheckCircle size={12} /> Resolve
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>Resolved ✅</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
