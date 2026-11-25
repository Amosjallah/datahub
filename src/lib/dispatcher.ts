import { DatamartGHProviderAdapter } from '@/services/providers/DatamartGHProviderAdapter';

const datamart = new DatamartGHProviderAdapter();

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
  provider: 'DatamartGH' | 'None';
  providerReference: string;
  status: 'success' | 'processing' | 'failed';
  message: string;
}

/**
 * Universal Service Dispatcher — routed exclusively through DatamartGH.
 * (Hubtel and ResellerXpress integrations have been discontinued).
 */
export async function dispatchTelecomService(params: DispatchParams): Promise<DispatchResult> {
  const normType = params.serviceType.toLowerCase();
  const network = params.network || 'MTN';

  // 1. DATA BUNDLES (DatamartGH only)
  if (normType === 'data') {
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
            : `Data bundle submitted to DatamartGH for ${params.recipient}`,
        };
      }

      return {
        success: false,
        provider: 'DatamartGH',
        providerReference: dmRes.providerReference || params.reference,
        status: 'failed',
        message: dmRes.errorMessage || 'DatamartGH rejected the data bundle order',
      };
    } catch (err: any) {
      console.warn(`[Dispatcher] DatamartGH network exception for ${params.reference}: ${err.message}. Checking status...`);
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
        return {
          success: false,
          provider: 'DatamartGH',
          providerReference: queryRes.providerReference || params.reference,
          status: 'failed',
          message: queryRes.errorMessage || 'DatamartGH order failed',
        };
      } catch (queryErr: any) {
        console.error(`[Dispatcher] DatamartGH status query failed (${queryErr.message}). Holding in processing to prevent duplicate charges.`);
        return {
          success: true,
          provider: 'DatamartGH',
          providerReference: params.reference,
          status: 'processing',
          message: 'Data bundle submitted to DatamartGH; confirmation is currently pending verification.',
        };
      }
    }
  }

  // 2. AIRTIME, BILLS & TV (Discontinued with Hubtel removal; DatamartGH supports data bundles only)
  return {
    success: false,
    provider: 'None',
    providerReference: params.reference,
    status: 'failed',
    message: `${normType.toUpperCase()} service is currently unavailable. Only DatamartGH data bundles are active.`,
  };
}
