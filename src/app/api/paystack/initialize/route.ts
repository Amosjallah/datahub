import { NextResponse } from 'next/server';
import { paystackService } from '@/lib/paystack';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, amount, walletId, userId, callbackUrl, phone, service, planId, network } = body;

    const numAmount = Number(amount);
    if (!numAmount || isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Valid payment amount (minimum GH₵ 1.00) is required.' },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Customer email or phone is required.' },
        { status: 400 }
      );
    }

    const reference = walletId 
      ? `WAL_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      : `ORDER_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const result = await paystackService.initializeTransaction({
      email,
      amount: numAmount,
      reference,
      callbackUrl: callbackUrl || `${request.headers.get('origin') || 'http://localhost:3000'}/wallet/fund?ref=${reference}`,
      metadata: {
        userId: userId || null,
        walletId: walletId || null,
        type: walletId ? 'wallet_topup' : 'guest_order',
        service: service || 'data',
        planId: planId || null,
        network: network || null,
        phone: phone || null,
      },
    });

    if (result.status && result.data) {
      return NextResponse.json({
        success: true,
        authorization_url: result.data.authorization_url,
        access_code: result.data.access_code,
        reference: result.data.reference,
      });
    }

    return NextResponse.json(
      { success: false, message: result.message || 'Failed to initialize Paystack checkout' },
      { status: 500 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
