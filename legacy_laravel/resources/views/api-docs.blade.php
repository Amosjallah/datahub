<x-layouts.public title="API Documentation" description="Integrate QUICKNETDATA GH's automated VTU gateway. Complete API docs for recharges, querying balances, and tracking transactions.">
    <section class="section animate-fade-up">
        <div style="text-align: center; margin-bottom: 3.5rem;">
            <span class="section-label">Developer Portal</span>
            <h1 class="section-title" style="font-size: 2.5rem;">Automate with our REST API</h1>
            <p style="color: var(--color-text-muted); max-width: 550px; margin: 0.5rem auto 0;">
                Connect your website or mobile application to our high-performance VTU rails.
            </p>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; align-items: start;">
            <!-- Left content: documentation details -->
            <div>
                <h2 style="font-size: 1.4rem; margin-bottom: 1rem;">Authentication</h2>
                <p style="font-size: 0.95rem; margin-bottom: 1.5rem;">
                    Authenticate your API requests by including your Secret Key as a bearer token in the headers of your HTTP requests. You can generate your Secret API Key in the settings section of your developer dashboard.
                </p>
                <div class="card" style="padding: 1rem; background: #070D1A; font-family: monospace; font-size: 0.85rem; border-color: rgba(59, 130, 246, 0.2); margin-bottom: 2rem;">
                    <span style="color: #64748B;">Authorization: Bearer qnd_sec_live_...</span>
                </div>

                <h2 style="font-size: 1.4rem; margin-bottom: 1rem;">1. Check Wallet Balance</h2>
                <p style="font-size: 0.95rem; margin-bottom: 1rem;">
                    Retrieve the available cash balance of your reseller account.
                </p>
                <div class="card" style="padding: 1rem; background: #070D1A; font-family: monospace; font-size: 0.85rem; border-color: rgba(59, 130, 246, 0.2); margin-bottom: 2rem;">
                    <span style="color: #10B981;">GET</span> /api/v1/wallet/balance
                </div>

                <h2 style="font-size: 1.4rem; margin-bottom: 1rem;">2. Purchase Data Bundle / Airtime</h2>
                <p style="font-size: 0.95rem; margin-bottom: 1rem;">
                    Initiate a VTU top-up transaction.
                </p>
                <div class="card" style="padding: 1rem; background: #070D1A; font-family: monospace; font-size: 0.85rem; border-color: rgba(59, 130, 246, 0.2); margin-bottom: 1rem;">
                    <span style="color: #3B82F6;">POST</span> /api/v1/transaction/purchase
                </div>
                <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 1.5rem;">
                    Required parameters: `service_id` (integer), `recipient` (string), and `request_id` (unique string for idempotency).
                </p>

                <h2 style="font-size: 1.4rem; margin-bottom: 1rem;">3. Query Transaction Status</h2>
                <p style="font-size: 0.95rem; margin-bottom: 1rem;">
                    Retrieve status of a transaction using your local request identifier or provider reference.
                </p>
                <div class="card" style="padding: 1rem; background: #070D1A; font-family: monospace; font-size: 0.85rem; border-color: rgba(59, 130, 246, 0.2); margin-bottom: 2rem;">
                    <span style="color: #10B981;">GET</span> /api/v1/transaction/status/{request_id}
                </div>
            </div>

            <!-- Right content: quick stats and request keys -->
            <div style="display: flex; flex-direction: column; gap: 1.25rem;">
                <div class="card" style="padding: 1.25rem;">
                    <h3 style="font-size: 1rem; margin-bottom: 0.75rem;">API Details</h3>
                    <div style="font-size: 0.85rem; display: flex; flex-direction: column; gap: 0.5rem;">
                        <div style="display:flex; justify-content:space-between;">
                            <span style="color: var(--color-text-muted);">Format:</span>
                            <span style="font-weight:600;">JSON</span>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span style="color: var(--color-text-muted);">Base URL:</span>
                            <span style="font-weight:600; font-family: monospace;">https://api.quicknetdata.gh</span>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span style="color: var(--color-text-muted);">Rate Limit:</span>
                            <span style="font-weight:600;">60 req / min</span>
                        </div>
                    </div>
                </div>

                <div class="card" style="padding: 1.25rem; background: var(--color-brand-subtle); border-color: var(--color-brand-muted);">
                    <h3 style="font-size: 1rem; margin-bottom: 0.5rem; color: var(--color-brand-primary);">Looking for SDKs?</h3>
                    <p style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 1rem;">
                        We support PHP, Node.js, and Python integration wrappers out of the box.
                    </p>
                    <a href="/contact" class="btn btn-primary btn-sm btn-full">Request SDK Access</a>
                </div>
            </div>
        </div>
    </section>
</x-layouts.public>
