import { createClient } from '@supabase/supabase-js';

// These vars are available on both client and server (NEXT_PUBLIC_ prefix)
const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://placeholder-url.supabase.co';

const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'placeholder-anon-key';

// Service role key — only available server-side (no NEXT_PUBLIC_ prefix)
// Falls back to NEXT_PUBLIC_ version if running in browser context
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY ||
  supabaseAnonKey;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('placeholder-url') &&
    !supabaseAnonKey.includes('placeholder-anon-key') &&
    supabaseUrl.includes('supabase.co')
  );
};

/** Browser / universal client — only created when environment is actually configured */
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Server-side admin client — uses service role key.
 * Only call this inside API routes (never in client components).
 */
export const createAdminClient = () =>
  isSupabaseConfigured()
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false },
      })
    : null;

