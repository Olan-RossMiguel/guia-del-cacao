<?php

namespace App\Policies;

use App\Models\Rating;
use App\Models\User;

class RatingPolicy
{
    public function create(User $user)
    {
        return $user !== null;
    }

    public function update(User $user, Rating $rating)
    {
        return $user->id === $rating->id_user || $user->role === 'admin';
    }

    public function delete(User $user, Rating $rating)
    {
        return $user->id === $rating->id_user || $user->role === 'admin';
    }
}
