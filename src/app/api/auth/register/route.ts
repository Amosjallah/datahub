import { NextResponse } from 'next/server';
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase';
import { sendSms } from '@/lib/sms';

/** Generate a clean, unique referral code from name + random suffix */
function generateReferralCode(name: string): string {
  const base = (name || 'AGENT')
    .replace(/\s+/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .substring(0, 6);
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${base || 'QNET'}_${suffix}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, phone, role, referred_by } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const assignedRole = role === 'agent' ? 'agent' : 'customer';
    const cleanPhone = (phone || '').trim();

    if (assignedRole === 'agent' && !cleanPhone) {
      return NextResponse.json(
        { success: false, message: 'Agent registration requires a valid phone number to receive your customer link.' },
        { status: 400 }
      );
    }

    const referralCode = generateReferralCode(name || email.split('@')[0]);
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://quicknetdata.com';
    const referralLink = `${siteUrl}/buy?ref=${referralCode}`;

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        demo: true,
        user: {
          id: 'demo-agent',
          email: email.trim(),
          phone: cleanPhone,
          role: assignedRole,
          referral_code: referralCode,
        },
        referralCode,
        referralLink,
        session: null,
        message: 'Agent registered in demo mode.',
      });
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: name ? name.trim() : '',
          phone: cleanPhone,
          role: assignedRole,
          referral_code: referralCode,
          referred_by: referred_by || null,
        },
      },
    });

    if (error) {
      const isNetworkError = /fetch|network|timeout|connect|undici/i.test(error.message || '');
      return NextResponse.json(
        {
          success: false,
          message: isNetworkError
            ? 'Unable to connect to authentication server. Please try again.'
            : error.message,
        },
        { status: isNetworkError ? 503 : 400 }
      );
    }

    let smsResult = { success: false };

    if (data?.user) {
      // 1. Initialize user wallet
      try {
        await supabase.from('wallets').insert({
          user_id: data.user.id,
          currency: 'GHS',
          cached_balance: 0.0000,
        });
      } catch (_) {}

      // 2. Upsert profile in users table
      try {
        await supabase.from('users').upsert({
          id: data.user.id,
          email: email.trim(),
          full_name: name ? name.trim() : '',
          phone: cleanPhone,
          role: assignedRole,
          referral_code: referralCode,
          referred_by: referred_by || null,
        }, { onConflict: 'id' });
      } catch (_) {}

      // 3. If registering as an agent, send referral link via SMS to agent's phone
      if (assignedRole === 'agent' && cleanPhone) {
        const smsMessage = `Welcome to QuickNet Data! 🎉\nYour agent store link is:\n${referralLink}\n\nShare this link with your customers to earn commissions. Referral Code: ${referralCode}`;
        
        try {
          smsResult = await sendSms({
            to: cleanPhone,
            message: smsMessage,
            senderId: 'QuickNet',
          });
        } catch (smsErr) {
          console.warn('[Register SMS Dispatch Warning]:', smsErr);
        }

        // Store notification record
        try {
          await supabase.from('agent_notifications').insert({
            user_id: data.user.id,
            type: 'referral_link',
            phone: cleanPhone,
            message: smsMessage,
            status: smsResult.success ? 'sent' : 'queued',
          });
        } catch (_) {}
      }
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
      referralCode,
      referralLink,
      smsSent: smsResult.success,
      message: assignedRole === 'agent'
        ? `Agent account created! Your referral link (${referralLink}) has been sent to ${cleanPhone}.`
        : 'Account created successfully.',
    });
  } catch (err: any) {
    console.error('[Register API Error]:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Server error during registration.' },
      { status: 500 }
    );
  }
}
