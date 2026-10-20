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
      console.warn(`[Dispatcher] DatamartGH rejected ${params.reference}: ${dmRes.errorMessage}. Falling back to secondary provider...`);
    } catch (err: any) {
      console.warn(`[Dispatcher] DatamartGH network exception for ${params.reference}: ${err.message}. Checking status before fallback...`);
      // Protect against duplicate dispatch on timeout: verify order status first
      try {
        const queryRes = await datamart.queryStatus(params.reference);
        if (queryRes.success || queryRes.status === 'processing') {
          return {
            success: true,
            provider: 'DatamartGH',
            providerReference: queryRes.providerReference || params.reference,
            status: queryRes.status,
            message: `Data bundle order in progress on network for ${params.recipient}`,
          };
        }
        // If explicitly confirmed failed by provider, log and allow fallback
        console.warn(`[Dispatcher] DatamartGH status query confirmed order did not succeed: ${queryRes.errorMessage}. Proceeding to secondary provider.`);
      } catch (queryErr: any) {
        // Critical: Outcome is uncertain because provider could not be reached to verify.
        // NEVER switch providers while the original purchase outcome remains uncertain!
        console.error(`[Dispatcher] DatamartGH status query failed (${queryErr.message}). Holding in processing to prevent duplicate provider charges.`);
        return {
          success: true,
          provider: 'DatamartGH',
          providerReference: params.reference,
          status: 'processing',
          message: `Data bundle submitted to DatamartGH; confirmation is currently pending verification.`,
        };
      }
    }

    // Tier 2: ResellerXpress fallback (only when primary provider confirmed unavailable)
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
          message: `Data bundle order submitted via ResellerXpress for ${params.recipient}`,
        };
      }
      console.warn(`[Dispatcher] ResellerXpress rejected ${params.reference}: ${rxRes.errorMessage}. Trying Hubtel fallback...`);
    } catch (err: any) {
      console.warn(`[Dispatcher] ResellerXpress network exception for ${params.reference}: ${err.message}`);
      try {
        const queryRes = await reseller.queryStatus(`${params.reference}_RX`);
        if (queryRes.success || queryRes.status === 'processing') {
          return {
            success: true,
            provider: 'ResellerXpress',
            providerReference: queryRes.providerReference || params.reference,
            status: queryRes.status,
            message: `Data bundle order in progress on secondary network for ${params.recipient}`,
          };
        }
        console.warn(`[Dispatcher] ResellerXpress status query confirmed order failed. Proceeding to Hubtel fallback.`);
      } catch (queryErr: any) {
        // Outcome is uncertain: do NOT fall back to Tier 3!
        console.error(`[Dispatcher] ResellerXpress status query failed (${queryErr.message}). Holding in processing.`);
        return {
          success: true,
          provider: 'ResellerXpress',
          providerReference: `${params.reference}_RX`,
          status: 'processing',
          message: `Data bundle submitted to ResellerXpress; confirmation is pending verification.`,
        };
      }
    }

    // Tier 3: Hubtel Commission Services fallback (Data top-up)
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
          message: `Data bundle order submitted via Hubtel Commission Services for ${params.recipient}`,
        };
      }
      console.warn(`[Dispatcher] Hubtel data rejected: ${hbRes.errorMessage}`);
    } catch (err: any) {
      console.error(`[Dispatcher] Hubtel data fallback exception: ${err.message}`);
    }

    return {
      success: false,
      provider: 'None',
      providerReference: params.reference,
      status: 'failed',
      message: 'All active telecom data providers failed or are temporarily unavailable',
    };
  }

  // 2. AIRTIME TOP-UP
  if (normType === 'airtime') {
    // Airtime top-up is routed exclusively to Hubtel Commission Services.
    // (DatamartGH and ResellerXpress are strictly data-bundle providers and do not support airtime).
    try {
      const hbRes = await hubtel.recharge({
        recipient: params.recipient,
        amount: params.amount,
        network,
        serviceType: 'airtime',
        reference: params.reference,
      });

      if (hbRes.success || hbRes.status === 'processing') {
        return {
          success: true,
          provider: 'Hubtel',
          providerReference: hbRes.providerReference || params.reference,
          status: hbRes.status,
          message: `Airtime top-up of GH₵${params.amount.toFixed(2)} dispatched to ${params.recipient}`,
        };
      }

      console.warn(`[Dispatcher] Hubtel airtime rejected for ${params.reference}: ${hbRes.errorMessage}`);
      return {
        success: false,
        provider: 'Hubtel',
        providerReference: params.reference,
        status: 'failed',
        message: hbRes.errorMessage || 'Hubtel airtime delivery rejected by telecom network',
      };
    } catch (err: any) {
      console.error(`[Dispatcher] Hubtel airtime exception: ${err.message}`);
      return {
        success: false,
        provider: 'Hubtel',
        providerReference: params.reference,
        status: 'failed',
        message: err.message || 'Hubtel airtime gateway connection failed',
      };
    }
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
      success: hbRes.success || hbRes.status === 'processing',
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
      message: err.message || 'Bill payment gateway error',
    };
  }
}
