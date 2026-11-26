import { NextResponse } from 'next/server';
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase';

// GET: fetch agent info & custom prices by referral code (for store & buy page branding)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get('ref');

  if (!ref) {
    return NextResponse.json({ agent: null, custom_prices: {}, message: 'ref required.' }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      agent: { business_name: 'QuickNet Store', full_name: 'Demo Agent', referral_code: ref },
      custom_prices: {},
    });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, business_name, referral_code')
      .eq('referral_code', ref)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ agent: null, custom_prices: {} });
    }

    const { data: pricingRows } = await supabase
      .from('agent_pricing')
      .select('service_id, custom_price')
      .eq('agent_id', data.id);

    const custom_prices: Record<string, number> = {};
    (pricingRows || []).forEach((row: { service_id: string; custom_price: number }) => {
      custom_prices[row.service_id] = Number(row.custom_price);
    });

    return NextResponse.json({
      agent: {
        business_name: data.business_name || data.full_name || 'QuickNet Store',
        full_name: data.full_name,
        referral_code: data.referral_code,
      },
      custom_prices,
    });
  } catch (err: any) {
    return NextResponse.json({ agent: null, custom_prices: {}, message: err.message }, { status: 500 });
  }
}
