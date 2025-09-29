import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChefHat, Utensils, Truck, ArrowRight, X } from 'lucide-react';

const Hero = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [showBistroCards, setShowBistroCards] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  React.useEffect(() => {
    // Smooth animation sequence
    const timers = [
      setTimeout(() => setAnimationPhase(1), 200),   // Header (faster)
      setTimeout(() => setAnimationPhase(2), 900),   // Quote (faster)
      setTimeout(() => setAnimationPhase(3), 1300),  // Accent (faster)
      setTimeout(() => setAnimationPhase(4), 1800),  // Cards/Buttons (faster)
      setTimeout(() => setAnimationPhase(5), 3200),  // Scroll indicator (faster)
    ];

    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      timers.forEach(clearTimeout);
    };
  }, []);

  const optionCards = [
    {
      title: t('hero.cards.catering.title'),
      icon: ChefHat,
      image: '/herocard1.webp',
      link: '/catering',
      delay: 0
    },
    {
      title: t('hero.cards.rozvoz.title'),
      icon: Truck,
      image: '/herocard2.webp',
      link: '/rozvoz',
      delay: 300
    },
    {
      title: t('hero.cards.bistra.title'),
      icon: Utensils,
      image: '/herocard3.webp',
      link: '/bistra',
      delay: 600
    }
  ];

  const bistroCards = [
    {
      title: t('hero.cards.bistra.title'),
      icon: Utensils,
      image: '/herocard3.webp',
      link: '/bistra',
      delay: 0,
      isBack: true
    },
    {
      title: t('hero.cards.budex.title'),
      icon: Utensils,
      image: '/budexhero.webp',
      link: '/bistra/budex',
      delay: 300
    },
    {
      title: t('hero.cards.plynarna.title'),
      icon: Utensils,
      image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1920',
      link: '/bistra/plynarna',
      delay: 600
    }
  ];

  const mobileOptions = [
    {
      title: t('hero.cards.catering.title'),
      icon: ChefHat,
      link: '/catering',
      description: t('hero.cards.catering.description')
    },
    {
      title: t('hero.cards.rozvoz.title'),
      icon: Truck,
      link: '/rozvoz',
      description: t('hero.cards.rozvoz.description')
    },
    {
      title: t('hero.cards.bistra.title'),
      icon: Utensils,
      link: '#',
      description: t('hero.cards.bistra.description')
    }
  ];

  const mobileBistroOptions = [
    {
      title: t('hero.cards.bistra.title'),
      icon: Utensils,
      link: '#',
      description: t('hero.cards.bistra.description'),
      isBack: true
    },
    {
      title: t('hero.cards.budex.title'),
      icon: Utensils,
      link: '/bistra/budex',
      description: t('hero.cards.budex.description')
    },
    {
      title: t('hero.cards.plynarna.title'),
      icon: Utensils,
      link: '/bistra/plynarna',
      description: t('hero.cards.plynarna.description')
    }
  ];

  const handleBistroClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAnimating) return;
    setIsAnimating(true);
    setShowBistroCards(true);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAnimating) return;
    setIsAnimating(true);
    setShowBistroCards(false);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleHeroClick = (e: React.MouseEvent) => {
    // Close when clicking outside cards
    if (showBistroCards && !isAnimating) {
      const target = e.target as HTMLElement;
      const isCardClick = target.closest('.hero-card') !== null;
      if (!isCardClick) handleBackClick(e);
    }
  };

  const handleCardClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    if (!isAnimating) action();
  };

  const handleMobileCardClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    if (!isAnimating) action();
  };

  // Helper function to check if a card is the bistro toggle card
  const isBistroToggleCard = (title: string) => {
    const upperTitle = title.toUpperCase();
    return upperTitle === 'BISTRA' || upperTitle === 'BISTROS';
  };

  // Helper function to check if a card is a back card
  const isBackCard = (card: any) => {
    return 'isBack' in card && card.isBack;
  };

  // Helper function to determine close state
  const getCloseState = (title: string, isBack: boolean) => {
    return isBack || (isBistroToggleCard(title) && showBistroCards);
  };
  return (
    <section className="relative min-h-screen flex flex-col" onClick={handleHeroClick}>
      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slideOutRight { from { opacity:1; transform:translateX(0);} to { opacity:0; transform:translateX(100px);} }
        @keyframes slideOutLeft  { from { opacity:1; transform:translateX(0);} to { opacity:0; transform:translateX(-100px);} }
        @keyframes slideLeft     { from { opacity:1; transform:translateX(0);} to { opacity:1; transform:translateX(-4px);} }
        @keyframes slideInFromRight { from { opacity:0; transform:translateX(4px);} to { opacity:1; transform:translateX(0);} }
        @keyframes slideInFromLeft  { from { opacity:0; transform:translateX(-4px);} to { opacity:1; transform:translateX(0);} }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="/herobgtemp.webp"
          alt="Berry Food kitchen"
          className="w-full h-full object-cover object-center"
          loading="eager"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1920';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 z-1" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col min-h-screen justify-center px-4 sm:px-6 lg:px-8">
        {/* Quote */}
        <div className="flex items-center justify-center pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-10 lg:pb-12">
          <div className="max-w-6xl mx-auto text-center">
            <h1
              className={`text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-semibold text-white mb-3 xs:mb-4 sm:mb-6 drop-shadow-2xl leading-tight transform transition-all duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                animationPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
            >
              <span className="block text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">{t('hero.title')}</span>
              <span
                className={`text-[var(--color-accent)] drop-shadow-lg block text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl transform transition-all duration-[1900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                {t('hero.subtitle')}
              </span>
            </h1>
          </div>
        </div>

        {/* Desktop & Tablet Cards */}
        <div className="hidden sm:block pb-12 sm:pb-16 lg:pb-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {(showBistroCards ? bistroCards : optionCards).map((card, index) => {
                const IconComponent = card.icon;
                const cardIsBack = isBackCard(card);
                const isCloseState = getCloseState(card.title, cardIsBack);

                // unified "close" state (show red X)
                // Animations
                let animationClass = '';
                if (isAnimating) {
                  if (showBistroCards) {
                    if (card.title.toUpperCase() === 'CATERING') animationClass = 'animate-[slideOutLeft_0.3s_ease-out_forwards]';
                    else if (card.title.toUpperCase() === 'ROZVOZ') animationClass = 'animate-[slideOutRight_0.3s_ease-out_forwards]';
                    else if (card.title.toUpperCase() === 'BISTRA') animationClass = 'animate-[slideLeft_0.3s_ease-out_forwards]';
                    else if (card.title.toUpperCase().includes('BUDEX')) animationClass = 'animate-[slideInFromLeft_0.4s_ease-out_0.2s_both]';
                    else if (card.title.toUpperCase().includes('PLYNÁRNA')) animationClass = 'animate-[slideInFromRight_0.4s_ease-out_0.25s_both]';
                  } else {
                    if (card.title.toUpperCase() === 'CATERING') animationClass = 'animate-[slideInFromLeft_0.5s_ease-out_0.2s_both]';
                    else if (card.title.toUpperCase() === 'ROZVOZ') animationClass = 'animate-[slideInFromRight_0.5s_ease-out_0.3s_both]';
                    else if (card.title.toUpperCase() === 'BISTRA') animationClass = 'animate-[slideLeft_0.3s_ease-out_reverse_forwards]';
                  }
                }

                return (
                  <div
                    key={index}
                    className={`hero-card group block focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 rounded-xl transform transition-all duration-700 ease-out no-underline hover:no-underline cursor-pointer ${
                      animationPhase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                    } ${isAnimating ? 'pointer-events-none' : ''} ${animationClass}`}
                    style={{
                      transitionDelay: animationPhase >= 4 ? `${Math.round((card as any).delay * 0.8)}ms` : '0ms',
                    }}
                    onClick={(e) =>
                      handleCardClick(
                        e,
                        isBistroToggleCard(card.title) && !showBistroCards ? () => handleBistroClick(e) : cardIsBack ? () => handleBackClick(e) : () => {}
                      )
                    }
                  >
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-200 border border-white/20 h-full relative">
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
                          loading="eager"
                          style={{ imageRendering: 'auto' }}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 ease-out" />

                        {/* Floating icon (top-right) */}
                        <div
                          className={`absolute top-2 right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:scale-105 transition-transform duration-300 ease-out ${
                            isCloseState ? 'bg-red-500' : 'bg-white/90'
                          }`}
                        >
                          {isCloseState ? (
                            <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          ) : (
                            <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--color-primary)]" />
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-2 sm:p-3 flex items-center justify-between">
                        <h3
                          className={`text-xs sm:text-sm font-bold tracking-wide transition-colors duration-300 ease-out no-underline ${
                            isCloseState ? 'text-red-600' : 'text-[var(--color-primary)]'
                          } group-hover:text-[var(--color-accent)]`}
                        >
                          {card.title}
                        </h3>

                        {/* Right indicator */}
                        <div
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all duration-300 ease-out flex-shrink-0 ${
                            isCloseState ? 'bg-red-500' : 'bg-[var(--color-accent)]/10 group-hover:bg-[var(--color-accent)]'
                          }`}
                        >
                          {isCloseState ? (
                            <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                          ) : (
                            <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[var(--color-accent)] group-hover:text-white group-hover:translate-x-0.5" />
                          )}
                        </div>
                      </div>

                      {/* Link overlay for standard cards (not back / not BISTRA while open) */}
                      {!isCloseState && !isBistroToggleCard(card.title) && <Link to={card.link} className="absolute inset-0 z-10" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile list */}
        <div className="sm:hidden pb-8 xs:pb-10">
          <div className="max-w-[240px] xs:max-w-[260px] mx-auto space-y-3 px-3 xs:px-4">
            {(showBistroCards ? mobileBistroOptions : mobileOptions).map((option, index) => {
              const IconComponent = option.icon;
              const optionIsBack = isBackCard(option);
              const isCloseState = getCloseState(option.title, optionIsBack);


              let mobileAnimationClass = '';
              if (isAnimating) {
                if (showBistroCards) {
                  if (option.title.toUpperCase() === 'CATERING') mobileAnimationClass = 'animate-[slideOutLeft_0.3s_ease-out_forwards]';
                  else if (option.title.toUpperCase() === 'ROZVOZ') mobileAnimationClass = 'animate-[slideOutRight_0.3s_ease-out_forwards]';
                  else if (option.title.toUpperCase() === 'BISTRA') mobileAnimationClass = 'animate-[slideLeft_0.3s_ease-out_forwards]';
                  else if (option.title.toUpperCase().includes('BUDEX')) mobileAnimationClass = 'animate-[slideInFromLeft_0.4s_ease-out_0.2s_both]';
                  else if (option.title.toUpperCase().includes('PLYNÁRNA')) mobileAnimationClass = 'animate-[slideInFromRight_0.4s_ease-out_0.25s_both]';
                } else {
                  if (option.title.toUpperCase() === 'CATERING') mobileAnimationClass = 'animate-[slideInFromLeft_0.5s_ease-out_0.2s_both]';
                  else if (option.title.toUpperCase() === 'ROZVOZ') mobileAnimationClass = 'animate-[slideInFromRight_0.5s_ease-out_0.3s_both]';
                  else if (option.title.toUpperCase() === 'BISTRA') mobileAnimationClass = 'animate-[slideLeft_0.3s_ease-out_reverse_forwards]';
                }
              }

              return (
                <div
                  key={index}
                  className={`hero-card block w-full transform transition-all duration-700 ease-out cursor-pointer ${
                    animationPhase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                  } ${isAnimating ? 'pointer-events-none' : ''} ${mobileAnimationClass}`}
                  style={{
                    transitionDelay: animationPhase >= 4 ? `${Math.round(((option as any).delay || index * 300) * 0.8)}ms` : '0ms',
                  }}
                  onClick={(e) =>
                    handleMobileCardClick(
                      e,
                      isBistroToggleCard(option.title) && !showBistroCards ? () => handleBistroClick(e) : optionIsBack ? () => handleBackClick(e) : () => {}
                    )
                  }
                >
                  <div className="flex items-center space-x-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 min-h-[80px]">
                    {/* Icon */}
                    <div
                      className={`w-7 xs:w-8 h-7 xs:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCloseState ? 'bg-red-500/10' : 'bg-[var(--color-accent)]/10'
                      }`}
                    >
                      {isCloseState ? (
                        <X className="w-3.5 xs:w-4 h-3.5 xs:h-4 text-red-500" />
                      ) : (
                        <IconComponent className="w-3.5 xs:w-4 h-3.5 xs:h-4 text-[var(--color-accent)]" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-center">
                      <h3
                        className={`text-xs xs:text-sm font-bold mb-0.5 uppercase ${
                          isCloseState ? 'text-red-600' : 'text-[var(--color-primary)]'
                        }`}
                      >
                        {option.title}
                      </h3>
                      <p className="text-xs text-[var(--color-primary)]/70 leading-snug line-clamp-2">{option.description}</p>
                    </div>

                    {/* Arrow / X */}
                    <div
                      className={`w-5 xs:w-6 h-5 xs:h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCloseState ? 'bg-red-500/10' : 'bg-[var(--color-accent)]/10'
                      }`}
                    >
                      {isCloseState ? (
                        <X className="w-2.5 xs:w-3 h-2.5 xs:h-3 text-red-500" />
                      ) : (
                        <ArrowRight className="w-2.5 xs:w-3 h-2.5 xs:h-3 text-[var(--color-accent)]" />
                      )}
                    </div>
                  </div>

                  {/* Link overlay (only for non-close state and not the toggle card) */}
                  {!isCloseState && option.title.toUpperCase() !== 'BISTRA' && <Link to={option.link} className="absolute inset-0 z-10" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className={`absolute bottom-3 xs:bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 z-30 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled ? 'opacity-0 pointer-events-none translate-y-4' : animationPhase >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="w-4 h-6 xs:w-5 xs:h-8 sm:w-6 sm:h-10 border-2 border-white/70 rounded-full flex justify-center backdrop-blur-sm shadow-lg animate-bounce">
          <div className="w-0.5 xs:w-1 h-2 xs:h-3 bg-white/70 rounded-full mt-1.5 xs:mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
