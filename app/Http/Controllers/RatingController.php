<?php

namespace App\Http\Controllers;

use App\Models\Rating;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'comment' => 'required|string|max:500',
            'rating' => 'required|integer|between:1,5',
            'shop_id' => 'required|exists:choco_shops,id'
        ]);

        Rating::create([
            'id_user' => Auth::id(),
            'id_choco_shop' => $validated['shop_id'],
            'comment' => $validated['comment'],
            'is_approved' => true // Puedes cambiar esto para moderación
        ]);

        return back()->with('success', '¡Reseña publicada!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Rating $rating)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Rating $rating)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Rating $rating)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rating $rating)
    {
        //
    }
}
