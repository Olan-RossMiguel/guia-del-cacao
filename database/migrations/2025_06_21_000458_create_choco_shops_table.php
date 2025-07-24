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
        Schema::create('choco_shops', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

        });

        Schema::table('choco_shops', function (Blueprint $table) {
            $table->dropColumn('virtual_tour');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('choco_shops');
    }
};
