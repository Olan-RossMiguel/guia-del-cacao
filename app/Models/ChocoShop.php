<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChocoShop extends Model
{
    // Relaciones
    public function events()
    { 
        return $this->hasMany(Event::class, 'id_choco_shop'); 
    }
    
    public function news()
    { 
        return $this->hasMany(News::class, 'id_choco_shop'); 
    }
    
    public function virtualTour() 
    { 
        return $this->hasOne(VirtualTour::class, 'id_choco_shop'); 
    }
    
    public function ratings() 
    { 
        return $this->hasMany(Rating::class, 'id_choco_shop'); 
    }
    
    // Nueva relación con photos
    public function photos()
    {
        return $this->hasMany(Photo::class, 'id_choco_shop');
    }

    // Campos fillable (eliminamos 'images' ya que migraremos a tabla photos)
    protected $fillable = [
        'name', 
        'slug', 
        'logo', 
        'description', 
        'short_description',
        'location', 
        'virtual_tour',  // Este campo podría eliminarse también si usas la relación virtualTour
        'contact_info',
        'plan', 
        'featured_order',
        'views',
        'avg_rating', 
        'ratings_count'
    ];

    // Opcional: Si quieres acceder a las fotos como atributo (para compatibilidad temporal)
    public function getImagesAttribute()
    {
        return $this->photos->pluck('url')->toArray();
    }
}
