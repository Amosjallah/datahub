import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { success: false, message: 'Hubtel checkout has been discontinued. Please use Paystack.' },
    { status: 410 }
  );
}
