<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\SuperAdmin\SystemSettingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SystemSettingController extends Controller
{
    public function __construct(
        private readonly SystemSettingService $systemSettingService
    ) {
    }

    /**
     * Retourne les paramètres globaux (key/value).
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->systemSettingService->getAllSettings(),
        ]);
    }

    /**
     * Met à jour plusieurs paramètres (upsert).
     */
    public function upsert(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'settings' => ['required', 'array'],
        ]);

        $this->systemSettingService->upsertSettings($validated['settings']);

        return response()->json([
            'success' => true,
            'message' => 'Paramètres enregistrés avec succès.',
        ]);
    }
}
