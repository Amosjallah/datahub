import { NextResponse } from 'next/server';
import { paystackService } from '@/lib/paystack';
import { WalletService } from '@/services/WalletService';
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase';
import { DatamartGHProviderAdapter } from '@/services/providers/DatamartGHProviderAdapter';
import { ResellerXpressProviderAdapter } from '@/services/providers/ResellerXpressProviderAdapter';
import { HubtelPaymentService } from '@/services/HubtelPaymentService';

const walletService = new WalletService();
const datamart = new DatamartGHProviderAdapter();
const reseller = new ResellerXpressProviderAdapter();
const hubtel = new HubtelPaymentService();

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

        try {
          if (serviceType === 'data') {
            const dmRes = await datamart.recharge({
              recipient: recipientPhone,
              amount: amountInGHS,
              network: network as any,
              serviceType: 'data',
              reference,
              planId,
              capacity,
            });

            if (dmRes.success || dmRes.status === 'processing') {
              orderDispatched = true;
              providerRef = dmRes.providerReference || reference;
              dispatchMessage = dmRes.status === 'success' 
                ? `Data bundle successfully delivered to ${recipientPhone}`
                : `Data bundle order submitted to network for ${recipientPhone}`;
            } else {
              // Try fallback provider
              const rxRes = await reseller.recharge({
                recipient: recipientPhone,
                amount: amountInGHS,
                network: network as any,
                serviceType: 'data',
                reference: `${reference}_RX`,
                planId,
                capacity,
              });

              if (rxRes.success || rxRes.status === 'processing') {
                orderDispatched = true;
                providerRef = rxRes.providerReference || reference;
                dispatchMessage = `Data bundle order submitted via secondary gateway for ${recipientPhone}`;
              } else {
                orderDispatched = false;
                dispatchMessage = dmRes.errorMessage || rxRes.errorMessage || 'Data delivery pending network availability';
                console.warn(`[Paystack Verify Dispatch Failed] Ref=${reference} Reason=${dispatchMessage}`);
              }
            }
          } else if (serviceType === 'airtime') {
            // For airtime, attempt Datamart then report status accurately
            const airRes = await datamart.recharge({
              recipient: recipientPhone,
              amount: amountInGHS,
              network: network as any,
              serviceType: 'airtime',
              reference,
            });

            if (airRes.success || airRes.status === 'processing') {
              orderDispatched = true;
              providerRef = airRes.providerReference || reference;
              dispatchMessage = `Airtime recharge credited to ${recipientPhone}`;
            } else {
              orderDispatched = false;
              dispatchMessage = airRes.errorMessage || 'Airtime dispatch pending network processing';
            }
          } else if (serviceType === 'bills' || serviceType === 'bill' || serviceType === 'tv') {
            const hRes = await hubtel.sendMoney({
              amount: amountInGHS,
              recipientName: `${network} Subscriber`,
              recipientMsisdn: recipientPhone,
              description: `Bill settlement for ${recipientPhone}`,
              clientReference: reference,
              callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://quicknetdata.com'}/api/hubtel/webhook`,
            });
            orderDispatched = hRes.success;
            providerRef = hRes.transactionId || reference;
            dispatchMessage = hRes.success 
              ? `Bill payment processed for account ${recipientPhone}`
              : (hRes.errorMessage || 'Bill payment pending processing');
          }
        } catch (dispatchErr: any) {
          console.warn('[Order Dispatch Notice]:', dispatchErr.message);
          orderDispatched = false;
          dispatchMessage = `Order placed. Service fulfillment in progress for ${recipientPhone}`;
        }
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
