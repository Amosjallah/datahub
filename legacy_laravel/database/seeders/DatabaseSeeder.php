<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\User;
use App\Services\WalletService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $walletService = new WalletService();

        // ─── Super Admin ──────────────────────────────────────────
        $admin = User::firstOrCreate(
            ['email' => 'admin@quicknetdata.gh'],
            [
                'name'           => 'QUICKNETDATA Admin',
                'phone'          => '0244000001',
                'password'       => bcrypt('Admin@12345'),
                'role'           => 'super_admin',
                'kyc_status'     => 'approved',
                'referral_code'  => 'ADMIN-' . strtoupper(Str::random(6)),
            ]
        );

        if (! $admin->wallet) {
            $wallet = $walletService->createWallet($admin);
            $walletService->credit($wallet, 500.00, 'manual_adjustment', 'SEED-ADMIN-CREDIT', 'Initial admin wallet credit');
        }

        // ─── Demo Customer ────────────────────────────────────────
        $customer = User::firstOrCreate(
            ['email' => 'customer@demo.gh'],
            [
                'name'          => 'Kofi Demo',
                'phone'         => '0244000002',
                'password'      => bcrypt('Demo@12345'),
                'role'          => 'customer',
                'kyc_status'    => 'approved',
                'referral_code' => 'KOFI-' . strtoupper(Str::random(6)),
            ]
        );

        if (! $customer->wallet) {
            $wallet = $walletService->createWallet($customer);
            $walletService->credit($wallet, 100.00, 'funding', 'SEED-CUST-CREDIT', 'Demo wallet funding');
        }

        // ─── Demo Agent ───────────────────────────────────────────
        $agent = User::firstOrCreate(
            ['email' => 'agent@demo.gh'],
            [
                'name'          => 'Ama Agent',
                'phone'         => '0244000003',
                'password'      => bcrypt('Demo@12345'),
                'role'          => 'agent',
                'kyc_status'    => 'approved',
                'referral_code' => 'AMA-' . strtoupper(Str::random(6)),
            ]
        );

        if (! $agent->wallet) {
            $wallet = $walletService->createWallet($agent);
            $walletService->credit($wallet, 250.00, 'funding', 'SEED-AGENT-CREDIT', 'Agent demo wallet funding');
        }

        // ─── Services ─────────────────────────────────────────────
        $services = [
            // MTN Data Bundles
            ['name' => 'MTN 1GB / 24hrs', 'type' => 'data', 'network' => 'MTN', 'provider_identifier' => 'MTN_1GB_1DAY', 'cost_price' => 2.80, 'retail_price' => 3.50, 'agent_price' => 3.00],
            ['name' => 'MTN 2GB / 3 Days', 'type' => 'data', 'network' => 'MTN', 'provider_identifier' => 'MTN_2GB_3DAYS', 'cost_price' => 5.20, 'retail_price' => 6.50, 'agent_price' => 5.80],
            ['name' => 'MTN 5GB / 7 Days', 'type' => 'data', 'network' => 'MTN', 'provider_identifier' => 'MTN_5GB_7DAYS', 'cost_price' => 11.00, 'retail_price' => 13.50, 'agent_price' => 12.00],
            ['name' => 'MTN 10GB / 30 Days', 'type' => 'data', 'network' => 'MTN', 'provider_identifier' => 'MTN_10GB_30DAYS', 'cost_price' => 20.00, 'retail_price' => 24.00, 'agent_price' => 22.00],
            ['name' => 'MTN 20GB / 30 Days', 'type' => 'data', 'network' => 'MTN', 'provider_identifier' => 'MTN_20GB_30DAYS', 'cost_price' => 38.00, 'retail_price' => 45.00, 'agent_price' => 41.00],

            // Telecel Data Bundles
            ['name' => 'Telecel 1.5GB / 24hrs', 'type' => 'data', 'network' => 'Telecel', 'provider_identifier' => 'TCL_1.5GB_1DAY', 'cost_price' => 2.80, 'retail_price' => 3.50, 'agent_price' => 3.00],
            ['name' => 'Telecel 3GB / 3 Days', 'type' => 'data', 'network' => 'Telecel', 'provider_identifier' => 'TCL_3GB_3DAYS', 'cost_price' => 5.00, 'retail_price' => 6.50, 'agent_price' => 5.75],
            ['name' => 'Telecel 8GB / 30 Days', 'type' => 'data', 'network' => 'Telecel', 'provider_identifier' => 'TCL_8GB_30DAYS', 'cost_price' => 18.00, 'retail_price' => 22.00, 'agent_price' => 20.00],

            // AirtelTigo Data Bundles
            ['name' => 'AirtelTigo 1GB / 24hrs', 'type' => 'data', 'network' => 'AirtelTigo', 'provider_identifier' => 'AT_1GB_1DAY', 'cost_price' => 2.50, 'retail_price' => 3.20, 'agent_price' => 2.80],
            ['name' => 'AirtelTigo 5GB / 7 Days', 'type' => 'data', 'network' => 'AirtelTigo', 'provider_identifier' => 'AT_5GB_7DAYS', 'cost_price' => 10.50, 'retail_price' => 13.00, 'agent_price' => 11.50],
            ['name' => 'AirtelTigo 10GB / 30 Days', 'type' => 'data', 'network' => 'AirtelTigo', 'provider_identifier' => 'AT_10GB_30DAYS', 'cost_price' => 19.00, 'retail_price' => 23.50, 'agent_price' => 21.00],

            // Airtime
            ['name' => 'MTN Airtime', 'type' => 'airtime', 'network' => 'MTN', 'provider_identifier' => 'MTN_AIRTIME', 'cost_price' => 0.95, 'retail_price' => 1.00, 'agent_price' => 0.97],
            ['name' => 'Telecel Airtime', 'type' => 'airtime', 'network' => 'Telecel', 'provider_identifier' => 'TCL_AIRTIME', 'cost_price' => 0.95, 'retail_price' => 1.00, 'agent_price' => 0.97],
            ['name' => 'AirtelTigo Airtime', 'type' => 'airtime', 'network' => 'AirtelTigo', 'provider_identifier' => 'AT_AIRTIME', 'cost_price' => 0.95, 'retail_price' => 1.00, 'agent_price' => 0.97],

            // Bills
            ['name' => 'ECG Electricity (Prepaid)', 'type' => 'bill', 'network' => 'ECG', 'provider_identifier' => 'ECG_PREPAID', 'cost_price' => 0.00, 'retail_price' => 0.50, 'agent_price' => 0.30],
            ['name' => 'Ghana Water (GWCL)', 'type' => 'bill', 'network' => 'GWCL', 'provider_identifier' => 'GWCL_BILL', 'cost_price' => 0.00, 'retail_price' => 0.50, 'agent_price' => 0.30],

            // TV
            ['name' => 'DStv Subscription', 'type' => 'bill', 'network' => 'DSTV', 'provider_identifier' => 'DSTV_SUB', 'cost_price' => 0.00, 'retail_price' => 1.00, 'agent_price' => 0.50],
            ['name' => 'GOtv Subscription', 'type' => 'bill', 'network' => 'GOTV', 'provider_identifier' => 'GOTV_SUB', 'cost_price' => 0.00, 'retail_price' => 1.00, 'agent_price' => 0.50],
            ['name' => 'StarTimes Subscription', 'type' => 'bill', 'network' => 'STARTIMES', 'provider_identifier' => 'STARTIMES_SUB', 'cost_price' => 0.00, 'retail_price' => 1.00, 'agent_price' => 0.50],

            // Educational PINs
            ['name' => 'WAEC Checker PIN', 'type' => 'pin', 'network' => 'WAEC', 'provider_identifier' => 'WAEC_PIN', 'cost_price' => 4.50, 'retail_price' => 5.00, 'agent_price' => 4.70],
        ];

        foreach ($services as $data) {
            Service::firstOrCreate(
                ['provider_identifier' => $data['provider_identifier']],
                array_merge($data, [
                    'provider_adapter' => \App\Services\Providers\DummyProviderAdapter::class,
                    'super_agent_price' => $data['agent_price'] * 0.96,
                    'is_active' => true,
                ])
            );
        }

        $this->command->info('✅ QUICKNETDATA GH seeded successfully!');
        $this->command->table(
            ['Role', 'Email', 'Password'],
            [
                ['Super Admin', 'admin@quicknetdata.gh', 'Admin@12345'],
                ['Customer',    'customer@demo.gh',      'Demo@12345'],
                ['Agent',       'agent@demo.gh',         'Demo@12345'],
            ]
        );
    }
}
