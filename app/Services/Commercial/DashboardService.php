<?php

namespace App\Services\Commercial;

use App\Models\User;
use App\Repositories\Commercial\CatalogueRepository;
use App\Repositories\Commercial\ClientRepository;

class DashboardService
{
    public function __construct(
        private readonly CatalogueRepository $catalogueRepository,
        private readonly ClientRepository $clientRepository
    ) {
    }

    public function getStats(User $commercial): array
    {
        if (!$commercial->societe_id) {
            return [
                'success' => false,
                'status' => 422,
                'message' => 'Aucune societe associee a ce compte commercial.',
            ];
        }

        $clients = $this->clientRepository->getClientsBySociete($commercial->societe_id);

        return [
            'success' => true,
            'status' => 200,
            'data' => [
                'total_produits' => $this->catalogueRepository->countBySocieteAndType($commercial->societe_id, 'product'),
                'total_services' => $this->catalogueRepository->countBySocieteAndType($commercial->societe_id, 'service'),
                'clients' => $clients->count(),
                'recent_clients' => $clients->take(5)->values(),
            ],
        ];
    }
}
