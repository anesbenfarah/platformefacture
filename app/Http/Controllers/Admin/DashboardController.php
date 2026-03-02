<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Societe;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Statistiques de la société (réservé à l'Admin).
     */
    public function stats(Request $request): JsonResponse
    {
        /** @var User $user */
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

        $commercialRoleId = Role::where('name', Role::COMMERCIAL)->value('id');
        $clientRoleId = Role::where('name', Role::CLIENT)->value('id');

        $totalUsers = User::where('societe_id', $societe->id)->count();
        $totalCommerciaux = $commercialRoleId
            ? User::where('societe_id', $societe->id)->where('role_id', $commercialRoleId)->count()
            : 0;
        $totalClients = $clientRoleId
            ? User::where('societe_id', $societe->id)->where('role_id', $clientRoleId)->count()
            : 0;

        $activeCommerciaux = $commercialRoleId
            ? User::where('societe_id', $societe->id)->where('role_id', $commercialRoleId)->where('is_active', true)->count()
            : 0;

        // TODO: remplacer ces valeurs par des comptages réels lorsque
        // les modèles Produit et Service seront disponibles.
        $totalProduits = 0;
        $totalServices = 0;

        return response()->json([
            'success' => true,
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
        ]);
    }
}

