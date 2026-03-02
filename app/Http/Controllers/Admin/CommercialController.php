<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class CommercialController extends Controller
{
    /**
     * Lister les commerciaux de la société de l'admin.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->societe_id) {
            return response()->json([
                'success' => false,
                'message' => 'Aucune société associée à ce compte admin.',
            ], 422);
        }

        $commercialRoleId = Role::where('name', Role::COMMERCIAL)->value('id');
        if (!$commercialRoleId) {
            return response()->json([
                'success' => true,
                'data' => [],
            ]);
        }

        $commerciaux = User::query()
            ->where('societe_id', $user->societe_id)
            ->where('role_id', $commercialRoleId)
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $commerciaux,
        ]);
    }

    /**
     * Créer un compte Commercial dans la société de l'admin.
     */
    public function store(Request $request): JsonResponse
    {
        $admin = $request->user();

        if (!$admin->societe_id) {
            return response()->json([
                'success' => false,
                'message' => 'Aucune société associée à ce compte admin.',
            ], 422);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'telephone' => ['nullable', 'string', 'max:30'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $commercialRole = Role::where('name', Role::COMMERCIAL)->firstOrFail();

        $commercial = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'telephone' => $validated['telephone'] ?? null,
            'role_id' => $commercialRole->id,
            'societe_id' => $admin->societe_id,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Commercial créé avec succès.',
            'data' => $commercial,
        ], 201);
    }

    /**
     * Mettre à jour un Commercial de la société.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $admin = $request->user();

        if (!$admin->societe_id) {
            return response()->json([
                'success' => false,
                'message' => 'Aucune société associée à ce compte admin.',
            ], 422);
        }

        $commercialRoleId = Role::where('name', Role::COMMERCIAL)->value('id');
        if (!$commercialRoleId) {
            return response()->json([
                'success' => false,
                'message' => 'Rôle commercial introuvable.',
            ], 422);
        }

        $commercial = User::query()
            ->where('id', $id)
            ->where('societe_id', $admin->societe_id)
            ->where('role_id', $commercialRoleId)
            ->first();

        if (!$commercial) {
            return response()->json([
                'success' => false,
                'message' => 'Commercial introuvable.',
            ], 404);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users')->ignore($commercial->id)],
            'password' => ['sometimes', 'string', 'min:8'],
            'telephone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $commercial->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Commercial mis à jour avec succès.',
            'data' => $commercial->fresh(),
        ]);
    }

    /**
     * Désactiver un Commercial de la société.
     */
    public function disable(Request $request, string $id): JsonResponse
    {
        $admin = $request->user();

        if (!$admin->societe_id) {
            return response()->json([
                'success' => false,
                'message' => 'Aucune société associée à ce compte admin.',
            ], 422);
        }

        $commercialRoleId = Role::where('name', Role::COMMERCIAL)->value('id');
        if (!$commercialRoleId) {
            return response()->json([
                'success' => false,
                'message' => 'Rôle commercial introuvable.',
            ], 422);
        }

        $commercial = User::query()
            ->where('id', $id)
            ->where('societe_id', $admin->societe_id)
            ->where('role_id', $commercialRoleId)
            ->first();

        if (!$commercial) {
            return response()->json([
                'success' => false,
                'message' => 'Commercial introuvable.',
            ], 404);
        }

        $commercial->update(['is_active' => false]);

        return response()->json([
            'success' => true,
            'message' => 'Compte commercial désactivé.',
            'data' => $commercial->fresh(),
        ]);
    }
}
