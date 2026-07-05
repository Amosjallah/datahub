<?php

namespace App\Services\Providers;

interface ProviderAdapterInterface
{
    /**
     * Purchase airtime for a phone number.
     * Returns an array with keys: 'status' ('success' or 'failed'), 'provider_reference', 'error_message'
     */
    public function purchaseAirtime(string $phone, float $amount, string $network): array;

    /**
     * Purchase data bundle for a phone number.
     * Returns an array with keys: 'status' ('success' or 'failed'), 'provider_reference', 'error_message'
     */
    public function purchaseData(string $phone, string $packageCode, string $network): array;

    /**
     * Pay utility bill.
     * Returns an array with keys: 'status' ('success' or 'failed'), 'provider_reference', 'error_message'
     */
    public function payBill(string $accountNumber, float $amount, string $billType): array;

    /**
     * Query status of a transaction on the upstream provider.
     * Returns an array with keys: 'status' ('success', 'failed', or 'processing'), 'error_message'
     */
    public function checkTransactionStatus(string $providerReference): array;
}
