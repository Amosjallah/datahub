'use client';

import React from 'react';
import Link from 'next/link';

export default function SupportFloat() {
  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', zIndex: 99999 }}>
      {/* Support Chat Float (Blue) */}
      <Link 
        href="/contact" 
        style={{ 
          width: '3.25rem', 
          height: '3.25rem', 
          borderRadius: '50%', 
          backgroundColor: '#2563EB', 
          color: '#FFFFFF', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)', 
          transition: 'all 0.2s', 
          cursor: 'pointer',
          border: 'none',
          textDecoration: 'none'
        }}
        className="hover-scale"
        title="Contact Support"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </Link>

      {/* WhatsApp Support Float (Green) */}
      <a 
        href="https://wa.me/233596922026" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ 
          width: '3.25rem', 
          height: '3.25rem', 
          borderRadius: '50%', 
          backgroundColor: '#25D366', 
          color: '#FFFFFF', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)', 
          transition: 'all 0.2s', 
          cursor: 'pointer',
          border: 'none',
          textDecoration: 'none'
        }}
        className="hover-scale"
        title="WhatsApp Support"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
      </a>
    </div>
  );
}
