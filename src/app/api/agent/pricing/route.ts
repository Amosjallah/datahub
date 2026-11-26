import { NextResponse } from 'next/server';
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase';
import { dataServices } from '@/lib/servicesData';

// GET: list agent's custom pricing (or defaults if none set)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const agentId = searchParams.get('agentId');

  if (!agentId) {
    return NextResponse.json({ prices: [], message: 'agentId required.' }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    // Return default agent-tier prices from catalog
    const prices = dataServices.map(svc => ({
      service_id: svc.id,
      network: svc.network,
      volume: svc.volume,
      name: svc.name,
      base_price: svc.agent_price,
      custom_price: svc.agent_price,
      is_custom: false,
    }));
    return NextResponse.json({ prices });
  }

  try {
    const supabase = createAdminClient();
    const { data: customPrices } = await supabase
      .from('agent_pricing')
      .select('service_id, custom_price, base_price')
      .eq('agent_id', agentId);

    const customMap: Record<string, number> = {};
    (customPrices || []).forEach(p => { customMap[p.service_id] = p.custom_price; });

    const prices = dataServices.map(svc => ({
      service_id: svc.id,
      network: svc.network,
      volume: svc.volume,
      name: svc.name,
      base_price: svc.agent_price,
      custom_price: customMap[svc.id] ?? svc.agent_price,
      is_custom: svc.id in customMap,
    }));

    return NextResponse.json({ prices });
  } catch (err: any) {
    return NextResponse.json({ prices: [], message: err.message }, { status: 500 });
  }
}

// POST: save agent custom prices (bulk upsert)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agent_id, prices } = body;

    if (!agent_id || !Array.isArray(prices) || prices.length === 0) {
      return NextResponse.json({ success: false, message: 'agent_id and prices array are required.' }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: true, demo: true });
    }

    const supabase = createAdminClient();

    // Validate no price below base cost
    const basePriceMap: Record<string, number> = {};
    dataServices.forEach(s => { basePriceMap[s.id] = s.agent_price; });

    const rows = prices
      .filter(p => p.service_id && p.custom_price !== undefined)
      .map(p => {
        const base = basePriceMap[p.service_id] || 0;
        const custom = Math.max(parseFloat(p.custom_price), base); // Can't go below agent cost
        return {
          agent_id,
          service_id: p.service_id,
          network: p.network || '',
          volume: p.volume || '',
          custom_price: parseFloat(custom.toFixed(2)),
          base_price: parseFloat(base.toFixed(2)),
          updated_at: new Date().toISOString(),
        };
      });

    const { error } = await supabase
      .from('agent_pricing')
      .upsert(rows, { onConflict: 'agent_id,service_id' });

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, saved: rows.length });
  } catch (err: any) {
    console.error('[Agent Pricing Save Error]:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
