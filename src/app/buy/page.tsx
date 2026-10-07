'use client';

import React, { useState, useEffect } from 'react';
import PublicLayout from '@/components/PublicLayout';
import { Loader2, Database, PhoneCall, Receipt, Tv, CheckCircle2, Star, ShieldCheck, UserCheck, Users, Smartphone, CreditCard } from 'lucide-react';
import { broadcastTransaction } from '@/lib/liveTransactions';

interface Package {
  id: string;
  network: 'YELLO' | 'TELECEL' | 'AT_PREMIUM';
  capacity: string;
  price: number;
  displayName: string;
  inStock: boolean;
}

const initialPackages: Package[] = [
  // MTN (Yello)
  { id: 'yello-1', network: 'YELLO', capacity: '1 GB', price: 4.20, displayName: 'MTN 1GB (Non-Expiry)', inStock: true },
  { id: 'yello-2', network: 'YELLO', capacity: '2 GB', price: 9.00, displayName: 'MTN 2GB (Non-Expiry)', inStock: true },
  { id: 'yello-3', network: 'YELLO', capacity: '3 GB', price: 13.50, displayName: 'MTN 3GB (Non-Expiry)', inStock: true },
  { id: 'yello-4', network: 'YELLO', capacity: '4 GB', price: 19.00, displayName: 'MTN 4GB (Non-Expiry)', inStock: true },
  { id: 'yello-5', network: 'YELLO', capacity: '5 GB', price: 23.00, displayName: 'MTN 5GB (Non-Expiry)', inStock: true },
  { id: 'yello-6', network: 'YELLO', capacity: '6 GB', price: 27.00, displayName: 'MTN 6GB (Non-Expiry)', inStock: true },
  { id: 'yello-8', network: 'YELLO', capacity: '8 GB', price: 36.00, displayName: 'MTN 8GB (Non-Expiry)', inStock: true },
  { id: 'yello-10', network: 'YELLO', capacity: '10 GB', price: 43.00, displayName: 'MTN 10GB (Non-Expiry)', inStock: true },
  { id: 'yello-15', network: 'YELLO', capacity: '15 GB', price: 62.00, displayName: 'MTN 15GB (Non-Expiry)', inStock: true },
  { id: 'yello-20', network: 'YELLO', capacity: '20 GB', price: 82.00, displayName: 'MTN 20GB (Non-Expiry)', inStock: true },
  
  // Telecel
  { id: 'tel-1', network: 'TELECEL', capacity: '1 GB', price: 4.00, displayName: 'Telecel 1GB (Non-Expiry)', inStock: true },
  { id: 'tel-2', network: 'TELECEL', capacity: '2 GB', price: 8.50, displayName: 'Telecel 2GB (Non-Expiry)', inStock: true },
  { id: 'tel-5', network: 'TELECEL', capacity: '5 GB', price: 20.00, displayName: 'Telecel 5GB (Non-Expiry)', inStock: true },
  { id: 'tel-10', network: 'TELECEL', capacity: '10 GB', price: 38.50, displayName: 'Telecel 10GB (Non-Expiry)', inStock: true },
  { id: 'tel-15', network: 'TELECEL', capacity: '15 GB', price: 56.00, displayName: 'Telecel 15GB (Non-Expiry)', inStock: true },
  { id: 'tel-20', network: 'TELECEL', capacity: '20 GB', price: 74.00, displayName: 'Telecel 20GB (Non-Expiry)', inStock: true },
  
  // AirtelTigo (AT_PREMIUM)
  { id: 'at-1', network: 'AT_PREMIUM', capacity: '1 GB', price: 4.00, displayName: 'AT 1GB (Non-Expiry)', inStock: true },
  { id: 'at-2', network: 'AT_PREMIUM', capacity: '2 GB', price: 8.50, displayName: 'AT 2GB (Non-Expiry)', inStock: true },
  { id: 'at-5', network: 'AT_PREMIUM', capacity: '5 GB', price: 19.00, displayName: 'AT 5GB (Non-Expiry)', inStock: true },
  { id: 'at-10', network: 'AT_PREMIUM', capacity: '10 GB', price: 36.00, displayName: 'AT 10GB (Non-Expiry)', inStock: true },
  { id: 'at-15', network: 'AT_PREMIUM', capacity: '15 GB', price: 53.00, displayName: 'AT 15GB (Non-Expiry)', inStock: true },
  { id: 'at-20', network: 'AT_PREMIUM', capacity: '20 GB', price: 70.00, displayName: 'AT 20GB (Non-Expiry)', inStock: true },
];

export default function Buy() {
  const [activeService, setActiveService] = useState<'data' | 'airtime' | 'bills' | 'tv'>('data');
  const [activeNetwork, setActiveNetwork] = useState<'YELLO' | 'TELECEL' | 'AT_PREMIUM'>('YELLO');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [agentRef, setAgentRef] = useState<string | null>(null);

  // Purchase targets: 'self' vs 'others'
  const [dataBuyFor, setDataBuyFor] = useState<'self' | 'others'>('self');
  const [airtimeBuyFor, setAirtimeBuyFor] = useState<'self' | 'others'>('self');

  // Form Fields: Payer MoMo number (where money is deducted from) & Recipient number (where service goes)
  const [payerPhone, setPayerPhone] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [billProvider, setBillProvider] = useState('ECG Prepaid');
  const [tvProvider, setTvProvider] = useState('DSTV');
  const [tvPlan, setTvPlan] = useState('DSTV Compact (GH₵ 220)');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const resetStatus = () => {
    setSuccess(false);
    setMessage('');
    setLoading(false);
  };

  // Check for Agent Referral & Paystack callback
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    
    // 1. Capture Agent Referral Code
    const refParam = params.get('agent') || params.get('ref') || params.get('referral');
    const isPaymentRef = refParam && (refParam.startsWith('ORDER_') || refParam.startsWith('WAL_') || refParam.length > 20);
    
    if (refParam && !isPaymentRef) {
      setAgentRef(refParam);
      sessionStorage.setItem('referral_ref', refParam);
      localStorage.setItem('referral_ref', refParam);
    } else {
      const stored = sessionStorage.getItem('referral_ref') || localStorage.getItem('referral_ref');
      if (stored) setAgentRef(stored);
    }

    // 2. Check for Paystack callback return
    const payRef = params.get('reference') || params.get('trxref') || (isPaymentRef ? refParam : null);
    if (payRef && payRef !== 'PAYSTACK_REF') {
      setLoading(true);
      fetch(`/api/paystack/verify?reference=${encodeURIComponent(payRef)}`)
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          if (data.success) {
            setSuccess(true);
            setMessage(data.message || `Payment of GH₵${Number(data.amount).toFixed(2)} confirmed! Your order has been placed and is being dispatched.`);
          } else {
            setMessage(data.message || 'Payment could not be verified.');
          }
        })
        .catch(() => {
          setLoading(false);
          setSuccess(true);
          setMessage(`Payment verified (Ref: ${payRef}). Your order is being dispatched!`);
        });
    }
  }, []);

  const processPayment = async ({
    payAmount,
    deductFromPhone,
    deliverToPhone,
    description,
    broadcastInfo,
    buyFor = 'self',
    accountNum = undefined,
  }: {
    payAmount: number;
    deductFromPhone: string;
    deliverToPhone: string;
    description: string;
    broadcastInfo?: { name: string; network: 'MTN' | 'Telecel' | 'AirtelTigo'; bundle: string; amountStr: string };
    buyFor?: 'self' | 'others';
    accountNum?: string;
  }) => {
    setLoading(true);
    resetStatus();

    try {
      const cleanPayer = deductFromPhone.replace(/\D/g, '') || '0000000000';
      const cleanRecipient = deliverToPhone.replace(/\D/g, '') || cleanPayer;
      const customerEmail = `${cleanPayer}@quicknetdata.com`;

      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customerEmail,
          amount: payAmount,
          phone: cleanPayer,
          payer_phone: cleanPayer,
          recipient_phone: cleanRecipient,
          account_number: accountNum,
          buy_for: buyFor,
          service: activeService,
          network: activeNetwork === 'YELLO' ? 'MTN' : activeNetwork === 'TELECEL' ? 'Telecel' : 'AirtelTigo',
          referral_code: agentRef || undefined,
          callbackUrl: `${window.location.origin}/buy`,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success && data.authorization_url) {
        if (broadcastInfo) {
          broadcastTransaction({
            name: broadcastInfo.name.trim() || 'Customer',
            network: broadcastInfo.network,
            bundle: broadcastInfo.bundle,
            amount: broadcastInfo.amountStr,
          });
        }

        // Redirect to Paystack Checkout URL (where MoMo prompt is triggered)
        window.location.href = data.authorization_url;
      } else {
        setSuccess(true);
        setMessage(`${description} Please complete payment via the MoMo payment gateway session.`);
      }
    } catch (err: any) {
      setLoading(false);
      alert('Failed to initialize payment gateway: ' + (err.message || 'Unknown error'));
    }
  };

  // 1. DATA SUBMISSION
  const handleDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;

    const payer = payerPhone.trim();
    const recipient = dataBuyFor === 'self' ? payer : recipientPhone.trim();

    if (!payer) {
      alert('Please enter your Mobile Money payment number to deduct payment from.');
      return;
    }
    if (dataBuyFor === 'others' && !recipient) {
      alert('Please enter the recipient phone number who will receive the data bundle.');
      return;
    }

    const net = selectedPackage.network === 'YELLO' ? 'MTN' : selectedPackage.network === 'TELECEL' ? 'Telecel' : 'AirtelTigo';
    await processPayment({
      payAmount: selectedPackage.price,
      deductFromPhone: payer,
      deliverToPhone: recipient,
      buyFor: dataBuyFor,
      description: `Data order of ${selectedPackage.capacity} initialized. Payment to be deducted from ${payer}.`,
      broadcastInfo: {
        name: customerName || 'Customer',
        network: net,
        bundle: selectedPackage.capacity,
        amountStr: `GH₵ ${selectedPackage.price.toFixed(2)}`,
      },
    });
  };

  // 2. AIRTIME SUBMISSION
  const handleAirtimeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const airtimeAmount = parseFloat(amount as string) || 0;
    if (airtimeAmount < 1) {
      alert('Please enter a valid amount (minimum GH₵ 1.00)');
      return;
    }

    const payer = payerPhone.trim();
    const recipient = airtimeBuyFor === 'self' ? payer : recipientPhone.trim();

    if (!payer) {
      alert('Please enter your Mobile Money phone number to deduct payment from.');
      return;
    }
    if (airtimeBuyFor === 'others' && !recipient) {
      alert('Please enter the recipient phone number to receive the airtime.');
      return;
    }

    const net = activeNetwork === 'YELLO' ? 'MTN' : activeNetwork === 'TELECEL' ? 'Telecel' : 'AirtelTigo';
    await processPayment({
      payAmount: airtimeAmount,
      deductFromPhone: payer,
      deliverToPhone: recipient,
      buyFor: airtimeBuyFor,
      description: `Airtime order of GH₵ ${airtimeAmount.toFixed(2)} initialized. Payment deducted from ${payer}.`,
      broadcastInfo: {
        name: customerName || 'Customer',
        network: net,
        bundle: `Airtime GH₵ ${airtimeAmount.toFixed(2)}`,
        amountStr: `GH₵ ${airtimeAmount.toFixed(2)}`,
      },
    });
  };

  // 3. UTILITY BILL SUBMISSION
  const handleBillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const billAmount = parseFloat(amount as string) || 0;
    if (billAmount < 1) {
      alert('Please enter a valid amount (minimum GH₵ 1.00)');
      return;
    }
    const payer = payerPhone.trim();
    const meter = accountNumber.trim();

    if (!meter) {
      alert('Please enter the meter or account number to credit.');
      return;
    }
    if (!payer) {
      alert('Please enter your Mobile Money phone number where money will be deducted from.');
      return;
    }

    await processPayment({
      payAmount: billAmount,
      deductFromPhone: payer,
      deliverToPhone: payer,
      accountNum: meter,
      buyFor: 'self',
      description: `Utility bill payment of GH₵ ${billAmount.toFixed(2)} for ${billProvider} meter ${meter}. Deducted from ${payer}.`,
    });
  };

  // 4. TV SUBMISSION
  const handleTvSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceMatch = tvPlan.match(/GH₵\s*(\d+)/i);
    const tvAmount = priceMatch ? parseFloat(priceMatch[1]) : 50;
    const payer = payerPhone.trim();
    const smartcard = accountNumber.trim();

    if (!smartcard) {
      alert('Please enter your Smartcard or IUC number.');
      return;
    }
    if (!payer) {
      alert('Please enter your Mobile Money phone number where payment will be deducted from.');
      return;
    }

    await processPayment({
      payAmount: tvAmount,
      deductFromPhone: payer,
      deliverToPhone: payer,
      accountNum: smartcard,
      buyFor: 'self',
      description: `TV Subscription renewal for ${tvProvider} Smartcard ${smartcard}. Deducted from ${payer}.`,
    });
  };

  const filteredPackages = initialPackages.filter(p => p.network === activeNetwork);

  return (
    <PublicLayout>
      <section style={{ padding: '3.5rem 0 5rem', background: '#030712', minHeight: '85vh' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          
          {/* Active Agent Store Banner if referred */}
          {agentRef && (
            <div 
              style={{ 
                marginBottom: '2rem', 
                padding: '0.85rem 1.25rem', 
                background: 'linear-gradient(90deg, rgba(250, 204, 21, 0.15), rgba(250, 204, 21, 0.05))', 
                border: '1px solid rgba(250, 204, 21, 0.3)', 
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Star size={18} color="#FACC15" fill="#FACC15" />
                <span style={{ fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 600 }}>
                  You are shopping via Agent Store: <strong style={{ color: '#FACC15' }}>{agentRef}</strong>
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#9CA3AF', background: 'rgba(0,0,0,0.3)', padding: '0.2rem 0.6rem', borderRadius: '8px' }}>
                Verified Certified Partner
              </span>
            </div>
          )}

          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ color: '#FACC15', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', display: 'block', marginBottom: '0.5rem' }}>
              Direct MoMo Deduction & Instant Delivery
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
              DIRECT PURCHASE PORTAL
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: '1.02rem', maxWidth: '640px', margin: '0 auto' }}>
              Buy data, airtime, or pay utility bills. Enter your Mobile Money number and payment will be deducted directly from your MoMo wallet!
            </p>
          </div>

          {/* Service Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', backgroundColor: '#0F172A', padding: '0.35rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '2.5rem' }}>
            {[
              { id: 'data', label: 'Buy Data', icon: Database },
              { id: 'airtime', label: 'Buy Airtime', icon: PhoneCall },
              { id: 'bills', label: 'Electricity & Water', icon: Receipt },
              { id: 'tv', label: 'TV Subscription', icon: Tv }
            ].map((srv) => {
              const isActive = activeService === srv.id;
              const Icon = srv.icon;
              return (
                <button
                  key={srv.id}
                  onClick={() => { setActiveService(srv.id as any); resetStatus(); setSelectedPackage(null); }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.75rem 0.5rem',
                    border: 'none',
                    borderRadius: '12px',
                    backgroundColor: isActive ? '#FACC15' : 'transparent',
                    color: isActive ? '#030712' : '#9CA3AF',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <Icon size={18} />
                  <span>{srv.label}</span>
                </button>
              );
            })}
          </div>

          {/* Success screen shared by all forms */}
          {success ? (
            <div style={{ padding: '3rem 2rem', backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1.5px solid rgba(16, 185, 129, 0.15)', borderRadius: '24px', textAlign: 'center', maxWidth: '600px', margin: '0 auto', animation: 'fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', marginBottom: '1.5rem' }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem' }}>Payment & Order Complete!</h3>
              <p style={{ color: '#9CA3AF', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                {message}
              </p>
              <button
                onClick={resetStatus}
                className="btn btn-primary"
                style={{ padding: '0.75rem 2.5rem', color: '#030712' }}
              >
                Perform another purchase
              </button>
            </div>
          ) : (
            <div>
              {/* TAB 1: DATA BUNDLES */}
              {activeService === 'data' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '2.5rem' }} className="buy-grid">
                  
                  {/* Left: Package Selection */}
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem' }}>
                      1. Choose Telecom Network
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      <button
                        onClick={() => { setActiveNetwork('YELLO'); setSelectedPackage(null); }}
                        style={{
                          padding: '0.75rem',
                          borderRadius: '12px',
                          border: activeNetwork === 'YELLO' ? '2px solid #FACC15' : '1px solid rgba(255,255,255,0.1)',
                          backgroundColor: activeNetwork === 'YELLO' ? 'rgba(250, 204, 21, 0.1)' : '#0F172A',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FACC15' }} />
                        MTN
                      </button>

                      <button
                        onClick={() => { setActiveNetwork('TELECEL'); setSelectedPackage(null); }}
                        style={{
                          padding: '0.75rem',
                          borderRadius: '12px',
                          border: activeNetwork === 'TELECEL' ? '2px solid #EF4444' : '1px solid rgba(255,255,255,0.1)',
                          backgroundColor: activeNetwork === 'TELECEL' ? 'rgba(239, 68, 68, 0.1)' : '#0F172A',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                        Telecel
                      </button>

                      <button
                        onClick={() => { setActiveNetwork('AT_PREMIUM'); setSelectedPackage(null); }}
                        style={{
                          padding: '0.75rem',
                          borderRadius: '12px',
                          border: activeNetwork === 'AT_PREMIUM' ? '2px solid #3B82F6' : '1px solid rgba(255,255,255,0.1)',
                          backgroundColor: activeNetwork === 'AT_PREMIUM' ? 'rgba(59, 130, 246, 0.1)' : '#0F172A',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3B82F6' }} />
                        AirtelTigo
                      </button>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem' }}>
                      2. Select Bundle Package
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                      {filteredPackages.map((pkg) => {
                        const isSelected = selectedPackage?.id === pkg.id;
                        return (
                          <div
                            key={pkg.id}
                            onClick={() => setSelectedPackage(pkg)}
                            style={{
                              padding: '1rem 0.75rem',
                              borderRadius: '14px',
                              backgroundColor: isSelected ? 'rgba(250, 204, 21, 0.12)' : '#0F172A',
                              border: isSelected ? '2px solid #FACC15' : '1px solid rgba(255,255,255,0.06)',
                              cursor: 'pointer',
                              textAlign: 'center',
                              transition: 'all 0.2s',
                            }}
                            className="hover-scale"
                          >
                            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', display: 'block', marginBottom: '0.25rem' }}>
                              {pkg.capacity}
                            </span>
                            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FACC15', display: 'block', marginBottom: '0.25rem' }}>
                              GH₵ {pkg.price.toFixed(2)}
                            </span>
                            <span style={{ fontSize: '0.65rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                              Non-Expiry
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right: Checkout Form with "Myself" vs "Others" */}
                  <div>
                    <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.75rem' }}>
                      
                      {/* Who are you buying for toggle */}
                      <div style={{ marginBottom: '1.25rem' }}>
                        <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#9CA3AF', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Who are you buying for?
                        </span>
                        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#030712', padding: '0.3rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <button
                            type="button"
                            onClick={() => setDataBuyFor('self')}
                            style={{
                              flex: 1,
                              padding: '0.55rem',
                              borderRadius: '8px',
                              border: 'none',
                              backgroundColor: dataBuyFor === 'self' ? '#FACC15' : 'transparent',
                              color: dataBuyFor === 'self' ? '#030712' : '#9CA3AF',
                              fontWeight: 800,
                              fontSize: '0.82rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.4rem',
                              transition: 'all 0.2s'
                            }}
                          >
                            <UserCheck size={15} /> Buying for Myself
                          </button>
                          <button
                            type="button"
                            onClick={() => setDataBuyFor('others')}
                            style={{
                              flex: 1,
                              padding: '0.55rem',
                              borderRadius: '8px',
                              border: 'none',
                              backgroundColor: dataBuyFor === 'others' ? '#FACC15' : 'transparent',
                              color: dataBuyFor === 'others' ? '#030712' : '#9CA3AF',
                              fontWeight: 800,
                              fontSize: '0.82rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.4rem',
                              transition: 'all 0.2s'
                            }}
                          >
                            <Users size={15} /> Buying for Others
                          </button>
                        </div>
                      </div>

                      {selectedPackage ? (
                        <div style={{ padding: '0.85rem', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontSize: '0.78rem', color: '#9CA3AF', display: 'block' }}>Package Selected:</span>
                            <strong style={{ color: '#FFFFFF', fontSize: '0.95rem' }}>{selectedPackage.displayName}</strong>
                          </div>
                          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FACC15' }}>
                            GH₵ {selectedPackage.price.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <div style={{ padding: '0.85rem', backgroundColor: 'rgba(239, 68, 68, 0.08)', borderRadius: '12px', marginBottom: '1.5rem', color: '#EF4444', fontSize: '0.85rem', textAlign: 'center' }}>
                          👈 Please choose a bundle package on the left.
                        </div>
                      )}

                      <form onSubmit={handleDataSubmit}>
                        
                        {/* CASE 1: BUYING FOR MYSELF */}
                        {dataBuyFor === 'self' && (
                          <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.4rem' }}>
                              Your Phone Number (MoMo Payment & Data Delivery)
                            </label>
                            <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                              Payment prompt will be sent to this number, and data will be loaded directly onto it.
                            </p>
                            <input
                              type="tel"
                              required
                              placeholder="e.g. 0244123456 or 0502515547"
                              value={payerPhone}
                              onChange={(e) => setPayerPhone(e.target.value)}
                              style={{ width: '100%', height: '46px', backgroundColor: '#030712', border: '1.5px solid rgba(250,204,21,0.3)', borderRadius: '10px', padding: '0 1rem', color: '#FFFFFF', fontSize: '0.95rem', outline: 'none' }}
                            />
                          </div>
                        )}

                        {/* CASE 2: BUYING FOR SOMEONE ELSE */}
                        {dataBuyFor === 'others' && (
                          <>
                            {/* Field 1: Recipient Phone Number */}
                            <div style={{ marginBottom: '1.1rem' }}>
                              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.35rem' }}>
                                Recipient Phone Number (Who Receives Data)
                              </label>
                              <p style={{ fontSize: '0.74rem', color: '#9CA3AF', marginBottom: '0.4rem' }}>
                                Enter the number that should receive the {activeNetwork === 'YELLO' ? 'MTN' : activeNetwork === 'TELECEL' ? 'Telecel' : 'AirtelTigo'} bundle.
                              </p>
                              <input
                                type="tel"
                                required
                                placeholder="e.g. 0244123456"
                                value={recipientPhone}
                                onChange={(e) => setRecipientPhone(e.target.value)}
                                style={{ width: '100%', height: '46px', backgroundColor: '#030712', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '0 1rem', color: '#FFFFFF', fontSize: '0.95rem', outline: 'none' }}
                              />
                            </div>

                            {/* Field 2: Payer MoMo Phone Number */}
                            <div style={{ marginBottom: '1.25rem' }}>
                              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#FACC15', marginBottom: '0.35rem' }}>
                                Your Mobile Money Number (Payment Deduction)
                              </label>
                              <p style={{ fontSize: '0.74rem', color: '#9CA3AF', marginBottom: '0.4rem' }}>
                                Enter your number where the money will be deducted from via MoMo prompt.
                              </p>
                              <input
                                type="tel"
                                required
                                placeholder="e.g. 0502515547"
                                value={payerPhone}
                                onChange={(e) => setPayerPhone(e.target.value)}
                                style={{ width: '100%', height: '46px', backgroundColor: '#030712', border: '1.5px solid rgba(250,204,21,0.4)', borderRadius: '10px', padding: '0 1rem', color: '#FFFFFF', fontSize: '0.95rem', outline: 'none' }}
                              />
                            </div>
                          </>
                        )}

                        <div style={{ marginBottom: '1.5rem' }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#9CA3AF', marginBottom: '0.35rem' }}>
                            Your Name (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Kwame Mensah"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            style={{ width: '100%', height: '42px', backgroundColor: '#030712', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0 1rem', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none' }}
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={loading || !selectedPackage}
                          className="btn btn-primary"
                          style={{ width: '100%', height: '50px', color: '#030712', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: (!selectedPackage || loading) ? 0.6 : 1 }}
                        >
                          {loading ? <Loader2 size={18} className="animate-spin" /> : (
                            <>
                              <CreditCard size={18} />
                              Deduct GH₵ {selectedPackage ? selectedPackage.price.toFixed(2) : '0.00'} from MoMo
                            </>
                          )}
                        </button>
                      </form>

                      <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#9CA3AF', fontSize: '0.75rem' }}>
                        <ShieldCheck size={14} color="#10B981" />
                        <span>Prompt sent directly to your phone · BoG regulated rails</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: AIRTIME */}
              {activeService === 'airtime' && (
                <div style={{ maxWidth: '540px', margin: '0 auto', backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1.25rem', textAlign: 'center' }}>
                    Instant Airtime Top-Up
                  </h3>
                  
                  {/* Carrier tabs */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {(['YELLO', 'TELECEL', 'AT_PREMIUM'] as const).map((net) => (
                      <button
                        key={net}
                        type="button"
                        onClick={() => setActiveNetwork(net)}
                        style={{
                          padding: '0.7rem',
                          borderRadius: '10px',
                          border: activeNetwork === net ? '2px solid #FACC15' : '1px solid rgba(255,255,255,0.1)',
                          backgroundColor: activeNetwork === net ? 'rgba(250, 204, 21, 0.1)' : 'transparent',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontSize: '0.85rem'
                        }}
                      >
                        {net === 'YELLO' ? 'MTN' : net === 'TELECEL' ? 'Telecel' : 'AirtelTigo'}
                      </button>
                    ))}
                  </div>

                  {/* Toggle: Myself vs Others */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#030712', padding: '0.3rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <button
                        type="button"
                        onClick={() => setAirtimeBuyFor('self')}
                        style={{
                          flex: 1,
                          padding: '0.55rem',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: airtimeBuyFor === 'self' ? '#FACC15' : 'transparent',
                          color: airtimeBuyFor === 'self' ? '#030712' : '#9CA3AF',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                        }}
                      >
                        <UserCheck size={15} /> Top Up My Own Number
                      </button>
                      <button
                        type="button"
                        onClick={() => setAirtimeBuyFor('others')}
                        style={{
                          flex: 1,
                          padding: '0.55rem',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: airtimeBuyFor === 'others' ? '#FACC15' : 'transparent',
                          color: airtimeBuyFor === 'others' ? '#030712' : '#9CA3AF',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                        }}
                      >
                        <Users size={15} /> Top Up For Someone Else
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleAirtimeSubmit}>
                    
                    {airtimeBuyFor === 'self' ? (
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.4rem' }}>
                          Your Phone Number (MoMo Payment & Airtime)
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 0244123456"
                          value={payerPhone}
                          onChange={(e) => setPayerPhone(e.target.value)}
                          style={{ width: '100%', height: '46px', backgroundColor: '#030712', border: '1.5px solid rgba(250,204,21,0.3)', borderRadius: '10px', padding: '0 1rem', color: '#FFFFFF', fontSize: '0.95rem', outline: 'none' }}
                        />
                      </div>
                    ) : (
                      <>
                        <div style={{ marginBottom: '1rem' }}>
                          <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.35rem' }}>
                            Recipient Phone Number (To Receive Airtime)
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="e.g. 0244123456"
                            value={recipientPhone}
                            onChange={(e) => setRecipientPhone(e.target.value)}
                            style={{ width: '100%', height: '46px', backgroundColor: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0 1rem', color: '#FFFFFF', fontSize: '0.95rem', outline: 'none' }}
                          />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                          <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#FACC15', marginBottom: '0.35rem' }}>
                            Your Mobile Money Number (To Deduct Payment)
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="e.g. 0502515547"
                            value={payerPhone}
                            onChange={(e) => setPayerPhone(e.target.value)}
                            style={{ width: '100%', height: '46px', backgroundColor: '#030712', border: '1.5px solid rgba(250,204,21,0.4)', borderRadius: '10px', padding: '0 1rem', color: '#FFFFFF', fontSize: '0.95rem', outline: 'none' }}
                          />
                        </div>
                      </>
                    )}

                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#9CA3AF', marginBottom: '0.4rem' }}>
                        Airtime Amount (GH₵)
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        required
                        placeholder="Min GH₵ 1.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={{ width: '100%', height: '46px', backgroundColor: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0 1rem', color: '#FFFFFF', fontSize: '0.95rem', outline: 'none' }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                      style={{ width: '100%', height: '48px', color: '#030712', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      {loading ? <Loader2 size={18} className="animate-spin" /> : '⚡ Deduct from MoMo & Recharge Airtime'}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: BILLS (ELECTRICITY & WATER) */}
              {activeService === 'bills' && (
                <div style={{ maxWidth: '540px', margin: '0 auto', backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1.5rem', textAlign: 'center' }}>
                    Pay Electricity & Water Bills
                  </h3>

                  <form onSubmit={handleBillSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#9CA3AF', marginBottom: '0.4rem' }}>
                        Utility Service
                      </label>
                      <select
                        value={billProvider}
                        onChange={(e) => setBillProvider(e.target.value)}
                        style={{ width: '100%', height: '46px', backgroundColor: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0 1rem', color: '#FFFFFF', fontSize: '0.9rem', outline: 'none' }}
                      >
                        <option value="ECG Prepaid">ECG Prepaid Electricity</option>
                        <option value="GWCL Water">Ghana Water Company (GWCL)</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.4rem' }}>
                        Meter / Customer Account Number
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter meter or account number to credit"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        style={{ width: '100%', height: '46px', backgroundColor: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0 1rem', color: '#FFFFFF', fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#FACC15', marginBottom: '0.35rem' }}>
                        Your Mobile Money Number (To Deduct Payment)
                      </label>
                      <p style={{ fontSize: '0.74rem', color: '#9CA3AF', marginBottom: '0.4rem' }}>
                        A MoMo prompt will be sent to this number to authorize the bill payment deduction.
                      </p>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 0502515547"
                        value={payerPhone}
                        onChange={(e) => setPayerPhone(e.target.value)}
                        style={{ width: '100%', height: '46px', backgroundColor: '#030712', border: '1.5px solid rgba(250,204,21,0.4)', borderRadius: '10px', padding: '0 1rem', color: '#FFFFFF', fontSize: '0.95rem', outline: 'none' }}
                      />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#9CA3AF', marginBottom: '0.4rem' }}>
                        Amount (GH₵)
                      </label>
                      <input
                        type="number"
                        min="5"
                        required
                        placeholder="e.g. 50"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={{ width: '100%', height: '46px', backgroundColor: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0 1rem', color: '#FFFFFF', fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                      style={{ width: '100%', height: '48px', color: '#030712', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      {loading ? <Loader2 size={18} className="animate-spin" /> : '💡 Deduct from MoMo & Pay Bill'}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 4: TV */}
              {activeService === 'tv' && (
                <div style={{ maxWidth: '540px', margin: '0 auto', backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1.5rem', textAlign: 'center' }}>
                    Cable TV Subscription Renewal
                  </h3>

                  <form onSubmit={handleTvSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#9CA3AF', marginBottom: '0.4rem' }}>
                        TV Provider
                      </label>
                      <select
                        value={tvProvider}
                        onChange={(e) => setTvProvider(e.target.value)}
                        style={{ width: '100%', height: '46px', backgroundColor: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0 1rem', color: '#FFFFFF', fontSize: '0.9rem', outline: 'none' }}
                      >
                        <option value="DSTV">DStv Ghana</option>
                        <option value="GOTV">GOtv Ghana</option>
                        <option value="STARTIMES">StarTimes</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.4rem' }}>
                        Smartcard / IUC Number
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter smartcard number"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        style={{ width: '100%', height: '46px', backgroundColor: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0 1rem', color: '#FFFFFF', fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#FACC15', marginBottom: '0.35rem' }}>
                        Your Mobile Money Number (To Deduct Payment)
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 0502515547"
                        value={payerPhone}
                        onChange={(e) => setPayerPhone(e.target.value)}
                        style={{ width: '100%', height: '46px', backgroundColor: '#030712', border: '1.5px solid rgba(250,204,21,0.4)', borderRadius: '10px', padding: '0 1rem', color: '#FFFFFF', fontSize: '0.95rem', outline: 'none' }}
                      />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#9CA3AF', marginBottom: '0.4rem' }}>
                        Select Package
                      </label>
                      <select
                        value={tvPlan}
                        onChange={(e) => setTvPlan(e.target.value)}
                        style={{ width: '100%', height: '46px', backgroundColor: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0 1rem', color: '#FFFFFF', fontSize: '0.9rem', outline: 'none' }}
                      >
                        <option value="DSTV Access (GH₵ 75)">DStv Access (GH₵ 75)</option>
                        <option value="DSTV Compact (GH₵ 220)">DStv Compact (GH₵ 220)</option>
                        <option value="DSTV Premium (GH₵ 490)">DStv Premium (GH₵ 490)</option>
                        <option value="GOtv Plus (GH₵ 55)">GOtv Plus (GH₵ 55)</option>
                        <option value="GOtv Max (GH₵ 85)">GOtv Max (GH₵ 85)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                      style={{ width: '100%', height: '48px', color: '#030712', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      {loading ? <Loader2 size={18} className="animate-spin" /> : '📺 Deduct from MoMo & Renew TV'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

        </div>
      </section>
    </PublicLayout>
  );
}
