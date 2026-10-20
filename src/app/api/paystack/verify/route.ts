import { NextResponse } from 'next/server';
import { paystackService } from '@/lib/paystack';
import { processPaystackOrderFulfillment } from '@/lib/paystackFulfillment';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    const walletId = searchParams.get('walletId');

    if (!reference) {
      return NextResponse.json(
        { success: false, message: 'Transaction reference is required.' },
        { status: 400 }
      );
    }

    // 1. Verify transaction server-side with Paystack
    const verification = await paystackService.verifyTransaction(reference);

    if (!verification.status || !verification.data || verification.data.status !== 'success') {
      return NextResponse.json(
        {
          success: false,
          message: verification.message || 'Payment verification failed or payment not completed.',
        },
        { status: 400 }
      );
    }

    const paystackData = verification.data;
    const amountInGHS = paystackData.amount / 100;
    const currency = paystackData.currency || 'GHS';
    const metadata = paystackData.metadata || {};

    // 2. Delegate to idempotent, transaction-safe fulfillment engine
    const fulfillment = await processPaystackOrderFulfillment({
      reference,
      amountInGHS,
      currency,
      metadata,
      walletId,
      source: 'verify',
    });

    return NextResponse.json({
      success: fulfillment.success,
      message: fulfillment.message,
      amount: fulfillment.amount,
      reference: fulfillment.reference,
      providerReference: fulfillment.providerReference,
      payerPhone: fulfillment.payerPhone,
      recipientPhone: fulfillment.recipientPhone,
      orderDispatched: fulfillment.orderDispatched,
      isRefunded: fulfillment.isRefunded || false,
      status: fulfillment.status,
    });
  } catch (error: any) {
    console.error('[Paystack Verify Route Error]:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
