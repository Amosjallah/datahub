<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\WalletService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class RegisteredUserController extends Controller
{
    public function create()
    {
        return view('auth.register');
    }

    public function store(Request $request): RedirectResponse
    {
        $allowedRoles = ['customer', 'agent'];

        $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'phone'    => ['nullable', 'string', 'max:15'],
            'password' => ['required', 'confirmed', Password::min(8)],
            'role'     => ['in:' . implode(',', $allowedRoles)],
        ]);

        $user = User::create([
            'name'          => $request->name,
            'email'         => $request->email,
            'phone'         => $request->phone,
            'password'      => Hash::make($request->password),
            'role'          => in_array($request->role, $allowedRoles) ? $request->role : 'customer',
            'kyc_status'    => 'pending',
            'referral_code' => strtoupper(Str::random(8)),
        ]);

        // Create wallet immediately
        $walletService = new WalletService();
        $walletService->createWallet($user);

        event(new Registered($user));
        Auth::login($user);

        return redirect()->route('dashboard');
    }
}
