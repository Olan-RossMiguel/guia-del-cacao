<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
   
    protected $fillable = [
        'id_user',
        'id_choco_shop',
        'parent_id',
        'rating',
        'comment',
        'is_approved'
    ];

    protected $with = ['user']; // Carga automática de la relación
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function chocoShop()
    {
        return $this->belongsTo(ChocoShop::class, 'id_choco_shop');
    }

    public function replies()
    {
        return $this->hasMany(Rating::class, 'parent_id');
    }
}
