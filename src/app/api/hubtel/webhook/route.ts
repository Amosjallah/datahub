import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { WalletService } from '@/services/WalletService';

const walletService = new WalletService();

/**
 * POST /api/hubtel/webhook
 * Receives Hubtel payment callback notifications.
 * Hubtel sends a POST to this URL when a transaction status changes.
 *
 * Expected Hubtel webhook payload (simplified):
 * {
 *   "ResponseCode": "0000",
 *   "Status": "Success",
 *   "Data": {
 *     "ClientReference": "HMOMO_...",
 *     "TransactionId": "...",
 *     "Amount": 50.00,
 *     "PhoneNumber": "0244123456",
 *     "PaymentType": "momo",
 *     "Description": "Wallet Top-Up"
 *   }
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log('[Hubtel Webhook] Received:', JSON.stringify(body, null, 2));

    // Hubtel uses ResponseCode "0000" for success
    const isSuccess =
      body?.ResponseCode === '0000' ||
      body?.Status?.toLowerCase() === 'success' ||
      body?.Data?.Status?.toLowerCase() === 'success';

    const clientReference: string = body?.Data?.ClientReference || body?.ClientReference || '';
    const transactionId: string = body?.Data?.TransactionId || body?.TransactionId || '';
    const amount: number = parseFloat(body?.Data?.Amount || body?.Amount || '0');
    const phoneNumber: string = body?.Data?.PhoneNumber || body?.Data?.CustomerMsisdn || '';

    if (!clientReference) {
      console.warn('[Hubtel Webhook] Missing ClientReference in payload');
      return NextResponse.json({ received: true }, { status: 200 });
    }

    if (!isSupabaseConfigured()) {
      // Always respond 200 to Hubtel even if DB is unavailable
      return NextResponse.json({ received: true, status: 'supabase_unavailable' }, { status: 200 });
    }

    // Find the pending transaction by provider_reference (clientReference)
    const { data: txRecord, error: findError } = await supabase
      .from('transaction_records')
      .select('id, user_id, amount, status')
      .eq('provider_reference', clientReference)
      .maybeSingle();

    if (findError || !txRecord) {
      // Also try transactionId fallback
      console.warn('[Hubtel Webhook] Transaction not found for reference:', clientReference);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Only process if still pending (avoid double-crediting)
    if (txRecord.status !== 'pending') {
      console.log('[Hubtel Webhook] Transaction already processed:', txRecord.status);
      return NextResponse.json({ received: true, alreadyProcessed: true }, { status: 200 });
    }

    if (isSuccess) {
      // Credit user wallet
      const creditAmount = amount || txRecord.amount;

      if (txRecord.user_id && creditAmount > 0) {
        try {
          // Find the user's wallet
          const { data: wallet } = await supabase
            .from('wallets')
            .select('id')
            .eq('user_id', txRecord.user_id)
            .maybeSingle();

          if (wallet) {
            await walletService.credit({
              walletId: wallet.id,
              amount: creditAmount,
              type: 'credit',
              reference: `HUBTEL_${transactionId || clientReference}`,
              description: `Hubtel MoMo Top-Up — GH₵${creditAmount.toFixed(2)} from ${phoneNumber}`,
            });
          }
        } catch (creditErr: any) {
          console.error('[Hubtel Webhook] Failed to credit wallet:', creditErr.message);
        }
      }

      // Update transaction to success
      await supabase
        .from('transaction_records')
        .update({ status: 'success', provider_reference: transactionId || clientReference })
        .eq('id', txRecord.id);
    } else {
      // Payment failed or was cancelled
      await supabase
        .from('transaction_records')
        .update({ status: 'failed', provider_reference: `FAILED_${clientReference}` })
        .eq('id', txRecord.id);
    }

    // Always respond 200 to Hubtel — they will retry on non-200 responses
    return NextResponse.json({ received: true, processed: true }, { status: 200 });
  } catch (error: any) {
    console.error('[Hubtel Webhook Error]:', error);
    // Still return 200 to prevent Hubtel retry storms
    return NextResponse.json({ received: true, error: 'internal' }, { status: 200 });
  }
}
