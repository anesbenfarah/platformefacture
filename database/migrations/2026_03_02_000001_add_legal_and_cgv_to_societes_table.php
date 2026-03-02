<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('societes')) {
            return;
        }

        Schema::table('societes', function (Blueprint $table) {
            if (!Schema::hasColumn('societes', 'legal_info')) {
                $table->text('legal_info')->nullable();
            }
            if (!Schema::hasColumn('societes', 'cgv')) {
                $table->longText('cgv')->nullable();
            }
        });
    }

    public function down(): void
    {
        if (!Schema::hasTable('societes')) {
            return;
        }

        Schema::table('societes', function (Blueprint $table) {
            if (Schema::hasColumn('societes', 'legal_info')) {
                $table->dropColumn('legal_info');
            }
            if (Schema::hasColumn('societes', 'cgv')) {
                $table->dropColumn('cgv');
            }
        });
    }
};

