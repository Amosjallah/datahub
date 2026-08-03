'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, X, ShieldCheck, Rocket, BadgeDollarSign, Headphones, 
  Facebook, Twitter, Instagram, MessageCircle, 
  Phone, Mail, MapPin, Youtube
} from 'lucide-react';
import Logo from './Logo';
import LiveChatWidget from './LiveChatWidget';
import LiveTransactionToast from './LiveTransactionToast';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/blog', label: 'Blog' },
    { href: '/become-agent', label: 'Agent' },
    { href: '/api-docs', label: 'API' },
    { href: '/faqs', label: 'FAQs' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-bg-base)', minHeight: '100vh', color: 'var(--color-text-primary)' }}>
      {/* Navigation */}
      <nav className="navbar" style={{ borderBottom: '1px solid var(--color-border)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', transition: 'transform 0.2s' }} className="hover-scale">
            <Logo size={32} />
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
      <main style={{ minHeight: 'calc(100vh - 400px)', paddingTop: '72px', display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ 
        backgroundColor: '#0B1120', 
        borderTop: '1px solid rgba(255,255,255,0.06)', 
        padding: '0' 
      }}>
        
        {/* Features Banner Row */}
        <div style={{ 
          borderBottom: '1px solid rgba(255,255,255,0.06)', 
          padding: '2.5rem 0', 
          backgroundColor: '#0F1729'
        }}>
          <div className="container">
            <div className="features-banner-grid">
              {[
                { icon: <ShieldCheck size={22} />, title: '100% Secure Transactions', desc: 'Your security is our top priority.' },
                { icon: <Rocket size={22} />, title: 'Instant Delivery', desc: 'Enjoy instant delivery on all services.' },
                { icon: <BadgeDollarSign size={22} />, title: 'Best Prices Guaranteed', desc: 'We offer the cheapest rates in the market.' },
                { icon: <Headphones size={22} />, title: '24/7 Customer Support', desc: 'Our support team is always here to help.' },
              ].map((feat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    border: '2px solid var(--color-brand-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-brand-primary)',
                    flexShrink: 0,
                    backgroundColor: 'rgba(250,204,21,0.06)'
                  }}>
                    {feat.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#F9FAFB', marginBottom: '0.2rem', lineHeight: 1.3 }}>{feat.title}</h4>
                    <p style={{ fontSize: '0.77rem', color: '#6B7280', lineHeight: '1.45' }}>{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div style={{ padding: '3.5rem 0 2.5rem' }}>
          <div className="container">
            <div className="footer-cols-grid" style={{ marginBottom: '2.5rem' }}>

              {/* Col 1 – Brand */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <Logo size={32} />
                <p style={{ fontSize: '0.83rem', color: '#6B7280', lineHeight: '1.65', maxWidth: '220px' }}>
                  FA Digital is your trusted partner for all digital services. We make every transaction simple, fast, and secure.
                </p>
                <div style={{ display: 'flex', gap: '0.55rem', marginTop: '0.15rem' }}>
                  {[
                    { icon: <Facebook size={14} />, href: '#', label: 'Facebook' },
                    { icon: <Twitter size={14} />, href: '#', label: 'Twitter' },
                    { icon: <Instagram size={14} />, href: '#', label: 'Instagram' },
                    { icon: <MessageCircle size={14} />, href: 'https://wa.me/233548519420', label: 'WhatsApp' },
                  ].map((soc, idx) => (
                    <a
                      key={idx}
                      href={soc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={soc.label}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'var(--color-brand-primary)',
                        color: '#0B1120',
                        transition: 'transform 0.2s, opacity 0.2s',
                        textDecoration: 'none',
                        flexShrink: 0,
                        fontWeight: 700
                      }}
                      className="hover-scale"
                    >
                      {soc.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Col 2 – Quick Links */}
              <div>
                <p style={{ color: '#F9FAFB', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>Quick Links</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  {[
                    { label: 'Home', href: '/' },
                    { label: 'About Us', href: '/about' },
                    { label: 'Services', href: '/services' },
                    { label: 'Pricing', href: '/pricing' },
                    { label: 'FAQ', href: '/faqs' },
                    { label: 'Contact Us', href: '/contact' },
                  ].map(l => (
                    <li key={l.href}>
                      <Link href={l.href} className="footer-link" style={{ fontSize: '0.84rem', color: '#6B7280', textDecoration: 'none', transition: 'color 0.2s' }}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3 – Services */}
              <div>
                <p style={{ color: '#F9FAFB', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>Services</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  {[
                    { label: 'Airtime Top-Up', href: '/buy' },
                    { label: 'Data Bundles', href: '/buy' },
                    { label: 'Bill Payments', href: '/buy' },
                    { label: 'Mobile Money', href: '/mtnup2u' },
                    { label: 'TV Subscription', href: '/pricing' },
                    { label: 'Exam Pins', href: '/buy' },
                    { label: 'Agent Program', href: '/become-agent' },
                  ].map(l => (
                    <li key={l.label}>
                      <Link href={l.href} className="footer-link" style={{ fontSize: '0.84rem', color: '#6B7280', textDecoration: 'none', transition: 'color 0.2s' }}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 4 – Support */}
              <div>
                <p style={{ color: '#F9FAFB', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>Support</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  {[
                    { label: 'Help Center', href: '/support' },
                    { label: 'Terms & Conditions', href: '/terms' },
                    { label: 'Privacy Policy', href: '/privacy' },
                    { label: 'Refund Policy', href: '/terms' },
                    { label: 'Contact Support', href: '/contact' },
                  ].map(l => (
                    <li key={l.label}>
                      <Link href={l.href} className="footer-link" style={{ fontSize: '0.84rem', color: '#6B7280', textDecoration: 'none', transition: 'color 0.2s' }}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 5 – Contact Us */}
              <div>
                <p style={{ color: '#F9FAFB', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>Contact Us</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.84rem', color: '#6B7280' }}>
                    <Phone size={14} style={{ color: 'var(--color-brand-primary)', flexShrink: 0 }} />
                    <a href="tel:+233591234567" style={{ color: 'inherit', textDecoration: 'none' }}>+233 59 123 4567</a>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.84rem', color: '#6B7280' }}>
                    <MessageCircle size={14} style={{ color: 'var(--color-brand-primary)', flexShrink: 0 }} />
                    <a href="https://wa.me/233548519420" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>+233 54 851 9420</a>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.84rem', color: '#6B7280' }}>
                    <Mail size={14} style={{ color: 'var(--color-brand-primary)', flexShrink: 0 }} />
                    <a href="mailto:support@fadigitalservices.com" style={{ color: 'inherit', textDecoration: 'none' }}>support@fadigitalservices.com</a>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'start', gap: '0.6rem', fontSize: '0.84rem', color: '#6B7280' }}>
                    <MapPin size={14} style={{ color: 'var(--color-brand-primary)', flexShrink: 0, marginTop: '2px' }} />
                    <span>Accra, Ghana</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Bottom Bar */}
            <div style={{ 
              borderTop: '1px solid rgba(255,255,255,0.06)', 
              paddingTop: '1.5rem', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              gap: '0.75rem' 
            }}>
              <span style={{ fontSize: '0.81rem', color: '#4B5563' }}>
                &copy; {new Date().getFullYear()} FA Digital. All Rights Reserved.
              </span>
              <span style={{ fontSize: '0.81rem', color: '#6B7280', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                Made with <span style={{ color: '#EF4444' }}>❤️</span> in Ghana 🇬🇭
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Live Chat Widget & Toast — visible on all public pages */}
      <LiveTransactionToast />
      <LiveChatWidget />
    </div>
  );
}
