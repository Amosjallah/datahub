import { NextResponse } from 'next/server';
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const email = searchParams.get('email');

  if (!userId && !email) {
    return NextResponse.json({ status: null, message: 'userId or email required.' }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ status: null, demo: true });
  }

  try {
    const supabase = createAdminClient();

    let query = supabase.from('api_key_requests').select('id, status, created_at, admin_note');
    if (userId) {
      query = query.eq('user_id', userId);
    } else if (email) {
      query = query.eq('email', email);
    }

    const { data, error } = await query.order('created_at', { ascending: false }).limit(1).maybeSingle();

    if (error) {
      return NextResponse.json({ status: null, message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      status: data?.status || null,
      request_id: data?.id || null,
      admin_note: data?.admin_note || null,
      created_at: data?.created_at || null,
    });
  } catch (err: any) {
    return NextResponse.json({ status: null, message: err.message }, { status: 500 });
  }
}
