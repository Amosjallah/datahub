import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { HubtelPaymentService } from '@/services/HubtelPaymentService';

const hubtelService = new HubtelPaymentService();

/**
 * POST /api/hubtel/checkout
 * Initiates a Hubtel-hosted online checkout session.
 * Returns a checkoutUrl for the customer to complete payment on Hubtel's page.
 *
 * Body: { amount, description, merchantAccountNumber?, returnUrl?, cancellationUrl? }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      amount,
      description,
      merchantAccountNumber,
      returnUrl,
      cancellationUrl,
      walletId,
      userId,
      service,
      planId,
      capacity,
      network,
      phone,
      payer_phone,
      recipient_phone,
      referral_code,
    } = body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Valid amount is required for checkout.' },
        { status: 400 }
      );
    }

    const clientReference = `HCHK_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const appBase = process.env.NEXT_PUBLIC_APP_URL || 'https://quicknetdata.com';

    const effectivePayer = (payer_phone || phone || '').trim();
    const effectiveRecipient = (recipient_phone || phone || '').trim();

    // If Supabase is available, create pending record with metadata for guest order or wallet top-up
    if (isSupabaseConfigured()) {
      try {
        const serviceId = service ? `HUBTEL_${String(service).toUpperCase()}` : 'HUBTEL_CHECKOUT';
        await supabase.from('transaction_records').insert({
          user_id: userId || null,
          service_id: serviceId,
          amount: numAmount,
          recipient: effectiveRecipient || effectivePayer || 'Hubtel Customer',
          status: 'pending',
          provider_reference: clientReference,
          // Store fulfillment metadata so webhook can dispatch correctly
          metadata: JSON.stringify({
            network: network || 'MTN',
            planId: planId || null,
            capacity: capacity || null,
            payer_phone: effectivePayer,
            recipient_phone: effectiveRecipient,
            service,
          }),
        });
      } catch (insertErr) {
        console.warn('[Hubtel Checkout Record Insert Warning]:', insertErr);
      }
    }

    const defaultReturnUrl = `${appBase}/buy?reference=${clientReference}&gateway=hubtel`;

    const result = await hubtelService.initiateCheckout({
      totalAmount: numAmount,
      description: description || `Payment of GH₵${numAmount.toFixed(2)}`,
      callbackUrl: `${appBase}/api/hubtel/webhook`,
      returnUrl: returnUrl || defaultReturnUrl,
      cancellationUrl: cancellationUrl || `${appBase}/buy?status=cancelled`,
      merchantAccountNumber: merchantAccountNumber || process.env.HUBTEL_MERCHANT_ACCOUNT_NUMBER || process.env.HUBTEL_MERCHANT || process.env.HUBTEL_CLIENT_ID || '',
      clientReference,
    });

    if (!result.success || !result.checkoutUrl) {
      return NextResponse.json(
        { success: false, message: result.errorMessage || 'Failed to create Hubtel checkout session.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: result.checkoutUrl,
      clientReference,
      message: 'Hubtel checkout session created. Redirect the customer to the checkoutUrl.',
    });
  } catch (error: any) {
    console.error('[Hubtel Checkout Error]:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error creating checkout' },
      { status: 500 }
    );
  }
}
