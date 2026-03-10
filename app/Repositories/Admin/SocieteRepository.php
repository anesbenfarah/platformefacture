<?php

namespace App\Repositories\Admin;

use App\Models\Societe;

class SocieteRepository
{
    public function findById(?int $id): ?Societe
    {
        if (!$id) {
            return null;
        }

        return Societe::query()->find($id);
    }

    public function update(Societe $societe, array $payload): Societe
    {
        $societe->update($payload);

        return $societe->fresh();
    }
}
