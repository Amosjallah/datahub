<x-layouts.app title="Transactions">

<div>
    {{-- Header --}}
    <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.75rem;">
        <div>
            <h1 style="font-size:1.4rem;font-weight:700;margin-bottom:0.2rem;">📊 Transactions</h1>
            <p style="color:var(--color-text-muted);font-size:0.875rem;">All your purchase history in one place.</p>
        </div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            <select id="filter-status" class="form-select" style="width:auto;font-size:0.85rem;padding:0.5rem 2rem 0.5rem 0.75rem;" onchange="filterByStatus(this.value)">
                <option value="">All Status</option>
                <option value="success">✅ Success</option>
                <option value="failed">❌ Failed</option>
                <option value="processing">🔄 Processing</option>
                <option value="pending">⏳ Pending</option>
            </select>
            <select id="filter-type" class="form-select" style="width:auto;font-size:0.85rem;padding:0.5rem 2rem 0.5rem 0.75rem;" onchange="filterByType(this.value)">
                <option value="">All Types</option>
                <option value="data">🌐 Data</option>
                <option value="airtime">📱 Airtime</option>
                <option value="bill">⚡ Bills</option>
                <option value="pin">🎓 Edu PIN</option>
            </select>
        </div>
    </div>

    @php
        $txs = auth()->user()->transactionRecords()->with('service')->latest()->paginate(25);
    @endphp

    {{-- Summary Cards --}}
    @php
        $allTxs = auth()->user()->transactionRecords;
        $successTotal = $allTxs->where('status','success')->sum('amount');
        $successCount = $allTxs->where('status','success')->count();
        $failedCount  = $allTxs->where('status','failed')->count();
    @endphp
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1.5rem;">
        <div class="card" style="padding:1rem 1.25rem;text-align:center;">
            <div style="font-size:1.25rem;font-weight:800;font-family:'Space Grotesk',sans-serif;color:var(--color-brand-primary);">{{ $successCount }}</div>
            <div style="font-size:0.72rem;color:var(--color-text-muted);margin-top:0.2rem;">Successful</div>
        </div>
        <div class="card" style="padding:1rem 1.25rem;text-align:center;">
            <div style="font-size:1.25rem;font-weight:800;font-family:'Space Grotesk',sans-serif;color:var(--color-danger);">{{ $failedCount }}</div>
            <div style="font-size:0.72rem;color:var(--color-text-muted);margin-top:0.2rem;">Failed</div>
        </div>
        <div class="card" style="padding:1rem 1.25rem;text-align:center;">
            <div style="font-size:1.25rem;font-weight:800;font-family:'Space Grotesk',sans-serif;color:var(--color-info);">₵{{ number_format($successTotal, 0) }}</div>
            <div style="font-size:0.72rem;color:var(--color-text-muted);margin-top:0.2rem;">Total Spent</div>
        </div>
    </div>

    {{-- Transaction Table --}}
    <div class="card animate-fade-up" id="tx-list">
        @forelse($txs as $tx)
            <div class="tx-item" style="padding:0.9rem 1.25rem;border-bottom:1px solid var(--color-border);"
                 data-status="{{ $tx->status }}"
                 data-type="{{ $tx->service?->type }}">
                {{-- Icon --}}
                <div class="tx-icon debit" style="flex-shrink:0;">
                    @php $icons=['data'=>'🌐','airtime'=>'📱','bill'=>'⚡','pin'=>'🎓','esim'=>'📡']; echo $icons[$tx->service?->type]??'💳'; @endphp
                </div>

                {{-- Info --}}
                <div class="tx-info">
                    <div class="tx-title">{{ $tx->service?->name ?? 'Transaction #' . $tx->id }}</div>
                    <div class="tx-date" style="display:flex;flex-wrap:wrap;gap:0.4rem;align-items:center;">
                        <span>{{ $tx->created_at->format('d M Y, g:ia') }}</span>
                        <span style="opacity:0.4;">·</span>
                        <span>{{ $tx->recipient }}</span>
                        @if($tx->provider_reference)
                            <span style="opacity:0.4;">·</span>
                            <span style="font-size:0.68rem;font-family:monospace;background:var(--color-bg-elevated);padding:1px 6px;border-radius:4px;">
                                {{ $tx->provider_reference }}
                            </span>
                        @endif
                    </div>
                </div>

                {{-- Amount & Status --}}
                <div style="text-align:right;flex-shrink:0;">
                    <div class="tx-amount debit">₵{{ number_format($tx->amount, 2) }}</div>
                    <span class="badge badge-{{ match($tx->status) {'success'=>'success','failed'=>'danger','processing'=>'warning','reversed'=>'info',default=>'secondary'} }}" style="font-size:0.68rem;margin-top:4px;display:inline-flex;">
                        {{ ucfirst($tx->status) }}
                    </span>
                </div>
            </div>
        @empty
            <div style="text-align:center;padding:4rem 2rem;">
                <div style="font-size:3.5rem;margin-bottom:1rem;opacity:0.3;">📭</div>
                <p style="color:var(--color-text-muted);margin-bottom:1.25rem;">No transactions found.</p>
                <a href="{{ route('vtu.data') }}" class="btn btn-primary btn-sm" id="btn-tx-empty-buy">Buy Data Now</a>
            </div>
        @endforelse
    </div>

    {{-- Pagination --}}
    @if($txs->hasPages())
        <div style="margin-top:1.5rem;display:flex;justify-content:center;">
            {{ $txs->links() }}
        </div>
    @endif
</div>

<script>
function filterByStatus(status) {
    document.querySelectorAll('[data-status]').forEach(el => {
        el.style.display = (!status || el.dataset.status === status) ? 'flex' : 'none';
    });
}
function filterByType(type) {
    document.querySelectorAll('[data-type]').forEach(el => {
        el.style.display = (!type || el.dataset.type === type) ? 'flex' : 'none';
    });
}
</script>

</x-layouts.app>
