<?php

namespace App\Livewire;

use App\Models\Service;
use App\Services\VtuTransactionService;
use App\Services\WalletService;
use App\Services\Providers\DummyProviderAdapter;
use Livewire\Component;
use Illuminate\Support\Facades\Auth;

class VtuPurchase extends Component
{
    public string $serviceType;  // 'data' or 'airtime'
    public string $network = '';
    public string $phone = '';
    public ?int $serviceId = null;
    public bool $loading = false;
    public ?string $successMessage = null;
    public ?string $errorMessage = null;

    protected array $rules = [
        'network' => 'required|in:MTN,Telecel,AirtelTigo',
        'phone' => 'required|string|min:10|max:13',
        'serviceId' => 'required|exists:services,id',
    ];

    public function mount(string $type = 'data'): void
    {
        $this->serviceType = $type;
    }

    public function getServicesProperty()
    {
        if (empty($this->network)) {
            return collect();
        }
        return Service::where('network', $this->network)
            ->where('type', $this->serviceType)
            ->where('is_active', true)
            ->get();
    }

    public function purchase(): void
    {
        $this->validate();
        $this->loading = true;
        $this->successMessage = null;
        $this->errorMessage = null;

        $user = Auth::user();
        $wallet = $user->wallet;

        if (! $wallet) {
            $this->errorMessage = 'Wallet not found. Please contact support.';
            $this->loading = false;
            return;
        }

        $service = Service::find($this->serviceId);

        try {
            $txService = new VtuTransactionService(new WalletService());
            $record = $txService->executePurchase(
                wallet: $wallet,
                service: $service,
                recipient: $this->phone,
                provider: new DummyProviderAdapter(),
            );

            if ($record->status === 'success') {
                $this->successMessage = "✅ {$service->name} sent successfully to {$this->phone}!";
                $this->reset(['phone', 'serviceId']);
            } else {
                $this->errorMessage = "❌ Purchase failed: " . ($record->error_message ?? 'Please try again.');
            }
        } catch (\Exception $e) {
            $this->errorMessage = '❌ ' . $e->getMessage();
        }

        $this->loading = false;
    }

    public function render()
    {
        $title = ucfirst($this->serviceType) . ' Purchase';
        return view('livewire.vtu.purchase', [
            'services' => $this->services,
            'networks' => ['MTN', 'Telecel', 'AirtelTigo'],
        ])->layout('layouts.app', ['title' => $title]);
    }
}
