<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('photos', function (Blueprint $table) {
            if (!Schema::hasColumn('photos', 'created_at')) {
                $table->timestamps();
            }

            if (!Schema::hasColumn('photos', 'description')) {
                $table->text('description')->nullable()->after('url');
            }

            if (!Schema::hasColumn('photos', 'uploaded_at')) {
                $table->timestamp('uploaded_at')->useCurrent()->after('description');
            }
        });
    }

    public function down(): void
    {
        Schema::table('photos', function (Blueprint $table) {
            $table->dropColumn(['created_at', 'updated_at', 'description', 'uploaded_at']);
        });
    }
};