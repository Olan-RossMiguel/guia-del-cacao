<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VirtualTour extends Model
{
    // app/Models/VirtualTour.php
    protected $fillable = [
        'id_choco_shop',
        'preview_image',
        'url',           // Nuevo campo
        'embed_code'     // Mantener temporalmente
    ];

    // Accesor para compatibilidad
    public function getUrlAttribute($value)
    {
        if ($value) return $value;

        if ($this->embed_code) {
            preg_match('/src="([^"]*)"/', $this->embed_code, $matches);
            return $matches[1] ?? null;
        }

        return null;
    }

    public function chocoShop()
    {
        return $this->belongsTo(ChocoShop::class, 'id_choco_shop');
    }
}
