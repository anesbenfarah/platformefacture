<?php

namespace App\Services;

use App\Models\Role;
use App\Repositories\RoleRepository;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly RoleRepository $roleRepository
    ) {
    }

    public function paginateUsers(int $perPage)
    {
        return $this->userRepository->paginate($perPage);
    }

    public function findUser(string $id)
    {
        return $this->userRepository->findById($id);
    }

    public function createUser(array $payload): array
    {
        $adminRoleId = $this->roleRepository->findIdByName(Role::ADMIN);
        if ($adminRoleId
            && (int) $payload['role_id'] === (int) $adminRoleId
            && !empty($payload['societe_id'])
            && $this->userRepository->existsAdminInSociete($adminRoleId, (int) $payload['societe_id'])
        ) {
            return [
                'success' => false,
                'status' => 422,
                'message' => 'Cette société possède déjà un administrateur.',
            ];
        }

        $user = $this->userRepository->create([
            'name' => $payload['name'],
            'email' => $payload['email'],
            'password' => Hash::make($payload['password']),
            'telephone' => $payload['telephone'] ?? null,
            'role_id' => $payload['role_id'],
            'societe_id' => $payload['societe_id'] ?? null,
            'is_active' => $payload['is_active'] ?? true,
        ]);

        return [
            'success' => true,
            'status' => 201,
            'message' => 'Utilisateur créé avec succès',
            'data' => $user,
        ];
    }

    public function updateUser(string $id, array $payload): array
    {
        $user = $this->userRepository->findById($id);
        if (!$user) {
            return [
                'success' => false,
                'status' => 404,
                'message' => 'Utilisateur non trouvé',
            ];
        }

        $adminRoleId = $this->roleRepository->findIdByName(Role::ADMIN);
        $newRoleId = array_key_exists('role_id', $payload) ? (int) $payload['role_id'] : (int) $user->role_id;
        $newSocieteId = array_key_exists('societe_id', $payload) ? $payload['societe_id'] : $user->societe_id;

        if ($adminRoleId
            && $newRoleId === (int) $adminRoleId
            && !empty($newSocieteId)
            && $this->userRepository->existsAdminInSociete($adminRoleId, (int) $newSocieteId, (int) $user->id)
        ) {
            return [
                'success' => false,
                'status' => 422,
                'message' => 'Cette société possède déjà un administrateur.',
            ];
        }

        if (isset($payload['password'])) {
            $payload['password'] = Hash::make($payload['password']);
        }

        $updatedUser = $this->userRepository->update($user, $payload);

        return [
            'success' => true,
            'status' => 200,
            'message' => 'Utilisateur mis à jour avec succès',
            'data' => $updatedUser,
        ];
    }

    public function deleteUser(string $id, ?int $authUserId): array
    {
        $user = $this->userRepository->findById($id);
        if (!$user) {
            return [
                'success' => false,
                'status' => 404,
                'message' => 'Utilisateur non trouvé',
            ];
        }

        if ($authUserId && $authUserId === $user->id) {
            return [
                'success' => false,
                'status' => 403,
                'message' => 'Vous ne pouvez pas supprimer votre propre compte',
            ];
        }

        $this->userRepository->delete($user);

        return [
            'success' => true,
            'status' => 200,
            'message' => 'Utilisateur supprimé avec succès',
        ];
    }
}
