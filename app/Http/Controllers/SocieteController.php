<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Societe;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SocieteController extends Controller
{
    /**
     * Liste des sociétés avec leur administrateur.
     */
    public function index(): JsonResponse
    {
        $societes = Societe::with('admin')->get();

        return response()->json([
            'success' => true,
            'data'    => $societes,
        ]);
    }

    /**
     * Créer une société et lui assigner un administrateur existant.
     * Le frontend envoie admin_id (ID d'un User avec rôle admin).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            // Société
            'nom'         => ['required', 'string', 'max:255'],
            'email'       => ['required', 'string', 'email', 'max:255', 'unique:societes,email'],
            'telephone'   => ['nullable', 'string', 'max:30'],
            'adresse'     => ['nullable', 'string', 'max:255'],
            'code_postal' => ['nullable', 'string', 'max:20'],
            'ville'       => ['nullable', 'string', 'max:100'],
            'pays'        => ['nullable', 'string', 'max:100'],
            'secteur'     => ['nullable', 'string', 'max:150'],
            'description' => ['nullable', 'string'],
            'logo'        => ['nullable', 'string', 'max:255'],

            // Admin existant à assigner
            'admin_id'    => ['required', 'exists:users,id'],
        ]);

        // Vérifier que l'utilisateur choisi est bien un admin
        $adminRole = Role::where('name', Role::ADMIN)->firstOrFail();
        $admin = User::where('id', $validated['admin_id'])
            ->where('role_id', $adminRole->id)
            ->first();

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => "L'utilisateur sélectionné n'est pas un administrateur.",
            ], 422);
        }

        // Vérifier que cet admin n'est pas déjà assigné à une autre société
        if ($admin->societe_id !== null) {
            return response()->json([
                'success' => false,
                'message' => "Cet administrateur est déjà assigné à une autre société.",
            ], 422);
        }

        // Créer la société
        $societe = Societe::create([
            'nom'         => $validated['nom'],
            'email'       => $validated['email'],
            'telephone'   => $validated['telephone'] ?? null,
            'adresse'     => $validated['adresse'] ?? null,
            'code_postal' => $validated['code_postal'] ?? null,
            'ville'       => $validated['ville'] ?? null,
            'pays'        => $validated['pays'] ?? 'Tunisie',
            'secteur'     => $validated['secteur'] ?? null,
            'description' => $validated['description'] ?? null,
            'logo'        => $validated['logo'] ?? null,
        ]);

        // Assigner l'admin à cette société
        $admin->update(['societe_id' => $societe->id]);

        $societe->load('admin');

        return response()->json([
            'success' => true,
            'message' => 'Société créée et administrateur assigné avec succès.',
            'data'    => $societe,
        ], 201);
    }

    /**
     * Afficher le détail d'une société.
     */
    public function show(Societe $societe): JsonResponse
    {
        $societe->load(['admin', 'commerciaux']);

        return response()->json([
            'success' => true,
            'data'    => $societe,
        ]);
    }

    /**
     * Mettre à jour une société et/ou changer son admin.
     */
    public function update(Request $request, Societe $societe): JsonResponse
    {
        $validated = $request->validate([
            'nom'         => ['sometimes', 'string', 'max:255'],
            'email'       => ['sometimes', 'string', 'email', 'max:255', 'unique:societes,email,' . $societe->id],
            'telephone'   => ['sometimes', 'nullable', 'string', 'max:30'],
            'adresse'     => ['sometimes', 'nullable', 'string', 'max:255'],
            'code_postal' => ['sometimes', 'nullable', 'string', 'max:20'],
            'ville'       => ['sometimes', 'nullable', 'string', 'max:100'],
            'pays'        => ['sometimes', 'nullable', 'string', 'max:100'],
            'secteur'     => ['sometimes', 'nullable', 'string', 'max:150'],
            'description' => ['sometimes', 'nullable', 'string'],
            'logo'        => ['sometimes', 'nullable', 'string', 'max:255'],

            // Changer l'admin assigné (optionnel)
            'admin_id'    => ['sometimes', 'nullable', 'exists:users,id'],
        ]);

        // Gérer le changement d'admin
        if (array_key_exists('admin_id', $validated)) {
            $adminRole = Role::where('name', Role::ADMIN)->firstOrFail();
            $newAdminId = $validated['admin_id'];

            // Récupérer l'admin actuel de cette société
            $currentAdmin = User::where('role_id', $adminRole->id)
                ->where('societe_id', $societe->id)
                ->first();

            if ($newAdminId) {
                $newAdmin = User::where('id', $newAdminId)
                    ->where('role_id', $adminRole->id)
                    ->first();

                if (!$newAdmin) {
                    return response()->json([
                        'success' => false,
                        'message' => "L'utilisateur sélectionné n'est pas un administrateur.",
                    ], 422);
                }

                // Vérifier que le nouvel admin n'est pas assigné ailleurs
                if ($newAdmin->societe_id !== null && $newAdmin->societe_id !== $societe->id) {
                    return response()->json([
                        'success' => false,
                        'message' => "Cet administrateur est déjà assigné à une autre société.",
                    ], 422);
                }

                // Désassigner l'ancien admin si différent
                if ($currentAdmin && $currentAdmin->id !== $newAdmin->id) {
                    $currentAdmin->update(['societe_id' => null]);
                }

                // Assigner le nouvel admin
                $newAdmin->update(['societe_id' => $societe->id]);

            } else {
                // admin_id = null → désassigner l'admin actuel
                if ($currentAdmin) {
                    $currentAdmin->update(['societe_id' => null]);
                }
            }

            unset($validated['admin_id']); // ne pas mettre admin_id dans la table societes
        }

        $societe->update($validated);
        $societe->load('admin');

        return response()->json([
            'success' => true,
            'message' => 'Société mise à jour avec succès.',
            'data'    => $societe,
        ]);
    }

    /**
     * Supprimer une société.
     * Les admins liés sont désassignés (societe_id → null).
     */
    public function destroy(Societe $societe): JsonResponse
    {
        // Désassigner les admins avant suppression
        User::where('societe_id', $societe->id)->update(['societe_id' => null]);

        $societe->delete();

        return response()->json([
            'success' => true,
            'message' => 'Société supprimée avec succès.',
        ]);
    }
}