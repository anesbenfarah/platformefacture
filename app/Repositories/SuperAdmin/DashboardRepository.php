<?php

namespace App\Repositories\SuperAdmin;

use App\Models\Role;
use App\Models\Societe;
use App\Models\User;

class DashboardRepository
{
    public function countUsers(): int
    {
        return User::count();
    }

    public function countSocietes(): int
    {
        return Societe::count();
    }

    public function getRolesWithUsersCount()
    {
        return Role::withCount('users')->get();
    }
}
