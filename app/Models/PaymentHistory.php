<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PaymentHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'shipment_id',
        'user_id',
        'payment_intent_id',
        'payment_method_id',
        'amount',
        'currency',
        'status',
        'type',
        'stripe_charge_id',
        'failure_reason',
        'metadata',
        'attempted_at',
        'completed_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'metadata' => 'array',
        'attempted_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function shipment(): BelongsTo
    {
        return $this->belongsTo(Shipment::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function createPaymentAttempt(
        int $shipmentId,
        int $userId,
        float $amount,
        ?string $paymentIntentId = null,
        string $type = 'automatic',
        array $metadata = []
    ): self {
        return self::create([
            'shipment_id' => $shipmentId,
            'user_id' => $userId,
            'payment_intent_id' => $paymentIntentId,
            'amount' => $amount,
            'status' => 'pending',
            'type' => $type,
            'metadata' => $metadata,
            'attempted_at' => now(),
        ]);
    }

    public function markAsSucceeded(?string $chargeId = null, ?string $paymentMethodId = null): void
    {
        $this->update([
            'status' => 'succeeded',
            'stripe_charge_id' => $chargeId,
            'payment_method_id' => $paymentMethodId,
            'completed_at' => now(),
        ]);
    }

    public function markAsFailed(?string $reason = null): void
    {
        $this->update([
            'status' => 'failed',
            'failure_reason' => $reason,
            'completed_at' => now(),
        ]);
    }
}
