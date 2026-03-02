<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Societe;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SocieteSettingController extends Controller
{
    /**
     * Afficher les paramètres de la société de l'admin.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->societe_id) {
            return response()->json([
                'success' => false,
                'message' => 'Aucune société associée à ce compte admin.',
            ], 422);
        }

        $societe = Societe::query()->find($user->societe_id);

        if (!$societe) {
            return response()->json([
                'success' => false,
                'message' => 'Société introuvable.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $societe,
        ]);
    }

    /**
     * Mettre à jour les paramètres de la société (logo, infos légales, CGV, etc.).
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->societe_id) {
            return response()->json([
                'success' => false,
                'message' => 'Aucune société associée à ce compte admin.',
            ], 422);
        }

        $societe = Societe::query()->find($user->societe_id);

        if (!$societe) {
            return response()->json([
                'success' => false,
                'message' => 'Société introuvable.',
            ], 404);
        }

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
            'legal_info' => ['sometimes', 'nullable', 'string'],
            'cgv' => ['sometimes', 'nullable', 'string'],
        ]);

        $societe->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Paramètres de la société enregistrés.',
            'data' => $societe->fresh(),
        ]);
    }
}

