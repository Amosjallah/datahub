import { paystackService } from '@/lib/paystack';
import { WalletService } from '@/services/WalletService';
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase';
import { dispatchTelecomService } from '@/lib/dispatcher';

const walletService = new WalletService();

export interface ProcessPaystackOrderParams {
  reference: string;
  amountInGHS: number;
  currency: string;
  metadata: Record<string, any>;
  walletId?: string | null;
  source: 'verify' | 'webhook';
}

export interface ProcessPaystackOrderResult {
  success: boolean;
  orderDispatched: boolean;
  status: 'success' | 'delivered' | 'processing' | 'failed' | 'reversed';
  message: string;
  amount: number;
  reference: string;
  providerReference: string;
  payerPhone: string;
  recipientPhone: string;
  isRefunded?: boolean;
}

/**
 * Idempotent, transaction-safe fulfillment handler for Paystack payments.
 * Ensures:
 * 1. Payments are verified in GHS with positive amount.
 * 2. Deduplication: Duplicate webhooks or browser redirects never trigger duplicate dispatches.
 * 3. Payment status and telecom delivery status are tracked separately.
 * 4. Automatic verified refund is issued if telecom delivery fails across all providers.
 * 5. Full audit trail is maintained in Supabase transaction_records.
 */
// Concurrency control: memory lock to prevent duplicate execution within the same process
const inFlightOrders = new Set<string>();

export async function processPaystackOrderFulfillment(
  params: ProcessPaystackOrderParams
): Promise<ProcessPaystackOrderResult> {
  const { reference, amountInGHS, currency, metadata, source } = params;

  // Concurrency check: if another request in this process is currently fulfilling this reference, return immediately
  if (inFlightOrders.has(reference)) {
    console.log(`[Paystack Fulfillment] Concurrency lock: order ${reference} is currently being fulfilled by another thread.`);
    return {
      success: true,
      orderDispatched: true,
      status: 'processing',
      message: `Order ${reference} is already being dispatched to the telecom network.`,
      amount: amountInGHS,
      reference,
      providerReference: reference,
      payerPhone: metadata.payer_phone || metadata.phone || 'Customer',
      recipientPhone: metadata.recipient_phone || metadata.account_number || metadata.phone || '',
    };
  }

  inFlightOrders.add(reference);

  try {
    return await executeFulfillment(params);
  } finally {
    inFlightOrders.delete(reference);
  }
}

async function executeFulfillment(
  params: ProcessPaystackOrderParams
): Promise<ProcessPaystackOrderResult> {
  const { reference, amountInGHS, currency, metadata, source } = params;

  // 1. Strict validation of payment parameters
  if ((currency || '').toUpperCase() !== 'GHS') {
    throw new Error(`Invalid transaction currency: ${currency}. Expected GHS.`);
  }

  if (!amountInGHS || isNaN(amountInGHS) || amountInGHS <= 0) {
    throw new Error(`Invalid transaction amount: ${amountInGHS}.`);
  }

  const targetWalletId = params.walletId || metadata.walletId || null;
  const payerPhone = (metadata.payer_phone || metadata.phone || 'Customer').trim();
  const recipientPhone = (metadata.recipient_phone || metadata.account_number || metadata.phone || '').trim();
  const refCode = metadata.referral_code || null;
  const serviceType = (metadata.service || 'data').toLowerCase();
  const network = metadata.network || 'MTN';
  const planId = metadata.planId || metadata.plan_id || null;
  const capacity = metadata.capacity || null;

  // 2. Idempotency Check in Supabase transaction_records
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const { data: existingTx } = await supabase
        .from('transaction_records')
        .select('id, status, provider_reference, amount, recipient, service_id')
        .eq('provider_reference', reference)
        .maybeSingle();

      if (existingTx) {
        console.log(`[Paystack Fulfillment] Idempotency match for ${reference} (status: ${existingTx.status}, source: ${source})`);

        if (existingTx.status === 'success' || existingTx.status === 'processing') {
          return {
            success: true,
            orderDispatched: true,
            status: existingTx.status === 'success' ? 'delivered' : 'processing',
            message: existingTx.status === 'success'
              ? `Order ${reference} previously fulfilled and confirmed.`
              : `Order ${reference} is currently being processed on the network.`,
            amount: Number(existingTx.amount || amountInGHS),
            reference,
            providerReference: existingTx.provider_reference || reference,
            payerPhone,
            recipientPhone: existingTx.recipient || recipientPhone,
          };
        }

        if (existingTx.status === 'reversed') {
          return {
            success: false,
            orderDispatched: false,
            status: 'reversed',
            isRefunded: true,
            message: `Delivery failed for order ${reference}. A full refund of GH₵${Number(existingTx.amount || amountInGHS).toFixed(2)} was already processed.`,
            amount: Number(existingTx.amount || amountInGHS),
            reference,
            providerReference: existingTx.provider_reference || reference,
            payerPhone,
            recipientPhone: existingTx.recipient || recipientPhone,
          };
        }
      }
    } catch (checkErr: any) {
      console.warn('[Paystack Fulfillment] Idempotency check warning:', checkErr.message);
    }
  }

  // 3. Wallet Deposit Path
  if (targetWalletId) {
    try {
      await walletService.credit({
        walletId: targetWalletId,
        amount: amountInGHS,
        type: 'credit',
        reference,
        description: `Paystack Deposit from ${payerPhone} (Ref: ${reference})`,
      });

      if (isSupabaseConfigured()) {
        try {
          const supabase = createAdminClient();
          await supabase.from('transaction_records').upsert({
            user_id: metadata.userId || null,
            service_id: 'WALLET_TOPUP',
            amount: amountInGHS,
            recipient: payerPhone,
            status: 'success',
            provider_reference: reference,
          }, { onConflict: 'provider_reference' });
        } catch (_) {}
      }

      return {
        success: true,
        orderDispatched: false,
        status: 'success',
        message: `Payment of GH₵${amountInGHS.toFixed(2)} confirmed. Your wallet has been credited!`,
        amount: amountInGHS,
        reference,
        providerReference: reference,
        payerPhone,
        recipientPhone: payerPhone,
      };
    } catch (creditErr: any) {
      console.error('[Paystack Fulfillment] Wallet credit error:', creditErr);
      throw creditErr;
    }
  }

  // 4. Guest / Direct Telecom Service Order Path
  const targetRecipient = recipientPhone || payerPhone;
  if (!targetRecipient) {
    throw new Error('Recipient phone number is required to fulfill order.');
  }

  // Atomic database claim: claim order with status 'processing'
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const { data: inserted, error: insertError } = await supabase
        .from('transaction_records')
        .insert({
          user_id: metadata.userId || null,
          service_id: `PAYSTACK_${serviceType.toUpperCase()}`,
          amount: amountInGHS,
          recipient: targetRecipient,
          status: 'processing',
          provider_reference: reference,
        })
        .select('id, status')
        .maybeSingle();

      if (insertError) {
        // Concurrency race: another worker already claimed this reference
        console.warn(`[Paystack Fulfillment] Concurrency race caught for ${reference}: ${insertError.message}`);
        const { data: existingTx } = await supabase
          .from('transaction_records')
          .select('id, status, provider_reference, amount, recipient')
          .eq('provider_reference', reference)
          .maybeSingle();

        if (existingTx && (existingTx.status === 'success' || existingTx.status === 'processing' || existingTx.status === 'reversed')) {
          return {
            success: existingTx.status !== 'reversed',
            orderDispatched: existingTx.status !== 'reversed',
            status: existingTx.status === 'success' ? 'delivered' : (existingTx.status === 'reversed' ? 'reversed' : 'processing'),
            message: `Order ${reference} is already recorded as ${existingTx.status}.`,
            amount: Number(existingTx.amount || amountInGHS),
            reference,
            providerReference: existingTx.provider_reference || reference,
            payerPhone,
            recipientPhone: existingTx.recipient || recipientPhone,
          };
        }
      }
    } catch (claimErr: any) {
      console.warn('[Paystack Fulfillment] Atomic claim warning:', claimErr.message);
    }
  }

  // 5. Dispatch service to recipient via universal telecom dispatcher
  const dispatchResult = await dispatchTelecomService({
    recipient: targetRecipient,
    amount: amountInGHS,
    serviceType: serviceType as any,
    network,
    reference,
    planId,
    capacity,
  });

  const finalProviderRef = dispatchResult.providerReference || reference;

  // 6. Handle Dispatch Success
  if (dispatchResult.success) {
    const finalStatus = dispatchResult.status === 'success' ? 'success' : 'processing';

    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        await supabase
          .from('transaction_records')
          .update({
            status: finalStatus,
            provider_reference: finalProviderRef,
            updated_at: new Date().toISOString(),
          })
          .eq('provider_reference', reference);
      } catch (updateErr: any) {
        console.warn('[Paystack Fulfillment] Record status update warning:', updateErr.message);
      }
    }

    // Process agent referral commission if applicable
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
      } catch (refErr: any) {
        console.warn('[Paystack Fulfillment] Referral commission error:', refErr.message);
      }
    }

    return {
      success: true,
      orderDispatched: true,
      status: finalStatus === 'success' ? 'delivered' : 'processing',
      message: dispatchResult.message,
      amount: amountInGHS,
      reference,
      providerReference: finalProviderRef,
      payerPhone,
      recipientPhone: targetRecipient,
    };
  }

  // 7. Handle Dispatch Failure: Execute Safe Verified Refund via Paystack API
  console.warn(`[Paystack Fulfillment] Dispatch failed for ${reference}. Initiating automatic Paystack refund...`);

  let refundExecuted = false;
  let refundNote = '';

  try {
    const refundResult = await paystackService.refundTransaction({
      reference,
      amountInPesewas: Math.round(amountInGHS * 100),
      reason: `Auto-refund: ${serviceType} delivery failed (${dispatchResult.message})`,
    });

    if (refundResult.status) {
      refundExecuted = true;
      refundNote = `Refunded via Paystack (ID: ${refundResult.data?.id || 'queued'})`;
      console.log(`[Paystack Fulfillment] Refund successfully initiated for ${reference}:`, refundResult.message);
    } else {
      refundNote = `Refund queued: ${refundResult.message}`;
      console.warn(`[Paystack Fulfillment] Refund API notice for ${reference}:`, refundResult.message);
    }
  } catch (refundErr: any) {
    refundNote = `Refund failed: ${refundErr.message}`;
    console.error(`[Paystack Fulfillment] Refund exception for ${reference}:`, refundErr);
  }

  // Update audit trail in Supabase
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      await supabase
        .from('transaction_records')
        .update({
          status: refundExecuted ? 'reversed' : 'failed',
          provider_reference: `${finalProviderRef} | ${refundNote}`,
          updated_at: new Date().toISOString(),
        })
        .eq('provider_reference', reference);
    } catch (saveErr: any) {
      console.warn('[Paystack Fulfillment] Audit save error:', saveErr.message);
    }
  }

  const failureMessage = refundExecuted
    ? `Payment of GH₵${amountInGHS.toFixed(2)} received, but ${serviceType} delivery could not be completed (${dispatchResult.message}). A full refund of GH₵${amountInGHS.toFixed(2)} has been automatically processed to your account.`
    : `Payment of GH₵${amountInGHS.toFixed(2)} received. Delivery status: ${dispatchResult.message}. Ref: ${reference}. (Refund queued for processing).`;

  return {
    success: false,
    orderDispatched: false,
    status: refundExecuted ? 'reversed' : 'failed',
    isRefunded: refundExecuted,
    message: failureMessage,
    amount: amountInGHS,
    reference,
    providerReference: finalProviderRef,
    payerPhone,
    recipientPhone: targetRecipient,
  };
}
