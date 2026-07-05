<x-layouts.public title="FAQs" description="Get answers to frequently asked questions about recharges, billing, agent reselling, API integration, and security.">
    <section class="section animate-fade-up">
        <div style="text-align: center; margin-bottom: 3.5rem;">
            <span class="section-label">Answers Hub</span>
            <h1 class="section-title" style="font-size: 2.5rem;">Frequently Asked Questions</h1>
            <p style="color: var(--color-text-muted); max-width: 550px; margin: 0.5rem auto 0;">
                Find quick answers to common support requests. If you still need help, feel free to contact us.
            </p>
        </div>

        <div style="max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem;">
            <!-- FAQ 1 -->
            <details class="card" style="padding: 0;">
                <summary style="padding: 1.25rem 1.5rem; cursor: pointer; font-weight: 600; list-style: none; display: flex; justify-content: space-between; align-items: center;">
                    What is QUICKNETDATA GH?
                </summary>
                <div class="faq-body" style="padding: 0 1.5rem 1.25rem; color: var(--color-text-muted); font-size: 0.9rem;">
                    QUICKNETDATA GH is a Ghanaian Virtual Top-Up (VTU) e-commerce platform that allows customers to buy high-speed internet data bundles, airtime, and pay electricity, water, or TV bills instantly. We also provide discount tiers for reseller agents and automated API partners.
                </div>
            </details>

            <!-- FAQ 2 -->
            <details class="card" style="padding: 0;">
                <summary style="padding: 1.25rem 1.5rem; cursor: pointer; font-weight: 600; list-style: none; display: flex; justify-content: space-between; align-items: center;">
                    How long does it take for data/airtime to deliver?
                </summary>
                <div class="faq-body" style="padding: 0 1.5rem 1.25rem; color: var(--color-text-muted); font-size: 0.9rem;">
                    Delivery is automated and near-instant. Most transactions are fulfilled and credited to the recipient's phone number within 2 to 5 seconds.
                </div>
            </details>

            <!-- FAQ 3 -->
            <details class="card" style="padding: 0;">
                <summary style="padding: 1.25rem 1.5rem; cursor: pointer; font-weight: 600; list-style: none; display: flex; justify-content: space-between; align-items: center;">
                    What payment methods do you accept?
                </summary>
                <div class="faq-body" style="padding: 0 1.5rem 1.25rem; color: var(--color-text-muted); font-size: 0.9rem;">
                    We accept MTN Mobile Money, Telecel Cash, AirtelTigo Money, and Visa/Mastercard credit or debit cards securely via Paystack.
                </div>
            </details>

            <!-- FAQ 4 -->
            <details class="card" style="padding: 0;">
                <summary style="padding: 1.25rem 1.5rem; cursor: pointer; font-weight: 600; list-style: none; display: flex; justify-content: space-between; align-items: center;">
                    What if my transaction fails or is not delivered?
                </summary>
                <div class="faq-body" style="padding: 0 1.5rem 1.25rem; color: var(--color-text-muted); font-size: 0.9rem;">
                    In the rare event that an upstream telecommunication provider fails to process your order, our ledger engine automatically triggers an immediate full refund back to your wallet. You can check your transaction list to verify this.
                </div>
            </details>

            <!-- FAQ 5 -->
            <details class="card" style="padding: 0;">
                <summary style="padding: 1.25rem 1.5rem; cursor: pointer; font-weight: 600; list-style: none; display: flex; justify-content: space-between; align-items: center;">
                    How do I get helper support?
                </summary>
                <div class="faq-body" style="padding: 0 1.5rem 1.25rem; color: var(--color-text-muted); font-size: 0.9rem;">
                    If you are logged in, you can create a support ticket directly from the app dashboard. Alternatively, you can reach out via WhatsApp or email on our contact page.
                </div>
            </details>
        </div>

        <div style="text-align: center; margin-top: 3.5rem;">
            <p style="margin-bottom: 1.25rem; color: var(--color-text-secondary);">Still have unanswered questions?</p>
            <a href="/contact" class="btn btn-primary" id="btn-faq-contact">Get in Touch</a>
        </div>
    </section>

    @push('scripts')
    <script>
        document.querySelectorAll('details').forEach(el => {
            el.addEventListener('toggle', () => {
                const summary = el.querySelector('summary');
                if (el.open) {
                    summary.style.color = 'var(--color-brand-primary)';
                } else {
                    summary.style.color = '';
                }
            });
        });
    </script>
    @endpush
</x-layouts.public>
