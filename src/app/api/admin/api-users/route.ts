import { NextResponse } from 'next/server';
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase';

// GET: list all API key holders (approved users with keys)
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      users: [
        { id: 'demo-1', full_name: 'Kwame Tech', email: 'kwame@techco.com', business_name: 'TechCo GH', website_url: 'https://techco.com', key_count: 1, approved_at: new Date().toISOString() },
      ]
    });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('api_key_requests')
      .select('id, full_name, email, business_name, website_url, created_at, reviewed_at')
      .eq('status', 'approved')
      .order('reviewed_at', { ascending: false });

    if (error) return NextResponse.json({ users: [], message: error.message }, { status: 500 });
    return NextResponse.json({ users: data || [] });
  } catch (err: any) {
    return NextResponse.json({ users: [], message: err.message }, { status: 500 });
  }
}
