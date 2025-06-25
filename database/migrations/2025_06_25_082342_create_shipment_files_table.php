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
        Schema::create('shipment_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shipment_id')->constrained()->onDelete('cascade');
            $table->string('filename');
            $table->string('original_name');
            $table->string('file_path');
            $table->string('mime_type');
            $table->bigInteger('file_size'); // bytes
            $table->enum('file_type', ['receipt', 'photo', 'document', 'proof_of_delivery']);
            $table->foreignId('uploaded_by')->constrained('users');
            $table->timestamps();
            
            $table->index(['shipment_id', 'file_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipment_files');
    }
};
