import crypto from 'crypto';

export interface InitializePaystackParams {
  email: string;
  amount: number; // In GHS (e.g. 50.00)
  reference?: string;
  callbackUrl?: string;
  metadata?: Record<string, any>;
}

export interface PaystackInitResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    domain: string;
    status: 'success' | 'failed' | 'abandoned';
    reference: string;
    amount: number; // in pesewas
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    customer: {
      id: number;
      email: string;
      customer_code: string;
    };
    metadata?: Record<string, any>;
  };
}

export class PaystackService {
  private secretKey: string;
  private publicKey: string;

  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY || '';
    this.publicKey = process.env.PAYSTACK_PUBLIC_KEY || '';
  }

  /**
   * Initialize Paystack payment session
   */
  async initializeTransaction(params: InitializePaystackParams): Promise<PaystackInitResponse> {
    const reference = params.reference || `PSK_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const amountInPesewas = Math.round(params.amount * 100);

    // Sandbox mock response if placeholder key is used
    if (!this.secretKey || this.secretKey.includes('placeholder')) {
      console.log(`[Paystack Mock Mode] Initializing payment GHS ${params.amount} for ${params.email}`);
      return {
        status: true,
        message: 'Authorization URL created (Mock Sandbox)',
        data: {
          authorization_url: `/wallet/fund?mock_paystack_ref=${reference}&amount=${params.amount}`,
          access_code: `mock_code_${reference}`,
          reference,
        },
      };
    }

    try {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: params.email,
          amount: amountInPesewas,
          currency: 'GHS',
          reference,
          callback_url: params.callbackUrl,
          metadata: params.metadata || {},
        }),
      });

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('[Paystack Init Error]:', error);
      return {
        status: false,
        message: error.message || 'Failed to connect to Paystack payment gateway',
      };
    }
  }

  /**
   * Verify transaction status with Paystack API
   */
  async verifyTransaction(reference: string): Promise<PaystackVerifyResponse> {
    if (!this.secretKey || this.secretKey.includes('placeholder')) {
      return {
        status: true,
        message: 'Verification successful (Mock Sandbox)',
        data: {
          id: 123456,
          domain: 'test',
          status: 'success',
          reference,
          amount: 5000, // 50 GHS
          gateway_response: 'Successful',
          paid_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          channel: 'mobile_money',
          currency: 'GHS',
          customer: { id: 1, email: 'user@fadigital.com', customer_code: 'CUST_123' },
        },
      };
    }

    try {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('[Paystack Verify Error]:', error);
      return {
        status: false,
        message: error.message || 'Failed to verify transaction with Paystack',
      };
    }
  }

  /**
   * Validate Paystack HMAC SHA512 Webhook Signature
   */
  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    if (!this.secretKey) return false;
    const hash = crypto.createHmac('sha512', this.secretKey).update(rawBody).digest('hex');
    return hash === signature;
  }
}

export const paystackService = new PaystackService();
