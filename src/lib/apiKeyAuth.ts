import { createAdminClient, isSupabaseConfigured } from './supabase';

export interface ApiAuthResult {
  authenticated: boolean;
  userId?: string;
  walletId?: string;
  role?: string;
  name?: string;
  balance?: number;
  error?: string;
}

/**
 * Validate an API key passed via Authorization: Bearer <key> or x-api-key: <key>
 */
export async function authenticateApiKey(request: Request): Promise<ApiAuthResult> {
  const authHeader = request.headers.get('authorization') || '';
  const apiKeyHeader = request.headers.get('x-api-key') || '';
  
  let token = '';
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (apiKeyHeader) {
    token = apiKeyHeader.trim();
  }

  if (!token) {
    return {
      authenticated: false,
      error: 'Missing API Key. Provide key via Authorization: Bearer <API_KEY> or x-api-key header.',
    };
  }

  // Check master dev / demo key
  const masterKey = process.env.API_SECRET_KEY || 'fa_sec_live_5x8a92f0381b4c91';
  if (token === masterKey || token.startsWith('demo_api_key')) {
    return {
      authenticated: true,
      userId: 'master-api-user',
      walletId: 'master-wallet-001',
      role: 'api_partner',
      name: 'QuickNet Developer Partner',
      balance: 5000.00,
    };
  }

  if (!isSupabaseConfigured()) {
    // Demo fallback for sandbox testing
    return {
      authenticated: true,
      userId: 'demo-api-user',
      walletId: 'demo-wallet-001',
      role: 'api_partner',
      name: 'Sandbox Partner',
      balance: 1000.00,
    };
  }

  try {
    const supabase = createAdminClient();

    // Check api_keys table first
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('user_id, status')
      .eq('key', token)
      .maybeSingle();

    if (keyData && keyData.status === 'active') {
      const { data: wallet } = await supabase
        .from('wallets')
        .select('id, cached_balance')
        .eq('user_id', keyData.user_id)
        .maybeSingle();

      return {
        authenticated: true,
        userId: keyData.user_id,
        walletId: wallet?.id,
        role: 'api_partner',
        balance: wallet?.cached_balance || 0,
      };
    }

    // Check users table (e.g. if user stored their api_key directly in profile)
    const { data: userData } = await supabase
      .from('users')
      .select('id, full_name, role, api_key')
      .eq('api_key', token)
      .maybeSingle();

    if (userData) {
      const { data: wallet } = await supabase
        .from('wallets')
        .select('id, cached_balance')
        .eq('user_id', userData.id)
        .maybeSingle();

      return {
        authenticated: true,
        userId: userData.id,
        walletId: wallet?.id,
        role: userData.role || 'api_partner',
        name: userData.full_name,
        balance: wallet?.cached_balance || 0,
      };
    }

    return {
      authenticated: false,
      error: 'Invalid or inactive API Key. Please verify your credentials in the Agent/Developer portal.',
    };
  } catch (err: any) {
    console.error('[API Auth Error]:', err);
    return {
      authenticated: false,
      error: 'Authentication verification error: ' + err.message,
    };
  }
}
