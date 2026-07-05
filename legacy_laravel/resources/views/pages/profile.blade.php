<x-layouts.app title="My Profile">
@php $user = auth()->user(); @endphp

<div style="max-width:600px;">
    <div style="margin-bottom:2rem;">
        <h1 style="font-size:1.4rem;font-weight:700;margin-bottom:0.2rem;">👤 My Profile</h1>
        <p style="color:var(--color-text-muted);font-size:0.875rem;">Manage your account details, security, and preferences.</p>
    </div>

    {{-- Profile Hero --}}
    <div class="card animate-fade-up" style="margin-bottom:1.25rem;background:linear-gradient(135deg,rgba(0,208,132,0.05),rgba(0,102,255,0.05));">
        <div class="card-body" style="display:flex;align-items:center;gap:1.25rem;flex-wrap:wrap;">
            <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--color-brand-primary),var(--color-brand-secondary));display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;color:#fff;flex-shrink:0;box-shadow:0 4px 16px rgba(0,208,132,0.3);">
                {{ strtoupper(substr($user->name, 0, 1)) }}
            </div>
            <div style="flex:1;min-width:0;">
                <div style="font-size:1.1rem;font-weight:700;">{{ $user->name }}</div>
                <div style="color:var(--color-text-muted);font-size:0.85rem;margin-top:0.2rem;">{{ $user->email }}</div>
                <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.625rem;">
                    <span class="badge badge-info">{{ ucfirst($user->role) }}</span>
                    @if($user->kyc_status === 'approved')
                        <span class="badge badge-success">✓ KYC Verified</span>
                    @elseif($user->kyc_status === 'pending')
                        <span class="badge badge-warning">⏳ KYC Pending</span>
                    @else
                        <span class="badge badge-danger">✗ KYC Rejected</span>
                    @endif
                    <span class="badge badge-secondary">Member since {{ $user->created_at->format('M Y') }}</span>
                </div>
            </div>
        </div>
    </div>

    {{-- KYC Warning --}}
    @if($user->kyc_status !== 'approved')
        <div class="alert alert-warning" style="margin-bottom:1.25rem;">
            ⚠️ Your KYC is <strong>{{ $user->kyc_status }}</strong>. Some features may be limited until verification is complete.
        </div>
    @endif

    {{-- Personal Info --}}
    <div class="card animate-fade-up-1" style="margin-bottom:1.25rem;">
        <div class="card-body">
            <h3 style="font-size:0.875rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--color-text-muted);margin-bottom:1.25rem;">Personal Information</h3>
            <form action="/profile/update" method="POST" id="profile-update-form">
                @csrf
                @method('PATCH')
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                    <div class="form-group" style="grid-column:1/-1;">
                        <label class="form-label" for="profile-name">Full Name</label>
                        <input type="text" id="profile-name" name="name" class="form-input" value="{{ old('name', $user->name) }}" required>
                        @error('name') <p class="form-error">{{ $message }}</p> @enderror
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="profile-email">Email Address</label>
                        <input type="email" id="profile-email" name="email" class="form-input" value="{{ old('email', $user->email) }}" required>
                        @error('email') <p class="form-error">{{ $message }}</p> @enderror
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="profile-phone">Phone Number</label>
                        <input type="tel" id="profile-phone" name="phone" class="form-input" value="{{ old('phone', $user->phone) }}" placeholder="0244123456">
                        @error('phone') <p class="form-error">{{ $message }}</p> @enderror
                    </div>
                </div>
                <button type="submit" class="btn btn-primary btn-sm" id="btn-save-profile">Save Changes</button>
            </form>
        </div>
    </div>

    {{-- Change Password --}}
    <div class="card animate-fade-up-1" style="margin-bottom:1.25rem;">
        <div class="card-body">
            <h3 style="font-size:0.875rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--color-text-muted);margin-bottom:1.25rem;">Change Password</h3>
            <form action="/profile/password" method="POST" id="profile-password-form">
                @csrf
                @method('PUT')
                <div class="form-group">
                    <label class="form-label" for="current-password">Current Password</label>
                    <input type="password" id="current-password" name="current_password" class="form-input" autocomplete="current-password">
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                    <div class="form-group">
                        <label class="form-label" for="new-password">New Password</label>
                        <input type="password" id="new-password" name="password" class="form-input" autocomplete="new-password">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="confirm-password">Confirm New</label>
                        <input type="password" id="confirm-password" name="password_confirmation" class="form-input" autocomplete="new-password">
                    </div>
                </div>
                <button type="submit" class="btn btn-secondary btn-sm" id="btn-change-password">Update Password</button>
            </form>
        </div>
    </div>

    {{-- Referral --}}
    <div class="card animate-fade-up-2" style="margin-bottom:1.25rem;">
        <div class="card-body">
            <h3 style="font-size:0.875rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--color-text-muted);margin-bottom:0.75rem;">🎁 Referral Code</h3>
            <p style="font-size:0.85rem;color:var(--color-text-muted);margin-bottom:0.875rem;">Share your code and earn ₵2 for each successful referral.</p>
            <div style="display:flex;gap:0.625rem;align-items:center;">
                <input type="text" class="form-input" id="ref-code" value="{{ $user->referral_code }}" readonly
                    style="font-family:monospace;font-size:1rem;letter-spacing:0.15em;color:var(--color-brand-primary);font-weight:700;cursor:pointer;"
                    onclick="this.select()">
                <button type="button" class="btn btn-secondary btn-sm" onclick="copyRef()" id="btn-copy-ref" style="white-space:nowrap;">
                    Copy
                </button>
            </div>
            <p style="font-size:0.75rem;color:var(--color-text-muted);margin-top:0.625rem;">Referral link: https://quicknetdata.gh/r/{{ strtolower($user->referral_code) }}</p>
        </div>
    </div>

    {{-- Danger Zone --}}
    <div class="card" style="border-color:rgba(255,69,96,0.2);">
        <div class="card-body">
            <h3 style="font-size:0.875rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--color-danger);margin-bottom:0.5rem;">Danger Zone</h3>
            <p style="font-size:0.85rem;color:var(--color-text-muted);margin-bottom:1rem;">Permanent and irreversible account actions.</p>
            <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
                <form action="{{ route('logout') }}" method="POST">
                    @csrf
                    <button type="submit" class="btn btn-sm" style="border:1px solid var(--color-danger);color:var(--color-danger);background:rgba(255,69,96,0.07);" id="btn-logout-all">
                        Sign Out
                    </button>
                </form>
                <button type="button" class="btn btn-sm" style="border:1px solid var(--color-danger);color:var(--color-danger);background:rgba(255,69,96,0.07);" onclick="confirmDeactivate()" id="btn-deactivate">
                    Deactivate Account
                </button>
            </div>
        </div>
    </div>
</div>

<script>
function copyRef() {
    const inp = document.getElementById('ref-code');
    inp.select();
    document.execCommand('copy');
    const btn = document.getElementById('btn-copy-ref');
    btn.textContent = '✓ Copied!';
    btn.style.color = 'var(--color-success)';
    setTimeout(() => { btn.textContent = 'Copy'; btn.style.color = ''; }, 2000);
}
function confirmDeactivate() {
    if (confirm('Are you sure? This will permanently deactivate your account and cannot be undone.')) {
        alert('Account deactivation request submitted. Our support team will contact you within 24 hours.');
    }
}
</script>

</x-layouts.app>
