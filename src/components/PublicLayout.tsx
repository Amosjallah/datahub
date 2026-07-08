'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/become-agent', label: 'Agent' },
    { href: '/api-docs', label: 'API' },
    { href: '/faqs', label: 'FAQs' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-bg-base)', minHeight: '100vh', color: 'var(--color-text-primary)' }}>
      {/* Navigation */}
      <nav className="navbar" style={{ borderBottom: '1px solid rgba(15, 23, 42, 0.06)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', transition: 'transform 0.2s' }} className="hover-scale">
            <Logo size={32} colorMode="light" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="text-gradient" style={{ fontWeight: 900, fontSize: '1.35rem', letterSpacing: '-0.03em', lineHeight: '1.1' }}>FA Digital</span>
              <span style={{ fontSize: '0.62rem', color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '0.15rem' }}>Utility gateway</span>
            </div>
          </Link>
          
          <div className="nav-links-desktop" style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`navbar-link ${pathname === link.href ? 'active' : ''}`}
                style={{
                  color: pathname === link.href ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                  fontWeight: pathname === link.href ? '700' : '600',
                  padding: '0.5rem 0.85rem',
                  fontSize: '0.875rem',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="nav-auth-desktop" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link href="/login" className="btn btn-secondary btn-sm" style={{ padding: '0.6rem 1.25rem', borderRadius: '10px', fontWeight: 600, transition: 'all 0.2s' }}>
              Log in
            </Link>
            <Link href="/register" className="btn btn-primary btn-sm" style={{ padding: '0.6rem 1.25rem', borderRadius: '10px', fontWeight: 600, color: '#FFFFFF', transition: 'all 0.2s' }}>
              Create account
            </Link>
          </div>
          
          <button 
            type="button" 
            className="nav-toggle-mobile" 
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'var(--color-brand-subtle)',
              border: '1px solid rgba(0, 102, 255, 0.1)',
              borderRadius: '10px',
              padding: '0.5rem',
              color: 'var(--color-brand-primary)',
              cursor: 'pointer',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Collapsible Mobile Navigation Menu */}
      <div 
        className={`mobile-nav-menu ${menuOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: 'var(--topbar-height)',
          left: 0,
          right: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--color-border)',
          padding: '1.5rem',
          display: menuOpen ? 'flex' : 'none',
          flexDirection: 'column',
          gap: '0.85rem',
          zIndex: 999,
          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.05)'
        }}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            style={{
              color: pathname === link.href ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
              fontWeight: pathname === link.href ? '700' : '600',
              padding: '0.65rem 0.5rem',
              fontSize: '0.95rem',
              borderBottom: '1px solid var(--color-border-subtle)',
              textDecoration: 'none',
              display: 'block',
              transition: 'all 0.2s'
            }}
          >
            {link.label}
          </Link>
        ))}
        <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column', marginTop: '1rem' }}>
          <Link href="/login" onClick={() => setMenuOpen(false)} className="btn btn-secondary btn-full" style={{ borderRadius: '10px', fontWeight: 600, padding: '0.75rem', textAlign: 'center' }}>
            Log in
          </Link>
          <Link href="/register" onClick={() => setMenuOpen(false)} className="btn btn-primary btn-full" style={{ borderRadius: '10px', color: '#FFF', fontWeight: 600, padding: '0.75rem', textAlign: 'center' }}>
            Create account
          </Link>
        </div>
      </div>

      {/* Main content slot */}
      <main style={{ minHeight: 'calc(100vh - 400px)', paddingTop: 'var(--topbar-height)', display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>

      {/* Footer */}
      <footer className="footer" style={{ background: '#FFFFFF', borderTop: '1px solid var(--color-border)', padding: '5rem 0 3rem' }}>
        <div className="container">
          <div className="footer-cols-grid" style={{ marginBottom: '4rem' }}>
            {/* Column 1: Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Logo size={32} colorMode="light" />
                <span className="text-gradient" style={{ fontWeight: 900, fontSize: '1.35rem', letterSpacing: '-0.03em', lineHeight: '1.1' }}>FA Digital</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                Instant VTU & utility transaction gateway in Ghana. Buy cheap internet bundles, top up airtime, settle domestic bills, and purchase result checkers in seconds.
              </p>
              {/* Social Icons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                {[
                  { name: 'fb', icon: '🔵' },
                  { name: 'tw', icon: '⚫' },
                  { name: 'ig', icon: '📸' },
                  { name: 'wa', icon: '💬' }
                ].map((soc, idx) => (
                  <a
                    key={idx}
                    href="#"
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '12px',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'var(--color-bg-base)',
                      transition: 'all 0.2s',
                      textDecoration: 'none',
                      fontSize: '1rem'
                    }}
                    className="hover-scale"
                  >
                    {soc.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Services */}
            <div>
              <div className="footer-col-title" style={{ color: 'var(--color-text-primary)', fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Services</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li><Link href="/services" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Data bundles</Link></li>
                <li><Link href="/services" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Airtime top-up</Link></li>
                <li><Link href="/services" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Bill payments</Link></li>
                <li><Link href="/services" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Result checkers</Link></li>
                <li><Link href="/services" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>All utilities</Link></li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div>
              <div className="footer-col-title" style={{ color: 'var(--color-text-primary)', fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Company</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li><Link href="/about" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>About us</Link></li>
                <li><Link href="/about" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>How it works</Link></li>
                <li><Link href="/pricing" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Pricing</Link></li>
                <li><Link href="/become-agent" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Become an agent</Link></li>
                <li><Link href="/careers" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Careers</Link></li>
              </ul>
            </div>

            {/* Column 4: Help */}
            <div>
              <div className="footer-col-title" style={{ color: 'var(--color-text-primary)', fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Help</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li><Link href="/faqs" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>FAQs</Link></li>
                <li><Link href="/contact" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Contact us</Link></li>
                <li><Link href="/support" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Support tickets</Link></li>
                <li><Link href="/api-docs" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>API documentation</Link></li>
              </ul>
            </div>

            {/* Column 5: Legal */}
            <div>
              <div className="footer-col-title" style={{ color: 'var(--color-text-primary)', fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Legal</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li><Link href="/terms" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Terms of service</Link></li>
                <li><Link href="/privacy" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Privacy policy</Link></li>
                <li><Link href="/terms" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Refund policy</Link></li>
                <li><Link href="/privacy" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Cookie policy</Link></li>
              </ul>
            </div>

            {/* Column 6: Download App */}
            <div>
              <div className="footer-col-title" style={{ color: 'var(--color-text-primary)', fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>App Channels</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#0F172A', color: '#FFF', padding: '0.5rem 1rem', borderRadius: '10px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s' }} className="hover-scale">
                  <span style={{ fontSize: '1.2rem' }}>🤖</span>
                  <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
                    <div style={{ fontSize: '0.6rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Get it on</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 'bold' }}>Google Play</div>
                  </div>
                </a>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#0F172A', color: '#FFF', padding: '0.5rem 1rem', borderRadius: '10px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s' }} className="hover-scale">
                  <span style={{ fontSize: '1.2rem' }}>🍎</span>
                  <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
                    <div style={{ fontSize: '0.6rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Download on the</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 'bold' }}>App Store</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>&copy; {new Date().getFullYear()} FA DIGITAL SERVICES LTD. All rights reserved. Registered in Ghana.</span>
            
            {/* Country Selector Dropdown */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '0.5rem 1rem', background: 'var(--color-bg-base)', fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} className="hover-scale">
              <span>🇬🇭</span>
              <span>Ghana (GH₵)</span>
              <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>▼</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
