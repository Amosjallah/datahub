import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
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
    return NextResponse.json(
      { success: false, message: err.message || 'Registration server error' },
      { status: 500 }
    );
  }
}
