import { ProviderAdapterInterface, RechargeRequest, RechargeResponse } from './ProviderAdapterInterface';

export interface ResellerXpressPlan {
  id: number;
  name: string;
  network: string;
  volume?: string;
  volume_mb?: number;
  price: number;
  type: string;
}

export class ResellerXpressProviderAdapter implements ProviderAdapterInterface {
  private apiKey: string;
  private baseUrl: string;

  // In-memory cache for plans to avoid repeated API calls
  private cachedPlans: ResellerXpressPlan[] | null = null;

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
   * Fetch available plans from the API and cache them in memory.
   * Uses the correct /plans endpoint as confirmed from the live API.
   */
  async getPlans(): Promise<ResellerXpressPlan[]> {
    if (!this.apiKey || this.apiKey.includes('placeholder')) {
      // Mock plans matching real API structure
      return [
        { id: 17, name: '1GB AirtelTigo', network: 'airteltigo', volume: '1', volume_mb: 1, price: 5.80, type: 'data' },
        { id: 18, name: '2GB AirtelTigo', network: 'airteltigo', volume: '2', volume_mb: 2, price: 9.60, type: 'data' },
        { id: 19, name: '3GB AirtelTigo', network: 'airteltigo', volume: '3', volume_mb: 3, price: 13.50, type: 'data' },
        { id: 28, name: '10GB Telecel', network: 'telecel', volume: '10', volume_mb: 10, price: 39.00, type: 'data' },
        { id: 29, name: '15GB Telecel', network: 'telecel', volume: '15', volume_mb: 15, price: 55.00, type: 'data' },
        { id: 30, name: '20GB Telecel', network: 'telecel', volume: '20', volume_mb: 20, price: 74.00, type: 'data' },
      ];
    }

    // Return cache if available
    if (this.cachedPlans && this.cachedPlans.length > 0) {
      return this.cachedPlans;
    }

    try {
      const response = await fetch(`${this.baseUrl}/plans`, {
        headers: { 'X-API-KEY': this.apiKey },
      });

      if (response.ok) {
        const raw = await response.json();
        // API returns an object keyed by index; convert to array and normalize
        const plans: ResellerXpressPlan[] = Object.values(raw).map((item: any) => ({
          id: item.id,
          name: `${item.name} ${item.network}`,
          network: item.network.toLowerCase(),
          volume: item.volume,
          volume_mb: item.volume_mb,
          price: parseFloat(item.price),
          type: 'data',
        }));

        this.cachedPlans = plans;
        return plans;
      }

      console.error('[ResellerXpress] Failed to fetch plans, status:', response.status);
    } catch (err) {
      console.error('[ResellerXpress] getPlans error:', err);
    }

    return this.cachedPlans || [];
  }

  /**
   * Find the best matching plan ID for a given network + amount (GHS price).
   * This replaces the old hardcoded plan ID map with a real lookup.
   */
  private async resolvePlanId(network: string, amount: number, serviceType: string): Promise<number> {
    if (serviceType === 'airtime') {
      // ResellerXpress currently only supports data; fallback plan ID
      return 0;
    }

    const plans = await this.getPlans();
    const networkLower = network.toLowerCase().replace('airteltigo', 'airteltigo').replace('at', 'airteltigo');

    // Find plans for this network, sorted by price ascending
    const networkPlans = plans
      .filter((p) => p.network === networkLower)
      .sort((a, b) => a.price - b.price);

    if (networkPlans.length === 0) {
      console.warn(`[ResellerXpress] No plans found for network: ${network}`);
      return 0;
    }

    // Find the plan whose price most closely matches the requested amount
    // (find the last plan whose price is <= amount, or the cheapest available)
    let bestPlan = networkPlans[0];
    for (const plan of networkPlans) {
      if (plan.price <= amount) {
        bestPlan = plan;
      }
    }

    return bestPlan.id;
  }

  /**
   * Execute VTU Data recharge via ResellerXpress API
   * Endpoint: POST /place-order
   */
  async recharge(request: RechargeRequest): Promise<RechargeResponse> {
    const formattedPhone = this.formatPhoneNumber(request.recipient);

    // Sandbox / Mock fallback if placeholder API key is used
    if (!this.apiKey || this.apiKey.includes('placeholder')) {
      console.log(`[ResellerXpress Mock Mode] Processing ${request.network} ${request.serviceType} for ${formattedPhone}`);
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

    // Resolve the correct plan ID from the live API
    const planId = request.planId || await this.resolvePlanId(request.network, request.amount, request.serviceType);

    if (!planId) {
      return {
        success: false,
        errorMessage: `No data plan available for ${request.network} at ₵${request.amount}. This network may not be supported.`,
        status: 'failed',
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
        errorMessage: data?.message || data?.error || `ResellerXpress API Error (HTTP ${response.status})`,
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
   * Endpoint: GET /order-status?request_id=...
   */
  async queryStatus(providerReference: string): Promise<RechargeResponse> {
    if (!this.apiKey || this.apiKey.includes('placeholder')) {
      return { success: true, providerReference, status: 'success' };
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/order-status?request_id=${encodeURIComponent(providerReference)}`,
        { method: 'GET', headers: { 'X-API-KEY': this.apiKey } }
      );

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
      return { success: false, providerReference, errorMessage: error.message, status: 'processing' };
    }
  }

  /**
   * Query upstream reseller wallet balance
   * Endpoint: GET /wallet-balance  (NOT /wallet)
   */
  async getWalletBalance(): Promise<{ balance: number; currency: string }> {
    if (!this.apiKey || this.apiKey.includes('placeholder')) {
      return { balance: 5000.00, currency: 'GHS' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/wallet-balance`, {
        headers: { 'X-API-KEY': this.apiKey },
      });
      if (response.ok) {
        const data = await response.json();
        return { balance: parseFloat(data.balance || data.wallet_balance || '0'), currency: 'GHS' };
      }
    } catch (err) {
      console.error('[ResellerXpress] getWalletBalance error:', err);
    }
    return { balance: 0, currency: 'GHS' };
  }
}
