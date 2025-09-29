import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LanguageSwitcherProps {
  isScrolled?: boolean;
  isMobile?: boolean;
  onDropdownToggle?: (isOpen: boolean) => void;
  forceClose?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  isScrolled = false,
  isMobile = false,
  onDropdownToggle,
  forceClose = false,
}) => {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang =
    availableLanguages.find((lang) => lang.code === currentLanguage) ||
    availableLanguages[0];

  const getFlagImage = (langCode: string) => {
    switch (langCode) {
      case 'cs': return '/flagczech.png';
      case 'en': return '/flagenglish.png';
      default:   return '/flagczech.png';
    }
  };

  const toggleDropdown = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    const next = !isOpen;
    setIsOpen(next);
    onDropdownToggle?.(next);
  };

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode);
    setIsOpen(false);
    onDropdownToggle?.(false);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    if (closeTimeout) clearTimeout(closeTimeout);
    const t = setTimeout(() => {
      setIsOpen(false);
      setCloseTimeout(null);
    }, 150);
    setCloseTimeout(t);
  };

  const handleMouseEnter = () => {
    if (isMobile) return;
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleDropdown();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // outside click
  useEffect(() => {
    const onDocClick = (ev: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(ev.target as Node)) {
        setIsOpen(false);
        onDropdownToggle?.(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isOpen, onDropdownToggle]);

  // force close from parent
  useEffect(() => {
    if (forceClose && isOpen) setIsOpen(false);
  }, [forceClose, isOpen]);

  /* ---------- Mobile (ikonky) ---------- */
  if (isMobile) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          onKeyDown={handleKeyDown}
          className="flex items-center justify-center space-x-1 p-2 rounded-full bg-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label="Změnit jazyk"
        >
          <img
            src={getFlagImage(currentLanguage)}
            alt={currentLang.name}
            className="w-4 h-4 rounded-full object-cover"
          />
          <ChevronDown
            className={`w-3 h-3 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        <div
          className={`absolute top-full left-0 mt-1 z-[9999] bg-white/95 backdrop-blur-sm rounded-xl shadow-xl py-1 transition duration-150 ${
            isOpen ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-95'
          }`}
          style={{ width: 40, transformOrigin: 'top left' }}
        >
          {availableLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`flex items-center justify-center w-full p-2 transition-colors duration-200 ${
                currentLanguage === language.code ? 'bg-[var(--color-accent)]/10' : 'hover:bg-gray-100'
              }`}
            >
              <img
                src={getFlagImage(language.code)}
                alt={language.name}
                className="w-4 h-4 rounded-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ---------- Desktop (vlajka + text) ---------- */
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        className={`flex items-center space-x-2 font-medium text-sm tracking-wider uppercase transition-all duration-200 relative py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] ${
          isScrolled
            ? 'text-[var(--color-primary)]/80 hover:text-[var(--color-primary)]'
            : 'text-white/90 hover:text-white'
        } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[var(--color-accent)] after:transition-all after:duration-300 ${
          isOpen ? 'after:w-full' : 'after:w-0 hover:after:w-full'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Změnit jazyk"
      >
        <img
          src={getFlagImage(currentLanguage)}
          alt={currentLang.name}
          className="w-5 h-5 rounded-full object-cover"
        />
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-0 w-56 bg-[#F5F1EB]/95 backdrop-blur-sm rounded-b-2xl shadow-2xl py-3 overflow-hidden z-[9999] lang-dropdown-enter will-change-transform"
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          style={{ transformOrigin: 'top right' }}
        >
          {availableLanguages.map((language, index) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`block px-6 py-4 text-xs font-semibold transition-all duration-300 tracking-widest uppercase border-l-4 border-transparent relative group whitespace-nowrap w-full text-left lang-dropdown-item-${
                Math.min(index + 1, 4)
              } ${
                currentLanguage === language.code
                  ? 'text-[var(--color-accent)] border-[var(--color-accent)] bg-[var(--color-accent)]/10'
                  : 'text-[var(--color-primary)]/90 hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-primary)] hover:pl-8 hover:border-[var(--color-accent)]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={getFlagImage(language.code)}
                  alt={language.name}
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span className="relative z-10">{language.name}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
