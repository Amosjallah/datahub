import { ProviderAdapterInterface, RechargeRequest, RechargeResponse } from './ProviderAdapterInterface';

export interface DatamartGHPlan {
  id: string | number;
  name: string;
  network: string;
  volume: string;
  capacity: string;
  price: number;
  type: 'data';
  inStock: boolean;
}

export class DatamartGHProviderAdapter implements ProviderAdapterInterface {
  private apiKey: string;
  private baseUrl: string;

  /** In-memory plan cache */
  private cachedPlans: DatamartGHPlan[] | null = null;
  private lastPlansFetch = 0;

  constructor(apiKey?: string, baseUrl?: string) {
    this.apiKey = apiKey || process.env.DATAMARTGH_API_KEY || '';
    this.baseUrl = (baseUrl || process.env.DATAMARTGH_BASE_URL || 'https://api.datamartgh.shop/api/developer').replace(/\/+$/, '');
  }

  private get headers(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-API-Key': this.apiKey,
    };
  }

  private isMockMode(): boolean {
    return !this.apiKey || this.apiKey.includes('placeholder') || this.apiKey.startsWith('test_');
  }

  /**
   * Format Ghanaian phone numbers to standard 10-digit format (0244123456)
   */
  private formatPhoneNumber(phone: string): string {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('233') && cleaned.length === 12) {
      cleaned = '0' + cleaned.substring(3);
    }
    if (cleaned.length === 9 && !cleaned.startsWith('0')) {
      cleaned = '0' + cleaned;
    }
    return cleaned;
  }

  /**
   * Mask phone number for safe server-side logging (e.g. 024****456)
   */
  private maskPhone(phone: string): string {
    if (phone.length <= 5) return '***';
    return `${phone.substring(0, 3)}****${phone.substring(phone.length - 3)}`;
  }

  /**
   * Map internal network names to DataMart network identifiers:
   * MTN -> YELLO
   * Telecel -> TELECEL
   * AirtelTigo -> at
   */
  private mapNetwork(network: string): string {
    const norm = (network || '').toUpperCase().trim();
    if (norm.includes('MTN') || norm.includes('YELLO')) return 'YELLO';
    if (norm.includes('TELECEL') || norm.includes('VODA')) return 'TELECEL';
    if (norm.includes('AIRTEL') || norm.includes('TIGO') || norm === 'AT') return 'at';
    return norm;
  }

  /**
   * Map DataMart network code back to user-friendly name
   */
  private mapNetworkToFriendly(code: string): string {
    const upper = (code || '').toUpperCase();
    if (upper === 'YELLO' || upper.includes('MTN')) return 'MTN';
    if (upper === 'TELECEL') return 'Telecel';
    if (upper === 'AT' || upper.includes('AIRTEL')) return 'AirtelTigo';
    return code;
  }

  /**
   * Fetch live data packages from DataMart API.
   * Endpoint: GET /data-packages
   */
  async getPlans(): Promise<DatamartGHPlan[]> {
    if (this.isMockMode()) {
      return [
        { id: 'DMG_MTN_1GB', name: '1GB MTN', network: 'MTN', volume: '1GB', capacity: '1', price: 4.20, type: 'data', inStock: true },
        { id: 'DMG_MTN_2GB', name: '2GB MTN', network: 'MTN', volume: '2GB', capacity: '2', price: 9.00, type: 'data', inStock: true },
        { id: 'DMG_MTN_5GB', name: '5GB MTN', network: 'MTN', volume: '5GB', capacity: '5', price: 23.00, type: 'data', inStock: true },
        { id: 'DMG_TEL_5GB', name: '5GB Telecel', network: 'Telecel', volume: '5GB', capacity: '5', price: 20.00, type: 'data', inStock: true },
        { id: 'DMG_AT_1GB', name: '1GB AirtelTigo', network: 'AirtelTigo', volume: '1GB', capacity: '1', price: 4.00, type: 'data', inStock: true },
      ];
    }

    // Cache plans for 60 seconds
    const now = Date.now();
    if (this.cachedPlans && this.cachedPlans.length > 0 && now - this.lastPlansFetch < 60000) {
      return this.cachedPlans;
    }

    try {
      const response = await fetch(`${this.baseUrl}/data-packages`, {
        method: 'GET',
        headers: this.headers,
      });

      if (response.ok) {
        const body = await response.json();
        const catalog = body?.data || {};
        const plans: DatamartGHPlan[] = [];

        for (const [netCode, items] of Object.entries(catalog)) {
          if (!Array.isArray(items)) continue;
          const friendlyNet = this.mapNetworkToFriendly(netCode);

          for (const item of items) {
            const cap = String(item.capacity || item.cap || '').trim();
            const price = parseFloat(item.price || item.cost || '0');
            if (!cap || isNaN(price) || price <= 0) continue;

            plans.push({
              id: `DMG_${netCode.toUpperCase()}_${cap}GB`,
              name: `${cap}GB ${friendlyNet}`,
              network: friendlyNet,
              volume: `${cap}GB`,
              capacity: cap,
              price,
              type: 'data',
              inStock: item.inStock !== false,
            });
          }
        }

        if (plans.length > 0) {
          this.cachedPlans = plans;
          this.lastPlansFetch = now;
          return plans;
        }
      } else {
        console.warn(`[DatamartGH] getPlans returned HTTP ${response.status}`);
      }
    } catch (err: any) {
      console.error('[DatamartGH] getPlans network failure:', err.message);
    }

    return this.cachedPlans || [];
  }

  /**
   * Resolve capacity string (e.g. '1', '2', '5') from planId, capacity, or amount
   */
  async resolveCapacity(network: string, amount: number, planId?: string | number, directCapacity?: string | number): Promise<string | null> {
    if (directCapacity) {
      const cleaned = String(directCapacity).replace(/[^0-9.]/g, '').trim();
      if (cleaned) return cleaned;
    }

    if (planId) {
      const planStr = String(planId);
      // If planId has pattern like DMG_YELLO_5GB or MTN_5GB
      const match = planStr.match(/(\d+(?:\.\d+)?)\s*(?:GB|mb)?/i);
      if (match && match[1]) {
        return match[1];
      }
    }

    // Match best package from live catalog by price
    const plans = await this.getPlans();
    const friendlyNet = this.mapNetworkToFriendly(this.mapNetwork(network));
    const netPlans = plans
      .filter((p) => p.network.toUpperCase() === friendlyNet.toUpperCase() && p.inStock)
      .sort((a, b) => a.price - b.price);

    if (netPlans.length === 0) {
      return null;
    }

    let matched = netPlans[0];
    for (const p of netPlans) {
      if (p.price <= amount) {
        matched = p;
      }
    }

    return matched.capacity;
  }

  /**
   * Execute a VTU recharge via DataMart Ghana Developer API.
   * Endpoint: POST /purchase
   */
  async recharge(request: RechargeRequest): Promise<RechargeResponse> {
    const formattedPhone = this.formatPhoneNumber(request.recipient);
    const maskedPhone = this.maskPhone(formattedPhone);

    if (this.isMockMode()) {
      console.log(`[DatamartGH Mock] Dispatching ${request.network} ${request.serviceType} for ${maskedPhone}`);
      await new Promise((r) => setTimeout(r, 400));
      return {
        success: true,
        providerReference: `DMG_MOCK_${Date.now()}`,
        status: 'success',
      };
    }

    if (request.serviceType === 'airtime') {
      return {
        success: false,
        errorMessage: 'Direct airtime top-up is not supported by DataMart provider. Please choose a data bundle.',
        status: 'failed',
      };
    }

    const networkMapped = this.mapNetwork(request.network);
    const capacity = await this.resolveCapacity(request.network, request.amount, request.planId, request.capacity);

    if (!capacity) {
      return {
        success: false,
        errorMessage: `Could not resolve a valid data capacity for ${request.network} at GH₵${request.amount}`,
        status: 'failed',
      };
    }

    const payload = {
      phoneNumber: formattedPhone,
      network: networkMapped,
      capacity: String(capacity),
      gateway: 'wallet',
      ref: request.reference,
    };

    console.log(`[DatamartGH] Outgoing recharge ref=${request.reference} network=${networkMapped} cap=${capacity} recipient=${maskedPhone}`);

    try {
      const response = await fetch(`${this.baseUrl}/purchase`, {
        method: 'POST',
        headers: {
          ...this.headers,
          'X-Idempotency-Key': request.reference,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);
      console.log(`[DatamartGH] Response HTTP ${response.status} ref=${request.reference} status=${data?.status || data?.data?.orderStatus}`);

      if (response.ok || response.status === 201 || response.status === 202) {
        const orderData = data?.data || data || {};
        const orderRef = orderData.orderReference || orderData.reference || orderData.orderId || request.reference;
        const rawStatus = (orderData.orderStatus || data?.status || '').toLowerCase();
        
        const isSuccess = rawStatus === 'completed' || rawStatus === 'success' || rawStatus === 'delivered';
        const isProcessing = rawStatus === 'processing' || rawStatus === 'pending' || !rawStatus;

        return {
          success: true,
          providerReference: orderRef,
          status: isSuccess ? 'success' : isProcessing ? 'processing' : 'processing',
        };
      }

      const errMsg = data?.message || data?.error || `DataMart API error (HTTP ${response.status})`;
      console.warn(`[DatamartGH Purchase Failed]: HTTP ${response.status} ref=${request.reference} message=${errMsg}`);

      return {
        success: false,
        errorMessage: errMsg,
        status: 'failed',
      };
    } catch (error: any) {
      console.error('[DatamartGH recharge network exception]:', error.message);
      return {
        success: false,
        errorMessage: error.message || 'Failed to connect to DataMart VTU gateway',
        status: 'failed',
      };
    }
  }

  /**
   * Query status of an existing order.
   * Endpoint: GET /order-status/:reference
   */
  async queryStatus(providerReference: string): Promise<RechargeResponse> {
    if (this.isMockMode()) {
      return { success: true, providerReference, status: 'success' };
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/order-status/${encodeURIComponent(providerReference)}`,
        { method: 'GET', headers: this.headers }
      );

      const data = await response.json().catch(() => null);

      if (response.ok && data) {
        const orderData = data?.data || data;
        const rawStatus = (orderData.orderStatus || orderData.status || '').toLowerCase();

        const isSuccess = rawStatus === 'completed' || rawStatus === 'success' || rawStatus === 'delivered';
        const isFailed = rawStatus === 'failed' || rawStatus === 'cancelled' || rawStatus === 'rejected';

        return {
          success: isSuccess,
          providerReference: orderData.orderReference || providerReference,
          errorMessage: isFailed ? (data.message || 'Order failed upstream') : undefined,
          status: isSuccess ? 'success' : isFailed ? 'failed' : 'processing',
        };
      }

      return {
        success: false,
        providerReference,
        errorMessage: data?.message || 'Unable to query order status from DataMart',
        status: 'processing',
      };
    } catch (error: any) {
      console.error('[DatamartGH status query exception]:', error.message);
      return {
        success: false,
        providerReference,
        errorMessage: error.message,
        status: 'processing',
      };
    }
  }

  /**
   * Query upstream DataMart wallet balance.
   * Endpoint: GET /balance
   */
  async getWalletBalance(): Promise<{ balance: number; currency: string }> {
    if (this.isMockMode()) {
      return { balance: 5000.00, currency: 'GHS' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/balance`, {
        method: 'GET',
        headers: this.headers,
      });

      if (response.ok) {
        const data = await response.json();
        const balData = data?.data || data;
        return {
          balance: parseFloat(balData.balance ?? '0'),
          currency: balData.currency || 'GHS',
        };
      }
    } catch (err: any) {
      console.error('[DatamartGH getWalletBalance error]:', err.message);
    }

    return { balance: 0, currency: 'GHS' };
  }
}
