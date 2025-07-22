export default function VirtualTour({ virtualTourData }) {
    if (!virtualTourData?.url) return null;

    // Agregar parámetros si es un tourmkr
    const processedUrl = virtualTourData.url.includes('tourmkr.com')
        ? `${virtualTourData.url}${virtualTourData.url.includes('?') ? '&' : '?'}mobile=1&controls=1`
        : virtualTourData.url;

    return (
        <div className="mb-8 px-4 sm:px-0">
            <h2 className="mb-3 text-xl font-semibold">
                Recorrido Virtual 360°
            </h2>

            <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-black shadow-lg sm:aspect-[16/9]">
                <iframe
                    src={processedUrl}
                    className="absolute left-0 top-0 h-full w-full border-0"
                    allow="fullscreen; xr-spatial-tracking; vr; accelerometer; gyroscope"
                    allowFullScreen
                    scrolling="no"
                    // Elimina sandbox por completo o prueba reducirlo si es necesario
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
                    importance="high"
                    title="Virtual Tour"
                />
            </div>
        </div>
    );
}
