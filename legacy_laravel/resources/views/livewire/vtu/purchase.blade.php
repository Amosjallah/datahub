<div>
    <div style="max-width:560px;margin:0 auto;">

        <div style="margin-bottom:1.75rem;">
            <h1 style="font-size:1.4rem;font-weight:700;margin-bottom:0.25rem;">
                @if($serviceType === 'data') 🌐 Buy Data Bundle @else 📱 Buy Airtime @endif
            </h1>
            <p style="color:var(--color-text-muted);font-size:0.875rem;">
                Select a network, enter the number, then pick your plan.
            </p>
        </div>

        @if($successMessage)
            <div class="alert alert-success">{{ $successMessage }}</div>
        @endif
        @if($errorMessage)
            <div class="alert alert-danger">{{ $errorMessage }}</div>
        @endif

        <div class="card">
            <div class="card-body">

                {{-- Step 1: Network --}}
                <div style="margin-bottom:1.5rem;">
                    <p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:var(--color-text-muted);margin-bottom:0.75rem;">Step 1 — Select Network</p>
                    <div class="network-grid">
                        <button type="button" wire:click="$set('network','MTN')" id="network-btn-mtn"
                            class="network-btn mtn {{ $network === 'MTN' ? 'active' : '' }}">
                            <span style="font-size:1.75rem;line-height:1;">🟡</span>
                            <span>MTN</span>
                        </button>
                        <button type="button" wire:click="$set('network','Telecel')" id="network-btn-telecel"
                            class="network-btn telecel {{ $network === 'Telecel' ? 'active' : '' }}">
                            <span style="font-size:1.75rem;line-height:1;">🔴</span>
                            <span>Telecel</span>
                        </button>
                        <button type="button" wire:click="$set('network','AirtelTigo')" id="network-btn-airteltigo"
                            class="network-btn airteltigo {{ $network === 'AirtelTigo' ? 'active' : '' }}">
                            <span style="font-size:1.75rem;line-height:1;">🔵</span>
                            <span>AirtelTigo</span>
                        </button>
                    </div>
                    @error('network') <p class="form-error" style="margin-top:0.5rem;">{{ $message }}</p> @enderror
                </div>

                {{-- Step 2: Phone --}}
                <div style="margin-bottom:1.5rem;">
                    <p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:var(--color-text-muted);margin-bottom:0.75rem;">Step 2 — Recipient Number</p>
                    <input
                        type="tel"
                        id="vtu-phone-number"
                        wire:model.blur="phone"
                        class="form-input"
                        placeholder="e.g. 0244 123 456"
                        autocomplete="tel"
                        style="font-size:1.1rem;letter-spacing:0.05em;"
                    >
                    @error('phone') <p class="form-error" style="margin-top:0.5rem;">{{ $message }}</p> @enderror
                </div>

                {{-- Step 3: Service Bundle --}}
                @if($network)
                    <div style="margin-bottom:1.5rem;">
                        <p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:var(--color-text-muted);margin-bottom:0.75rem;">
                            Step 3 — Choose {{ $serviceType === 'data' ? 'Bundle' : 'Amount' }}
                        </p>

                        @if($services->isEmpty())
                            <div style="padding:2rem;text-align:center;background:var(--color-bg-elevated);border-radius:var(--radius-md);color:var(--color-text-muted);font-size:0.875rem;">
                                No packages available for {{ $network }} right now.
                            </div>
                        @else
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.625rem;">
                                @foreach($services as $svc)
                                    <button
                                        type="button"
                                        wire:click="$set('serviceId', {{ $svc->id }})"
                                        id="service-option-{{ $svc->id }}"
                                        style="padding:0.875rem;text-align:left;border:2px solid {{ $serviceId == $svc->id ? 'var(--color-brand-primary)' : 'var(--color-border)' }};background:{{ $serviceId == $svc->id ? 'rgba(0,208,132,0.07)' : 'var(--color-bg-elevated)' }};border-radius:var(--radius-md);cursor:pointer;transition:all 0.2s;display:flex;flex-direction:column;gap:0.25rem;">
                                        <span style="font-weight:600;font-size:0.875rem;color:var(--color-text-primary);">{{ $svc->name }}</span>
                                        <span style="font-size:1.1rem;font-weight:800;color:var(--color-brand-primary);font-family:'Space Grotesk',sans-serif;">₵{{ number_format($svc->retail_price, 2) }}</span>
                                    </button>
                                @endforeach
                            </div>
                        @endif
                        @error('serviceId') <p class="form-error" style="margin-top:0.5rem;">{{ $message }}</p> @enderror
                    </div>
                @endif

                {{-- Divider --}}
                <div style="border-top:1px solid var(--color-border);margin-bottom:1.25rem;"></div>

                {{-- Wallet Balance Hint --}}
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;font-size:0.85rem;">
                    <span style="color:var(--color-text-muted);">Wallet Balance</span>
                    <strong style="color:var(--color-brand-primary);">₵{{ number_format(auth()->user()->wallet?->cached_balance ?? 0, 2) }}</strong>
                </div>

                {{-- Submit --}}
                <button
                    type="button"
                    wire:click="purchase"
                    class="btn btn-primary btn-full"
                    id="btn-confirm-purchase"
                    wire:loading.attr="disabled"
                    wire:loading.class="btn-loading"
                >
                    <span wire:loading.remove>⚡ Confirm &amp; Pay</span>
                    <span wire:loading style="display:flex;align-items:center;gap:0.5rem;">
                        <svg style="animation:spin 1s linear infinite;width:16px;height:16px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                        Processing…
                    </span>
                </button>
            </div>
        </div>
    </div>
</div>
