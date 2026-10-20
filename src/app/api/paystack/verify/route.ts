import { NextResponse } from 'next/server';
import { paystackService } from '@/lib/paystack';
import { WalletService } from '@/services/WalletService';
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase';
import { dispatchTelecomService } from '@/lib/dispatcher';

const walletService = new WalletService();

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

    const verification = await paystackService.verifyTransaction(reference);

    if (verification.status && verification.data && verification.data.status === 'success') {
      const amountInGHS = verification.data.amount / 100;
      const metadata = verification.data.metadata || {};
      const targetWalletId = walletId || metadata.walletId;
      const refCode = metadata.referral_code;

      const payerPhone = metadata.payer_phone || metadata.phone || 'Your MoMo account';
      const recipientPhone = metadata.recipient_phone || metadata.account_number || metadata.phone;

      // 1. Credit wallet if wallet deposit
      if (targetWalletId) {
        try {
          await walletService.credit({
            walletId: targetWalletId,
            amount: amountInGHS,
            type: 'credit',
            reference,
            description: `Paystack Deposit from ${payerPhone} (Ref: ${reference})`,
          });
        } catch (creditError: any) {
          if (!creditError.message?.includes('duplicate') && !creditError.message?.includes('unique')) {
            console.error('[Wallet Credit Error]:', creditError);
          }
        }
      }

      // 2. If guest order, dispatch service to recipient
      let orderDispatched = false;
      let dispatchMessage = '';
      let providerRef = reference;

      if (recipientPhone && (metadata.type === 'guest_order' || !targetWalletId)) {
        const serviceType = (metadata.service || 'data').toLowerCase();
        const network = metadata.network || 'MTN';
        const planId = metadata.planId || metadata.plan_id;
        const capacity = metadata.capacity;

        const result = await dispatchTelecomService({
          recipient: recipientPhone,
          amount: amountInGHS,
          serviceType: serviceType as any,
          network,
          reference,
          planId,
          capacity,
        });

        orderDispatched = result.success;
        providerRef = result.providerReference;
        dispatchMessage = result.message;
      }

      // 3. Process agent referral commission
      if (refCode && isSupabaseConfigured()) {
        try {
          const supabase = createAdminClient();
          const { data: agent } = await supabase
            .from('users')
            .select('id, full_name, email')
            .eq('referral_code', refCode)
            .maybeSingle();

          if (agent) {
            const { data: agentWallet } = await supabase
              .from('wallets')
              .select('id, cached_balance')
              .eq('user_id', agent.id)
              .maybeSingle();

            if (agentWallet) {
              const commissionAmount = Math.max(0.20, Number((amountInGHS * 0.05).toFixed(2)));
              
              await walletService.credit({
                walletId: agentWallet.id,
                amount: commissionAmount,
                type: 'commission',
                reference: `COMM_${reference}`,
                description: `Referral commission from customer order (${reference})`,
              });

              try {
                await supabase.from('referral_orders').insert({
                  agent_id: agent.id,
                  referral_code: refCode,
                  order_reference: reference,
                  order_amount: amountInGHS,
                  commission_amount: commissionAmount,
                  status: 'credited',
                });
              } catch (_) {}
            }
          }
        } catch (refErr) {
          console.warn('[Referral Commission Notice]:', refErr);
        }
      }

      let summary: string;
      if (targetWalletId) {
        summary = `Payment of GH₵${amountInGHS.toFixed(2)} confirmed. Your wallet has been credited!`;
      } else if (orderDispatched) {
        summary = `Payment confirmed. ${dispatchMessage}!`;
      } else {
        summary = `Payment of GH₵${amountInGHS.toFixed(2)} received. Delivery status: ${dispatchMessage}. Ref: ${reference}.`;
      }

      return NextResponse.json({
        success: true,
        message: summary,
        amount: amountInGHS,
        reference,
        providerReference: providerRef,
        payerPhone,
        recipientPhone,
        orderDispatched,
        status: targetWalletId ? 'success' : (orderDispatched ? 'delivered' : 'pending'),
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: verification.message || 'Payment verification failed or payment not completed.',
      },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
