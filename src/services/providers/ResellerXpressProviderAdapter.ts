import { ProviderAdapterInterface, RechargeRequest, RechargeResponse } from './ProviderAdapterInterface';

export interface ResellerXpressPlan {
  id: number;
  name: string;
  network: string;
  capacity?: string;
  price: number;
  type: string;
}

export class ResellerXpressProviderAdapter implements ProviderAdapterInterface {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string, baseUrl?: string) {
    this.apiKey = apiKey || process.env.RESELLERXPRESS_API_KEY || '';
    this.baseUrl = baseUrl || process.env.RESELLERXPRESS_BASE_URL || 'https://resellerxpress.shop/api/v1';
  }

  /**
   * Helper to format Ghanaian phone numbers to standard 10-digit format (0244123456)
   */
  private formatPhoneNumber(phone: string): string {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('233') && cleaned.length === 12) {
      cleaned = '0' + cleaned.substring(3);
    }
    return cleaned;
  }

  /**
   * Default plan map fallback if specific planId is not provided
   */
  private resolvePlanId(network: string, amount: number, serviceType: string): number {
    const networkUpper = network.toUpperCase();
    if (serviceType === 'airtime') {
      return 100; // General VTU Airtime top-up plan
    }

    if (networkUpper === 'MTN') {
      if (amount <= 10) return 1;  // e.g. 1GB / 2GB
      if (amount <= 25) return 2;  // e.g. 5GB
      if (amount <= 50) return 3;  // e.g. 10GB
      return 4;                   // e.g. 20GB+
    } else if (networkUpper === 'TELECEL') {
      if (amount <= 15) return 10;
      if (amount <= 35) return 11;
      return 12;
    } else if (networkUpper === 'AIRTELTIGO') {
      if (amount <= 15) return 20;
      if (amount <= 35) return 21;
      return 22;
    }

    return 1; // Default plan ID fallback
  }

  /**
   * Execute VTU Airtime or Data recharge via ResellerXpress API
   */
  async recharge(request: RechargeRequest): Promise<RechargeResponse> {
    const formattedPhone = this.formatPhoneNumber(request.recipient);
    const planId = request.planId || this.resolvePlanId(request.network, request.amount, request.serviceType);

    // Sandbox / Mock fallback if placeholder API key is used
    if (!this.apiKey || this.apiKey.includes('placeholder')) {
      console.log(`[ResellerXpress Mock Mode] Processing ${request.network} ${request.serviceType} for ${formattedPhone} (Plan #${planId})`);
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (formattedPhone.startsWith('0244000')) {
        return {
          success: false,
          errorMessage: 'ResellerXpress: Recipient number rejected by upstream provider',
          status: 'failed',
        };
      }

      return {
        success: true,
        providerReference: `RX_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        status: 'success',
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/place-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.apiKey,
        },
        body: JSON.stringify({
          plan_id: planId,
          phone: formattedPhone,
          request_id: request.reference,
          quantity: 1,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok || response.status === 202) {
        return {
          success: true,
          providerReference: data?.order?.request_id || data?.order?.id?.toString() || request.reference,
          status: data?.order?.status === 'success' ? 'success' : 'processing',
        };
      }

      return {
        success: false,
        errorMessage: data?.message || data?.error || `ResellerXpress API Error (${response.status})`,
        status: 'failed',
      };
    } catch (error: any) {
      console.error('[ResellerXpress API Network Error]:', error);
      return {
        success: false,
        errorMessage: error.message || 'Failed to connect to ResellerXpress VTU gateway',
        status: 'failed',
      };
    }
  }

  /**
   * Query status of an existing order by request_id
   */
  async queryStatus(providerReference: string): Promise<RechargeResponse> {
    if (!this.apiKey || this.apiKey.includes('placeholder')) {
      return {
        success: true,
        providerReference,
        status: 'success',
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/order-status?request_id=${encodeURIComponent(providerReference)}`, {
        method: 'GET',
        headers: {
          'X-API-KEY': this.apiKey,
        },
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data) {
        const orderStatus = data.order?.status || data.status;
        const isSuccess = orderStatus === 'success' || orderStatus === 'completed';
        const isFailed = orderStatus === 'failed' || orderStatus === 'cancelled';

        return {
          success: isSuccess,
          providerReference,
          errorMessage: isFailed ? (data.message || 'Order failed on network') : undefined,
          status: isSuccess ? 'success' : isFailed ? 'failed' : 'processing',
        };
      }

      return {
        success: false,
        providerReference,
        errorMessage: 'Unable to query ResellerXpress order status',
        status: 'processing',
      };
    } catch (error: any) {
      return {
        success: false,
        providerReference,
        errorMessage: error.message,
        status: 'processing',
      };
    }
  }

  /**
   * Fetch active data plans and pricing from ResellerXpress
   */
  async getPlans(): Promise<ResellerXpressPlan[]> {
    if (!this.apiKey || this.apiKey.includes('placeholder')) {
      return [
        { id: 1, name: 'MTN SME Data 1GB', network: 'MTN', price: 4.50, type: 'data' },
        { id: 2, name: 'MTN SME Data 5GB', network: 'MTN', price: 21.00, type: 'data' },
        { id: 3, name: 'MTN SME Data 10GB', network: 'MTN', price: 38.00, type: 'data' },
        { id: 10, name: 'Telecel Data 5GB', network: 'Telecel', price: 20.00, type: 'data' },
        { id: 20, name: 'AirtelTigo Big Time 10GB', network: 'AirtelTigo', price: 35.00, type: 'data' },
        { id: 100, name: 'Universal Airtime Top-Up', network: 'ALL', price: 1.00, type: 'airtime' },
      ];
    }

    try {
      const response = await fetch(`${this.baseUrl}/plans`, {
        headers: { 'X-API-KEY': this.apiKey },
      });
      if (response.ok) {
        const data = await response.json();
        return data.plans || data.data || [];
      }
    } catch (err) {
      console.error('Failed to fetch ResellerXpress plans:', err);
    }
    return [];
  }

  /**
   * Query upstream reseller balance
   */
  async getWalletBalance(): Promise<{ balance: number; currency: string }> {
    if (!this.apiKey || this.apiKey.includes('placeholder')) {
      return { balance: 5000.00, currency: 'GHS' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/wallet`, {
        headers: { 'X-API-KEY': this.apiKey },
      });
      if (response.ok) {
        const data = await response.json();
        return { balance: parseFloat(data.balance || '0'), currency: 'GHS' };
      }
    } catch (err) {
      console.error('Failed to fetch ResellerXpress wallet balance:', err);
    }
    return { balance: 0, currency: 'GHS' };
  }
}
