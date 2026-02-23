<?php

namespace App\Models;
use App\Models\User;   
use App\Models\Role; 

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Societe extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'email',
        'telephone',
        'adresse',
        'code_postal',
        'ville',
        'pays',
        'logo',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Relation avec les utilisateurs (admin + commerciaux)
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * Récupérer l'admin de la société
     */
    public function admin()
    {
        return $this->hasOne(User::class)
            ->whereHas('role', function ($query) {
                $query->where('name', Role::ADMIN);
            });
    }

    /**
     * Récupérer les commerciaux de la société
     */
    public function commerciaux()
    {
        return $this->hasMany(User::class)
            ->whereHas('role', function ($query) {
                $query->where('name', Role::COMMERCIAL);
            });
    }

    /**
     * Scope pour récupérer uniquement les sociétés actives
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}