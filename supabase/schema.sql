-- ============================================================
-- FA DIGITAL SERVICES LTD. — MASTER COMBINED SUPABASE DATABASE MIGRATION
-- ============================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Users / Profiles Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'agent', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Wallets Table (Supports String/UUID wallet IDs e.g. WAL_USER_DEMO_01)
CREATE TABLE IF NOT EXISTS public.wallets (
  id TEXT PRIMARY KEY DEFAULT ('WAL_' || upper(substring(md5(random()::text) from 1 for 10))),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  currency TEXT DEFAULT 'GHS',
  cached_balance NUMERIC(14, 4) DEFAULT 0.0000 CHECK (cached_balance >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Wallet Transactions Ledger Table
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id TEXT NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
  amount NUMERIC(14, 4) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit', 'refund', 'commission', 'transfer')),
  reference TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create VTU / Service Transaction Records Table
CREATE TABLE IF NOT EXISTS public.transaction_records (
  id TEXT PRIMARY KEY DEFAULT ('VTU_' || upper(substring(md5(random()::text) from 1 for 10))),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  service_id TEXT NOT NULL,
  amount NUMERIC(14, 2) NOT NULL,
  recipient TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'success', 'failed', 'reversed')),
  provider_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Stored Procedure: Credit Wallet (Idempotent & Safe Ledger RPC)
CREATE OR REPLACE FUNCTION public.credit_wallet(
  p_wallet_id TEXT,
  p_amount NUMERIC,
  p_type TEXT,
  p_reference TEXT,
  p_description TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_tx_id UUID;
  v_existing_id UUID;
BEGIN
  -- Idempotency Check (prevent duplicate credits for same reference)
  SELECT id INTO v_existing_id
  FROM public.wallet_transactions 
  WHERE reference = p_reference;
  
  IF v_existing_id IS NOT NULL THEN
    RETURN v_existing_id;
  END IF;

  -- Lock wallet row
  PERFORM cached_balance 
  FROM public.wallets 
  WHERE id = p_wallet_id 
  FOR UPDATE;

  -- Insert into ledger
  INSERT INTO public.wallet_transactions (wallet_id, amount, type, reference, description)
  VALUES (p_wallet_id, abs(p_amount), p_type, p_reference, p_description)
  RETURNING id INTO v_tx_id;

  -- Update cached balance
  UPDATE public.wallets
  SET cached_balance = cached_balance + abs(p_amount),
      updated_at = NOW()
  WHERE id = p_wallet_id;

  RETURN v_tx_id;
END;
$$;

-- 7. Stored Procedure: Debit Wallet (Idempotent with Row Locking & Overdraft Protection)
CREATE OR REPLACE FUNCTION public.debit_wallet(
  p_wallet_id TEXT,
  p_amount NUMERIC,
  p_type TEXT,
  p_reference TEXT,
  p_description TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_tx_id UUID;
  v_existing_id UUID;
  v_current_balance NUMERIC;
BEGIN
  -- Idempotency Check
  SELECT id INTO v_existing_id
  FROM public.wallet_transactions 
  WHERE reference = p_reference;
  
  IF v_existing_id IS NOT NULL THEN
    RETURN v_existing_id;
  END IF;

  -- Lock row for concurrency safety
  SELECT cached_balance INTO v_current_balance
  FROM public.wallets
  WHERE id = p_wallet_id
  FOR UPDATE;

  IF v_current_balance IS NULL THEN
    RAISE EXCEPTION 'Wallet ID % not found.', p_wallet_id;
  END IF;

  IF v_current_balance < abs(p_amount) THEN
    RAISE EXCEPTION 'Insufficient wallet balance. Current balance is GHS %, requested GHS %.', v_current_balance, abs(p_amount);
  END IF;

  -- Insert negative/debit entry into ledger
  INSERT INTO public.wallet_transactions (wallet_id, amount, type, reference, description)
  VALUES (p_wallet_id, -abs(p_amount), p_type, p_reference, p_description)
  RETURNING id INTO v_tx_id;

  -- Deduct from cached balance
  UPDATE public.wallets
  SET cached_balance = cached_balance - abs(p_amount),
      updated_at = NOW()
  WHERE id = p_wallet_id;

  RETURN v_tx_id;
END;
$$;

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_records ENABLE ROW LEVEL SECURITY;

-- 9. Add RLS Policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select users') THEN
    CREATE POLICY "Allow public select users" ON public.users FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert users') THEN
    CREATE POLICY "Allow public insert users" ON public.users FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public update users') THEN
    CREATE POLICY "Allow public update users" ON public.users FOR UPDATE USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select wallets') THEN
    CREATE POLICY "Allow public select wallets" ON public.wallets FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert wallets') THEN
    CREATE POLICY "Allow public insert wallets" ON public.wallets FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public update wallets') THEN
    CREATE POLICY "Allow public update wallets" ON public.wallets FOR UPDATE USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select wallet_transactions') THEN
    CREATE POLICY "Allow public select wallet_transactions" ON public.wallet_transactions FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert wallet_transactions') THEN
    CREATE POLICY "Allow public insert wallet_transactions" ON public.wallet_transactions FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select transaction_records') THEN
    CREATE POLICY "Allow public select transaction_records" ON public.transaction_records FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert transaction_records') THEN
    CREATE POLICY "Allow public insert transaction_records" ON public.transaction_records FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public update transaction_records') THEN
    CREATE POLICY "Allow public update transaction_records" ON public.transaction_records FOR UPDATE USING (true);
  END IF;
END $$;
