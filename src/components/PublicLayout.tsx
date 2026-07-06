'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const pathname = usePathname();

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
      <nav className="navbar">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <Logo size={32} colorMode="light" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--color-text-primary)', lineHeight: '1' }}>FA Digital</span>
              <span style={{ fontSize: '0.62rem', color: 'var(--color-text-muted)', fontWeight: 500, marginTop: '0.1rem' }}>Top up. Pay bills. Stay connected.</span>
            </div>
          </Link>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`navbar-link ${pathname === link.href ? 'active' : ''}`}
                style={{
                  color: pathname === link.href ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                  fontWeight: pathname === link.href ? '700' : '500',
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.875rem'
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link href="/login" className="btn btn-secondary btn-sm" style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', color: 'var(--color-text-primary)', fontWeight: 600, border: '1px solid var(--color-border)', backgroundColor: '#FFF' }}>
              Log in
            </Link>
            <Link href="/register" className="btn btn-primary btn-sm" style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', backgroundColor: 'var(--color-brand-primary)', color: '#FFF', fontWeight: 600 }}>
              Create account
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content slot */}
      <main style={{ minHeight: 'calc(100vh - 400px)', paddingTop: 'var(--topbar-height)' }}>
        {children}
      </main>

      {/* Footer */}
      <footer className="footer" style={{ background: '#FFFFFF', borderTop: '1px solid var(--color-border)', padding: '4rem 0 2rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 1.5fr', gap: '2rem', marginBottom: '3rem' }}>
            {/* Column 1: Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <Logo size={32} colorMode="light" />
                <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--color-text-primary)', lineHeight: '1' }}>FA Digital</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                Top up. Pay bills. Stay connected. Reliable digital solutions making everyday transactions simple, fast, and secure.
              </p>
              {/* Social Icons */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['f', 't', 'i', 'tk'].map((soc, idx) => (
                  <a
                    key={idx}
                    href="#"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-text-secondary)',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      backgroundColor: '#F8FAFC',
                      textDecoration: 'none'
                    }}
                  >
                    {soc}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Services */}
            <div>
              <div className="footer-col-title" style={{ color: 'var(--color-text-primary)', fontWeight: 700, fontSize: '0.8rem', marginBottom: '1rem' }}>Services</div>
              <Link href="/services" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.6rem' }}>Data bundles</Link>
              <Link href="/services" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.6rem' }}>Airtime top-up</Link>
              <Link href="/services" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.6rem' }}>Bill payments</Link>
              <Link href="/services" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.6rem' }}>Result checkers</Link>
              <Link href="/services" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.6rem' }}>All services</Link>
            </div>

            {/* Column 3: Company */}
            <div>
              <div className="footer-col-title" style={{ color: 'var(--color-text-primary)', fontWeight: 700, fontSize: '0.8rem', marginBottom: '1rem' }}>Company</div>
              <Link href="/about" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.6rem' }}>About us</Link>
              <Link href="/about" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.6rem' }}>How it works</Link>
              <Link href="/pricing" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.6rem' }}>Pricing</Link>
              <Link href="/become-agent" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.6rem' }}>Become an agent</Link>
              <Link href="/careers" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.6rem' }}>Careers</Link>
            </div>

            {/* Column 4: Help */}
            <div>
              <div className="footer-col-title" style={{ color: 'var(--color-text-primary)', fontWeight: 700, fontSize: '0.8rem', marginBottom: '1rem' }}>Help</div>
              <Link href="/faqs" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.6rem' }}>FAQs</Link>
              <Link href="/contact" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.6rem' }}>Contact us</Link>
              <Link href="/support" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.6rem' }}>Support tickets</Link>
              <Link href="/api-docs" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.6rem' }}>API documentation</Link>
            </div>

            {/* Column 5: Legal */}
            <div>
              <div className="footer-col-title" style={{ color: 'var(--color-text-primary)', fontWeight: 700, fontSize: '0.8rem', marginBottom: '1rem' }}>Legal</div>
              <Link href="/terms" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.6rem' }}>Terms of service</Link>
              <Link href="/privacy" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.6rem' }}>Privacy policy</Link>
              <Link href="/terms" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.6rem' }}>Refund policy</Link>
              <Link href="/privacy" className="footer-link" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.6rem' }}>Cookie policy</Link>
            </div>

            {/* Column 6: Download App */}
            <div>
              <div className="footer-col-title" style={{ color: 'var(--color-text-primary)', fontWeight: 700, fontSize: '0.8rem', marginBottom: '1rem' }}>Download Our App</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0F172A', color: '#FFF', padding: '0.4rem 0.8rem', borderRadius: '6px', textDecoration: 'none', border: '1px solid #1E293B' }}>
                  <span style={{ fontSize: '1.2rem' }}>🤖</span>
                  <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
                    <div style={{ fontSize: '0.6rem', color: '#94A3B8', textTransform: 'uppercase' }}>Get it on</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Google Play</div>
                  </div>
                </a>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0F172A', color: '#FFF', padding: '0.4rem 0.8rem', borderRadius: '6px', textDecoration: 'none', border: '1px solid #1E293B' }}>
                  <span style={{ fontSize: '1.2rem' }}>🍎</span>
                  <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
                    <div style={{ fontSize: '0.6rem', color: '#94A3B8', textTransform: 'uppercase' }}>Download on the</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>App Store</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>&copy; {new Date().getFullYear()} FA DIGITAL SERVICES LTD. All rights reserved.</span>
            
            {/* Country Selector Dropdown */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '0.35rem 0.75rem', background: '#F8FAFC', fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 600, cursor: 'pointer' }}>
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
