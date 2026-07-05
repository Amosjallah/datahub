<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{{ $description ?? 'QUICKNETDATA GH — Ghana\'s fastest VTU platform. Buy MTN, Telecel, AirtelTigo data bundles, airtime, pay electricity bills and TV subscriptions instantly.' }}">
    <title>{{ $title ?? 'Ghana\'s #1 VTU Platform' }} — QUICKNETDATA GH</title>
    <meta name="theme-color" content="#3B82F6">
    <link rel="stylesheet" href="/css/app.css">
    <link rel="manifest" href="/manifest.json">
    @stack('head')
</head>
<body>

<!-- Navigation -->
<nav class="navbar">
    <div style="max-width:1100px;margin:0 auto;width:100%;display:flex;align-items:center;justify-content:space-between;">
        <a href="/" class="navbar-logo" style="display:flex;align-items:center;gap:0.75rem;text-decoration:none;">
            <div class="navbar-logo-icon">⚡</div>
            <span class="navbar-brand-name">QUICK<span>NET</span>DATA GH</span>
        </a>
        <div class="navbar-links" style="display:flex;gap:0.5rem;align-items:center;">
            <a href="/about" class="navbar-link {{ request()->is('about') ? 'active' : '' }}">About</a>
            <a href="/services" class="navbar-link {{ request()->is('services') ? 'active' : '' }}">Services</a>
            <a href="/pricing" class="navbar-link {{ request()->is('pricing') ? 'active' : '' }}">Pricing</a>
            <a href="/become-agent" class="navbar-link {{ request()->is('become-agent') ? 'active' : '' }}">Agent</a>
            <a href="/api-docs" class="navbar-link {{ request()->is('api-docs') ? 'active' : '' }}">API</a>
            <a href="/faqs" class="navbar-link {{ request()->is('faqs') ? 'active' : '' }}">FAQs</a>
            <a href="/contact" class="navbar-link {{ request()->is('contact') ? 'active' : '' }}">Contact</a>
        </div>
        <div class="navbar-actions" style="display:flex;gap:0.75rem;align-items:center;">
            @auth
                <a href="/dashboard" class="btn btn-primary btn-sm">Dashboard</a>
            @else
                <a href="/login" class="btn btn-secondary btn-sm">Login</a>
                <a href="/register" class="btn btn-primary btn-sm">Get Started</a>
            @endauth
        </div>
    </div>
</nav>

<!-- Page Content -->
<div style="min-height: calc(100vh - 350px); padding-top: var(--topbar-height);">
    {{ $slot }}
</div>

<!-- Footer -->
<footer class="footer">
    <div class="footer-inner">
        <div class="footer-grid">
            <div class="footer-brand">
                <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.75rem;">
                    <div class="navbar-logo-icon" style="width:28px;height:28px;font-size:0.8rem;">⚡</div>
                    <span class="navbar-brand-name">QUICK<span>NET</span>DATA GH</span>
                </div>
                <p style="font-size:0.85rem;line-height:1.5;">Ghana's fastest, most reliable VTU platform. Buy data, airtime, and pay bills in seconds.</p>
            </div>
            <div>
                <div class="footer-col-title">Services</div>
                <a href="/services" class="footer-link">Data Bundles</a>
                <a href="/services" class="footer-link">Airtime Top-Up</a>
                <a href="/services" class="footer-link">Electricity (ECG)</a>
                <a href="/services" class="footer-link">TV Subscriptions</a>
            </div>
            <div>
                <div class="footer-col-title">Company</div>
                <a href="/about" class="footer-link">About Us</a>
                <a href="/become-agent" class="footer-link">Become an Agent</a>
                <a href="/blog" class="footer-link">Blog &amp; News</a>
                <a href="/careers" class="footer-link">Careers</a>
            </div>
            <div>
                <div class="footer-col-title">Legal</div>
                <a href="/terms" class="footer-link">Terms &amp; Conditions</a>
                <a href="/privacy" class="footer-link">Privacy Policy</a>
                <a href="/contact" class="footer-link">Contact Support</a>
            </div>
        </div>
        <div class="footer-bottom">
            <span>&copy; {{ date('Y') }} QUICKNETDATA GH. All rights reserved.</span>
            <span>Made with &hearts; in Ghana &🇬🇭</span>
        </div>
    </div>
</footer>

@stack('scripts')
</body>
</html>
