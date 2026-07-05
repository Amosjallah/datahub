<x-layouts.app title="Open a Ticket">

<div style="max-width:560px;margin:0 auto;">
    <div style="margin-bottom:1.75rem;">
        <h1 style="font-size:1.4rem;font-weight:700;margin-bottom:0.2rem;">📩 Open a Support Ticket</h1>
        <p style="color:var(--color-text-muted);font-size:0.875rem;">We respond within 2 business hours (Mon–Sat, 8am–8pm).</p>
    </div>

    {{-- Common Issues (quick links) --}}
    <div style="margin-bottom:1.5rem;">
        <p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:var(--color-text-muted);margin-bottom:0.75rem;">Common Issues</p>
        <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
            @foreach(['Data not delivered','Airtime not received','Wallet not funded','Need a refund','Account access issue','Other'] as $issue)
                <button type="button" onclick="setSubject('{{ $issue }}')"
                    id="quick-{{ Str::slug($issue) }}"
                    style="padding:0.375rem 0.875rem;border:1px solid var(--color-border);border-radius:var(--radius-full);background:var(--color-bg-elevated);color:var(--color-text-secondary);font-size:0.8rem;cursor:pointer;transition:all 0.2s;">
                    {{ $issue }}
                </button>
            @endforeach
        </div>
    </div>

    <div class="card animate-fade-up">
        <div class="card-body">
            <form action="/support" method="POST" id="support-ticket-form">
                @csrf

                <div class="form-group">
                    <label class="form-label" for="ticket-subject">Subject <span style="color:var(--color-danger);">*</span></label>
                    <input type="text" id="ticket-subject" name="subject" class="form-input"
                        placeholder="Briefly describe your issue"
                        value="{{ old('subject') }}" required maxlength="150">
                    @error('subject') <p class="form-error">{{ $message }}</p> @enderror
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                    <div class="form-group">
                        <label class="form-label" for="ticket-category">Category</label>
                        <select id="ticket-category" name="category" class="form-select">
                            <option value="general" {{ old('category') === 'general' ? 'selected' : '' }}>General Inquiry</option>
                            <option value="purchase" {{ old('category') === 'purchase' ? 'selected' : '' }}>Failed Purchase</option>
                            <option value="wallet" {{ old('category') === 'wallet' ? 'selected' : '' }}>Wallet / Funding</option>
                            <option value="refund" {{ old('category') === 'refund' ? 'selected' : '' }}>Refund Request</option>
                            <option value="account" {{ old('category') === 'account' ? 'selected' : '' }}>Account / Security</option>
                            <option value="other" {{ old('category') === 'other' ? 'selected' : '' }}>Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="ticket-priority">Priority</label>
                        <select id="ticket-priority" name="priority" class="form-select">
                            <option value="low">Low</option>
                            <option value="medium" selected>Medium</option>
                            <option value="high">High (Urgent)</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label" for="ticket-message">Message <span style="color:var(--color-danger);">*</span></label>
                    <textarea id="ticket-message" name="message" class="form-textarea" rows="5"
                        placeholder="Please describe your issue in as much detail as possible. Include any transaction references, phone numbers, or error messages."
                        required style="resize:vertical;">{{ old('message') }}</textarea>
                    @error('message') <p class="form-error">{{ $message }}</p> @enderror
                    <p style="font-size:0.72rem;color:var(--color-text-muted);margin-top:0.375rem;">Minimum 20 characters</p>
                </div>

                <div style="background:rgba(14,165,233,0.06);border:1px solid rgba(14,165,233,0.2);border-radius:var(--radius-md);padding:0.875rem 1rem;margin-bottom:1.25rem;font-size:0.8rem;color:var(--color-text-secondary);">
                    <strong style="color:var(--color-info);">ℹ️</strong> For urgent issues (failed transactions, missing wallet funds), please include the transaction reference number for faster resolution.
                </div>

                <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
                    <button type="submit" class="btn btn-primary" id="btn-submit-ticket">
                        📩 Submit Ticket
                    </button>
                    <a href="{{ route('support.index') }}" class="btn btn-secondary" id="btn-cancel-ticket">
                        Cancel
                    </a>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
function setSubject(text) {
    document.getElementById('ticket-subject').value = text;
    document.getElementById('ticket-subject').focus();
    document.querySelectorAll('[id^="quick-"]').forEach(b => {
        b.style.borderColor = 'var(--color-border)';
        b.style.color = 'var(--color-text-secondary)';
    });
    const slug = text.toLowerCase().replace(/[^a-z0-9]/g,'-').replace(/-+/g,'-');
    const btn = document.getElementById('quick-' + slug);
    if (btn) { btn.style.borderColor = 'var(--color-brand-primary)'; btn.style.color = 'var(--color-brand-primary)'; }
}
</script>

</x-layouts.app>
