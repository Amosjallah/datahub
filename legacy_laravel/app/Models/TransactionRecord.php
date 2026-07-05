<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransactionRecord extends Model
{
    protected $fillable = [
        'user_id',
        'service_id',
        'wallet_transaction_id',
        'recipient',
        'amount',
        'status', // pending, processing, success, failed, reversed
        'provider_reference',
        'error_message',
    ];

    protected $casts = [
        'amount' => 'decimal:4',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function walletTransaction(): BelongsTo
    {
        return $this->belongsTo(WalletTransaction::class);
    }
}
