import { NextResponse } from 'next/server';
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase';
import crypto from 'crypto';

function generateApiKey(): string {
  const prefix = 'qnet_live_';
  const random = crypto.randomBytes(24).toString('hex');
  return `${prefix}${random}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, label } = body;

    if (!user_id) {
      return NextResponse.json({ success: false, message: 'user_id is required.' }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      const demoKey = generateApiKey();
      return NextResponse.json({ success: true, demo: true, key: demoKey });
    }

    const supabase = createAdminClient();

    // Verify user is approved
    const { data: request_ } = await supabase
      .from('api_key_requests')
      .select('status')
      .eq('user_id', user_id)
      .eq('status', 'approved')
      .maybeSingle();

    if (!request_) {
      return NextResponse.json({ success: false, message: 'Your API access application has not been approved yet.' }, { status: 403 });
    }

    // Generate new key
    const newKey = generateApiKey();

    const { error } = await supabase.from('api_keys').insert({
      user_id,
      key: newKey,
      label: label || 'Default Key',
      status: 'active',
    });

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    // Update user's api_key column too (for quick lookup in auth)
    await supabase.from('users').update({ api_key: newKey }).eq('id', user_id);

    return NextResponse.json({ success: true, key: newKey });
  } catch (err: any) {
    console.error('[Generate API Key Error]:', err);
    return NextResponse.json({ success: false, message: err.message || 'Server error.' }, { status: 500 });
  }
}
