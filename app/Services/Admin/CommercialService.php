<?php

namespace App\Services\Admin;

use App\Models\Role;
use App\Models\User;
use App\Repositories\Admin\CommercialRepository;
use App\Repositories\RoleRepository;
use Illuminate\Support\Facades\Hash;

class CommercialService
{
    public function __construct(
        private readonly CommercialRepository $commercialRepository,
        private readonly RoleRepository $roleRepository
    ) {
    }

    public function getCommercialRoleId(): ?int
    {
        return $this->roleRepository->findIdByName(Role::COMMERCIAL);
    }

    public function listBySociete(int $societeId)
    {
        $commercialRoleId = $this->getCommercialRoleId();
        if (!$commercialRoleId) {
            return collect();
        }

        return $this->commercialRepository->getBySocieteAndRole($societeId, $commercialRoleId);
    }

    public function createForSociete(int $societeId, array $payload): User
    {
        $commercialRoleId = $this->getCommercialRoleId();
        if (!$commercialRoleId) {
            throw new \RuntimeException('Rôle commercial introuvable.');
        }

        return $this->commercialRepository->create([
            'name' => $payload['name'],
            'email' => $payload['email'],
            'password' => Hash::make($payload['password']),
            'telephone' => $payload['telephone'] ?? null,
            'role_id' => $commercialRoleId,
            'societe_id' => $societeId,
            'is_active' => $payload['is_active'] ?? true,
        ]);
    }

    public function findCommercialInSociete(string $commercialId, int $societeId): ?User
    {
        $commercialRoleId = $this->getCommercialRoleId();
        if (!$commercialRoleId) {
            return null;
        }

        return $this->commercialRepository->findInSocieteByRole($commercialId, $societeId, $commercialRoleId);
    }

    public function updateCommercial(User $commercial, array $payload): User
    {
        if (isset($payload['password'])) {
            $payload['password'] = Hash::make($payload['password']);
        }

        return $this->commercialRepository->update($commercial, $payload);
    }

    public function disableCommercial(User $commercial): User
    {
        return $this->commercialRepository->update($commercial, ['is_active' => false]);
    }
}
