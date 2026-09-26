import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Client & Server URL and Anon Key
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://placeholder-url.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'placeholder-anon-key';

// Server-only service role key — NEVER use NEXT_PUBLIC_ for this
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
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

/**
 * Browser / universal Supabase client.
 * Always returns a SupabaseClient instance so callers do not fail null-checks.
 */
export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey
);

/**
 * Server-side admin client — uses service role key.
 * Only call this inside API routes (never in client components).
 */
export const createAdminClient = (): SupabaseClient => {
  return createClient(
    supabaseUrl,
    supabaseServiceKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
};
