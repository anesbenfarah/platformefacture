<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function __construct(
        private readonly UserService $userService
    ) {
    }

    /**
     * Liste tous les utilisateurs avec pagination
     */
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            $this->userService->paginateUsers((int) $request->query('per_page', 15)),
            200
        );
    }

    /**
     * Affiche un utilisateur spécifique
     */
    public function show(string $id): JsonResponse
    {
        $user = $this->userService->findUser($id);

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

        $result = $this->userService->createUser($validated);
        if (!$result['success']) {
            return response()->json(['message' => $result['message']], $result['status']);
        }

        return response()->json([
            'message' => $result['message'],
            'user' => $result['data'],
        ], $result['status']);
    }

    /**
     * Met à jour un utilisateur
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users')->ignore($id)],
            'password' => ['sometimes', 'string', 'min:8'],
            'telephone' => ['sometimes', 'nullable', 'string', 'max:20'],
            'role_id' => ['sometimes', 'exists:roles,id'],
            'societe_id' => ['sometimes', 'nullable', 'exists:societes,id'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $result = $this->userService->updateUser($id, $validated);
        if (!$result['success']) {
            return response()->json(['message' => $result['message']], $result['status']);
        }

        return response()->json([
            'message' => $result['message'],
            'user' => $result['data'],
        ], $result['status']);
    }

    /**
     * Supprime un utilisateur
     */
    public function destroy(string $id): JsonResponse
    {
        $result = $this->userService->deleteUser($id, auth('sanctum')->id());
        if (!$result['success']) {
            return response()->json(['message' => $result['message']], $result['status']);
        }

        return response()->json([
            'message' => $result['message']
        ], $result['status']);
    }
}

