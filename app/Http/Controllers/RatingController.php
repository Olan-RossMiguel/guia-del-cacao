<?php

namespace App\Http\Controllers;

use App\Models\Rating;
use App\Models\ChocoShop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Log\LogManager;

class RatingController extends Controller
{
   
    /**
     * Almacena una nueva reseña en la base de datos
     */
public function store(Request $request)
{
    Log::info('Auth user in store: ' . (Auth::check() ? Auth::id() : 'No auth'));
    Log::info('Usuario actual: ' . (optional(Auth::user())->id ?? 'No auth'));
    Log::info('Request content: ', $request->all());

    $validated = $request->validate([
        'shop_id' => 'required|exists:choco_shops,id',
        'rating' => 'required|integer|min:1|max:5',
        'comment' => 'required|string|max:1000',
    ]);

    try {
        $rating = Rating::create([
            'id_user' => Auth::id(),
            'id_choco_shop' => $validated['shop_id'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'is_approved' => true,
        ]);

        $this->updateShopRating($validated['shop_id']);

        $rating->load(['user:id,name,email']);

        // 👇 Cambio clave aquí
        return redirect()->back()->with('success', 'Reseña agregada correctamente.');

    } catch (\Exception $e) {
        Log::error('Error al guardar la reseña: ' . $e->getMessage());

        return redirect()->back()->with('error', 'Hubo un problema al guardar tu reseña.');
    }


}

public function update(Request $request, $id)
{
    Log::info('Auth user in update: ' . (Auth::check() ? Auth::id() : 'No auth'));
    Log::info('Usuario actual: ' . (optional(Auth::user())->id ?? 'No auth'));
    Log::info('Request content: ', $request->all());

    $validated = $request->validate([
        'rating' => 'required|integer|min:1|max:5',
        'comment' => 'required|string|max:1000',
    ]);

    try {
        $rating = Rating::findOrFail($id);

        $user = Auth::user();
        if (!$user) {
            abort(403, 'No autenticado');
        }

        if ($rating->id_user !== $user->id && ($user->role ?? '') !== 'admin') {
            abort(403, 'No tienes permiso para editar esta reseña.');
        }

        $rating->update([
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ]);

        $this->updateShopRating($rating->id_choco_shop);

        $rating->load(['user:id,name,email']);

        return redirect()->back()->with('success', 'Reseña actualizada correctamente.');

    } catch (\Exception $e) {
        Log::error('Error al actualizar la reseña: ' . $e->getMessage());

        return redirect()->back()->with('error', 'Hubo un problema al actualizar tu reseña.');
    }
}

public function destroy($id)
{
    try {
        $rating = Rating::findOrFail($id);

        $user = Auth::user();
        if (!$user) {
            abort(403, 'No autenticado');
        }

        if ($rating->id_user !== $user->id && ($user->role ?? '') !== 'admin') {
            abort(403, 'No tienes permiso para eliminar esta reseña.');
        }

        $shopId = $rating->id_choco_shop;
        $rating->delete();

        $this->updateShopRating($shopId);

        return redirect()->back()->with('success', 'Reseña eliminada correctamente.');

    } catch (\Exception $e) {
        Log::error('Error al eliminar la reseña: ' . $e->getMessage());
        return redirect()->back()->with('error', 'Hubo un problema al eliminar la reseña.');
    }
}








    /**
     * Valida los datos de la solicitud
     */
    protected function validateRequest(Request $request): array
    {
        return $request->validate([
            'shop_id' => 'required|exists:choco_shops,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);
    }

    /**
     * Crea una nueva reseña en la base de datos
     */
    protected function createRating(array $validatedData): Rating
    {
        return Rating::create([
            'id_user' => Auth::id(),
            'id_choco_shop' => $validatedData['shop_id'],
            'rating' => $validatedData['rating'],
            'comment' => $validatedData['comment'],
            'is_approved' => config('app.auto_approve_ratings', true)
        ]);
    }

    /**
     * Actualiza las estadísticas de la tienda
     */
    protected function updateShopRating(int $shopId): void
    {
        $shop = ChocoShop::findOrFail($shopId);

        $stats = Rating::where('id_choco_shop', $shopId)
            ->where('is_approved', true)
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as ratings_count')
            ->first();

        $shop->update([
            'avg_rating' => round($stats->avg_rating ?? 0, 2),
            'ratings_count' => $stats->ratings_count ?? 0
        ]);
    }

    /**
     * Respuesta exitosa
     */
    protected function successResponse(Rating $rating)
    {
        return redirect()->back()->with([
            'success' => '¡Reseña publicada correctamente!',
            'newRating' => $rating->load('user')
        ]);
    }

    /**
     * Respuesta de error
     */
    protected function errorResponse()
    {
        return back()
            ->withErrors(['error' => 'Ocurrió un error al guardar la reseña'])
            ->withInput();
    }
}
