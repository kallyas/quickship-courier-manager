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
        Schema::create('shipment_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shipment_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained();
            $table->text('message');
            $table->boolean('is_internal')->default(false); // Staff-only notes
            $table->foreignId('parent_id')->nullable()->constrained('shipment_messages');
            $table->timestamps();
            
            $table->index(['shipment_id', 'created_at']);
            $table->index(['user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipment_messages');
    }
};
