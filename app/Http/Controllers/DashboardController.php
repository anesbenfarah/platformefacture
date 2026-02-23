<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Societe;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * Statistiques globales de la plateforme (réservé au Super Admin).
     */
    public function stats(): JsonResponse
    {
        $totalUsers = User::count();
        $totalSocietes = Societe::count();

        $roles = Role::withCount('users')->get()->map(function (Role $role) {
            return [
                'name' => $role->name,
                'display_name' => $role->display_name,
                'users_count' => $role->users_count,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => $totalUsers,
                'total_societes' => $totalSocietes,
                'roles' => $roles,
            ],
        ]);
    }
}

