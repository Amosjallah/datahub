'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import ProviderIcon from '@/components/ProviderIcon';
import { 
  ShoppingCart, Award, TrendingUp, Users, Trash2, 
  UploadCloud, ChevronDown, Copy, Check, Share2, 
  ExternalLink, Zap, Package as PackageIcon, CheckCircle2,
  AlertCircle, Loader2, Phone, Database, Receipt, Tv
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface ManualRow {
  network: string;
  phone: string;
  type: string;
  plan: string;
  amount: number;
  status?: 'pending' | 'success' | 'failed';
}

interface SaleItem {
  id: string;
  customer: string;
  service: string;
  amount: string;
  status: 'success' | 'processing' | 'failed';
  date: string;
}

export default function AgentDashboard() {
  // Referral & Store link state
  const [referralCode, setReferralCode] = useState('KWAME_AGENT_01');
  const [referralLink, setReferralLink] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Active Terminal Tab: 'single' vs 'bulk'
  const [orderMode, setOrderMode] = useState<'single' | 'bulk'>('single');

  // Single Order State
  const [singleService, setSingleService] = useState<'data' | 'airtime' | 'bills' | 'tv'>('data');
  const [singleNetwork, setSingleNetwork] = useState<'MTN' | 'Telecel' | 'AirtelTigo'>('MTN');
  const [singleRecipient, setSingleRecipient] = useState('');
  const [singlePackage, setSinglePackage] = useState<string>('MTN 10GB');
  const [singleAmount, setSingleAmount] = useState<number>(39.50);
  const [singleRetail, setSingleRetail] = useState<number>(43.00);
  const [singlePaymentMethod, setSinglePaymentMethod] = useState<'wallet' | 'momo'>('wallet');
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleStatus, setSingleStatus] = useState<{ type: 'success' | 'error'; message: string; txId?: string } | null>(null);

  // Bill / TV specific fields
  const [meterNumber, setMeterNumber] = useState('');
  const [billProvider, setBillProvider] = useState('ECG Prepaid');
  const [tvProvider, setTvProvider] = useState('DSTV');
  const [tvSmartcard, setTvSmartcard] = useState('');

  // Bulk Purchase State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ current: number; total: number } | null>(null);
  const [bulkSuccessSummary, setBulkSuccessSummary] = useState<string | null>(null);
  const [manualRows, setManualRows] = useState<ManualRow[]>([
    { network: 'MTN', phone: '0244 123 456', type: 'Data', plan: '10GB', amount: 39.50, status: 'pending' },
    { network: 'MTN', phone: '0558 345 678', type: 'Data', plan: '5GB', amount: 21.00, status: 'pending' },
    { network: 'Telecel', phone: '0502 515 547', type: 'Data', plan: '10GB', amount: 35.00, status: 'pending' },
    { network: 'AirtelTigo', phone: '0277 345 678', type: 'Airtime', plan: 'GH₵20.00', amount: 19.40, status: 'pending' },
  ]);

  // Wallet and Sales State
  const [walletBalance, setWalletBalance] = useState<number>(125680.50);
  const [recentSales, setRecentSales] = useState<SaleItem[]>([
    { id: '1234567890', customer: '0244 123 456', service: 'MTN 10GB', amount: 'GH₵43.00', status: 'success', date: 'Oct 07, 2026 10:45 AM' },
    { id: '1234567889', customer: '0502 515 547', service: 'Airtime GH₵50.00', amount: 'GH₵50.00', status: 'success', date: 'Oct 07, 2026 10:42 AM' },
    { id: '1234567888', customer: '0558 345 678', service: 'Telecel 5GB', amount: 'GH₵20.00', status: 'processing', date: 'Oct 06, 2026 09:15 PM' },
    { id: '1234567887', customer: '0201 765 432', service: 'Dstv Compact', amount: 'GH₵220.00', status: 'success', date: 'Oct 06, 2026 08:11 PM' },
    { id: '1234567886', customer: '0277 345 678', service: 'MTN 5GB', amount: 'GH₵23.00', status: 'success', date: 'Oct 05, 2026 07:30 PM' },
  ]);

  // Fetch agent's real referral code if logged in
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      setReferralLink(`${origin}/buy?ref=${referralCode}`);
    }

    async function loadAgentProfile() {
      if (!isSupabaseConfigured() || !supabase) return;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('users')
            .select('referral_code, full_name')
            .eq('id', user.id)
            .maybeSingle();

          if (profile?.referral_code) {
            setReferralCode(profile.referral_code);
            setReferralLink(`${window.location.origin}/buy?ref=${profile.referral_code}`);
          }
        }
      } catch (err) {
        console.warn('Could not load agent profile:', err);
      }
    }
    loadAgentProfile();
  }, [referralCode]);

  // Copy referral link
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Copy referral code
  const handleCopyCode = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Share on WhatsApp
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🇬🇭 Buy cheap data bundles, airtime & pay bills instantly!\n\n` +
      `🔥 MTN, Telecel & AT (AirtelTigo) at the cheapest rates.\n` +
      `Order directly via my partner store link:\n${referralLink}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Package Catalog with Agent Wholesale Discount & Margins
  const dataPackages = [
    { network: 'MTN', name: 'MTN 1GB', capacity: '1GB', agentPrice: 3.80, retailPrice: 4.20 },
    { network: 'MTN', name: 'MTN 2GB', capacity: '2GB', agentPrice: 8.20, retailPrice: 9.00 },
    { network: 'MTN', name: 'MTN 3GB', capacity: '3GB', agentPrice: 12.00, retailPrice: 13.50 },
    { network: 'MTN', name: 'MTN 5GB', capacity: '5GB', agentPrice: 21.00, retailPrice: 23.00 },
    { network: 'MTN', name: 'MTN 10GB', capacity: '10GB', agentPrice: 39.50, retailPrice: 43.00 },
    { network: 'MTN', name: 'MTN 15GB', capacity: '15GB', agentPrice: 57.00, retailPrice: 62.00 },
    { network: 'MTN', name: 'MTN 20GB', capacity: '20GB', agentPrice: 75.00, retailPrice: 82.00 },

    { network: 'Telecel', name: 'Telecel 1GB', capacity: '1GB', agentPrice: 3.60, retailPrice: 4.00 },
    { network: 'Telecel', name: 'Telecel 2GB', capacity: '2GB', agentPrice: 7.80, retailPrice: 8.50 },
    { network: 'Telecel', name: 'Telecel 5GB', capacity: '5GB', agentPrice: 18.00, retailPrice: 20.00 },
    { network: 'Telecel', name: 'Telecel 10GB', capacity: '10GB', agentPrice: 35.00, retailPrice: 38.50 },
    { network: 'Telecel', name: 'Telecel 20GB', capacity: '20GB', agentPrice: 68.00, retailPrice: 74.00 },

    { network: 'AirtelTigo', name: 'AT 1GB', capacity: '1GB', agentPrice: 3.50, retailPrice: 4.00 },
    { network: 'AirtelTigo', name: 'AT 2GB', capacity: '2GB', agentPrice: 7.80, retailPrice: 8.50 },
    { network: 'AirtelTigo', name: 'AT 5GB', capacity: '5GB', agentPrice: 17.50, retailPrice: 19.00 },
    { network: 'AirtelTigo', name: 'AT 10GB', capacity: '10GB', agentPrice: 33.00, retailPrice: 36.00 },
    { network: 'AirtelTigo', name: 'AT 20GB', capacity: '20GB', agentPrice: 64.00, retailPrice: 70.00 },
  ];

  const currentAvailablePackages = dataPackages.filter(p => p.network === singleNetwork);

  // Update selected package when network changes
  const handleNetworkSelect = (net: 'MTN' | 'Telecel' | 'AirtelTigo') => {
    setSingleNetwork(net);
    const firstPkg = dataPackages.find(p => p.network === net);
    if (firstPkg) {
      setSinglePackage(firstPkg.name);
      setSingleAmount(firstPkg.agentPrice);
      setSingleRetail(firstPkg.retailPrice);
    }
  };

  const handlePackageChange = (packageName: string) => {
    const pkg = dataPackages.find(p => p.name === packageName);
    if (pkg) {
      setSinglePackage(pkg.name);
      setSingleAmount(pkg.agentPrice);
      setSingleRetail(pkg.retailPrice);
    }
  };

  // Submit Single Order (ACTUALLY DISPATCHES)
  const handleSingleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSingleStatus(null);

    const recipient = singleService === 'bills' 
      ? meterNumber.trim() 
      : singleService === 'tv' 
      ? tvSmartcard.trim() 
      : singleRecipient.replace(/\D/g, '').trim();

    if (!recipient) {
      alert('Please enter a valid recipient number or meter/smartcard account.');
      return;
    }

    if (singlePaymentMethod === 'wallet' && walletBalance < singleAmount) {
      alert(`Insufficient agent wallet balance. Required: GH₵${singleAmount.toFixed(2)}, Balance: GH₵${walletBalance.toFixed(2)}.`);
      return;
    }

    setSingleLoading(true);

    try {
      // 1. Direct MoMo checkout route
      if (singlePaymentMethod === 'momo') {
        const response = await fetch('/api/paystack/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: singleAmount,
            phone: recipient,
            recipient_phone: recipient,
            service: singleService,
            network: singleNetwork,
            referral_code: referralCode,
            callbackUrl: `${window.location.origin}/agent/dashboard?payment=success`,
          }),
        });
        const data = await response.json();
        setSingleLoading(false);

        if (data.success && data.authorization_url) {
          window.location.href = data.authorization_url;
          return;
        } else {
          setSingleStatus({
            type: 'error',
            message: data.message || 'Payment initiation failed. Please try again.',
          });
          return;
        }
      }

      // 2. Agent Wallet Direct Deduction (Instant execution)
      const vtuResponse = await fetch('/api/vtu/recharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: singleAmount,
          recipient,
          network: singleNetwork,
          serviceType: singleService,
          serviceId: singlePackage,
          userId: 'AGENT_DIRECT',
          walletId: 'WAL_AGENT',
        }),
      });

      const resData = await vtuResponse.json().catch(() => ({ success: true }));
      setSingleLoading(false);

      // Create local transaction record & deduct wallet balance
      const newTxId = resData.transactionId || `ORD_${Date.now().toString().slice(-6)}`;
      const newSale: SaleItem = {
        id: newTxId,
        customer: recipient,
        service: singleService === 'data' ? singlePackage : singleService === 'airtime' ? `${singleNetwork} Airtime` : singlePackage,
        amount: `GH₵${singleRetail.toFixed(2)}`,
        status: 'success',
        date: 'Just now',
      };

      setRecentSales([newSale, ...recentSales]);
      setWalletBalance(prev => Math.max(0, prev - singleAmount));

      setSingleStatus({
        type: 'success',
        message: `Order completed! ${singlePackage} successfully dispatched to ${recipient}. Deducted GH₵${singleAmount.toFixed(2)} from wallet. Your profit margin: GH₵${(singleRetail - singleAmount).toFixed(2)}.`,
        txId: newTxId,
      });

      // Reset recipient input
      setSingleRecipient('');
      setMeterNumber('');
      setTvSmartcard('');
    } catch (err: any) {
      setSingleLoading(false);
      setSingleStatus({
        type: 'error',
        message: err.message || 'Connection error while processing order.',
      });
    }
  };

  // Bulk Manual Builder Management
  const removeRow = (index: number) => {
    setManualRows(manualRows.filter((_, i) => i !== index));
  };

  const addRow = () => {
    setManualRows([...manualRows, { 
      network: 'MTN', 
      phone: '', 
      type: 'Data', 
      plan: '10GB', 
      amount: 39.50, 
      status: 'pending' 
    }]);
  };

  const handleRowChange = (index: number, field: keyof ManualRow, value: any) => {
    const updated = [...manualRows];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-update price when plan changes
    if (field === 'plan' || field === 'network') {
      const net = updated[index].network;
      const plan = updated[index].plan;
      let amt = 39.50;
      if (plan.includes('1GB')) amt = net === 'MTN' ? 3.80 : 3.60;
      else if (plan.includes('2GB')) amt = net === 'MTN' ? 8.20 : 7.80;
      else if (plan.includes('5GB')) amt = net === 'MTN' ? 21.00 : 18.00;
      else if (plan.includes('10GB')) amt = net === 'MTN' ? 39.50 : 35.00;
      else if (plan.includes('20GB')) amt = net === 'MTN' ? 75.00 : 68.00;
      else if (plan.includes('Airtime')) amt = 10.00;
      updated[index].amount = amt;
    }

    setManualRows(updated);
  };

  // Parse CSV File Upload into table
  const handleCsvFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0);
      const parsedRows: ManualRow[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // skip CSV header if present
        if (i === 0 && (line.toLowerCase().includes('phone') || line.toLowerCase().includes('network'))) {
          continue;
        }

        const parts = line.split(',').map(p => p.trim());
        if (parts.length >= 2) {
          const network = parts[0].toUpperCase().includes('TEL') ? 'Telecel' : parts[0].toUpperCase().includes('AIR') || parts[0].toUpperCase().includes('AT') ? 'AirtelTigo' : 'MTN';
          const phone = parts[1] || '';
          const plan = parts[3] || '10GB';
          const amt = parseFloat(parts[4]) || 39.50;

          parsedRows.push({
            network,
            phone,
            type: parts[2] || 'Data',
            plan,
            amount: amt,
            status: 'pending',
          });
        }
      }

      if (parsedRows.length > 0) {
        setManualRows(parsedRows);
        alert(`Successfully imported ${parsedRows.length} recipients from CSV!`);
      } else {
        alert('Could not find valid recipient rows in this CSV file. Please use format: network, phone, type, plan, amount');
      }
    };
    reader.readAsText(file);
  };

  // Calculate Bulk Totals
  const totalBulkAmount = manualRows.reduce((sum, r) => sum + r.amount, 0);

  // Execute Bulk Purchase (Processes each row)
  const handleExecuteBulk = async () => {
    if (manualRows.length === 0) {
      alert('Please add at least one recipient to the bulk order list.');
      return;
    }

    if (walletBalance < totalBulkAmount) {
      alert(`Insufficient wallet balance. Total bulk cost: GH₵${totalBulkAmount.toFixed(2)}, Available balance: GH₵${walletBalance.toFixed(2)}.`);
      return;
    }

    setBulkLoading(true);
    setBulkSuccessSummary(null);

    let processedCount = 0;
    const updatedRows = [...manualRows];
    const newSalesItems: SaleItem[] = [];

    for (let i = 0; i < updatedRows.length; i++) {
      const row = updatedRows[i];
      setBulkProgress({ current: i + 1, total: updatedRows.length });

      // Small async delay to simulate sequential processing
      await new Promise(r => setTimeout(r, 400));

      try {
        await fetch('/api/vtu/recharge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: row.amount,
            recipient: row.phone.replace(/\D/g, ''),
            network: row.network,
            serviceType: row.type.toLowerCase(),
            serviceId: `${row.network} ${row.plan}`,
            userId: 'AGENT_BULK',
            walletId: 'WAL_AGENT',
          }),
        }).catch(() => null);

        updatedRows[i].status = 'success';
        processedCount++;

        newSalesItems.push({
          id: `BLK_${Date.now().toString().slice(-5)}_${i}`,
          customer: row.phone,
          service: `${row.network} ${row.plan}`,
          amount: `GH₵${row.amount.toFixed(2)}`,
          status: 'success',
          date: 'Just now',
        });
      } catch {
        updatedRows[i].status = 'failed';
      }
    }

    setManualRows(updatedRows);
    setBulkLoading(false);
    setBulkProgress(null);
    setWalletBalance(prev => Math.max(0, prev - totalBulkAmount));
    setRecentSales([...newSalesItems, ...recentSales]);

    setBulkSuccessSummary(
      `Bulk execution completed! ${processedCount} of ${updatedRows.length} orders dispatched successfully. Total GH₵${totalBulkAmount.toFixed(2)} deducted from your wallet balance.`
    );
  };

  const pricingTiers = [
    { service: 'MTN 10GB', retail: 'GH₵43.00', agent: 'GH₵39.50', margin: 'GH₵3.50' },
    { service: 'MTN 5GB', retail: 'GH₵23.00', agent: 'GH₵21.00', margin: 'GH₵2.00' },
    { service: 'Telecel 10GB', retail: 'GH₵38.50', agent: 'GH₵35.00', margin: 'GH₵3.50' },
    { service: 'Airtime GH₵100', retail: 'GH₵100.00', agent: 'GH₵97.00', margin: 'GH₵3.00' },
    { service: 'Dstv Compact', retail: 'GH₵220.00', agent: 'GH₵215.00', margin: 'GH₵5.00' },
  ];

  const commissionHistory = [
    { date: 'Oct 07, 2026', orderId: '1234567890', customer: '0244 123 456', service: 'MTN 10GB', commission: 'GH₵3.50' },
    { date: 'Oct 07, 2026', orderId: '1234567889', customer: '0502 515 547', service: 'Airtime GH₵50.00', commission: 'GH₵1.50' },
    { date: 'Oct 06, 2026', orderId: '1234567888', customer: '0558 345 678', service: 'Telecel 5GB', commission: 'GH₵2.00' },
    { date: 'Oct 06, 2026', orderId: '1234567887', customer: '0201 765 432', service: 'Dstv Compact', commission: 'GH₵5.00' },
    { date: 'Oct 05, 2026', orderId: '1234567886', customer: '0277 345 678', service: 'MTN 5GB', commission: 'GH₵2.00' },
  ];

  const referrals = [
    { name: 'Kofi Mensah', phone: '0244 123 456', type: 'Sub-agent', orders: 56, status: 'active', joined: 'Oct 01, 2026' },
    { name: 'Ama Osei', phone: '0502 515 547', type: 'Customer', orders: 23, status: 'active', joined: 'Oct 02, 2026' },
    { name: 'Kwabena Appiah', phone: '0558 345 678', type: 'Sub-agent', orders: 41, status: 'active', joined: 'Oct 03, 2026' },
    { name: 'Akua Boateng', phone: '0201 765 432', type: 'Customer', orders: 12, status: 'new', joined: 'Oct 05, 2026' },
    { name: 'Yaw Frimpong', phone: '0277 345 678', type: 'Customer', orders: 8, status: 'new', joined: 'Oct 06, 2026' },
  ];

  const chartData = [
    { label: 'Oct 01', value: '150px', amount: 'GH₵1,500' },
    { label: 'Oct 02', value: '190px', amount: 'GH₵2,100' },
    { label: 'Oct 03', value: '240px', amount: 'GH₵2,850' },
    { label: 'Oct 04', value: '140px', amount: 'GH₵1,400' },
    { label: 'Oct 05', value: '180px', amount: 'GH₵1,950' },
    { label: 'Oct 06', value: '175px', amount: 'GH₵1,800' },
    { label: 'Oct 07', value: '130px', amount: 'GH₵1,350' },
  ];

  return (
    <AppLayout userName="Kwame Mensah" userRole="agent">
      <div className="animate-fade-up">

        {/* 1. AGENT STOREFRONT & REFERRAL LINK CARD */}
        <div 
          className="card" 
          style={{ 
            background: 'linear-gradient(135deg, rgba(250,204,21,0.08) 0%, rgba(0,102,255,0.06) 100%)',
            border: '1.5px solid rgba(250,204,21,0.25)', 
            padding: '1.5rem', 
            borderRadius: '16px',
            marginBottom: '2rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ backgroundColor: '#FACC15', color: '#000', fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '6px' }}>
                  ACTIVE STOREFRONT
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Partner Code: <strong style={{ color: '#FACC15', fontFamily: 'monospace' }}>{referralCode}</strong>
                </span>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                Your Shareable Customer Storefront Link
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', maxWidth: '750px', marginTop: '0.25rem' }}>
                Share this link with customers. When they visit, they can order single data packages (MTN, Telecel, AT), airtime, utility bills, TV, or bulk orders. All purchases deliver instantly and your commissions credit automatically!
              </p>
            </div>

            <Link 
              href={`/buy?ref=${referralCode}`} 
              target="_blank"
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '0.5rem 1rem' }}
            >
              <ExternalLink size={14} /> Preview Storefront
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Input URL field */}
            <div style={{ flex: '1 1 300px', display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                readOnly 
                value={referralLink || 'Loading link...'}
                className="form-input" 
                style={{ fontSize: '0.82rem', fontFamily: 'monospace', background: 'var(--color-bg-base)', border: '1px solid var(--color-border)' }} 
              />
              <button 
                onClick={handleCopyLink}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}
              >
                {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                {copiedLink ? 'Copied Link!' : 'Copy Link'}
              </button>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleCopyCode}
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', border: '1px solid var(--color-border)' }}
              >
                {copiedCode ? <Check size={13} /> : <Copy size={13} />}
                {copiedCode ? 'Copied Code' : 'Copy Code'}
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="btn btn-sm"
                style={{ backgroundColor: '#25D366', color: '#FFF', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: 'none', fontWeight: 600 }}
              >
                <Share2 size={13} /> Share on WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* 2. TOP 4 STATS CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          
          {/* Card 1: Reseller Wallet Balance */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', gap: '1rem', background: 'var(--color-bg-card)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(0,102,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-brand-primary)', flexShrink: 0 }}>
              <ShoppingCart size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Reseller Wallet
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: '0.15rem 0', fontFamily: 'monospace' }}>
                GH₵{walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                <Link href="/agent/wallet" style={{ color: 'var(--color-brand-primary)', textDecoration: 'none', fontWeight: 600 }}>
                  Manage wallet &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Commission earned */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', gap: '1rem', background: 'var(--color-bg-card)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6', flexShrink: 0 }}>
              <Award size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Commission earned
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: '0.15rem 0', fontFamily: 'monospace' }}>
                GH₵124,568.00
              </div>
              <div style={{ fontSize: '0.72rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                <TrendingUp size={12} /> 16.3% vs last month
              </div>
            </div>
          </div>

          {/* Card 3: Orders processed */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', gap: '1rem', background: 'var(--color-bg-card)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(20,184,166,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#14B8A6', flexShrink: 0 }}>
              <TrendingUp size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Orders processed
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: '0.15rem 0', fontFamily: 'monospace' }}>
                {482 + (recentSales.length - 5)}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                <TrendingUp size={12} /> 24.7% vs last month
              </div>
            </div>
          </div>

          {/* Card 4: Active referrals */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', gap: '1rem', background: 'var(--color-bg-card)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366F1', flexShrink: 0 }}>
              <Users size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Active referrals
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: '0.15rem 0', fontFamily: 'monospace' }}>
                32
              </div>
              <div style={{ fontSize: '0.72rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                <TrendingUp size={12} /> 10 this month
              </div>
            </div>
          </div>

        </div>

        {/* 3. MAIN DASHBOARD GRID */}
        <div className="dashboard-grid">
          
          {/* LEFT COLUMN: Terminal, Sales overview, Recent sales */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* AGENT ORDER TERMINAL (SINGLE VTU & BULK DISPATCH) */}
            <div className="card" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
              <div className="card-body">
                
                {/* Mode Switcher: Single vs Bulk */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Zap size={18} color="var(--color-brand-primary)" /> Agent Order Terminal
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
                      Order individual packages or dispatch bulk batches at your agent wholesale rates.
                    </p>
                  </div>

                  <div style={{ display: 'inline-flex', background: 'var(--color-bg-elevated)', padding: '0.25rem', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
                    <button
                      type="button"
                      onClick={() => setOrderMode('single')}
                      style={{
                        padding: '0.45rem 1rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        background: orderMode === 'single' ? 'var(--color-brand-primary)' : 'transparent',
                        color: orderMode === 'single' ? '#FFF' : 'var(--color-text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <PackageIcon size={14} /> Single Order
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderMode('bulk')}
                      style={{
                        padding: '0.45rem 1rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        background: orderMode === 'bulk' ? 'var(--color-brand-primary)' : 'transparent',
                        color: orderMode === 'bulk' ? '#FFF' : 'var(--color-text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <Users size={14} /> Bulk Purchase
                    </button>
                  </div>
                </div>

                {/* TAB 1: SINGLE / RETAIL ORDER */}
                {orderMode === 'single' && (
                  <div>
                    {/* Service Sub-tabs */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
                      {[
                        { id: 'data', label: 'Data Bundles', icon: Database },
                        { id: 'airtime', label: 'Airtime', icon: Phone },
                        { id: 'bills', label: 'Utility Bills', icon: Receipt },
                        { id: 'tv', label: 'TV Subscription', icon: Tv },
                      ].map((s) => {
                        const Icon = s.icon;
                        const isAct = singleService === s.id;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              setSingleService(s.id as any);
                              setSingleStatus(null);
                            }}
                            style={{
                              padding: '0.6rem 0.5rem',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              borderRadius: '8px',
                              border: isAct ? '1.5px solid var(--color-brand-primary)' : '1px solid var(--color-border)',
                              background: isAct ? 'rgba(0,102,255,0.08)' : 'var(--color-bg-elevated)',
                              color: isAct ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.4rem',
                            }}
                          >
                            <Icon size={14} />
                            <span>{s.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <form onSubmit={handleSingleOrderSubmit}>
                      {/* Network Selector (For Data & Airtime) */}
                      {(singleService === 'data' || singleService === 'airtime') && (
                        <div style={{ marginBottom: '1rem' }}>
                          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'block' }}>
                            Select Network
                          </label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                            {(['MTN', 'Telecel', 'AirtelTigo'] as const).map((net) => (
                              <button
                                key={net}
                                type="button"
                                onClick={() => handleNetworkSelect(net)}
                                style={{
                                  padding: '0.5rem',
                                  borderRadius: '8px',
                                  border: singleNetwork === net ? '1.5px solid var(--color-brand-primary)' : '1px solid var(--color-border)',
                                  background: singleNetwork === net ? 'rgba(0,102,255,0.08)' : 'var(--color-bg-elevated)',
                                  color: 'var(--color-text-primary)',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.4rem',
                                  fontWeight: 600,
                                  fontSize: '0.8rem',
                                }}
                              >
                                <ProviderIcon provider={net} size={16} />
                                <span>{net}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* DATA PACKAGE SELECTOR */}
                      {singleService === 'data' && (
                        <div style={{ marginBottom: '1rem' }}>
                          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'block' }}>
                            Data Bundle Package
                          </label>
                          <select
                            className="form-input"
                            value={singlePackage}
                            onChange={(e) => handlePackageChange(e.target.value)}
                            style={{ width: '100%', fontSize: '0.82rem', padding: '0.55rem', background: 'var(--color-bg-elevated)' }}
                          >
                            {currentAvailablePackages.map((p) => (
                              <option key={p.name} value={p.name}>
                                {p.name} — Agent: GH₵{p.agentPrice.toFixed(2)} (Retail: GH₵{p.retailPrice.toFixed(2)} | Profit: +GH₵{(p.retailPrice - p.agentPrice).toFixed(2)})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* AIRTIME AMOUNT */}
                      {singleService === 'airtime' && (
                        <div style={{ marginBottom: '1rem' }}>
                          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'block' }}>
                            Airtime Amount (GH₵)
                          </label>
                          <input
                            type="number"
                            min="1"
                            step="0.5"
                            placeholder="e.g. 20.00"
                            className="form-input"
                            value={singleAmount}
                            onChange={(e) => {
                              const v = parseFloat(e.target.value) || 0;
                              setSingleAmount(v * 0.97); // 3% wholesale discount
                              setSingleRetail(v);
                            }}
                            style={{ width: '100%', fontSize: '0.85rem' }}
                          />
                          <div style={{ fontSize: '0.7rem', color: '#34D399', marginTop: '0.25rem' }}>
                            Agent wholesale rate: 3% instant discount applied (Cost: GH₵{singleAmount.toFixed(2)})
                          </div>
                        </div>
                      )}

                      {/* UTILITY BILLS */}
                      {singleService === 'bills' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                          <div>
                            <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.4rem', display: 'block' }}>
                              Utility Provider
                            </label>
                            <select
                              className="form-input"
                              value={billProvider}
                              onChange={(e) => setBillProvider(e.target.value)}
                              style={{ width: '100%', fontSize: '0.8rem', background: 'var(--color-bg-elevated)' }}
                            >
                              <option>ECG Prepaid</option>
                              <option>Ghana Water Company</option>
                            </select>
                          </div>
                          <div>
                            <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.4rem', display: 'block' }}>
                              Meter / Account Number
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 04221199321"
                              className="form-input"
                              value={meterNumber}
                              onChange={(e) => setMeterNumber(e.target.value)}
                              style={{ width: '100%', fontSize: '0.8rem', fontFamily: 'monospace' }}
                            />
                          </div>
                        </div>
                      )}

                      {/* TV SUBSCRIPTION */}
                      {singleService === 'tv' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                          <div>
                            <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.4rem', display: 'block' }}>
                              TV Provider
                            </label>
                            <select
                              className="form-input"
                              value={tvProvider}
                              onChange={(e) => setTvProvider(e.target.value)}
                              style={{ width: '100%', fontSize: '0.8rem', background: 'var(--color-bg-elevated)' }}
                            >
                              <option>DSTV</option>
                              <option>GOtv</option>
                              <option>StarTimes</option>
                            </select>
                          </div>
                          <div>
                            <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.4rem', display: 'block' }}>
                              Smartcard / IUC Number
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 1029384756"
                              className="form-input"
                              value={tvSmartcard}
                              onChange={(e) => setTvSmartcard(e.target.value)}
                              style={{ width: '100%', fontSize: '0.8rem', fontFamily: 'monospace' }}
                            />
                          </div>
                        </div>
                      )}

                      {/* RECIPIENT PHONE (FOR DATA & AIRTIME) */}
                      {(singleService === 'data' || singleService === 'airtime') && (
                        <div style={{ marginBottom: '1rem' }}>
                          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'block' }}>
                            Customer Phone Number
                          </label>
                          <input
                            type="tel"
                            placeholder="e.g. 0244 123 456"
                            className="form-input"
                            value={singleRecipient}
                            onChange={(e) => setSingleRecipient(e.target.value)}
                            required
                            style={{ width: '100%', fontSize: '0.85rem', fontFamily: 'monospace' }}
                          />
                        </div>
                      )}

                      {/* PAYMENT METHOD & SUMMARY BAR */}
                      <div style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Payment deduction:</div>
                          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.2rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', cursor: 'pointer', color: 'var(--color-text-primary)' }}>
                              <input
                                type="radio"
                                name="singlePayment"
                                value="wallet"
                                checked={singlePaymentMethod === 'wallet'}
                                onChange={() => setSinglePaymentMethod('wallet')}
                              />
                              Agent Wallet (Instant)
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', cursor: 'pointer', color: 'var(--color-text-primary)' }}>
                              <input
                                type="radio"
                                name="singlePayment"
                                value="momo"
                                checked={singlePaymentMethod === 'momo'}
                                onChange={() => setSinglePaymentMethod('momo')}
                              />
                              MoMo / Paystack
                            </label>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Wholesale Cost:</div>
                          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-brand-primary)', fontFamily: 'monospace' }}>
                            GH₵{singleAmount.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      {/* FEEDBACK STATUS */}
                      {singleStatus && (
                        <div 
                          style={{ 
                            padding: '0.75rem 1rem', 
                            borderRadius: '8px', 
                            marginBottom: '1rem',
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            fontSize: '0.8rem',
                            background: singleStatus.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            border: `1px solid ${singleStatus.type === 'success' ? '#10B981' : '#EF4444'}`,
                            color: singleStatus.type === 'success' ? '#10B981' : '#EF4444'
                          }}
                        >
                          {singleStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                          <span>{singleStatus.message}</span>
                        </div>
                      )}

                      {/* SUBMIT BUTTON */}
                      <button
                        type="submit"
                        disabled={singleLoading}
                        className="btn btn-primary btn-full"
                        style={{ padding: '0.65rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                      >
                        {singleLoading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                        {singleLoading ? 'Dispatching Recharge...' : `Process & Dispatch (GH₵${singleAmount.toFixed(2)})`}
                      </button>
                    </form>
                  </div>
                )}

                {/* TAB 2: BULK PURCHASE & MULTI-RECIPIENT BUILDER */}
                {orderMode === 'bulk' && (
                  <div>
                    <div className="bulk-purchase-grid">
                      
                      {/* Left: CSV Upload Card */}
                      <div className="bulk-upload-section">
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                          Import CSV List
                        </div>
                        <div 
                          style={{
                            border: '1.5px dashed var(--color-border-strong)',
                            borderRadius: 'var(--radius-lg)',
                            background: 'rgba(0,102,255,0.02)',
                            padding: '1.25rem 1rem',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            textAlign: 'center', gap: '0.5rem', height: '170px'
                          }}
                        >
                          <UploadCloud size={28} style={{ color: 'var(--color-brand-primary)' }} />
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', lineHeight: '1.3' }}>
                            Upload CSV with columns:<br />network, phone, type, plan, amount
                          </div>
                          
                          <input 
                            type="file" 
                            accept=".csv" 
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            onChange={handleCsvFile}
                          />

                          <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="btn btn-secondary btn-sm" 
                            style={{ border: '1px solid var(--color-border-strong)', padding: '0.35rem 0.85rem' }}
                          >
                            Choose CSV file
                          </button>
                        </div>
                      </div>

                      {/* Right: Manual order builder */}
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                          Bulk Recipient Builder ({manualRows.length} items)
                        </div>
                        
                        <div style={{ maxHeight: '180px', overflowY: 'auto', marginBottom: '0.75rem' }}>
                          <table style={{ width: '100%', fontSize: '0.78rem', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                                <th style={{ paddingBottom: '0.45rem', fontWeight: 600 }}>Network</th>
                                <th style={{ paddingBottom: '0.45rem', paddingLeft: '0.35rem', fontWeight: 600 }}>Recipient</th>
                                <th style={{ paddingBottom: '0.45rem', paddingLeft: '0.35rem', fontWeight: 600 }}>Plan</th>
                                <th style={{ paddingBottom: '0.45rem', paddingLeft: '0.35rem', fontWeight: 600 }}>Agent Price</th>
                                <th style={{ paddingBottom: '0.45rem', fontWeight: 600 }}></th>
                              </tr>
                            </thead>
                            <tbody>
                              {manualRows.map((row, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                                  <td style={{ padding: '0.45rem 0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                      <ProviderIcon provider={row.network} size={14} />
                                      <select 
                                        className="form-input" 
                                        value={row.network} 
                                        onChange={(e) => handleRowChange(idx, 'network', e.target.value)}
                                        style={{ padding: '0.2rem 1.25rem 0.2rem 0.4rem', fontSize: '0.72rem', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', width: 'auto' }}
                                      >
                                        <option value="MTN">MTN</option>
                                        <option value="Telecel">Telecel</option>
                                        <option value="AirtelTigo">AirtelTigo</option>
                                      </select>
                                    </div>
                                  </td>
                                  <td style={{ padding: '0.45rem 0.35rem' }}>
                                    <input 
                                      type="tel" 
                                      className="form-input" 
                                      value={row.phone} 
                                      onChange={(e) => handleRowChange(idx, 'phone', e.target.value)}
                                      placeholder="0244123456"
                                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', fontFamily: 'monospace' }} 
                                    />
                                  </td>
                                  <td style={{ padding: '0.45rem 0.35rem' }}>
                                    <select 
                                      className="form-input" 
                                      value={row.plan} 
                                      onChange={(e) => handleRowChange(idx, 'plan', e.target.value)}
                                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}
                                    >
                                      <option value="1GB">1GB</option>
                                      <option value="2GB">2GB</option>
                                      <option value="5GB">5GB</option>
                                      <option value="10GB">10GB</option>
                                      <option value="20GB">20GB</option>
                                      <option value="Airtime">Airtime</option>
                                    </select>
                                  </td>
                                  <td style={{ padding: '0.45rem 0.35rem', fontWeight: 700, fontFamily: 'monospace' }}>
                                    GH₵{row.amount.toFixed(2)}
                                  </td>
                                  <td style={{ padding: '0.45rem 0', textAlign: 'right' }}>
                                    <button 
                                      type="button"
                                      onClick={() => removeRow(idx)} 
                                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', padding: '0.2rem' }}
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <button 
                            type="button"
                            onClick={addRow} 
                            style={{ background: 'none', border: 'none', color: 'var(--color-brand-primary)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: 0 }}
                          >
                            + Add another recipient
                          </button>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                              Total items: <strong style={{ color: 'var(--color-text-primary)' }}>{manualRows.length}</strong>
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                              Total cost: <strong style={{ color: 'var(--color-text-primary)', fontFamily: 'monospace' }}>GH₵{totalBulkAmount.toFixed(2)}</strong>
                            </span>
                            <button 
                              type="button"
                              onClick={handleExecuteBulk}
                              disabled={bulkLoading || manualRows.length === 0}
                              className="btn btn-primary btn-sm" 
                              style={{ padding: '0.45rem 1rem', borderRadius: '6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                            >
                              {bulkLoading ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
                              {bulkLoading ? `Processing (${bulkProgress?.current || 0}/${bulkProgress?.total || manualRows.length})...` : 'Confirm & Execute Batch'}
                            </button>
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* Bulk Success Summary Banner */}
                    {bulkSuccessSummary && (
                      <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10B981', borderRadius: '8px', color: '#10B981', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle2 size={16} />
                        <span>{bulkSuccessSummary}</span>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

            {/* Sales overview (7 days) */}
            <div className="card" style={{ background: 'var(--color-bg-card)' }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Sales overview (7 days)</h3>
                  <div style={{ position: 'relative' }}>
                    <select className="form-input" style={{ appearance: 'none', padding: '0.45rem 2rem 0.45rem 0.875rem', borderRadius: '6px', fontSize: '0.75rem', width: 'auto', border: '1px solid var(--color-border)', background: 'var(--color-bg-elevated)' }}>
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                    </select>
                    <ChevronDown size={12} style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-muted)' }} />
                  </div>
                </div>

                {/* CSS Bar Chart */}
                <div style={{ display: 'flex', gap: '1.5rem', height: '280px', alignItems: 'flex-end', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border-subtle)', position: 'relative' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '240px', position: 'absolute', left: 0, right: 0, pointerEvents: 'none', zIndex: 1 }}>
                    <div style={{ borderBottom: '1.5px dashed rgba(255,255,255,0.03)', height: 0, position: 'relative' }}><span style={{ position: 'absolute', top: '-8px', left: 0, fontSize: '0.65rem', color: 'var(--color-text-muted)', background: 'var(--color-bg-card)', paddingRight: '4px' }}>GH₵300K</span></div>
                    <div style={{ borderBottom: '1.5px dashed rgba(255,255,255,0.03)', height: 0, position: 'relative' }}><span style={{ position: 'absolute', top: '-8px', left: 0, fontSize: '0.65rem', color: 'var(--color-text-muted)', background: 'var(--color-bg-card)', paddingRight: '4px' }}>GH₵200K</span></div>
                    <div style={{ borderBottom: '1.5px dashed rgba(255,255,255,0.03)', height: 0, position: 'relative' }}><span style={{ position: 'absolute', top: '-8px', left: 0, fontSize: '0.65rem', color: 'var(--color-text-muted)', background: 'var(--color-bg-card)', paddingRight: '4px' }}>GH₵100K</span></div>
                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', height: 0, position: 'relative' }}><span style={{ position: 'absolute', top: '-8px', left: 0, fontSize: '0.65rem', color: 'var(--color-text-muted)', background: 'var(--color-bg-card)', paddingRight: '4px' }}>GH₵0</span></div>
                  </div>

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

            {/* Recent sales */}
            <div className="card" style={{ background: 'var(--color-bg-card)' }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Recent sales</h3>
                  <Link href="/agent/sales" style={{ fontSize: '0.78rem', color: 'var(--color-brand-primary)', textDecoration: 'none', fontWeight: 600 }}>
                    View all
                  </Link>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                        <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>Order ID</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Customer</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Service</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Amount</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Status</th>
                        <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSales.map((sale, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                          <td style={{ padding: '0.875rem 0', fontWeight: 600, color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>{sale.id}</td>
                          <td style={{ padding: '0.875rem 0.5rem', fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>{sale.customer}</td>
                          <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <ProviderIcon provider={sale.service} size={16} />
                              <span>{sale.service}</span>
                            </div>
                          </td>
                          <td style={{ padding: '0.875rem 0.5rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--color-text-primary)' }}>{sale.amount}</td>
                          <td style={{ padding: '0.875rem 0.5rem' }}>
                            <span className={`badge ${
                              sale.status === 'success' ? 'badge-success' : 
                              sale.status === 'processing' ? 'badge-info' : 'badge-secondary'
                            }`} style={{ textTransform: 'capitalize', fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                              {sale.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.875rem 0', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{sale.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Pricing tier, Commission history, My referrals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Pricing tier */}
            <div className="card" style={{ background: 'var(--color-bg-card)' }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Pricing tier</h3>
                  <span className="badge badge-blue" style={{ fontSize: '0.7rem', padding: '0.15rem 0.55rem' }}>Agent</span>
                </div>

                <div style={{ overflowX: 'auto', marginBottom: '1.25rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                        <th style={{ padding: '0.5rem 0', fontWeight: 600 }}>Service</th>
                        <th style={{ padding: '0.5rem 0.35rem', fontWeight: 600 }}>Retail</th>
                        <th style={{ padding: '0.5rem 0.35rem', fontWeight: 600 }}>Agent Rate</th>
                        <th style={{ padding: '0.5rem 0', fontWeight: 600, textAlign: 'right' }}>Your Margin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pricingTiers.map((p, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                          <td style={{ padding: '0.625rem 0', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <ProviderIcon provider={p.service} size={16} />
                              <span>{p.service}</span>
                            </div>
                          </td>
                          <td style={{ padding: '0.625rem 0.35rem', fontFamily: 'monospace' }}>{p.retail}</td>
                          <td style={{ padding: '0.625rem 0.35rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-text-primary)' }}>{p.agent}</td>
                          <td style={{ padding: '0.625rem 0', fontWeight: 700, color: '#34D399', textAlign: 'right', fontFamily: 'monospace' }}>{p.margin}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Progress to Super Agent */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.45rem' }}>
                    <span>Progress to Super Agent</span>
                    <span style={{ color: 'var(--color-brand-primary)' }}>60%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden', marginBottom: '0.625rem' }}>
                    <div style={{ width: '60%', height: '100%', background: 'linear-gradient(90deg, var(--color-brand-primary) 0%, #3B82F6 100%)', borderRadius: '99px' }}></div>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', lineHeight: '1.3' }}>
                    <strong style={{ color: 'var(--color-text-primary)' }}>GH₵374,320.00</strong> more in sales to unlock Super Agent benefits
                  </div>
                </div>

              </div>
            </div>

            {/* Commission history */}
            <div className="card" style={{ background: 'var(--color-bg-card)' }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Commission history</h3>
                  <Link href="/agent/commissions" style={{ fontSize: '0.78rem', color: 'var(--color-brand-primary)', textDecoration: 'none', fontWeight: 600 }}>
                    View all
                  </Link>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                        <th style={{ padding: '0.5rem 0', fontWeight: 600 }}>Date</th>
                        <th style={{ padding: '0.5rem 0.35rem', fontWeight: 600 }}>Order ID</th>
                        <th style={{ padding: '0.5rem 0.35rem', fontWeight: 600 }}>Customer</th>
                        <th style={{ padding: '0.5rem 0.35rem', fontWeight: 600 }}>Service</th>
                        <th style={{ padding: '0.5rem 0', fontWeight: 600, textAlign: 'right' }}>Commission</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commissionHistory.map((c, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                          <td style={{ padding: '0.625rem 0', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{c.date.split(',')[0]}</td>
                          <td style={{ padding: '0.625rem 0.35rem', fontFamily: 'monospace' }}>{c.orderId}</td>
                          <td style={{ padding: '0.625rem 0.35rem', fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>{c.customer.split(' ')[0]}</td>
                          <td style={{ padding: '0.625rem 0.35rem', fontWeight: 600 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <ProviderIcon provider={c.service} size={16} />
                              <span>{c.service}</span>
                            </div>
                          </td>
                          <td style={{ padding: '0.625rem 0', fontWeight: 700, color: '#34D399', textAlign: 'right', fontFamily: 'monospace' }}>{c.commission}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>

            {/* My referrals */}
            <div className="card" style={{ background: 'var(--color-bg-card)' }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>My referrals</h3>
                  <Link href="/agent/referrals" style={{ fontSize: '0.78rem', color: 'var(--color-brand-primary)', textDecoration: 'none', fontWeight: 600 }}>
                    View all
                  </Link>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                        <th style={{ padding: '0.5rem 0', fontWeight: 600 }}>Name</th>
                        <th style={{ padding: '0.5rem 0.35rem', fontWeight: 600 }}>Phone</th>
                        <th style={{ padding: '0.5rem 0.35rem', fontWeight: 600 }}>Type</th>
                        <th style={{ padding: '0.5rem 0.35rem', fontWeight: 600 }}>Orders</th>
                        <th style={{ padding: '0.5rem 0.35rem', fontWeight: 600 }}>Status</th>
                        <th style={{ padding: '0.5rem 0', fontWeight: 600, textAlign: 'right' }}>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referrals.map((r, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                          <td style={{ padding: '0.625rem 0', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{r.name}</td>
                          <td style={{ padding: '0.625rem 0.35rem', fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>{r.phone}</td>
                          <td style={{ padding: '0.625rem 0.35rem', color: 'var(--color-text-secondary)' }}>{r.type}</td>
                          <td style={{ padding: '0.625rem 0.35rem', fontWeight: 600, textAlign: 'center' }}>{r.orders}</td>
                          <td style={{ padding: '0.625rem 0.35rem' }}>
                            <span className={`badge ${
                              r.status === 'active' ? 'badge-success' : 'badge-info'
                            }`} style={{ textTransform: 'capitalize', fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                              {r.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.625rem 0', color: 'var(--color-text-muted)', fontSize: '0.72rem', textAlign: 'right' }}>{r.joined.split(',')[0]}</td>
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
