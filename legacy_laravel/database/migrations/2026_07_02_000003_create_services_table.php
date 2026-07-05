<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g. MTN Airtime, Telecel 1GB Data
            $table->string('type'); // airtime, data, bill, pin, eSIM
            $table->string('network'); // MTN, Telecel, AirtelTigo, ECG, GWCL, DSTV, etc.
            $table->string('provider_identifier'); // identification code for provider
            $table->string('provider_adapter'); // name of provider adapter class
            $table->decimal('cost_price', 15, 4);
            $table->decimal('retail_price', 15, 4);
            $table->decimal('agent_price', 15, 4);
            $table->decimal('super_agent_price', 15, 4)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
