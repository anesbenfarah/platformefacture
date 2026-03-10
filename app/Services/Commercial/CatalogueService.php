<?php

namespace App\Services\Commercial;

use App\Repositories\Commercial\CatalogueRepository;
use App\Models\User;

class CatalogueService
{
    public function __construct(
        private readonly CatalogueRepository $catalogueRepository
    ) {
    }

    public function listForCommercial(User $commercial)
    {
        if (!$commercial->societe_id) {
            return [
                'success' => false,
                'status' => 422,
                'message' => 'Aucune societe associee a ce compte commercial.',
            ];
        }

        return [
            'success' => true,
            'status' => 200,
            'data' => $this->catalogueRepository->getBySociete($commercial->societe_id),
        ];
    }

    public function createForCommercial(User $commercial, array $payload): array
    {
        if (!$commercial->societe_id) {
            return [
                'success' => false,
                'status' => 422,
                'message' => 'Aucune societe associee a ce compte commercial.',
            ];
        }

        $item = $this->catalogueRepository->createForCommercial($commercial, $payload);

        return [
            'success' => true,
            'status' => 201,
            'message' => 'Element du catalogue cree avec succes.',
            'data' => $item,
        ];
    }

    public function updateForCommercial(User $commercial, string $id, array $payload): array
    {
        if (!$commercial->societe_id) {
            return [
                'success' => false,
                'status' => 422,
                'message' => 'Aucune societe associee a ce compte commercial.',
            ];
        }

        $item = $this->catalogueRepository->findInSociete($id, $commercial->societe_id);
        if (!$item) {
            return [
                'success' => false,
                'status' => 404,
                'message' => 'Element du catalogue introuvable.',
            ];
        }

        $updated = $this->catalogueRepository->update($item, $payload);

        return [
            'success' => true,
            'status' => 200,
            'message' => 'Element du catalogue mis a jour.',
            'data' => $updated,
        ];
    }

    public function deleteForCommercial(User $commercial, string $id): array
    {
        if (!$commercial->societe_id) {
            return [
                'success' => false,
                'status' => 422,
                'message' => 'Aucune societe associee a ce compte commercial.',
            ];
        }

        $item = $this->catalogueRepository->findInSociete($id, $commercial->societe_id);
        if (!$item) {
            return [
                'success' => false,
                'status' => 404,
                'message' => 'Element du catalogue introuvable.',
            ];
        }

        $this->catalogueRepository->delete($item);

        return [
            'success' => true,
            'status' => 200,
            'message' => 'Element du catalogue supprime.',
        ];
    }
}
