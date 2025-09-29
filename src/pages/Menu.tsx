import React from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { AlertCircle, RefreshCw, Utensils, X, ZoomIn } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const Menu = () => {
  const { t } = useTranslation();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [lastTap, setLastTap] = useState(0);
  const [isAllergensModalOpen, setIsAllergensModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
    document.body.style.overflow = '';
  };

  const openAllergensModal = () => {
    setIsAllergensModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeAllergensModal = () => {
    setIsAllergensModalOpen(false);
    document.body.style.overflow = '';
  };

  const handleDoubleClick = () => {
    if (scale > 1) {
      setScale(1);
      setTranslateX(0);
      setTranslateY(0);
    } else {
      setScale(2);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      if (tapLength < 500 && tapLength > 0) {
        // Double tap detected
        handleDoubleClick();
      }
      setLastTap(currentTime);
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

  // Close modal on escape key and handle cleanup
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isAllergensModalOpen) {
          closeAllergensModal();
        } else {
          closeModal();
        }
      }
    };

    if (isModalOpen || isAllergensModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen, isAllergensModalOpen]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const loadMenuImage = async () => {
    try {
      setError(null);
      
      // Get public URL for the daily menu image with cache bust
      const { data } = supabase.storage
        .from('menus')
        .getPublicUrl(`daily-menu.webp?v=${Date.now()}`);
      
      if (data?.publicUrl) {
        // Check if image actually exists by trying to fetch it
        try {
          const response = await fetch(data.publicUrl, { method: 'HEAD' });
          if (response.ok) {
            setImageUrl(data.publicUrl);
          } else {
            setImageUrl(null);
          }
        } catch (fetchError) {
          // If fetch fails, assume image doesn't exist
          setImageUrl(null);
        }
      } else {
        setImageUrl(null);
      }
    } catch (err) {
      console.error('Error loading menu image:', err);
      setImageUrl(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMenuImage();
  };

  useEffect(() => {
    loadMenuImage();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <SEOHead pageKey="menu" />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden min-h-[70vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1920"
            src="/heromenu.avif"
            alt="Jídelní lístek Berry Food"
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
              {t('pages.menu.hero.title')}
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
              {t('pages.menu.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Menu Content Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-white via-[#F8F5F0] to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-lg border border-gray-100 relative overflow-hidden">
              {/* Subtle decorative corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--color-accent)]/10 to-transparent rounded-bl-full"></div>
              
              <div className="relative z-10">
                {/* Refresh Button */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-[var(--color-primary)]/70 hover:text-[var(--color-primary)] transition-colors duration-200 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    <span>{t('pages.menu.refresh')}</span>
                  </button>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)]"></div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center py-16 text-red-600">
                    <AlertCircle className="w-6 h-6 mr-2" />
                    <span>{error}</span>
                  </div>
                ) : imageUrl ? (
                  <div className="text-center">
                    <div className="relative group cursor-pointer" onClick={openModal}>
                      <img
                        src={imageUrl}
                        alt="Denní menu"
                        className="w-full max-w-2xl mx-auto rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-2xl flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                          <ZoomIn className="w-6 h-6 text-[var(--color-primary)]" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-[var(--color-accent)]" />
                    </div>
                    <p className="text-lg text-[var(--color-primary)]/70">
                      {t('pages.menu.notUploaded')}
                    </p>
                  </div>
                )}
              
                {/* Allergens Note */}
                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                  <p className="text-base text-[var(--color-primary)]/70">
                    {t('pages.menu.allergensNote')}{' '}
                    <button
                      onClick={openAllergensModal}
                      className="text-[var(--color-accent)] font-semibold hover:text-[#B8954F] transition-colors duration-200 underline hover:no-underline"
                    >
                      {t('pages.menu.allergensLink')}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {isModalOpen && imageUrl && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
          onClick={closeModal}
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden'
          }}
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 z-[10000] p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors duration-200 backdrop-blur-sm"
            aria-label="Zavřít"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Modal content */}
          <div 
            className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageUrl}
              alt="Denní menu"
              className="max-w-full max-h-full object-contain transition-transform duration-300 cursor-grab active:cursor-grabbing select-none"
              style={{
                transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
                transformOrigin: 'center center'
              }}
              onDoubleClick={handleDoubleClick}
              onTouchStart={handleTouchStart}
              onWheel={handleWheel}
              draggable={false}
            />
          </div>

          {/* Click outside to close */}
        </div>
      )}

      {/* Allergens Modal */}
      {isAllergensModalOpen && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
          onClick={closeAllergensModal}
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden'
          }}
        >
          {/* Close button */}
          <button
            onClick={closeAllergensModal}
            className="absolute top-6 right-6 z-[10000] p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors duration-200 backdrop-blur-sm"
            aria-label="Zavřít"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Modal content */}
          <div 
            className="relative w-full h-full max-w-4xl max-h-[90vh] flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src="/seznamalergenu.jpg"
              alt="Seznam alergenů"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;