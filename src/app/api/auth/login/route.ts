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

    const trimmedEmail = email.trim();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });

    if (error) {
      const isNetworkError = /fetch|network|timeout|connect|undici/i.test(error.message || '');
      const isCredentialError = /invalid login credentials|invalid_credentials/i.test(error.message || '');
      const isUnconfirmed = /email not confirmed/i.test(error.message || '');

      let friendlyMessage = error.message;
      if (isNetworkError) {
        friendlyMessage = 'Unable to reach the authentication service. Please check your internet connection and try again.';
      } else if (isCredentialError) {
        friendlyMessage = 'Email or password is incorrect. If you just created this account, confirm your email first, then try again.';
      } else if (isUnconfirmed) {
        friendlyMessage = 'Please confirm your email address using the verification link sent to your inbox before signing in.';
      }

      return NextResponse.json(
        { success: false, message: friendlyMessage, networkError: isNetworkError },
        { status: isNetworkError ? 503 : 400 }
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
      } catch (walletErr) {
        console.warn('Wallet check/creation skipped during login:', walletErr);
      }
    }

    return NextResponse.json({
      success: true,
      session: data.session,
      user: data.user,
    });
  } catch (err: any) {
    const isNetworkError = /fetch|network|timeout|connect|undici/i.test(err?.message || '');
    return NextResponse.json(
      {
        success: false,
        message: isNetworkError
          ? 'Unable to reach authentication service. Please check your network and try again.'
          : err.message || 'Authentication server error',
        networkError: isNetworkError,
      },
      { status: isNetworkError ? 503 : 500 }
    );
  }
}
