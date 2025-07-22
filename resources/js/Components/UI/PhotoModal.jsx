import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect } from 'react';

export default function PhotoModal({
    photos,
    currentIndex,
    isOpen,
    onClose,
    onNext,
    onPrevious,
}) {
    const currentPhoto = photos[currentIndex];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Navegación con teclado
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!isOpen) return;

            switch (event.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowLeft':
                    onPrevious();
                    break;
                case 'ArrowRight':
                    onNext();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, onNext, onPrevious]);

    if (!isOpen || !currentPhoto) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-black bg-opacity-95">
            {/* Header */}
            <div className="flex items-center justify-between p-4">
                <div className="text-white">
                    <span className="text-sm">
                        {currentIndex + 1} de {photos.length}
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 text-white hover:text-gray-300"
                >
                    <X className="h-6 w-6" />
                </button>
            </div>

            {/* Imagen */}
            <div className="relative flex flex-col items-center justify-center p-4">
                {/* Contenedor de imagen con altura mínima fija */}
                <div className="relative flex h-[80vh] min-h-[200px] w-full max-w-[90vw] items-center justify-center overflow-hidden bg-black bg-opacity-95">
                    {/* Contenedor de imagen o placeholder */}
                    {currentPhoto.url ? (
                        <img
                            src={currentPhoto.url}
                            alt={
                                currentPhoto.description ||
                                `Foto ${currentIndex + 1}`
                            }
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY2NiI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+';
                            }}
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray">
                            <span className="text-gray-600">
                                Imagen no disponible
                            </span>
                        </div>
                    )}

                    {/* Flechas de navegación */}
                    {photos.length > 1 && (
                        <>
                            <button
                                onClick={onPrevious}
                                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-black bg-opacity-50 p-1 text-white hover:text-gray-300 sm:left-4 sm:p-2"
                            >
                                <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
                            </button>
                            <button
                                onClick={onNext}
                                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-black bg-opacity-50 p-1 text-white hover:text-gray-300 sm:right-4 sm:p-2"
                            >
                                <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Pie de foto */}
            <div className="bg-gradient-to-t from-black to-transparent p-4 text-white">
                <div className="mx-auto max-w-4xl text-center">
                    <p className="mb-2 text-sm text-gray-300">
                        Subido el {formatDate(currentPhoto.uploaded_at)}
                    </p>
                    {currentPhoto.description && (
                        <p className="mb-4 text-base leading-relaxed">
                            {currentPhoto.description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
