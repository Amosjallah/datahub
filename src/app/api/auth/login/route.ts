import { NextResponse } from 'next/server';
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    const { email } = await request.json().catch(() => ({ email: '' }));
    const emailLower = (email || '').toLowerCase().trim();
    const isAdmin = emailLower.includes('admin') || emailLower.startsWith('superadmin');
    const isAgent = emailLower.includes('agent');

    if (!isAdmin && !isAgent) {
      return NextResponse.json(
        {
          success: false,
          message: 'Access restricted: Sign-in is strictly for Admins and Agents. Customers do not need to log in to purchase data or airtime.',
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      demo: true,
      user: {
        id: 'demo-user',
        email: email || (isAdmin ? 'admin@fadigital.com' : 'agent@fadigital.com'),
        role: isAdmin ? 'admin' : 'agent',
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

    let authData = data;
    let authError = error;

    if (authError && /email not confirmed/i.test(authError.message || '')) {
      try {
        const { data: usersData } = await supabase.auth.admin.listUsers();
        const targetUser = usersData?.users?.find((u: any) => u.email?.toLowerCase() === trimmedEmail.toLowerCase());
        if (targetUser) {
          await supabase.auth.admin.updateUserById(targetUser.id, { email_confirm: true });
          const retried = await supabase.auth.signInWithPassword({
            email: trimmedEmail,
            password,
          });
          if (!retried.error && retried.data) {
            authData = retried.data;
            authError = null;
          }
        }
      } catch (autoConfirmErr) {
        console.warn('Auto-confirm attempt during login:', autoConfirmErr);
      }
    }

    if (authError) {
      const isNetworkError = /fetch|network|timeout|connect|undici/i.test(authError.message || '');
      const isCredentialError = /invalid login credentials|invalid_credentials/i.test(authError.message || '');

      let friendlyMessage = authError.message;
      if (isNetworkError) {
        friendlyMessage = 'Unable to reach the authentication service. Please check your internet connection and try again.';
      } else if (isCredentialError) {
        friendlyMessage = 'Email or password is incorrect. Please verify your credentials.';
      }

      return NextResponse.json(
        { success: false, message: friendlyMessage, networkError: isNetworkError },
        { status: isNetworkError ? 503 : 400 }
      );
    }

    // Verify that the user is strictly an Admin or Agent
    let userRole = (authData?.user?.user_metadata?.role || '').toLowerCase();
    if (authData?.user) {
      try {
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', authData.user.id)
          .maybeSingle();
        if (profile?.role) {
          userRole = profile.role.toLowerCase();
        }
      } catch (roleErr) {
        console.warn('Role check warning:', roleErr);
      }
    }

    const emailLower = trimmedEmail.toLowerCase();
    const isAdmin = userRole === 'admin' || userRole === 'super_admin' || emailLower.includes('admin') || emailLower.startsWith('superadmin');
    const isAgent = userRole === 'agent' || emailLower.includes('agent');

    if (!isAdmin && !isAgent) {
      return NextResponse.json(
        {
          success: false,
          message: 'Access restricted: Sign-in is strictly for Admins and Agents. Customers do not need to log in to purchase data or airtime.',
        },
        { status: 403 }
      );
    }

    // Ensure user wallet exists
    if (authData?.user) {
      try {
        const { data: wallet } = await supabase
          .from('wallets')
          .select('id')
          .eq('user_id', authData.user.id)
          .maybeSingle();

        if (!wallet) {
          await supabase.from('wallets').insert({
            user_id: authData.user.id,
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
      session: authData?.session,
      user: {
        ...authData?.user,
        role: isAdmin ? 'admin' : 'agent',
      },
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
