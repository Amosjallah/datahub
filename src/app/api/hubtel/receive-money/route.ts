import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { success: false, message: 'Hubtel MoMo collection has been discontinued. Please use Paystack.' },
    { status: 410 }
  );
}
