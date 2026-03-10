<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository
{
    public function paginate(int $perPage)
    {
        return User::paginate($perPage);
    }

    public function findById(string $id): ?User
    {
        return User::find($id);
    }

    public function create(array $payload): User
    {
        return User::create($payload);
    }

    public function update(User $user, array $payload): User
    {
        $user->update($payload);

        return $user->fresh();
    }

    public function delete(User $user): void
    {
        $user->delete();
    }

    public function existsAdminInSociete(int $adminRoleId, ?int $societeId, ?int $exceptUserId = null): bool
    {
        if (!$societeId) {
            return false;
        }

        $query = User::where('role_id', $adminRoleId)
            ->where('societe_id', $societeId);

        if ($exceptUserId) {
            $query->where('id', '!=', $exceptUserId);
        }

        return $query->exists();
    }

    public function countBySociete(int $societeId): int
    {
        return User::where('societe_id', $societeId)->count();
    }

    public function countBySocieteAndRole(int $societeId, int $roleId): int
    {
        return User::where('societe_id', $societeId)
            ->where('role_id', $roleId)
            ->count();
    }

    public function countActiveBySocieteAndRole(int $societeId, int $roleId): int
    {
        return User::where('societe_id', $societeId)
            ->where('role_id', $roleId)
            ->where('is_active', true)
            ->count();
    }
}
