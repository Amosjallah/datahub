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

export class HubtelPaymentService {
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;
  private checkoutUrl: string;

  constructor(clientId?: string, clientSecret?: string) {
    this.clientId = clientId || process.env.HUBTEL_CLIENT_ID || '';
    this.clientSecret = clientSecret || process.env.HUBTEL_CLIENT_SECRET || '';
    this.baseUrl = process.env.HUBTEL_BASE_URL || 'https://api-txnmgt.hubtel.com/disbursements';
    this.checkoutUrl = process.env.HUBTEL_CHECKOUT_URL || 'https://payproxyapi.hubtel.com/items/initiate';
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
      const response = await fetch(this.checkoutUrl, {
        method: 'POST',
        headers: this.baseHeaders,
        body: JSON.stringify({
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
        }),
      });

      const data = await response.json().catch(() => null);

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
}
