<x-layouts.public title="Contact Us" description="Reach out to QUICKNETDATA GH. Settle payment inquiries, report transaction issues, or contact our support team.">
    <section class="section animate-fade-up">
        <div style="text-align: center; margin-bottom: 3.5rem;">
            <span class="section-label">Support Channels</span>
            <h1 class="section-title" style="font-size: 2.5rem;">Get in Touch with Us</h1>
            <p style="color: var(--color-text-muted); max-width: 550px; margin: 0.5rem auto 0;">
                Have questions or need support? Drop us a message or contact us directly.
            </p>
        </div>

        @if(session('success'))
            <div class="alert alert-success" style="max-width: 800px; margin: 0 auto 1.5rem;">
                {{ session('success') }}
            </div>
        @endif

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; max-width: 900px; margin: 0 auto; align-items: start;">
            <!-- Left side: Contact form -->
            <div class="card">
                <div class="card-body">
                    <h3 style="margin-bottom: 1.25rem; font-size: 1.1rem;">Send a Message</h3>
                    <form action="/contact" method="POST" id="contact-public-form">
                        @csrf
                        <div class="form-group">
                            <label class="form-label" for="contact-name">Your Name</label>
                            <input type="text" id="contact-name" name="name" class="form-input" placeholder="Kwame Mensah" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="contact-email">Email Address</label>
                            <input type="email" id="contact-email" name="email" class="form-input" placeholder="kwame@example.com" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="contact-msg">Message</label>
                            <textarea id="contact-msg" name="message" class="form-textarea" rows="4" placeholder="How can we help you?" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary btn-full" id="btn-submit-contact-public">⚡ Send Inquiry</button>
                    </form>
                </div>
            </div>

            <!-- Right side: contact details -->
            <div style="display: flex; flex-direction: column; gap: 1.25rem;">
                <div class="card" style="padding: 1.25rem;">
                    <h3 style="font-size: 1rem; margin-bottom: 0.75rem;">Support Channels</h3>
                    <div style="font-size: 0.9rem; display: flex; flex-direction: column; gap: 1rem;">
                        <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
                            <div style="font-size: 1.25rem;">📱</div>
                            <div>
                                <div style="font-weight: 600; color: var(--color-text-primary);">WhatsApp Chat</div>
                                <a href="https://wa.me/233244123456" target="_blank" rel="noopener" style="font-size: 0.85rem; color: #10B981;">Chat Now (+233 244 123 456)</a>
                            </div>
                        </div>
                        <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
                            <div style="font-size: 1.25rem;">✉️</div>
                            <div>
                                <div style="font-weight: 600; color: var(--color-text-primary);">Email Support</div>
                                <a href="mailto:support@quicknetdata.gh" style="font-size: 0.85rem; color: var(--color-brand-primary);">support@quicknetdata.gh</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card" style="padding: 1.25rem;">
                    <h3 style="font-size: 1rem; margin-bottom: 0.5rem;">Office Address</h3>
                    <p style="font-size: 0.85rem; color: var(--color-text-muted); line-height: 1.5;">
                        QUICKNETDATA GH LTD.<br>
                        Spintex Road, Block B4<br>
                        Accra, Ghana
                    </p>
                </div>
            </div>
        </div>
    </section>
</x-layouts.public>
