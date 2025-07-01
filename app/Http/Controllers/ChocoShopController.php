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
        $shops = ChocoShop::with('virtualTour') // Carga la relación
            ->select('id', 'name', 'slug', 'logo', 'location', 'short_description', 'avg_rating', 'ratings_count', 'plan')
            ->where('plan', 'master')
            ->get();

        return Inertia::render('ChocoShops/Master', [
            'shops' => $shops,
        ]);
    }

    public function plus()
    {
        $shops = ChocoShop::select('id', 'name', 'slug', 'logo', 'location', 'short_description', 'avg_rating', 'ratings_count')
            ->where('plan', 'plus')
            ->get();

        return Inertia::render('ChocoShops/Plus', [
            'shops' => $shops,
        ]);
    }

    public function basic()
    {
        $shops = ChocoShop::select('id', 'name', 'slug', 'logo', 'location', 'short_description', 'avg_rating', 'ratings_count')
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
                $query->select('id_choco_shop', 'url', 'preview_image', 'embed_code'); // Mantenemos embed_code temporalmente
            },
            'ratings.user'
        ])
            ->select('id', 'name', 'logo', 'description', 'location', 'plan')
            ->where('slug', $slug)
            ->firstOrFail();

        // Transformar embed_code a URL si es necesario (para compatibilidad)
        if ($shop->virtualTour && !$shop->virtualTour->url && $shop->virtualTour->embed_code) {
            preg_match('/src="([^"]*)"/', $shop->virtualTour->embed_code, $matches);
            $shop->virtualTour->url = $matches[1] ?? null;
        }

        return Inertia::render('ChocoShops/Show', [
            'shop' => $shop->makeHidden(['virtualTour.embed_code']), // Ocultamos el campo antiguo
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
