import { NextResponse } from 'next/server';
import { paystackService } from '@/lib/paystack';
import { processPaystackOrderFulfillment } from '@/lib/paystackFulfillment';

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
      const currency = data.currency || 'GHS';
      const metadata = data.metadata || {};
      const walletId = metadata.walletId || null;

      if (reference) {
        try {
          await processPaystackOrderFulfillment({
            reference,
            amountInGHS,
            currency,
            metadata,
            walletId,
            source: 'webhook',
          });
        } catch (fulfillmentErr: any) {
          console.error('[Paystack Webhook Fulfillment Error]:', fulfillmentErr.message);
        }
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error: any) {
    console.error('[Paystack Webhook Processing Error]:', error);
    return NextResponse.json({ message: 'Server error processing webhook' }, { status: 500 });
  }
}
