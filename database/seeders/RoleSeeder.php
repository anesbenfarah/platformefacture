<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

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

        // Permissions fonctionnelles du Super Admin
        $permissions = [
            [
                'name' => 'manage_societes',
                'display_name' => 'Gérer les sociétés',
                'description' => 'Créer, modifier et supprimer les sociétés de la plateforme.',
            ],
            [
                'name' => 'manage_admin_accounts',
                'display_name' => 'Gérer les comptes Admin',
                'description' => 'Créer, modifier et désactiver les comptes administrateurs des sociétés.',
            ],
            [
                'name' => 'manage_roles_permissions',
                'display_name' => 'Gérer les rôles et permissions',
                'description' => 'Gérer la configuration des rôles et de leurs permissions.',
            ],
            [
                'name' => 'view_global_stats',
                'display_name' => 'Consulter les statistiques globales',
                'description' => 'Voir les statistiques globales de la plateforme.',
            ],
            [
                'name' => 'manage_system_settings',
                'display_name' => 'Configurer les paramètres système',
                'description' => 'Configurer les paramètres généraux du système.',
            ],
            [
                'name' => 'manage_global_quote_templates',
                'display_name' => 'Gérer les templates de devis globaux',
                'description' => 'Gérer les modèles de devis globaux utilisés par les sociétés.',
            ],
        ];

        $permissionIds = [];
        foreach ($permissions as $permission) {
            $permissionModel = Permission::updateOrCreate(
                ['name' => $permission['name']],
                $permission
            );
            $permissionIds[] = $permissionModel->id;
        }

        // Attacher toutes les permissions au rôle super_admin
        $superAdminRole = Role::where('name', Role::SUPER_ADMIN)->first();
        if ($superAdminRole) {
            $superAdminRole->permissions()->syncWithoutDetaching($permissionIds);
        }

        $this->command?->info('✅ Rôles et permissions créés avec succès!');
    }
}

