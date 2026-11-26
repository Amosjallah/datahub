import { NextResponse } from 'next/server';
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase';

// GET: list all API key requests
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status'); // 'pending' | 'approved' | 'rejected' | null (all)

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      requests: [
        { id: 'demo-1', full_name: 'Kwame Tech', email: 'kwame@techco.com', business_name: 'TechCo GH', website_url: 'https://techco.com', ghana_card_url: 'GHA-123456789-0', document_url: 'https://drive.google.com/demo', status: 'pending', created_at: new Date().toISOString() },
      ]
    });
  }

  try {
    const supabase = createAdminClient();
    let query = supabase.from('api_key_requests').select('*').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) return NextResponse.json({ requests: [], message: error.message }, { status: 500 });
    return NextResponse.json({ requests: data || [] });
  } catch (err: any) {
    return NextResponse.json({ requests: [], message: err.message }, { status: 500 });
  }
}

// PATCH: approve or reject a request
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { request_id, action, admin_note } = body; // action: 'approve' | 'reject'

    if (!request_id || !action) {
      return NextResponse.json({ success: false, message: 'request_id and action are required.' }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: true, demo: true });
    }

    const supabase = createAdminClient();
    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    const { data: kycRow, error: fetchErr } = await supabase
      .from('api_key_requests')
      .select('user_id, email, full_name')
      .eq('id', request_id)
      .single();

    if (fetchErr || !kycRow) {
      return NextResponse.json({ success: false, message: 'Request not found.' }, { status: 404 });
    }

    // Update status
    const { error } = await supabase
      .from('api_key_requests')
      .update({ status: newStatus, admin_note: admin_note || null, reviewed_at: new Date().toISOString() })
      .eq('id', request_id);

    if (error) return NextResponse.json({ success: false, message: error.message }, { status: 500 });

    // Update user's api_access_status
    if (kycRow.user_id) {
      await supabase.from('users').update({ api_access_status: newStatus }).eq('id', kycRow.user_id);
    }

    // Mark admin notification as read
    await supabase
      .from('admin_notifications')
      .update({ is_read: true })
      .eq('reference_id', request_id);

    return NextResponse.json({ success: true, status: newStatus, message: `Application ${newStatus} successfully.` });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
