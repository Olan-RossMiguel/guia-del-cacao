<?php

namespace App\Http\Controllers;

use App\Models\ChocoShop;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChocoShopController extends Controller
{
    /**
     * Display a listing of the resource.
     */


    // En ChocoShopController.php
    public function master()
    {
        $shops = ChocoShop::with('virtualTour', 'photos') // Carga la relación
            ->select('id', 'name', 'slug', 'logo', 'location', 'short_description', 'avg_rating', 'ratings_count', 'plan')
            ->where('plan', 'master')
            ->get();

        return Inertia::render('ChocoShops/Master', [
            'shops' => $shops,
        ]);
    }

    public function plus()
    {
        $shops = ChocoShop::with('photos') // Carga las fotos
            ->select('id', 'name', 'slug', 'logo', 'location', 'short_description', 'avg_rating', 'ratings_count', 'plan')
            ->where('plan', 'plus')
            ->get();

        return Inertia::render('ChocoShops/Plus', [
            'shops' => $shops,
        ]);
    }

    public function basic()
    {
        $shops = ChocoShop::with('photos') // Carga las fotos aunque no se muestren en basic
            ->select('id', 'name', 'slug', 'logo', 'location', 'short_description', 'avg_rating', 'ratings_count', 'plan')
            ->where('plan', 'basic')
            ->get();

        return Inertia::render('ChocoShops/Basic', [
            'shops' => $shops,
        ]);
    }



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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($slug)
    {
        $shop = ChocoShop::with([
            'virtualTour' => function ($query) {
                $query->select('id', 'id_choco_shop', 'url', 'preview_image');
            },
            'photos' => function ($query) {
                $query->select('id', 'id_choco_shop', 'url', 'description', 'uploaded_at')
                    ->orderBy('uploaded_at', 'desc');
            },
            'ratings.user' => function ($query) {
                $query->select('id', 'name', 'email'); // Solo los campos necesarios del usuario
            }
        ])
            ->select('id', 'name', 'slug', 'logo', 'description', 'location', 'plan', 'avg_rating', 'ratings_count')
            ->where('slug', $slug)
            ->firstOrFail();

        // Transformación para compatibilidad con embed_code (si aún existe)
        if ($shop->virtualTour && !$shop->virtualTour->url && isset($shop->virtualTour->embed_code)) {
            preg_match('/src="([^"]*)"/', $shop->virtualTour->embed_code, $matches);
            $shop->virtualTour->url = $matches[1] ?? null;
        }

       return Inertia::render('ChocoShops/Show', [
    'shop' => $shop->makeHidden([
        'virtualTour.embed_code',
        'virtualTour.id_choco_shop'
    ])->load(['ratings.user']), // Carga las relaciones necesarias
    
    
    
    'reviews' => $shop->ratings()
        ->with('user:id,name,email')
        ->where('is_approved', true)
        ->latest()
        ->get()
        ->makeHidden(['id_user', 'id_choco_shop']) // Oculta campos innecesarios
        ]);
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ChocoShop $chocoShop)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ChocoShop $chocoShop)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ChocoShop $chocoShop)
    {
        //
    }
}
