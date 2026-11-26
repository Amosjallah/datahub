-- ============================================================
-- FA DIGITAL SERVICES LTD. — SCHEMA V2 ADDITIONS
-- Run these migrations on top of schema.sql
-- ============================================================

-- 1. Add business_name and display_name to users table
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS business_name TEXT,
  ADD COLUMN IF NOT EXISTS referral_code TEXT,
  ADD COLUMN IF NOT EXISTS referred_by TEXT,
  ADD COLUMN IF NOT EXISTS api_key TEXT,
  ADD COLUMN IF NOT EXISTS api_access_status TEXT DEFAULT NULL
    CHECK (api_access_status IS NULL OR api_access_status IN ('pending', 'approved', 'rejected'));

-- 2. API Key KYC Requests Table
CREATE TABLE IF NOT EXISTS public.api_key_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  business_name TEXT NOT NULL,
  website_url TEXT,
  ghana_card_url TEXT,
  document_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_note TEXT,
  reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. API Keys Table (generated after KYC approval)
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  key TEXT UNIQUE NOT NULL,
  label TEXT DEFAULT 'Default Key',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'suspended')),
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Agent Custom Pricing Table
CREATE TABLE IF NOT EXISTS public.agent_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  service_id TEXT NOT NULL,       -- e.g. 'MTN_5GB'
  network TEXT NOT NULL,          -- 'MTN', 'Telecel', 'AirtelTigo'
  volume TEXT NOT NULL,           -- '5GB'
  custom_price NUMERIC(10, 2) NOT NULL,  -- Agent's chosen sell price
  base_price NUMERIC(10, 2) NOT NULL,    -- Our agent cost (floor price)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (agent_id, service_id)
);

-- 5. Admin Notifications Table (for API approval alerts)
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,  -- 'api_kyc_request', 'agent_signup', etc.
  title TEXT NOT NULL,
  message TEXT,
  reference_id UUID,   -- points to api_key_requests.id or users.id
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. RLS for new tables (permissive for server-side admin client usage)
ALTER TABLE public.api_key_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select api_key_requests') THEN
    CREATE POLICY "Allow public select api_key_requests" ON public.api_key_requests FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert api_key_requests') THEN
    CREATE POLICY "Allow public insert api_key_requests" ON public.api_key_requests FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public update api_key_requests') THEN
    CREATE POLICY "Allow public update api_key_requests" ON public.api_key_requests FOR UPDATE USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select api_keys') THEN
    CREATE POLICY "Allow public select api_keys" ON public.api_keys FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert api_keys') THEN
    CREATE POLICY "Allow public insert api_keys" ON public.api_keys FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public update api_keys') THEN
    CREATE POLICY "Allow public update api_keys" ON public.api_keys FOR UPDATE USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select agent_pricing') THEN
    CREATE POLICY "Allow public select agent_pricing" ON public.agent_pricing FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert agent_pricing') THEN
    CREATE POLICY "Allow public insert agent_pricing" ON public.agent_pricing FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public update agent_pricing') THEN
    CREATE POLICY "Allow public update agent_pricing" ON public.agent_pricing FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public delete agent_pricing') THEN
    CREATE POLICY "Allow public delete agent_pricing" ON public.agent_pricing FOR DELETE USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select admin_notifications') THEN
    CREATE POLICY "Allow public select admin_notifications" ON public.admin_notifications FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert admin_notifications') THEN
    CREATE POLICY "Allow public insert admin_notifications" ON public.admin_notifications FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public update admin_notifications') THEN
    CREATE POLICY "Allow public update admin_notifications" ON public.admin_notifications FOR UPDATE USING (true);
  END IF;
END $$;
