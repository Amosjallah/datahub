<x-layouts.app title="Support">

<div>
    <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.75rem;">
        <div>
            <h1 style="font-size:1.4rem;font-weight:700;margin-bottom:0.2rem;">💬 Support</h1>
            <p style="color:var(--color-text-muted);font-size:0.875rem;">We typically respond within 2 business hours.</p>
        </div>
        <a href="{{ route('support.create') }}" class="btn btn-primary btn-sm" id="btn-new-ticket">+ New Ticket</a>
    </div>

    {{-- Quick Help Cards --}}
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:0.75rem;margin-bottom:1.75rem;">
        @php
            $helps = [
                ['icon'=>'📱','title'=>'WhatsApp Support','sub'=>'Chat with us directly','url'=>'https://wa.me/233200000000','color'=>'rgba(37,211,102,0.1)'],
                ['icon'=>'✉️','title'=>'Email Us','sub'=>'support@quicknetdata.gh','url'=>'mailto:support@quicknetdata.gh','color'=>'rgba(0,102,255,0.1)'],
            ];
        @endphp
        @foreach($helps as $h)
            <a href="{{ $h['url'] }}" target="_blank" rel="noopener"
                style="padding:1.1rem;background:{{ $h['color'] }};border:1px solid var(--color-border);border-radius:var(--radius-lg);text-decoration:none;color:inherit;display:flex;align-items:center;gap:0.875rem;transition:all 0.2s;"
                class="card" id="help-{{ Str::slug($h['title']) }}">
                <div style="font-size:1.5rem;">{{ $h['icon'] }}</div>
                <div>
                    <div style="font-weight:600;font-size:0.875rem;">{{ $h['title'] }}</div>
                    <div style="font-size:0.72rem;color:var(--color-text-muted);margin-top:0.2rem;">{{ $h['sub'] }}</div>
                </div>
            </a>
        @endforeach
    </div>

    {{-- Tickets --}}
    <div style="margin-bottom:1rem;display:flex;align-items:center;justify-content:space-between;">
        <h3 style="font-size:0.875rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--color-text-muted);">My Tickets</h3>
        @php $tickets = auth()->user()->supportTickets()->latest()->get(); @endphp
        <span style="font-size:0.78rem;color:var(--color-text-muted);">{{ $tickets->count() }} total</span>
    </div>

    @forelse($tickets as $ticket)
        <div class="card" style="margin-bottom:0.625rem;">
            <div class="card-body" style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;">
                <div style="width:40px;height:40px;border-radius:50%;background:{{ $ticket->status === 'open' ? 'rgba(255,176,32,0.12)' : 'rgba(0,208,132,0.12)' }};display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;">
                    {{ $ticket->status === 'open' ? '🔓' : '✅' }}
                </div>
                <div style="flex:1;min-width:0;">
                    <div style="font-weight:600;font-size:0.875rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ $ticket->subject }}</div>
                    <div style="font-size:0.72rem;color:var(--color-text-muted);margin-top:0.2rem;">
                        Opened {{ $ticket->created_at->diffForHumans() }}
                        @if($ticket->category) · {{ ucfirst($ticket->category) }} @endif
                    </div>
                </div>
                <span class="badge badge-{{ $ticket->status === 'open' ? 'warning' : ($ticket->status === 'resolved' ? 'success' : 'secondary') }}">
                    {{ ucfirst($ticket->status) }}
                </span>
            </div>
        </div>
    @empty
        <div class="card">
            <div class="card-body" style="text-align:center;padding:3rem 1rem;">
                <div style="font-size:3rem;margin-bottom:1rem;opacity:0.4;">🎉</div>
                <p style="color:var(--color-text-muted);">No open tickets — everything is running smoothly!</p>
                <a href="{{ route('support.create') }}" class="btn btn-secondary btn-sm" style="margin-top:1rem;" id="btn-open-first-ticket">Open a Ticket</a>
            </div>
        </div>
    @endforelse
</div>

</x-layouts.app>
