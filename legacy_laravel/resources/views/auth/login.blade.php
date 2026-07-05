<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login — QUICKNETDATA GH</title>
    <meta name="description" content="Sign in to your QUICKNETDATA GH account to buy data, airtime, and pay bills instantly.">
    <link rel="stylesheet" href="/css/app.css">
    @if(function_exists('csrf_token'))
        <meta name="csrf-token" content="{{ csrf_token() }}">
    @endif
</head>
<body style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1.5rem;">

<div style="width:100%;max-width:420px;">

    <!-- Brand -->
    <a href="/" style="display:flex;align-items:center;gap:0.75rem;justify-content:center;margin-bottom:2rem;text-decoration:none;">
        <div class="navbar-logo">⚡</div>
        <span class="navbar-brand-name" style="font-size:1.2rem;">QUICK<span>NET</span>DATA GH</span>
    </a>

    <!-- Card -->
    <div class="card">
        <div class="card-body">
            <h1 style="font-size:1.5rem;margin-bottom:0.25rem;text-align:center;">Welcome Back</h1>
            <p style="text-align:center;color:var(--color-text-muted);font-size:0.9rem;margin-bottom:1.75rem;">Sign in to your account</p>

            @if(session('error'))
                <div class="alert alert-danger">{{ session('error') }}</div>
            @endif

            <form action="/login" method="POST" id="login-form">
                @csrf
                <div class="form-group">
                    <label class="form-label" for="email">Email Address</label>
                    <input type="email" id="email" name="email" class="form-input"
                        placeholder="you@example.com" value="{{ old('email') }}" required autofocus autocomplete="email">
                    @error('email') <p class="form-error">{{ $message }}</p> @enderror
                </div>
                <div class="form-group">
                    <label class="form-label" style="display:flex;justify-content:space-between;" for="password">
                        Password <a href="/forgot-password" style="color:var(--color-brand-primary);font-size:0.8rem;">Forgot password?</a>
                    </label>
                    <input type="password" id="password" name="password" class="form-input"
                        placeholder="••••••••" required autocomplete="current-password">
                    @error('password') <p class="form-error">{{ $message }}</p> @enderror
                </div>

                <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1.25rem;">
                    <input type="checkbox" id="remember" name="remember" style="accent-color:var(--color-brand-primary);">
                    <label for="remember" style="font-size:0.875rem;color:var(--color-text-secondary);cursor:pointer;">Remember me</label>
                </div>

                <button type="submit" class="btn btn-primary btn-full" id="btn-login-submit">
                    Sign In
                </button>
            </form>

            <p style="text-align:center;margin-top:1.5rem;font-size:0.875rem;color:var(--color-text-muted);">
                Don't have an account? <a href="/register" style="color:var(--color-brand-primary);">Create one free</a>
            </p>
        </div>
    </div>

    <p style="text-align:center;margin-top:1.5rem;font-size:0.75rem;color:var(--color-text-muted);">
        By signing in you agree to our <a href="/terms" style="color:var(--color-text-secondary);">Terms</a> and <a href="/privacy" style="color:var(--color-text-secondary);">Privacy Policy</a>.
    </p>
</div>
</body>
</html>
