<?php

namespace App\Repositories\Commercial;

use App\Models\Role;
use App\Models\User;
use App\Repositories\RoleRepository;
use Illuminate\Support\Collection;

class ClientRepository
{
    public function __construct(
        private readonly RoleRepository $roleRepository
    ) {
    }

    public function getClientsBySociete(int $societeId): Collection
    {
        $clientRoleId = $this->roleRepository->findIdByName(Role::CLIENT);
        if (!$clientRoleId) {
            return collect();
        }

        return User::query()
            ->where('societe_id', $societeId)
            ->where('role_id', $clientRoleId)
            ->orderBy('name')
            ->get();
    }
}
