import { ProviderAdapterInterface, RechargeRequest, RechargeResponse } from './ProviderAdapterInterface';
import { HubtelPaymentService, HUBTEL_COMMISSION_SERVICE_IDS } from '../HubtelPaymentService';

/**
 * HubtelProviderAdapter
 * Enables Hubtel to act as a VTU / service fulfillment provider for:
 * - Airtime dispatch via Hubtel Commission Services API
 * - Data bundle dispatch via Hubtel Commission Services API
 * - Bills & Utilities (ECG, GWCL, DSTV, GOtv, StarTimes) via Hubtel Commission Services API
 * NOTE: Never uses sendMoney (MoMo cash disbursement) for airtime or data purchases.
 */
export class HubtelProviderAdapter implements ProviderAdapterInterface {
  private hubtel: HubtelPaymentService;

  constructor() {
    this.hubtel = new HubtelPaymentService();
  }

  /**
   * Format phone number to international Ghanaian format (233XXXXXXXXX)
   */
  private formatPhoneNumber(phone: string): string {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0') && cleaned.length === 10) {
      cleaned = '233' + cleaned.substring(1);
    }
    if (cleaned.length === 9) {
      cleaned = '233' + cleaned;
    }
    return cleaned;
  }

  /**
   * Resolve Hubtel Commission ServiceID by service type and telecom network
   */
  private resolveServiceId(serviceType: string, network: string): string | null {
    const normNet = (network || '').toUpperCase();

    if (serviceType === 'airtime') {
      if (normNet.includes('MTN') || normNet.includes('YELLO')) {
        return HUBTEL_COMMISSION_SERVICE_IDS.AIRTIME.MTN;
      }
      if (normNet.includes('TELECEL') || normNet.includes('VODA')) {
        return HUBTEL_COMMISSION_SERVICE_IDS.AIRTIME.TELECEL;
      }
      if (normNet.includes('AIRTEL') || normNet.includes('TIGO') || normNet === 'AT') {
        return HUBTEL_COMMISSION_SERVICE_IDS.AIRTIME.AIRTELTIGO;
      }
      return null;
    }

    if (serviceType === 'data') {
      if (normNet.includes('MTN') || normNet.includes('YELLO')) {
        return HUBTEL_COMMISSION_SERVICE_IDS.DATA.MTN;
      }
      if (normNet.includes('TELECEL') || normNet.includes('VODA')) {
        return HUBTEL_COMMISSION_SERVICE_IDS.DATA.TELECEL;
      }
      if (normNet.includes('AIRTEL') || normNet.includes('TIGO') || normNet === 'AT') {
        return HUBTEL_COMMISSION_SERVICE_IDS.DATA.AIRTELTIGO;
      }
      return null;
    }

    if (serviceType === 'bill' || serviceType === 'bills' || serviceType === 'tv') {
      if (normNet.includes('ECG')) return HUBTEL_COMMISSION_SERVICE_IDS.BILLS.ECG;
      if (normNet.includes('WATER') || normNet.includes('GWCL')) return HUBTEL_COMMISSION_SERVICE_IDS.BILLS.GWCL;
      if (normNet.includes('DSTV')) return HUBTEL_COMMISSION_SERVICE_IDS.BILLS.DSTV;
      if (normNet.includes('GOTV')) return HUBTEL_COMMISSION_SERVICE_IDS.BILLS.GOTV;
      if (normNet.includes('STARTIMES')) return HUBTEL_COMMISSION_SERVICE_IDS.BILLS.STARTIMES;
      if (normNet.includes('BROADBAND')) return HUBTEL_COMMISSION_SERVICE_IDS.BILLS.TELECEL_BROADBAND;
      return HUBTEL_COMMISSION_SERVICE_IDS.BILLS.ECG;
    }

    return null;
  }

  async recharge(request: RechargeRequest): Promise<RechargeResponse> {
    const targetPhone = this.formatPhoneNumber(request.recipient);
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://quicknetdata.com'}/api/hubtel/webhook`;

    if (!targetPhone || targetPhone.length < 12) {
      return {
        success: false,
        errorMessage: `Invalid Ghanaian recipient phone number: ${request.recipient}`,
        status: 'failed',
      };
    }

    const serviceId = this.resolveServiceId(request.serviceType, request.network);
    if (!serviceId) {
      return {
        success: false,
        errorMessage: `Unsupported network or service for Hubtel dispatch: ${request.network} (${request.serviceType})`,
        status: 'failed',
      };
    }

    try {
      const result = await this.hubtel.purchaseCommissionService({
        destination: targetPhone,
        amount: request.amount,
        callbackUrl,
        clientReference: request.reference,
        serviceId,
      });

      if (result.success) {
        return {
          success: true,
          providerReference: result.transactionId || request.reference,
          status: 'processing',
        };
      }

      return {
        success: false,
        errorMessage: result.errorMessage || `Hubtel ${request.serviceType} delivery declined`,
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
