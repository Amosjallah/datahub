import { ProviderAdapterInterface, RechargeRequest, RechargeResponse } from './ProviderAdapterInterface';

export class DummyProviderAdapter implements ProviderAdapterInterface {
  async recharge(request: RechargeRequest): Promise<RechargeResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Force failures for test sandbox numbers
    if (request.recipient.startsWith('0244000')) {
      return {
        success: false,
        errorMessage: 'Sandbox Simulated Upstream Provider Error',
        status: 'failed',
      };
    }

    return {
      success: true,
      providerReference: `DUMMY_REF_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      status: 'success',
    };
  }

  async queryStatus(providerReference: string): Promise<RechargeResponse> {
    return {
      success: true,
      providerReference,
      status: 'success',
    };
  }
}
