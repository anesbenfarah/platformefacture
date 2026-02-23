<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use Illuminate\Http\JsonResponse;

class PermissionController extends Controller
{
    /**
     * Liste toutes les permissions.
     */
    public function index(): JsonResponse
    {
        $permissions = Permission::query()
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $permissions,
        ]);
    }
}

