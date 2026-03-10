<?php

namespace App\Repositories;

use App\Models\Role;

class RoleRepository
{
    public function findByName(string $name): ?Role
    {
        return Role::where('name', $name)->first();
    }

    public function findIdByName(string $name): ?int
    {
        return Role::where('name', $name)->value('id');
    }

    public function getActiveRoles()
    {
        return Role::active()->get();
    }

    public function getRoleWithUsers(Role $role): Role
    {
        return $role->load('users');
    }
}
