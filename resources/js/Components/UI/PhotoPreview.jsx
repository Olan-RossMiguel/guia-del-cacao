export default function PhotoPreview({
    photo,
    index,
    onClick,
    showMoreOverlay = false,
    remainingCount = 0,
  }) {
    return (
      <div
        className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group bg-gray-200"
        onClick={() => onClick(index)}
      >
        <img
          src={photo.url}
          alt={photo.description || `Foto ${index + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
  
        {/* Overlay al hacer hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
  
        {/* Overlay de "+N Más" */}
        {showMoreOverlay && remainingCount > 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <span className="text-white text-lg font-semibold">+{remainingCount} Más</span>
          </div>
        )}
      </div>
    );
  }