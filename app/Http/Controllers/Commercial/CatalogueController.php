<?php

namespace App\Http\Controllers\Commercial;

use App\Http\Controllers\Controller;
use App\Services\Commercial\CatalogueService;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CatalogueController extends Controller
{
    public function __construct(
        private readonly CatalogueService $catalogueService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $result = $this->catalogueService->listForCommercial($request->user());
        } catch (QueryException $exception) {
            if ($this->isMissingCatalogueTable($exception)) {
                return response()->json([
                    'success' => false,
                    'message' => "La table du catalogue n'existe pas encore. Veuillez lancer les migrations.",
                ], 500);
            }

            throw $exception;
        }

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

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['sometimes', 'in:product,service'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'price' => ['required_without:prixHT', 'numeric', 'min:0'],
            'prixHT' => ['required_without:price', 'numeric', 'min:0'],
            'tva' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'remise' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        try {
            $result = $this->catalogueService->createForCommercial($request->user(), $validated);
        } catch (QueryException $exception) {
            if ($this->isMissingCatalogueTable($exception)) {
                return response()->json([
                    'success' => false,
                    'message' => "La table du catalogue n'existe pas encore. Veuillez lancer les migrations.",
                ], 500);
            }

            throw $exception;
        }

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

    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['sometimes', 'in:product,service'],
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'prixHT' => ['sometimes', 'numeric', 'min:0'],
            'tva' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'remise' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        try {
            $result = $this->catalogueService->updateForCommercial($request->user(), $id, $validated);
        } catch (QueryException $exception) {
            if ($this->isMissingCatalogueTable($exception)) {
                return response()->json([
                    'success' => false,
                    'message' => "La table du catalogue n'existe pas encore. Veuillez lancer les migrations.",
                ], 500);
            }

            throw $exception;
        }

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

    public function destroy(Request $request, string $id): JsonResponse
    {
        try {
            $result = $this->catalogueService->deleteForCommercial($request->user(), $id);
        } catch (QueryException $exception) {
            if ($this->isMissingCatalogueTable($exception)) {
                return response()->json([
                    'success' => false,
                    'message' => "La table du catalogue n'existe pas encore. Veuillez lancer les migrations.",
                ], 500);
            }

            throw $exception;
        }

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

    private function isMissingCatalogueTable(QueryException $exception): bool
    {
        return str_contains($exception->getMessage(), 'catalogue_items')
            && str_contains($exception->getMessage(), 'doesn\'t exist');
    }
}
