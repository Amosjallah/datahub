import { ProviderAdapterInterface, RechargeRequest, RechargeResponse } from './ProviderAdapterInterface';

export interface DatamartGHPlan {
  id: string | number;
  name: string;
  network: string;
  volume?: string;
  price: number;
  type: 'data' | 'airtime';
  validity?: string;
}

export class DatamartGHProviderAdapter implements ProviderAdapterInterface {
  private apiKey: string;
  private baseUrl: string;

  /** In-memory plan cache */
  private cachedPlans: DatamartGHPlan[] | null = null;

  constructor(apiKey?: string, baseUrl?: string) {
    this.apiKey = apiKey || process.env.DATAMARTGH_API_KEY || '';
    this.baseUrl = baseUrl || process.env.DATAMARTGH_BASE_URL || 'https://szhjqivcywijzdusueob.supabase.co/functions/v1';
  }

  private get headers() {
    return {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
    };
  }

  private isMockMode(): boolean {
    return !this.apiKey || this.apiKey.includes('placeholder');
  }

  /**
   * Format Ghanaian phone numbers to standard 10-digit format (0244123456)
   */
  private formatPhoneNumber(phone: string): string {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('233') && cleaned.length === 12) {
      cleaned = '0' + cleaned.substring(3);
    }
    return cleaned;
  }

  /**
   * Map internal network names to DatamartGH network identifiers
   */
  private mapNetwork(network: string): string {
    const map: Record<string, string> = {
      MTN: 'MTN',
      Telecel: 'TELECEL',
      TELECEL: 'TELECEL',
      AirtelTigo: 'AIRTELTIGO',
      AIRTELTIGO: 'AIRTELTIGO',
    };
    return map[network] || network.toUpperCase();
  }

  /**
   * Fetch available data bundles from DatamartGH API.
   * Endpoint: GET /api-bundles
   */
  async getPlans(): Promise<DatamartGHPlan[]> {
    if (this.isMockMode()) {
      return [
        { id: 'DMG_MTN_1GB', name: '1GB MTN (30 days)', network: 'MTN', volume: '1GB', price: 7.00, type: 'data', validity: '30 days' },
        { id: 'DMG_MTN_2GB', name: '2GB MTN (30 days)', network: 'MTN', volume: '2GB', price: 13.00, type: 'data', validity: '30 days' },
        { id: 'DMG_MTN_5GB', name: '5GB MTN (30 days)', network: 'MTN', volume: '5GB', price: 30.00, type: 'data', validity: '30 days' },
        { id: 'DMG_TELECEL_1GB', name: '1GB Telecel (30 days)', network: 'Telecel', volume: '1GB', price: 6.00, type: 'data', validity: '30 days' },
        { id: 'DMG_TELECEL_2GB', name: '2GB Telecel (30 days)', network: 'Telecel', volume: '2GB', price: 11.00, type: 'data', validity: '30 days' },
        { id: 'DMG_AT_1GB', name: '1GB AirtelTigo (30 days)', network: 'AirtelTigo', volume: '1GB', price: 5.80, type: 'data', validity: '30 days' },
      ];
    }

    if (this.cachedPlans && this.cachedPlans.length > 0) {
      return this.cachedPlans;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api-bundles`, {
        method: 'GET',
        headers: this.headers,
      });

      if (response.ok) {
        const raw = await response.json();
        // Normalize: API may return array or keyed object
        const items: any[] = Array.isArray(raw) ? raw : Object.values(raw);

        const plans: DatamartGHPlan[] = items.map((item: any) => ({
          id: item.id || item.bundle_id || item.plan_id,
          name: item.name || item.bundle_name || `${item.volume || ''} ${item.network || ''}`.trim(),
          network: item.network || item.provider || '',
          volume: item.volume || item.data_volume || item.size,
          price: parseFloat(item.price || item.amount || '0'),
          type: 'data',
          validity: item.validity || item.duration,
        }));

        this.cachedPlans = plans;
        return plans;
      }

      console.error('[DatamartGH] getPlans failed, status:', response.status);
    } catch (err) {
      console.error('[DatamartGH] getPlans error:', err);
    }

    return this.cachedPlans || [];
  }

  /**
   * Find the best matching plan ID for a given network + amount.
   */
  private async resolvePlanId(network: string, amount: number): Promise<string | number | null> {
    const plans = await this.getPlans();
    const networkUpper = network.toUpperCase().replace('AIRTELTIGO', 'AIRTELTIGO');

    const networkPlans = plans
      .filter((p) => p.network.toUpperCase().replace('AIRTELTIGO', 'AIRTELTIGO') === networkUpper)
      .sort((a, b) => a.price - b.price);

    if (networkPlans.length === 0) {
      console.warn(`[DatamartGH] No plans found for network: ${network}`);
      return null;
    }

    // Best plan whose price <= requested amount, else cheapest
    let best = networkPlans[0];
    for (const plan of networkPlans) {
      if (plan.price <= amount) {
        best = plan;
      }
    }

    return best.id;
  }

  /**
   * Execute a VTU data/airtime recharge via DatamartGH API.
   * Endpoint: POST /api-purchase
   */
  async recharge(request: RechargeRequest): Promise<RechargeResponse> {
    const formattedPhone = this.formatPhoneNumber(request.recipient);
    const networkMapped = this.mapNetwork(request.network);

    if (this.isMockMode()) {
      console.log(`[DatamartGH Mock] ${request.network} ${request.serviceType} for ${formattedPhone}`);
      await new Promise((r) => setTimeout(r, 500));

      if (formattedPhone.startsWith('0244000')) {
        return { success: false, errorMessage: 'DatamartGH: Recipient rejected by upstream', status: 'failed' };
      }

      return {
        success: true,
        providerReference: `DMG_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        status: 'success',
      };
    }

    try {
      let body: Record<string, any>;

      if (request.serviceType === 'airtime') {
        body = {
          network: networkMapped,
          phone: formattedPhone,
          amount: request.amount,
          request_id: request.reference,
          type: 'airtime',
        };
      } else {
        // Data bundle purchase
        const planId = request.planId || await this.resolvePlanId(request.network, request.amount);

        if (!planId) {
          return {
            success: false,
            errorMessage: `No data bundle available for ${request.network} at GH₵${request.amount}`,
            status: 'failed',
          };
        }

        body = {
          network: networkMapped,
          phone: formattedPhone,
          bundle_id: planId,
          request_id: request.reference,
          type: 'data',
        };
      }

      const response = await fetch(`${this.baseUrl}/api-purchase`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(body),
      });

      const data = await response.json().catch(() => null);

      if (response.ok || response.status === 201 || response.status === 202) {
        const ref = data?.reference || data?.order_id || data?.transaction_id || request.reference;
        const status = data?.status === 'success' || data?.status === 'completed' ? 'success' : 'processing';
        return { success: true, providerReference: ref, status };
      }

      return {
        success: false,
        errorMessage: data?.message || data?.error || `DatamartGH API Error (HTTP ${response.status})`,
        status: 'failed',
      };
    } catch (error: any) {
      console.error('[DatamartGH recharge error]:', error);
      return {
        success: false,
        errorMessage: error.message || 'Failed to connect to DatamartGH VTU gateway',
        status: 'failed',
      };
    }
  }

  /**
   * Query status of an existing order.
   * Endpoint: GET /api-orders?reference=...
   */
  async queryStatus(providerReference: string): Promise<RechargeResponse> {
    if (this.isMockMode()) {
      return { success: true, providerReference, status: 'success' };
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/api-orders?reference=${encodeURIComponent(providerReference)}`,
        { method: 'GET', headers: this.headers }
      );

      const data = await response.json().catch(() => null);

      if (response.ok && data) {
        const st = data.status || data.order?.status;
        const isSuccess = st === 'success' || st === 'completed' || st === 'delivered';
        const isFailed = st === 'failed' || st === 'cancelled';
        return {
          success: isSuccess,
          providerReference,
          errorMessage: isFailed ? (data.message || 'Order failed') : undefined,
          status: isSuccess ? 'success' : isFailed ? 'failed' : 'processing',
        };
      }

      return { success: false, providerReference, errorMessage: 'Cannot query DatamartGH order status', status: 'processing' };
    } catch (error: any) {
      return { success: false, providerReference, errorMessage: error.message, status: 'processing' };
    }
  }

  /**
   * Query upstream wallet balance.
   * Endpoint: GET /api-wallet-balance
   */
  async getWalletBalance(): Promise<{ balance: number; currency: string }> {
    if (this.isMockMode()) {
      return { balance: 10000.00, currency: 'GHS' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/api-wallet-balance`, {
        method: 'GET',
        headers: this.headers,
      });

      if (response.ok) {
        const data = await response.json();
        return {
          balance: parseFloat(data.balance || data.wallet_balance || data.amount || '0'),
          currency: data.currency || 'GHS',
        };
      }
    } catch (err) {
      console.error('[DatamartGH] getWalletBalance error:', err);
    }

    return { balance: 0, currency: 'GHS' };
  }
}
