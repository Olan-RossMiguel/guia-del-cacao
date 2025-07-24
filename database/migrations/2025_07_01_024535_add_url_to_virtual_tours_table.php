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
        Schema::table('virtual_tours', function (Blueprint $table) {
            $table->string('url', 512)->nullable()->after('embed_code');
        });

        // Extraer URLs existentes (ejecución diferida para producción)
        if (app()->environment('local')) {
            DB::statement("
                UPDATE virtual_tours 
                SET url = REGEXP_SUBSTR(embed_code, 'src=\"([^\"]*)\"', 1, 1, '', 1)
                WHERE embed_code LIKE '%<iframe%'
            ");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('virtual_tours', function (Blueprint $table) {
            //
        });
    }
};
