<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\JsonResponse;

class RoleController extends Controller
{
    /**
     * Lister tous les rôles actifs.
     */
    public function index(): JsonResponse
    {
        $roles = Role::active()->get();

        return response()->json([
            'success' => true,
            'data' => $roles,
        ]);
    }

    /**
     * Afficher un rôle spécifique avec ses utilisateurs.
     */
    public function show(Role $role): JsonResponse
    {
        $role->load('users');

        return response()->json([
            'success' => true,
            'data' => $role,
        ]);
    }
}

