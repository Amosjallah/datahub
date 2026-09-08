import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { WalletService } from '@/services/WalletService';

const walletService = new WalletService();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { userId, walletId, provider, account, amount, billType } = body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Valid bill payment amount is required.' },
        { status: 400 }
      );
    }

    if (!account || !provider) {
      return NextResponse.json(
        { success: false, message: 'Provider and account/meter number are required.' },
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
        console.warn('[Bills API] Auth resolution notice:', authErr);
      }
    }

    if (!walletId) {
      return NextResponse.json(
        { success: false, message: 'Active wallet required to pay bills. Please fund your wallet.' },
        { status: 401 }
      );
    }

    const reference = `BILL_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // 1. Debit wallet
    try {
      await walletService.debit({
        walletId,
        amount: numAmount,
        type: 'debit',
        reference,
        description: `Utility Payment: ${provider} (Acc: ${account}) - GH₵${numAmount.toFixed(2)}`,
      });
    } catch (debitErr: any) {
      return NextResponse.json(
        { success: false, message: debitErr.message || 'Insufficient wallet balance for this bill payment.' },
        { status: 400 }
      );
    }

    // 2. Record in Supabase
    if (isSupabaseConfigured() && userId) {
      try {
        await supabase.from('transaction_records').insert({
          user_id: userId,
          service_id: `BILL_${provider.toUpperCase()}`,
          amount: numAmount,
          recipient: account,
          status: 'success',
          provider_reference: reference,
        });
      } catch (recordErr: any) {
        console.warn('[Bills API] Transaction record save notice:', recordErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${provider} payment of GH₵${numAmount.toFixed(2)} for ${account} completed successfully!`,
      reference,
      status: 'success',
    });
  } catch (error: any) {
    console.error('[Bills Route Error]:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error processing bill payment' },
      { status: 500 }
    );
  }
}
