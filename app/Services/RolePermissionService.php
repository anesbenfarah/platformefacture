<?php

namespace App\Services;

use App\Models\Role;
use App\Repositories\PermissionRepository;

class RolePermissionService
{
    public function __construct(
        private readonly PermissionRepository $permissionRepository
    ) {
    }

    public function syncRolePermissions(Role $role, array $permissionIds): void
    {
        $this->permissionRepository->syncRolePermissions($role, $permissionIds);
    }
}
