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
        role: 'customer',
      },
      session: null,
      message: 'Demo mode enabled because Supabase is not configured.',
    });
  }

  const supabase = createAdminClient();
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    // Ensure user wallet exists
    if (data?.user) {
      try {
        const { data: wallet } = await supabase
          .from('wallets')
          .select('id')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (!wallet) {
          await supabase.from('wallets').insert({
            user_id: data.user.id,
            currency: 'GHS',
            cached_balance: 0.0000,
          });
        }
      } catch (_) {}
    }

    return NextResponse.json({
      success: true,
      session: data.session,
      user: data.user,
    });
  } catch (err: any) {
    const isNetworkError = /fetch|network|timeout|connect/i.test(err?.message || '');
    return NextResponse.json(
      {
        success: false,
        message: isNetworkError
          ? 'The authentication service is temporarily unavailable. Please try again shortly.'
          : err.message || 'Authentication server error',
      },
      { status: isNetworkError ? 503 : 500 }
    );
  }
}
