export default function Show({ shop }) {
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

            {/* Descripción completa */}
            <p className="mb-2 text-lg text-gray-800">{shop.description}</p>

            {/* Ubicación */}
            <p className="mb-4 text-sm text-gray-500">
                Ubicación: {shop.location}
            </p>

            {/* Recorrido Virtual */}
            <iframe
                src={shop.virtual_tour}
                className="h-96 w-full rounded-xl"
                allowFullScreen
            ></iframe>

            {/* Reseñas (simplificadas) */}
            <div className="mt-6">
                <h2 className="mb-2 text-xl font-semibold">Reseñas</h2>
                {shop.ratings?.length > 0 ? (
                    shop.ratings.map((rating) => (
                        <div key={rating.id} className="mb-4 border-b pb-2">
                            <p className="text-sm font-medium">
                                {rating.user.name}
                            </p>
                            <p className="text-sm text-gray-600">
                                {rating.comment}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">Aún no hay reseñas.</p>
                )}
            </div>
        </div>
    );
}
