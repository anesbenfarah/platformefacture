<?php

namespace App\Repositories\Admin;

use App\Models\User;

class CommercialRepository
{
    public function getBySocieteAndRole(int $societeId, int $roleId)
    {
        return User::query()
            ->where('societe_id', $societeId)
            ->where('role_id', $roleId)
            ->orderBy('name')
            ->get();
    }

    public function create(array $payload): User
    {
        return User::create($payload);
    }

    public function findInSocieteByRole(string $commercialId, int $societeId, int $roleId): ?User
    {
        return User::query()
            ->where('id', $commercialId)
            ->where('societe_id', $societeId)
            ->where('role_id', $roleId)
            ->first();
    }

    public function update(User $commercial, array $payload): User
    {
        $commercial->update($payload);

        return $commercial->fresh();
    }
}
