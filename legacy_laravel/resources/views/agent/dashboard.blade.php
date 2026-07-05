<x-layouts.app title="Agent Dashboard">
@php
    $user = auth()->user();
    $wallet = $user->wallet;
    $txs = $user->transactionRecords()->where('status','success')->get();
    $totalSales = $txs->sum('amount');
    $totalOrders = $txs->count();
    // Commission is the spread between retail and agent price — use 3% as a proxy
    $estimatedCommissions = $txs->sum(fn($t) => $t->amount * 0.03);
@endphp

<div>
    <div style="margin-bottom:2rem;display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <div>
            <h1 style="font-size:1.4rem;font-weight:700;margin-bottom:0.2rem;">🚀 Agent Dashboard</h1>
            <p style="color:var(--color-text-muted);font-size:0.875rem;">Your reseller performance at a glance.</p>
        </div>
        <span class="badge badge-success" style="font-size:0.78rem;padding:0.4rem 0.875rem;">● Agent Active</span>
    </div>

    {{-- Agent Wallet + Stats --}}
    <div class="wallet-card animate-fade-up" style="margin-bottom:1.5rem;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem;">
            <div>
                <div class="wallet-label">Agent Wallet Balance</div>
                <div class="wallet-balance">
                    <span class="wallet-currency">₵</span>{{ number_format($wallet?->cached_balance ?? 0, 2) }}
                </div>
            </div>
            <div style="text-align:right;">
                <div style="font-size:0.7rem;color:rgba(255,255,255,0.35);margin-bottom:0.3rem;">AGENT LEVEL</div>
                <span class="badge badge-warning">⭐ Reseller</span>
            </div>
        </div>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
            <a href="{{ route('wallet.fund') }}" class="btn btn-primary btn-sm" id="btn-agent-fund">+ Fund Wallet</a>
            <a href="{{ route('transactions.index') }}" class="btn btn-secondary btn-sm" id="btn-agent-history">View Sales</a>
        </div>
    </div>

    {{-- KPI Cards --}}
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1.5rem;" class="animate-fade-up-1">
        <div class="card" style="padding:1.25rem;text-align:center;">
            <div style="font-size:1.5rem;font-weight:800;font-family:'Space Grotesk',sans-serif;color:var(--color-brand-primary);">₵{{ number_format($totalSales, 0) }}</div>
            <div style="font-size:0.72rem;color:var(--color-text-muted);margin-top:0.3rem;">Total Sales</div>
        </div>
        <div class="card" style="padding:1.25rem;text-align:center;">
            <div style="font-size:1.5rem;font-weight:800;font-family:'Space Grotesk',sans-serif;color:var(--color-info);">{{ $totalOrders }}</div>
            <div style="font-size:0.72rem;color:var(--color-text-muted);margin-top:0.3rem;">Orders</div>
        </div>
        <div class="card" style="padding:1.25rem;text-align:center;">
            <div style="font-size:1.5rem;font-weight:800;font-family:'Space Grotesk',sans-serif;color:var(--color-warning);">₵{{ number_format($estimatedCommissions, 2) }}</div>
            <div style="font-size:0.72rem;color:var(--color-text-muted);margin-top:0.3rem;">Commissions</div>
        </div>
    </div>

    {{-- Quick Buy Grid --}}
    <div style="margin-bottom:1.75rem;" class="animate-fade-up-2">
        <h3 style="font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--color-text-muted);margin-bottom:0.875rem;">Quick Sell</h3>
        <div class="quick-actions">
            <a href="{{ route('vtu.data') }}" class="quick-action" id="agent-sell-data">
                <div class="quick-action-icon" style="background:rgba(0,208,132,0.12);color:var(--color-brand-primary);">🌐</div>
                <span class="quick-action-label">Sell Data</span>
            </a>
            <a href="{{ route('vtu.airtime') }}" class="quick-action" id="agent-sell-airtime">
                <div class="quick-action-icon" style="background:rgba(0,102,255,0.12);color:var(--color-brand-secondary);">📱</div>
                <span class="quick-action-label">Sell Airtime</span>
            </a>
            <a href="{{ route('vtu.bills') }}" class="quick-action" id="agent-sell-bills">
                <div class="quick-action-icon" style="background:rgba(255,176,32,0.12);color:var(--color-warning);">⚡</div>
                <span class="quick-action-label">Pay Bills</span>
            </a>
            <a href="{{ route('beneficiaries.index') }}" class="quick-action" id="agent-beneficiaries">
                <div class="quick-action-icon" style="background:rgba(139,92,246,0.12);color:#8B5CF6;">👥</div>
                <span class="quick-action-label">Contacts</span>
            </a>
        </div>
    </div>

    {{-- Recent Agent Sales --}}
    <div class="card animate-fade-up-3">
        <div class="card-body">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;">
                <h3 style="font-size:0.95rem;font-weight:600;">Recent Sales</h3>
                <a href="{{ route('transactions.index') }}" style="font-size:0.8rem;color:var(--color-brand-primary);text-decoration:none;">View all →</a>
            </div>
            @forelse($user->transactionRecords()->with('service')->where('status','success')->latest()->take(8)->get() as $tx)
                <div class="tx-item">
                    <div class="tx-icon debit">
                        @php echo ['data'=>'🌐','airtime'=>'📱','bill'=>'⚡','pin'=>'🎓'][$tx->service?->type]??'💳'; @endphp
                    </div>
                    <div class="tx-info">
                        <div class="tx-title">{{ $tx->service?->name ?? 'Service' }}</div>
                        <div class="tx-date">{{ $tx->recipient }} · {{ $tx->created_at->diffForHumans() }}</div>
                    </div>
                    <div style="text-align:right;">
                        <div class="tx-amount debit">₵{{ number_format($tx->amount, 2) }}</div>
                        <div style="font-size:0.68rem;color:var(--color-success);margin-top:3px;">+₵{{ number_format($tx->amount * 0.03, 2) }} earned</div>
                    </div>
                </div>
            @empty
                <div style="text-align:center;padding:2rem;color:var(--color-text-muted);">
                    <div style="font-size:2.5rem;margin-bottom:0.75rem;opacity:0.35;">📊</div>
                    No sales yet. Start selling to see your earnings here!
                </div>
            @endforelse
        </div>
    </div>
</div>

</x-layouts.app>
