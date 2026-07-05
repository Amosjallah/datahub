<x-layouts.app title="Pay Bills">

<div>
    <div style="margin-bottom:1.75rem;">
        <h1 style="font-size:1.4rem;font-weight:700;margin-bottom:0.2rem;">⚡ Pay Bills</h1>
        <p style="color:var(--color-text-muted);font-size:0.875rem;">Electricity, water, and utility payments — instantly.</p>
    </div>

    {{-- Bill Provider Grid --}}
    <div style="margin-bottom:1.5rem;" id="provider-grid">
        <p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:var(--color-text-muted);margin-bottom:0.875rem;">Choose Provider</p>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:0.875rem;">

            @php
                $providers = [
                    ['id'=>'ecg',       'name'=>'ECG Electricity', 'sub'=>'Prepaid & Postpaid', 'icon'=>'⚡', 'color'=>'rgba(255,176,32,0.12)', 'accent'=>'var(--color-warning)'],
                    ['id'=>'gwcl',      'name'=>'Ghana Water (GWCL)', 'sub'=>'Water bills',     'icon'=>'💧', 'color'=>'rgba(14,165,233,0.12)', 'accent'=>'var(--color-info)'],
                    ['id'=>'waec',      'name'=>'WAEC Checker PIN', 'sub'=>'BECE / WASSCE',     'icon'=>'🎓', 'color'=>'rgba(139,92,246,0.12)', 'accent'=>'#8B5CF6'],
                    ['id'=>'postpaid',  'name'=>'Postpaid Bills',  'sub'=>'MTN, Telecel, AT',   'icon'=>'📄', 'color'=>'rgba(0,208,132,0.12)',  'accent'=>'var(--color-success)'],
                ];
            @endphp

            @foreach($providers as $p)
                <button type="button" onclick="selectProvider('{{ $p['id'] }}', '{{ $p['name'] }}')"
                    id="provider-{{ $p['id'] }}"
                    style="padding:1.25rem;text-align:left;border:2px solid var(--color-border);background:var(--color-bg-elevated);border-radius:var(--radius-lg);cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:0.875rem;">
                    <div style="width:48px;height:48px;border-radius:var(--radius-md);background:{{ $p['color'] }};display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0;">
                        {{ $p['icon'] }}
                    </div>
                    <div>
                        <div style="font-weight:600;font-size:0.875rem;color:var(--color-text-primary);">{{ $p['name'] }}</div>
                        <div style="font-size:0.72rem;color:var(--color-text-muted);margin-top:0.2rem;">{{ $p['sub'] }}</div>
                    </div>
                </button>
            @endforeach
        </div>
    </div>

    {{-- Payment Form (hidden until provider selected) --}}
    <div class="card animate-fade-up" id="bill-pay-form" style="display:none;max-width:480px;">
        <div class="card-body">
            <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem;">
                <div id="bill-form-icon" style="font-size:1.5rem;"></div>
                <h3 style="font-size:0.95rem;font-weight:700;" id="bill-form-title">Bill Payment</h3>
            </div>

            <div class="form-group">
                <label class="form-label" for="bill-account-no">Account / Meter Number</label>
                <input type="text" id="bill-account-no" class="form-input" placeholder="Enter account number">
            </div>

            <div class="form-group" id="waec-group" style="display:none;">
                <label class="form-label" for="waec-type">Exam Type</label>
                <select id="waec-type" class="form-select">
                    <option value="bece">BECE Checker</option>
                    <option value="wassce">WASSCE Checker</option>
                    <option value="novdec">Nov/Dec Checker</option>
                </select>
            </div>

            <div class="form-group" id="amount-group">
                <label class="form-label" for="bill-amount">Amount to Pay (₵)</label>
                <input type="number" id="bill-amount" class="form-input" placeholder="e.g. 50.00" min="1" step="0.01">
            </div>

            <div style="display:flex;align-items:center;justify-content:space-between;font-size:0.85rem;margin-bottom:1.25rem;padding:0.75rem;background:var(--color-bg-elevated);border-radius:var(--radius-md);">
                <span style="color:var(--color-text-muted);">Wallet Balance</span>
                <strong style="color:var(--color-brand-primary);">₵{{ number_format(auth()->user()->wallet?->cached_balance ?? 0, 2) }}</strong>
            </div>

            <div style="display:flex;gap:0.75rem;">
                <button type="button" class="btn btn-primary" id="btn-pay-bill-confirm" onclick="submitBill()">⚡ Pay Now</button>
                <button type="button" class="btn btn-secondary" onclick="resetForm()" id="btn-cancel-bill">Change Provider</button>
            </div>
        </div>
    </div>
</div>

<script>
let selectedProvider = null;
const providerMeta = {
    ecg:      { name:'ECG Electricity',    icon:'⚡', showAmount:true,  showWaec:false },
    gwcl:     { name:'Ghana Water (GWCL)', icon:'💧', showAmount:true,  showWaec:false },
    waec:     { name:'WAEC Checker PIN',   icon:'🎓', showAmount:false, showWaec:true  },
    postpaid: { name:'Postpaid Bills',     icon:'📄', showAmount:true,  showWaec:false },
};

function selectProvider(id, name) {
    selectedProvider = id;
    const meta = providerMeta[id];
    // Reset borders
    document.querySelectorAll('[id^="provider-"]').forEach(b => {
        b.style.borderColor = 'var(--color-border)';
        b.style.background  = 'var(--color-bg-elevated)';
    });
    const btn = document.getElementById('provider-' + id);
    btn.style.borderColor = 'var(--color-brand-primary)';
    btn.style.background  = 'rgba(0,208,132,0.05)';

    document.getElementById('bill-form-title').textContent = meta.name;
    document.getElementById('bill-form-icon').textContent  = meta.icon;
    document.getElementById('amount-group').style.display  = meta.showAmount ? 'block' : 'none';
    document.getElementById('waec-group').style.display    = meta.showWaec   ? 'block' : 'none';
    document.getElementById('bill-account-no').placeholder = id === 'waec' ? 'Index number' : 'Account / Meter number';

    document.getElementById('bill-pay-form').style.display = 'block';
    document.getElementById('bill-pay-form').scrollIntoView({behavior:'smooth', block:'start'});
}
function resetForm() {
    selectedProvider = null;
    document.getElementById('bill-pay-form').style.display = 'none';
    document.querySelectorAll('[id^="provider-"]').forEach(b => {
        b.style.borderColor = 'var(--color-border)';
        b.style.background  = 'var(--color-bg-elevated)';
    });
}
function submitBill() {
    const acct = document.getElementById('bill-account-no').value;
    if (!acct) { alert('Please enter account / meter number.'); return; }
    alert('Bill payment gateway coming soon!\nProvider: ' + selectedProvider + '\nAccount: ' + acct);
}
</script>

</x-layouts.app>
