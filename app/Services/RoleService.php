<?php

namespace App\Services;

use App\Models\Role;
use App\Repositories\RoleRepository;

class RoleService
{
    public function __construct(
        private readonly RoleRepository $roleRepository
    ) {
    }

    public function getActiveRoles()
    {
        return $this->roleRepository->getActiveRoles();
    }

    public function getRoleWithUsers(Role $role): Role
    {
        return $this->roleRepository->getRoleWithUsers($role);
    }
}
