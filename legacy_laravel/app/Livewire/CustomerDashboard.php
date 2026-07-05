<?php

namespace App\Livewire;

use Livewire\Component;
use Illuminate\Support\Facades\Auth;

class CustomerDashboard extends Component
{
    public function render()
    {
        $user = Auth::user();
        $wallet = $user->wallet;

        $recentTransactions = $user->transactionRecords()
            ->with('service')
            ->latest()
            ->take(6)
            ->get();

        $totalSpent = $user->transactionRecords()
            ->where('status', 'success')
            ->sum('amount');

        $successCount = $user->transactionRecords()
            ->where('status', 'success')
            ->count();

        return view('livewire.customer.dashboard', [
            'wallet'             => $wallet,
            'recentTransactions' => $recentTransactions,
            'totalSpent'         => $totalSpent,
            'successCount'       => $successCount,
        ])->layout('layouts.app', ['title' => 'Dashboard']);
    }
}
