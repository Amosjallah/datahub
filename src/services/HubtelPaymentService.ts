/**
 * HubtelPaymentService
 * Handles payment collections, disbursements, and online checkout via Hubtel's API.
 * Authentication: HTTP Basic — base64(CLIENT_ID:CLIENT_SECRET)
 * Docs: https://developers.hubtel.com/docs/business/api_documentation/payment_apis
 */

export interface HubtelReceiveMoneyRequest {
  amount: number;
  title: string;
  description: string;
  customerName: string;
  customerMsisdn: string;
  customerEmail?: string;
  callbackUrl: string;
  returnUrl?: string;
  cancellationUrl?: string;
  clientReference: string;
}

export interface HubtelSendMoneyRequest {
  amount: number;
  recipientName: string;
  recipientMsisdn: string;
  description: string;
  clientReference: string;
  callbackUrl: string;
}

export interface HubtelCheckoutRequest {
  totalAmount: number;
  description: string;
  callbackUrl: string;
  returnUrl: string;
  cancellationUrl: string;
  merchantAccountNumber: string;
  clientReference: string;
  items?: { name: string; quantity: number; unitPrice: number }[];
}

export interface HubtelPaymentResponse {
  success: boolean;
  transactionId?: string;
  checkoutUrl?: string;
  clientReference?: string;
  status?: string;
  errorMessage?: string;
  rawData?: any;
}

export const HUBTEL_COMMISSION_SERVICE_IDS = {
  AIRTIME: {
    MTN: 'fdd76c884e614b1c8f669a3207b09a98',
    TELECEL: 'f4be83ad74c742e185224fdae1304800',
    AIRTELTIGO: 'dae2142eb5a14c298eace60240c09e4b',
  },
  DATA: {
    MTN: 'b230733cd56b4a0fad820e39f66bc27c',
    TELECEL: 'fa27127ba039455da04a2ac8a1613e00',
    AIRTELTIGO: '06abd92da459428496967612463575ca',
  },
  BILLS: {
    ECG: 'e6d6bac062b5499cb1ece1ac3d742a84',
    GWCL: '6c1e8a82d2e84feeb8bfd6be2790d71d',
    DSTV: '297a96656b5846ad8b00d5d41b256ea7',
    GOTV: 'e6ceac7f3880435cb30b048e9617eb41',
    STARTIMES: '6598652d34ea4112949c93c079c501ce',
    TELECEL_BROADBAND: 'b9a1aa246ba748f9ba01ca4cdbb3d1d3',
    TELECEL_POSTPAID: 'a3ab78c84c6b4976b78a6f393e247a72',
  },
} as const;

export interface HubtelCommissionServiceRequest {
  destination: string;
  amount: number;
  callbackUrl: string;
  clientReference: string;
  serviceId: string;
  merchantAccountNumber?: string;
}

export class HubtelPaymentService {
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;
  private checkoutUrl: string;
  private commissionServicesBaseUrl: string;

  constructor(clientId?: string, clientSecret?: string) {
    this.clientId = clientId || process.env.HUBTEL_CLIENT_ID || '';
    this.clientSecret = clientSecret || process.env.HUBTEL_CLIENT_SECRET || '';
    this.baseUrl = process.env.HUBTEL_BASE_URL || 'https://api-txnmgt.hubtel.com/disbursements';
    this.checkoutUrl = process.env.HUBTEL_CHECKOUT_URL || 'https://payproxyapi.hubtel.com/items/initiate';
    this.commissionServicesBaseUrl = process.env.HUBTEL_COMMISSION_SERVICES_URL || 'https://cs.hubtel.com/commissionservices';
  }

  /** Generate HTTP Basic Auth header from ClientID and ClientSecret */
  private get authHeader(): string {
    const encoded = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    return `Basic ${encoded}`;
  }

  private get baseHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: this.authHeader,
      'Cache-Control': 'no-cache',
    };
  }

  private isMockMode(): boolean {
    return !this.clientId || this.clientId.includes('placeholder');
  }

  /**
   * Receive Money — prompt customer to pay via mobile money (MoMo collection).
   * Uses Hubtel Direct Receive Money API.
   * POST https://api-txnmgt.hubtel.com/disbursements/receive-money
   */
  async receiveMoney(request: HubtelReceiveMoneyRequest): Promise<HubtelPaymentResponse> {
    if (this.isMockMode()) {
      console.log('[Hubtel Mock] receiveMoney:', request.customerMsisdn, request.amount);
      return {
        success: true,
        transactionId: `HBT_MOCK_${Date.now()}`,
        clientReference: request.clientReference,
        status: 'pending',
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/receive-money`, {
        method: 'POST',
        headers: this.baseHeaders,
        body: JSON.stringify({
          Amount: request.amount,
          Title: request.title,
          Description: request.description,
          PrimaryCallbackUrl: request.callbackUrl,
          ReturnUrl: request.returnUrl || '',
          CancellationUrl: request.cancellationUrl || '',
          Logo: '',
          ClientReference: request.clientReference,
          PaymentType: 'momo',
          CustomerName: request.customerName,
          CustomerMsisdn: request.customerMsisdn,
          CustomerEmail: request.customerEmail || '',
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data) {
        return {
          success: true,
          transactionId: data.Data?.TransactionId || data.transactionId,
          clientReference: data.Data?.ClientReference || request.clientReference,
          status: data.Data?.Status || 'pending',
          rawData: data,
        };
      }

      return {
        success: false,
        errorMessage: data?.Message || data?.message || `Hubtel receive-money error (HTTP ${response.status})`,
        rawData: data,
      };
    } catch (error: any) {
      console.error('[Hubtel] receiveMoney error:', error);
      return { success: false, errorMessage: error.message || 'Hubtel connection error' };
    }
  }

  /**
   * Send Money — disburse funds to a customer's MoMo wallet.
   * POST https://api-txnmgt.hubtel.com/disbursements/send-money
   */
  async sendMoney(request: HubtelSendMoneyRequest): Promise<HubtelPaymentResponse> {
    if (this.isMockMode()) {
      console.log('[Hubtel Mock] sendMoney:', request.recipientMsisdn, request.amount);
      return {
        success: true,
        transactionId: `HBT_SEND_MOCK_${Date.now()}`,
        clientReference: request.clientReference,
        status: 'pending',
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/send-money`, {
        method: 'POST',
        headers: this.baseHeaders,
        body: JSON.stringify({
          Amount: request.amount,
          RecipientName: request.recipientName,
          RecipientMsisdn: request.recipientMsisdn,
          Description: request.description,
          PrimaryCallbackUrl: request.callbackUrl,
          ClientReference: request.clientReference,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data) {
        return {
          success: true,
          transactionId: data.Data?.TransactionId || data.transactionId,
          clientReference: data.Data?.ClientReference || request.clientReference,
          status: data.Data?.Status || 'pending',
          rawData: data,
        };
      }

      return {
        success: false,
        errorMessage: data?.Message || data?.message || `Hubtel send-money error (HTTP ${response.status})`,
        rawData: data,
      };
    } catch (error: any) {
      console.error('[Hubtel] sendMoney error:', error);
      return { success: false, errorMessage: error.message || 'Hubtel connection error' };
    }
  }

  /**
   * Online Checkout — initiate a Hubtel-hosted checkout session.
   * POST https://payproxyapi.hubtel.com/items/initiate
   * Returns a checkoutUrl for the customer to complete payment.
   */
  async initiateCheckout(request: HubtelCheckoutRequest): Promise<HubtelPaymentResponse> {
    if (this.isMockMode()) {
      console.log('[Hubtel Mock] initiateCheckout:', request.totalAmount);
      return {
        success: true,
        checkoutUrl: `https://checkout.hubtel.com/mock?ref=${request.clientReference}&amount=${request.totalAmount}`,
        clientReference: request.clientReference,
        status: 'initiated',
      };
    }

    try {
      const payload = {
        totalAmount: request.totalAmount,
        description: request.description,
        callbackUrl: request.callbackUrl,
        returnUrl: request.returnUrl,
        cancellationUrl: request.cancellationUrl,
        merchantAccountNumber: request.merchantAccountNumber,
        clientReference: request.clientReference,
        items: request.items || [
          {
            name: request.description,
            quantity: 1,
            unitPrice: request.totalAmount,
          },
        ],
      };

      console.log('[Hubtel Checkout] Initiating checkout:', {
        url: this.checkoutUrl,
        clientId: this.clientId ? `${this.clientId.substring(0, 3)}***` : 'MISSING',
        merchantAccountNumber: request.merchantAccountNumber,
        amount: request.totalAmount,
        clientReference: request.clientReference,
      });

      const response = await fetch(this.checkoutUrl, {
        method: 'POST',
        headers: this.baseHeaders,
        body: JSON.stringify(payload),
      });

      // Handle non-JSON responses (HTML error pages from gateway)
      const contentType = response.headers.get('content-type') || '';
      let data: any = null;
      if (contentType.includes('application/json')) {
        data = await response.json().catch(() => null);
      } else {
        const text = await response.text().catch(() => '');
        console.warn('[Hubtel Checkout] Non-JSON response:', response.status, text.substring(0, 300));
        data = { message: `HTTP ${response.status}: ${text.substring(0, 200)}` };
      }

      if (!response.ok) {
        console.error('[Hubtel Checkout Failed]:', {
          status: response.status,
          statusText: response.statusText,
          responseBody: data,
          clientId: this.clientId ? `${this.clientId.substring(0, 3)}***` : 'MISSING',
          secretProvided: !!this.clientSecret,
          merchantAccountNumber: request.merchantAccountNumber,
          checkoutUrl: this.checkoutUrl,
        });
      }

      if (response.ok && data) {
        const checkoutUrl = data.data?.checkoutUrl || data.checkoutUrl || data.paylinkUrl;
        return {
          success: !!checkoutUrl,
          checkoutUrl,
          clientReference: request.clientReference,
          status: 'initiated',
          rawData: data,
          errorMessage: !checkoutUrl ? 'Hubtel did not return a checkout URL' : undefined,
        };
      }

      return {
        success: false,
        errorMessage: data?.message || data?.Message || `Hubtel checkout error (HTTP ${response.status})`,
        rawData: data,
      };
    } catch (error: any) {
      console.error('[Hubtel] initiateCheckout error:', error);
      return { success: false, errorMessage: error.message || 'Hubtel checkout connection error' };
    }
  }

  /**
   * Query transaction status.
   * GET https://api-txnmgt.hubtel.com/disbursements/transaction-status/{clientReference}
   */
  async queryTransactionStatus(clientReference: string): Promise<HubtelPaymentResponse> {
    if (this.isMockMode()) {
      return { success: true, clientReference, status: 'success' };
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/transaction-status/${encodeURIComponent(clientReference)}`,
        { method: 'GET', headers: this.baseHeaders }
      );

      const data = await response.json().catch(() => null);

      if (response.ok && data) {
        const status = data.Data?.Status || data.status;
        return {
          success: status === 'Success' || status === 'success',
          transactionId: data.Data?.TransactionId,
          clientReference,
          status: status?.toLowerCase() || 'pending',
          rawData: data,
        };
      }

      return {
        success: false,
        clientReference,
        errorMessage: data?.Message || 'Unable to query Hubtel transaction status',
        status: 'pending',
      };
    } catch (error: any) {
      return { success: false, clientReference, errorMessage: error.message, status: 'pending' };
    }
  }

  /**
   * Commission Services API — Airtime top-ups, data bundles, and utility bill payments.
   * Documented Hubtel purchase endpoint:
   * POST https://cs.hubtel.com/commissionservices/{Disbursement_Account_Number}/{ServiceID}
   * Headers: Authorization: Basic base64(ClientID:ClientSecret), Content-Type: application/json
   * Body: { Destination, Amount, CallbackUrl, ClientReference }
   */
  async purchaseCommissionService(request: HubtelCommissionServiceRequest): Promise<HubtelPaymentResponse> {
    if (this.isMockMode()) {
      const maskedPhone = request.destination.length > 5
        ? `${request.destination.substring(0, 3)}****${request.destination.substring(request.destination.length - 3)}`
        : '***';
      console.log('[Hubtel Mock] purchaseCommissionService:', {
        destination: maskedPhone,
        amount: request.amount,
        serviceId: request.serviceId,
        ref: request.clientReference,
      });
      return {
        success: true,
        transactionId: `HBT_CS_MOCK_${Date.now()}`,
        clientReference: request.clientReference,
        status: 'processing',
      };
    }

    const account = request.merchantAccountNumber || process.env.HUBTEL_MERCHANT_ACCOUNT_NUMBER || process.env.HUBTEL_MERCHANT || '';
    if (!account) {
      return {
        success: false,
        clientReference: request.clientReference,
        errorMessage: 'Hubtel Disbursement Account Number is missing. Configure HUBTEL_MERCHANT_ACCOUNT_NUMBER or HUBTEL_MERCHANT in server environment.',
        status: 'failed',
      };
    }

    const targetUrl = `${this.commissionServicesBaseUrl.replace(/\/+$/, '')}/${encodeURIComponent(account)}/${encodeURIComponent(request.serviceId)}`;

    const maskedPhone = request.destination.length > 5
      ? `${request.destination.substring(0, 3)}****${request.destination.substring(request.destination.length - 3)}`
      : '***';

    console.log('[Hubtel CommissionServices] Initiating purchase:', {
      account,
      serviceId: request.serviceId,
      amount: request.amount,
      destination: maskedPhone,
      clientReference: request.clientReference,
    });

    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: this.baseHeaders,
        body: JSON.stringify({
          Destination: request.destination,
          Amount: Number(Number(request.amount).toFixed(2)),
          CallbackUrl: request.callbackUrl,
          ClientReference: request.clientReference,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      let data: any = null;
      if (contentType.includes('application/json')) {
        data = await response.json().catch(() => null);
      } else {
        const text = await response.text().catch(() => '');
        data = { message: `HTTP ${response.status}: ${text.substring(0, 200)}` };
      }

      if (response.ok && data) {
        // Official Hubtel Commission Services codes:
        // "0001": Transaction pending/accepted (expect callback for final state)
        // "0000": Immediate transaction success
        const isAccepted = data.ResponseCode === '0000' || data.ResponseCode === '0001' || data.status === 'success' || data.status === 'pending';
        const transactionId = data.Data?.TransactionId || data.transactionId;

        if (isAccepted) {
          return {
            success: true,
            transactionId,
            clientReference: request.clientReference,
            status: data.ResponseCode === '0000' ? 'success' : 'processing',
            rawData: data,
          };
        }

        return {
          success: false,
          clientReference: request.clientReference,
          errorMessage: data.Message || data.message || `Hubtel commission service error (Code: ${data.ResponseCode || response.status})`,
          rawData: data,
          status: 'failed',
        };
      }

      return {
        success: false,
        clientReference: request.clientReference,
        errorMessage: data?.Message || data?.message || `Hubtel gateway error (HTTP ${response.status})`,
        rawData: data,
        status: 'failed',
      };
    } catch (error: any) {
      console.error('[Hubtel CommissionServices network exception]:', error.message);
      return {
        success: false,
        clientReference: request.clientReference,
        errorMessage: error.message || 'Failed to connect to Hubtel Commission Services gateway',
        status: 'failed',
      };
    }
  }
}
