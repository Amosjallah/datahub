import { NextResponse } from 'next/server';
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, full_name, email, business_name, website_url, ghana_card_url, document_url } = body;

    if (!full_name || !email || !business_name || !ghana_card_url || !document_url) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: name, email, business name, Ghana card, and document are all required.' },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      // Demo mode
      return NextResponse.json({ success: true, demo: true, message: 'Application submitted (demo mode).' });
    }

    const supabase = createAdminClient();

    // Check if already applied
    const { data: existing } = await supabase
      .from('api_key_requests')
      .select('id, status')
      .eq('email', email.trim())
      .maybeSingle();

    if (existing) {
      if (existing.status === 'approved') {
        return NextResponse.json({ success: false, message: 'This email already has an approved API access request.' }, { status: 409 });
      }
      if (existing.status === 'pending') {
        return NextResponse.json({ success: false, message: 'You already have a pending API access application. Please wait for review.' }, { status: 409 });
      }
    }

    // Insert KYC request
    const { data: kycRequest, error } = await supabase
      .from('api_key_requests')
      .insert({
        user_id: user_id || null,
        full_name: full_name.trim(),
        email: email.trim(),
        business_name: business_name.trim(),
        website_url: website_url?.trim() || null,
        ghana_card_url: ghana_card_url.trim(),
        document_url: document_url.trim(),
        status: 'pending',
      })
      .select('id')
      .single();

    if (error) {
      console.error('[API Access Apply Error]:', error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    // Update user's api_access_status if user_id provided
    if (user_id) {
      await supabase.from('users').update({ api_access_status: 'pending' }).eq('id', user_id);
    }

    // Create admin notification
    await supabase.from('admin_notifications').insert({
      type: 'api_kyc_request',
      title: `New API Access Application: ${business_name}`,
      message: `${full_name} (${email}) has submitted an API access application for ${business_name}. Document: ${document_url}`,
      reference_id: kycRequest.id,
      is_read: false,
    });

    return NextResponse.json({ success: true, message: 'Application submitted successfully. You will be notified within 24 hours.' });
  } catch (err: any) {
    console.error('[API Access Apply Error]:', err);
    return NextResponse.json({ success: false, message: err.message || 'Server error.' }, { status: 500 });
  }
}
