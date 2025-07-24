<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Verifica si la columna existe antes de intentar eliminarla
        if (Schema::hasColumn('choco_shops', 'virtual_tour')) {
            Schema::table('choco_shops', function (Blueprint $table) {
                // Elimina la columna
                $table->dropColumn('virtual_tour');
                
               
                
            });
        }
    }

    public function down()
    {
        Schema::table('choco_shops', function (Blueprint $table) {
            // Para revertir, recrea la columna
            $table->string('virtual_tour', 255)->nullable()->after('location');
        });
    }
};