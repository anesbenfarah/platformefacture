<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    /**
     * Liste tous les administrateurs (role = admin) avec leur société.
     */
    public function index(): JsonResponse
    {
        $adminRole = Role::where('name', Role::ADMIN)->firstOrFail();

        $admins = User::with('societe')
            ->where('role_id', $adminRole->id)
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $admins,
        ]);
    }

    /**
     * Affiche un administrateur spécifique.
     */
    public function show(string $id): JsonResponse
    {
        $adminRole = Role::where('name', Role::ADMIN)->firstOrFail();

        $admin = User::with('societe')
            ->where('role_id', $adminRole->id)
            ->find($id);

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'Administrateur non trouvé.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $admin,
        ]);
    }

    /**
     * Créer un administrateur.
     * societe_id est OPTIONNEL : on peut créer un admin sans société,
     * puis l'assigner depuis la page Sociétés.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'       => ['required', 'string', 'max:255'],
            'email'      => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password'   => ['required', 'string', 'min:8'],
            'telephone'  => ['nullable', 'string', 'max:30'],
            // nullable : on peut créer un admin sans société
            'societe_id' => ['nullable', 'exists:societes,id'],
            'is_active'  => ['sometimes', 'boolean'],
        ]);

        $adminRole = Role::where('name', Role::ADMIN)->firstOrFail();

        // Si une société est fournie, vérifier qu'elle n'a pas déjà un admin
        if (!empty($validated['societe_id'])) {
            $exists = User::where('role_id', $adminRole->id)
                ->where('societe_id', $validated['societe_id'])
                ->exists();

            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cette société possède déjà un administrateur.',
                ], 422);
            }
        }

        $admin = User::create([
            'name'       => $validated['name'],
            'email'      => $validated['email'],
            'password'   => Hash::make($validated['password']),
            'telephone'  => $validated['telephone'] ?? null,
            'role_id'    => $adminRole->id,
            'societe_id' => $validated['societe_id'] ?? null,
            'is_active'  => $validated['is_active'] ?? true,
        ]);

        $admin->load('societe');

        return response()->json([
            'success' => true,
            'message' => 'Administrateur créé avec succès.',
            'data'    => $admin,
        ], 201);
    }

    /**
     * Mettre à jour un administrateur.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $adminRole = Role::where('name', Role::ADMIN)->firstOrFail();

        $admin = User::where('role_id', $adminRole->id)->find($id);

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'Administrateur non trouvé.',
            ], 404);
        }

        $validated = $request->validate([
            'name'       => ['sometimes', 'string', 'max:255'],
            'email'      => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users')->ignore($admin->id)],
            'password'   => ['sometimes', 'string', 'min:8'],
            'telephone'  => ['sometimes', 'nullable', 'string', 'max:30'],
            'societe_id' => ['sometimes', 'nullable', 'exists:societes,id'],
            'is_active'  => ['sometimes', 'boolean'],
        ]);

        // Si on change la société, vérifier qu'elle n'a pas déjà un admin
        if (isset($validated['societe_id'])
            && !empty($validated['societe_id'])
            && (int) $validated['societe_id'] !== (int) $admin->societe_id
        ) {
            $exists = User::where('role_id', $adminRole->id)
                ->where('societe_id', $validated['societe_id'])
                ->where('id', '!=', $admin->id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cette société possède déjà un administrateur.',
                ], 422);
            }
        }

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $admin->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Administrateur mis à jour avec succès.',
            'data'    => $admin->fresh(['societe']),
        ]);
    }

    /**
     * Supprimer un administrateur.
     */
    public function destroy(string $id): JsonResponse
    {
        $adminRole = Role::where('name', Role::ADMIN)->firstOrFail();

        $admin = User::where('role_id', $adminRole->id)->find($id);

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'Administrateur non trouvé.',
            ], 404);
        }

        if (auth('sanctum')->check() && auth('sanctum')->id() === $admin->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez pas supprimer votre propre compte.',
            ], 403);
        }

        $admin->delete();

        return response()->json([
            'success' => true,
            'message' => 'Administrateur supprimé avec succès.',
        ]);
    }
}