<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\SocieteSettingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SocieteSettingController extends Controller
{
    public function __construct(
        private readonly SocieteSettingService $societeSettingService
    ) {
    }

    /**
     * Afficher les paramètres de la société de l'admin.
     */
    public function show(Request $request): JsonResponse
    {
        $result = $this->societeSettingService->showForAdminSociete($request->user()->societe_id);
        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], $result['status']);
        }

        return response()->json([
            'success' => true,
            'data' => $result['data'],
        ], $result['status']);
    }

    /**
     * Mettre à jour les paramètres de la société (logo, infos légales, CGV, etc.).
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nom' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255'],
            'telephone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'adresse' => ['sometimes', 'nullable', 'string', 'max:255'],
            'code_postal' => ['sometimes', 'nullable', 'string', 'max:20'],
            'ville' => ['sometimes', 'nullable', 'string', 'max:100'],
            'pays' => ['sometimes', 'nullable', 'string', 'max:100'],
            'secteur' => ['sometimes', 'nullable', 'string', 'max:150'],
            'description' => ['sometimes', 'nullable', 'string'],
            'logo' => ['sometimes', 'nullable', 'string', 'max:255'],
            'legal_info' => ['sometimes', 'nullable', 'string'],
            'cgv' => ['sometimes', 'nullable', 'string'],
        ]);

        $societeId = $request->user()->societe_id;
        if (!empty($validated['email'])) {
            $request->validate([
                'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:societes,email,' . $societeId],
            ]);
        }

        $result = $this->societeSettingService->updateForAdminSociete($societeId, $validated);
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
}

