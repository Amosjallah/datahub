import { NextResponse } from 'next/server';
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    const { email } = await request.json().catch(() => ({ email: '' }));
    return NextResponse.json({
      success: true,
      demo: true,
      user: {
        id: 'demo-user',
        email: email || 'demo@fadigital.com',
      },
      session: null,
      message: 'Demo mode enabled because Supabase is not configured.',
    });
  }

  const supabase = createAdminClient();
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: name ? name.trim() : '',
        },
      },
    });

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    // Initialize wallet
    if (data?.user) {
      try {
        await supabase.from('wallets').insert({
          user_id: data.user.id,
          currency: 'GHS',
          cached_balance: 0.0000,
        });
      } catch (_) {}
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
    });
  } catch (err: any) {
    const isNetworkError = /fetch|network|timeout|connect/i.test(err?.message || '');
    return NextResponse.json(
      {
        success: false,
        message: isNetworkError
          ? 'The authentication service is temporarily unavailable. Please try again shortly.'
          : err.message || 'Registration server error',
      },
      { status: isNetworkError ? 503 : 500 }
    );
  }
}
