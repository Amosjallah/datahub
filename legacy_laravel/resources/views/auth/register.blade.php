<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Account — QUICKNETDATA GH</title>
    <meta name="description" content="Join QUICKNETDATA GH. Buy Ghana data, airtime and pay bills in seconds with mobile money.">
    <link rel="stylesheet" href="/css/app.css">
</head>
<body style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1.5rem;">

<div style="width:100%;max-width:460px;">
    <!-- Brand -->
    <a href="/" style="display:flex;align-items:center;gap:0.75rem;justify-content:center;margin-bottom:2rem;text-decoration:none;">
        <div class="navbar-logo">⚡</div>
        <span class="navbar-brand-name" style="font-size:1.2rem;">QUICK<span>NET</span>DATA GH</span>
    </a>

    <div class="card">
        <div class="card-body">
            <h1 style="font-size:1.5rem;margin-bottom:0.25rem;text-align:center;">Create Your Account</h1>
            <p style="text-align:center;color:var(--color-text-muted);font-size:0.9rem;margin-bottom:1.75rem;">Join thousands of Ghanaians buying instantly</p>

            @if(session('error'))
                <div class="alert alert-danger">{{ session('error') }}</div>
            @endif

            <form action="/register" method="POST" id="register-form">
                @csrf
                <!-- Role selector (hidden, toggled by query param) -->
                <input type="hidden" name="role" id="role-input" value="{{ request('role', 'customer') }}">

                @if(request('role') === 'agent')
                    <div class="alert alert-info" style="background:rgba(0,208,132,0.08);border-color:var(--color-brand-primary);color:var(--color-brand-primary);margin-bottom:1rem;">
                        🤝 You're applying as a <strong>Reseller/Agent</strong>. Enjoy discounted prices!
                    </div>
                @endif

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                    <div class="form-group" style="grid-column:1/-1;">
                        <label class="form-label" for="name">Full Name</label>
                        <input type="text" id="name" name="name" class="form-input"
                            placeholder="Kwame Mensah" value="{{ old('name') }}" required autocomplete="name">
                        @error('name') <p class="form-error">{{ $message }}</p> @enderror
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="reg-email">Email Address</label>
                        <input type="email" id="reg-email" name="email" class="form-input"
                            placeholder="you@example.com" value="{{ old('email') }}" required autocomplete="email">
                        @error('email') <p class="form-error">{{ $message }}</p> @enderror
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="phone">Phone Number</label>
                        <input type="tel" id="phone" name="phone" class="form-input"
                            placeholder="0244123456" value="{{ old('phone') }}" autocomplete="tel">
                        @error('phone') <p class="form-error">{{ $message }}</p> @enderror
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="reg-password">Password</label>
                        <input type="password" id="reg-password" name="password" class="form-input"
                            placeholder="Min 8 characters" required autocomplete="new-password">
                        @error('password') <p class="form-error">{{ $message }}</p> @enderror
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="password_confirmation">Confirm Password</label>
                        <input type="password" id="password_confirmation" name="password_confirmation" class="form-input"
                            placeholder="Repeat password" required autocomplete="new-password">
                    </div>
                </div>

                <div style="display:flex;align-items:flex-start;gap:0.5rem;margin-bottom:1.25rem;">
                    <input type="checkbox" id="terms" name="terms" required style="accent-color:var(--color-brand-primary);margin-top:3px;">
                    <label for="terms" style="font-size:0.85rem;color:var(--color-text-secondary);cursor:pointer;line-height:1.5;">
                        I agree to the <a href="/terms" style="color:var(--color-brand-primary);">Terms &amp; Conditions</a> and <a href="/privacy" style="color:var(--color-brand-primary);">Privacy Policy</a>
                    </label>
                </div>

                <button type="submit" class="btn btn-primary btn-full" id="btn-register-submit">
                    🚀 Create Free Account
                </button>
            </form>

            <p style="text-align:center;margin-top:1.5rem;font-size:0.875rem;color:var(--color-text-muted);">
                Already have an account? <a href="/login" style="color:var(--color-brand-primary);">Sign in</a>
            </p>
        </div>
    </div>
</div>
</body>
</html>
