<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Services\RolePermissionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RolePermissionController extends Controller
{
    public function __construct(
        private readonly RolePermissionService $rolePermissionService
    ) {
    }

    /**
     * Remplacer les permissions d'un rôle.
     */
    public function sync(Request $request, Role $role): JsonResponse
    {
        $validated = $request->validate([
            'permission_ids' => ['required', 'array'],
            'permission_ids.*' => ['integer', 'exists:permissions,id'],
        ]);

        $this->rolePermissionService->syncRolePermissions($role, $validated['permission_ids']);

        return response()->json([
            'success' => true,
            'message' => 'Permissions du rôle mises à jour.',
        ]);
    }
}

