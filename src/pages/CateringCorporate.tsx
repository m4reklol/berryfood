import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';
import SubpageHero from '../components/catering/SubpageHero';
import CateringLeadModal from '../components/catering/CateringLeadModal';
import SectionSeparator from '../components/catering/SectionSeparator';
import CateringCategoryGallery from '../components/catering/CateringCategoryGallery';
import Breadcrumb from '../components/common/Breadcrumb';
import Spoluprace from '../components/Spoluprace';
import SEOHead from '../components/SEOHead';

interface GalleryImage {
  src: string;
  alt: string;
}

const CateringCorporate = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Gallery images (12 total, showing 8)
  const galleryImages: GalleryImage[] = [
    { src: '/firemniintrogallery1.jpg', alt: 'Firemní catering 1' },
    { src: '/firemniintrogallery2.jpg', alt: 'Firemní catering 2' },
    { src: '/firemniintrogallery3.jpg', alt: 'Firemní catering 3' },
    { src: '/firemniintrogallery4.jpg', alt: 'Firemní catering 4' },
    { src: '/firemniintrogallery5.jpg', alt: 'Firemní catering 5' },
    { src: '/firemniintrogallery6.jpg', alt: 'Firemní catering 6' },
    { src: '/firemniintrogallery7.jpg', alt: 'Firemní catering 7' },
    { src: '/firemniintrogallery8.jpg', alt: 'Firemní catering 8' }
  ];

  // Translation for gallery overlay
  const showAllLabel = t('common.showAll', { count: galleryImages.length });

  // Gallery state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
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

  const maxVisible = 7; // Layout actually shows only 7 images
  const visibleImages = galleryImages.slice(0, maxVisible);
  const remainingCount = Math.max(0, galleryImages.length - maxVisible);
  const showOverlay = remainingCount > 0;

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
    if (isLightboxOpen) {
      preloadImage(currentIndex);
      preloadImage(currentIndex - 1);
      preloadImage(currentIndex + 1);
    }
  }, [isLightboxOpen, currentIndex, preloadImage]);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
  };

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsLightboxOpen(true);
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
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
      if (!isLightboxOpen) return;

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
  }, [isLightboxOpen, currentIndex]);

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

  const handleSwipeStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && scale === 1) {
      setSwipeStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleSwipeEnd = (e: React.TouchEvent) => {
    if (e.changedTouches.length === 1 && scale === 1) {
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

  const occasions = [
    {
      title: 'KONFERENCE',
      description: '(doplnit popis od klienta)'
    },
    {
      title: 'FIREMNÍ VEČÍRKY',
      description: '(doplnit popis od klienta)'
    },
    {
      title: 'OPEN DAY',
      description: '(doplnit popis od klienta)'
    },
    {
      title: 'TEAMBUILDING',
      description: '(doplnit popis od klienta)'
    }
  ];

  const breadcrumbItems = [
    { label: t('navigation.catering'), href: '/catering' },
    { label: t('navigation.corporate'), current: true }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <SEOHead pageKey="corporateCatering" />
      
      {/* Hero Section */}
      <SubpageHero
        title={t('pages.corporateCatering.hero.title')}
        subtitle={t('pages.corporateCatering.hero.subtitle')}
        imagePlaceholder="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1920"
        imagePlaceholder="/herofiremnicatering.avif"
        ctaText={t('cta.requestCorporateCatering')}
        onCtaClick={openModal}
        icon={Building2}
      />

      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Intro Section */}
      <section className="py-4 lg:py-6 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[var(--color-accent)]/10 to-transparent rounded-bl-full"></div>
              
              <div className="relative z-10 space-y-6 lg:space-y-8 text-lg lg:text-xl text-[var(--color-text)] leading-relaxed">
                <p className="font-semibold text-[var(--color-primary)] text-xl lg:text-2xl leading-relaxed border-l-4 border-[var(--color-accent)] pl-6 mb-8">
                  {t('pages.corporateCatering.intro.highlight')}
                </p>
                
                <p className="leading-loose">
                  {t('pages.corporateCatering.intro.text1')}
                </p>
                
                <p className="leading-loose">
                  {t('pages.corporateCatering.intro.text2')}
                </p>
                
                <p className="leading-loose">
                  {t('pages.corporateCatering.intro.text3')}
                </p>
                
                <p className="leading-loose">
                  {t('pages.corporateCatering.intro.text4')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Gallery - No title, close to intro */}
      <section className="py-8 lg:py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Gallery Grid - Asymmetric collage layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 auto-rows-[220px] md:auto-rows-[280px]">
            {visibleImages.map((image, index) => {
              // Tablet: 6 photos (2 cols × 3 rows), Desktop: 7 photos (asymmetric)
              const maxVisibleTablet = 6;
              const maxVisibleDesktop = 7;
              
              // Don't render more than needed for each breakpoint
              const shouldRenderOnTablet = index < maxVisibleTablet;
              const shouldRenderOnDesktop = index < maxVisibleDesktop;
              
              // Overlay logic
              const isLastVisibleTablet = index === (maxVisibleTablet - 1);
              const isLastVisibleDesktop = index === (maxVisibleDesktop - 1);
              const shouldShowOverlay = remainingCount > 0 && (
                (window.innerWidth < 1024 && isLastVisibleTablet) || 
                (window.innerWidth >= 1024 && isLastVisibleDesktop)
              );
              
              // Don't render if beyond desktop limit
              if (index >= maxVisibleDesktop) return null;
              
              // Grid classes: Tablet = uniform 1x1, Desktop = asymmetric
              let gridClass = '';
              
              // Tablet: all photos are 1x1, show only first 6
              if (index < maxVisibleTablet) {
                gridClass = 'md:col-span-1 md:row-span-1';
              }
              
              // Desktop: asymmetric layout for all 7 photos
              switch (index) {
                case 0:
                  gridClass += ' lg:col-span-2 lg:row-span-1';
                  break;
                case 1:
                  gridClass += ' lg:col-span-1 lg:row-span-1';
                  break;
                case 2:
                  gridClass += ' lg:col-span-1 lg:row-span-1';
                  break;
                case 3:
                  gridClass += ' lg:col-span-1 lg:row-span-1';
                  break;
                case 4:
                  gridClass += ' lg:col-span-1 lg:row-span-1';
                  break;
                case 5:
                  gridClass += ' lg:col-span-2 lg:row-span-1';
                  break;
                case 6:
                  gridClass += ' lg:col-span-1 lg:row-span-1 hidden lg:block';
                  break;
              }
              
              return (
                <div
                  key={index}
                  className={`group relative overflow-hidden bg-gray-100 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-black/10 rounded-2xl ${gridClass}`}
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
                        <span className="md:hidden lg:hidden">+{galleryImages.length - maxVisibleDesktop}</span>
                        <span className="hidden md:block lg:hidden">+{galleryImages.length - maxVisibleTablet}</span>
                        <span className="hidden lg:block">+{galleryImages.length - maxVisibleDesktop}</span>
                      </div>
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
        </div>
      </section>

      <SectionSeparator />

      {/* Occasions Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#F8F5F0] via-white to-[#F5F1EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[var(--color-primary)] mb-8 leading-tight">
              {t('pages.corporateCatering.sections.occasions')}
            </h2>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-sage)] rounded-full"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { title: t('pages.corporateCatering.occasions.conferences') },
              { title: t('pages.corporateCatering.occasions.corporateParties') },
              { title: t('pages.corporateCatering.occasions.openDay') },
              { title: t('pages.corporateCatering.occasions.teambuilding') }
            ].map((occasion, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-lg border border-gray-100 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--color-accent)]/5 to-transparent rounded-bl-full"></div>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[var(--color-accent)] to-[#B8954F] rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-[var(--color-accent)] rounded-full"></div>
                    </div>
                  </div>
                  <h3 className="text-xs sm:text-sm md:text-lg font-bold text-[var(--color-primary)] mb-2 md:mb-4 tracking-wider leading-tight">
                    {occasion.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionSeparator />

      {/* Category Gallery */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-white via-[#F8F5F0] to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[var(--color-primary)] mb-8 leading-tight">
              {t('pages.corporateCatering.sections.foodTypes')}
            </h2>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-sage)] rounded-full"></div>
            </div>
          </div>

          <CateringCategoryGallery />
        </div>
      </section>

      <SectionSeparator />

      {/* How We Work Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#F8F5F0] via-white to-[#F5F1EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[var(--color-primary)] mb-8 leading-tight">
              {t('pages.corporateCatering.sections.howWeWork')}
            </h2>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-sage)] rounded-full"></div>
            </div>
            <div className="max-w-4xl mx-auto mt-8">
              <div className="text-lg lg:text-xl text-[var(--color-text)] leading-relaxed space-y-6">
                {t('workingPrinciples.description').split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: t('workingPrinciples.locality.title'),
                description: t('workingPrinciples.locality.description'),
                icon: '🌱'
              },
              {
                title: t('workingPrinciples.uniqueness.title'),
                description: t('workingPrinciples.uniqueness.description'),
                icon: '✨'
              },
              {
                title: t('workingPrinciples.precision.title'),
                description: t('workingPrinciples.precision.description'),
                icon: '🎯'
              },
              {
                title: t('workingPrinciples.service.title'),
                description: t('workingPrinciples.service.description'),
                icon: '🍽️'
              }
            ].map((principle, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-100 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--color-accent)]/5 to-transparent rounded-bl-full"></div>
                
                <div className="relative z-10">
                  <div className="text-3xl md:text-4xl mb-4 md:mb-6">{principle.icon}</div>
                  <h3 className="text-lg md:text-xl font-bold text-[var(--color-primary)] mb-3 md:mb-4 tracking-wider">
                    {principle.title}
                  </h3>
                  <p className="text-sm md:text-base text-[var(--color-text)]/80 leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spoluprace Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Spoluprace />
        </div>
      </section> 

      {/* Final CTA */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-[var(--color-primary)] via-[#2A1F15] to-[var(--color-primary)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-32 h-32 bg-[var(--color-accent)] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-40 h-40 bg-[var(--color-sage)] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[var(--color-accent)]/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-[var(--color-accent)]" />
            </div>
          </div>
          
          <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-4 leading-tight">
            {t('pages.corporateCatering.sections.finalCta')}
          </h2>
          
          <p className="text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('pages.corporateCatering.sections.finalCtaSubtitle')}
          </p>
          <button
            onClick={openModal}
            className="group relative isolate inline-flex items-center space-x-3 px-8 py-4 bg-[var(--color-accent)] text-white font-semibold text-lg tracking-wider uppercase rounded-full overflow-hidden transition-all duration-300 focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 shadow-lg hover:shadow-2xl hover:shadow-[var(--color-accent)]/40"
          >
            <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 bg-gradient-to-r from-[#D4A574] to-[#B8954F] group-hover:opacity-100" />
            <span className="relative z-10">{t('cta.requestCorporateCatering')}</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </section>

      {/* Lead Modal */}
      <CateringLeadModal isOpen={isModalOpen} onClose={closeModal} />

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          role="dialog"
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
            {currentIndex + 1} / {galleryImages.length}
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

          {currentIndex < galleryImages.length - 1 && (
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

export default CateringCorporate;