import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Cookie, Settings, X } from 'lucide-react';
import { getConsent, setConsent, isDoNotTrackEnabled, whenConsented, initializeGA4, initializeMetaPixel } from '../utils/cookieConsent';
import CookiePreferencesModal from './CookiePreferencesModal';

const CookieConsent = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Event listener pro otevření preferencí z footeru - VŽDY aktivní
  useEffect(() => {
    console.log('Setting up cookie preferences event listener');
    const handleOpenPreferences = () => {
      console.log('Opening cookie preferences from footer');
      setIsPreferencesOpen(true);
    };

    window.addEventListener('open-cookie-preferences', handleOpenPreferences);
    
    return () => {
      console.log('Removing cookie preferences event listener');
      window.removeEventListener('open-cookie-preferences', handleOpenPreferences);
    };
  }, []); // Tento effect běží vždy, nezávisle na isVisible

  useEffect(() => {
    // Kontrola, zda už existuje souhlas
    const existingConsent = getConsent();
    
    if (!existingConsent) {
      // Zobraz lištu po krátkém zpoždění pro lepší UX
      setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    } else {
      // Pokud už je souhlas, inicializuj povolené služby
      initializeAllowedServices(existingConsent.granted);
    }
  }, []);

  const initializeAllowedServices = (granted: { analytics: boolean; marketing: boolean }) => {
    // Inicializace Google Analytics
    if (granted.analytics) {
      whenConsented('analytics', initializeGA4);
    }
    
    // Inicializace Meta Pixel
    if (granted.marketing) {
      whenConsented('marketing', initializeMetaPixel);
    }
  };

  const handleAcceptAll = () => {
    setIsAnimating(true);
    
    const consent = setConsent({
      status: 'accepted',
      granted: {
        analytics: true,
        marketing: true
      }
    });
    
    // Inicializuj všechny služby
    initializeAllowedServices(consent.granted);
    
    // Zavři lištu s animací
    setTimeout(() => {
      setIsVisible(false);
      setIsAnimating(false);
    }, 300);
  };

  const handleRejectAll = () => {
    setIsAnimating(true);
    
    setConsent({
      status: 'rejected',
      granted: {
        analytics: false,
        marketing: false
      }
    });
    
    // Zavři lištu s animací
    setTimeout(() => {
      setIsVisible(false);
      setIsAnimating(false);
    }, 300);
  };

  const handleOpenPreferences = () => {
    setIsPreferencesOpen(true);
  };

  const handlePreferencesSaved = (preferences: { analytics: boolean; marketing: boolean }) => {
    setIsAnimating(true);
    
    const consent = setConsent({
      status: 'custom',
      granted: preferences
    });
    
    // Inicializuj povolené služby
    initializeAllowedServices(consent.granted);
    
    setIsPreferencesOpen(false);
    
    // Zavři lištu s animací
    setTimeout(() => {
      setIsVisible(false);
      setIsAnimating(false);
    }, 300);
  };

  const handlePreferencesCancel = () => {
    setIsPreferencesOpen(false);
  };

  return (
    <>
      {/* Preferences Modal - VŽDY renderovaný, nezávisle na cookie lište */}
      <CookiePreferencesModal
        isOpen={isPreferencesOpen}
        onSave={handlePreferencesSaved}
        onCancel={handlePreferencesCancel}
      />
      
      {/* Cookie Consent Bar - pouze když je viditelný */}
      {isVisible && (
        <div
          className={`fixed bottom-0 inset-x-0 z-[9999] bg-[#2A1F15] text-white shadow-2xl border-t border-white/10 transform transition-all duration-300 ease-out ${
            isVisible && !isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}
          role="banner"
          aria-label="Cookie consent"
        >
          <div className="max-w-6xl mx-auto px-4 py-4 lg:py-3">
            {/* Desktop Layout */}
            <div className="hidden lg:flex items-center justify-between gap-6">
              {/* Icon + Text */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 bg-[var(--color-accent)]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Cookie className="w-5 h-5 text-[var(--color-accent)]" />
                </div>
                <p className="text-sm text-white/90 leading-relaxed">
                  {t('cookies.banner.text')}
                </p>
              </div>
              
              {/* Buttons */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={handleOpenPreferences}
                  className="text-white/80 hover:text-white text-sm underline underline-offset-4 hover:no-underline transition-colors duration-200 px-2 py-1"
                >
                  {t('cookies.banner.settings')}
                </button>
                
                <button
                  onClick={handleRejectAll}
                  disabled={isAnimating}
                  className="bg-white/10 hover:bg-white/15 text-white rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  {t('cookies.banner.rejectAll')}
                </button>
                
                <button
                  onClick={handleAcceptAll}
                  disabled={isAnimating}
                  className="bg-[var(--color-accent)] hover:opacity-90 text-white rounded-full px-6 py-2 text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {t('cookies.banner.acceptAll')}
                </button>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden space-y-4">
              {/* Icon + Text */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[var(--color-accent)]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Cookie className="w-4 h-4 text-[var(--color-accent)]" />
                </div>
                <p className="text-sm text-white/90 leading-relaxed flex-1">
                  {t('cookies.banner.text')}
                </p>
              </div>
              
              {/* Buttons */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={handleRejectAll}
                    disabled={isAnimating}
                    className="flex-1 bg-white/10 hover:bg-white/15 text-white rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-200 disabled:opacity-50"
                  >
                    {t('cookies.banner.rejectAll')}
                  </button>
                  
                  <button
                    onClick={handleAcceptAll}
                    disabled={isAnimating}
                    className="flex-1 bg-[var(--color-accent)] hover:opacity-90 text-white rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 shadow-lg disabled:opacity-50"
                  >
                    {t('cookies.banner.acceptAll')}
                  </button>
                </div>
                
                <button
                  onClick={handleOpenPreferences}
                  className="text-white/80 hover:text-white text-sm underline underline-offset-4 hover:no-underline transition-colors duration-200 text-center py-1"
                >
                  {t('cookies.banner.settings')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;