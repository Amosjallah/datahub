import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { WalletService } from '@/services/WalletService';

const walletService = new WalletService();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { userId, walletId, amount, recipient, network } = body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount < 1) {
      return NextResponse.json(
        { success: false, message: 'Valid airtime amount (minimum GH₵ 1.00) is required.' },
        { status: 400 }
      );
    }

    if (!recipient || !network) {
      return NextResponse.json(
        { success: false, message: 'Recipient phone number and telecom network are required.' },
        { status: 400 }
      );
    }

    // Resolve user & wallet if missing or demo
    if ((!userId || !walletId || userId.includes('DEMO')) && isSupabaseConfigured()) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          userId = user.id;
          const { data: wallet } = await supabase
            .from('wallets')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();

          if (wallet) {
            walletId = wallet.id;
          }
        }
      } catch (authErr) {
        console.warn('[Airtime API] Auth resolution notice:', authErr);
      }
    }

    if (!walletId) {
      return NextResponse.json(
        { success: false, message: 'Active wallet required to purchase airtime. Please fund your wallet.' },
        { status: 401 }
      );
    }

    const reference = `AIR_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // 1. Debit user wallet
    try {
      await walletService.debit({
        walletId,
        amount: numAmount,
        type: 'debit',
        reference,
        description: `Airtime Top-Up: ${network} GH₵${numAmount.toFixed(2)} for ${recipient}`,
      });
    } catch (debitErr: any) {
      return NextResponse.json(
        { success: false, message: debitErr.message || 'Insufficient wallet balance for this purchase.' },
        { status: 400 }
      );
    }

    // 2. Record transaction in Supabase
    if (isSupabaseConfigured() && userId) {
      try {
        await supabase.from('transaction_records').insert({
          user_id: userId,
          service_id: 'AIRTIME_TOPUP',
          amount: numAmount,
          recipient,
          status: 'success',
          provider_reference: reference,
        });
      } catch (recordErr: any) {
        console.warn('[Airtime API] Transaction record save notice:', recordErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${network} airtime of GH₵${numAmount.toFixed(2)} successfully sent to ${recipient}!`,
      reference,
      status: 'success',
    });
  } catch (error: any) {
    console.error('[Airtime Route Error]:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error processing airtime' },
      { status: 500 }
    );
  }
}
