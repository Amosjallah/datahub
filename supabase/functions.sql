-- ============================================================
-- QUICKNETDATA GH — Safe Ledger Functions (RPCs)
-- ============================================================

-- ── 1. Safe Wallet Debit ────────────────────────────────────
create or replace function public.debit_wallet(
    p_wallet_id uuid,
    p_amount numeric,
    p_type text,
    p_reference text,
    p_description text
)
returns uuid
language plpgsql
security definer
as $$
declare
    v_locked_balance numeric;
    v_transaction_id uuid;
    v_existing_id uuid;
begin
    -- 1. Idempotency Check (Check if reference already exists)
    select id into v_existing_id from public.wallet_transactions 
    where reference = p_reference;
    
    if v_existing_id is not null then
        return v_existing_id;
    end if;

    -- 2. Lock the wallet row for update to prevent concurrent race conditions
    select cached_balance into v_locked_balance 
    from public.wallets 
    where id = p_wallet_id 
    for update;

    if v_locked_balance is null then
        raise exception 'Wallet not found.';
    end if;

    -- 3. Overdraft Protection
    if v_locked_balance < p_amount then
        raise exception 'Insufficient wallet balance.';
    end if;

    -- 4. Create Ledger Transaction (negative amount for debit)
    insert into public.wallet_transactions (wallet_id, amount, type, reference, description)
    values (p_wallet_id, -p_amount, p_type, p_reference, p_description)
    returning id into v_transaction_id;

    -- 5. Update cached balance
    update public.wallets 
    set cached_balance = cached_balance - p_amount,
        updated_at = now()
    where id = p_wallet_id;

    return v_transaction_id;
end;
$$;

-- ── 2. Safe Wallet Credit ───────────────────────────────────
create or replace function public.credit_wallet(
    p_wallet_id uuid,
    p_amount numeric,
    p_type text,
    p_reference text,
    p_description text
)
returns uuid
language plpgsql
security definer
as $$
declare
    v_transaction_id uuid;
    v_existing_id uuid;
begin
    -- 1. Idempotency Check
    select id into v_existing_id from public.wallet_transactions 
    where reference = p_reference;
    
    if v_existing_id is not null then
        return v_existing_id;
    end if;

    -- 2. Lock wallet row
    perform cached_balance 
    from public.wallets 
    where id = p_wallet_id 
    for update;

    -- 3. Create Ledger Entry
    insert into public.wallet_transactions (wallet_id, amount, type, reference, description)
    values (p_wallet_id, p_amount, p_type, p_reference, p_description)
    returning id into v_transaction_id;

    -- 4. Update cached balance
    update public.wallets 
    set cached_balance = cached_balance + p_amount,
        updated_at = now()
    where id = p_wallet_id;

    return v_transaction_id;
end;
$$;
