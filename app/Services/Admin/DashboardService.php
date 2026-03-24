<?php

namespace App\Services\Admin;

use App\Models\Role;
use App\Repositories\Commercial\CatalogueRepository;
use App\Repositories\Admin\SocieteRepository;
use App\Repositories\RoleRepository;
use App\Repositories\UserRepository;

class DashboardService
{
    public function __construct(
        private readonly SocieteRepository $societeRepository,
        private readonly RoleRepository $roleRepository,
        private readonly UserRepository $userRepository,
        private readonly CatalogueRepository $catalogueRepository
    ) {
    }

    public function getStatsForSociete(?int $societeId): array
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

        $commercialRoleId = $this->roleRepository->findIdByName(Role::COMMERCIAL);
        $clientRoleId = $this->roleRepository->findIdByName(Role::CLIENT);

        $totalUsers = $this->userRepository->countBySociete($societe->id);
        $totalCommerciaux = $commercialRoleId
            ? $this->userRepository->countBySocieteAndRole($societe->id, $commercialRoleId)
            : 0;
        $totalClients = $clientRoleId
            ? $this->userRepository->countBySocieteAndRole($societe->id, $clientRoleId)
            : 0;
        $activeCommerciaux = $commercialRoleId
            ? $this->userRepository->countActiveBySocieteAndRole($societe->id, $commercialRoleId)
            : 0;
        $totalProduits =
            $this->catalogueRepository->countBySocieteAndType($societe->id, 'product')
            + $this->catalogueRepository->countBySocieteAndType($societe->id, 'produit');
        $totalServices =
            $this->catalogueRepository->countBySocieteAndType($societe->id, 'service')
            + $this->catalogueRepository->countBySocieteAndType($societe->id, 'services');

        return [
            'success' => true,
            'status' => 200,
            'data' => [
                'societe' => [
                    'id' => $societe->id,
                    'nom' => $societe->nom,
                    'email' => $societe->email,
                    'logo' => $societe->logo,
                ],
                'totals' => [
                    'users' => $totalUsers,
                    'commerciaux' => $totalCommerciaux,
                    'commerciaux_actifs' => $activeCommerciaux,
                    'clients' => $totalClients,
                    'produits' => $totalProduits,
                    'services' => $totalServices,
                ],
            ],
        ];
    }
}
