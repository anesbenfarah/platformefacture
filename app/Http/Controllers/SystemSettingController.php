<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SystemSettingController extends Controller
{
    /**
     * Retourne les paramètres globaux (key/value).
     */
    public function index(): JsonResponse
    {
        $settings = SystemSetting::query()
            ->get(['key', 'value'])
            ->mapWithKeys(fn ($s) => [$s->key => $s->value]);

        return response()->json([
            'success' => true,
            'data' => $settings,
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

        foreach ($validated['settings'] as $key => $value) {
            SystemSetting::updateOrCreate(
                ['key' => (string) $key],
                ['value' => is_null($value) ? null : (string) $value],
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Paramètres enregistrés avec succès.',
        ]);
    }
}

