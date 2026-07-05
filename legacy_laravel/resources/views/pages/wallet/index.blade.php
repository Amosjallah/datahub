<x-layouts.app title="My Wallet">

<div>
    <div style="margin-bottom:2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <div>
            <h1 style="font-size:1.4rem;font-weight:700;margin-bottom:0.2rem;">💳 My Wallet</h1>
            <p style="color:var(--color-text-muted);font-size:0.875rem;">Manage your balance and transaction history.</p>
        </div>
        <a href="{{ route('wallet.fund') }}" class="btn btn-primary btn-sm" id="btn-add-funds">
            + Add Funds
        </a>
    </div>

    {{-- Wallet Balance Card --}}
    <div class="wallet-card animate-fade-up" style="margin-bottom:1.5rem;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
            <div>
                <div class="wallet-label">Available Balance</div>
                <div class="wallet-balance">
                    <span class="wallet-currency">₵</span>{{ number_format(auth()->user()->wallet?->cached_balance ?? 0, 2) }}
                </div>
            </div>
            <div style="text-align:right;">
                <div style="font-size:0.7rem;color:rgba(255,255,255,0.35);margin-bottom:0.4rem;">ACCOUNT NUMBER</div>
                <div style="font-size:0.875rem;font-family:monospace;color:rgba(255,255,255,0.6);letter-spacing:0.12em;">
                    {{ str_pad(auth()->user()->id, 8, '0', STR_PAD_LEFT) }}
                </div>
            </div>
        </div>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
            <a href="{{ route('wallet.fund') }}" class="btn btn-primary btn-sm" id="btn-wallet-fund">Fund Wallet</a>
            <a href="{{ route('transactions.index') }}" class="btn btn-secondary btn-sm" id="btn-wallet-history">Full History</a>
        </div>
    </div>

    {{-- Stats --}}
    @php
        $txs    = auth()->user()->walletTransactions()->latest()->get();
        $credits = $txs->where('amount', '>', 0)->sum('amount');
        $debits  = $txs->where('amount', '<', 0)->sum('amount');
    @endphp
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;">
        <div class="card" style="padding:1.25rem;">
            <div style="font-size:0.75rem;color:var(--color-text-muted);margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:0.08em;">Total In</div>
            <div style="font-size:1.3rem;font-weight:800;color:var(--color-success);font-family:'Space Grotesk',sans-serif;">
                +₵{{ number_format($credits, 2) }}
            </div>
        </div>
        <div class="card" style="padding:1.25rem;">
            <div style="font-size:0.75rem;color:var(--color-text-muted);margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:0.08em;">Total Out</div>
            <div style="font-size:1.3rem;font-weight:800;color:var(--color-danger);font-family:'Space Grotesk',sans-serif;">
                ₵{{ number_format(abs($debits), 2) }}
            </div>
        </div>
    </div>

    {{-- Recent Wallet Transactions --}}
    <div class="card animate-fade-up-1">
        <div class="card-body">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;">
                <h3 style="font-size:0.95rem;font-weight:600;">Wallet Activity</h3>
                <span style="font-size:0.78rem;color:var(--color-text-muted);">{{ $txs->count() }} entries</span>
            </div>

            @forelse($txs->take(15) as $tx)
                <div class="tx-item">
                    <div class="tx-icon {{ $tx->amount > 0 ? 'credit' : 'debit' }}">
                        @if($tx->amount > 0)
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
                        @else
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                        @endif
                    </div>
                    <div class="tx-info">
                        <div class="tx-title">{{ $tx->description ?? ucwords(str_replace('_',' ',$tx->type)) }}</div>
                        <div class="tx-date">{{ $tx->created_at->format('d M Y · g:ia') }}</div>
                    </div>
                    <div class="tx-amount {{ $tx->amount > 0 ? 'credit' : 'debit' }}">
                        {{ $tx->amount > 0 ? '+' : '' }}₵{{ number_format(abs($tx->amount), 2) }}
                    </div>
                </div>
            @empty
                <div style="text-align:center;padding:2.5rem;color:var(--color-text-muted);">
                    <div style="font-size:2.5rem;margin-bottom:0.75rem;opacity:0.4;">📭</div>
                    No wallet activity yet.
                </div>
            @endforelse
        </div>
    </div>
</div>

</x-layouts.app>
