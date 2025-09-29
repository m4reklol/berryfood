import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import Gallery from '../components/Gallery';
import MenuCTA from '../components/MenuCTA';
import ContactForm from '../components/ContactForm';
import SEOHead from '../components/SEOHead';
import {
  Coffee,
  Users,
  PartyPopper,
  Monitor,
  PenTool,
  AirVent,
  TreePine,
  ChefHat,
  Utensils,
  Music,
  Presentation,
  Sparkles,
  Key,
  Award,
  Heart,
  Mail,
  Phone,
  Clock,
  MapPin,
  Car,
  Bike,
  Bus,
  Lightbulb,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

const BistroBudex = () => {
  const { t } = useTranslation('bistroBudex');

  // Second gallery state management
  const [isSecondGalleryOpen, setIsSecondGalleryOpen] = React.useState(false);
  const [secondGalleryIndex, setSecondGalleryIndex] = React.useState(0);
  const [secondGalleryScale, setSecondGalleryScale] = React.useState(1);
  const [secondGalleryTranslateX, setSecondGalleryTranslateX] = React.useState(0);
  const [secondGalleryTranslateY, setSecondGalleryTranslateY] = React.useState(0);
  const [secondGalleryIsDragging, setSecondGalleryIsDragging] = React.useState(false);
  const [secondGalleryDragStart, setSecondGalleryDragStart] = React.useState({ x: 0, y: 0 });
  const [secondGalleryLastTap, setSecondGalleryLastTap] = React.useState(0);
  const [secondGalleryTouchDistance, setSecondGalleryTouchDistance] = React.useState(0);
  const [secondGalleryInitialTouchDistance, setSecondGalleryInitialTouchDistance] = React.useState(0);
  const [secondGalleryInitialScale, setSecondGalleryInitialScale] = React.useState(1);

  // Second gallery images data
  const secondGalleryImages = [
    { src: '/vertical1_compressed.webp', alt: 'Bistro BUDEX interiér a atmosféra' },
    { src: '/horizontal4_compressed.webp', alt: 'Bistro BUDEX čerstvé jídlo' },
    { src: '/horizontal10_compressed.webp', alt: 'Bistro BUDEX speciality' },
    { src: '/vertical2_compressed.webp', alt: 'Bistro BUDEX prostředí a obsluha' },
    { src: '/horizontal6_compressed.webp', alt: 'Bistro BUDEX pokrmy' },
    { src: '/horizontal3_compressed.webp', alt: 'Bistro BUDEX menu' },
    { src: '/horizontal8_compressed.webp', alt: 'Bistro BUDEX kuchyně' },
    { src: '/horizontal1_compressed.webp', alt: 'Bistro BUDEX příprava jídel' },
    { src: '/horizontal7_compressed.webp', alt: 'Bistro BUDEX denní nabídka' },
  ];

  // Gallery images - placeholder images with consistent styling
  const galleryImages = [
    { src: '/horizontal7.webp', alt: 'Bistro BUDEX atmosféra' },
    { src: '/vertical1.webp', alt: 'Gastronomické speciality' },
    { src: '/horizontal3.webp', alt: 'Gastronomické speciality' },
    { src: '/horizontal9.webp', alt: 'Gastronomické speciality' },
    { src: '/horizontal1.webp', alt: 'Profesionální zázemí' },
    { src: '/horizontal5.webp', alt: 'Káva a cukrárna' },
    { src: '/horizontal4.webp', alt: 'Business setkání' },
    { src: '/horizontal10.webp', alt: 'Venkovní terasa' },
    { src: '/horizontal2.webp', alt: 'Firemní akce' },
    { src: '/horizontal6.webp', alt: 'Kreativní brunche' },
    { src: '/horizontal8.webp', alt: 'Večerní networking' },
  ];

  // Second gallery functions
  const openSecondGallery = (index: number) => {
    setSecondGalleryIndex(index);
    setIsSecondGalleryOpen(true);
    setSecondGalleryScale(1);
    setSecondGalleryTranslateX(0);
    setSecondGalleryTranslateY(0);
    document.body.style.overflow = 'hidden';
  };

  const closeSecondGallery = () => {
    setIsSecondGalleryOpen(false);
    setSecondGalleryScale(1);
    setSecondGalleryTranslateX(0);
    setSecondGalleryTranslateY(0);
    document.body.style.overflow = '';
  };

  const nextSecondGalleryImage = () => {
    if (secondGalleryIndex < secondGalleryImages.length - 1) {
      setSecondGalleryIndex(secondGalleryIndex + 1);
      resetSecondGalleryZoom();
    }
  };

  const prevSecondGalleryImage = () => {
    if (secondGalleryIndex > 0) {
      setSecondGalleryIndex(secondGalleryIndex - 1);
      resetSecondGalleryZoom();
    }
  };

  const resetSecondGalleryZoom = () => {
    setSecondGalleryScale(1);
    setSecondGalleryTranslateX(0);
    setSecondGalleryTranslateY(0);
  };

  // Touch distance calculation for second gallery
  const getSecondGalleryTouchDistance = (touches: TouchList) => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  // Second gallery keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSecondGalleryOpen) return;
      switch (e.key) {
        case 'Escape':
          closeSecondGallery();
          break;
        case 'ArrowLeft':
          prevSecondGalleryImage();
          break;
        case 'ArrowRight':
          nextSecondGalleryImage();
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSecondGalleryOpen, secondGalleryIndex]);

  // Second gallery cleanup on unmount
  React.useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Second gallery mouse wheel zoom
  const handleSecondGalleryWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(secondGalleryScale * delta, 0.5), 4);
    setSecondGalleryScale(newScale);
    if (newScale === 1) {
      setSecondGalleryTranslateX(0);
      setSecondGalleryTranslateY(0);
    }
  };

  // Second gallery double tap zoom
  const handleSecondGalleryDoubleClick = () => {
    if (secondGalleryScale > 1) {
      resetSecondGalleryZoom();
    } else {
      setSecondGalleryScale(2);
    }
  };

  // Second gallery touch handlers
  const handleSecondGalleryTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - secondGalleryLastTap;
      if (tapLength < 500 && tapLength > 0) {
        handleSecondGalleryDoubleClick();
      }
      setSecondGalleryLastTap(currentTime);
      setSecondGalleryIsDragging(true);
      setSecondGalleryDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2) {
      const distance = getSecondGalleryTouchDistance(e.touches);
      setSecondGalleryInitialTouchDistance(distance);
      setSecondGalleryInitialScale(secondGalleryScale);
      setSecondGalleryTouchDistance(distance);
    }
  };

  const handleSecondGalleryTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 2) {
      // Pinch to zoom
      const distance = getSecondGalleryTouchDistance(e.touches);
      if (secondGalleryInitialTouchDistance > 0) {
        const scaleChange = distance / secondGalleryInitialTouchDistance;
        const newScale = Math.min(Math.max(secondGalleryInitialScale * scaleChange, 0.5), 4);
        setSecondGalleryScale(newScale);
      }
    } else if (e.touches.length === 1 && secondGalleryIsDragging && secondGalleryScale > 1) {
      // Pan when zoomed
      const deltaX = e.touches[0].clientX - secondGalleryDragStart.x;
      const deltaY = e.touches[0].clientY - secondGalleryDragStart.y;
      setSecondGalleryTranslateX(secondGalleryTranslateX + deltaX);
      setSecondGalleryTranslateY(secondGalleryTranslateY + deltaY);
      setSecondGalleryDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleSecondGalleryTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      setSecondGalleryIsDragging(false);
      setSecondGalleryInitialTouchDistance(0);
    }
  };

  // Second gallery mouse drag handlers
  const handleSecondGalleryMouseDown = (e: React.MouseEvent) => {
    if (secondGalleryScale > 1) {
      setSecondGalleryIsDragging(true);
      setSecondGalleryDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleSecondGalleryMouseMove = (e: React.MouseEvent) => {
    if (secondGalleryIsDragging && secondGalleryScale > 1) {
      const deltaX = e.clientX - secondGalleryDragStart.x;
      const deltaY = e.clientY - secondGalleryDragStart.y;
      setSecondGalleryTranslateX(secondGalleryTranslateX + deltaX);
      setSecondGalleryTranslateY(secondGalleryTranslateY + deltaY);
      setSecondGalleryDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleSecondGalleryMouseUp = () => {
    setSecondGalleryIsDragging(false);
  };

  // Second gallery swipe detection for mobile
  const [secondGallerySwipeStart, setSecondGallerySwipeStart] = React.useState({ x: 0, y: 0 });
  const [secondGallerySwipeEnd, setSecondGallerySwipeEnd] = React.useState({ x: 0, y: 0 });

  const handleSecondGallerySwipeStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && secondGalleryScale === 1) {
      setSecondGallerySwipeStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleSecondGallerySwipeEnd = (e: React.TouchEvent) => {
    if (e.changedTouches.length === 1 && secondGalleryScale === 1) {
      setSecondGallerySwipeEnd({ x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY });
      const deltaX = secondGallerySwipeStart.x - e.changedTouches[0].clientX;
      const deltaY = Math.abs(secondGallerySwipeStart.y - e.changedTouches[0].clientY);
      // Only trigger swipe if horizontal movement is greater than vertical
      if (Math.abs(deltaX) > 50 && deltaY < 100) {
        if (deltaX > 0) {
          nextSecondGalleryImage();
        } else {
          prevSecondGalleryImage();
        }
      }
    }
  };

  const menuServices = [
    {
      icon: Coffee,
      title: t('lists.menuServices.0.title'),
      description: t('lists.menuServices.0.description'),
    },
    {
      icon: Presentation,
      title: t('lists.menuServices.1.title'),
      description: t('lists.menuServices.1.description'),
    },
    {
      icon: PartyPopper,
      title: t('lists.menuServices.2.title'),
      description: t('lists.menuServices.2.description'),
    },
  ];

  const facilities = [
    { icon: Monitor, text: t('lists.facilities.0') },
    { icon: PenTool, text: t('lists.facilities.1') },
    { icon: Users, text: t('lists.facilities.2') },
    { icon: AirVent, text: t('lists.facilities.3') },
    { icon: TreePine, text: t('lists.facilities.4') },
    { icon: ChefHat, text: t('lists.facilities.5') },
  ];

  const specialties = [
    t('lists.specialties.0'),
    t('lists.specialties.1'),
    t('lists.specialties.2'),
    t('lists.specialties.3'),
  ];

  const experiences = [
    t('lists.experiences.0'),
    t('lists.experiences.1'),
    t('lists.experiences.2'),
    t('lists.experiences.3'),
  ];

  const whyChooseUs = [
    { icon: Sparkles, title: t('lists.whyChooseUs.0') },
    { icon: Key, title: t('lists.whyChooseUs.1') },
    { icon: Award, title: t('lists.whyChooseUs.2') },
    { icon: Heart, title: t('lists.whyChooseUs.3') },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <SEOHead 
        pageKey="bistroBudex" 
        customTitle={t('meta.title')} 
        customDescription={t('meta.description')} 
      />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden min-h-[80vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="/budexhero.webp"
            alt="Bistro BUDEX interiér"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/60 z-1"></div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[var(--color-accent)]/20 rounded-full blur-3xl z-5"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[var(--color-sage)]/20 rounded-full blur-3xl z-5"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            {/* Hero Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                <Coffee className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-8 leading-tight drop-shadow-2xl">
              {t('hero.title')}
            </h1>

            <p className="text-lg lg:text-xl text-white/90 max-w-4xl mx-auto leading-relaxed drop-shadow-lg mb-10">
              {t('hero.subtitle')}
            </p>

            {/* CTA Button */}
            <Link
              to="/kontakt"
              className="inline-flex items-center px-8 py-4 bg-[var(--color-accent)] text-white font-semibold text-lg tracking-wider uppercase rounded-full transition-all duration-300 focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 shadow-lg hover:shadow-2xl hover:shadow-[var(--color-accent)]/40 relative overflow-hidden group"
            >
              <span className="relative z-10">{t('hero.cta')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4A574] to-[#B8954F] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-white via-[#F8F5F0] to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {menuServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 lg:p-10 border border-gray-200/50">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="w-8 h-8 text-[var(--color-accent)]" />
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold text-[var(--color-primary)] mb-6 tracking-wider">
                      {service.title}
                    </h3>
                  </div>
                  <p
                    className="text-base lg:text-lg text-[var(--color-text)]/80 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: service.description }}
                  ></p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Professional Facilities Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[var(--color-primary)] mb-6">
              {t('sections.professionalFacilities')}
            </h2>
            <div className="flex justify-center mb-8">
              <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-sage)] rounded-full"></div>
            </div>
            <p className="text-lg lg:text-xl text-[var(--color-text)]/80 max-w-3xl mx-auto leading-relaxed">
              {t('content.facilitiesIntro')}
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {facilities.map((facility, index) => {
                  const IconComponent = facility.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50/50 transition-colors duration-200"
                    >
                      <div className="w-6 h-6 bg-[var(--color-sage)]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <IconComponent className="w-6 h-6 text-[var(--color-sage)]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-base lg:text-lg text-[var(--color-text)] font-medium">
                          {facility.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Gallery images={galleryImages} maxVisible={8} />
        </div>
      </section>

      {/* Gastronomic Signature Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8F5F0] via-white to-[#F5F1EB]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-[var(--color-accent)]/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tl from-[var(--color-sage)]/10 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10">
            {/* Hero-style header */}
            <div className="text-center mb-16">
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-sage)] rounded-full blur-xl opacity-30 scale-110"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-[var(--color-accent)] via-[#D4A574] to-[var(--color-sage)] rounded-full flex items-center justify-center shadow-2xl">
                  <ChefHat className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
              </div>

              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[var(--color-primary)] mb-6 tracking-tight">
                {t('sections.gastronomicSignature')}{' '}
                <span className="block text-3xl lg:text-4xl xl:text-5xl text-[var(--color-accent)] mt-2">
                  {t('sections.gastronomicSignatureAccent')}
                </span>
              </h2>

              {/* Enhanced BERRY FOOD Card */}
              <div className="relative inline-block mb-8">
                {/* Outer glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] via-[#2A1F15] to-[var(--color-primary)] rounded-2xl blur-lg opacity-40 scale-102"></div>

                {/* Main card background */}
                <div className="relative bg-gradient-to-br from-[var(--color-primary)] via-[#2A1F15] to-[#1A1209] rounded-2xl p-4 lg:p-6 shadow-2xl border border-[var(--color-accent)]/30">
                  {/* Inner texture overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[var(--color-accent)]/5 to-transparent rounded-2xl"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(198,164,93,0.1)_0%,transparent_50%)] rounded-2xl"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(140,146,135,0.08)_0%,transparent_50%)] rounded-2xl"></div>

                  {/* Embossed text effect */}
                  <div className="relative">
                    {/* Text shadow for depth */}
                    <div className="absolute inset-0 text-lg lg:text-xl font-bold uppercase tracking-[0.3em] text-black/30 blur-sm transform translate-x-1 translate-y-1">
                      BERRY FOOD
                    </div>
                    {/* Main text with gradient */}
                    <div className="relative text-lg lg:text-xl font-bold uppercase tracking-[0.3em] bg-gradient-to-r from-[var(--color-accent)] via-[#D4A574] to-[var(--color-sage)] bg-clip-text text-transparent drop-shadow-lg">
                      BERRY FOOD
                    </div>
                    {/* Highlight overlay */}
                    <div className="absolute inset-0 text-lg lg:text-xl font-bold uppercase tracking-[0.3em] text-white/20 blur-[1px] transform -translate-x-0.5 -translate-y-0.5">
                      BERRY FOOD
                    </div>
                  </div>

                  {/* Decorative corner elements */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-[var(--color-accent)]/40 rounded-tl-lg"></div>
                  <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-[var(--color-accent)]/40 rounded-tr-lg"></div>
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-[var(--color-accent)]/40 rounded-bl-lg"></div>
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-[var(--color-accent)]/40 rounded-br-lg"></div>
                </div>
              </div>

              <p className="text-xl lg:text-2xl text-[var(--color-text)]/80 max-w-4xl mx-auto leading-relaxed font-light">
                {t('content.signatureParagraph')}
              </p>
            </div>

            {/* Premium specialties grid */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl p-8 lg:p-12 border border-gray-100 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  {specialties.map((specialty, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-6 h-6 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-sage)] rounded-full flex items-center justify-center shadow-md">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-base lg:text-lg text-[var(--color-text)]/80 leading-relaxed font-medium">
                          {specialty}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experiences Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        {/* Dynamic background with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-[#2A1F15] to-[#1A1209]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-[var(--color-accent)]/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-[var(--color-sage)]/20 to-transparent rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '2s' }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[var(--color-accent)]/10 to-[var(--color-sage)]/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10">
            {/* Cinematic header */}
            <div className="text-center mb-20">
              <div className="relative inline-block mb-10">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-sage)] rounded-full blur-2xl opacity-50 scale-150 animate-pulse"></div>
                <div className="relative w-28 h-28 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl border border-white/20">
                  <Music className="w-14 h-14 text-white drop-shadow-2xl" />
                </div>
              </div>

              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-8 tracking-tight leading-tight">
                {t('sections.whatYouExperience')} <span className="block text-[var(--color-accent)] drop-shadow-2xl">{t('sections.whatYouExperienceAccent')}</span>
              </h2>

              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/30 to-[var(--color-sage)]/30 rounded-full blur-lg"></div>
                  <p className="relative text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed font-light px-10 py-[35px] max-[390px]:py-[50px] sm:py-6 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                    {t('content.experiencesIntro')}
                  </p>
              </div>
            </div>

            {/* Premium experiences grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {experiences.map((experience, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                  }}
                >
                  {/* Mouse-tracking glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div
                      className="absolute w-96 h-96 -translate-x-1/2 -translate-y-1/2 bg-gradient-radial from-[var(--color-accent)]/30 via-[var(--color-sage)]/20 to-transparent rounded-full blur-3xl"
                      style={{ left: 'var(--mouse-x, 50%)', top: 'var(--mouse-y, 50%)' }}
                    ></div>
                  </div>

                  <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 lg:p-10 border border-white/20 hover:bg-white/15 hover:border-white/40 transition-all duration-500 hover:shadow-2xl">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0 mt-2">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-sage)] rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="relative w-2 h-2 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-sage)] rounded-full shadow-xl group-hover:shadow-2xl transition-all duration-500"></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-lg lg:text-xl font-medium leading-relaxed text-white group-hover:text-[var(--color-accent)] transition-colors duration-500">
                          {experience}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-white via-[#F8F5F0] to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 lg:mb-12">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[var(--color-primary)] mb-6 leading-tight">
              {t('sections.whyChooseUs')}
              <br />
              <span className="text-[var(--color-accent)]">{t('sections.whyChooseUsAccent')}</span>
            </h2>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-sage)] rounded-full"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {whyChooseUs.map((reason, index) => {
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 hover:border-[var(--color-accent)]/40 transition-all duration-300 overflow-hidden"
                >
                  {/* Sliding background panel */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-sage)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>

                  {/* Content */}
                  <div className="relative z-10 flex items-center space-x-4">
                    {/* Custom diamond icon */}
                    <div className="flex-shrink-0">
                      <div className="w-4 h-4 bg-[var(--color-accent)] transform rotate-45 group-hover:bg-white group-hover:rotate-[225deg] transition-all duration-500 shadow-sm"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-base lg:text-lg text-[var(--color-text)] font-medium leading-relaxed group-hover:text-white transition-colors duration-300">
                        {reason.title}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Call to action */}
          <div className="text-center mt-8 lg:mt-10">
            <Link
              to="/kontakt"
              className="inline-flex items-center px-8 py-4 bg-[var(--color-accent)] text-white font-semibold text-lg tracking-wider uppercase rounded-full transition-all duration-300 focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 shadow-lg hover:shadow-2xl hover:shadow-[var(--color-accent)]/40 relative overflow-hidden group"
            >
              <span className="relative z-10">{t('cta.reserveDate')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4A574] to-[#B8954F] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Second Gallery Section with Different Layout */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-white via-[#F8F5F0] to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <SecondGallery />
        </div>
      </section>

      {/* Second Gallery Lightbox */}
      {isSecondGalleryOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeSecondGallery();
            }
          }}
        >
          {/* Close button */}
          <button
            onClick={closeSecondGallery}
            className="absolute top-6 right-6 z-[10000] p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors duration-200 backdrop-blur-sm"
            aria-label={t('gallery.closeGallery')}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image counter */}
          <div className="absolute top-6 left-6 z-[10000] px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium">
            {secondGalleryIndex + 1} / {secondGalleryImages.length}
          </div>

          {/* Navigation arrows */}
          {secondGalleryIndex > 0 && (
            <button
              onClick={prevSecondGalleryImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-[10000] p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors duration-200 backdrop-blur-sm"
              aria-label={t('gallery.previousImage')}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          {secondGalleryIndex < secondGalleryImages.length - 1 && (
            <button
              onClick={nextSecondGalleryImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-[10000] p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors duration-200 backdrop-blur-sm"
              aria-label={t('gallery.nextImage')}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Main image */}
          <div className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center overflow-hidden">
            <img
              src={secondGalleryImages[secondGalleryIndex].src}
              alt={secondGalleryImages[secondGalleryIndex].alt}
              className="max-w-full max-h-full object-contain transition-transform duration-300 select-none"
              style={{
                transform: `scale(${secondGalleryScale}) translate(${secondGalleryTranslateX}px, ${secondGalleryTranslateY}px)`,
                cursor:
                  secondGalleryScale > 1
                    ? (secondGalleryIsDragging ? 'grabbing' : 'grab')
                    : 'default',
              }}
              onDoubleClick={handleSecondGalleryDoubleClick}
              onWheel={handleSecondGalleryWheel}
              onTouchStart={handleSecondGalleryTouchStart}
              onTouchMove={handleSecondGalleryTouchMove}
              onTouchEnd={handleSecondGalleryTouchEnd}
              onMouseDown={handleSecondGalleryMouseDown}
              onMouseMove={handleSecondGalleryMouseMove}
              onMouseUp={handleSecondGalleryMouseUp}
              draggable={false}
            />
          </div>
        </div>
      )}

      {/* Menu CTA Section */}
      <MenuCTA />

      {/* Contact Form Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#F8F5F0] via-white to-[#F5F1EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm />
        </div>
      </section>

      {/* Contact & Map Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[var(--color-primary)] mb-6">
              {t('sections.findUs')}
            </h2>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-sage)] rounded-full"></div>
            </div>
          </div>

          {/* Three Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Location Features */}
            <div className="bg-gradient-to-br from-[#F8F5F0] to-white rounded-3xl p-8 lg:p-10 shadow-lg border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[var(--color-sage)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-[var(--color-sage)]" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-[var(--color-primary)] mb-4">{t('sections.availability')}</h3>
                <div className="flex justify-center">
                  <div className="w-12 h-1 bg-[var(--color-sage)] rounded-full"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="w-4 h-4 text-[var(--color-accent)]" />
                  </div>
                  <p className="text-base text-[var(--color-text)]/80 leading-relaxed">
                    {t('lists.availabilityItems.nearCenter')}
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Car className="w-4 h-4 text-[var(--color-accent)]" />
                  </div>
                  <p className="text-base text-[var(--color-text)]/80 leading-relaxed">{t('lists.availabilityItems.goodParking')}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bus className="w-4 h-4 text-[var(--color-accent)]" />
                  </div>
                  <p className="text-base text-[var(--color-text)]/80 leading-relaxed">
                    {t('lists.availabilityItems.nearBikeAndMhd')}
                  </p>
                </div>
              </div>
            </div>

            {/* Atmosphere & Experience */}
            <div className="bg-gradient-to-br from-white to-[#F8F5F0] rounded-3xl p-8 lg:p-10 shadow-lg border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TreePine className="w-8 h-8 text-[var(--color-accent)]" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-[var(--color-primary)] mb-4">{t('sections.atmosphere')}</h3>
                <div className="flex justify-center">
                  <div className="w-12 h-1 bg-[var(--color-accent)] rounded-full"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[var(--color-sage)]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <TreePine className="w-4 h-4 text-[var(--color-sage)]" />
                  </div>
                  <p className="text-base text-[var(--color-text)]/80 leading-relaxed">{t('lists.atmosphereItems.quietEnvironment')}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[var(--color-sage)]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Lightbulb className="w-4 h-4 text-[var(--color-sage)]" />
                  </div>
                  <p className="text-base text-[var(--color-text)]/80 leading-relaxed">{t('lists.atmosphereItems.inspiringSpace')}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[var(--color-sage)]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Utensils className="w-4 h-4 text-[var(--color-sage)]" />
                  </div>
                  <p className="text-base text-[var(--color-text)]/80 leading-relaxed">{t('lists.atmosphereItems.unforgettableTastes')}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-br from-[#F5F1EB] to-white rounded-3xl p-8 lg:p-10 shadow-lg border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-[var(--color-primary)]" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-[var(--color-primary)] mb-4">{t('sections.contact')}</h3>
                <div className="flex justify-center">
                  <div className="w-12 h-1 bg-[var(--color-primary)] rounded-full"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <a
                      href="mailto:budex@berryfood.cz"
                      className="text-base text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors duration-200"
                    >
                      budex@berryfood.cz
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <a
                      href="tel:+420774115898"
                      className="text-base text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors duration-200"
                    >
                      774 115 898
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <span className="text-base text-[var(--color-primary)]">7:30 — 15:00</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="w-4 h-4 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <a
                      href="https://maps.google.com/?q=Planá+67,+370+01+České+Budějovice"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors duration-200"
                    >
                      <address className="not-italic">
                        Planá 67
                        <br />
                        370 01 České Budějovice
                      </address>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps - Full Width Below */}
          <div className="mt-12 lg:mt-16">
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-lg border border-gray-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2625.123456789!2d14.4567890123456!3d48.9876543210987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDU5JzE1LjYiTiAxNMKwMjcnMjQuNCJF!5e0!3m2!1scs!2scz!4v1234567890123"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-2xl"
                title={t('content.mapTitle')}
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Second Gallery Component - Custom Implementation
const SecondGallery = () => {
  const { t } = useTranslation('bistroBudex');
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [scale, setScale] = React.useState(1);
  const [translateX, setTranslateX] = React.useState(0);
  const [translateY, setTranslateY] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [lastTap, setLastTap] = React.useState(0);

  // All 12 images for second gallery
  const images = [
    { src: '/vertical1_compressed.webp', alt: 'Bistro BUDEX interiér a atmosféra' },
    { src: '/horizontal4_compressed.webp', alt: 'Bistro BUDEX čerstvé jídlo' },
    { src: '/horizontal10_compressed.webp', alt: 'Bistro BUDEX speciality' },
    { src: '/horizontal6_compressed.webp', alt: 'Bistro BUDEX pokrmy' },
    { src: '/vertical2_compressed.webp', alt: 'Bistro BUDEX prostředí a obsluha' },
    { src: '/horizontal3_compressed.webp', alt: 'Bistro BUDEX menu' },
    { src: '/horizontal8_compressed.webp', alt: 'Bistro BUDEX kuchyně' },
    { src: '/horizontal1_compressed.webp', alt: 'Bistro BUDEX příprava jídel' },
    { src: '/horizontal7_compressed.webp', alt: 'Bistro BUDEX denní nabídka' },
    { src: '/horizontal2_compressed.webp', alt: 'Bistro BUDEX atmosféra' },
    { src: '/horizontal5_compressed.webp', alt: 'Bistro BUDEX kvalitní jídlo' },
    { src: '/horizontal9_compressed.webp', alt: 'Bistro BUDEX profesionální přístup' },
  ];

  const maxVisible = 9;
  const remainingCount = images.length - maxVisible;

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

  const handleDoubleClick = () => {
    if (scale > 1) {
      resetZoom();
    } else {
      setScale(2);
    }
  };

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

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      if (tapLength < 500 && tapLength > 0) {
        handleDoubleClick();
      }
      setLastTap(currentTime);
      if (scale > 1) {
        setIsDragging(true);
        setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1 && isDragging && scale > 1) {
      const deltaX = e.touches[0].clientX - dragStart.x;
      const deltaY = e.touches[0].clientY - dragStart.y;
      setTranslateX(translateX + deltaX);
      setTranslateY(translateY + deltaY);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Keyboard navigation
  React.useEffect(() => {
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
  React.useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Custom grid layout classes
  const getGridItemClass = (index: number) => {
    switch (index) {
      case 0:
        return 'col-span-1 row-span-2 rounded-2xl'; // Vertical
      case 1:
        return 'col-span-1 row-span-1 rounded-2xl'; // Square
      case 2:
        return 'col-span-1 row-span-1 rounded-2xl'; // Square
      case 3:
        return 'col-span-2 row-span-1 rounded-2xl'; // Wide
      case 4:
        return 'col-span-1 row-span-2 rounded-2xl'; // Vertical
      case 5:
        return 'col-span-1 row-span-1 rounded-2xl'; // Square
      case 6:
        return 'col-span-1 row-span-1 rounded-2xl'; // Square
      case 7:
        return 'col-span-1 row-span-1 rounded-2xl'; // Square
      case 8:
        return 'col-span-1 row-span-1 rounded-2xl'; // Square (last visible)
      default:
        return 'col-span-1 row-span-1 rounded-2xl';
    }
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-3 gap-3 lg:gap-4 auto-rows-[200px] md:auto-rows-[220px]">
        {images.slice(0, maxVisible).map((image, index) => {
          const isLastImage = index === maxVisible - 1;
          const shouldShowOverlay = remainingCount > 0 && isLastImage;

          return (
            <div
              key={index}
              className={`group relative overflow-hidden bg-gray-100 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-black/10 ${getGridItemClass(
                index
              )}`}
              onClick={() => openLightbox(index)}
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
                    {t('gallery.showAll', { count: images.length })}
                  </div>
                </div>
              )}

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-sage)] group-hover:w-full transition-all duration-700 ease-out"></div>
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={(e) => {
            if (e.currentTarget === e.target) {
              closeLightbox();
            }
          }}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-[10000] p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors duration-200 backdrop-blur-sm"
            aria-label={t('gallery.closeGallery')}
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
              aria-label={t('gallery.previousImage')}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          {currentIndex < images.length - 1 && (
            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-[10000] p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors duration-200 backdrop-blur-sm"
              aria-label={t('gallery.nextImage')}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Main image */}
          <div className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center overflow-hidden">
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="max-w-full max-h-full object-contain transition-transform duration-300 select-none"
              style={{
                transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
                cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
              }}
              onDoubleClick={handleDoubleClick}
              onWheel={handleWheel}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              draggable={false}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default BistroBudex;