<?php

namespace App\Repositories\SuperAdmin;

use App\Models\User;

class AdminRepository
{
    public function getAllWithSocieteByRole(int $adminRoleId)
    {
        return User::with('societe')
            ->where('role_id', $adminRoleId)
            ->get();
    }

    public function findWithSocieteByRole(int $adminRoleId, string $id): ?User
    {
        return User::with('societe')
            ->where('role_id', $adminRoleId)
            ->find($id);
    }

    public function findByRole(int $adminRoleId, string $id): ?User
    {
        return User::where('role_id', $adminRoleId)->find($id);
    }

    public function create(array $payload): User
    {
        return User::create($payload);
    }

    public function update(User $admin, array $payload): User
    {
        $admin->update($payload);

        return $admin->fresh(['societe']);
    }

    public function delete(User $admin): void
    {
        $admin->delete();
    }

    public function existsForSociete(int $adminRoleId, ?int $societeId, ?int $exceptUserId = null): bool
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
}
