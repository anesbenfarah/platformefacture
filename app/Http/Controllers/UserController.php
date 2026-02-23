<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Liste tous les utilisateurs avec pagination
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->query('per_page', 15);
        $users = User::paginate($perPage);

        return response()->json($users, 200);
    }

    /**
     * Affiche un utilisateur spécifique
     */
    public function show(string $id): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }

        return response()->json(['user' => $user], 200);
    }

    /**
     * Crée un utilisateur
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'telephone' => ['nullable', 'string', 'max:20'],
            'role_id' => ['required', 'exists:roles,id'],
            'societe_id' => ['nullable', 'exists:societes,id'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        // Règle métier : 1 seul administrateur (role=admin) par société
        $adminRoleId = Role::where('name', Role::ADMIN)->value('id');
        if ($adminRoleId && (int) $validated['role_id'] === (int) $adminRoleId && !empty($validated['societe_id'])) {
            $exists = User::where('role_id', $adminRoleId)
                ->where('societe_id', $validated['societe_id'])
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'Cette société possède déjà un administrateur.',
                ], 422);
            }
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'telephone' => $validated['telephone'] ?? null,
            'role_id' => $validated['role_id'],
            'societe_id' => $validated['societe_id'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'message' => 'Utilisateur créé avec succès',
            'user' => $user
        ], 201);
    }

    /**
     * Met à jour un utilisateur
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => ['sometimes', 'string', 'min:8'],
            'telephone' => ['sometimes', 'nullable', 'string', 'max:20'],
            'role_id' => ['sometimes', 'exists:roles,id'],
            'societe_id' => ['sometimes', 'nullable', 'exists:societes,id'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        // Règle métier : 1 seul administrateur (role=admin) par société
        $adminRoleId = Role::where('name', Role::ADMIN)->value('id');
        $newRoleId = array_key_exists('role_id', $validated) ? (int) $validated['role_id'] : (int) $user->role_id;
        $newSocieteId = array_key_exists('societe_id', $validated) ? $validated['societe_id'] : $user->societe_id;

        if ($adminRoleId && $newRoleId === (int) $adminRoleId && !empty($newSocieteId)) {
            $exists = User::where('role_id', $adminRoleId)
                ->where('societe_id', $newSocieteId)
                ->where('id', '!=', $user->id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'Cette société possède déjà un administrateur.',
                ], 422);
            }
        }

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Utilisateur mis à jour avec succès',
            'user' => $user->fresh()
        ], 200);
    }

    /**
     * Supprime un utilisateur
     */
    public function destroy(string $id): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }

        // Empêcher de supprimer son propre compte
        if (auth('sanctum')->check() && auth('sanctum')->user()->id === $user->id) {
            return response()->json([
                'message' => 'Vous ne pouvez pas supprimer votre propre compte'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'Utilisateur supprimé avec succès'
        ], 200);
    }
}