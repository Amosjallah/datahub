<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Beneficiary extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'recipient',
        'type', // data, airtime, bill
        'network', // MTN, Telecel, AirtelTigo, etc.
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
