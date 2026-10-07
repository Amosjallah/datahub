import { NextResponse } from 'next/server';
import { paystackService } from '@/lib/paystack';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      amount,
      walletId,
      userId,
      callbackUrl,
      phone,
      payer_phone,
      payerPhone,
      recipient_phone,
      recipientPhone,
      buy_for,
      account_number,
      accountNumber,
      service,
      planId,
      network,
      referral_code,
      referralCode,
    } = body;

    const numAmount = Number(amount);
    if (!numAmount || isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Valid payment amount (minimum GH₵ 1.00) is required.' },
        { status: 400 }
      );
    }

    const effectivePayerPhone = (payer_phone || payerPhone || phone || '').trim();
    const effectiveRecipientPhone = (recipient_phone || recipientPhone || account_number || accountNumber || phone || '').trim();

    if (!effectivePayerPhone && !email) {
      return NextResponse.json(
        { success: false, message: 'Your Mobile Money payment phone number is required to deduct payment.' },
        { status: 400 }
      );
    }

    const customerEmail = email || `${effectivePayerPhone.replace(/\D/g, '') || 'customer'}@quicknetdata.com`;
    const assignedRefCode = referral_code || referralCode || null;
    
    const reference = walletId 
      ? `WAL_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      : `ORDER_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const result = await paystackService.initializeTransaction({
      email: customerEmail,
      amount: numAmount,
      reference,
      callbackUrl: callbackUrl || `${request.headers.get('origin') || 'https://quicknetdata.com'}/buy?reference=${reference}`,
      metadata: {
        userId: userId || null,
        walletId: walletId || null,
        type: walletId ? 'wallet_topup' : 'guest_order',
        service: service || 'data',
        planId: planId || null,
        network: network || null,
        phone: effectivePayerPhone,
        payer_phone: effectivePayerPhone,
        recipient_phone: effectiveRecipientPhone,
        buy_for: buy_for || 'self',
        account_number: account_number || accountNumber || null,
        referral_code: assignedRefCode,
      },
    });

    if (result.status && result.data) {
      return NextResponse.json({
        success: true,
        authorization_url: result.data.authorization_url,
        access_code: result.data.access_code,
        reference: result.data.reference,
        payerPhone: effectivePayerPhone,
        recipientPhone: effectiveRecipientPhone,
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
