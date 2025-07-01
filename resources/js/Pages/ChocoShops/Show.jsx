import CommentBox from '@/Components/UI/CommentBox';
import VirtualTour from '@/Components/VirtualTour';


export default function Show({ shop }) {
    console.log('Datos recibidos en Show:', {
        shop,
        hasVirtualTour: shop.virtualTour ? true : false,
    });
    return (
        <div className="p-6">
            <h1 className="mb-4 text-3xl font-bold">{shop.name}</h1>

            {/* Imagen principal */}
            {shop.logo && (
                <img
                    src={shop.logo}
                    alt={shop.name}
                    className="mb-4 h-64 w-full rounded-xl object-cover"
                />
            )}

            {/* Descripción y ubicación */}
            <p className="mb-2 text-lg text-gray-800">{shop.description}</p>
            <p className="mb-6 text-sm text-gray-500">📍 {shop.location}</p>

            {/* Recorrido Virtual usando el componente */}
            {shop.plan === 'master' && shop.virtual_tour && (
                <VirtualTour virtualTourData={shop.virtual_tour} />
            )}

            {/* Reseñas */}
            <div className="mt-8">
                <h2 className="mb-3 text-xl font-semibold">Reseñas</h2>

                {/* Caja de comentarios */}
                <CommentBox shopId={shop.id} />

                {/* Listado de reseñas existentes */}
                {shop.ratings?.length > 0 ? (
                    <div className="mt-4 space-y-4">
                        {shop.ratings.map((rating) => (
                            <div key={rating.id} className="border-b pb-4">
                                <p className="font-medium">
                                    {rating.user?.name}
                                </p>
                                <p className="mt-1 text-gray-600">
                                    {rating.comment}
                                </p>
                                {/* Eliminamos la visualización de estrellas */}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="mt-4 text-gray-500">Aún no hay reseñas.</p>
                )}
            </div>
        </div>
    );
}
