import { NextResponse } from 'next/server';
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { success: false, message: 'Password recovery is not configured in this environment.' },
      { status: 503 }
    );
  }

  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email address is required.' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json(
        { success: false, message: 'Password recovery is temporarily unavailable.' },
        { status: 503 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${appUrl}/reset-password`,
    });

    if (error) {
      const isNetworkError = /fetch|network|timeout|connect|undici/i.test(error.message || '');
      return NextResponse.json(
        {
          success: false,
          message: isNetworkError
            ? 'Unable to reach the password recovery service. Please check your network and try again.'
            : error.message,
        },
        { status: isNetworkError ? 503 : 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    const isNetworkError = /fetch|network|timeout|connect/i.test(error?.message || '');
    return NextResponse.json(
      {
        success: false,
        message: isNetworkError
          ? 'The password recovery service is temporarily unavailable. Please try again shortly.'
          : error?.message || 'Unable to send the password recovery email.',
      },
      { status: isNetworkError ? 503 : 500 }
    );
  }
}
