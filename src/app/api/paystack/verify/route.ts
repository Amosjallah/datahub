import { NextResponse } from 'next/server';
import { paystackService } from '@/lib/paystack';
import { WalletService } from '@/services/WalletService';
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase';
import { DatamartGHProviderAdapter } from '@/services/providers/DatamartGHProviderAdapter';
import { ResellerXpressProviderAdapter } from '@/services/providers/ResellerXpressProviderAdapter';

const walletService = new WalletService();
const datamart = new DatamartGHProviderAdapter();
const reseller = new ResellerXpressProviderAdapter();

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

      // 1. Credit wallet if wallet deposit
      if (targetWalletId) {
        try {
          await walletService.credit({
            walletId: targetWalletId,
            amount: amountInGHS,
            type: 'credit',
            reference,
            description: `Paystack Deposit (Ref: ${reference})`,
          });
        } catch (creditError: any) {
          if (!creditError.message?.includes('duplicate') && !creditError.message?.includes('unique')) {
            console.error('[Wallet Credit Error]:', creditError);
          }
        }
      }

      // 2. If guest order, dispatch service to recipient phone
      let orderDispatched = false;
      if (metadata.phone && (metadata.type === 'guest_order' || !targetWalletId)) {
        try {
          const serviceType = metadata.service || 'data';
          const network = metadata.network || 'MTN';
          
          if (serviceType === 'data') {
            const dmRes = await datamart.recharge({
              recipient: metadata.phone,
              amount: amountInGHS,
              network: network as any,
              serviceType: 'data',
              reference,
            });

            if (dmRes.success || dmRes.status === 'processing') {
              orderDispatched = true;
            } else {
              const rxRes = await reseller.recharge({
                recipient: metadata.phone,
                amount: amountInGHS,
                network: network as any,
                serviceType: 'data',
                reference: `${reference}_RX`,
              });
              orderDispatched = rxRes.success || rxRes.status === 'processing';
            }
          } else if (serviceType === 'airtime') {
            const airRes = await datamart.recharge({
              recipient: metadata.phone,
              amount: amountInGHS,
              network: network as any,
              serviceType: 'airtime',
              reference,
            });
            orderDispatched = airRes.success || airRes.status === 'processing';
          }
        } catch (dispatchErr) {
          console.warn('[Order Dispatch Notice]:', dispatchErr);
        }
      }

      // 3. Process agent referral commission
      if (refCode && isSupabaseConfigured()) {
        try {
          const supabase = createAdminClient();
          // Find agent with this referral code
          const { data: agent } = await supabase
            .from('users')
            .select('id, full_name, email')
            .eq('referral_code', refCode)
            .maybeSingle();

          if (agent) {
            // Find agent's wallet
            const { data: agentWallet } = await supabase
              .from('wallets')
              .select('id, cached_balance')
              .eq('user_id', agent.id)
              .maybeSingle();

            if (agentWallet) {
              // 5% commission on purchase
              const commissionAmount = Math.max(0.20, Number((amountInGHS * 0.05).toFixed(2)));
              
              await walletService.credit({
                walletId: agentWallet.id,
                amount: commissionAmount,
                type: 'commission',
                reference: `COMM_${reference}`,
                description: `Referral commission from customer order (${reference})`,
              });

              // Record in referral orders table if exists
              await supabase.from('referral_orders').insert({
                agent_id: agent.id,
                referral_code: refCode,
                order_reference: reference,
                order_amount: amountInGHS,
                commission_amount: commissionAmount,
                status: 'credited',
              }).catch(() => {});
            }
          }
        } catch (refErr) {
          console.warn('[Referral Commission Notice]:', refErr);
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Payment verified and order processed successfully.',
        amount: amountInGHS,
        reference,
        orderDispatched,
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
