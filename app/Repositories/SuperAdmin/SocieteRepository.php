<?php

namespace App\Repositories\SuperAdmin;

use App\Models\Role;
use App\Models\Societe;
use App\Models\User;

class SocieteRepository
{
    public function getAllWithAdmin()
    {
        return Societe::with('admin')->get();
    }

    public function create(array $payload): Societe
    {
        return Societe::create($payload);
    }

    public function loadWithRelations(Societe $societe, array $relations): Societe
    {
        return $societe->load($relations);
    }

    public function update(Societe $societe, array $payload): Societe
    {
        $societe->update($payload);

        return $societe->fresh();
    }

    public function delete(Societe $societe): void
    {
        $societe->delete();
    }

    public function findAdminUserById(int $adminRoleId, int $userId): ?User
    {
        return User::where('id', $userId)
            ->where('role_id', $adminRoleId)
            ->first();
    }

    public function findCurrentSocieteAdmin(int $adminRoleId, int $societeId): ?User
    {
        return User::where('role_id', $adminRoleId)
            ->where('societe_id', $societeId)
            ->first();
    }

    public function updateUserSociete(?User $user, ?int $societeId): void
    {
        if ($user) {
            $user->update(['societe_id' => $societeId]);
        }
    }

    public function unassignAllUsersFromSociete(int $societeId): void
    {
        User::where('societe_id', $societeId)->update(['societe_id' => null]);
    }
}
