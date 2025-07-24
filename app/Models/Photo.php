<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Photo extends Model
{
    protected $fillable = [
        'id_choco_shop',
        'url',
        'description',
        'uploaded_at'
    ];
    public function getUrlAttribute($value)
{
    return str_starts_with($value, 'http') ? $value : asset('storage/'.$value);
}
    protected $casts = [
        'uploaded_at' => 'datetime'
    ];

    public function shop()
    {
        return $this->belongsTo(ChocoShop::class, 'id_choco_shop');
    }
}
