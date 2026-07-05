<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WalletTransaction extends Model
{
    protected $fillable = [
        'wallet_id',
        'amount',
        'type', // funding, purchase, refund, commission, referral_bonus, manual_adjustment
        'reference',
        'description',
    ];

    protected $casts = [
        'amount' => 'decimal:4',
    ];

    public function wallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class);
    }
}
