<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\SuperAdmin\SuperAdminService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SuperAdminController extends Controller
{
    public function __construct(
        private readonly SuperAdminService $superAdminService
    ) {
    }

    /**
     * Point d'entrée principal de l'espace Super Admin.
     */
    public function overview(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Espace Super Admin disponible.',
        ]);
    }

    /**
     * Liste tous les administrateurs (role = admin) avec leur société.
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->superAdminService->listAdmins(),
        ]);
    }

    /**
     * Affiche un administrateur spécifique.
     */
    public function show(string $id): JsonResponse
    {
        $admin = $this->superAdminService->findAdmin($id);

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'Administrateur non trouvé.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $admin,
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
            'societe_id' => ['nullable', 'exists:societes,id'],
            'is_active'  => ['sometimes', 'boolean'],
        ]);

        $result = $this->superAdminService->createAdmin($validated);
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
     * Mettre à jour un administrateur.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'name'       => ['sometimes', 'string', 'max:255'],
            'email'      => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users')->ignore($id)],
            'password'   => ['sometimes', 'string', 'min:8'],
            'telephone'  => ['sometimes', 'nullable', 'string', 'max:30'],
            'societe_id' => ['sometimes', 'nullable', 'exists:societes,id'],
            'is_active'  => ['sometimes', 'boolean'],
        ]);

        $result = $this->superAdminService->updateAdmin($id, $validated);
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
     * Supprimer un administrateur.
     */
    public function destroy(string $id): JsonResponse
    {
        $result = $this->superAdminService->deleteAdmin($id, auth('sanctum')->id());
        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], $result['status']);
        }

        return response()->json([
            'success' => true,
            'message' => $result['message'],
        ], $result['status']);
    }
}

