<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\CommercialService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CommercialController extends Controller
{
    public function __construct(
        private readonly CommercialService $commercialService
    ) {
    }

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

        $commerciaux = $this->commercialService->listBySociete($user->societe_id);

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

        if (!$this->commercialService->getCommercialRoleId()) {
            return response()->json([
                'success' => false,
                'message' => 'Rôle commercial introuvable.',
            ], 422);
        }

        $commercial = $this->commercialService->createForSociete($admin->societe_id, $validated);

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

        $commercialRoleId = $this->commercialService->getCommercialRoleId();
        if (!$commercialRoleId) {
            return response()->json([
                'success' => false,
                'message' => 'Rôle commercial introuvable.',
            ], 422);
        }

        $commercial = $this->commercialService->findCommercialInSociete($id, $admin->societe_id);

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

        $updatedCommercial = $this->commercialService->updateCommercial($commercial, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Commercial mis à jour avec succès.',
            'data' => $updatedCommercial,
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

        $commercialRoleId = $this->commercialService->getCommercialRoleId();
        if (!$commercialRoleId) {
            return response()->json([
                'success' => false,
                'message' => 'Rôle commercial introuvable.',
            ], 422);
        }

        $commercial = $this->commercialService->findCommercialInSociete($id, $admin->societe_id);

        if (!$commercial) {
            return response()->json([
                'success' => false,
                'message' => 'Commercial introuvable.',
            ], 404);
        }

        $disabledCommercial = $this->commercialService->disableCommercial($commercial);

        return response()->json([
            'success' => true,
            'message' => 'Compte commercial désactivé.',
            'data' => $disabledCommercial,
        ]);
    }
}
