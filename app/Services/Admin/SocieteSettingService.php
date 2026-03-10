<?php

namespace App\Services\Admin;

use App\Repositories\Admin\SocieteRepository;

class SocieteSettingService
{
    public function __construct(
        private readonly SocieteRepository $societeRepository
    ) {
    }

    public function showForAdminSociete(?int $societeId): array
    {
        if (!$societeId) {
            return [
                'success' => false,
                'status' => 422,
                'message' => 'Aucune société associée à ce compte admin.',
            ];
        }

        $societe = $this->societeRepository->findById($societeId);
        if (!$societe) {
            return [
                'success' => false,
                'status' => 404,
                'message' => 'Société introuvable.',
            ];
        }

        return [
            'success' => true,
            'status' => 200,
            'data' => $societe,
        ];
    }

    public function updateForAdminSociete(?int $societeId, array $payload): array
    {
        if (!$societeId) {
            return [
                'success' => false,
                'status' => 422,
                'message' => 'Aucune société associée à ce compte admin.',
            ];
        }

        $societe = $this->societeRepository->findById($societeId);
        if (!$societe) {
            return [
                'success' => false,
                'status' => 404,
                'message' => 'Société introuvable.',
            ];
        }

        $updatedSociete = $this->societeRepository->update($societe, $payload);

        return [
            'success' => true,
            'status' => 200,
            'message' => 'Paramètres de la société enregistrés.',
            'data' => $updatedSociete,
        ];
    }
}
