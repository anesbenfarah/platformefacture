<?php

namespace App\Services\SuperAdmin;

use App\Models\Role;
use App\Repositories\RoleRepository;
use App\Repositories\SuperAdmin\AdminRepository;
use Illuminate\Support\Facades\Hash;

class SuperAdminService
{
    public function __construct(
        private readonly AdminRepository $adminRepository,
        private readonly RoleRepository $roleRepository
    ) {
    }

    public function listAdmins(): array
    {
        $adminRoleId = $this->roleRepository->findIdByName(Role::ADMIN);
        if (!$adminRoleId) {
            return [];
        }

        return $this->adminRepository->getAllWithSocieteByRole($adminRoleId)->all();
    }

    public function findAdmin(string $id)
    {
        $adminRoleId = $this->roleRepository->findIdByName(Role::ADMIN);
        if (!$adminRoleId) {
            return null;
        }

        return $this->adminRepository->findWithSocieteByRole($adminRoleId, $id);
    }

    public function createAdmin(array $payload): array
    {
        $adminRoleId = $this->roleRepository->findIdByName(Role::ADMIN);
        if (!$adminRoleId) {
            return [
                'success' => false,
                'status' => 422,
                'message' => 'Le rôle administrateur est introuvable.',
            ];
        }

        $societeId = $payload['societe_id'] ?? null;
        if ($societeId && $this->adminRepository->existsForSociete($adminRoleId, (int) $societeId)) {
            return [
                'success' => false,
                'status' => 422,
                'message' => 'Cette société possède déjà un administrateur.',
            ];
        }

        $admin = $this->adminRepository->create([
            'name' => $payload['name'],
            'email' => $payload['email'],
            'password' => Hash::make($payload['password']),
            'telephone' => $payload['telephone'] ?? null,
            'role_id' => $adminRoleId,
            'societe_id' => $societeId,
            'is_active' => $payload['is_active'] ?? true,
        ]);

        return [
            'success' => true,
            'status' => 201,
            'message' => 'Administrateur créé avec succès.',
            'data' => $admin->fresh(['societe']),
        ];
    }

    public function updateAdmin(string $id, array $payload): array
    {
        $adminRoleId = $this->roleRepository->findIdByName(Role::ADMIN);
        if (!$adminRoleId) {
            return [
                'success' => false,
                'status' => 422,
                'message' => 'Le rôle administrateur est introuvable.',
            ];
        }

        $admin = $this->adminRepository->findByRole($adminRoleId, $id);
        if (!$admin) {
            return [
                'success' => false,
                'status' => 404,
                'message' => 'Administrateur non trouvé.',
            ];
        }

        $newSocieteId = array_key_exists('societe_id', $payload) ? $payload['societe_id'] : $admin->societe_id;
        if (!empty($newSocieteId) && (int) $newSocieteId !== (int) $admin->societe_id) {
            if ($this->adminRepository->existsForSociete($adminRoleId, (int) $newSocieteId, (int) $admin->id)) {
                return [
                    'success' => false,
                    'status' => 422,
                    'message' => 'Cette société possède déjà un administrateur.',
                ];
            }
        }

        if (isset($payload['password'])) {
            $payload['password'] = Hash::make($payload['password']);
        }

        $updatedAdmin = $this->adminRepository->update($admin, $payload);

        return [
            'success' => true,
            'status' => 200,
            'message' => 'Administrateur mis à jour avec succès.',
            'data' => $updatedAdmin,
        ];
    }

    public function deleteAdmin(string $id, ?int $authUserId): array
    {
        $adminRoleId = $this->roleRepository->findIdByName(Role::ADMIN);
        if (!$adminRoleId) {
            return [
                'success' => false,
                'status' => 422,
                'message' => 'Le rôle administrateur est introuvable.',
            ];
        }

        $admin = $this->adminRepository->findByRole($adminRoleId, $id);
        if (!$admin) {
            return [
                'success' => false,
                'status' => 404,
                'message' => 'Administrateur non trouvé.',
            ];
        }

        if ($authUserId && $authUserId === $admin->id) {
            return [
                'success' => false,
                'status' => 403,
                'message' => 'Vous ne pouvez pas supprimer votre propre compte.',
            ];
        }

        $this->adminRepository->delete($admin);

        return [
            'success' => true,
            'status' => 200,
            'message' => 'Administrateur supprimé avec succès.',
        ];
    }
}
