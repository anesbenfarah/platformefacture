<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $superAdminRole = Role::where('name', 'super_admin')->first();

        if (! $superAdminRole) {
            $this->command?->error('❌ Le rôle super_admin n\'existe pas. Exécutez d\'abord RoleSeeder.');
            return;
        }

        User::updateOrCreate(
            ['email' => 'superadmin@devis-platform.com'],
            [
                'name' => 'Super Administrateur',
                'password' => Hash::make('SuperAdmin@2024'),
                'role_id' => $superAdminRole->id,
                'societe_id' => null,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        $this->command?->info('✅ Super Admin créé avec succès!');
        $this->command?->info('📧 Email: superadmin@devis-platform.com');
        $this->command?->info('🔑 Password: SuperAdmin@2024');
    }
}

