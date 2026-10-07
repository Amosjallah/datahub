import { NextResponse } from 'next/server';
import { authenticateApiKey } from '@/lib/apiKeyAuth';
import { DatamartGHProviderAdapter } from '@/services/providers/DatamartGHProviderAdapter';
import { ResellerXpressProviderAdapter } from '@/services/providers/ResellerXpressProviderAdapter';
import { HubtelPaymentService } from '@/services/HubtelPaymentService';
import { WalletService } from '@/services/WalletService';
import { allServices } from '@/lib/servicesData';

const datamart = new DatamartGHProviderAdapter();
const reseller = new ResellerXpressProviderAdapter();
const hubtel = new HubtelPaymentService();
const walletService = new WalletService();

export async function POST(request: Request) {
  try {
    const auth = await authenticateApiKey(request);
    if (!auth.authenticated) {
      return NextResponse.json(
        { status: 'error', message: auth.error || 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const {
      service_id,
      service_type,
      recipient,
      network,
      amount,
      request_id,
      account_number,
    } = body;

    const targetRecipient = recipient || account_number;
    if (!targetRecipient) {
      return NextResponse.json(
        { status: 'error', message: 'Recipient phone number or account/meter number is required.' },
        { status: 400 }
      );
    }

    // Match service configuration if service_id is passed
    let service = service_id ? allServices.find(s => s.id.toUpperCase() === String(service_id).toUpperCase()) : null;
    let finalType = (service?.type || service_type || 'data').toLowerCase();
    let finalNetwork = service?.network || network || 'MTN';
    let finalCost = service ? service.api_price : Number(amount || 0);

    if (!finalCost || isNaN(finalCost) || finalCost <= 0) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid or missing purchase amount.' },
        { status: 400 }
      );
    }

    // Check developer balance
    if (auth.balance !== undefined && auth.balance < finalCost && auth.walletId) {
      return NextResponse.json(
        { status: 'error', message: `Insufficient wallet balance. Required: GH₵${finalCost.toFixed(2)}, Current: GH₵${Number(auth.balance).toFixed(2)}.` },
        { status: 402 }
      );
    }

    const reference = request_id || `API_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Debit wallet if walletId exists
    let walletDebited = false;
    if (auth.walletId) {
      try {
        await walletService.debit({
          walletId: auth.walletId,
          amount: finalCost,
          type: 'debit',
          reference,
          description: `API Order: ${finalNetwork} ${service?.name || finalType} for ${targetRecipient}`,
        });
        walletDebited = true;
      } catch (err: any) {
        return NextResponse.json(
          { status: 'error', message: err.message || 'Failed to debit partner wallet.' },
          { status: 402 }
        );
      }
    }

    let providerSuccess = false;
    let providerRef = reference;
    let providerMessage = '';

    // Route by service type:
    if (finalType === 'data') {
      // 1. Try DatamartGH
      try {
        const dmRes = await datamart.recharge({
          recipient: targetRecipient,
          amount: finalCost,
          network: finalNetwork as any,
          serviceType: 'data',
          reference,
        });

        if (dmRes.success || dmRes.status === 'processing') {
          providerSuccess = true;
          providerRef = dmRes.providerReference || reference;
          providerMessage = 'Data bundle dispatched successfully';
        } else {
          // 2. Fallback to ResellerXpress
          const rxRes = await reseller.recharge({
            recipient: targetRecipient,
            amount: finalCost,
            network: finalNetwork as any,
            serviceType: 'data',
            reference: `${reference}_RX`,
          });

          if (rxRes.success || rxRes.status === 'processing') {
            providerSuccess = true;
            providerRef = rxRes.providerReference || reference;
            providerMessage = 'Data bundle dispatched via backup gateway';
          } else {
            providerMessage = rxRes.errorMessage || dmRes.errorMessage || 'Data delivery failed';
          }
        }
      } catch (err: any) {
        providerMessage = err.message;
      }
    } else if (finalType === 'airtime') {
      try {
        const airRes = await datamart.recharge({
          recipient: targetRecipient,
          amount: finalCost,
          network: finalNetwork as any,
          serviceType: 'airtime',
          reference,
        });

        if (airRes.success || airRes.status === 'processing') {
          providerSuccess = true;
          providerRef = airRes.providerReference || reference;
          providerMessage = 'Airtime credited successfully';
        } else {
          providerMessage = airRes.errorMessage || 'Airtime dispatch failed';
        }
      } catch (err: any) {
        providerMessage = err.message;
      }
    } else if (finalType === 'bill' || finalType === 'tv') {
      // Hubtel bills / disbursements
      try {
        const hRes = await hubtel.sendMoney({
          amount: finalCost,
          recipientName: `${finalNetwork} Customer`,
          recipientMsisdn: targetRecipient,
          description: `Bill Settlement ${finalNetwork} - ${targetRecipient}`,
          clientReference: reference,
          callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://quicknetdata.com'}/api/hubtel/webhook`,
        });

        if (hRes.success) {
          providerSuccess = true;
          providerRef = hRes.transactionId || reference;
          providerMessage = `${finalNetwork} payment successfully processed`;
        } else {
          providerMessage = hRes.errorMessage || 'Bill payment provider rejected';
        }
      } catch (err: any) {
        providerMessage = err.message;
      }
    }

    // If provider failed, refund wallet
    if (!providerSuccess && walletDebited && auth.walletId) {
      try {
        await walletService.credit({
          walletId: auth.walletId,
          amount: finalCost,
          type: 'credit',
          reference: `REFUND_${reference}`,
          description: `Automatic Refund: Failed API order (${reference})`,
        });
      } catch (_) {}

      return NextResponse.json(
        {
          status: 'failed',
          message: providerMessage || 'Service fulfillment failed. Wallet was not charged.',
          reference,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: {
        reference,
        provider_reference: providerRef,
        service: service?.name || `${finalNetwork} ${finalType.toUpperCase()}`,
        network: finalNetwork,
        recipient: targetRecipient,
        amount_debited: finalCost,
        currency: 'GHS',
        transaction_status: 'delivered',
        message: providerMessage || 'Transaction completed successfully.',
        created_at: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('[API Transaction Purchase Error]:', error);
    return NextResponse.json(
      { status: 'error', message: error.message || 'Internal API server error' },
      { status: 500 }
    );
  }
}
