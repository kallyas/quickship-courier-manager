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
        Schema::create('shipment_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shipment_id')->constrained()->onDelete('cascade');
            $table->enum('status', [
                'pending', 'picked_up', 'in_transit', 'out_for_delivery', 
                'delivered', 'cancelled', 'returned'
            ]);
            $table->string('location')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->timestamps();
            
            $table->index(['shipment_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipment_history');
    }
};
