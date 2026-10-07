import { NextResponse } from 'next/server';
import { sendSms } from '@/lib/sms';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, referralCode, referralLink, name } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required.' },
        { status: 400 }
      );
    }

    const message = `Hello ${name || 'Agent'}! 👋\nHere is your QuickNet Data store referral link:\n${referralLink}\n\nShare this link with your customers to earn commissions. Referral Code: ${referralCode}`;

    const smsRes = await sendSms({
      to: phone,
      message,
      senderId: 'QuickNet',
    });

    return NextResponse.json({
      success: true,
      message: 'Referral link sent to ' + phone,
      sms: smsRes,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to send SMS' },
      { status: 500 }
    );
  }
}
