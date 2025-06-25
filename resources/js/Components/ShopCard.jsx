import { Link } from '@inertiajs/react';
import { Star } from 'lucide-react';

export default function ShopCard({ shop }) {
    const stars = Math.round(shop.avg_rating);

    return (
        <div className="overflow-hidden rounded-xl bg-white shadow-md">
            {shop.logo && (
                <img
                    src={shop.logo}
                    alt={shop.name}
                    className="h-40 w-full object-cover"
                />
            )}

            <div className="p-4">
                <h2 className="mb-1 text-xl font-semibold">{shop.name}</h2>
                <p className="mb-2 text-sm text-gray-600">{shop.location}</p>

                {/* RATING */}
                <div className="mb-2 flex items-center gap-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={16}
                            fill={i < stars ? '#facc15' : 'none'}
                            stroke="#facc15"
                        />
                    ))}
                    <span className="ml-2 text-sm text-gray-700">
                        ({shop.ratings_count} reseñas)
                    </span>
                </div>

                {/* Descripción corta */}
                <p className="line-clamp-3 text-sm text-gray-700">
                    {shop.short_description}
                </p>

                {/* Ver más */}
                <div className="mt-4">
                    <Link
                        href={`/chocolateras/${shop.slug}`}
                        className="inline-block rounded bg-amber-500 px-4 py-2 text-sm text-white hover:bg-amber-600"
                    >
                        Ver más
                    </Link>
                </div>
            </div>
        </div>
    );
}
