import { NextResponse } from 'next/server';
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

    const result = await hubtelService.initiateCheckout({
      totalAmount: numAmount,
      description: description || `Wallet top-up of GH₵${numAmount.toFixed(2)}`,
      callbackUrl: `${appBase}/api/hubtel/webhook`,
      returnUrl: returnUrl || `${appBase}/wallet?status=success`,
      cancellationUrl: cancellationUrl || `${appBase}/wallet?status=cancelled`,
      merchantAccountNumber: merchantAccountNumber || process.env.HUBTEL_CLIENT_ID || '',
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
