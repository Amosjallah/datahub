<x-layouts.app title="TV Subscriptions">

<div>
    <div style="margin-bottom:1.75rem;">
        <h1 style="font-size:1.4rem;font-weight:700;margin-bottom:0.2rem;">📺 TV Subscriptions</h1>
        <p style="color:var(--color-text-muted);font-size:0.875rem;">Renew DStv, GOtv, and StarTimes instantly.</p>
    </div>

    {{-- Provider Cards --}}
    <div id="tv-providers" style="margin-bottom:1.5rem;">
        <p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:var(--color-text-muted);margin-bottom:0.875rem;">Select Provider</p>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.875rem;">

            @php
                $tvProviders = [
                    ['id'=>'dstv',      'name'=>'DStv',      'icon'=>'📺', 'color'=>'rgba(0,102,255,0.12)',   'plans'=>['Compact Plus - ₵120','Compact - ₵79','Access - ₵38']],
                    ['id'=>'gotv',      'name'=>'GOtv',      'icon'=>'📡', 'color'=>'rgba(0,208,132,0.12)',   'plans'=>['Supa Plus - ₵55','Supa - ₵38','Max - ₵29','Jolli - ₵22','Jinja - ₵10']],
                    ['id'=>'startimes', 'name'=>'StarTimes', 'icon'=>'🎬', 'color'=>'rgba(255,176,32,0.12)', 'plans'=>['Nova - ₵12','Basic - ₵25','Smart - ₵35','Classic - ₵50']],
                ];
            @endphp

            @foreach($tvProviders as $tv)
                <button type="button" onclick="selectTV('{{ $tv['id'] }}', {{ json_encode($tv) }})"
                    id="tv-btn-{{ $tv['id'] }}"
                    style="padding:1.5rem 1rem;text-align:center;border:2px solid var(--color-border);background:var(--color-bg-elevated);border-radius:var(--radius-lg);cursor:pointer;transition:all 0.2s;display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
                    <div style="width:56px;height:56px;border-radius:50%;background:{{ $tv['color'] }};display:flex;align-items:center;justify-content:center;font-size:1.75rem;">
                        {{ $tv['icon'] }}
                    </div>
                    <div style="font-weight:700;font-size:0.9rem;color:var(--color-text-primary);">{{ $tv['name'] }}</div>
                </button>
            @endforeach
        </div>
    </div>

    {{-- Form --}}
    <div class="card animate-fade-up" id="tv-form" style="display:none;max-width:480px;">
        <div class="card-body">
            <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem;">
                <div id="tv-form-icon" style="font-size:1.5rem;"></div>
                <h3 style="font-size:0.95rem;font-weight:700;" id="tv-form-title">Subscription</h3>
            </div>

            <div class="form-group">
                <label class="form-label" for="tv-iuc">Smart Card / IUC Number</label>
                <input type="text" id="tv-iuc" class="form-input" placeholder="Enter smart card number">
            </div>

            <div class="form-group">
                <label class="form-label" for="tv-plan">Select Package</label>
                <select id="tv-plan" class="form-select"></select>
            </div>

            <div style="display:flex;align-items:center;justify-content:space-between;font-size:0.85rem;margin-bottom:1.25rem;padding:0.75rem;background:var(--color-bg-elevated);border-radius:var(--radius-md);">
                <span style="color:var(--color-text-muted);">Wallet Balance</span>
                <strong style="color:var(--color-brand-primary);">₵{{ number_format(auth()->user()->wallet?->cached_balance ?? 0, 2) }}</strong>
            </div>

            <div style="display:flex;gap:0.75rem;">
                <button type="button" class="btn btn-primary" id="btn-subscribe-tv" onclick="submitTV()">📺 Subscribe Now</button>
                <button type="button" class="btn btn-secondary" onclick="resetTV()" id="btn-cancel-tv">Change Provider</button>
            </div>
        </div>
    </div>
</div>

<script>
let selectedTV = null;
function selectTV(id, data) {
    selectedTV = data;
    document.querySelectorAll('[id^="tv-btn-"]').forEach(b => {
        b.style.borderColor = 'var(--color-border)';
        b.style.background  = 'var(--color-bg-elevated)';
    });
    const btn = document.getElementById('tv-btn-' + id);
    btn.style.borderColor = 'var(--color-brand-primary)';
    btn.style.background  = 'rgba(0,208,132,0.05)';

    document.getElementById('tv-form-title').textContent = data.name + ' Subscription';
    document.getElementById('tv-form-icon').textContent  = data.icon;

    const sel = document.getElementById('tv-plan');
    sel.innerHTML = data.plans.map(p => `<option>${p}</option>`).join('');

    document.getElementById('tv-form').style.display = 'block';
    document.getElementById('tv-form').scrollIntoView({behavior:'smooth', block:'start'});
}
function resetTV() {
    selectedTV = null;
    document.getElementById('tv-form').style.display = 'none';
    document.querySelectorAll('[id^="tv-btn-"]').forEach(b => {
        b.style.borderColor = 'var(--color-border)';
        b.style.background  = 'var(--color-bg-elevated)';
    });
}
function submitTV() {
    const iuc  = document.getElementById('tv-iuc').value;
    const plan = document.getElementById('tv-plan').value;
    if (!iuc) { alert('Please enter your smart card / IUC number.'); return; }
    alert('TV subscription gateway coming soon!\nProvider: ' + selectedTV.name + '\nIUC: ' + iuc + '\nPlan: ' + plan);
}
</script>

</x-layouts.app>
