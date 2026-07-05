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
    <div>
      {/* Navigation */}
      <nav className="navbar">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <Logo size={36} colorMode="dark" />
            <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: '#FFF', lineHeight: '1' }}>FA Digital</span>
          </Link>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`navbar-link ${pathname === link.href ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link href="/login" className="btn btn-secondary btn-sm">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary btn-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content slot */}
      <main style={{ minHeight: 'calc(100vh - 350px)', paddingTop: 'var(--topbar-height)' }}>
        {children}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Logo size={36} colorMode="dark" />
                <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: '#FFF', lineHeight: '1' }}>FA Digital</span>
              </div>
              <p style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                We provide reliable digital solutions that make everyday transactions simple, fast and secure. Your trusted partner for digital services and innovation.
              </p>
            </div>
            <div>
              <div className="footer-col-title">Services</div>
              <Link href="/services" className="footer-link">Data Bundles</Link>
              <Link href="/services" className="footer-link">Airtime Top-Up</Link>
              <Link href="/services" className="footer-link">Electricity (ECG)</Link>
              <Link href="/services" className="footer-link">TV Subscriptions</Link>
            </div>
            <div>
              <div className="footer-col-title">Company</div>
              <Link href="/about" className="footer-link">About Us</Link>
              <Link href="/become-agent" className="footer-link">Become an Agent</Link>
              <Link href="/blog" className="footer-link">Blog &amp; News</Link>
              <Link href="/careers" className="footer-link">Careers</Link>
            </div>
            <div>
              <div className="footer-col-title">Legal</div>
              <Link href="/terms" className="footer-link">Terms &amp; Conditions</Link>
              <Link href="/privacy" className="footer-link">Privacy Policy</Link>
              <Link href="/contact" className="footer-link">Contact Support</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <span>&copy; {new Date().getFullYear()} FA DIGITAL SERVICES LTD. All rights reserved.</span>
            <span>Made with &hearts; in Ghana 🇬🇭</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
