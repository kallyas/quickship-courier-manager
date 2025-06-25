<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ShipmentMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'shipment_id',
        'user_id',
        'message',
        'is_internal',
        'parent_id',
    ];

    protected function casts(): array
    {
        return [
            'is_internal' => 'boolean',
        ];
    }

    public function shipment(): BelongsTo
    {
        return $this->belongsTo(Shipment::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(ShipmentMessage::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(ShipmentMessage::class, 'parent_id');
    }
}
