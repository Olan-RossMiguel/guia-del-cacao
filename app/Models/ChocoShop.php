<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChocoShop extends Model
{
public function events() { return $this->hasMany(Event::class, 'id_choco_shop'); }
public function news() { return $this->hasMany(News::class, 'id_choco_shop'); }
public function virtualTour() { return $this->hasOne(VirtualTour::class, 'id_choco_shop'); }
public function ratings() { return $this->hasMany(Rating::class, 'id_choco_shop'); }

protected $fillable = [
    'name', 'slug', 'logo', 'description', 'short_description',
    'location', 'virtual_tour', 'plan', 'avg_rating', 'ratings_count'
];


}
