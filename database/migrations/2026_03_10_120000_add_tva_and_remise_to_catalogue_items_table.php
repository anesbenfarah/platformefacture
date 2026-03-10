<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('catalogue_items', function (Blueprint $table) {
            $table->decimal('tva', 5, 2)->default(20)->after('price');
            $table->decimal('remise', 5, 2)->default(0)->after('tva');
        });
    }

    public function down(): void
    {
        Schema::table('catalogue_items', function (Blueprint $table) {
            $table->dropColumn(['tva', 'remise']);
        });
    }
};
