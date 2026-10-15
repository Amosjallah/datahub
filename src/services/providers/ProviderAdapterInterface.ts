export interface RechargeRequest {
  recipient: string;
  amount: number;
  network: 'MTN' | 'Telecel' | 'AirtelTigo' | 'ECG' | 'GWCL' | string;
  serviceType: 'data' | 'airtime' | 'bill';
  reference: string;
  planId?: number | string;
  capacity?: string | number;
}

export interface RechargeResponse {
  success: boolean;
  providerReference?: string;
  errorMessage?: string;
  status: 'success' | 'failed' | 'processing';
}

export interface ProviderAdapterInterface {
  recharge(request: RechargeRequest): Promise<RechargeResponse>;
  queryStatus(providerReference: string): Promise<RechargeResponse>;
}
