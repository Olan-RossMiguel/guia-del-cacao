<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    protected $fillable = [
        'id_user',
        'id_choco_shop',
        'comment',
        'is_approved'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function chocoShop()
    {
        return $this->belongsTo(ChocoShop::class, 'id_choco_shop');
    }
}
