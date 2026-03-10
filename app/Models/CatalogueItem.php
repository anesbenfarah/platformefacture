<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CatalogueItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'societe_id',
        'commercial_id',
        'type',
        'name',
        'description',
        'price',
        'tva',
        'remise',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'tva' => 'decimal:2',
        'remise' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'prixHT',
        'companyId',
    ];

    public function getPrixHTAttribute()
    {
        return (float) $this->price;
    }

    public function getCompanyIdAttribute()
    {
        return $this->societe_id;
    }

    public function societe()
    {
        return $this->belongsTo(Societe::class);
    }

    public function commercial()
    {
        return $this->belongsTo(User::class, 'commercial_id');
    }
}
