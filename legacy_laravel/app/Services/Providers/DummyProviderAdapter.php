<?php

namespace App\Services\Providers;

use Illuminate\Support\Str;

/**
 * DummyProviderAdapter
 *
 * A sandbox/mock provider adapter used for local development and testing.
 * Simulates successful and failed responses without hitting any real API.
 * Set PROVIDER_SIMULATE_FAILURE=true in .env to test failure flows.
 */
class DummyProviderAdapter implements ProviderAdapterInterface
{
    protected bool $simulateFailure;

    public function __construct()
    {
        $this->simulateFailure = (bool) env('PROVIDER_SIMULATE_FAILURE', false);
    }

    public function purchaseAirtime(string $phone, float $amount, string $network): array
    {
        if ($this->simulateFailure) {
            return [
                'status' => 'failed',
                'provider_reference' => null,
                'error_message' => "[SANDBOX] Airtime purchase failed for {$phone} on {$network}",
            ];
        }

        return [
            'status' => 'success',
            'provider_reference' => 'DUMMY-AIR-' . strtoupper(Str::random(8)),
            'error_message' => null,
        ];
    }

    public function purchaseData(string $phone, string $packageCode, string $network): array
    {
        if ($this->simulateFailure) {
            return [
                'status' => 'failed',
                'provider_reference' => null,
                'error_message' => "[SANDBOX] Data purchase failed for {$phone} package {$packageCode} on {$network}",
            ];
        }

        return [
            'status' => 'success',
            'provider_reference' => 'DUMMY-DATA-' . strtoupper(Str::random(8)),
            'error_message' => null,
        ];
    }

    public function payBill(string $accountNumber, float $amount, string $billType): array
    {
        if ($this->simulateFailure) {
            return [
                'status' => 'failed',
                'provider_reference' => null,
                'error_message' => "[SANDBOX] Bill payment failed for {$accountNumber} ({$billType})",
            ];
        }

        return [
            'status' => 'success',
            'provider_reference' => 'DUMMY-BILL-' . strtoupper(Str::random(8)),
            'error_message' => null,
        ];
    }

    public function checkTransactionStatus(string $providerReference): array
    {
        return [
            'status' => $this->simulateFailure ? 'failed' : 'success',
            'error_message' => $this->simulateFailure ? '[SANDBOX] Status check failed' : null,
        ];
    }
}
