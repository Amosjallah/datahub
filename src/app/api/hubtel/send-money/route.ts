import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { HubtelPaymentService } from '@/services/HubtelPaymentService';

const hubtelService = new HubtelPaymentService();

/**
 * POST /api/hubtel/send-money
 * Disburse funds to a customer's MoMo wallet (e.g. agent payouts, refunds).
 * Body: { recipientMsisdn, recipientName, amount, description? }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { recipientMsisdn, recipientName, amount, description } = body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Valid amount is required.' },
        { status: 400 }
      );
    }

    if (!recipientMsisdn || !recipientName) {
      return NextResponse.json(
        { success: false, message: 'Recipient name and mobile number are required.' },
        { status: 400 }
      );
    }

    const clientReference = `HPAY_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://quicknetdata.com'}/api/hubtel/webhook`;

    const result = await hubtelService.sendMoney({
      amount: numAmount,
      recipientName,
      recipientMsisdn,
      description: description || `Payout of GH₵${numAmount.toFixed(2)} to ${recipientMsisdn}`,
      clientReference,
      callbackUrl,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.errorMessage || 'Failed to initiate disbursement.' },
        { status: 400 }
      );
    }

    // Log to Supabase
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('transaction_records').insert({
          service_id: 'HUBTEL_DISBURSEMENT',
          amount: numAmount,
          recipient: recipientMsisdn,
          status: 'pending',
          provider_reference: result.transactionId || clientReference,
        });
      } catch (_) {}
    }

    return NextResponse.json({
      success: true,
      message: `GH₵${numAmount.toFixed(2)} disbursement initiated to ${recipientMsisdn}.`,
      transactionId: result.transactionId,
      clientReference,
      status: 'pending',
    });
  } catch (error: any) {
    console.error('[Hubtel Send Money Error]:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
