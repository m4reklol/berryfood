import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Cookie, BarChart3, Target, Shield } from 'lucide-react';
import { getConsent, isDoNotTrackEnabled } from '../utils/cookieConsent';

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onSave: (preferences: { analytics: boolean; marketing: boolean }) => void;
  onCancel: () => void;
}

const CookiePreferencesModal: React.FC<CookiePreferencesModalProps> = ({
  isOpen,
  onSave,
  onCancel
}) => {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Store the element that triggered the modal
  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);

  // Načti aktuální nastavení při otevření
  useEffect(() => {
    if (isOpen) {
      const consent = getConsent();
      const doNotTrack = isDoNotTrackEnabled();
      
      if (consent) {
        setAnalytics(consent.granted.analytics);
        setMarketing(consent.granted.marketing);
      } else {
        // Pokud je Do Not Track, defaultně vše vypni
        setAnalytics(!doNotTrack);
        setMarketing(!doNotTrack);
      }
    }
  }, [isOpen]);

  // Focus management a body scroll lock
  useEffect(() => {
    if (isOpen) {
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      
      // Focus první focusable element
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 100);

      // ESC key handler
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleCancel();
        }
      };

      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  const handleSave = () => {
    onSave({ analytics, marketing });
  };

  const handleCancel = () => {
    onCancel();
    
    // Return focus to trigger element
    setTimeout(() => {
      triggerElementRef.current?.focus();
    }, 100);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  if (!isOpen) return null;

  const categories = [
    {
      id: 'essential',
      title: t('cookies.preferences.categories.essential.title'),
      description: t('cookies.preferences.categories.essential.description'),
      icon: Shield,
      enabled: true,
      locked: true
    },
    {
      id: 'analytics',
      title: t('cookies.preferences.categories.analytics.title'),
      description: t('cookies.preferences.categories.analytics.description'),
      icon: BarChart3,
      enabled: analytics,
      locked: false
    },
    {
      id: 'marketing',
      title: t('cookies.preferences.categories.marketing.title'),
      description: t('cookies.preferences.categories.marketing.description'),
      icon: Target,
      enabled: marketing,
      locked: false
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-preferences-title"
    >
      {/* Modal Container */}
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[var(--color-primary)] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--color-accent)]/20 rounded-full flex items-center justify-center">
              <Cookie className="w-4 h-4 text-[var(--color-accent)]" />
            </div>
            <h2 id="cookie-preferences-title" className="text-lg font-bold">
              {t('cookies.preferences.title')}
            </h2>
          </div>
          
          <button
            ref={firstFocusableRef}
            onClick={handleCancel}
            className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-primary)]"
            aria-label="Zavřít nastavení"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
          <div className="mb-6">
            <p className="text-[var(--color-text)]/80 leading-relaxed">
              {t('cookies.preferences.description')}
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isChecked = category.id === 'essential' ? true : 
                               category.id === 'analytics' ? analytics : marketing;
              
              return (
                <div
                  key={category.id}
                  className={`border-2 rounded-xl p-4 transition-all duration-200 ${
                    isChecked 
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isChecked 
                        ? 'bg-[var(--color-accent)]/20' 
                        : 'bg-gray-200'
                    }`}>
                      <IconComponent className={`w-5 h-5 ${
                        isChecked 
                          ? 'text-[var(--color-accent)]' 
                          : 'text-gray-500'
                      }`} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-[var(--color-primary)]">
                          {category.title}
                        </h3>
                        
                        {/* Toggle Switch */}
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={category.locked}
                            onChange={(e) => {
                              if (category.id === 'analytics') {
                                setAnalytics(e.target.checked);
                              } else if (category.id === 'marketing') {
                                setMarketing(e.target.checked);
                              }
                            }}
                            className="sr-only"
                          />
                          <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                            isChecked 
                              ? 'bg-[var(--color-accent)]' 
                              : 'bg-gray-300'
                          } ${category.locked ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                              isChecked ? 'translate-x-5' : 'translate-x-0.5'
                            } mt-0.5`}></div>
                          </div>
                        </label>
                      </div>
                      
                      <p className="text-sm text-[var(--color-text)]/70 leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Do Not Track Notice */}
          {isDoNotTrackEnabled() && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-700">
                <strong>Do Not Track:</strong> {t('cookies.preferences.doNotTrack')}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={handleCancel}
            className="px-6 py-2 text-[var(--color-primary)] hover:bg-gray-100 rounded-full transition-colors duration-200 font-medium"
          >
            {t('cookies.preferences.cancel')}
          </button>
          
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-[var(--color-accent)] hover:opacity-90 text-white rounded-full transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
          >
            {t('cookies.preferences.save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookiePreferencesModal;