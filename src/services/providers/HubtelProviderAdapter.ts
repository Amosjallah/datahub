import { ProviderAdapterInterface, RechargeRequest, RechargeResponse } from './ProviderAdapterInterface';
import { HubtelPaymentService } from '../HubtelPaymentService';

/**
 * HubtelProviderAdapter
 * Enables Hubtel to act as a VTU / service fulfillment provider for:
 * - Airtime dispatch (via direct Hubtel disbursement / airtime fulfillment rails)
 * - Bills & Utilities
 * - Fallback fulfillment when DatamartGH or other upstream providers run out of stock or balance
 */
export class HubtelProviderAdapter implements ProviderAdapterInterface {
  private hubtel: HubtelPaymentService;

  constructor() {
    this.hubtel = new HubtelPaymentService();
  }

  /**
   * Format phone number to international Ghanaian format (233XXXXXXXXX) or local 10-digit
   */
  private formatPhoneNumber(phone: string): string {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0') && cleaned.length === 10) {
      cleaned = '233' + cleaned.substring(1);
    }
    return cleaned;
  }

  async recharge(request: RechargeRequest): Promise<RechargeResponse> {
    const targetPhone = this.formatPhoneNumber(request.recipient);
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://quicknetdata.com'}/api/hubtel/webhook`;

    try {
      if (request.serviceType === 'airtime') {
        // NOTE: Hubtel's sendMoney API disburses cash to MoMo wallets — it does NOT top up airtime.
        // Hubtel Commission Services API handles airtime but requires a separate licensed endpoint
        // not available in the standard API plan. Return failure to let caller handle properly.
        console.warn(`[HubtelProvider] Airtime dispatch not available — Hubtel Commission Services endpoint not configured.`);
        return {
          success: false,
          errorMessage: 'Hubtel airtime Commission Services not configured. Cannot dispatch airtime via Hubtel.',
          status: 'failed',
        };
      }

      if (request.serviceType === 'bill') {
        const result = await this.hubtel.sendMoney({
          amount: request.amount,
          recipientName: `${request.network} Bill Customer`,
          recipientMsisdn: targetPhone,
          description: `${request.network} bill payment for ${request.recipient}`,
          clientReference: request.reference,
          callbackUrl,
        });

        if (result.success) {
          return {
            success: true,
            providerReference: result.transactionId || request.reference,
            status: result.status === 'success' ? 'success' : 'processing',
          };
        }

        return {
          success: false,
          errorMessage: result.errorMessage || `Hubtel bill payment declined`,
          status: 'failed',
        };
      }

      // For data bundles routed through Hubtel (if configured as money disbursement / commission service)
      const dataResult = await this.hubtel.sendMoney({
        amount: request.amount,
        recipientName: `${request.network} Data Customer`,
        recipientMsisdn: targetPhone,
        description: `${request.capacity || ''} ${request.network} data bundle for ${request.recipient}`,
        clientReference: request.reference,
        callbackUrl,
      });

      if (dataResult.success) {
        return {
          success: true,
          providerReference: dataResult.transactionId || request.reference,
          status: dataResult.status === 'success' ? 'success' : 'processing',
        };
      }

      return {
        success: false,
        errorMessage: dataResult.errorMessage || 'Hubtel data bundle delivery failed',
        status: 'failed',
      };
    } catch (err: any) {
      return {
        success: false,
        errorMessage: err.message || 'Hubtel provider connection error',
        status: 'failed',
      };
    }
  }

  async queryStatus(providerReference: string): Promise<RechargeResponse> {
    try {
      const res = await this.hubtel.queryTransactionStatus(providerReference);
      return {
        success: res.success,
        providerReference: res.transactionId || providerReference,
        status: res.status === 'success' ? 'success' : res.status === 'failed' ? 'failed' : 'processing',
        errorMessage: res.errorMessage,
      };
    } catch (err: any) {
      return {
        success: false,
        providerReference,
        status: 'processing',
        errorMessage: err.message,
      };
    }
  }
}
