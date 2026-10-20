import { DatamartGHProviderAdapter } from '@/services/providers/DatamartGHProviderAdapter';
import { ResellerXpressProviderAdapter } from '@/services/providers/ResellerXpressProviderAdapter';
import { HubtelProviderAdapter } from '@/services/providers/HubtelProviderAdapter';

const datamart = new DatamartGHProviderAdapter();
const reseller = new ResellerXpressProviderAdapter();
const hubtel = new HubtelProviderAdapter();

export interface DispatchParams {
  recipient: string;
  amount: number;
  serviceType: 'data' | 'airtime' | 'bill' | 'bills' | 'tv';
  network: string;
  reference: string;
  planId?: string | number;
  capacity?: string | number;
}

export interface DispatchResult {
  success: boolean;
  provider: 'DatamartGH' | 'ResellerXpress' | 'Hubtel' | 'None';
  providerReference: string;
  status: 'success' | 'processing' | 'failed';
  message: string;
}

/**
 * Universal Service Dispatcher with resilient multi-tier fallback:
 * 1. Data: DatamartGH -> ResellerXpress -> Hubtel
 * 2. Airtime: DatamartGH -> Hubtel -> ResellerXpress
 * 3. Bills / TV: Hubtel
 */
export async function dispatchTelecomService(params: DispatchParams): Promise<DispatchResult> {
  const normType = params.serviceType.toLowerCase();
  const network = params.network || 'MTN';

  // 1. DATA BUNDLES
  if (normType === 'data') {
    // Tier 1: DatamartGH
    try {
      const dmRes = await datamart.recharge({
        recipient: params.recipient,
        amount: params.amount,
        network,
        serviceType: 'data',
        reference: params.reference,
        planId: params.planId,
        capacity: params.capacity,
      });

      if (dmRes.success || dmRes.status === 'processing') {
        return {
          success: true,
          provider: 'DatamartGH',
          providerReference: dmRes.providerReference || params.reference,
          status: dmRes.status,
          message: dmRes.status === 'success'
            ? `Data bundle successfully delivered to ${params.recipient}`
            : `Data bundle submitted to network for ${params.recipient}`,
        };
      }
      console.warn(`[Dispatcher] DatamartGH failed for ${params.reference}: ${dmRes.errorMessage}. Falling back to ResellerXpress...`);
    } catch (err: any) {
      console.warn(`[Dispatcher] DatamartGH exception: ${err.message}. Falling back...`);
    }

    // Tier 2: ResellerXpress fallback
    try {
      const rxRes = await reseller.recharge({
        recipient: params.recipient,
        amount: params.amount,
        network,
        serviceType: 'data',
        reference: `${params.reference}_RX`,
        planId: params.planId,
        capacity: params.capacity,
      });

      if (rxRes.success || rxRes.status === 'processing') {
        return {
          success: true,
          provider: 'ResellerXpress',
          providerReference: rxRes.providerReference || params.reference,
          status: rxRes.status,
          message: `Data bundle order submitted via secondary gateway for ${params.recipient}`,
        };
      }
      console.warn(`[Dispatcher] ResellerXpress failed for ${params.reference}: ${rxRes.errorMessage}. Falling back to Hubtel...`);
    } catch (err: any) {
      console.warn(`[Dispatcher] ResellerXpress exception: ${err.message}. Falling back to Hubtel...`);
    }

    // Tier 3: Hubtel fallback
    try {
      const hbRes = await hubtel.recharge({
        recipient: params.recipient,
        amount: params.amount,
        network,
        serviceType: 'data',
        reference: `${params.reference}_HB`,
        planId: params.planId,
        capacity: params.capacity,
      });

      if (hbRes.success || hbRes.status === 'processing') {
        return {
          success: true,
          provider: 'Hubtel',
          providerReference: hbRes.providerReference || params.reference,
          status: hbRes.status,
          message: `Data bundle order submitted via Hubtel gateway for ${params.recipient}`,
        };
      }
    } catch (err: any) {
      console.error(`[Dispatcher] Hubtel data fallback exception: ${err.message}`);
    }

    return {
      success: false,
      provider: 'None',
      providerReference: params.reference,
      status: 'failed',
      message: 'All telecom data providers failed or are temporarily unavailable',
    };
  }

  // 2. AIRTIME TOP-UP
  if (normType === 'airtime') {
    // Tier 1: DatamartGH
    try {
      const dmRes = await datamart.recharge({
        recipient: params.recipient,
        amount: params.amount,
        network,
        serviceType: 'airtime',
        reference: params.reference,
      });

      if (dmRes.success || dmRes.status === 'processing') {
        return {
          success: true,
          provider: 'DatamartGH',
          providerReference: dmRes.providerReference || params.reference,
          status: dmRes.status,
          message: `Airtime recharge credited to ${params.recipient}`,
        };
      }
      console.warn(`[Dispatcher] DatamartGH airtime failed: ${dmRes.errorMessage}. Trying Hubtel airtime gateway...`);
    } catch (err: any) {
      console.warn(`[Dispatcher] DatamartGH airtime exception: ${err.message}`);
    }

    // Tier 2: Hubtel direct airtime / disbursement
    try {
      const hbRes = await hubtel.recharge({
        recipient: params.recipient,
        amount: params.amount,
        network,
        serviceType: 'airtime',
        reference: `${params.reference}_HB`,
      });

      if (hbRes.success || hbRes.status === 'processing') {
        return {
          success: true,
          provider: 'Hubtel',
          providerReference: hbRes.providerReference || params.reference,
          status: hbRes.status,
          message: `Airtime recharge credited via Hubtel to ${params.recipient}`,
        };
      }
    } catch (err: any) {
      console.error(`[Dispatcher] Hubtel airtime exception: ${err.message}`);
    }

    return {
      success: false,
      provider: 'None',
      providerReference: params.reference,
      status: 'failed',
      message: 'Airtime dispatch failed across all active providers',
    };
  }

  // 3. BILLS & TV
  try {
    const hbRes = await hubtel.recharge({
      recipient: params.recipient,
      amount: params.amount,
      network,
      serviceType: 'bill',
      reference: params.reference,
    });

    return {
      success: hbRes.success,
      provider: 'Hubtel',
      providerReference: hbRes.providerReference || params.reference,
      status: hbRes.status,
      message: hbRes.success
        ? `Bill payment processed for account ${params.recipient}`
        : (hbRes.errorMessage || 'Bill payment pending processing'),
    };
  } catch (err: any) {
    return {
      success: false,
      provider: 'Hubtel',
      providerReference: params.reference,
      status: 'failed',
      message: err.message || 'Bill payment settlement error',
    };
  }
}
