'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';

interface PageProps {
  params: {
    slug: string[];
  };
}

export default function AdminPlaceholder({ params }: PageProps) {
  const pageName = params.slug[0] || 'page';
  // Capitalize page name and replace dashes with spaces
  const displayName = pageName
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <AppLayout userName="Admin User" userRole="admin">
      <div className="animate-fade-up card" style={{ padding: '4rem 2rem', textAlign: 'center', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '16px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>⚙️</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>{displayName} Dashboard</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
          This feature is currently under active development. Check back soon for updates!
        </p>
        <div style={{ display: 'inline-flex' }}>
          <button 
            type="button" 
            onClick={() => window.history.back()} 
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: '#FFF', color: 'var(--color-text-primary)' }}
          >
            Go Back
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
