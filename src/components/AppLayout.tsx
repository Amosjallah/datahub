'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Globe, FileText, History, Users, User, LifeBuoy, TrendingUp, Menu, Bell, Wallet,
  UserCheck, MessageSquare, FileCode, Settings, ChevronDown
} from 'lucide-react';
import Logo from './Logo';

interface AppLayoutProps {
  children: React.ReactNode;
  userRole?: 'customer' | 'agent' | 'admin' | 'super_admin';
  userName?: string;
}

export default function AppLayout({ children, userRole = 'customer', userName = 'Kwame' }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAgent = userRole === 'agent';
  const isAdmin = ['admin', 'super_admin'].includes(userRole);

  // Customer navigation
  const customerLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/buy/data', label: 'Buy data & airtime', icon: Globe },
    { href: '/buy/bills', label: 'Pay bills', icon: FileText },
    { href: '/transactions', label: 'Transactions', icon: History },
    { href: '/beneficiaries', label: 'Beneficiaries', icon: Users },
    { href: '/profile#referrals', label: 'Referrals', icon: TrendingUp },
    { href: '/become-agent', label: 'Become an agent', icon: User },
    { href: '/support', label: 'Support', icon: LifeBuoy },
    { href: '/profile', label: 'Profile & security', icon: User },
  ];

  // Agent navigation
  const agentLinks = [
    { href: '/agent/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/agent/bulk', label: 'Bulk purchase', icon: Globe },
    { href: '/agent/sales', label: 'Sales reports', icon: FileText },
    { href: '/agent/commissions', label: 'Commission & earnings', icon: TrendingUp },
    { href: '/agent/referrals', label: 'My referrals', icon: Users },
    { href: '/agent/wallet', label: 'Agent wallet', icon: Wallet },
    { href: '/support', label: 'Support', icon: LifeBuoy },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  // Admin navigation
  const adminLinks = [
    { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/agents', label: 'Agents', icon: UserCheck },
    { href: '/admin/transactions', label: 'Transactions', icon: History },
    { href: '/admin/wallets', label: 'Wallets', icon: Wallet },
    { href: '/admin/pricing', label: 'Services & pricing', icon: FileText },
    { href: '/admin/tickets', label: 'Support tickets', icon: MessageSquare },
    { href: '/admin/reports', label: 'Reports & analytics', icon: TrendingUp },
    { href: '/admin/logs', label: 'Audit logs', icon: FileCode },
    { href: '/admin/settings', label: 'System settings', icon: Settings },
  ];

  const sidebarLinks = isAdmin ? adminLinks : (isAgent ? agentLinks : customerLinks);

  // Dynamic tags
  let tagline = 'Stay connected';
  if (isAgent) tagline = 'Agent Portal';
  if (isAdmin) tagline = 'Admin Panel';

  // Topbar wallet balance widget configurations (GHC currency symbol: GH₵)
  const walletBalanceText = (isAgent || isAdmin) ? 'GH₵125,680.50' : 'GH₵25,680.50';
  const walletButtonLabel = (isAgent || isAdmin) ? 'Fund wallet' : 'Fund';
  const walletButtonLink = (isAgent || isAdmin) ? '/agent/wallet' : '/wallet/fund';

  // Bottom card configs
  let promoTitle = 'Earn more with';
  let promoSubtitle = 'FA Digital';
  let promoDesc = 'Refer friends and get rewarded.';
  let promoLink = '/profile';
  let isSystemPromo = false;

  if (isAgent) {
    promoTitle = 'Grow your business';
    promoSubtitle = '';
    promoDesc = 'Refer more people and earn higher commissions.';
    promoLink = '/agent/referrals';
  } else if (isAdmin) {
    promoTitle = 'Need help?';
    promoSubtitle = '';
    promoDesc = '';
    promoLink = '/admin/settings';
    isSystemPromo = true;
  }

  return (
    <div style={{ backgroundColor: 'var(--color-bg-base)', minHeight: '100vh', color: 'var(--color-text-primary)' }}>
      {/* Top Header Navbar */}
      <header 
        style={{
          position: 'fixed', top: 0, right: 0, left: 'var(--sidebar-width)',
          height: 'var(--topbar-height)',
          background: 'var(--color-bg-surface)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 2.5rem', zIndex: 90
        }} 
        className="topbar"
      >
        {/* Left Side: Mobile Menu Button (Hamburger) */}
        <button 
          style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', display: 'none', padding: '0.5rem' }} 
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={22} />
        </button>
        <div></div>

        {/* Right Side: Wallet Balance, Notifications, Profile Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Wallet Balance Summary */}
          <div 
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              background: '#FFFFFF', border: '1px solid var(--color-border)',
              padding: '0.35rem 0.5rem 0.35rem 0.875rem', borderRadius: 'var(--radius-md)'
            }}
          >
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Wallet balance:</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--color-text-primary)' }}>{walletBalanceText}</span>
            <Link 
              href={walletButtonLink} 
              className="btn btn-primary btn-sm" 
              style={{ padding: '0.3rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', boxShadow: 'none', backgroundColor: 'var(--color-brand-primary)', color: '#FFF' }}
            >
              {walletButtonLabel}
            </Link>
          </div>

          {/* Notification Bell */}
          <button 
            style={{
              background: 'none', border: 'none', color: 'var(--color-text-muted)',
              cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', padding: '0.25rem'
            }} 
            title="Notifications"
          >
            <Bell size={20} />
            <span 
              style={{
                position: 'absolute', top: '2px', right: '2px',
                width: '6px', height: '6px', backgroundColor: 'var(--color-brand-primary)',
                borderRadius: '50%'
              }}
            ></span>
          </button>

          {/* Profile Initials Bubble & Role label */}
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
            onClick={() => router.push(isAdmin ? '/admin/settings' : '/profile')}
          >
            <div 
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'var(--color-brand-subtle)', border: '1.5px solid var(--color-brand-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.825rem', color: 'var(--color-brand-primary)'
              }}
            >
              AA
            </div>
            {isAdmin && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                Admin <ChevronDown size={14} style={{ opacity: 0.6 }} />
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar mobile overlay backdrop */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} 
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={{ background: 'var(--color-bg-surface)', borderRight: '1px solid var(--color-border)' }}>
        {/* Vector SVG Logo Component */}
        <div 
          className="sidebar-logo" 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.75rem', 
            padding: '0 1.25rem 1.75rem', borderBottom: '1px solid var(--color-border)', 
            marginBottom: '1.25rem' 
          }}
        >
          <Logo size={32} colorMode="light" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 800, fontSize: '1.18rem', letterSpacing: '-0.02em', color: 'var(--color-text-primary)', lineHeight: '1.2' }}>FA Digital</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', lineHeight: '1', marginTop: '0.15rem' }}>{tagline}</span>
          </div>
        </div>

        {/* Sidebar navigation links list */}
        <nav className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Status/Referral Widget */}
        <div style={{ padding: '0 0.75rem', marginTop: 'auto', marginBottom: '1.25rem' }}>
          <div 
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.1rem 1rem',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-brand-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{promoTitle}</div>
                {promoSubtitle && <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{promoSubtitle}</div>}
                
                {isSystemPromo && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }}></span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>System operational</span>
                  </div>
                )}
              </div>
              {/* Small signal bar chart icon on right */}
              <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '14px', opacity: 0.6 }}>
                <div style={{ width: '3px', height: '4px', backgroundColor: 'var(--color-brand-primary)' }}></div>
                <div style={{ width: '3px', height: '7px', backgroundColor: 'var(--color-brand-primary)' }}></div>
                <div style={{ width: '3px', height: '10px', backgroundColor: 'var(--color-brand-primary)' }}></div>
                <div style={{ width: '3px', height: '14px', backgroundColor: 'var(--color-brand-primary)' }}></div>
              </div>
            </div>
            {!isSystemPromo && (
              <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '1rem', lineHeight: '1.4' }}>
                {promoDesc}
              </p>
            )}
            <Link 
              href={promoLink} 
              className="btn btn-primary btn-sm btn-full" 
              style={{ 
                padding: '0.45rem', 
                fontSize: '0.75rem', 
                borderRadius: '6px', 
                boxShadow: 'none',
                backgroundColor: 'var(--color-brand-primary)',
                color: '#FFF',
                marginTop: isSystemPromo ? '0.75rem' : '0' 
              }}
            >
              {isSystemPromo ? 'View system status' : 'Refer now \u2192'}
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content" style={{ paddingTop: 'calc(var(--topbar-height) + 2rem)' }}>
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="bottom-nav">
        {sidebarLinks.slice(0, 5).map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} className={`bottom-nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={22} />
              {link.label.split(' ')[0]}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
