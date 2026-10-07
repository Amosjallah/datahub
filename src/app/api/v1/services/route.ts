import { NextResponse } from 'next/server';
import { authenticateApiKey } from '@/lib/apiKeyAuth';
import { allServices as servicesList } from '@/lib/servicesData';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Public or API Key authenticated
  const auth = await authenticateApiKey(request);
  const { searchParams } = new URL(request.url);
  const typeFilter = searchParams.get('type');
  const networkFilter = searchParams.get('network');

  let filtered = servicesList;
  if (typeFilter) {
    filtered = filtered.filter((s) => s.type.toLowerCase() === typeFilter.toLowerCase());
  }
  if (networkFilter) {
    filtered = filtered.filter((s) => s.network.toLowerCase() === networkFilter.toLowerCase());
  }

  return NextResponse.json({
    status: 'success',
    count: filtered.length,
    authenticated: auth.authenticated,
    data: filtered,
  });
}
