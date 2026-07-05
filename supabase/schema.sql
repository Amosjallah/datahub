-- ============================================================
-- QUICKNETDATA GH — Supabase PostgreSQL Schema
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── 1. Users ────────────────────────────────────────────────
create table public.users (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    email text unique not null,
    phone text,
    role text not null default 'customer' check (role in ('customer', 'agent', 'admin', 'super_admin')),
    kyc_status text not null default 'pending' check (kyc_status in ('pending', 'approved', 'rejected')),
    referral_code text unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for users
alter table public.users enable row level security;

-- ── 2. Wallets ──────────────────────────────────────────────
create table public.wallets (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade unique not null,
    currency text not null default 'GHS',
    cached_balance numeric(12, 4) not null default 0.0000 check (cached_balance >= 0),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for wallets
alter table public.wallets enable row level security;

-- ── 3. Wallet Transactions (Ledger) ──────────────────────────
create table public.wallet_transactions (
    id uuid default gen_random_uuid() primary key,
    wallet_id uuid references public.wallets(id) on delete cascade not null,
    amount numeric(12, 4) not null,
    type text not null check (type in ('credit', 'debit', 'refund', 'commission', 'transfer')),
    reference text unique not null,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for wallet transactions
alter table public.wallet_transactions enable row level security;

-- ── 4. Services ─────────────────────────────────────────────
create table public.services (
    id uuid default gen_random_uuid() primary key,
    type text not null check (type in ('data', 'airtime', 'bill', 'pin')),
    name text not null,
    network text not null check (network in ('MTN', 'Telecel', 'AirtelTigo', 'ECG', 'GWCL', 'DSTV', 'GOTV', 'STARTIMES')),
    retail_price numeric(12, 2) not null,
    agent_price numeric(12, 2) not null,
    api_price numeric(12, 2),
    is_active boolean not null default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for services
alter table public.services enable row level security;

-- ── 5. Transaction Records ──────────────────────────────────
create table public.transaction_records (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete set null not null,
    service_id uuid references public.services(id) on delete set null,
    amount numeric(12, 2) not null,
    recipient text not null,
    status text not null default 'pending' check (status in ('pending', 'processing', 'success', 'failed', 'reversed')),
    provider_reference text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for transaction records
alter table public.transaction_records enable row level security;

-- ── 6. Beneficiaries ────────────────────────────────────────
create table public.beneficiaries (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    name text not null,
    phone text not null,
    network text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for beneficiaries
alter table public.beneficiaries enable row level security;

-- ── 7. Support Tickets ──────────────────────────────────────
create table public.support_tickets (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    subject text not null,
    category text not null,
    priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
    message text not null,
    status text not null default 'open' check (status in ('open', 'resolved', 'closed')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for support tickets
alter table public.support_tickets enable row level security;


-- ============================================================
-- RLS POLICIES (Row Level Security)
-- ============================================================

-- Users policies
create policy "Users can view their own profile" on public.users
    for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.users
    for update using (auth.uid() = id);

-- Wallets policies
create policy "Users can view their own wallet" on public.wallets
    for select using (auth.uid() = user_id);

-- Wallet transactions policies
create policy "Users can view their own wallet transactions" on public.wallet_transactions
    for select using (
        exists (
            select 1 from public.wallets 
            where public.wallets.id = wallet_transactions.wallet_id 
            and public.wallets.user_id = auth.uid()
        )
    );

-- Services policies (Public read-only)
create policy "Anyone can view active services" on public.services
    for select using (is_active = true);

-- Transaction records policies
create policy "Users can view their own transactions" on public.transaction_records
    for select using (auth.uid() = user_id);

create policy "Users can create their own transactions" on public.transaction_records
    for insert with check (auth.uid() = user_id);

-- Beneficiaries policies
create policy "Users can manage their own beneficiaries" on public.beneficiaries
    for all using (auth.uid() = user_id);

-- Support tickets policies
create policy "Users can manage their own tickets" on public.support_tickets
    for all using (auth.uid() = user_id);
