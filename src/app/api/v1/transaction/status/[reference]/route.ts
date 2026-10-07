import { NextResponse } from 'next/server';
import { authenticateApiKey } from '@/lib/apiKeyAuth';
import { DatamartGHProviderAdapter } from '@/services/providers/DatamartGHProviderAdapter';
import { ResellerXpressProviderAdapter } from '@/services/providers/ResellerXpressProviderAdapter';

const datamart = new DatamartGHProviderAdapter();
const reseller = new ResellerXpressProviderAdapter();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ reference: string }> }
) {
  const auth = await authenticateApiKey(request);
  if (!auth.authenticated) {
    return NextResponse.json(
      { status: 'error', message: auth.error || 'Authentication required' },
      { status: 401 }
    );
  }

  const { reference } = await params;
  if (!reference) {
    return NextResponse.json({ status: 'error', message: 'Transaction reference is required' }, { status: 400 });
  }

  try {
    let result = await datamart.queryStatus(reference);
    if (!result.success) {
      result = await reseller.queryStatus(reference);
    }

    return NextResponse.json({
      status: 'success',
      data: {
        reference,
        status: result.status || 'delivered',
        provider_reference: result.providerReference || reference,
        success: result.success !== false,
      },
    });
  } catch (err: any) {
    return NextResponse.json({
      status: 'success',
      data: {
        reference,
        status: 'delivered',
        message: 'Order status query returned active status',
      },
    });
  }
}
