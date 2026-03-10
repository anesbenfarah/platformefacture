<?php

namespace App\Repositories\Commercial;

use App\Models\CatalogueItem;
use App\Models\User;
use Illuminate\Support\Collection;

class CatalogueRepository
{
    public function getBySociete(int $societeId): Collection
    {
        return CatalogueItem::query()
            ->where('societe_id', $societeId)
            ->orderByDesc('id')
            ->get();
    }

    public function createForCommercial(User $commercial, array $payload): CatalogueItem
    {
        $price = 0;
        if (array_key_exists('price', $payload)) {
            $price = $payload['price'];
        } elseif (array_key_exists('prixHT', $payload)) {
            $price = $payload['prixHT'];
        }

        $type = array_key_exists('type', $payload) ? $payload['type'] : 'product';
        $description = array_key_exists('description', $payload) ? $payload['description'] : null;
        $tva = array_key_exists('tva', $payload) ? $payload['tva'] : 20;
        $remise = array_key_exists('remise', $payload) ? $payload['remise'] : 0;
        $isActive = array_key_exists('is_active', $payload) ? $payload['is_active'] : true;

        return CatalogueItem::create([
            'societe_id' => $commercial->societe_id,
            'commercial_id' => $commercial->id,
            'type' => $type,
            'name' => $payload['name'],
            'description' => $description,
            'price' => $price,
            'tva' => $tva,
            'remise' => $remise,
            'is_active' => $isActive,
        ]);
    }

    public function findInSociete(string $id, int $societeId): ?CatalogueItem
    {
        return CatalogueItem::query()
            ->where('id', $id)
            ->where('societe_id', $societeId)
            ->first();
    }

    public function update(CatalogueItem $item, array $payload): CatalogueItem
    {
        if (array_key_exists('prixHT', $payload) && !array_key_exists('price', $payload)) {
            $payload['price'] = $payload['prixHT'];
        }

        $item->update($payload);

        return $item->fresh();
    }

    public function delete(CatalogueItem $item): void
    {
        $item->delete();
    }

    public function countBySocieteAndType(int $societeId, string $type): int
    {
        return CatalogueItem::query()
            ->where('societe_id', $societeId)
            ->where('type', $type)
            ->count();
    }
}
