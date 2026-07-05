<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Livewire\CustomerDashboard;
use App\Livewire\VtuPurchase;
use Illuminate\Support\Facades\Route;

// ─── Public ──────────────────────────────────────────────────────────────────
Route::get('/', fn () => view('welcome'))->name('home');
Route::get('/about', fn () => view('about'))->name('about');
Route::get('/services', fn () => view('services'))->name('services');
Route::get('/pricing', fn () => view('pricing'))->name('pricing');
Route::get('/become-agent', fn () => view('become-agent'))->name('become-agent');
Route::get('/api-docs', fn () => view('api-docs'))->name('api-docs');
Route::get('/faqs', fn () => view('faqs'))->name('faqs');
Route::get('/contact', fn () => view('contact'))->name('contact');
Route::post('/contact', fn () => redirect()->back()->with('success', 'Thank you for your message! We will get back to you shortly.'));
Route::get('/terms', fn () => view('terms'))->name('terms');
Route::get('/privacy', fn () => view('privacy'))->name('privacy');
Route::get('/blog', fn () => view('blog'))->name('blog');
Route::get('/careers', fn () => view('careers'))->name('careers');

// ─── Auth ─────────────────────────────────────────────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

// ─── Authenticated ────────────────────────────────────────────────────────────
Route::middleware('auth')->group(function () {

    // Dashboard
    Route::get('/dashboard', CustomerDashboard::class)->name('dashboard');

    // Wallet
    Route::get('/wallet', fn () => view('pages.wallet.index'))->name('wallet.index');
    Route::get('/wallet/fund', fn () => view('pages.wallet.fund'))->name('wallet.fund');

    // VTU — Livewire-driven purchase flow
    Route::get('/buy/data', VtuPurchase::class)->defaults('type', 'data')->name('vtu.data');
    Route::get('/buy/airtime', VtuPurchase::class)->defaults('type', 'airtime')->name('vtu.airtime');
    Route::get('/buy/bills', fn () => view('pages.vtu.bills'))->name('vtu.bills');
    Route::get('/buy/tv', fn () => view('pages.vtu.tv'))->name('vtu.tv');

    // Transactions
    Route::get('/transactions', fn () => view('pages.transactions.index'))->name('transactions.index');

    // Profile
    Route::get('/profile', fn () => view('pages.profile'))->name('profile');

    // Beneficiaries
    Route::get('/beneficiaries', fn () => view('pages.beneficiaries'))->name('beneficiaries.index');

    // Support
    Route::get('/support', fn () => view('pages.support.index'))->name('support.index');
    Route::get('/support/create', fn () => view('pages.support.create'))->name('support.create');

    // Agent routes
    Route::middleware('role:agent,super_admin,admin')
        ->prefix('agent')->name('agent.')
        ->group(function () {
            Route::get('/dashboard', fn () => view('agent.dashboard'))->name('dashboard');
            Route::get('/commissions', fn () => view('agent.commissions'))->name('commissions');
        });
});

// ─── Dev only ─────────────────────────────────────────────────────────────────
if (app()->environment('local')) {
    Route::post('/webhooks/mock-payment', fn (\Illuminate\Http\Request $r) => response()->json(['received' => $r->all()]))->name('webhooks.mock-payment');
}
