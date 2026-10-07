import { NextResponse } from 'next/server';
import { authenticateApiKey } from '@/lib/apiKeyAuth';

export async function GET(request: Request) {
  const auth = await authenticateApiKey(request);

  if (!auth.authenticated) {
    return NextResponse.json(
      { status: 'error', message: auth.error || 'Unauthorized' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    status: 'success',
    data: {
      account_name: auth.name || 'QuickNet API Partner',
      role: auth.role || 'api_partner',
      wallet_id: auth.walletId,
      balance: Number(auth.balance || 0).toFixed(2),
      currency: 'GHS',
      timestamp: new Date().toISOString(),
    },
  });
}
