import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { WalletService } from '@/services/WalletService';
import { HubtelPaymentService } from '@/services/HubtelPaymentService';

const hubtelService = new HubtelPaymentService();
const walletService = new WalletService();

/**
 * POST /api/hubtel/receive-money
 * Initiates a Hubtel MoMo collection request (prompt-to-pay).
 * Body: { userId, walletId, amount, customerMsisdn, customerName, customerEmail?, description? }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { userId, walletId, amount, customerMsisdn, customerName, customerEmail, description } = body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Valid amount is required.' },
        { status: 400 }
      );
    }

    if (!customerMsisdn || !customerName) {
      return NextResponse.json(
        { success: false, message: 'Customer name and mobile number are required.' },
        { status: 400 }
      );
    }

    // Resolve user & wallet if missing
    if ((!userId || !walletId || userId?.includes('DEMO')) && isSupabaseConfigured()) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          userId = user.id;
          const { data: wallet } = await supabase
            .from('wallets')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();
          if (wallet) walletId = wallet.id;
        }
      } catch (_) {}
    }

    const clientReference = `HMOMO_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://quicknetdata.com'}/api/hubtel/webhook`;

    const result = await hubtelService.receiveMoney({
      amount: numAmount,
      title: 'Wallet Top-Up',
      description: description || `Wallet top-up of GH₵${numAmount.toFixed(2)}`,
      customerName,
      customerMsisdn,
      customerEmail: customerEmail || '',
      callbackUrl,
      clientReference,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.errorMessage || 'Failed to initiate MoMo payment request.' },
        { status: 400 }
      );
    }

    // Record pending top-up in Supabase
    if (isSupabaseConfigured() && userId) {
      try {
        await supabase.from('transaction_records').insert({
          user_id: userId,
          service_id: 'HUBTEL_MOMO_COLLECTION',
          amount: numAmount,
          recipient: customerMsisdn,
          status: 'pending',
          provider_reference: result.transactionId || clientReference,
        });
      } catch (_) {}
    }

    return NextResponse.json({
      success: true,
      message: `A payment prompt of GH₵${numAmount.toFixed(2)} has been sent to ${customerMsisdn}. Please approve on your phone.`,
      transactionId: result.transactionId,
      clientReference,
      status: 'pending',
    });
  } catch (error: any) {
    console.error('[Hubtel Receive Money Error]:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
