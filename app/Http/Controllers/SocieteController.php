<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Societe;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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
            'data' => $societes,
        ]);
    }

    /**
     * Créer une société ET son unique administrateur.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            // Société
            'nom' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:societes,email'],
            'telephone' => ['nullable', 'string', 'max:30'],
            'adresse' => ['nullable', 'string', 'max:255'],
            'code_postal' => ['nullable', 'string', 'max:20'],
            'ville' => ['nullable', 'string', 'max:100'],
            'pays' => ['nullable', 'string', 'max:100'],
            'secteur' => ['nullable', 'string', 'max:150'],
            'description' => ['nullable', 'string'],

            // Admin
            'admin_name' => ['required', 'string', 'max:255'],
            'admin_email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'admin_password' => ['required', 'string', 'min:8'],
            'admin_telephone' => ['nullable', 'string', 'max:30'],
        ]);

        // Créer la société
        $societe = Societe::create([
            'nom' => $validated['nom'],
            'email' => $validated['email'],
            'telephone' => $validated['telephone'] ?? null,
            'adresse' => $validated['adresse'] ?? null,
            'code_postal' => $validated['code_postal'] ?? null,
            'ville' => $validated['ville'] ?? null,
            'pays' => $validated['pays'] ?? 'Tunisie',
            'secteur' => $validated['secteur'] ?? null,
            'description' => $validated['description'] ?? null,
        ]);

        // Récupérer le rôle admin
        $adminRole = Role::where('name', Role::ADMIN)->firstOrFail();

        // Créer l'unique administrateur de cette société
        $admin = User::create([
            'name' => $validated['admin_name'],
            'email' => $validated['admin_email'],
            'password' => Hash::make($validated['admin_password']),
            'telephone' => $validated['admin_telephone'] ?? null,
            'role_id' => $adminRole->id,
            'societe_id' => $societe->id,
            'is_active' => true,
        ]);

        $societe->load('admin');

        return response()->json([
            'success' => true,
            'message' => 'Société et administrateur créés avec succès.',
            'data' => [
                'societe' => $societe,
                'admin' => $admin,
            ],
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
            'data' => $societe,
        ]);
    }

    /**
     * Mettre à jour une société (sans toucher à son admin).
     */
    public function update(Request $request, Societe $societe): JsonResponse
    {
        $validated = $request->validate([
            'nom' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:societes,email,' . $societe->id],
            'telephone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'adresse' => ['sometimes', 'nullable', 'string', 'max:255'],
            'code_postal' => ['sometimes', 'nullable', 'string', 'max:20'],
            'ville' => ['sometimes', 'nullable', 'string', 'max:100'],
            'pays' => ['sometimes', 'nullable', 'string', 'max:100'],
            'secteur' => ['sometimes', 'nullable', 'string', 'max:150'],
            'description' => ['sometimes', 'nullable', 'string'],
            'logo' => ['sometimes', 'nullable', 'string', 'max:255'],
        ]);

        $societe->update($validated);
        $societe->load('admin');

        return response()->json([
            'success' => true,
            'message' => 'Société mise à jour avec succès.',
            'data' => $societe,
        ]);
    }

    /**
     * Supprimer une société.
     */
    public function destroy(Societe $societe): JsonResponse
    {
        $societe->delete();

        return response()->json([
            'success' => true,
            'message' => 'Société supprimée avec succès.',
        ]);
    }
}

