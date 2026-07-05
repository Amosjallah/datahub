<x-layouts.public title="Pricing" description="Check out our competitive rates for MTN, Telecel, and AirtelTigo VTU data bundles, airtime, and utility payments.">
    <section class="section animate-fade-up">
        <div style="text-align: center; margin-bottom: 3.5rem;">
            <span class="section-label">Transparent Rates</span>
            <h1 class="section-title" style="font-size: 2.5rem;">Affordable Data &amp; Airtime Pricing</h1>
            <p style="color: var(--color-text-muted); max-width: 550px; margin: 0.5rem auto 0;">
                Compare rates across networks. Become an Agent or API partner to unlock discounted pricing tiers.
            </p>
        </div>

        @php
            $services = \App\Models\Service::where('is_active', true)->orderBy('type')->orderBy('network')->get();
        @endphp

        <div class="card" style="margin-bottom: 2.5rem; overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
                <thead>
                    <tr style="border-bottom: 1.5px solid var(--color-border); background: var(--color-bg-elevated);">
                        <th style="padding: 1rem 1.5rem; color: var(--color-text-primary);">Network</th>
                        <th style="padding: 1rem 1.5rem; color: var(--color-text-primary);">Service / Package</th>
                        <th style="padding: 1rem 1.5rem; color: var(--color-text-primary);">Retail Price (GHS)</th>
                        <th style="padding: 1rem 1.5rem; color: var(--color-text-primary);">Agent Price (GHS)</th>
                        <th style="padding: 1rem 1.5rem; color: var(--color-text-primary);">API Partner Price (GHS)</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($services as $svc)
                        <tr style="border-bottom: 1px solid var(--color-border-subtle); transition: background var(--transition-fast);">
                            <td style="padding: 1rem 1.5rem;">
                                <span class="badge badge-{{ $svc->network === 'MTN' ? 'warning' : ($svc->network === 'Telecel' ? 'danger' : 'info') }}" style="font-size:0.75rem;">
                                    {{ $svc->network }}
                                </span>
                            </td>
                            <td style="padding: 1rem 1.5rem; font-weight: 500; color: var(--color-text-primary);">{{ $svc->name }}</td>
                            <td style="padding: 1rem 1.5rem; color: var(--color-text-secondary);">₵{{ number_format($svc->retail_price, 2) }}</td>
                            <td style="padding: 1rem 1.5rem; color: var(--color-brand-primary); font-weight: 600;">₵{{ number_format($svc->agent_price, 2) }}</td>
                            <td style="padding: 1rem 1.5rem; color: #10B981; font-weight: 600;">₵{{ number_format($svc->api_price ?? ($svc->agent_price * 0.98), 2) }}</td>
                        </tr>
                    @empty
                        <!-- Static fallback if database has no records -->
                        @php
                            $fallbackServices = [
                                ['network' => 'MTN', 'name' => 'MTN CG Data 5GB', 'retail' => 20.00, 'agent' => 18.50, 'api' => 18.00],
                                ['network' => 'MTN', 'name' => 'MTN CG Data 10GB', 'retail' => 40.00, 'agent' => 37.00, 'api' => 36.00],
                                ['network' => 'Telecel', 'name' => 'Telecel Data 5GB', 'retail' => 18.00, 'agent' => 17.00, 'api' => 16.50],
                                ['network' => 'Telecel', 'name' => 'Telecel Data 10GB', 'retail' => 35.00, 'agent' => 33.00, 'api' => 32.00],
                                ['network' => 'AirtelTigo', 'name' => 'AirtelTigo Data 5GB', 'retail' => 15.00, 'agent' => 14.00, 'api' => 13.50],
                                ['network' => 'AirtelTigo', 'name' => 'AirtelTigo Data 10GB', 'retail' => 28.00, 'agent' => 26.00, 'api' => 25.00],
                            ];
                        @endphp
                        @foreach($fallbackServices as $f)
                            <tr style="border-bottom: 1px solid var(--color-border-subtle); transition: background var(--transition-fast);">
                                <td style="padding: 1rem 1.5rem;">
                                    <span class="badge badge-{{ $f['network'] === 'MTN' ? 'warning' : ($f['network'] === 'Telecel' ? 'danger' : 'info') }}" style="font-size:0.75rem;">
                                        {{ $f['network'] }}
                                    </span>
                                </td>
                                <td style="padding: 1rem 1.5rem; font-weight: 500; color: var(--color-text-primary);">{{ $f['name'] }}</td>
                                <td style="padding: 1rem 1.5rem; color: var(--color-text-secondary);">₵{{ number_format($f['retail'], 2) }}</td>
                                <td style="padding: 1rem 1.5rem; color: var(--color-brand-primary); font-weight: 600;">₵{{ number_format($f['agent'], 2) }}</td>
                                <td style="padding: 1rem 1.5rem; color: #10B981; font-weight: 600;">₵{{ number_format($f['api'], 2) }}</td>
                            </tr>
                        @endforeach
                    @endforelse
                </tbody>
            </table>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 2rem;">
            <div class="card" style="padding: 1.5rem;">
                <h3 style="margin-bottom: 0.5rem; font-size: 1.1rem; color: var(--color-brand-primary);">Save More as an Agent</h3>
                <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 1.25rem;">
                    Sign up as a reseller/agent to instantly enjoy lower wholesale pricing on airtime, data and utilities.
                </p>
                <a href="/register?role=agent" class="btn btn-primary btn-sm">Apply for Agent Tier</a>
            </div>
            <div class="card" style="padding: 1.5rem;">
                <h3 style="margin-bottom: 0.5rem; font-size: 1.1rem; color: #10B981;">Automate with our API</h3>
                <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 1.25rem;">
                    Integrate your app or web platform directly to our automated gateway for maximum discount and scalability.
                </p>
                <a href="/api-docs" class="btn btn-outline btn-sm">Read API Documentation</a>
            </div>
        </div>
    </section>
</x-layouts.public>
