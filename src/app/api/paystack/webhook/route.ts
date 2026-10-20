import { NextResponse } from 'next/server';
import { paystackService } from '@/lib/paystack';
import { WalletService } from '@/services/WalletService';
import { dispatchTelecomService } from '@/lib/dispatcher';

const walletService = new WalletService();

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    if (!signature) {
      return NextResponse.json({ message: 'Missing signature header' }, { status: 400 });
    }

    const isValid = paystackService.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      return NextResponse.json({ message: 'Invalid Paystack signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'charge.success') {
      const data = event.data;
      const reference = data.reference;
      const amountInGHS = data.amount / 100;
      const walletId = data.metadata?.walletId;

      if (walletId && reference) {
        try {
          await walletService.credit({
            walletId,
            amount: amountInGHS,
            type: 'credit',
            reference: `PAYSTACK_WH_${reference}`,
            description: `Paystack Deposit Webhook (Ref: ${reference})`,
          });
        } catch (err: any) {
          console.warn('[Paystack Webhook Credit Warning]:', err.message);
        }
      } else {
        // Direct Guest Order: fulfill data/airtime/bill order if not already processed
        const metadata = data.metadata || {};
        const recipientPhone = metadata.recipient_phone || metadata.account_number || metadata.phone;
        const serviceType = (metadata.service || 'data').toLowerCase();
        const network = metadata.network || 'MTN';
        const planId = metadata.planId || metadata.plan_id;
        const capacity = metadata.capacity;

        if (recipientPhone && reference) {
          try {
            await dispatchTelecomService({
              recipient: recipientPhone,
              amount: amountInGHS,
              serviceType: serviceType as any,
              network,
              reference,
              planId,
              capacity,
            });
          } catch (dispatchErr: any) {
            console.error('[Paystack Webhook Dispatch Error]:', dispatchErr.message);
          }
        }
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error: any) {
    console.error('[Paystack Webhook Processing Error]:', error);
    return NextResponse.json({ message: 'Server error processing webhook' }, { status: 500 });
  }
}
