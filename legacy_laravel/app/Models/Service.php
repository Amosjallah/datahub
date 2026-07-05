<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    protected $fillable = [
        'name',
        'type', // airtime, data, bill, pin, eSIM
        'network', // MTN, Telecel, AirtelTigo, ECG, GWCL, etc.
        'provider_identifier',
        'provider_adapter',
        'cost_price',
        'retail_price',
        'agent_price',
        'super_agent_price',
        'is_active',
    ];

    protected $casts = [
        'cost_price' => 'decimal:4',
        'retail_price' => 'decimal:4',
        'agent_price' => 'decimal:4',
        'super_agent_price' => 'decimal:4',
        'is_active' => 'boolean',
    ];

    public function transactionRecords(): HasMany
    {
        return $this->hasMany(TransactionRecord::class);
    }
}
