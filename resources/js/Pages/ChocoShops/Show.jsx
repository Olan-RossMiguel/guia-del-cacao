import Navbar from '@/Components/UI/Navbar';
import PhotoGallery from '@/Components/UI/PhotoGallery';
import ReviewBox from '@/Components/UI/ReviewSection';
import VirtualTour from '@/Components/UI/VirtualTour';
import { Head } from '@inertiajs/react';

export default function Show({ shop }) {
    console.log('Reviews recibidas:', shop.ratings);
    console.log('Datos recibidos en Show:', {
        shop,
        hasVirtualTour: shop.virtual_tour ? true : false,
    });

    return (
        <>
            <Head title={shop.name} />
            <Navbar />

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

                <PhotoGallery
                    photos={shop.photos || []}
                    shopName={shop.name}
                    plan={shop.plan}
                />

                {/* Reseñas */}
                <div className="mt-8">
                    <ReviewBox
                        shopId={shop.id}
                        reviews={shop.ratings || []}
                        key={shop.ratings ? shop.ratings.length : 0} // Force re-render when ratings change
                    />
                </div>
            </div>
        </>
    );
}
