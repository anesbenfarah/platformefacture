<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Services\RoleService;
use Illuminate\Http\JsonResponse;

class RoleController extends Controller
{
    public function __construct(
        private readonly RoleService $roleService
    ) {
    }

    /**
     * Lister tous les rôles actifs.
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->roleService->getActiveRoles(),
        ]);
    }

    /**
     * Afficher un rôle spécifique avec ses utilisateurs.
     */
    public function show(Role $role): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->roleService->getRoleWithUsers($role),
        ]);
    }
}

