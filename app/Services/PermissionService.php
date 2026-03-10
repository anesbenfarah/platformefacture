<?php

namespace App\Services;

use App\Repositories\PermissionRepository;

class PermissionService
{
    public function __construct(
        private readonly PermissionRepository $permissionRepository
    ) {
    }

    public function getAllPermissions()
    {
        return $this->permissionRepository->getAllOrdered();
    }
}
