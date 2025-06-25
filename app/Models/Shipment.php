<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Shipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'sender_id',
        'recipient_name',
        'recipient_phone',
        'recipient_email',
        'recipient_address',
        'origin_location_id',
        'destination_location_id',
        'description',
        'weight',
        'dimensions',
        'declared_value',
        'service_type',
        'status',
        'price',
        'payment_status',
        'pickup_date',
        'delivery_date',
        'estimated_delivery',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'weight' => 'decimal:2',
            'declared_value' => 'decimal:2',
            'price' => 'decimal:2',
            'pickup_date' => 'datetime',
            'delivery_date' => 'datetime',
            'estimated_delivery' => 'datetime',
        ];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($shipment) {
            if (!$shipment->tracking_id) {
                $shipment->tracking_id = Str::uuid();
            }
        });
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function originLocation(): BelongsTo
    {
        return $this->belongsTo(Location::class, 'origin_location_id');
    }

    public function destinationLocation(): BelongsTo
    {
        return $this->belongsTo(Location::class, 'destination_location_id');
    }

    public function history(): HasMany
    {
        return $this->hasMany(ShipmentHistory::class)->orderBy('created_at', 'desc');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ShipmentMessage::class)->orderBy('created_at', 'desc');
    }

    public function files(): HasMany
    {
        return $this->hasMany(ShipmentFile::class);
    }

    public function updateStatus(string $status, ?string $location = null, ?string $notes = null, ?int $updatedBy = null): void
    {
        $this->update(['status' => $status]);

        $this->history()->create([
            'status' => $status,
            'location' => $location,
            'notes' => $notes,
            'updated_by' => $updatedBy,
        ]);
    }

    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'pending' => 'Pending Pickup',
            'picked_up' => 'Picked Up',
            'in_transit' => 'In Transit',
            'out_for_delivery' => 'Out for Delivery',
            'delivered' => 'Delivered',
            'cancelled' => 'Cancelled',
            'returned' => 'Returned',
            default => ucfirst(str_replace('_', ' ', $this->status)),
        };
    }
}
