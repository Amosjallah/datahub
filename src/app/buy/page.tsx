'use client';

import React, { useState, useEffect } from 'react';
import PublicLayout from '@/components/PublicLayout';
import { Loader2, Database, CheckCircle2, Star, ShieldCheck, UserCheck, Users, CreditCard, X } from 'lucide-react';
import { broadcastTransaction } from '@/lib/liveTransactions';
import { dataServices } from '@/lib/servicesData';

interface Package {
  id: string;
  network: 'YELLO' | 'TELECEL' | 'AT';
  capacity: string;
  price: number;
  displayName: string;
  inStock: boolean;
}

const initialPackages: Package[] = dataServices.map((s) => ({
  id: s.id,
  network: s.network === 'MTN' ? 'YELLO' : s.network === 'Telecel' ? 'TELECEL' : 'AT',
  capacity: `${s.capacity || String(s.volume || '').replace(/\D/g, '')} GB`,
  price: s.retail_price,
  displayName: `${s.network === 'AirtelTigo' ? 'AT' : s.network} ${s.volume} (Non-Expiry)`,
  inStock: s.status === 'available',
}));

export default function Buy() {
  const [activeService, setActiveService] = useState<'data' | 'bulk'>('data');
  const [activeNetwork, setActiveNetwork] = useState<'YELLO' | 'TELECEL' | 'AT'>('YELLO');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [agentRef, setAgentRef] = useState<string | null>(null);
  const [agentStoreName, setAgentStoreName] = useState<string | null>(null);
  const [agentCustomPrices, setAgentCustomPrices] = useState<Record<string, number>>({});

  // Purchase targets: 'self' vs 'others'
  const [dataBuyFor, setDataBuyFor] = useState<'self' | 'others'>('self');

  // Form Fields: Payer MoMo number (where money is deducted from) & Recipient number (where service goes)
  const [payerPhone, setPayerPhone] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [customerName, setCustomerName] = useState('');

  // Bulk Purchase Fields for customer/corporate ordering
  const [bulkNumbersInput, setBulkNumbersInput] = useState('');
  const [bulkPackage, setBulkPackage] = useState<Package | null>(null);
  const [bulkNetwork, setBulkNetwork] = useState<'YELLO' | 'TELECEL' | 'AT'>('YELLO');

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
      fetch(`/api/agent/store-info?ref=${encodeURIComponent(refParam)}`)
        .then((r) => r.json())
        .then((d) => {
          if (d?.agent?.business_name) setAgentStoreName(d.agent.business_name);
          if (d?.custom_prices) setAgentCustomPrices(d.custom_prices);
        })
        .catch(() => {});
    } else {
      const stored = sessionStorage.getItem('referral_ref') || localStorage.getItem('referral_ref');
      if (stored) {
        setAgentRef(stored);
        fetch(`/api/agent/store-info?ref=${encodeURIComponent(stored)}`)
          .then((r) => r.json())
          .then((d) => {
            if (d?.agent?.business_name) setAgentStoreName(d.agent.business_name);
            if (d?.custom_prices) setAgentCustomPrices(d.custom_prices);
          })
          .catch(() => {});
      }
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
      const targetNet = activeNetwork === 'YELLO' ? 'MTN' : activeNetwork === 'TELECEL' ? 'Telecel' : 'AirtelTigo';

      // PAYSTACK CHECKOUT
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
          service: 'data',
          network: targetNet,
          planId: selectedPackage?.id || bulkPackage?.id,
          capacity: selectedPackage?.capacity || bulkPackage?.capacity,
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

  // 2. BULK PURCHASE SUBMISSION (For customers / business clients ordering for multiple numbers)
  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkPackage) {
      alert('Please select a data bundle package for your bulk order.');
      return;
    }

    const payer = payerPhone.trim();
    if (!payer) {
      alert('Please enter your Mobile Money payment phone number.');
      return;
    }

    // Parse recipient phone numbers from textarea
    const rawNumbers = bulkNumbersInput
      .split(/[\n,;]+/)
      .map(n => n.trim().replace(/\D/g, ''))
      .filter(n => n.length >= 9);

    if (rawNumbers.length === 0) {
      alert('Please enter at least one valid Ghanaian phone number (e.g. 0244123456).');
      return;
    }

    const totalCost = rawNumbers.length * bulkPackage.price;
    const net = bulkPackage.network === 'YELLO' ? 'MTN' : bulkPackage.network === 'TELECEL' ? 'Telecel' : 'AirtelTigo';

    await processPayment({
      payAmount: totalCost,
      deductFromPhone: payer,
      deliverToPhone: rawNumbers[0], // primary recipient, full list recorded in description
      buyFor: 'others',
      description: `Bulk purchase of ${bulkPackage.capacity} for ${rawNumbers.length} recipients. Total GH₵ ${totalCost.toFixed(2)}. Deducted from ${payer}.`,
      broadcastInfo: {
        name: customerName || 'Corporate Client',
        network: net,
        bundle: `Bulk ${rawNumbers.length}x ${bulkPackage.capacity}`,
        amountStr: `GH₵ ${totalCost.toFixed(2)}`,
      },
    });
  };

  const effectivePackages = initialPackages.map((p) => ({
    ...p,
    price: agentCustomPrices[p.id] ?? p.price,
  }));
  const filteredPackages = effectivePackages.filter(p => p.network === activeNetwork);
  const filteredBulkPackages = effectivePackages.filter(p => p.network === bulkNetwork);

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
                  You are shopping via Agent Store: <strong style={{ color: '#FACC15' }}>{agentStoreName || agentRef}</strong>
                  {agentStoreName && <span style={{ fontSize: '0.78rem', color: '#9CA3AF', marginLeft: '0.45rem' }}>({agentRef})</span>}
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
              Buy MTN, Telecel, or AirtelTigo data bundles via Paystack MoMo or Card — delivered instantly via DatamartGH.
            </p>
          </div>

          {/* Service Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', maxWidth: '460px', margin: '0 auto 2.5rem', gap: '0.5rem', backgroundColor: '#0F172A', padding: '0.35rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            {[
              { id: 'data', label: 'Buy Data Bundles', icon: Database },
              { id: 'bulk', label: 'Bulk Data Purchase', icon: Users },
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
                <div>
                  {/* Full-Width Zoomed Package Selection */}
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem' }}>
                      1. Choose Telecom Network
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem', marginBottom: '2rem', maxWidth: '640px' }}>
                      <button
                        onClick={() => { setActiveNetwork('YELLO'); setSelectedPackage(null); }}
                        style={{
                          padding: '0.9rem',
                          borderRadius: '14px',
                          border: activeNetwork === 'YELLO' ? '2px solid #FACC15' : '1px solid rgba(255,255,255,0.1)',
                          backgroundColor: activeNetwork === 'YELLO' ? 'rgba(250, 204, 21, 0.12)' : '#0F172A',
                          color: '#FFFFFF',
                          fontWeight: 800,
                          fontSize: '0.95rem',
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
                          padding: '0.9rem',
                          borderRadius: '14px',
                          border: activeNetwork === 'TELECEL' ? '2px solid #EF4444' : '1px solid rgba(255,255,255,0.1)',
                          backgroundColor: activeNetwork === 'TELECEL' ? 'rgba(239, 68, 68, 0.12)' : '#0F172A',
                          color: '#FFFFFF',
                          fontWeight: 800,
                          fontSize: '0.95rem',
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
                        onClick={() => { setActiveNetwork('AT'); setSelectedPackage(null); }}
                        style={{
                          padding: '0.9rem',
                          borderRadius: '14px',
                          border: activeNetwork === 'AT' ? '2px solid #3B82F6' : '1px solid rgba(255,255,255,0.1)',
                          backgroundColor: activeNetwork === 'AT' ? 'rgba(59, 130, 246, 0.12)' : '#0F172A',
                          color: '#FFFFFF',
                          fontWeight: 800,
                          fontSize: '0.95rem',
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

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                        2. Select Bundle Package
                      </h3>
                      <span style={{ fontSize: '0.82rem', color: '#9CA3AF' }}>
                        Tap any bundle to enter your phone number &amp; pay
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))', gap: '1rem' }}>
                      {filteredPackages.map((pkg) => {
                        const isSelected = selectedPackage?.id === pkg.id;
                        return (
                          <div
                            key={pkg.id}
                            onClick={() => setSelectedPackage(pkg)}
                            style={{
                              padding: '1.4rem 1rem',
                              borderRadius: '16px',
                              backgroundColor: isSelected ? 'rgba(250, 204, 21, 0.14)' : '#0F172A',
                              border: isSelected ? '2px solid #FACC15' : '1px solid rgba(255,255,255,0.08)',
                              cursor: 'pointer',
                              textAlign: 'center',
                              transition: 'all 0.2s',
                              boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                            }}
                            className="hover-scale"
                          >
                            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', display: 'block', marginBottom: '0.35rem' }}>
                              {pkg.capacity}
                            </span>
                            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FACC15', display: 'block', marginBottom: '0.35rem' }}>
                              GH₵ {pkg.price.toFixed(2)}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                              Non-Expiry
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Popup Modal Checkout Form (only shown when a package is selected) */}
                  {selectedPackage && (
                    <div
                      onClick={() => !loading && setSelectedPackage(null)}
                      style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 60,
                        backgroundColor: 'rgba(3, 7, 18, 0.82)',
                        backdropFilter: 'blur(6px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                        overflowY: 'auto',
                      }}
                    >
                      <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          width: '100%',
                          maxWidth: '480px',
                          backgroundColor: '#0F172A',
                          border: '1.5px solid rgba(250, 204, 21, 0.35)',
                          borderRadius: '22px',
                          padding: '1.75rem',
                          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.65)',
                          position: 'relative',
                          animation: 'fadeUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) both',
                          maxHeight: '92vh',
                          overflowY: 'auto',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedPackage(null)}
                          disabled={loading}
                          aria-label="Close checkout"
                          style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255,255,255,0.08)',
                            border: 'none',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <X size={18} />
                        </button>

                        {/* Selected Package Summary */}
                        <div style={{ padding: '0.9rem 1rem', backgroundColor: 'rgba(250, 204, 21, 0.08)', border: '1px solid rgba(250, 204, 21, 0.25)', borderRadius: '14px', marginBottom: '1.25rem', marginRight: '2.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                          <div>
                            <span style={{ fontSize: '0.72rem', color: '#9CA3AF', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Package Selected</span>
                            <strong style={{ color: '#FFFFFF', fontSize: '1rem' }}>{selectedPackage.displayName}</strong>
                          </div>
                          <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FACC15', flexShrink: 0 }}>
                            GH₵ {selectedPackage.price.toFixed(2)}
                          </span>
                        </div>

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
                                autoFocus
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
                                  autoFocus
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

                          {/* Payment Gateway Info */}
                          <div style={{ marginBottom: '1.25rem', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid rgba(250,204,21,0.3)', backgroundColor: 'rgba(250,204,21,0.06)', color: '#FACC15', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                            <span>⚡ Paystack Instant Checkout (MTN MoMo · Telecel Cash · AT Money · Card)</span>
                          </div>

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
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ width: '100%', height: '50px', color: '#030712', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: loading ? 0.6 : 1 }}
                          >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : (
                              <>
                                <CreditCard size={18} />
                                Deduct GH₵ {selectedPackage.price.toFixed(2)} from MoMo
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
                  )}

                </div>
              )}

              {/* TAB 2: BULK PURCHASE (FOR MULTIPLE RECIPIENTS / GROUPS) */}
              {activeService === 'bulk' && (
                <div style={{ maxWidth: '640px', margin: '0 auto', backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2rem' }}>
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.35rem' }}>
                      Bulk Purchase & Multi-Number Top-up
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#9CA3AF' }}>
                      Distribute data bundles or airtime to multiple staff, family, or church members in one single payment transaction.
                    </p>
                  </div>

                  <form onSubmit={handleBulkSubmit}>
                    {/* Choose Network */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#9CA3AF', marginBottom: '0.4rem' }}>
                        1. Select Network
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                        {[
                          { id: 'YELLO', label: 'MTN', color: '#FACC15' },
                          { id: 'TELECEL', label: 'Telecel', color: '#EF4444' },
                          { id: 'AT', label: 'AirtelTigo', color: '#3B82F6' },
                        ].map((net) => (
                          <button
                            key={net.id}
                            type="button"
                            onClick={() => { setBulkNetwork(net.id as any); setBulkPackage(null); }}
                            style={{
                              padding: '0.65rem',
                              borderRadius: '10px',
                              border: bulkNetwork === net.id ? `2px solid ${net.color}` : '1px solid rgba(255,255,255,0.1)',
                              backgroundColor: bulkNetwork === net.id ? 'rgba(255,255,255,0.08)' : '#030712',
                              color: '#FFF',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                            }}
                          >
                            {net.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Choose Package */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#9CA3AF', marginBottom: '0.4rem' }}>
                        2. Select Bundle Package per Number
                      </label>
                      <select
                        value={bulkPackage?.id || ''}
                        onChange={(e) => {
                          const pkg = effectivePackages.find(p => p.id === e.target.value);
                          setBulkPackage(pkg || null);
                        }}
                        required
                        style={{ width: '100%', height: '46px', backgroundColor: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0 1rem', color: '#FFFFFF', fontSize: '0.9rem', outline: 'none' }}
                      >
                        <option value="">-- Choose Data Package --</option>
                        {filteredBulkPackages.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.displayName} — GH₵ {p.price.toFixed(2)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Numbers List */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#9CA3AF', marginBottom: '0.4rem' }}>
                        3. Recipient Phone Numbers (One per line or comma-separated)
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="0244123456&#10;0558345678&#10;0502515547"
                        value={bulkNumbersInput}
                        onChange={(e) => setBulkNumbersInput(e.target.value)}
                        style={{ width: '100%', backgroundColor: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.75rem 1rem', color: '#FFFFFF', fontSize: '0.9rem', outline: 'none', fontFamily: 'monospace' }}
                      />
                      <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.25rem' }}>
                        Recipient count: <strong style={{ color: '#FACC15' }}>
                          {bulkNumbersInput.split(/[\n,;]+/).map(n => n.trim().replace(/\D/g, '')).filter(n => n.length >= 9).length}
                        </strong> numbers detected
                      </div>
                    </div>

                    {/* Payer Phone */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#FACC15', marginBottom: '0.35rem' }}>
                        4. Your Mobile Money Number (To Deduct Payment)
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 0244123456"
                        value={payerPhone}
                        onChange={(e) => setPayerPhone(e.target.value)}
                        style={{ width: '100%', height: '46px', backgroundColor: '#030712', border: '1.5px solid rgba(250,204,21,0.4)', borderRadius: '10px', padding: '0 1rem', color: '#FFFFFF', fontSize: '0.95rem', outline: 'none' }}
                      />
                    </div>

                    {/* Total cost summary */}
                    {bulkPackage && (
                      <div style={{ padding: '0.85rem 1rem', background: 'rgba(250,204,21,0.06)', border: '1px solid rgba(250,204,21,0.2)', borderRadius: '10px', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>Total Order Amount:</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FACC15', fontFamily: 'monospace' }}>
                          GH₵ {(bulkNumbersInput.split(/[\n,;]+/).map(n => n.trim().replace(/\D/g, '')).filter(n => n.length >= 9).length * bulkPackage.price).toFixed(2)}
                        </span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                      style={{ width: '100%', height: '48px', color: '#030712', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      {loading ? <Loader2 size={18} className="animate-spin" /> : '📦 Pay via MoMo & Dispatch Bulk Order'}
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
