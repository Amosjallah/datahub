<x-layouts.app title="Fund Wallet">

<div style="max-width:520px;margin:0 auto;">
    <div style="margin-bottom:1.75rem;">
        <h1 style="font-size:1.4rem;font-weight:700;margin-bottom:0.2rem;">💰 Fund Your Wallet</h1>
        <p style="color:var(--color-text-muted);font-size:0.875rem;">Payments are processed instantly via Paystack.</p>
    </div>

    {{-- Balance Banner --}}
    <div style="display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,rgba(0,208,132,0.08),rgba(0,102,255,0.05));border:1px solid rgba(0,208,132,0.2);border-radius:var(--radius-md);padding:1rem 1.25rem;margin-bottom:1.5rem;">
        <div>
            <div style="font-size:0.72rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--color-text-muted);">Current Balance</div>
            <div style="font-weight:800;font-size:1.2rem;font-family:'Space Grotesk',sans-serif;color:var(--color-brand-primary);">
                ₵{{ number_format(auth()->user()->wallet?->cached_balance ?? 0, 2) }}
            </div>
        </div>
        <span class="badge badge-success">GHS Wallet</span>
    </div>

    <div class="card animate-fade-up">
        <div class="card-body">

            {{-- Payment Method --}}
            <div style="margin-bottom:1.5rem;">
                <p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:var(--color-text-muted);margin-bottom:0.75rem;">Payment Method</p>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
                    <button type="button" id="pm-btn-momo" onclick="selectPM('momo')"
                        style="padding:1rem;text-align:center;border:2px solid var(--color-brand-primary);background:rgba(0,208,132,0.07);border-radius:var(--radius-md);cursor:pointer;transition:all 0.2s;">
                        <div style="font-size:1.75rem;margin-bottom:0.4rem;">📱</div>
                        <div style="font-weight:600;font-size:0.875rem;color:var(--color-text-primary);">Mobile Money</div>
                        <div style="font-size:0.72rem;color:var(--color-text-muted);margin-top:0.2rem;">MTN · Telecel · AT</div>
                    </button>
                    <button type="button" id="pm-btn-card" onclick="selectPM('card')"
                        style="padding:1rem;text-align:center;border:2px solid var(--color-border);background:transparent;border-radius:var(--radius-md);cursor:pointer;transition:all 0.2s;">
                        <div style="font-size:1.75rem;margin-bottom:0.4rem;">💳</div>
                        <div style="font-weight:600;font-size:0.875rem;color:var(--color-text-primary);">Debit / Credit</div>
                        <div style="font-size:0.72rem;color:var(--color-text-muted);margin-top:0.2rem;">Visa · Mastercard</div>
                    </button>
                </div>
            </div>

            {{-- Amount Presets --}}
            <div style="margin-bottom:1.25rem;">
                <p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:var(--color-text-muted);margin-bottom:0.75rem;">Quick Amounts (GHS)</p>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin-bottom:0.75rem;">
                    @foreach([10,20,50,100,200,500] as $amt)
                        <button type="button" onclick="setAmt({{ $amt }})" id="preset-{{ $amt }}"
                            style="padding:0.625rem;border:1px solid var(--color-border);border-radius:var(--radius-md);background:var(--color-bg-elevated);color:var(--color-text-secondary);font-weight:600;font-size:0.85rem;cursor:pointer;transition:all 0.2s;">
                            ₵{{ $amt }}
                        </button>
                    @endforeach
                </div>
                <input type="number" id="fund-amount" class="form-input" placeholder="Or enter amount (min ₵1)" min="1" step="0.01" oninput="clearPresets()">
            </div>

            {{-- MoMo phone field --}}
            <div id="momo-field" style="margin-bottom:1.25rem;">
                <label class="form-label" for="momo-number">Mobile Money Number</label>
                <input type="tel" id="momo-number" class="form-input" placeholder="0244 123 456">
            </div>

            {{-- Submit --}}
            <button type="button" onclick="initiatePayment()" class="btn btn-primary btn-full" id="btn-pay-now">
                🔒 Fund Wallet Securely
            </button>

            <div style="display:flex;align-items:center;justify-content:center;gap:0.5rem;margin-top:0.875rem;">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                <span style="font-size:0.72rem;color:var(--color-text-muted);">256-bit SSL · Powered by Paystack</span>
            </div>
        </div>
    </div>
</div>

<script>
let activePM = 'momo';
function selectPM(type) {
    activePM = type;
    const momoBtn  = document.getElementById('pm-btn-momo');
    const cardBtn  = document.getElementById('pm-btn-card');
    const momoFld  = document.getElementById('momo-field');
    if (type === 'momo') {
        momoBtn.style.borderColor = 'var(--color-brand-primary)';
        momoBtn.style.background  = 'rgba(0,208,132,0.07)';
        cardBtn.style.borderColor = 'var(--color-border)';
        cardBtn.style.background  = 'transparent';
        momoFld.style.display = 'block';
    } else {
        cardBtn.style.borderColor = 'var(--color-brand-primary)';
        cardBtn.style.background  = 'rgba(0,208,132,0.07)';
        momoBtn.style.borderColor = 'var(--color-border)';
        momoBtn.style.background  = 'transparent';
        momoFld.style.display = 'none';
    }
}
function clearPresets() {
    document.querySelectorAll('[id^="preset-"]').forEach(b => {
        b.style.borderColor = 'var(--color-border)';
        b.style.color = 'var(--color-text-secondary)';
    });
}
function setAmt(a) {
    document.getElementById('fund-amount').value = a;
    clearPresets();
    const b = document.getElementById('preset-' + a);
    if (b) { b.style.borderColor = 'var(--color-brand-primary)'; b.style.color = 'var(--color-brand-primary)'; }
}
function initiatePayment() {
    const amount = parseFloat(document.getElementById('fund-amount').value);
    if (!amount || amount < 1) { alert('Please enter a valid amount (minimum ₵1).'); return; }
    if (activePM === 'momo') {
        const phone = document.getElementById('momo-number').value;
        if (!phone) { alert('Please enter your mobile money number.'); return; }
    }
    // TODO: Load Paystack inline JS and open popup
    alert('Paystack payment gateway will open here.\nAmount: ₵' + amount.toFixed(2));
}
</script>

</x-layouts.app>
