<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Role;
use App\Models\Societe;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'telephone',
        'role_id',
        'societe_id',
        'is_active'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    /**
     * Relation avec le rôle
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Relation avec la société
     */
    public function societe()
    {
        return $this->belongsTo(Societe::class);
    }

    /**
     * Vérifier si l'utilisateur est Super Admin
     */
    public function isSuperAdmin(): bool
    {
        return $this->role->name === Role::SUPER_ADMIN;
    }

    /**
     * Vérifier si l'utilisateur est Admin
     */
    public function isAdmin(): bool
    {
        return $this->role->name === Role::ADMIN;
    }

    /**
     * Vérifier si l'utilisateur est Commercial
     */
    public function isCommercial(): bool
    {
        return $this->role->name === Role::COMMERCIAL;
    }

    /**
     * Vérifier si l'utilisateur est Client
     */
    public function isClient(): bool
    {
        return $this->role->name === Role::CLIENT;
    }

    /**
     * Vérifier si l'utilisateur a un rôle spécifique
     */
    public function hasRole(string $roleName): bool
    {
        return $this->role->name === $roleName;
    }

    /**
     * Vérifier si l'utilisateur a l'un des rôles donnés
     */
    public function hasAnyRole(array $roles): bool
    {
        return in_array($this->role->name, $roles);
    }

    /**
     * Scope pour récupérer uniquement les utilisateurs actifs
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope pour filtrer par rôle
     */
    public function scopeByRole($query, string $roleName)
    {
        return $query->whereHas('role', function ($q) use ($roleName) {
            $q->where('name', $roleName);
        });
    }

    /**
     * Scope pour filtrer par société
     */
    public function scopeBySociete($query, int $societeId)
    {
        return $query->where('societe_id', $societeId);
    }
}