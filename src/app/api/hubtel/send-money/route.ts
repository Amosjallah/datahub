import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { success: false, message: 'Hubtel disbursement has been discontinued.' },
    { status: 410 }
  );
}
