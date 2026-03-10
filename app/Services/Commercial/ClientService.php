<?php

namespace App\Services\Commercial;

use App\Models\User;
use App\Repositories\Commercial\ClientRepository;

class ClientService
{
    public function __construct(
        private readonly ClientRepository $clientRepository
    ) {
    }

    public function listForCommercial(User $commercial): array
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
            'data' => $this->clientRepository->getClientsBySociete($commercial->societe_id),
        ];
    }
}
