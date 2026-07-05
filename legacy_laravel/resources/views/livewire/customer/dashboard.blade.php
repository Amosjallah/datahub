<div>
    {{-- ============================================================
         Top greeting bar
    ============================================================ --}}
    <div style="margin-bottom:2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <div>
            <h1 style="font-size:1.5rem;font-weight:700;margin-bottom:0.2rem;">
                Hey, {{ explode(' ', auth()->user()->name)[0] }} 👋
            </h1>
            <p style="color:var(--color-text-muted);font-size:0.9rem;">
                {{ now()->format('l, d F Y') }}
            </p>
        </div>
        <a href="{{ route('wallet.fund') }}" class="btn btn-primary" id="btn-top-up-hero">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Money
        </a>
    </div>

    {{-- ============================================================
         Wallet Hero Card
    ============================================================ --}}
    <div class="wallet-card animate-fade-up" style="margin-bottom:1.5rem;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem;">
            <div>
                <div class="wallet-label">GHS Wallet Balance</div>
                <div class="wallet-balance">
                    <span class="wallet-currency">₵</span>{{ number_format($wallet?->cached_balance ?? 0, 2) }}
                </div>
                <div style="font-size:0.78rem;color:rgba(255,255,255,0.4);margin-top:0.4rem;">
                    Last updated: {{ $wallet?->updated_at?->diffForHumans() ?? 'Never' }}
                </div>
            </div>
            <span class="badge badge-success" style="font-size:0.72rem;">● Wallet Active</span>
        </div>

        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
            <a href="{{ route('wallet.fund') }}" class="btn btn-primary btn-sm" id="btn-fund-wallet-card">+ Fund Wallet</a>
            <a href="{{ route('wallet.index') }}" class="btn btn-secondary btn-sm" id="btn-wallet-history">View History</a>
        </div>
    </div>

    {{-- ============================================================
         Stats Row
    ============================================================ --}}
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1.75rem;" class="animate-fade-up-1">
        <div class="card" style="padding:1.25rem;text-align:center;">
            <div style="font-size:1.5rem;font-weight:800;font-family:'Space Grotesk',sans-serif;color:var(--color-brand-primary);">
                ₵{{ number_format($totalSpent, 2) }}
            </div>
            <div style="font-size:0.75rem;color:var(--color-text-muted);margin-top:0.25rem;">Total Spent</div>
        </div>
        <div class="card" style="padding:1.25rem;text-align:center;">
            <div style="font-size:1.5rem;font-weight:800;font-family:'Space Grotesk',sans-serif;color:var(--color-info);">
                {{ $successCount }}
            </div>
            <div style="font-size:0.75rem;color:var(--color-text-muted);margin-top:0.25rem;">Successful Txns</div>
        </div>
        <div class="card" style="padding:1.25rem;text-align:center;">
            <div style="font-size:1.5rem;font-weight:800;font-family:'Space Grotesk',sans-serif;color:var(--color-warning);">
                {{ auth()->user()->kyc_status === 'approved' ? '✓' : '!' }}
            </div>
            <div style="font-size:0.75rem;color:var(--color-text-muted);margin-top:0.25rem;">KYC {{ ucfirst(auth()->user()->kyc_status) }}</div>
        </div>
    </div>

    {{-- ============================================================
         Quick Actions
    ============================================================ --}}
    <div style="margin-bottom:1.75rem;" class="animate-fade-up-2">
        <h3 style="font-size:0.875rem;font-weight:600;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:1rem;">Quick Actions</h3>
        <div class="quick-actions">
            <a href="{{ route('vtu.data') }}" class="quick-action" id="quick-buy-data">
                <div class="quick-action-icon" style="background:rgba(0,208,132,0.12);color:var(--color-brand-primary);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>
                </div>
                <span class="quick-action-label">Data Bundle</span>
            </a>
            <a href="{{ route('vtu.airtime') }}" class="quick-action" id="quick-buy-airtime">
                <div class="quick-action-icon" style="background:rgba(0,102,255,0.12);color:var(--color-brand-secondary);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6.33-6.33 19.79 19.79 0 01-3.07-8.7A2 2 0 013.24 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-.85a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                </div>
                <span class="quick-action-label">Buy Airtime</span>
            </a>
            <a href="{{ route('vtu.bills') }}" class="quick-action" id="quick-pay-bills">
                <div class="quick-action-icon" style="background:rgba(255,176,32,0.12);color:var(--color-warning);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                </div>
                <span class="quick-action-label">Pay Bills</span>
            </a>
            <a href="{{ route('vtu.tv') }}" class="quick-action" id="quick-tv">
                <div class="quick-action-icon" style="background:rgba(255,69,96,0.12);color:var(--color-danger);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg>
                </div>
                <span class="quick-action-label">TV Sub</span>
            </a>
        </div>
    </div>

    {{-- ============================================================
         Recent Transactions
    ============================================================ --}}
    <div class="card animate-fade-up-3">
        <div class="card-body">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;">
                <h3 style="font-size:0.95rem;font-weight:600;">Recent Transactions</h3>
                <a href="{{ route('transactions.index') }}" style="font-size:0.8rem;color:var(--color-brand-primary);text-decoration:none;font-weight:500;">View all →</a>
            </div>

            @forelse($recentTransactions as $tx)
                <div class="tx-item">
                    <div class="tx-icon debit">
                        @php
                            $icons = ['data'=>'🌐','airtime'=>'📱','bill'=>'⚡','pin'=>'🎓','esim'=>'📡'];
                            echo $icons[$tx->service?->type] ?? '💳';
                        @endphp
                    </div>
                    <div class="tx-info">
                        <div class="tx-title">{{ $tx->service?->name ?? 'Transaction' }}</div>
                        <div class="tx-date">{{ $tx->created_at->diffForHumans() }} · {{ $tx->recipient }}</div>
                    </div>
                    <div style="text-align:right;">
                        <div class="tx-amount debit">₵{{ number_format($tx->amount, 2) }}</div>
                        <span class="badge badge-{{ match($tx->status) { 'success'=>'success','failed'=>'danger','processing'=>'warning',default=>'secondary' } }}" style="font-size:0.68rem;margin-top:3px;">
                            {{ ucfirst($tx->status) }}
                        </span>
                    </div>
                </div>
            @empty
                <div style="text-align:center;padding:2.5rem 1rem;">
                    <div style="font-size:3rem;margin-bottom:0.75rem;opacity:0.4;">📊</div>
                    <p style="color:var(--color-text-muted);font-size:0.9rem;margin-bottom:1rem;">No transactions yet.</p>
                    <a href="{{ route('vtu.data') }}" class="btn btn-primary btn-sm" id="btn-first-buy">Buy Your First Bundle</a>
                </div>
            @endforelse
        </div>
    </div>
</div>
