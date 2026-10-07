import { NextResponse } from 'next/server';
import { POST as handlePurchase } from '../transaction/purchase/route';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const clonedRequest = new Request(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify({
        ...body,
        service_type: 'bill',
      }),
    });
    return handlePurchase(clonedRequest);
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 400 });
  }
}
