import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface GalleryProps {
  images: GalleryImage[];
  maxVisible?: number;
}

const Gallery: React.FC<GalleryProps> = ({ images, maxVisible = 12 }) => {
  const { t } = useTranslation();
  const showAllLabel = t('common.showAll', { count: images.length });

  // Modern grid layout function
  const getGridItemClass = (index: number) => {
    const patterns = [
      'col-span-2 row-span-1 rounded-2xl', // Wide rectangle - spans 2 columns
      'col-span-1 row-span-2 rounded-2xl', // Tall rectangle - 2 rows high
      'col-span-1 row-span-1 rounded-2xl', // Square
      'col-span-2 row-span-1 rounded-2xl', // Wide rectangle
      'col-span-1 row-span-1 rounded-2xl', // Square
      'col-span-1 row-span-1 rounded-2xl', // Square
      'col-span-1 row-span-1 rounded-2xl', // Square - bottom right corner
    ];
    return patterns[index % patterns.length];
  };

  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTap, setLastTap] = useState(0);
  const [touchDistance, setTouchDistance] = useState(0);
  const [initialTouchDistance, setInitialTouchDistance] = useState(0);
  const [initialScale, setInitialScale] = useState(1);

  const lightboxRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Preload adjacent images
  const preloadImage = useCallback(
    (index: number) => {
      if (index >= 0 && index < images.length && !loadedImages.has(index)) {
        const img = new Image();
        img.onload = () => {
          setLoadedImages((prev) => new Set(prev).add(index));
        };
        img.src = images[index].src;
      }
    },
    [images, loadedImages]
  );

  // Preload current and adjacent images
  useEffect(() => {
    if (isOpen) {
      preloadImage(currentIndex);
      preloadImage(currentIndex - 1);
      preloadImage(currentIndex + 1);
    }
  }, [isOpen, currentIndex, preloadImage]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsOpen(false);
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
    document.body.style.overflow = '';
  };

  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetZoom();
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetZoom();
    }
  };

  const resetZoom = () => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
  };

  // Touch distance calculation
  const getTouchDistance = (touches: TouchList) => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Calculate visible images and remaining count
  const visibleImages = images.slice(0, maxVisible);
  const remainingCount = Math.max(0, images.length - maxVisible);
  const showOverlay = remainingCount > 0;

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(scale * delta, 0.5), 4);
    setScale(newScale);

    if (newScale === 1) {
      setTranslateX(0);
      setTranslateY(0);
    }
  };

  // Double tap zoom
  const handleDoubleClick = () => {
    if (scale > 1) {
      resetZoom();
    } else {
      setScale(2);
    }
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      if (tapLength < 500 && tapLength > 0) {
        handleDoubleClick();
      }
      setLastTap(currentTime);

      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2) {
      const distance = getTouchDistance(e.touches);
      setInitialTouchDistance(distance);
      setInitialScale(scale);
      setTouchDistance(distance);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();

    if (e.touches.length === 2) {
      // Pinch to zoom
      const distance = getTouchDistance(e.touches);
      if (initialTouchDistance > 0) {
        const scaleChange = distance / initialTouchDistance;
        const newScale = Math.min(Math.max(initialScale * scaleChange, 0.5), 4);
        setScale(newScale);
      }
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      // Pan when zoomed
      const deltaX = e.touches[0].clientX - dragStart.x;
      const deltaY = e.touches[0].clientY - dragStart.y;
      setTranslateX(translateX + deltaX);
      setTranslateY(translateY + deltaY);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      setIsDragging(false);
      setInitialTouchDistance(0);
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      setTranslateX(translateX + deltaX);
      setTranslateY(translateY + deltaY);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Swipe detection for mobile
  const [swipeStart, setSwipeStart] = useState({ x: 0, y: 0 });
  const [swipeEnd, setSwipeEnd] = useState({ x: 0, y: 0 });

  const handleSwipeStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && scale === 1) {
      setSwipeStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleSwipeEnd = (e: React.TouchEvent) => {
    if (e.changedTouches.length === 1 && scale === 1) {
      setSwipeEnd({ x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY });

      const deltaX = swipeStart.x - e.changedTouches[0].clientX;
      const deltaY = Math.abs(swipeStart.y - e.changedTouches[0].clientY);

      // Only trigger swipe if horizontal movement is greater than vertical
      if (Math.abs(deltaX) > 50 && deltaY < 100) {
        if (deltaX > 0) {
          nextImage();
        } else {
          prevImage();
        }
      }
    }
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-4 gap-3 lg:gap-4 auto-rows-[200px] md:auto-rows-[220px]">
        {visibleImages.map((image, index) => {
          const isLastImage = index === visibleImages.length - 1;
          const shouldShowOverlay = showOverlay && isLastImage;

          return (
            <div
              key={index}
              className={`group relative overflow-hidden bg-gray-100 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-black/10 ${getGridItemClass(index)}`}
              onClick={() => openLightbox(index)}
              {...(shouldShowOverlay ? { title: showAllLabel } : {})}
            >
              {/* Skeleton loader */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-50 to-gray-200 animate-pulse">
                <div
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent animate-pulse"
                  style={{ animationDelay: '0.5s' }}
                ></div>
              </div>

              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 group-hover:contrast-105"
                onLoad={(e) => {
                  const target = e.target as HTMLElement;
                  const skeleton = target.previousElementSibling as HTMLElement;
                  if (skeleton) skeleton.style.display = 'none';
                }}
              />

              {/* Hover overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-black/0 group-hover:from-black/30 group-hover:via-black/10 group-hover:to-black/20 transition-all duration-500 ${
                  shouldShowOverlay ? 'from-black/60 via-black/40 to-black/60' : ''
                }`}
              />

              {/* "+X more" overlay for last image */}
              {shouldShowOverlay && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
                  <div className="text-2xl lg:text-3xl font-bold mb-2">+{remainingCount}</div>
                  <div className="text-sm lg:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-4">
                    {showAllLabel}
                  </div>
                </div>
              )}

              {/* Futuristic bottom accent line */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-sage)] group-hover:w-full transition-all duration-700 ease-out"></div>
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {isOpen && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
          onClick={(e) => {
            if (e.target === lightboxRef.current) {
              closeLightbox();
            }
          }}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-[10000] p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors duration-200 backdrop-blur-sm"
            aria-label="Close gallery"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image counter */}
          <div className="absolute top-6 left-6 z-[10000] px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Navigation arrows */}
          {currentIndex > 0 && (
            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-[10000] p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors duration-200 backdrop-blur-sm"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {currentIndex < images.length - 1 && (
            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-[10000] p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors duration-200 backdrop-blur-sm"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Main image */}
          <div className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center overflow-hidden">
            <img
              ref={imageRef}
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="max-w-full max-h-full object-contain transition-transform duration-300 select-none"
              style={{
                transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
                cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
              }}
              onDoubleClick={handleDoubleClick}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={(e) => {
                handleTouchStart(e);
                handleSwipeStart(e);
              }}
              onTouchMove={handleTouchMove}
              onTouchEnd={(e) => {
                handleTouchEnd(e);
                handleSwipeEnd(e);
              }}
              draggable={false}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
