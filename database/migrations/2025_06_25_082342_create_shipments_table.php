<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->uuid('tracking_id')->unique();
            $table->foreignId('sender_id')->constrained('users');
            
            // Recipient information
            $table->string('recipient_name');
            $table->string('recipient_phone');
            $table->string('recipient_email')->nullable();
            $table->text('recipient_address');
            
            // Origin and destination
            $table->foreignId('origin_location_id')->constrained('locations');
            $table->foreignId('destination_location_id')->constrained('locations');
            
            // Package details
            $table->string('description');
            $table->decimal('weight', 8, 2); // kg
            $table->string('dimensions')->nullable(); // LxWxH format
            $table->decimal('declared_value', 10, 2)->nullable();
            
            // Service details
            $table->enum('service_type', ['standard', 'express', 'overnight']);
            $table->enum('status', [
                'pending', 'picked_up', 'in_transit', 'out_for_delivery', 
                'delivered', 'cancelled', 'returned'
            ])->default('pending');
            
            // Pricing
            $table->decimal('price', 10, 2);
            $table->enum('payment_status', ['pending', 'paid', 'refunded'])->default('pending');
            
            // Timestamps
            $table->timestamp('pickup_date')->nullable();
            $table->timestamp('delivery_date')->nullable();
            $table->timestamp('estimated_delivery')->nullable();
            
            $table->text('notes')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index(['tracking_id']);
            $table->index(['sender_id']);
            $table->index(['status']);
            $table->index(['created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
