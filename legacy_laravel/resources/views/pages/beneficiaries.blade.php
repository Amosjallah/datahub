<x-layouts.app title="Beneficiaries">

<div>
    <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.75rem;">
        <div>
            <h1 style="font-size:1.4rem;font-weight:700;margin-bottom:0.2rem;">👥 Saved Beneficiaries</h1>
            <p style="color:var(--color-text-muted);font-size:0.875rem;">Save frequently used numbers for fast top-ups.</p>
        </div>
        <button type="button" class="btn btn-primary btn-sm" onclick="document.getElementById('add-form').style.display='block'" id="btn-add-beneficiary">
            + Add Beneficiary
        </button>
    </div>

    {{-- Add Form --}}
    <div class="card animate-fade-up" id="add-form" style="display:none;max-width:480px;margin-bottom:1.5rem;">
        <div class="card-body">
            <h3 style="font-size:0.875rem;font-weight:700;margin-bottom:1.25rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--color-text-muted);">Add New Beneficiary</h3>
            <form action="/beneficiaries" method="POST" id="beneficiary-form">
                @csrf
                <div class="form-group">
                    <label class="form-label" for="ben-name">Nickname</label>
                    <input type="text" id="ben-name" name="name" class="form-input" placeholder="e.g. Mum, Dad, Office" required>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                    <div class="form-group">
                        <label class="form-label" for="ben-phone">Phone Number</label>
                        <input type="tel" id="ben-phone" name="phone" class="form-input" placeholder="0244123456" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="ben-network">Network</label>
                        <select id="ben-network" name="network" class="form-select">
                            <option value="MTN">MTN</option>
                            <option value="Telecel">Telecel</option>
                            <option value="AirtelTigo">AirtelTigo</option>
                        </select>
                    </div>
                </div>
                <div style="display:flex;gap:0.75rem;">
                    <button type="submit" class="btn btn-primary btn-sm" id="btn-save-ben">Save</button>
                    <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('add-form').style.display='none'" id="btn-cancel-ben">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    {{-- Beneficiary List --}}
    @php $beneficiaries = auth()->user()->beneficiaries()->get(); @endphp

    @if($beneficiaries->isNotEmpty())
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:0.875rem;">
            @foreach($beneficiaries as $ben)
                <div class="card" style="padding:1.25rem;">
                    <div style="display:flex;align-items:center;gap:0.875rem;margin-bottom:1rem;">
                        <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--color-brand-primary),var(--color-brand-secondary));display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;font-size:1rem;">
                            {{ strtoupper(substr($ben->name, 0, 1)) }}
                        </div>
                        <div>
                            <div style="font-weight:700;font-size:0.875rem;">{{ $ben->name }}</div>
                            <div style="font-size:0.72rem;color:var(--color-text-muted);">{{ $ben->network }}</div>
                        </div>
                    </div>
                    <div style="font-family:monospace;font-size:0.9rem;color:var(--color-text-secondary);margin-bottom:1rem;">{{ $ben->phone }}</div>
                    <div style="display:flex;gap:0.5rem;">
                        <a href="{{ route('vtu.data') }}?phone={{ $ben->phone }}&network={{ $ben->network }}"
                            class="btn btn-primary btn-sm" style="flex:1;justify-content:center;" id="ben-data-{{ $ben->id }}">Data</a>
                        <a href="{{ route('vtu.airtime') }}?phone={{ $ben->phone }}&network={{ $ben->network }}"
                            class="btn btn-secondary btn-sm" style="flex:1;justify-content:center;" id="ben-airtime-{{ $ben->id }}">Airtime</a>
                    </div>
                </div>
            @endforeach
        </div>
    @else
        <div class="card">
            <div class="card-body" style="text-align:center;padding:3rem 1rem;">
                <div style="font-size:3rem;margin-bottom:1rem;opacity:0.35;">👤</div>
                <p style="color:var(--color-text-muted);margin-bottom:1.25rem;">No saved beneficiaries yet.</p>
                <button type="button" class="btn btn-primary btn-sm" onclick="document.getElementById('add-form').style.display='block';document.getElementById('add-form').scrollIntoView({behavior:'smooth'})" id="btn-add-first-ben">
                    Add Your First Beneficiary
                </button>
            </div>
        </div>
    @endif
</div>

</x-layouts.app>
