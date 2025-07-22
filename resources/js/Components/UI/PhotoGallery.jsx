import { useEffect, useState } from 'react';
import PhotoModal from './PhotoModal';
import PhotoPreview from './PhotoPreview';

export default function PhotoGallery({ photos = [], shopName, plan }) {
    // No mostrar si el plan es basic o no hay fotos
    if (plan === 'basic' || !photos || photos.length === 0) {
        return null;
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const displayPhotos = photos.slice(0, 5);
    const remainingCount = Math.max(0, photos.length - 5);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const openModal = (index) => {
        setCurrentImageIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const goToPrevious = () => {
        setCurrentImageIndex((prev) =>
            prev > 0 ? prev - 1 : photos.length - 1,
        );
    };

    const goToNext = () => {
        setCurrentImageIndex((prev) =>
            prev < photos.length - 1 ? prev + 1 : 0,
        );
    };

    // Navegación con teclado
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!isModalOpen) return;

            switch (event.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowLeft':
                    goToPrevious();
                    break;
                case 'ArrowRight':
                    goToNext();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen]);

    // Prevenir scroll del body cuando el modal está abierto
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    return (
        <div className="mt-8">
            {/* Encabezado */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    {photos.length} {photos.length === 1 ? 'foto' : 'fotos'}
                </h2>
                <p className="text-gray-600">Explora las fotos de {shopName}</p>
            </div>

            {/* Grid de fotos */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {/* Foto principal (más grande) */}
                {displayPhotos[0] && (
                    <div
                        className="row-span-2 cursor-pointer md:col-span-2"
                        onClick={() => openModal(0)}
                    >
                        <PhotoPreview
                            photo={displayPhotos[0]}
                            index={0}
                            onClick={openModal}
                        />
                    </div>
                )}

                {/* Fotos secundarias */}
                {displayPhotos.slice(1, 5).map((photo, index) => (
                    <div key={index + 1} className="cursor-pointer">
                        <PhotoPreview
                            photo={photo}
                            index={index + 1}
                            onClick={openModal}
                            showMoreOverlay={index === 3 && remainingCount > 0}
                            remainingCount={remainingCount}
                        />
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <PhotoModal
                    photos={photos}
                    currentIndex={currentImageIndex}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onNext={goToNext}
                    onPrevious={goToPrevious}
                />
            )}
        </div>
    );
}
