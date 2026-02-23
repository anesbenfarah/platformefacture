<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'super_admin',
                'display_name' => 'Super Administrateur',
                'description' => 'Accès complet à la plateforme. Peut créer des sociétés et des administrateurs.',
                'is_active' => true,
            ],
            [
                'name' => 'admin',
                'display_name' => 'Administrateur',
                'description' => 'Gère une société et ses commerciaux. Peut voir tous les devis de sa société.',
                'is_active' => true,
            ],
            [
                'name' => 'commercial',
                'display_name' => 'Commercial',
                'description' => 'Crée des devis, gère les produits/services et les clients.',
                'is_active' => true,
            ],
            [
                'name' => 'client',
                'display_name' => 'Client',
                'description' => 'Consulte ses propres devis et télécharge les PDF.',
                'is_active' => true,
            ],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['name' => $role['name']],
                $role
            );
        }

        $this->command?->info('✅ Rôles créés avec succès!');
    }
}

