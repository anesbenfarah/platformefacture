<?php

namespace App\Services\SuperAdmin;

use App\Models\Role;
use App\Repositories\SuperAdmin\DashboardRepository;

class DashboardService
{
    public function __construct(
        private readonly DashboardRepository $dashboardRepository
    ) {
    }

    public function getGlobalStats(): array
    {
        $roles = $this->dashboardRepository->getRolesWithUsersCount()
            ->map(function (Role $role) {
                return [
                    'name' => $role->name,
                    'display_name' => $role->display_name,
                    'users_count' => $role->users_count,
                ];
            });

        return [
            'total_users' => $this->dashboardRepository->countUsers(),
            'total_societes' => $this->dashboardRepository->countSocietes(),
            'roles' => $roles,
        ];
    }
}
