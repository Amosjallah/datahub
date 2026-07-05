<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Services\WalletService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Exception;

class WalletTest extends TestCase
{
    use RefreshDatabase;

    protected WalletService $walletService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->walletService = new WalletService();
    }

    public function test_wallet_creation(): void
    {
        $user = User::factory()->create();
        $wallet = $this->walletService->createWallet($user);

        $this->assertDatabaseHas('wallets', [
            'user_id' => $user->id,
            'currency' => 'GHS',
            'cached_balance' => 0.0000,
        ]);

        $this->assertEquals(0, $wallet->cached_balance);
    }

    public function test_wallet_credit(): void
    {
        $user = User::factory()->create();
        $wallet = $this->walletService->createWallet($user);

        $ref = (string) Str::uuid();
        $this->walletService->credit($wallet, 150.50, 'funding', $ref, 'MoMo Funding');

        $wallet->refresh();
        $this->assertEquals(150.50, $wallet->cached_balance);

        $this->assertDatabaseHas('wallet_transactions', [
            'wallet_id' => $wallet->id,
            'amount' => 150.50,
            'type' => 'funding',
            'reference' => $ref,
        ]);
    }

    public function test_wallet_debit(): void
    {
        $user = User::factory()->create();
        $wallet = $this->walletService->createWallet($user);

        // Pre-credit
        $this->walletService->credit($wallet, 200.00, 'funding', (string) Str::uuid());

        $ref = (string) Str::uuid();
        $this->walletService->debit($wallet, 50.25, 'purchase', $ref, 'Data Bundle Purchase');

        $wallet->refresh();
        $this->assertEquals(149.75, $wallet->cached_balance);

        $this->assertDatabaseHas('wallet_transactions', [
            'wallet_id' => $wallet->id,
            'amount' => -50.25,
            'type' => 'purchase',
            'reference' => $ref,
        ]);
    }

    public function test_insufficient_balance_debit_fails(): void
    {
        $user = User::factory()->create();
        $wallet = $this->walletService->createWallet($user);

        $this->walletService->credit($wallet, 20.00, 'funding', (string) Str::uuid());

        $this->expectException(Exception::class);
        $this->expectExceptionMessage('Insufficient wallet balance.');

        $this->walletService->debit($wallet, 50.00, 'purchase', (string) Str::uuid());
    }

    public function test_idempotency_credit(): void
    {
        $user = User::factory()->create();
        $wallet = $this->walletService->createWallet($user);

        $ref = 'idemp_ref_123';
        
        // First call
        $this->walletService->credit($wallet, 100.00, 'funding', $ref);
        
        // Second call with same ref
        $this->walletService->credit($wallet, 100.00, 'funding', $ref);

        $wallet->refresh();
        // Balance should only be credited once
        $this->assertEquals(100.00, $wallet->cached_balance);
        $this->assertEquals(1, WalletTransaction::where('reference', $ref)->count());
    }

    public function test_idempotency_debit(): void
    {
        $user = User::factory()->create();
        $wallet = $this->walletService->createWallet($user);

        $this->walletService->credit($wallet, 200.00, 'funding', (string) Str::uuid());

        $ref = 'idemp_debit_123';

        // First call
        $this->walletService->debit($wallet, 50.00, 'purchase', $ref);
        
        // Second call with same ref
        $this->walletService->debit($wallet, 50.00, 'purchase', $ref);

        $wallet->refresh();
        // Balance should only be debited once (200 - 50 = 150)
        $this->assertEquals(150.00, $wallet->cached_balance);
        $this->assertEquals(1, WalletTransaction::where('reference', $ref)->count());
    }

    public function test_recalculate_balance(): void
    {
        $user = User::factory()->create();
        $wallet = $this->walletService->createWallet($user);

        $this->walletService->credit($wallet, 100.00, 'funding', (string) Str::uuid());
        $this->walletService->debit($wallet, 30.00, 'purchase', (string) Str::uuid());
        $this->walletService->credit($wallet, 50.00, 'funding', (string) Str::uuid());

        // Manually corrupt cached balance
        $wallet->cached_balance = 999.00;
        $wallet->save();

        $recalculated = $this->walletService->recalculateBalance($wallet);

        $this->assertEquals(120.00, $recalculated);
        $wallet->refresh();
        $this->assertEquals(120.00, $wallet->cached_balance);
    }
}
