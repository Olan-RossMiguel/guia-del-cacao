export default function VirtualTour({ virtualTourData }) {
    if (!virtualTourData?.url) return null;

    // Añade parámetros responsivos a la URL (si es tourmkr)
    const processedUrl = virtualTourData.url.includes('tourmkr.com')
        ? `${virtualTourData.url}${virtualTourData.url.includes('?') ? '&' : '?'}mobile=1&controls=1`
        : virtualTourData.url;

    return (
        <div className="mb-8 px-4 sm:px-0">
            <h2 className="mb-3 text-xl font-semibold">
                Recorrido Virtual 360°
            </h2>
            <div
                className="relative overflow-hidden rounded-xl bg-gray-100 shadow-lg"
                style={{ height: '70vh', touchAction: 'none' }} // Crucial para móviles
            >
                <iframe
                    src={processedUrl}
                    className="h-full w-full select-none border-0"
                    allow="fullscreen; xr-spatial-tracking; vr; accelerometer; gyroscope"
                    allowFullScreen
                    // Atributos clave para móvil:
                    scrolling="no"
                    sandbox="allow-scripts allow-same-origin allow-presentation"
                    importance="high"
                />
            </div>
        </div>
    );
}
