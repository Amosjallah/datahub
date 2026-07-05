<?php

namespace App\Services;

use App\Models\Service;
use App\Models\TransactionRecord;
use App\Models\Wallet;
use App\Services\Providers\ProviderAdapterInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class VtuTransactionService
{
    public function __construct(
        protected WalletService $walletService,
    ) {}

    /**
     * Execute a VTU purchase (data or airtime) using the configured provider adapter.
     * Follows the full state machine: pending → processing → success | failed | reversed.
     */
    public function executePurchase(
        Wallet $wallet,
        Service $service,
        string $recipient,
        ProviderAdapterInterface $provider,
    ): TransactionRecord {
        $price = $this->priceForUser($wallet->user, $service);
        $reference = 'VTU-' . strtoupper(Str::uuid());

        // 1. Create transaction record in PENDING state
        $record = TransactionRecord::create([
            'user_id' => $wallet->user_id,
            'service_id' => $service->id,
            'wallet_transaction_id' => null,
            'recipient' => $recipient,
            'amount' => $price,
            'status' => 'pending',
        ]);

        try {
            // 2. Debit wallet (will throw if insufficient balance)
            $walletTx = $this->walletService->debit(
                wallet: $wallet,
                amount: $price,
                type: 'purchase',
                reference: $reference,
                description: "Purchase: {$service->name} for {$recipient}",
            );

            // 3. Update record to PROCESSING and link wallet transaction
            $record->update([
                'wallet_transaction_id' => $walletTx->id,
                'status' => 'processing',
            ]);

            // 4. Call provider (this is the external API call)
            $providerResponse = $this->callProvider($provider, $service, $recipient);

            if ($providerResponse['status'] === 'success') {
                // 5a. Mark as SUCCESS
                $record->update([
                    'status' => 'success',
                    'provider_reference' => $providerResponse['provider_reference'],
                ]);
            } else {
                // 5b. Provider failed — reverse the wallet debit
                $this->walletService->credit(
                    wallet: $wallet,
                    amount: $price,
                    type: 'refund',
                    reference: 'REFUND-' . $reference,
                    description: "Refund: {$service->name} failed for {$recipient}",
                );

                $record->update([
                    'status' => 'failed',
                    'error_message' => $providerResponse['error_message'],
                ]);
            }
        } catch (\Exception $e) {
            $record->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);
        }

        return $record->fresh();
    }

    /**
     * Determine which provider method to call based on service type.
     */
    protected function callProvider(ProviderAdapterInterface $provider, Service $service, string $recipient): array
    {
        return match ($service->type) {
            'airtime' => $provider->purchaseAirtime($recipient, $service->retail_price, $service->network),
            'data'    => $provider->purchaseData($recipient, $service->provider_identifier, $service->network),
            'bill'    => $provider->payBill($recipient, $service->retail_price, $service->network),
            default   => ['status' => 'failed', 'provider_reference' => null, 'error_message' => 'Unknown service type'],
        };
    }

    /**
     * Get price based on user role.
     */
    protected function priceForUser(\App\Models\User $user, Service $service): float
    {
        return match ($user->role) {
            'agent'       => $service->agent_price,
            'super_agent' => $service->super_agent_price ?? $service->agent_price,
            default       => $service->retail_price,
        };
    }
}
