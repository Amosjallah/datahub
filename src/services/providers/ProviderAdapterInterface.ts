export interface RechargeRequest {
  recipient: string;
  amount: number;
  network: 'MTN' | 'Telecel' | 'AirtelTigo' | 'ECG' | 'GWCL';
  serviceType: 'data' | 'airtime' | 'bill';
  reference: string;
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
