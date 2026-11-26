import { NextResponse } from 'next/server';
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ keys: [], message: 'userId required.' }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ keys: [], demo: true });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, key, label, status, created_at, last_used_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ keys: [], message: error.message }, { status: 500 });
    }

    return NextResponse.json({ keys: data || [] });
  } catch (err: any) {
    return NextResponse.json({ keys: [], message: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { key_id, user_id } = body;

    if (!key_id || !user_id) {
      return NextResponse.json({ success: false, message: 'key_id and user_id required.' }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: true, demo: true });
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('api_keys')
      .update({ status: 'revoked' })
      .eq('id', key_id)
      .eq('user_id', user_id);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
