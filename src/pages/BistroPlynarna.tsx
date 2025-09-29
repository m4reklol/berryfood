import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X, ChevronLeft, ChevronRight, Utensils } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MenuCTA from '../components/MenuCTA';
import ContactForm from '../components/ContactForm';
import SEOHead from '../components/SEOHead';

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

const BistroPlynarna = () => {
  const { t } = useTranslation();

  // Gallery state
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  // Gallery images (13 total)
  const galleryImages: GalleryImage[] = [
    { src: '/V7_BISTRO_PLYNÁRNA_komplet_page-0002_compressed.webp', alt: 'Bistro Plynárna - interiér a atmosféra' },
    { src: '/V7_BISTRO_PLYNÁRNA_komplet_page-0003_compressed.webp', alt: 'Bistro Plynárna - čerstvé pokrmy' },
    { src: '/V7_BISTRO_PLYNÁRNA_komplet_page-0004_compressed.webp', alt: 'Bistro Plynárna - denní nabídka' },
    { src: '/V7_BISTRO_PLYNÁRNA_komplet_page-0005_compressed.webp', alt: 'Bistro Plynárna - domácí speciality' },
    { src: '/V7_BISTRO_PLYNÁRNA_komplet_page-0006_compressed.webp', alt: 'Bistro Plynárna - kvalitní suroviny' },
    { src: '/V7_BISTRO_PLYNÁRNA_komplet_page-0007_compressed.webp', alt: 'Bistro Plynárna - příprava jídel' },
    { src: '/V7_BISTRO_PLYNÁRNA_komplet_page-0008_compressed.webp', alt: 'Bistro Plynárna - prostředí' },
    { src: '/V7_BISTRO_PLYNÁRNA_komplet_page-0009_compressed.webp', alt: 'Bistro Plynárna - obsluha a servis' },
    { src: '/V7_BISTRO_PLYNÁRNA_komplet_page-0011_compressed.webp', alt: 'Bistro Plynárna - menu a pokrmy' },
    { src: '/V7_BISTRO_PLYNÁRNA_komplet_page-0012_compressed.webp', alt: 'Bistro Plynárna - dezerty' },
    { src: '/V7_BISTRO_PLYNÁRNA_komplet_page-0013_compressed.webp', alt: 'Bistro Plynárna - snídaně' },
    { src: '/V7_BISTRO_PLYNÁRNA_komplet_page-0014_compressed.webp', alt: 'Bistro Plynárna - káva a nápoje' },
    { src: '/V7_BISTRO_PLYNÁRNA_komplet_page-0015_compressed.webp', alt: 'Bistro Plynárna - celkový pohled' }
  ];

  const maxVisible = 8; // Show 8, hide 5 (+5 more)
  const visibleImages = galleryImages.slice(0, maxVisible);
  const remainingCount = Math.max(0, galleryImages.length - maxVisible);
  const showOverlay = remainingCount > 0;

  // Gallery layout function - interesting mix with verticals and horizontals
  const getGridItemClass = (index: number) => {
    // Layout: 4 columns, 3 rows, 8 images total
    // Row 1: [Tall 2x1] [Wide 2x1] [Square 1x1]
    // Row 2: [continues] [continues] [Square 1x1] 
    // Row 3: [Square 1x1] [Square 1x1] [Tall 2x1 with overlay]
    switch (index) {
      case 0: return 'col-span-1 row-span-2 rounded-2xl'; // Tall (spans rows 1-2)
      case 1: return 'col-span-2 row-span-1 rounded-2xl'; // Wide (spans cols 2-3, row 1)
      case 2: return 'col-span-1 row-span-1 rounded-2xl'; // Square (col 4, row 1)
      case 3: return 'col-span-2 row-span-1 rounded-2xl'; // Wide (spans cols 2-3, row 2)
      case 4: return 'col-span-1 row-span-1 rounded-2xl'; // Square (col 4, row 2)
      case 5: return 'col-span-1 row-span-1 rounded-2xl'; // Square (col 1, row 3)
      case 6: return 'col-span-1 row-span-1 rounded-2xl'; // Square (col 2, row 3)
      case 7: return 'col-span-2 row-span-1 rounded-2xl'; // Wide with overlay (bottom right, spans 2 columns)
      default: return 'col-span-1 row-span-1 rounded-2xl';
    }
  };

  // Preload adjacent images
  const preloadImage = useCallback((index: number) => {
    if (index >= 0 && index < galleryImages.length && !loadedImages.has(index)) {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(index));
      };
      img.src = galleryImages[index].src;
    }
  }, [galleryImages, loadedImages]);

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
    if (currentIndex < galleryImages.length - 1) {
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
    <div className="min-h-screen bg-[var(--color-bg)]">
      <SEOHead pageKey="bistroPlynarna" />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden min-h-[70vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Bistro Plynárna"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-1"></div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[var(--color-accent)]/20 rounded-full blur-3xl z-5"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[var(--color-sage)]/20 rounded-full blur-3xl z-5"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            {/* Hero Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                <Utensils className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-8 leading-tight drop-shadow-2xl">
              {t('pages.bistroPlynarna.hero.title')}
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-lg mb-12">
              {t('pages.bistroPlynarna.hero.subtitle')}
            </p>

            {/* CTA Button */}
            <Link
              to="/menu"
              className="group relative isolate inline-flex items-center space-x-3 px-8 py-4 bg-[var(--color-accent)] text-white font-semibold text-lg tracking-wider uppercase rounded-full overflow-hidden transition-all duration-300 focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 shadow-lg hover:shadow-2xl hover:shadow-[var(--color-accent)]/40"
            >
              <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 bg-gradient-to-r from-[#D4A574] to-[#B8954F] group-hover:opacity-100" />
              <span className="relative z-10">{t('pages.bistroPlynarna.hero.cta')}</span>
              <ArrowRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="relative pt-20 pb-12 lg:pt-24 lg:pb-16 overflow-hidden bg-white">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[var(--color-accent)]/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[var(--color-sage)]/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[var(--color-primary)] mb-8 leading-tight">
              {t('pages.bistroPlynarna.sections.whyChooseUs')}<br />
              <span className="text-[var(--color-accent)]">{t('pages.bistroPlynarna.sections.whyChooseUsHighlight')}</span>
            </h2>
            <div className="flex justify-center mb-8">
              <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-sage)] rounded-full"></div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16">
              {/* Point 1 */}
              <div className="group bg-white rounded-3xl p-8 lg:p-10 shadow-xl border-2 border-[var(--color-accent)]/30 text-center hover:shadow-2xl hover:shadow-[var(--color-accent)]/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--color-accent)]/5 to-transparent rounded-bl-full"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-[var(--color-accent)] rounded-full flex items-center justify-center mx-auto mb-6">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-[var(--color-accent)] rounded-full"></div>
                    </div>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-[var(--color-primary)] mb-4">
                    {t('pages.bistroPlynarna.features.honestLunches')}
                  </h3>
                  <p className="text-lg text-[var(--color-text)]/80 leading-relaxed">
                    {t('pages.bistroPlynarna.features.honestLunchesDesc')}
                  </p>
                </div>
              </div>

              {/* Point 2 */}
              <div className="group bg-white rounded-3xl p-8 lg:p-10 shadow-xl border-2 border-[var(--color-sage)]/30 text-center hover:shadow-2xl hover:shadow-[var(--color-sage)]/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--color-sage)]/5 to-transparent rounded-bl-full"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-[var(--color-sage)] rounded-full flex items-center justify-center mx-auto mb-6">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-[var(--color-sage)] rounded-full"></div>
                    </div>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-[var(--color-primary)] mb-4">
                    {t('pages.bistroPlynarna.features.homemadeDesserts')}
                  </h3>
                  <p className="text-lg text-[var(--color-text)]/80 leading-relaxed">
                    {t('pages.bistroPlynarna.features.homemadeDessertsDesc')}
                  </p>
                </div>
              </div>

              {/* Point 3 */}
              <div className="group bg-white rounded-3xl p-8 lg:p-10 shadow-xl border-2 border-[var(--color-primary)]/30 text-center hover:shadow-2xl hover:shadow-[var(--color-primary)]/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--color-primary)]/5 to-transparent rounded-bl-full"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-6">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-[var(--color-primary)] rounded-full"></div>
                    </div>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-[var(--color-primary)] mb-4">
                    {t('pages.bistroPlynarna.features.friendlyBistro')}
                  </h3>
                  <p className="text-lg text-[var(--color-text)]/80 leading-relaxed">
                    {t('pages.bistroPlynarna.features.friendlyBistroDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="pt-8 pb-24 lg:pt-12 lg:pb-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Gallery Grid */}
          <div className="grid grid-cols-4 gap-3 lg:gap-4 auto-rows-[180px] md:auto-rows-[200px]">
            {visibleImages.map((image, index) => {
              const isLastImage = index === visibleImages.length - 1;
              const shouldShowOverlay = showOverlay && isLastImage;
              
              return (
                <div
                  key={index}
                  className={`group relative overflow-hidden bg-gray-100 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-black/10 ${getGridItemClass(index)}`}
                  onClick={() => openLightbox(index)}
                >
                  {/* Skeleton loader */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-50 to-gray-200 animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
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
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-black/0 group-hover:from-black/30 group-hover:via-black/10 group-hover:to-black/20 transition-all duration-500 ${shouldShowOverlay ? 'from-black/60 via-black/40 to-black/60' : ''}`} />
                  
                  {/* "+X more" overlay for last image */}
                  {shouldShowOverlay && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
                      <div className="text-2xl lg:text-3xl font-bold mb-2">
                        +{remainingCount}
                      </div>
                      <div className="text-sm lg:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-4">
                        {t('common.showAll', { count: galleryImages.length })}
                      </div>
                    </div>
                  )}
                  
                  {/* Futuristic bottom accent line */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-sage)] group-hover:w-full transition-all duration-700 ease-out"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Naše obědy Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background with subtle pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8F5F0] via-white to-[#F5F1EB] -z-10"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[var(--color-accent)]/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[var(--color-sage)]/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[var(--color-primary)] mb-8 leading-tight">
              {t('pages.bistroPlynarna.sections.ourLunches')}
            </h2>
            <div className="flex justify-center mb-8">
              <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-sage)] rounded-full"></div>
            </div>
          </div>

          {/* Main content */}
          <div className="max-w-5xl mx-auto">
            {/* Intro text */}
            <div className="text-center mb-16">
              <p className="text-lg lg:text-xl text-[var(--color-text)]/80 leading-relaxed max-w-4xl mx-auto">
                {t('pages.bistroPlynarna.lunchDescription')}
              </p>
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-[var(--color-accent)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-[var(--color-accent)] rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[var(--color-primary)] mb-3">
                  {t('pages.bistroPlynarna.lunchTypes.quickMeals')}
                </h3>
                <p className="text-sm text-[var(--color-text)]/70 leading-relaxed">
                  {t('pages.bistroPlynarna.lunchTypes.quickMealsDesc')}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[var(--color-sage)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-[var(--color-sage)] rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[var(--color-primary)] mb-3">
                  {t('pages.bistroPlynarna.lunchTypes.lightLunches')}
                </h3>
                <p className="text-sm text-[var(--color-text)]/70 leading-relaxed">
                  {t('pages.bistroPlynarna.lunchTypes.lightLunchesDesc')}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-[var(--color-primary)] rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[var(--color-primary)] mb-3">
                  {t('pages.bistroPlynarna.lunchTypes.specialties')}
                </h3>
                <p className="text-sm text-[var(--color-text)]/70 leading-relaxed">
                  {t('pages.bistroPlynarna.lunchTypes.specialtiesDesc')}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#D4A574] rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-[#D4A574] rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[var(--color-primary)] mb-3">
                  {t('pages.bistroPlynarna.lunchTypes.desserts')}
                </h3>
                <p className="text-sm text-[var(--color-text)]/70 leading-relaxed">
                  {t('pages.bistroPlynarna.lunchTypes.dessertsDesc')}
                </p>
              </div>
            </div>

            {/* Bottom text */}
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-lg border border-gray-100 text-center">
              <p className="text-base lg:text-lg text-[var(--color-text)]/80 leading-relaxed">
                {t('pages.bistroPlynarna.dailyMenu')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Snídaně Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[var(--color-primary)] mb-8 leading-tight">
              {t('pages.bistroPlynarna.sections.breakfast')}
            </h2>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-sage)] rounded-full"></div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Intro */}
            <div className="text-center mb-16">
              <p className="text-lg lg:text-xl text-[var(--color-text)]/80 leading-relaxed max-w-4xl mx-auto mb-8">
                {t('pages.bistroPlynarna.breakfastDescription')}
              </p>
            </div>

            {/* Breakfast items grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-8 h-8 bg-[var(--color-accent)] rounded-full"></div>
                </div>
                <h3 className="text-sm font-bold text-[var(--color-primary)] mb-2">
                  {t('pages.bistroPlynarna.breakfastItems.freshPastry')}
                </h3>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[var(--color-sage)]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-8 h-8 bg-[var(--color-sage)] rounded-full"></div>
                </div>
                <h3 className="text-sm font-bold text-[var(--color-primary)] mb-2">
                  {t('pages.bistroPlynarna.breakfastItems.sandwiches')}
                </h3>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full"></div>
                </div>
                <h3 className="text-sm font-bold text-[var(--color-primary)] mb-2">
                  {t('pages.bistroPlynarna.breakfastItems.eggs')}
                </h3>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#D4A574]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-8 h-8 bg-[#D4A574] rounded-full"></div>
                </div>
                <h3 className="text-sm font-bold text-[var(--color-primary)] mb-2">
                  {t('pages.bistroPlynarna.breakfastItems.cakes')}
                </h3>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#B8954F]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-8 h-8 bg-[#B8954F] rounded-full"></div>
                </div>
                <h3 className="text-sm font-bold text-[var(--color-primary)] mb-2">
                  {t('pages.bistroPlynarna.breakfastItems.desserts')}
                </h3>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#8C9287]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-8 h-8 bg-[#8C9287] rounded-full"></div>
                </div>
                <h3 className="text-sm font-bold text-[var(--color-primary)] mb-2">
                  {t('pages.bistroPlynarna.breakfastItems.croissants')}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu CTA */}
      <MenuCTA />

      {/* Contact Form Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#F8F5F0] via-white to-[#F5F1EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm />
        </div>
      </section>

      {/* Lightbox */}
      {isOpen && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={t('common.gallery')}
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
            aria-label={t('common.close') + ' ' + t('common.gallery').toLowerCase()}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image counter */}
          <div className="absolute top-6 left-6 z-[10000] px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium">
            {currentIndex + 1} / {galleryImages.length}
          </div>

          {/* Navigation arrows */}
          {currentIndex > 0 && (
            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-[10000] p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors duration-200 backdrop-blur-sm"
              aria-label={t('common.previous') + ' image'}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {currentIndex < galleryImages.length - 1 && (
            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-[10000] p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors duration-200 backdrop-blur-sm"
              aria-label={t('common.next') + ' image'}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Main image */}
          <div className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center overflow-hidden">
            <img
              ref={imageRef}
              src={galleryImages[currentIndex].src}
              alt={galleryImages[currentIndex].alt}
              className="max-w-full max-h-full object-contain transition-transform duration-300 select-none"
              style={{
                transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
                cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
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
    </div>
  );
};

export default BistroPlynarna;