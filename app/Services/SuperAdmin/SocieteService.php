<?php

namespace App\Services\SuperAdmin;

use App\Models\Role;
use App\Models\Societe;
use App\Repositories\RoleRepository;
use App\Repositories\SuperAdmin\SocieteRepository;

class SocieteService
{
    public function __construct(
        private readonly SocieteRepository $societeRepository,
        private readonly RoleRepository $roleRepository
    ) {
    }

    public function listSocietes()
    {
        return $this->societeRepository->getAllWithAdmin();
    }

    public function createSocieteWithAdmin(array $payload): array
    {
        $adminRoleId = $this->roleRepository->findIdByName(Role::ADMIN);
        if (!$adminRoleId) {
            return [
                'success' => false,
                'status' => 422,
                'message' => "Le rôle administrateur est introuvable.",
            ];
        }

        $admin = $this->societeRepository->findAdminUserById($adminRoleId, (int) $payload['admin_id']);
        if (!$admin) {
            return [
                'success' => false,
                'status' => 422,
                'message' => "L'utilisateur sélectionné n'est pas un administrateur.",
            ];
        }

        if ($admin->societe_id !== null) {
            return [
                'success' => false,
                'status' => 422,
                'message' => "Cet administrateur est déjà assigné à une autre société.",
            ];
        }

        $societe = $this->societeRepository->create([
            'nom' => $payload['nom'],
            'email' => $payload['email'],
            'telephone' => $payload['telephone'] ?? null,
            'adresse' => $payload['adresse'] ?? null,
            'code_postal' => $payload['code_postal'] ?? null,
            'ville' => $payload['ville'] ?? null,
            'pays' => $payload['pays'] ?? 'Tunisie',
            'secteur' => $payload['secteur'] ?? null,
            'description' => $payload['description'] ?? null,
            'logo' => $payload['logo'] ?? null,
        ]);

        $this->societeRepository->updateUserSociete($admin, $societe->id);
        $this->societeRepository->loadWithRelations($societe, ['admin']);

        return [
            'success' => true,
            'status' => 201,
            'message' => 'Société créée et administrateur assigné avec succès.',
            'data' => $societe,
        ];
    }

    public function showSociete(Societe $societe): Societe
    {
        return $this->societeRepository->loadWithRelations($societe, ['admin', 'commerciaux']);
    }

    public function updateSociete(Societe $societe, array $payload): array
    {
        if (array_key_exists('admin_id', $payload)) {
            $adminRoleId = $this->roleRepository->findIdByName(Role::ADMIN);
            if (!$adminRoleId) {
                return [
                    'success' => false,
                    'status' => 422,
                    'message' => "Le rôle administrateur est introuvable.",
                ];
            }

            $newAdminId = $payload['admin_id'];
            $currentAdmin = $this->societeRepository->findCurrentSocieteAdmin($adminRoleId, $societe->id);

            if ($newAdminId) {
                $newAdmin = $this->societeRepository->findAdminUserById($adminRoleId, (int) $newAdminId);
                if (!$newAdmin) {
                    return [
                        'success' => false,
                        'status' => 422,
                        'message' => "L'utilisateur sélectionné n'est pas un administrateur.",
                    ];
                }

                if ($newAdmin->societe_id !== null && $newAdmin->societe_id !== $societe->id) {
                    return [
                        'success' => false,
                        'status' => 422,
                        'message' => "Cet administrateur est déjà assigné à une autre société.",
                    ];
                }

                if ($currentAdmin && $currentAdmin->id !== $newAdmin->id) {
                    $this->societeRepository->updateUserSociete($currentAdmin, null);
                }

                $this->societeRepository->updateUserSociete($newAdmin, $societe->id);
            } else {
                $this->societeRepository->updateUserSociete($currentAdmin, null);
            }

            unset($payload['admin_id']);
        }

        $this->societeRepository->update($societe, $payload);
        $this->societeRepository->loadWithRelations($societe, ['admin']);

        return [
            'success' => true,
            'status' => 200,
            'message' => 'Société mise à jour avec succès.',
            'data' => $societe,
        ];
    }

    public function deleteSociete(Societe $societe): void
    {
        $this->societeRepository->unassignAllUsersFromSociete($societe->id);
        $this->societeRepository->delete($societe);
    }
}
