<?php

namespace App\Services;

use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Exception;

class WalletService
{
    /**
     * Create a wallet for a user.
     */
    public function createWallet(User $user, string $currency = 'GHS'): Wallet
    {
        return Wallet::create([
            'user_id' => $user->id,
            'currency' => $currency,
            'cached_balance' => 0.0000,
        ]);
    }

    /**
     * Credit a wallet.
     * Amount must be positive.
     */
    public function credit(Wallet $wallet, float $amount, string $type, string $reference, ?string $description = null): WalletTransaction
    {
        if ($amount <= 0) {
            throw new Exception('Credit amount must be positive.');
        }

        return DB::transaction(function () use ($wallet, $amount, $type, $reference, $description) {
            // Lock the wallet row for update to prevent race conditions
            $lockedWallet = Wallet::where('id', $wallet->id)->lockForUpdate()->first();

            // Check if transaction reference already exists (Idempotency check)
            $existingTx = WalletTransaction::where('reference', $reference)->first();
            if ($existingTx) {
                return $existingTx;
            }

            // Create ledger entry
            $transaction = WalletTransaction::create([
                'wallet_id' => $lockedWallet->id,
                'amount' => $amount,
                'type' => $type,
                'reference' => $reference,
                'description' => $description,
            ]);

            // Update cached balance
            $lockedWallet->cached_balance = $lockedWallet->cached_balance + $amount;
            $lockedWallet->save();

            return $transaction;
        });
    }

    /**
     * Debit a wallet.
     * Amount must be positive.
     */
    public function debit(Wallet $wallet, float $amount, string $type, string $reference, ?string $description = null): WalletTransaction
    {
        if ($amount <= 0) {
            throw new Exception('Debit amount must be positive.');
        }

        return DB::transaction(function () use ($wallet, $amount, $type, $reference, $description) {
            // Lock the wallet row for update to prevent race conditions
            $lockedWallet = Wallet::where('id', $wallet->id)->lockForUpdate()->first();

            // Check if transaction reference already exists (Idempotency check)
            $existingTx = WalletTransaction::where('reference', $reference)->first();
            if ($existingTx) {
                return $existingTx;
            }

            // Check balance
            if ($lockedWallet->cached_balance < $amount) {
                throw new Exception('Insufficient wallet balance.');
            }

            // Create ledger entry (negative amount for debit)
            $transaction = WalletTransaction::create([
                'wallet_id' => $lockedWallet->id,
                'amount' => -$amount,
                'type' => $type,
                'reference' => $reference,
                'description' => $description,
            ]);

            // Update cached balance
            $lockedWallet->cached_balance = $lockedWallet->cached_balance - $amount;
            $lockedWallet->save();

            return $transaction;
        });
    }

    /**
     * Recalculate balance from ledger.
     */
    public function recalculateBalance(Wallet $wallet): float
    {
        return DB::transaction(function () use ($wallet) {
            $lockedWallet = Wallet::where('id', $wallet->id)->lockForUpdate()->first();
            
            $sum = WalletTransaction::where('wallet_id', $lockedWallet->id)->sum('amount');
            
            $lockedWallet->cached_balance = $sum;
            $lockedWallet->save();
            
            return (float) $sum;
        });
    }
}
