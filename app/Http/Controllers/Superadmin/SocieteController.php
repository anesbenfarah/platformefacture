<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Societe;
use App\Services\SuperAdmin\SocieteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SocieteController extends Controller
{
    public function __construct(
        private readonly SocieteService $societeService
    ) {
    }

    /**
     * Liste des sociétés avec leur administrateur.
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->societeService->listSocietes(),
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

        $result = $this->societeService->createSocieteWithAdmin($validated);
        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], $result['status']);
        }

        return response()->json([
            'success' => true,
            'message' => $result['message'],
            'data' => $result['data'],
        ], $result['status']);
    }

    /**
     * Afficher le détail d'une société.
     */
    public function show(Societe $societe): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->societeService->showSociete($societe),
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

        $result = $this->societeService->updateSociete($societe, $validated);
        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], $result['status']);
        }

        return response()->json([
            'success' => true,
            'message' => $result['message'],
            'data' => $result['data'],
        ], $result['status']);
    }

    /**
     * Supprimer une société.
     * Les admins liés sont désassignés (societe_id → null).
     */
    public function destroy(Societe $societe): JsonResponse
    {
        $this->societeService->deleteSociete($societe);

        return response()->json([
            'success' => true,
            'message' => 'Société supprimée avec succès.',
        ]);
    }
}

